"use strict";
/**
 * The turn model of an AI Dungeon adventure, plus a scripted story model
 *
 * A Session drives one or more Adventures in lockstep through the same script, which is
 * what makes an upstream-versus-Chronicle comparison meaningful: both see the same player
 * actions, the same assembled context, and the same model output, turn for turn.
 *
 * The story model is not a canned string list. It reads the assembled context, works out
 * which task Chronicle asked for, and answers in that task's format, so the parser under
 * test is fed what a compliant model would really send. Every generation carries a unique
 * id inside its thought, which is how the acceptance tests can tell whether the brain kept
 * the generation the player accepted or one they threw away.
 */

// Padding so the assembled context clears the 20000 char mark where Chronicle switches
// from the simple assign prompt to the full choice prompt (assign / rename / delete)
const LORE = ((() => {
    const paragraph = [
        "The riverworks district of Ansgar keeps its own hours, and the tide clocks along",
        "Fenwater Row are wound by hand each dawn. Guild charters hang in the counting",
        "houses, countersigned in three inks, and no barge moves upriver without a stamped",
        "manifest. The old wall still divides the wharves from the terraces above, though",
        "the gates have not been closed in living memory.\n"
    ].join(" ");
    let out = "";
    while (out.length < 19000) {
        out += paragraph;
    }
    return out;
})());

const AGENTS = ["Leah", "Silas", "Maren"];

const KEY_POOL = [
    "courier_debt", "wall_gate_plan", "maren_trust", "silas_grudge", "tide_clock_note",
    "guild_secret", "ledger_error", "night_watch", "river_route", "counting_house"
];

/**
 * Assembles the context the platform would hand to the context hook
 * @param {Object} adventure
 * @returns {string}
 */
function buildContext(adventure) {
    const recent = adventure.history.slice(-40).map(a => a.text).join("");
    return `Memories:\nThe player character is Iris, a factor for the river guild.\n\nWorld Lore:\n${LORE}\nRecent Story:\n${recent}`;
}

/**
 * What the model actually receives
 *
 * With Optimized Context enabled the platform may discard whatever the context hook
 * returns, so readOnlyContext replays the assembled context untouched. state.memory
 * frontMemory still reaches the model, which is the channel Module M falls back to
 * @param {Object} adventure
 * @param {string} assembled - What the harness built
 * @param {string} returned - What the context hook gave back
 * @returns {string}
 */
function modelSees(adventure, assembled, returned) {
    const memory = (adventure.state && adventure.state.memory) || {};
    const front = (typeof memory.frontMemory === "string") ? memory.frontMemory : "";
    const note = (typeof memory.authorsNote === "string") ? memory.authorsNote : "";
    const base = adventure.readOnlyContext ? assembled : returned;
    return [base, note, front].filter(part => (part !== "")).join("\n");
}

/**
 * Works out which task, if any, the context is asking the model to perform
 * @param {string} context
 * @returns {string} "choice" | "forget" | "assign" | "none"
 */
function taskOf(context) {
    // Module M asks for the simplest thing any model could answer
    if (context.includes("Begin your reply with exactly (ok)")) {
        return "canary";
    }
    // The module tasks take the thought slot, so they are checked first
    if (context.includes("(audit = ")) {
        return "audit";
    }
    if (context.includes("(compress = ")) {
        return "compress";
    }
    if (context.includes("three possible valid forms") || context.includes("or (new_key = old_key)")) {
        return "choice";
    }
    if (context.includes("(delete key_name_to_forget)") || context.includes("(delete key_name)")) {
        return "forget";
    }
    // The second form is Module N's lean register, which asks for the same grammar in one line
    if (context.includes("(any_key_name = ") || context.includes("(key_name = ")) {
        return "assign";
    }
    return "none";
}

/**
 * Which agent's brain was injected into this context, if any
 * @param {string} context
 * @returns {string}
 */
function agentOf(context) {
    const match = context.match(/# ([^\n]+?)'s? brain and inner self:/)
        // Module N renders the same block without its framing
        || context.match(/(?:^|\n)([A-Z][a-z]+)'s? mind:/);
    return match ? match[1] : "";
}

/**
 * The brain keys visible in the context block
 * @param {string} context
 * @returns {string[]}
 */
function keysOf(context) {
    const start = context.indexOf("brain and inner self: [");
    if (start === -1) {
        // Module N's lean block: bare "[3] key: thought" lines under a "X mind:" header
        const lean = context.match(/(?:^|\n)[A-Z][a-z]+'s? mind:\n([\s\S]*?)\n\n/);
        return lean
            ? [...lean[1].matchAll(/(?:^|\n)(?:\[[\d*]+\] )?([a-z0-9_]+): /g)].map(m => m[1])
            : [];
    }
    const end = context.indexOf("\n]", start);
    const block = context.slice(start, (end === -1) ? context.length : end);
    const keys = [];
    for (const match of block.matchAll(/\(([a-z0-9_]+): `/g)) {
        keys.push(match[1]);
    }
    return keys;
}

class Session {
    /**
     * @param {Object[]} adventures - Driven in lockstep
     * @param {Object} [options]
     * @param {number} [options.seed] - Seed for the story model's own choices
     */
    constructor(adventures, { seed = 7 } = {}) {
        this.adventures = adventures;
        this.generation = 0;
        this.steps = [];
        // Generations a test has queued up, used ahead of the scripted model
        this.forced = [];
        // How often this model fails to answer in the requested format, 0 to 1
        this.sloppy = 0;
        let s = (seed >>> 0) || 1;
        // The story model gets its own generator, separate from the sandboxes'
        this.rand = () => {
            s ^= (s << 13); s >>>= 0;
            s ^= (s >>> 17);
            s ^= (s << 5); s >>>= 0;
            return s / 4294967296;
        };
    }

    /**
     * Produces one model generation for the given context
     * @param {string} context
     * @returns {Object} { text, gen, task, agent, key, thought }
     */
    generate(context) {
        const gen = ++this.generation;
        if (0 < this.forced.length) {
            // A test wants this exact generation, whatever the context asked for
            const text = this.forced.shift();
            return {
                text, gen, task: "forced", agent: agentOf(context), key: null,
                thought: (text.match(/`([^`]+)`/) || [])[1] || null
            };
        }
        const task = taskOf(context);
        const agent = agentOf(context);
        if ((task !== "none") && (0 < this.sloppy) && (this.rand() < this.sloppy)) {
            // Some models simply will not answer in the requested shape. Most of the time
            // they ignore it completely; sometimes they try and get the brackets wrong
            const prose = `Iris waits while ${agent || "someone"} says nothing useful at all.`;
            return (this.rand() < 0.3)
                ? { text: `(half_formed = \`a thought that never closes`, gen, task, agent, key: null, thought: null, sloppy: "malformed" }
                : { text: prose, gen, task, agent, key: null, thought: null, sloppy: "absent" };
        }
        const keys = keysOf(context);
        const prose = [
            `Iris follows ${AGENTS[gen % AGENTS.length]} along Fenwater Row.`,
            "The tide clock knocks twice and the barge crews look up from their ropes.",
            `${AGENTS[(gen + 1) % AGENTS.length]} counts the manifests again before speaking.`
        ].join(" ");
        const thought = `I will remember that the ${gen} manifest never reached the counting house.`;
        if (task === "none") {
            return { text: prose, gen, task, agent, key: null, thought: null };
        }
        if (task === "canary") {
            return { text: `(ok) ${prose}`, gen, task, agent, key: null, thought: null };
        }
        if (task === "audit") {
            // A compliant model reports, it does not repair
            const finding = ((gen % 2) === 0)
                ? "No contradictions found."
                : `The ledger says the manifest was paid, but Iris just paid it again in scene ${gen}.`;
            return { text: `(audit = \`${finding}\`) ${prose}`, gen, task, agent, key: "audit", thought: finding };
        }
        if (task === "compress") {
            const merged = `I remember the ${gen} manifests together now, as one long failure.`;
            return { text: `(compress = \`${merged}\`) ${prose}`, gen, task, agent, key: "compress", thought: merged };
        }
        if (task === "forget") {
            const key = keys.length ? keys[Math.floor(this.rand() * keys.length)] : "courier_debt";
            return { text: `(delete ${key}) ${prose}`, gen, task, agent, key, thought: null };
        }
        // A choice turn occasionally renames or deletes instead of writing, exactly as the
        // prompt allows, so both of those parser paths get exercised across a long session
        if ((task === "choice") && (keys.length > 1)) {
            const roll = this.rand();
            if (roll < 0.12) {
                const from = keys[Math.floor(this.rand() * keys.length)];
                const to = `${from}_v2`.slice(0, 40);
                return { text: `(${to} = ${from}) ${prose}`, gen, task, agent, key: to, thought: null, from };
            }
            if (roll < 0.2) {
                const key = keys[Math.floor(this.rand() * keys.length)];
                return { text: `(delete ${key}) ${prose}`, gen, task, agent, key, thought: null };
            }
        }
        const key = KEY_POOL[Math.floor(this.rand() * KEY_POOL.length)];
        return { text: `(${key} = \`${thought}\`) ${prose}`, gen, task, agent, key, thought };
    }

    /**
     * One full player turn: input hook, context hook, generation, output hook
     * @param {string} input - Raw player input ("" for a continue)
     * @param {string} type - Action type
     * @returns {Object} what every adventure did at every stage
     */
    play(input, type = "do") {
        const advs = this.adventures;
        const inputs = advs.map(a => a.hook("input", input));
        // Both versions have written everything they owe by now: Inner Self committed at the
        // end of last turn's output hook, Chronicle a moment ago in the input hook above
        const postInput = advs.map(a => ({
            brains: a.brains(),
            label: a.state.InnerSelf ? a.state.InnerSelf.label : null,
            ops: a.state.InnerSelf ? a.state.InnerSelf.ops : null
        }));
        advs.forEach((a, i) => {
            if (inputs[i] !== "") {
                a.push(inputs[i], (input === "") ? "continue" : type);
            }
        });
        const step = { kind: "play", type, input, inputs, postInput, ...this.render() };
        this.steps.push(step);
        return step;
    }

    /**
     * The context hook, the model, and the output hook
     * Used on its own by retry, which re-generates without a new player action
     * @returns {Object}
     */
    render() {
        const advs = this.adventures;
        const contextIn = advs.map(a => buildContext(a));
        const contextOut = advs.map((a, i) => a.hook("context", contextIn[i]));
        const generation = this.generate(modelSees(advs[0], contextIn[0], contextOut[0]));
        const outputs = advs.map(a => a.hook("output", generation.text));
        advs.forEach((a, i) => a.push(outputs[i], "continue"));
        return { contextIn, contextOut, generation, outputs };
    }

    /**
     * Queues an exact generation for the next render, ahead of the scripted model
     * @param {...string} texts
     * @returns {Session}
     */
    force(...texts) {
        this.forced.push(...texts);
        return this;
    }

    /**
     * Discards the last generation and produces another, as the retry button does
     * The input hook does not run again, which is exactly what made the original bug bite
     * @returns {Object}
     */
    retry() {
        this.adventures.forEach(a => a.pop(1));
        const step = { kind: "retry", ...this.render() };
        this.steps.push(step);
        return step;
    }

    /**
     * Erases the most recent actions without generating anything
     * @param {number} count
     * @returns {Object}
     */
    erase(count = 1) {
        const removed = this.adventures.map(a => a.pop(count));
        const step = { kind: "erase", count, removed: removed[0] };
        this.steps.push(step);
        return step;
    }
}

module.exports = { Session, buildContext, modelSees, taskOf, agentOf, keysOf, AGENTS, KEY_POOL, LORE };
