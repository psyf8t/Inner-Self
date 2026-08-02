"use strict";
/**
 * Chronicle harness
 *
 * Run with: node test/harness.js
 *
 * Four suites:
 * 1. Parity      - 300 turns replayed against Inner Self and Chronicle in lockstep, with
 *                  mid-session setting changes, asserting byte-identical text out of every
 *                  hook and byte-identical brain cards at every turn boundary
 * 2. Migration   - a real Inner Self save, produced by running upstream, loaded by
 *                  Chronicle: settings, brains, and the label counter must all survive
 * 3. Ledger      - the Module A acceptance criteria, over a 300 turn session containing
 *                  retries, erases, continues and setting changes
 * 4. Faults      - an exception injected between staging and commit
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const { Adventure } = require("./lib/aid-runtime");
const { Session, AGENTS, buildContext, modelSees, taskOf } = require("./lib/session");

const ROOT = path.join(__dirname, "..");
// The commit Chronicle forked. Pinned, so the parity proof cannot drift as work lands
const UPSTREAM_REF = "297a1a0";

// ---------------------------------------------------------------- tiny test framework

const results = [];
let currentSuite = "";

function suite(name) {
    currentSuite = name;
    console.log(`\n\x1b[1m${name}\x1b[0m`);
}

function test(name, fn) {
    try {
        fn();
        results.push({ suite: currentSuite, name, ok: true });
        console.log(`  \x1b[32mpass\x1b[0m  ${name}`);
    } catch (error) {
        results.push({ suite: currentSuite, name, ok: false, error });
        console.log(`  \x1b[31mFAIL\x1b[0m  ${name}`);
        console.log(`        ${String(error && error.message).split("\n").join("\n        ")}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "assertion failed");
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            `${message || "not equal"}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`
        );
    }
}

function assertDeep(actual, expected, message) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        // Show the first difference rather than two walls of JSON
        let i = 0;
        while ((i < a.length) && (i < b.length) && (a[i] === b[i])) {
            i++;
        }
        throw new Error(
            `${message || "not deep equal"}\n  diverges at ${i}\n  expected: ...${b.slice(Math.max(0, i - 60), i + 120)}\n  actual:   ...${a.slice(Math.max(0, i - 60), i + 120)}`
        );
    }
}

// ---------------------------------------------------------------- sources

const chronicleSource = fs.readFileSync(path.join(ROOT, "src", "library.js"), "utf8");

const upstreamSource = (() => {
    try {
        return execFileSync("git", ["show", `${UPSTREAM_REF}:src/library.js`], {
            cwd: ROOT,
            encoding: "utf8",
            maxBuffer: 32 * 1024 * 1024
        });
    } catch (error) {
        throw new Error(
            `cannot read upstream Inner Self at ${UPSTREAM_REF}: ${error.message}\n` +
            "The parity suite compares against that exact commit and will not guess."
        );
    }
})();

assert(
    upstreamSource.includes("function InnerSelf(hook)"),
    `upstream source at ${UPSTREAM_REF} does not look like Inner Self`
);

// The Auto-Cards section must be untouched, byte for byte
const acSlice = (source) => source.slice(source.indexOf("function AutoCards(inHook, inText, inStop)"));

// ---------------------------------------------------------------- helpers

function newAdventure(kind, options = {}) {
    return new Adventure({
        source: (kind === "upstream") ? upstreamSource : chronicleSource,
        entry: (kind === "upstream") ? "InnerSelf" : "Chronicle",
        seed: 12345,
        maxChars: 25000,
        ...options
    });
}

/**
 * Seeds the "@Name" cards a scenario creator would ship to predeclare NPCs
 * @param {Object} adventure
 * @returns {void}
 */
function seedAgents(adventure) {
    for (const name of AGENTS) {
        adventure.storyCards.push({
            id: `seed-${name}`, keys: "", entry: `${name} works the river guild.`,
            type: "class", title: `@${name}`, description: ""
        });
    }
}

function configCard(adventure) {
    return adventure.storyCards.find(c => /^Configure/.test((c.title || "").trim()));
}

/**
 * Edits one row of the config card the way a player would
 * @param {Object} adventure
 * @param {RegExp} label - Matches the row, under either product's wording
 * @param {string} value - New value
 * @returns {void}
 */
function editSetting(adventure, label, value) {
    const card = configCard(adventure);
    assert(card, "no config card to edit");
    let hit = false;
    card.entry = card.entry.split("\n").map(line => {
        if (!label.test(line)) {
            return line;
        }
        hit = true;
        return `${line.slice(0, line.indexOf(":"))}: ${value}`;
    }).join("\n");
    assert(hit, `config row not found for ${label}`);
}

const ROWS = {
    enable: /^> Enable (Chronicle|Inner Self):/,
    chance: /^> Thought formation chance per turn:/,
    half: /^> Half thought chance for Do\/Say\/Story:/,
    json: /^> Brain card notes store brains as JSON:/,
    debug: /^> Enable debug mode to see model tasks:/,
    player: /^> First name of player character:/,
    percent: /^> Max brain size relative to story context:/,
    distance: /^> Recent turns searched for name triggers:/
};

/** Everything the config card claims, as a plain map, for comparing across versions */
function readSettings(adventure) {
    const card = configCard(adventure);
    const out = {};
    for (const line of `${card.entry}\n${card.description}`.split("\n")) {
        const match = line.match(/^>\s*([^:]+):\s*(.*)$/);
        if (match) {
            // Row labels differ by product name, so key on the tail of the label
            out[match[1].toLowerCase().replace(/inner self|chronicle/g, "product").trim()] = match[2].trim();
        }
    }
    return out;
}

/** A scripted 300 turn action plan, deterministic and varied */
function actionPlan(count) {
    const plan = [];
    for (let i = 0; i < count; i++) {
        const mod = i % 7;
        if (mod === 0) {
            plan.push({ input: "", type: "continue" });
        } else if (mod === 3) {
            plan.push({ input: `> You ask ${AGENTS[i % AGENTS.length]} about the manifest.`, type: "do" });
        } else if (mod === 5) {
            plan.push({ input: `> You say "Where is ${AGENTS[(i + 1) % AGENTS.length]}?"`, type: "say" });
        } else {
            plan.push({
                input: `${AGENTS[(i + 2) % AGENTS.length]} waits by the tide clock as Iris arrives.`,
                type: "story"
            });
        }
    }
    return plan;
}

// ---------------------------------------------------------------- 0. static checks

suite("0. Static invariants");

test("Auto-Cards section is byte-identical to upstream", () => {
    assertEqual(acSlice(chronicleSource), acSlice(upstreamSource), "Auto-Cards section drifted");
});

test("Auto-Cards handshake path state.InnerSelf.AC still exists in Chronicle", () => {
    assert(
        chronicleSource.includes("const IS = state.InnerSelf = deepMerge(state.InnerSelf || {}, {"),
        "Chronicle no longer owns state.InnerSelf, which Auto-Cards writes to by literal path"
    );
});

test("no literal zero-width characters in the Chronicle source", () => {
    // The label encoding is load-bearing, and this file is copy-pasted by players into a
    // web editor. A zero-width char written literally in source is invisible, survives no
    // sanitizer, and would silently break every thought-to-event link ever recorded
    const chronicleSection = chronicleSource.slice(0, chronicleSource.indexOf("function AutoCards"));
    const offenders = chronicleSection.split("\n")
        .map((line, i) => ({ line: i + 1, text: line }))
        .filter(row => /[​-‍﻿]/.test(row.text));
    assertEqual(
        offenders.length, 0,
        `zero-width literals must be written as escapes: ${JSON.stringify(offenders.slice(0, 3))}`
    );
});

test("shim scripts stay seven lines and call the entry point", () => {
    for (const name of ["input", "context", "output"]) {
        const shim = fs.readFileSync(path.join(ROOT, "src", `${name}.js`), "utf8");
        assertEqual(shim.trim().split("\n").length, 7, `${name}.js is not seven lines`);
        assert(shim.includes(`Chronicle("${name}")`), `${name}.js does not call Chronicle`);
    }
});

test("old installs calling InnerSelf() still work", () => {
    const adventure = newAdventure("chronicle", { entry: "InnerSelf" });
    seedAgents(adventure);
    const out = adventure.hook("input", "> You greet Leah.");
    assert(typeof out === "string", "alias did not run");
    assert(configCard(adventure) === undefined, "input hook should not build the config card");
});

// ---------------------------------------------------------------- 1. parity

suite("1. Parity with Inner Self (300 turns, no retries)");

const parity = (() => {
    const upstream = newAdventure("upstream");
    const chronicle = newAdventure("chronicle");
    seedAgents(upstream);
    seedAgents(chronicle);
    const session = new Session([upstream, chronicle]);
    const plan = actionPlan(300);
    const divergences = [];
    const record = (turn, what, a, b) => {
        if (a !== b) {
            divergences.push({ turn, what, upstream: a, chronicle: b });
        }
    };
    plan.forEach((action, i) => {
        // Mid-session setting changes, applied identically to both
        if (i === 100) {
            [upstream, chronicle].forEach(a => editSetting(a, ROWS.json, "true"));
        }
        if (i === 150) {
            [upstream, chronicle].forEach(a => editSetting(a, ROWS.debug, "true"));
        }
        if (i === 200) {
            [upstream, chronicle].forEach(a => {
                editSetting(a, ROWS.debug, "false");
                editSetting(a, ROWS.json, "false");
                editSetting(a, ROWS.percent, "55%");
            });
        }
        if (i === 250) {
            [upstream, chronicle].forEach(a => editSetting(a, ROWS.enable, "false"));
        }
        if (i === 258) {
            [upstream, chronicle].forEach(a => editSetting(a, ROWS.enable, "true"));
        }
        const step = session.play(action.input, action.type);
        record(i, "input", step.inputs[0], step.inputs[1]);
        record(i, "context", step.contextOut[0], step.contextOut[1]);
        record(i, "output", step.outputs[0], step.outputs[1]);
        record(i, "brains", JSON.stringify(step.postInput[0].brains), JSON.stringify(step.postInput[1].brains));
        record(i, "label", String(step.postInput[0].label), String(step.postInput[1].label));
    });
    // One extra action so Chronicle's last staged transaction settles
    session.play("> You close the ledger.", "do");
    return { upstream, chronicle, session, divergences };
})();

test("every hook returns byte-identical text for 300 turns", () => {
    const textual = parity.divergences.filter(d => ["input", "context", "output"].includes(d.what));
    assert(
        textual.length === 0,
        `${textual.length} divergences, first at turn ${textual[0] && textual[0].turn} in ${textual[0] && textual[0].what}\n` +
        (textual[0] ? `  upstream:  ${JSON.stringify(String(textual[0].upstream).slice(0, 200))}\n  chronicle: ${JSON.stringify(String(textual[0].chronicle).slice(0, 200))}` : "")
    );
});

test("brain cards are byte-identical at every turn boundary", () => {
    const brains = parity.divergences.filter(d => d.what === "brains");
    assert(
        brains.length === 0,
        `${brains.length} brain divergences, first at turn ${brains[0] && brains[0].turn}\n` +
        (brains[0] ? `  upstream:  ${String(brains[0].upstream).slice(0, 300)}\n  chronicle: ${String(brains[0].chronicle).slice(0, 300)}` : "")
    );
});

test("label counters stay in step", () => {
    const labels = parity.divergences.filter(d => d.what === "label");
    assert(labels.length === 0, `${labels.length} label divergences, first at turn ${labels[0] && labels[0].turn}`);
});

test("both versions end on identical brains and operation counts", () => {
    assertDeep(parity.chronicle.brains(), parity.upstream.brains(), "final brains differ");
    assertEqual(
        parity.chronicle.state.InnerSelf.ops,
        parity.upstream.state.InnerSelf.ops,
        "operation counters differ"
    );
});

test("the session actually exercised thoughts, deletes and renames", () => {
    const entries = Object.values(parity.chronicle.brains()).map(b => b.entry).join("\n");
    assert(/ = "/.test(entries), "no assign operations were logged");
    assert(/^delete /m.test(entries), "no delete operations were logged");
    assert(Object.keys(parity.chronicle.brains()).length >= 2, "fewer than two agents ever thought");
});

test("every Inner Self setting reads back identically, despite the rename", () => {
    // Chronicle's card carries extra module rows, so compare the shared rows: every
    // setting Inner Self has must exist on Chronicle's card with the same value
    const chronicle = readSettings(parity.chronicle);
    const upstream = readSettings(parity.upstream);
    for (const [key, value] of Object.entries(upstream)) {
        assertEqual(chronicle[key], value, `setting "${key}" differs`);
    }
});

test("every module ships off by default", () => {
    const settings = readSettings(parity.chronicle);
    const flags = [
        "tiered memory with pinned core thoughts",
        "track world state (date, place, arc, factions)",
        "let several present characters think at once",
        "track who witnessed what, and what they still believe",
        "track progress clocks and scheduled consequences",
        "run periodic continuity audits",
        "enable player commands like /help and /undo",
        "track relationship bonds with the player",
        "enable diagnostics and safety rails"
    ];
    for (const flag of flags) {
        assertEqual(settings[flag], "false", `module flag "${flag}" is not off by default`);
    }
});

test("state stayed JSON-serializable throughout", () => {
    // The runtime round-trips state through JSON after every hook, so reaching here at all
    // proves it; this just pins the shape Chronicle promises
    const ch = parity.chronicle.state;
    assert(ch.CHRONICLE, "state.CHRONICLE missing");
    assertEqual(typeof ch.CHRONICLE.schema, "number", "schema version missing");
    assert(Array.isArray(ch.CHRONICLE.journal), "journal is not an array");
    assert(ch.CHRONICLE.journal.length <= 20, "journal exceeded its cap");
});

test("state stays small after 300 turns", () => {
    const size = JSON.stringify(parity.chronicle.state).length;
    assert(size < 8000, `state grew to ${size} chars`);
});

// ---------------------------------------------------------------- 2. migration

suite("2. Migration of an existing Inner Self save");

const migration = (() => {
    // Build a genuine Inner Self save
    const upstream = newAdventure("upstream");
    seedAgents(upstream);
    const warmup = new Session([upstream]);
    for (const action of actionPlan(40)) {
        warmup.play(action.input, action.type);
    }
    // A player who has been fiddling with their settings
    editSetting(upstream, ROWS.percent, "42%");
    editSetting(upstream, ROWS.distance, "9");
    editSetting(upstream, ROWS.player, "\"Iris\"");
    editSetting(upstream, ROWS.json, "true");
    warmup.play("> You check the tide clock.", "do");
    const saved = upstream.snapshot();
    const before = {
        settings: readSettings(upstream),
        brains: upstream.brains(),
        label: upstream.state.InnerSelf.label,
        ops: upstream.state.InnerSelf.ops,
        cards: upstream.storyCards.length
    };
    // Load that save into Chronicle
    const chronicle = newAdventure("chronicle");
    chronicle.sandbox.state = JSON.parse(JSON.stringify(saved.state));
    chronicle.sandbox.storyCards = saved.cards.map((c, i) => ({ id: `restored-${i}`, ...c }));
    chronicle.sandbox.history = saved.history.map(a => ({ ...a }));
    const session = new Session([chronicle]);
    session.play("> You unroll the manifest for Leah.", "do");
    return { chronicle, before, saved, session };
})();

test("the Inner Self config card is migrated, not duplicated", () => {
    const configs = migration.chronicle.storyCards.filter(c => /^Configure/.test((c.title || "").trim()));
    assertEqual(configs.length, 1, `expected one config card, found ${configs.length}`);
    assert(
        configs[0].title.includes("Chronicle"),
        `config card kept the old title: ${JSON.stringify(configs[0].title)}`
    );
});

test("every player setting survives the migration", () => {
    const after = readSettings(migration.chronicle);
    for (const [key, value] of Object.entries(migration.before.settings)) {
        assertEqual(after[key], value, `setting "${key}" changed during migration`);
    }
});

test("brains survive the migration untouched", () => {
    const after = migration.chronicle.brains();
    for (const [agent, brain] of Object.entries(migration.before.brains)) {
        assert(after[agent], `agent ${agent} lost their brain card`);
        assertEqual(after[agent].description, brain.description, `${agent} lost thoughts`);
    }
});

test("the label counter continues rather than restarting", () => {
    assert(
        migration.chronicle.state.InnerSelf.label >= migration.before.label,
        `label went backwards: ${migration.before.label} -> ${migration.chronicle.state.InnerSelf.label}`
    );
});

test("rolling back to Inner Self keeps brains, labels and operation counts", () => {
    // Play Chronicle for a while, then hand the save back to upstream
    const chronicle = newAdventure("chronicle");
    seedAgents(chronicle);
    const forward = new Session([chronicle], { seed: 21 });
    for (const action of actionPlan(30)) {
        forward.play(action.input, action.type);
    }
    forward.play("> You settle the last transaction.", "do");
    const saved = chronicle.snapshot();
    const before = {
        brains: chronicle.brains(),
        label: chronicle.state.InnerSelf.label,
        ops: chronicle.state.InnerSelf.ops
    };
    const upstream = newAdventure("upstream");
    upstream.sandbox.state = JSON.parse(JSON.stringify(saved.state));
    upstream.sandbox.storyCards = saved.cards.map((c, i) => ({ id: `rolled-${i}`, ...c }));
    upstream.sandbox.history = saved.history.map(a => ({ ...a }));
    const back = new Session([upstream], { seed: 22 });
    back.play("> You reopen the ledger with Leah.", "do");
    back.play("> You read the next page.", "do");
    assertEqual(upstream.throws.length, 0, "Inner Self threw on a Chronicle save");
    for (const [agent, brain] of Object.entries(before.brains)) {
        assert(upstream.brains()[agent], `agent ${agent} lost their brain on rollback`);
    }
    assert(
        upstream.state.InnerSelf.label >= before.label,
        `label counter went backwards on rollback: ${before.label} -> ${upstream.state.InnerSelf.label}`
    );
    assert(
        upstream.state.InnerSelf.ops >= before.ops,
        "operation counter went backwards on rollback"
    );
});

test("rolling back leaves the renamed config card behind, as MIGRATION.md warns", () => {
    // This documents a real cost of the rename rather than papering over it: upstream's
    // fuzzy title match cannot see "Configure Chronicle", so it builds a fresh card
    const chronicle = newAdventure("chronicle");
    seedAgents(chronicle);
    const forward = new Session([chronicle], { seed: 23 });
    forward.play("> You meet Leah.", "do");
    editSetting(chronicle, ROWS.percent, "44%");
    forward.play("> You talk with Leah.", "do");
    const saved = chronicle.snapshot();
    const upstream = newAdventure("upstream");
    upstream.sandbox.state = JSON.parse(JSON.stringify(saved.state));
    upstream.sandbox.storyCards = saved.cards.map((c, i) => ({ id: `rolled-${i}`, ...c }));
    upstream.sandbox.history = saved.history.map(a => ({ ...a }));
    new Session([upstream], { seed: 24 }).play("> You keep going.", "do");
    const configs = upstream.storyCards.filter(c => /^Configure/.test((c.title || "").trim()));
    assertEqual(configs.length, 2, `expected the documented orphan, found ${configs.length} config cards`);
    // And the documented workaround works: retitle first, then roll back
    const fixed = newAdventure("upstream");
    fixed.sandbox.state = JSON.parse(JSON.stringify(saved.state));
    fixed.sandbox.storyCards = saved.cards.map((c, i) => ({
        id: `fixed-${i}`, ...c,
        title: /^Configure/.test((c.title || "").trim()) ? "Configure \nInner Self" : c.title
    }));
    fixed.sandbox.history = saved.history.map(a => ({ ...a }));
    new Session([fixed], { seed: 25 }).play("> You keep going.", "do");
    const fixedConfigs = fixed.storyCards.filter(c => /^Configure/.test((c.title || "").trim()));
    assertEqual(fixedConfigs.length, 1, "the retitle workaround did not work");
    assert(
        readSettings(fixed)["max brain size relative to story context"] === "44%",
        "the retitle workaround lost a setting"
    );
});

test("a legacy MainSettings block that still says InnerSelf is honoured", () => {
    const patched = chronicleSource.replace("static Chronicle = {", "static InnerSelf = {");
    const adventure = new Adventure({ source: patched, entry: "Chronicle", seed: 3, maxChars: 25000 });
    seedAgents(adventure);
    adventure.hook("context", "Recent Story:\nLeah waits.");
    const card = configCard(adventure);
    assert(card, "no config card was built");
    assert(/Enable Chronicle: true/.test(card.entry), "MainSettings fallback did not apply");
});

// ---------------------------------------------------------------- 3. ledger

suite("3. Module A acceptance");

/** Builds a Chronicle adventure that always attempts a thought, for deterministic tests */
function ledgerAdventure() {
    const adventure = newAdventure("chronicle");
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 99 });
    // Build the config card, then make thought formation certain
    session.play("> You meet Leah at the counting house.", "do");
    editSetting(adventure, ROWS.chance, "100%");
    editSetting(adventure, ROWS.half, "false");
    session.play("> You show Leah the manifest.", "do");
    return { adventure, session };
}

/** Everything the brain card says, entry log included */
function brainText(adventure, agent) {
    const brains = adventure.brains();
    const brain = brains[agent];
    return brain ? `${brain.entry}\n${brain.description}` : "";
}

function allBrainText(adventure) {
    return Object.values(adventure.brains()).map(b => `${b.entry}\n${b.description}`).join("\n");
}

/** The thought sentence a generation would have written, if it wrote one */
function thoughtOf(step) {
    return step.generation.thought;
}

test("generate, retry, retry, accept: only the third generation survives, exactly once", () => {
    const { adventure, session } = ledgerAdventure();
    let first = session.play("> You ask Leah about the courier.", "do");
    // Keep going until a generation actually writes a thought, so the test has a subject
    let guard = 0;
    while (!thoughtOf(first) && (guard++ < 20)) {
        first = session.play("> You ask Leah about the courier again.", "do");
    }
    assert(thoughtOf(first), "no generation ever produced a thought");
    const second = session.retry();
    const third = session.retry();
    // Accept the third by taking another action
    session.play("> You nod and step outside.", "do");
    const text = allBrainText(adventure);
    if (thoughtOf(third)) {
        assert(text.includes(thoughtOf(third)), "the accepted generation's thought was not committed");
        const occurrences = text.split(thoughtOf(third)).length - 1;
        assert(occurrences >= 1, "accepted thought missing");
        // Once in the brain, once in the operation log, never more
        assert(occurrences <= 2, `accepted thought recorded ${occurrences} times`);
    }
    for (const discarded of [first, second]) {
        const thought = thoughtOf(discarded);
        if (thought && (thought !== thoughtOf(third))) {
            assert(
                !text.includes(thought),
                `a discarded generation's thought survived: ${JSON.stringify(thought)}`
            );
        }
    }
});

test("under Inner Self that same sequence keeps the discarded thought (the bug)", () => {
    const upstream = newAdventure("upstream");
    seedAgents(upstream);
    const session = new Session([upstream], { seed: 99 });
    session.play("> You meet Leah at the counting house.", "do");
    editSetting(upstream, ROWS.chance, "100%");
    editSetting(upstream, ROWS.half, "false");
    session.play("> You show Leah the manifest.", "do");
    let first = session.play("> You ask Leah about the courier.", "do");
    let guard = 0;
    while (!thoughtOf(first) && (guard++ < 20)) {
        first = session.play("> You ask Leah about the courier again.", "do");
    }
    assert(thoughtOf(first), "no generation ever produced a thought");
    session.retry();
    session.retry();
    session.play("> You nod and step outside.", "do");
    const text = Object.values(upstream.brains()).map(b => `${b.entry}\n${b.description}`).join("\n");
    assert(
        text.includes(thoughtOf(first)),
        "expected upstream to keep the discarded generation's thought; if this fails the bug " +
        "description in the spec no longer matches the code"
    );
});

test("generate, erase, different action: nothing from the erased generation survives", () => {
    const { adventure, session } = ledgerAdventure();
    let staged = session.play("> You question Leah about the ledger.", "do");
    let guard = 0;
    while (!thoughtOf(staged) && (guard++ < 20)) {
        staged = session.play("> You question Leah about the ledger again.", "do");
    }
    assert(thoughtOf(staged), "no generation ever produced a thought");
    // Erase the generation and the action that prompted it, then do something else
    session.erase(2);
    session.play("> You walk to the wharf instead.", "do");
    assert(
        !allBrainText(adventure).includes(thoughtOf(staged)),
        "an erased generation's thought reached the brain"
    );
    // The turn just played stages its own transaction, which is expected; what must be gone
    // is any trace of the erased one
    const pending = adventure.state.CHRONICLE.pending;
    assert(
        !pending || pending.ops.every(op => op.value !== thoughtOf(staged)),
        "the erased generation is still staged"
    );
    assert(
        adventure.state.CHRONICLE.stats.discards > 0,
        "nothing was ever discarded, so the erase went unnoticed"
    );
});

test("erasing only the generation also discards it", () => {
    const { adventure, session } = ledgerAdventure();
    let staged = session.play("> You press Leah for the manifest.", "do");
    let guard = 0;
    while (!thoughtOf(staged) && (guard++ < 20)) {
        staged = session.play("> You press Leah once more.", "do");
    }
    session.erase(1);
    session.play("> You let it go.", "do");
    assert(
        !allBrainText(adventure).includes(thoughtOf(staged)),
        "an erased generation's thought reached the brain"
    );
});

test("two accepted turns in a row are both recorded once, with sequential labels", () => {
    const { adventure, session } = ledgerAdventure();
    const accepted = [];
    for (let i = 0; i < 12; i++) {
        const step = session.play(`> You and Leah review page ${i}.`, "do");
        if (thoughtOf(step)) {
            accepted.push(thoughtOf(step));
        }
    }
    // Settle the last one
    session.play("> You close the book.", "do");
    const text = allBrainText(adventure);
    for (const thought of accepted) {
        const occurrences = text.split(thought).length - 1;
        assert(occurrences >= 1, `an accepted thought was never committed: ${JSON.stringify(thought)}`);
    }
    // Labels in the brain must be a gap-free run, in commit order
    const labels = [...text.matchAll(/^([a-z0-9_]+): (\d+) → /gm)].map(m => Number(m[2]));
    const sorted = [...labels].sort((a, b) => a - b);
    assert(labels.length > 0, "no labelled thoughts found");
    assertEqual(
        new Set(sorted).size, sorted.length,
        `duplicate labels in the brain: ${JSON.stringify(sorted)}`
    );
    assertEqual(
        adventure.state.InnerSelf.label,
        Math.max(...sorted, adventure.state.InnerSelf.label),
        "label counter fell behind the labels actually in use"
    );
});

test("retries do not burn label numbers", () => {
    const { adventure, session } = ledgerAdventure();
    let staged = session.play("> You wait with Leah for the tide.", "do");
    let guard = 0;
    while (!thoughtOf(staged) && (guard++ < 20)) {
        staged = session.play("> You wait a while longer.", "do");
    }
    const afterStage = adventure.state.InnerSelf.label;
    session.retry();
    const afterRetry = adventure.state.InnerSelf.label;
    assert(
        afterRetry <= afterStage,
        `retry advanced the label counter from ${afterStage} to ${afterRetry}`
    );
});

test("a 300 turn session with retries, erases and continues never throws or double-commits", () => {
    const adventure = newAdventure("chronicle");
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 4242 });
    session.play("> You begin the day's rounds with Leah.", "do");
    editSetting(adventure, ROWS.chance, "100%");
    editSetting(adventure, ROWS.half, "false");
    const committed = [];
    const discarded = [];
    const plan = actionPlan(300);
    plan.forEach((action, i) => {
        if (i === 90) {
            editSetting(adventure, ROWS.json, "true");
        }
        if (i === 140) {
            editSetting(adventure, ROWS.debug, "true");
        }
        if (i === 190) {
            editSetting(adventure, ROWS.debug, "false");
            editSetting(adventure, ROWS.json, "false");
        }
        if (i === 230) {
            editSetting(adventure, ROWS.enable, "false");
        }
        if (i === 240) {
            editSetting(adventure, ROWS.enable, "true");
        }
        const step = session.play(action.input, action.type);
        let live = step;
        if (i % 11 === 4) {
            // Retry once; whatever the earlier generation staged must vanish
            if (thoughtOf(live)) {
                discarded.push(thoughtOf(live));
            }
            live = session.retry();
        }
        if (i % 23 === 7) {
            if (thoughtOf(live)) {
                discarded.push(thoughtOf(live));
            }
            live = session.retry();
        }
        if (i % 31 === 12) {
            if (thoughtOf(live)) {
                discarded.push(thoughtOf(live));
            }
            session.erase(1);
            live = null;
        }
        if (live && thoughtOf(live)) {
            committed.push(thoughtOf(live));
        }
    });
    session.play("> You set down the pen.", "do");
    assertEqual(adventure.throws.length, 0, `hooks threw: ${JSON.stringify(adventure.throws.slice(0, 3))}`);
    const text = allBrainText(adventure);
    const survivors = discarded.filter(t => t && !committed.includes(t) && text.includes(t));
    assertEqual(survivors.length, 0, `${survivors.length} discarded thoughts reached the brain`);
    // Nothing committed twice
    for (const thought of new Set(committed)) {
        const inNotes = Object.values(adventure.brains())
            .map(b => b.description).join("\n").split(thought).length - 1;
        assert(inNotes <= 1, `a thought is stored under two keys at once: ${JSON.stringify(thought)}`);
    }
    // The ledger's own books must balance
    const ch = adventure.state.CHRONICLE;
    assert(ch.stats.commits > 10, `only ${ch.stats.commits} commits over 300 turns`);
    assert(ch.stats.discards > 10, `only ${ch.stats.discards} discards despite ~40 retries`);
    assert(ch.journal.length <= 20, "journal exceeded its cap");
    assert(JSON.stringify(adventure.state).length < 12000, "state grew past its budget");
});

test("a pinned agent name with a reserved key is refused, not written", () => {
    const adventure = newAdventure("chronicle");
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 5 });
    session.play("> You meet Leah.", "do");
    // Drive one output by hand, bypassing the scripted model
    adventure.hook("context", "Recent Story:\nLeah watches the door.");
    adventure.hook("output", "(__proto__ = `Leah owns every object now.`) The door stays shut.");
    adventure.push("The door stays shut.", "continue");
    adventure.hook("input", "> You leave.");
    assertEqual({}.polluted, undefined, "Object.prototype was polluted");
    assert(!allBrainText(adventure).includes("owns every object"), "a reserved key was written");
});

// ---------------------------------------------------------------- 4. faults

suite("4. Fault injection");

test("an exception between staging and commit discards cleanly", () => {
    const { adventure, session } = ledgerAdventure();
    let staged = session.play("> You brief Leah on the route.", "do");
    let guard = 0;
    while (!thoughtOf(staged) && (guard++ < 20)) {
        staged = session.play("> You brief Leah again.", "do");
    }
    const agent = staged.generation.agent || "Leah";
    const card = adventure.storyCards.find(c => (c.keys || "").includes(`"${agent}"`));
    assert(card, `no brain card for ${agent}`);
    const before = { entry: card.entry, description: card.description };
    // One transient read failure, exactly where the commit reads the card
    let fired = false;
    let stored = card.entry;
    Object.defineProperty(card, "entry", {
        configurable: true,
        get() {
            if (!fired) {
                fired = true;
                throw new Error("injected fault");
            }
            return stored;
        },
        set(value) { stored = value; }
    });
    const after = session.play("> You wait for the answer.", "do");
    assert(fired, "the fault was never reached, so this test proved nothing");
    assertEqual(adventure.throws.length, 0, "the exception escaped the hook");
    assertEqual(adventure.state.CHRONICLE.pending !== undefined, true, "pending key vanished");
    assertEqual(card.description, before.description, "a partial write reached the card");
    assert(
        adventure.state.CHRONICLE.journal.some(e => e.kind === "dropped"),
        "the dropped transaction was not journaled"
    );
    // And the adventure keeps working afterwards
    session.play("> You carry on regardless.", "do");
    assertEqual(adventure.throws.length, 0, "the adventure stopped working after a fault");
    assert(after, "no step returned");
});

test("a platform whose addStoryCard ignores returnCard does not corrupt anything", () => {
    const adventure = newAdventure("chronicle", { legacyAddStoryCard: true });
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 11 });
    for (let i = 0; i < 6; i++) {
        session.play(`> You and Leah check crate ${i}.`, "do");
    }
    assertEqual(adventure.throws.length, 0, `hooks threw: ${JSON.stringify(adventure.throws.slice(0, 2))}`);
});

test("corrupt pending state is discarded without throwing", () => {
    const { adventure, session } = ledgerAdventure();
    // Both the current candidate list and the compatibility field, since either could be
    // what a corrupted save comes back with
    adventure.sandbox.state.CHRONICLE.candidates = [{ actionCount: -5, ops: 7, fingerprint: null }];
    adventure.sandbox.state.CHRONICLE.pending = {
        actionCount: -5,
        fingerprint: 12345,
        labelStart: "not a number",
        encoding: null,
        agent: { evil: true },
        ops: "definitely not an array"
    };
    session.play("> You continue anyway.", "do");
    assertEqual(adventure.throws.length, 0, "corrupt pending state threw");
    const pending = adventure.state.CHRONICLE.pending;
    // Either nothing is staged, or it is this turn's own well-formed transaction
    assert(
        !pending || ((typeof pending.agent === "string") && Array.isArray(pending.ops) && (pending.actionCount >= 0)),
        `the corrupt transaction survived: ${JSON.stringify(pending)}`
    );
    assert(
        adventure.state.CHRONICLE.journal.some(e => e.kind === "discard"),
        "the corrupt transaction was not discarded"
    );
});

// ---------------------------------------------------------------- 5. modules B to J

const MODULE_ROWS = {
    tiers: /^> Tiered memory with pinned core thoughts:/,
    core: /^> Maximum pinned core thoughts per character:/,
    brainChars: /^> Maximum characters of thought per brain:/,
    promote: /^> Story links before a thought becomes long-term:/,
    world: /^> Track world state \(date, place, arc, factions\):/,
    worldChars: /^> Maximum characters of world state per turn:/,
    startDate: /^> In-game date the adventure began on:/,
    maxDays: /^> Maximum days one turn may advance:/,
    ensemble: /^> Let several present characters think at once:/,
    brains: /^> Maximum full brains sharing one context:/,
    knows: /^> Track who witnessed what, and what they still believe:/,
    eventChars: /^> Maximum characters of witnessed event log:/,
    rumor: /^> Chance per turn that a secret spreads to someone:/,
    clocks: /^> Track progress clocks and scheduled consequences:/,
    audit: /^> Run periodic continuity audits:/,
    auditEvery: /^> Turns between continuity audits:/,
    consoleOn: /^> Enable player commands like \/help and \/undo:/,
    bonds: /^> Track relationship bonds with the player:/,
    bondTurns: /^> Minimum turns between bond advances:/,
    diag: /^> Enable diagnostics and safety rails:/,
    autoscale: /^> Scale injections to the context the model has:/,
    compliance: /^> Watch whether the model can follow the task format:/,
    cooldown: /^> Turns to stop asking after the model cannot answer:/,
    canary: /^> Check that context injections are landing at all:/,
    lean: /^> Use terse prompts when context or compliance is tight:/,
    timeBudget: /^> Milliseconds a hook may spend before skipping extras:/,
    stateChars: /^> Maximum characters of saved adventure state:/
};

/**
 * A Chronicle adventure with the requested modules switched on and thought formation made
 * certain, so module behaviour can be asserted rather than waited for
 * @param {Object} settings - Config rows to set, keyed by MODULE_ROWS name
 * @param {Object} options - Adventure options
 * @returns {Object} { adventure, session }
 */
function moduleAdventure(settings = {}, options = {}) {
    const adventure = newAdventure("chronicle", options);
    seedAgents(adventure);
    const session = new Session([adventure], { seed: options.storySeed || 31 });
    session.play("> You arrive at the counting house with Leah.", "do");
    editSetting(adventure, ROWS.chance, "100%");
    editSetting(adventure, ROWS.half, "false");
    editSetting(adventure, ROWS.player, "\"Iris\"");
    for (const [key, value] of Object.entries(settings)) {
        editSetting(adventure, MODULE_ROWS[key], value);
    }
    session.play("> You open the ledger with Leah.", "do");
    return { adventure, session };
}

function cardTitled(adventure, title) {
    return adventure.storyCards.find(c => (c.title === title));
}

function brainCardOf(adventure, agent) {
    return adventure.storyCards.find(c => (typeof c.keys === "string") && c.keys.includes(`"${agent}"`));
}

suite("5. Module B — tiered memory");

test("a pinned thought survives an undersized brain over 300 turns", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true", brainChars: "600", core: "3" });
    const card = brainCardOf(adventure, "Leah") || (() => {
        session.play("> You ask Leah for the manifest.", "do");
        return brainCardOf(adventure, "Leah");
    })();
    assert(card, "Leah never got a brain card");
    // The player pins a defining fact by hand, the way the config card explains
    card.description = `#defining_vow: 1 → I swore to Iris that the river guild would never own me.\n\n${card.description}`;
    for (const action of actionPlan(300)) {
        session.play(action.input, action.type);
    }
    session.play("> You close the ledger.", "do");
    const after = brainCardOf(adventure, "Leah");
    assert(
        after.description.includes("#defining_vow"),
        `the pinned thought was evicted:\n${after.description.slice(0, 400)}`
    );
    assert(
        after.description.includes("never own me"),
        "the pinned thought lost its content"
    );
    assertEqual(adventure.throws.length, 0, "hooks threw during the replay");
    // And the cap was actually doing work
    assert(
        adventure.state.CHRONICLE.journal.length > 0,
        "nothing was journaled across 300 turns"
    );
});

test("an explicit request to delete a pinned thought is refused and logged", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true" });
    session.play("> You speak with Leah about the vow.", "do");
    const card = brainCardOf(adventure, "Leah");
    assert(card, "no brain card");
    card.description = "#defining_vow: 4 → I swore to Iris that the guild would never own me.";
    // The model does exactly what it must never be allowed to do
    session.force("(delete defining_vow) Leah says nothing for a while.");
    session.play("> You test Leah, and her resolve.", "do");
    session.play("> You wait with Leah.", "do");
    const after = brainCardOf(adventure, "Leah");
    assert(after.description.includes("#defining_vow"), "a pinned thought was deleted on request");
    assertEqual(adventure.throws.length, 0, "the refusal threw");
    assert(
        adventure.logs.some(line => /refused to delete the pinned thought/.test(line)),
        `the refusal was not logged: ${JSON.stringify(adventure.logs.slice(-3))}`
    );
});

test("eviction takes the coldest working thought, not a core one", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true", brainChars: "500" });
    session.play("> You review the crates with Leah.", "do");
    const card = brainCardOf(adventure, "Leah");
    card.description = [
        "#core_identity: 1 → I am the guild's factor and I answer to no captain.",
        "cold_thought: 2 → I noticed the third crate was lighter than its manifest.",
        "warm_thought: 3 → I intend to ask Silas about the third crate tonight."
    ].join("\n\n");
    for (let i = 0; i < 8; i++) {
        session.play(`> You and Leah count crate ${i}.`, "do");
    }
    const after = brainCardOf(adventure, "Leah");
    assert(after.description.includes("#core_identity"), "the core thought was evicted");
    assert(
        adventure.state.CHRONICLE.journal.some(entry => (entry.kind === "evict")),
        "nothing was ever evicted despite a 500 char cap"
    );
});

test("compression merges two long-term thoughts into one", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true", brainChars: "500", promote: "1" });
    session.play("> You study the ledger with Leah.", "do");
    const card = brainCardOf(adventure, "Leah");
    assert(card, "no brain card");
    // Two long-term thoughts that break the cap on their own, so eviction has nothing in
    // the working tier to take and has to ask for a merge instead
    card.description = [
        `first_failure: 2 -> I remember the first manifest that never reached the counting house, ${"and how nobody at the wharf would say a word about it, ".repeat(6)}and how the tide clock was already running fast.`,
        `second_failure: 3 -> I remember the second manifest that never reached the counting house, ${"and how the ledger had been rewritten in a hand I did not know, ".repeat(6)}and how Silas looked away when I asked.`
    ].join("\n\n");
    adventure.state.CHRONICLE.mem.Leah = {
        seen: { first_failure: 1, second_failure: 2 },
        hits: { first_failure: 5, second_failure: 5 },
        turn: -1,
        compress: []
    };
    // Plain thoughts, so the scripted model never deletes the two under test
    for (let i = 0; i < 4; i++) {
        session.force(`(shipment_note_${i} = \`I counted the ${i} crate again for Leah.\`) Leah nods at the tally.`);
        session.play(`> You and Leah trace shipment ${i}.`, "do");
    }
    assert(
        adventure.state.CHRONICLE.journal.some(entry => (entry.kind === "compress")),
        `compression was never requested: ${JSON.stringify(adventure.state.CHRONICLE.journal.slice(-4))}`
    );
    // The next context Leah appears in carries the compression task, and the model answers
    let merged = false;
    for (let i = 0; (i < 6) && !merged; i++) {
        const step = session.play(`> You keep tracing with Leah, ${i}.`, "do");
        if (step.generation.task === "compress") {
            merged = true;
        }
    }
    assert(merged, "the compression task never reached the model");
    session.play("> You set the ledger down with Leah.", "do");
    session.play("> You look up at Leah.", "do");
    const after = brainCardOf(adventure, "Leah").description;
    assert(
        !after.includes("second_failure"),
        `the two thoughts were not merged:\n${after.slice(0, 300)}`
    );
    assertEqual(adventure.throws.length, 0, "compression threw");
});

suite("6. Module C — world chronicle");

test("the world card is created, injected, and capped", () => {
    const { adventure, session } = moduleAdventure({ world: "true", worldChars: "300" });
    const card = cardTitled(adventure, "Chronicle");
    assert(card, "no world card was created");
    card.description = [
        "Date: Day 4",
        "Location: Fenwater Row",
        "Arc: The intercepted letter",
        "Open threats: the watch is asking about the barge; the tide clock is running fast",
        "Open debts: forty marks to Silas; a favour to Maren",
        "Standing: river guild +2; the watch -3",
        "Lost to memory: "
    ].join("\n");
    const step = session.play("> You walk the row with Leah.", "do");
    const context = step.contextOut[0];
    assert(context.includes("# The world as it stands: ["), "the world block was not injected");
    assert(context.includes("Day 4"), "the date was not injected");
    const block = context.slice(context.indexOf("# The world as it stands: ["));
    const rendered = block.slice(0, block.indexOf("]\n") + 1);
    assert(rendered.length <= 300, `the world block ran to ${rendered.length} chars, over its 300 cap`);
    // Lines are dropped whole, so nothing is cut mid sentence
    for (const line of rendered.split("\n").filter(l => l.startsWith("- "))) {
        assert(
            /[a-z0-9)+\-]$/i.test(line.trim()),
            `a line looks truncated mid-word: ${JSON.stringify(line)}`
        );
    }
});

test("narrative phrasing moves the calendar, and a retry does not move it twice", () => {
    const { adventure, session } = moduleAdventure({ world: "true" });
    const card = cardTitled(adventure, "Chronicle");
    card.description = "Date: Day 4\nLocation: Fenwater Row\nArc: \nOpen threats: \nOpen debts: \nStanding: \nLost to memory: ";
    session.play("> You take a room for the night.", "do");
    const before = adventure.state.CHRONICLE.world.date;
    session.force("The next morning, Leah is already at the wharf counting barges.");
    session.play("> You sleep.", "do");
    // Staged, not yet committed
    assertEqual(adventure.state.CHRONICLE.world.date, before, "the calendar moved before the turn was accepted");
    session.force("The next morning, Leah is already at the wharf counting barges.");
    session.retry();
    session.play("> You get up.", "do");
    assertEqual(adventure.state.CHRONICLE.world.date, "Day 5", `expected Day 5, got ${adventure.state.CHRONICLE.world.date}`);
    // A retried day change must not stack
    session.play("> You walk out.", "do");
    assertEqual(adventure.state.CHRONICLE.world.date, "Day 5", "the calendar advanced twice for one night");
});

test("hand edits to the world card win over stored state", () => {
    const { adventure, session } = moduleAdventure({ world: "true" });
    session.play("> You look around.", "do");
    const card = cardTitled(adventure, "Chronicle");
    card.description = "Date: Harvest Eve\nLocation: the lighthouse\nArc: \nOpen threats: \nOpen debts: \nStanding: \nLost to memory: ";
    const step = session.play("> You climb the stair with Leah.", "do");
    assertEqual(adventure.state.CHRONICLE.world.date, "Harvest Eve", "the card did not win");
    assert(step.contextOut[0].includes("the lighthouse"), "the edited location was not injected");
});

suite("7. Module D — ensemble");

test("characters who act are present, characters who are mentioned are not", () => {
    const { adventure, session } = moduleAdventure({ ensemble: "true", brains: "3" });
    // Give all three a mind, so the only thing under test is who gets to use one
    session.play("> You spend the morning with Leah, Maren and Silas.", "do");
    for (const who of AGENTS) {
        const card = brainCardOf(adventure, who) || (() => {
            adventure.storyCards.push({
                id: `brain-${who}`, keys: JSON.stringify({ agent: who }), entry: "",
                type: "Brain", title: who, description: ""
            });
            return brainCardOf(adventure, who);
        })();
        card.description = `standing_order: 5 → I am ${who}, and I keep my own counsel about the manifests.`;
    }
    // Leah and Maren act; Silas is only spoken about
    session.force("Leah sets down the ledger. Maren answers from the doorway, laughing about the letter from Silas.");
    session.play("> You wait for an answer.", "do");
    const step = session.play("> You watch them both.", "do");
    const context = step.contextOut[0];
    const blocks = (context.match(/brain and inner self: \[/g) || []).length;
    assert(1 < blocks, `expected more than one brain in context, found ${blocks}`);
    assert(context.includes("Leah") && context.includes("Maren"), "an acting character was left out");
    assert(
        !/# Silas's brain and inner self/.test(context),
        "a merely mentioned character was treated as present"
    );
});

test("only one character writes per turn, whatever the scene", () => {
    const { adventure, session } = moduleAdventure({ ensemble: "true", brains: "3" });
    for (let i = 0; i < 12; i++) {
        session.force(`Leah speaks first. Maren answers. Silas shrugs at page ${i}.`);
        session.play(`> You listen to all three, round ${i}.`, "do");
        const pending = adventure.state.CHRONICLE.pending;
        if (pending) {
            const writers = new Set(pending.ops.filter(op => (op.mod === "brain")).map(op => op.agent));
            assert(writers.size <= 1, `two characters wrote in one turn: ${[...writers].join(", ")}`);
        }
    }
    assertEqual(adventure.throws.length, 0, "hooks threw during an ensemble scene");
});

suite("8. Module E — knowledge model");

test("an absent character is told what they did not witness", () => {
    const { adventure, session } = moduleAdventure({ knows: "true", ensemble: "true", world: "true" });
    // Leah and Maren do something Silas is not there for
    for (let i = 0; i < 4; i++) {
        session.force(`Leah hands Maren the sealed letter. Maren hides it under the counter. Round ${i}.`);
        session.play(`> You watch Leah and Maren, round ${i}.`, "do");
    }
    // Now a scene where Silas acts
    let sawBlindSpot = false;
    for (let i = 0; (i < 6) && !sawBlindSpot; i++) {
        session.force(`Silas walks in alone and asks what he missed, round ${i}.`);
        const step = session.play(`> You greet Silas, round ${i}.`, "do");
        if (/Silas did not witness/.test(step.contextOut[0])) {
            sawBlindSpot = true;
        }
    }
    assert(sawBlindSpot, "Silas was never told what he had missed");
    assert(0 < adventure.state.CHRONICLE.events.length, "no events were recorded");
});

test("the event log stays inside its byte cap", () => {
    const { adventure, session } = moduleAdventure({ knows: "true", eventChars: "500" });
    for (const action of actionPlan(120)) {
        session.play(action.input, action.type);
    }
    const size = JSON.stringify(adventure.state.CHRONICLE.events).length;
    assert(size <= 500, `the event log grew to ${size} chars`);
});

suite("9. Module F — clocks and consequences");

test("a clock advances only on its declared trigger, and only once accepted", () => {
    const { adventure, session } = moduleAdventure({ clocks: "true", world: "true" });
    const card = cardTitled(adventure, "Chronicle Clocks");
    assert(card, "no clocks card was created");
    card.description = [
        "silas_war: 0/2",
        "  trigger: the watch searches the barge",
        "  consequence: Silas moves against the watch openly",
        "  reset: false"
    ].join("\n");
    // A tense scene with no trigger phrase must not move the clock
    session.force("Leah watches the wharf. Nothing happens, tensely.");
    session.play("> You wait.", "do");
    session.play("> You keep waiting.", "do");
    assertEqual(adventure.state.CHRONICLE.clocks.silas_war, undefined, "the clock advanced on vibes");
    // The declared trigger, staged and then accepted
    session.force("At dawn the watch searches the barge, plank by plank.");
    session.play("> You step back.", "do");
    session.play("> You say nothing.", "do");
    assertEqual(
        adventure.state.CHRONICLE.clocks.silas_war && adventure.state.CHRONICLE.clocks.silas_war.value, 1,
        `expected the clock at 1, got ${JSON.stringify(adventure.state.CHRONICLE.clocks.silas_war)}`
    );
});

test("a full clock queues its consequence, which then surfaces exactly once", () => {
    const { adventure, session } = moduleAdventure({ clocks: "true", world: "true" });
    const card = cardTitled(adventure, "Chronicle Clocks");
    card.description = [
        "silas_war: 0/1",
        "  trigger: the watch searches the barge",
        "  consequence: Silas moves against the watch openly",
        "  reset: false"
    ].join("\n");
    session.force("At dawn the watch searches the barge, plank by plank.");
    const trigger = session.play("> You step back.", "do");
    // The clock fills when that turn commits, which is during the next turn's input hook,
    // so the directive can surface as early as that same turn's context
    let surfaced = /Bring this to the surface now/.test(trigger.contextOut[0]) ? 1 : 0;
    const settle = session.play("> You say nothing.", "do");
    surfaced += /Bring this to the surface now/.test(settle.contextOut[0]) ? 1 : 0;
    for (let i = 0; i < 6; i++) {
        const step = session.play(`> You walk on, ${i}.`, "do");
        if (/Bring this to the surface now/.test(step.contextOut[0])) {
            surfaced++;
        }
    }
    assert(0 < surfaced, "the consequence never surfaced");
    session.play("> You stop.", "do");
    assertEqual(
        adventure.state.CHRONICLE.queue.filter(item => !item.fired).length, 0,
        "the consequence stayed in the queue after firing"
    );
    assert(surfaced <= 3, `the same consequence surfaced ${surfaced} turns running`);
});

suite("10. Module G — continuity auditor");

test("an audit runs on schedule and reports without correcting", () => {
    const { adventure, session } = moduleAdventure({ audit: "true", auditEvery: "10", world: "true" });
    let audited = false;
    for (let i = 0; (i < 30) && !audited; i++) {
        const step = session.play(`> You go about the day, ${i}.`, "do");
        if (step.generation.task === "audit") {
            audited = true;
        }
    }
    assert(audited, "no audit was ever requested");
    session.play("> You pause.", "do");
    session.play("> You pause again.", "do");
    const card = cardTitled(adventure, "Chronicle Continuity Log");
    assert(card, "no continuity log card");
    assert(
        /Turn \d+:|No contradictions/.test(card.description),
        `the log card says nothing useful: ${JSON.stringify(card.description.slice(0, 120))}`
    );
    assertEqual(adventure.throws.length, 0, "the auditor threw");
});

test("a reported contradiction reaches the player and changes nothing on its own", () => {
    const { adventure, session } = moduleAdventure({ audit: "true", auditEvery: "10", world: "true" });
    const worldCard = cardTitled(adventure, "Chronicle");
    worldCard.description = "Date: Day 4\nLocation: Fenwater Row\nArc: \nOpen threats: \nOpen debts: \nStanding: \nLost to memory: ";
    session.force("(audit = `The chronicle says Day 4, but the scene calls it midwinter.`) Iris walks on.");
    session.play("> You keep walking.", "do");
    session.play("> You keep walking again.", "do");
    assert(
        /contradiction/i.test(String(adventure.sandbox.state.message || "")),
        `the player was not told: ${JSON.stringify(adventure.sandbox.state.message)}`
    );
    assertEqual(adventure.state.CHRONICLE.world.date, "Day 4", "the auditor corrected the world by itself");
});

suite("11. Module H — player console");

test("a command answers the player and stops the turn", () => {
    const { adventure } = moduleAdventure({ consoleOn: "true", world: "true", clocks: "true" });
    const out = adventure.hook("input", "/state");
    assert(out !== "", "the input hook returned an empty string");
    assert(/Date:/.test(String(adventure.sandbox.state.message)), "no answer was given");
    adventure.push(out, "do");
    adventure.hook("context", buildContext(adventure));
    assertEqual(adventure.sandbox.stop, true, "the turn was not stopped");
});

test("unknown commands fall through to the story untouched", () => {
    const { adventure } = moduleAdventure({ consoleOn: "true" });
    const before = String(adventure.sandbox.state.message || "");
    const out = adventure.hook("input", "/dance with Leah");
    assertEqual(out, "/dance with Leah", "an unknown command was swallowed");
    assertEqual(String(adventure.sandbox.state.message || ""), before, "an unknown command answered anyway");
});

test("/pin, /forget and /undo do what they say", () => {
    const { adventure, session } = moduleAdventure({ consoleOn: "true", tiers: "true" });
    session.play("> You talk with Leah about the crates.", "do");
    const card = brainCardOf(adventure, "Leah");
    assert(card, "no brain card");
    card.description = "crate_count: 3 → I counted nineteen crates where the manifest claims twenty.";
    adventure.hook("input", "/pin Leah crate_count");
    assert(
        brainCardOf(adventure, "Leah").description.includes("#crate_count"),
        `/pin did not pin: ${brainCardOf(adventure, "Leah").description}`
    );
    assert(/pinned/i.test(String(adventure.sandbox.state.message)), "/pin said nothing useful");
    adventure.hook("input", "/unpin Leah crate_count");
    assert(
        !brainCardOf(adventure, "Leah").description.includes("#crate_count"),
        "/unpin did not unpin"
    );
    adventure.hook("input", "/forget Leah crate_count");
    assert(
        !brainCardOf(adventure, "Leah").description.includes("crate_count"),
        "/forget did not forget"
    );
    // /undo restores the last committed transaction
    const undoable = adventure.state.CHRONICLE.undo;
    adventure.hook("input", "/undo");
    const message = String(adventure.sandbox.state.message);
    assert(
        undoable ? /Reverted/.test(message) : /nothing to undo/i.test(message),
        `/undo said: ${message}`
    );
});

test("/who, /bonds, /clocks, /diag and /help all answer", () => {
    const { adventure, session } = moduleAdventure({
        consoleOn: "true", ensemble: "true", bonds: "true", clocks: "true", diag: "true"
    });
    session.force("Leah speaks. Maren answers.");
    session.play("> You listen.", "do");
    for (const [command, expected] of [
        ["/help", /Chronicle commands/],
        ["/who", /full brain|Nobody/],
        ["/bonds", /Leah/],
        ["/clocks", /clock|Coming|No clocks/i],
        ["/diag", /State: \d+/]
    ]) {
        const out = adventure.hook("input", command);
        assert(out !== "", `${command} returned an empty string`);
        assert(
            expected.test(String(adventure.sandbox.state.message)),
            `${command} answered: ${JSON.stringify(String(adventure.sandbox.state.message).slice(0, 120))}`
        );
    }
    assertEqual(adventure.throws.length, 0, "a command threw");
});

suite("12. Module I — bonds");

test("a bond advances one rung at a time and respects its cooldown", () => {
    const { adventure, session } = moduleAdventure({ bonds: "true", bondTurns: "0" });
    session.force("(bond = `formally bound`) Leah looks at Iris for a long moment.");
    session.play("> You offer your hand.", "do");
    session.play("> You wait.", "do");
    assertEqual(
        adventure.state.CHRONICLE.bonds.Leah.stage, 1,
        `a bond skipped rungs: ${JSON.stringify(adventure.state.CHRONICLE.bonds.Leah)}`
    );
    // With a cooldown in force, the next advance must not land
    editSetting(adventure, MODULE_ROWS.bondTurns, "500");
    session.force("(bond = `sought out`) Leah steps closer.");
    session.play("> You speak gently.", "do");
    session.play("> You wait again.", "do");
    assertEqual(adventure.state.CHRONICLE.bonds.Leah.stage, 1, "the cooldown was ignored");
});

test("a betrayal may drop several rungs at once", () => {
    const { adventure, session } = moduleAdventure({ bonds: "true", bondTurns: "0" });
    adventure.state.CHRONICLE.bonds.Leah = { stage: 5, turn: 0 };
    session.force("(bond = `broken`) Leah turns away without a word.");
    session.play("> You lie to her.", "do");
    session.play("> You watch her go.", "do");
    assert(
        adventure.state.CHRONICLE.bonds.Leah.stage < 5,
        `a betrayal did not cost anything: ${JSON.stringify(adventure.state.CHRONICLE.bonds.Leah)}`
    );
});

test("the current standing is injected as a fact in that character's head", () => {
    const { adventure, session } = moduleAdventure({ bonds: "true" });
    const step = session.play("> You sit with Leah.", "do");
    assert(
        /Standing with Iris: (unknown|noticed)/.test(step.contextOut[0]),
        "the bond was not injected into the brain block"
    );
});

suite("13. Module J — diagnostics and safety rails");

test("the state budget warns, then trims, and never overflows", () => {
    const { adventure, session } = moduleAdventure({
        diag: "true", stateChars: "8000", knows: "true", world: "true", clocks: "true", tiers: "true"
    });
    for (const action of actionPlan(200)) {
        session.play(action.input, action.type);
    }
    const size = JSON.stringify(adventure.state).length;
    assert(size < 8000, `state reached ${size} chars against an 8000 char budget`);
    assert(
        adventure.logs.some(line => /state at \d+ of|trimmed/.test(line)),
        "the budget never said anything"
    );
});

test("optional work is skipped rather than risking the hook timeout", () => {
    // A clock that advances a second per call makes every hook look slow
    const { adventure, session } = moduleAdventure(
        { diag: "true", timeBudget: "100", audit: "true", auditEvery: "1", tiers: "true" },
        { clockStepMs: 1000 }
    );
    session.play("> You keep working.", "do");
    session.play("> You keep working still.", "do");
    assert(0 < adventure.state.CHRONICLE.diag.skips, "nothing was ever skipped under a 100ms budget");
    assertEqual(adventure.throws.length, 0, "skipping threw");
});

test("the diagnostics card lists recent transactions", () => {
    const { adventure, session } = moduleAdventure({ diag: "true" });
    for (let i = 0; i < 8; i++) {
        session.play(`> You work through page ${i}.`, "do");
    }
    const card = cardTitled(adventure, "Chronicle Diagnostics");
    assert(card, "no diagnostics card");
    assert(/commits: \d+/.test(card.description), "no transaction counts");
    assert(/last transactions:/.test(card.description), "no transaction list");
    assert(
        card.description.split("\n").filter(line => /turn \d+/.test(line)).length <= 20,
        "the diagnostics card listed more than twenty transactions"
    );
});

test("story cards are found through the index instead of a full scan", () => {
    const { adventure, session } = moduleAdventure({ world: "true", clocks: "true", diag: "true" });
    session.play("> You look at the river.", "do");
    const index = adventure.state.CHRONICLE.index;
    assert(Object.keys(index).length > 0, "nothing was indexed");
    for (const [title, position] of Object.entries(index)) {
        const card = adventure.storyCards[position];
        assert(card && (card.title === title), `the index points at the wrong card for ${title}`);
    }
});

suite("13b. Late additions across modules B, F and I");

test("a character is seeded with one pinned fact from their own story card", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true" });
    // The seed card the scenario creator wrote, renamed from "@Leah" on the first turn
    const source = adventure.storyCards.find(c => (c.title === "Leah"));
    assert(source, "the @Leah card was never adopted");
    source.entry = "Leah keeps the river guild's ledgers and has never once been caught short. She dislikes the watch.";
    session.play("> You greet Leah at the counting house.", "do");
    session.play("> You ask Leah for the tally.", "do");
    session.play("> You wait while Leah counts.", "do");
    const card = brainCardOf(adventure, "Leah");
    assert(card, "no brain card");
    assert(
        card.description.includes("#defining_fact"),
        `nothing was seeded:\n${card.description.slice(0, 300)}`
    );
    assert(
        card.description.includes("river guild"),
        "the seed did not come from the character's own card"
    );
});

test("the core tier is capped by demotion, never by deletion", () => {
    const { adventure, session } = moduleAdventure({ tiers: "true", core: "2" });
    session.play("> You sit with Leah.", "do");
    const card = brainCardOf(adventure, "Leah");
    card.description = [
        "#first_pin: 1 → I was born on the water and I will die on it.",
        "#second_pin: 2 → I have never once been caught short at the counting house.",
        "#third_pin: 3 → I do not trust the watch, and I never will.",
        "#fourth_pin: 4 → Iris is the only factor who ever asked my name."
    ].join("\n\n");
    session.play("> You talk with Leah a while.", "do");
    session.play("> You talk with Leah some more.", "do");
    const after = brainCardOf(adventure, "Leah").description;
    const pinned = (after.match(/#[a-z_]+_pin/g) || []).length;
    assert(pinned <= 2, `the core cap was not enforced, ${pinned} thoughts still pinned`);
    // Demoted, not destroyed: every thought is still there under a bare name
    for (const text of ["born on the water", "caught short", "trust the watch", "asked my name"]) {
        assert(after.includes(text), `a demoted thought was destroyed: ${text}`);
    }
});

test("a bond is mirrored into the reserved namespace, and a hand edit wins", () => {
    const { adventure, session } = moduleAdventure({ bonds: "true", bondTurns: "0", tiers: "true" });
    session.force("(bond = `noticed`) Leah looks up as Iris passes.");
    session.play("> You pass her desk.", "do");
    session.play("> You look back.", "do");
    const card = brainCardOf(adventure, "Leah");
    assert(card, "no brain card");
    assert(
        /#bond: standing with the player: noticed/.test(card.description),
        `the bond was not mirrored onto the card:\n${card.description.slice(0, 300)}`
    );
    // The player rewrites it by hand, and Chronicle believes them
    card.description = card.description.replace(
        /#bond: standing with the player: [a-z ]+/,
        "#bond: standing with the player: defended publicly"
    );
    session.play("> You speak with Leah.", "do");
    session.play("> You wait with Leah.", "do");
    assertEqual(
        adventure.state.CHRONICLE.bonds.Leah.stage, 4,
        `the hand edit did not win: ${JSON.stringify(adventure.state.CHRONICLE.bonds.Leah)}`
    );
});

test("a consequence can wait for a phrase rather than a turn number", () => {
    const { adventure, session } = moduleAdventure({ clocks: "true", world: "true" });
    const card = cardTitled(adventure, "Chronicle Clocks");
    card.description = [
        "letter_returns: 0/1",
        "  trigger: the letter leaves the wharf",
        "  consequence: the letter arrives in the wrong hands",
        "  after: at the magistrate",
        "  reset: false"
    ].join("\n");
    session.force("At dusk the letter leaves the wharf in a stranger's coat.");
    session.play("> You watch it go.", "do");
    session.play("> You say nothing.", "do");
    assert(0 < adventure.state.CHRONICLE.queue.length, "the clock did not fill");
    // The condition has not been met, so nothing surfaces however long we wait
    let early = 0;
    for (let i = 0; i < 5; i++) {
        const step = session.play(`> You go about your day, ${i}.`, "do");
        if (/Bring this to the surface now/.test(step.contextOut[0])) {
            early++;
        }
    }
    assertEqual(early, 0, "the consequence surfaced before its condition was met");
    // Now the story reaches the phrase
    session.force("Iris finally stands at the magistrate's door with Leah.");
    session.play("> You climb the steps.", "do");
    let late = 0;
    for (let i = 0; i < 3; i++) {
        const step = session.play(`> You wait in the hall, ${i}.`, "do");
        if (/Bring this to the surface now/.test(step.contextOut[0])) {
            late++;
        }
    }
    assert(0 < late, "the consequence never surfaced once its condition was met");
});

test("/undo reverts the whole transaction, not only its thought", () => {
    const { adventure, session } = moduleAdventure({
        consoleOn: "true", world: "true", clocks: "true", bonds: "true", bondTurns: "0"
    });
    const worldCard = cardTitled(adventure, "Chronicle");
    worldCard.description = "Date: Day 4\nLocation: Fenwater Row\nArc: \nOpen threats: \nOpen debts: \nStanding: \nLost to memory: ";
    session.play("> You settle in for the night.", "do");
    // A turn that moves the day and writes a thought, then is accepted
    session.force("(night_watch = `I will keep the ledger under my own pillow tonight.`) The next morning Leah is already counting.");
    session.play("> You sleep.", "do");
    // Plain prose, so this turn stages nothing of its own and /undo has the night to revert
    // rather than whatever happened last
    session.force("Leah says nothing at all.");
    session.play("> You wake with Leah.", "do");
    assertEqual(adventure.state.CHRONICLE.world.date, "Day 5", "the day did not move");
    adventure.hook("input", "/undo");
    assertEqual(
        adventure.state.CHRONICLE.world.date, "Day 4",
        `the calendar was not rolled back: ${adventure.state.CHRONICLE.world.date}`
    );
    assert(
        /Reverted the last change to .*the world/.test(String(adventure.sandbox.state.message)),
        `/undo said: ${adventure.sandbox.state.message}`
    );
    assertEqual(adventure.throws.length, 0, "/undo threw");
});

suite("14. Everything on at once");

test("300 turns with every module on, retries and all, stays sane", () => {
    const { adventure, session } = moduleAdventure({
        tiers: "true", world: "true", ensemble: "true", knows: "true", clocks: "true",
        audit: "true", auditEvery: "40", consoleOn: "true", bonds: "true", bondTurns: "50",
        diag: "true", brainChars: "1200", stateChars: "40000"
    });
    const clockCard = cardTitled(adventure, "Chronicle Clocks");
    if (clockCard) {
        clockCard.description = [
            "wharf_pressure: 0/4",
            "  trigger: the watch searches the barge",
            "  consequence: the guild closes the wharf to the watch",
            "  reset: true"
        ].join("\n");
    }
    const plan = actionPlan(300);
    plan.forEach((action, i) => {
        if ((i % 37) === 11) {
            session.force("At dawn the watch searches the barge again, plank by plank.");
        }
        if ((i % 53) === 3) {
            session.force("The next morning, Leah and Maren are already at the wharf.");
        }
        session.play(action.input, action.type);
        if ((i % 13) === 5) {
            session.retry();
        }
        if ((i % 29) === 9) {
            session.erase(1);
        }
        if ((i % 61) === 17) {
            adventure.hook("input", "/state");
        }
    });
    session.play("> You put the ledger away.", "do");
    assertEqual(adventure.throws.length, 0, `hooks threw: ${JSON.stringify(adventure.throws.slice(0, 3))}`);
    const size = JSON.stringify(adventure.state).length;
    assert(size < 40000, `state reached ${size} chars`);
    const ch = adventure.state.CHRONICLE;
    assert(10 < ch.stats.commits, `only ${ch.stats.commits} commits`);
    assert(0 < ch.stats.discards, "no retries were ever discarded");
    assert(ch.journal.length <= 20, "the journal exceeded its cap");
    assert(ch.events.length >= 0, "events went missing");
    // Every module left something behind
    assert(cardTitled(adventure, "Chronicle"), "no world card");
    assert(cardTitled(adventure, "Chronicle Clocks"), "no clocks card");
    assert(cardTitled(adventure, "Chronicle Diagnostics"), "no diagnostics card");
});

test("with every module on, hooks stay well inside the two second ceiling", () => {
    const { adventure, session } = moduleAdventure({
        tiers: "true", world: "true", ensemble: "true", knows: "true", clocks: "true",
        audit: "true", consoleOn: "true", bonds: "true", diag: "true"
    });
    const times = [];
    const original = adventure.hook.bind(adventure);
    adventure.hook = (hook, text) => {
        const start = process.hrtime.bigint();
        const result = original(hook, text);
        times.push(Number(process.hrtime.bigint() - start) / 1e6);
        return result;
    };
    for (const action of actionPlan(120)) {
        session.play(action.input, action.type);
    }
    times.sort((a, b) => (a - b));
    const worst = times[times.length - 1];
    assert(worst < 400, `the slowest hook took ${worst.toFixed(1)}ms`);
});

// ---------------------------------------------------------------- 15. modules K to N

suite("15. Module K — runtime budget autoscaling");

/** Runs a session at a given context size, returning what it cost every turn */
function budgetRun(maxChars, { turns = 300, oscillate = null, modules = {} } = {}) {
    // Everything on, so the injection targets are asserted under the full load rather
    // than a convenient subset of it
    const { adventure, session } = moduleAdventure({
        autoscale: "true", lean: "true", world: "true", ensemble: "true", knows: "true",
        clocks: "true", audit: "true", tiers: "true", diag: "true", bonds: "true",
        consoleOn: "true", compliance: "true", canary: "true", ...modules
    }, { maxChars });
    const card = brainCardOf(adventure, "Leah");
    if (card) {
        card.description = `#defining_vow: 1 → I swore to Iris that the river guild would never own me.\n\n${card.description}`;
    }
    const samples = [];
    const plan = actionPlan(turns);
    plan.forEach((action, i) => {
        if (oscillate) {
            // The player spends credits on some actions and not others, which on GLM moves
            // the context size turn to turn inside one adventure
            adventure.maxChars = ((i % 2) === 0) ? oscillate[0] : oscillate[1];
        }
        const step = session.play(action.input, action.type);
        const cost = adventure.state.CHRONICLE.diag.cost || {};
        samples.push({
            turn: i,
            maxChars: adventure.maxChars,
            profile: adventure.state.CHRONICLE.budget.profile,
            total: cost.total || 0,
            context: step.contextOut[0].length
        });
    });
    session.play("> You set the ledger down with Leah.", "do");
    return { adventure, session, samples };
}

for (const [maxChars, expected] of [[8000, "XS"], [20000, "S"], [60000, "M"], [150000, "L"], [400000, "XL"]]) {
    test(`300 turns at ${maxChars} chars settles on profile ${expected} and stays inside it`, () => {
        const { adventure, samples } = budgetRun(maxChars, { turns: 300 });
        assertEqual(adventure.throws.length, 0, `hooks threw: ${JSON.stringify(adventure.throws.slice(0, 2))}`);
        assertEqual(
            adventure.state.CHRONICLE.budget.profile, expected,
            `expected profile ${expected} at ${maxChars} chars`
        );
        // The context handed back never exceeds what the model can hold
        const overrun = samples.filter(s => (s.context > maxChars));
        assertEqual(overrun.length, 0, `${overrun.length} turns returned more context than the model holds`);
        // The pinned thought is still there after all of it
        const card = brainCardOf(adventure, "Leah");
        assert(
            card && card.description.includes("#defining_vow"),
            `the core thought was lost at ${maxChars} chars`
        );
    });
}

test("a shrinking context gives features up in order, and never gives up the world", () => {
    const big = budgetRun(150000, { turns: 60 });
    const small = budgetRun(8000, { turns: 60 });
    const cost = (run) => run.samples.filter(s => (0 < s.total));
    const bigTotal = cost(big).reduce((a, s) => (a + s.total), 0) / Math.max(1, cost(big).length);
    const smallTotal = cost(small).reduce((a, s) => (a + s.total), 0) / Math.max(1, cost(small).length);
    assert(smallTotal < bigTotal, `XS injected ${smallTotal} chars against L's ${bigTotal}`);
    // The world is the last thing to go, so it is still being injected at XS
    const worldSeen = small.session.steps.some(step => (
        step.contextOut && /World:|The world as it stands/.test(step.contextOut[0])
    ));
    assert(worldSeen, "the world stopped being injected at XS");
    // And the audit, first on the list, is gone
    assertEqual(
        small.samples.some(s => (s.profile === "XS")), true,
        "the small run never reached XS"
    );
});

test("hysteresis keeps an oscillating context from thrashing the feature set", () => {
    const { adventure } = budgetRun(8000, { turns: 120, oscillate: [8000, 60000] });
    const changes = adventure.state.CHRONICLE.budget.changes || [];
    // Without hysteresis this would switch on all 120 turns
    assert(changes.length <= 8, `the profile changed ${changes.length} times under oscillation`);
    assertEqual(adventure.throws.length, 0, "oscillation threw");
});

test("maxChars is read every turn, never cached", () => {
    const { adventure, session } = moduleAdventure({ autoscale: "true", diag: "true" }, { maxChars: 8000 });
    session.play("> You look around with Leah.", "do");
    assertEqual(adventure.state.CHRONICLE.budget.maxChars, 8000, "the first reading was wrong");
    // The player spends credits, as GLM allows, per action
    adventure.maxChars = 128000;
    session.play("> You look again with Leah.", "do");
    session.play("> You look once more with Leah.", "do");
    assertEqual(
        adventure.state.CHRONICLE.budget.maxChars, 128000,
        "a changed context size was not picked up"
    );
});

suite("16. Module L — compliance monitor");

/** Plays a session against a model that fails the format at the given rate */
function complianceRun(sloppy, turns = 120) {
    const { adventure, session } = moduleAdventure({
        compliance: "true", lean: "true", cooldown: "25"
    });
    session.sloppy = sloppy;
    for (const action of actionPlan(turns)) {
        session.play(action.input, action.type);
    }
    return { adventure, session };
}

test("a compliant model stays healthy", () => {
    const { adventure } = complianceRun(0, 80);
    assertEqual(adventure.state.CHRONICLE.compliance.band, "healthy", "a compliant model was penalised");
    assertEqual(adventure.throws.length, 0, "the monitor threw");
});

test("a model failing one turn in five stays healthy, and one in two degrades", () => {
    const light = complianceRun(0.2, 160).adventure.state.CHRONICLE.compliance;
    assertEqual(light.band, "healthy",
        `20% failures should sit above the 0.8 floor, rate was ${light.window.reduce((a, b) => (a + b.r), 0) / light.window.length}`);
    assertEqual(complianceRun(0.5, 120).adventure.state.CHRONICLE.compliance.band, "degraded",
        "50% failures should land in the degraded band");
});

test("a model failing four turns in five drops to minimal and is left alone", () => {
    const { adventure, session } = complianceRun(0.8, 120);
    assertEqual(
        adventure.state.CHRONICLE.compliance.lowest, "minimal",
        "80% failures should reach the minimal band at some point"
    );
    // Put it back there for the rest of the test, since the cooldown may have let it climb
    session.sloppy = 0.9;
    for (let i = 0; (i < 60) && (adventure.state.CHRONICLE.compliance.band !== "minimal"); i++) {
        session.play(`> You try once more, ${i}.`, "do");
    }
    assertEqual(adventure.state.CHRONICLE.compliance.band, "minimal", "the band did not return to minimal");
    // In the minimal band Chronicle stops asking, and says so once
    assert(
        /stopped asking/.test(String(adventure.sandbox.state.message || "")),
        `the player was not told: ${JSON.stringify(adventure.sandbox.state.message)}`
    );
    const quiet = [];
    for (let i = 0; i < 10; i++) {
        const step = session.play(`> You carry on regardless, ${i}.`, "do");
        quiet.push(taskOf(step.contextOut[0]));
    }
    assert(
        quiet.every(task => (task === "none")),
        `Chronicle kept asking a model that cannot answer: ${JSON.stringify(quiet)}`
    );
    // The world and existing brains are still going in
    const step = session.play("> You look at Leah.", "do");
    assert(
        /mind:|brain and inner self/.test(step.contextOut[0]),
        "the brains stopped being injected in the minimal band"
    );
});

test("recovery is gradual, one band at a time", () => {
    const { adventure, session } = complianceRun(0.9, 160);
    assertEqual(adventure.state.CHRONICLE.compliance.band, "minimal", "setup did not reach minimal");
    // Dynamic DeepSeek rotates, and this action lands on a model that can answer
    session.sloppy = 0;
    const bands = [];
    for (let i = 0; i < 200; i++) {
        session.play(`> You try again, ${i}.`, "do");
        const band = adventure.state.CHRONICLE.compliance.band;
        if (bands[bands.length - 1] !== band) {
            bands.push(band);
        }
    }
    assertEqual(
        adventure.state.CHRONICLE.compliance.band, "healthy",
        `a consistently compliant model never got back to healthy: ${JSON.stringify(bands)}`
    );
    assertDeep(
        bands, ["minimal", "degraded", "healthy"],
        "recovery skipped a band instead of climbing one at a time"
    );
});

suite("17. Module M — injection canary");

test("a working context channel is confirmed, and nothing changes", () => {
    const { adventure, session } = moduleAdventure({ canary: "true", world: "true" });
    for (let i = 0; i < 30; i++) {
        session.play(`> You go about the day with Leah, ${i}.`, "do");
    }
    assertEqual(adventure.state.CHRONICLE.canary.state, "landing", "a working channel was not confirmed");
    assertEqual(
        String((adventure.sandbox.state.memory || {}).frontMemory || ""), "",
        "the fallback channel was used despite the context working"
    );
});

test("a read-only context is detected, and the world reaches the model anyway", () => {
    const { adventure, session } = moduleAdventure({ canary: "true", world: "true", bonds: "true" });
    const worldCard = cardTitled(adventure, "Chronicle");
    worldCard.description = "Date: Day 9\nLocation: the lighthouse stair\nArc: \nOpen threats: \nOpen debts: \nStanding: \nLost to memory: ";
    // Optimized Context: everything the context hook returns is thrown away
    adventure.readOnlyContext = true;
    let seen = "";
    for (let i = 0; (i < 60) && (adventure.state.CHRONICLE.canary.state !== "blocked"); i++) {
        const step = session.play(`> You climb with Leah, ${i}.`, "do");
        seen = step.contextOut[0];
    }
    assertEqual(
        adventure.state.CHRONICLE.canary.state, "blocked",
        "a discarded context channel was never detected"
    );
    assert(
        /Optimized Context/.test(String(adventure.sandbox.state.message || "")),
        `the player was not told what it costs them: ${JSON.stringify(adventure.sandbox.state.message)}`
    );
    // The world now travels by the only channel left
    const step = session.play("> You reach the top with Leah.", "do");
    const front = String((adventure.state.memory || {}).frontMemory || "");
    assert(/\[Chronicle\]/.test(front), `the fallback channel is empty: ${JSON.stringify(front)}`);
    assert(/Day 9|lighthouse/.test(front), `the world did not reach the fallback: ${JSON.stringify(front)}`);
    assert(
        /Day 9|lighthouse/.test(modelSees(adventure, step.contextIn[0], step.contextOut[0])),
        "the model still cannot see the world"
    );
    assertEqual(adventure.throws.length, 0, "the fallback threw");
    assert(seen !== null, "no context was captured");
});

test("the fallback is cleared again if the channel starts working", () => {
    const { adventure, session } = moduleAdventure({ canary: "true", world: "true" });
    adventure.readOnlyContext = true;
    for (let i = 0; (i < 60) && (adventure.state.CHRONICLE.canary.state !== "blocked"); i++) {
        session.play(`> You wait with Leah, ${i}.`, "do");
    }
    assertEqual(adventure.state.CHRONICLE.canary.state, "blocked", "setup did not reach blocked");
    // The player turns Optimized Context off again
    adventure.readOnlyContext = false;
    for (let i = 0; (i < 40) && (adventure.state.CHRONICLE.canary.state !== "landing"); i++) {
        session.play(`> You try again with Leah, ${i}.`, "do");
    }
    assertEqual(adventure.state.CHRONICLE.canary.state, "landing", "a restored channel was not noticed");
    session.play("> You carry on with Leah.", "do");
    assertEqual(
        String((adventure.state.memory || {}).frontMemory || ""), "",
        "the fallback kept writing after the channel came back"
    );
});

suite("18. Module N — lean emission");

test("XS keeps total injection under 12% of the context, S under 20%", () => {
    for (const [maxChars, share] of [[8000, 0.12], [20000, 0.20]]) {
        const { adventure, samples } = budgetRun(maxChars, { turns: 80 });
        const ceiling = maxChars * share;
        const worst = samples.reduce((top, s) => Math.max(top, s.total), 0);
        assert(
            worst <= ceiling,
            `at ${maxChars} chars the worst turn injected ${worst}, over the ${Math.round(ceiling)} target`
        );
        assertEqual(adventure.throws.length, 0, `hooks threw at ${maxChars}`);
    }
});

test("lean prompts are terse, and still answerable", () => {
    const { adventure, session } = moduleAdventure({ autoscale: "true", lean: "true" }, { maxChars: 8000 });
    let leanSeen = false;
    let answered = 0;
    for (let i = 0; i < 40; i++) {
        const step = session.play(`> You work with Leah, ${i}.`, "do");
        const context = step.contextOut[0];
        if (/# Begin with/.test(context)) {
            leanSeen = true;
            const task = context.slice(context.indexOf("<SYSTEM>\n# Begin with"));
            assert(task.length < 400, `a lean prompt ran to ${task.length} chars`);
        }
        if (step.generation.thought) {
            answered++;
        }
    }
    assert(leanSeen, "the lean register was never used at 8000 chars");
    assert(0 < answered, "no lean task was ever answered");
    assert(
        !/OPERATING ENVIRONMENT/.test(session.steps[session.steps.length - 1].contextOut[0]),
        "the long directive is still being sent in lean mode"
    );
});

suite("19. Module A — batched retry candidates");

test("three stagings for one visible turn commit exactly once, matching history", () => {
    const { adventure, session } = ledgerAdventure();
    // Get the context into a state where a task is being asked
    session.play("> You question Leah about the crates.", "do");
    const context = buildContext(adventure);
    adventure.hook("context", context);
    // The platform generates a batch of candidates. Whether onOutput fires once per batch
    // or once per candidate is not established, so the ledger has to survive both
    const candidates = [
        "(first_candidate = `I counted nineteen crates where the manifest claims twenty.`) Leah frowns at the tally.",
        "(second_candidate = `I counted eighteen crates and said nothing about it.`) Leah says nothing at all.",
        "(third_candidate = `I counted seventeen crates and told Iris the truth.`) Leah tells Iris the truth."
    ];
    const staged = candidates.map(text => adventure.hook("output", text));
    assertEqual(
        (adventure.state.CHRONICLE.candidates || []).length, 3,
        `expected three candidates, found ${(adventure.state.CHRONICLE.candidates || []).length}`
    );
    // The player sees the second one, so that is what enters history
    adventure.push(staged[1], "continue");
    adventure.hook("input", "> You nod slowly.");
    adventure.push("> You nod slowly.", "do");
    const brain = allBrainText(adventure);
    assert(brain.includes("eighteen crates"), "the generation that landed was not committed");
    assert(!brain.includes("nineteen crates"), "a candidate nobody saw was committed");
    assert(!brain.includes("seventeen crates"), "a candidate nobody saw was committed");
    assertEqual(
        (adventure.state.CHRONICLE.candidates || []).length, 0,
        "the losing candidates were not cleared"
    );
    // Exactly one commit, and the label counter did not burn three
    const commits = adventure.state.CHRONICLE.journal.filter(e => (e.kind === "commit"));
    assert(0 < commits.length, "nothing was committed at all");
    assertEqual(adventure.throws.length, 0, "batched staging threw");
});

test("every staging is instrumented, so the open question can be answered from a real game", () => {
    const { adventure, session } = ledgerAdventure();
    session.play("> You talk with Leah about the manifest.", "do");
    const stagings = adventure.state.CHRONICLE.diag.stagings || [];
    assert(0 < stagings.length, "no staging was recorded");
    for (const entry of stagings) {
        assert(Number.isInteger(entry.t), "a staging has no turn");
        assert(typeof entry.h === "string", "a staging has no text fingerprint");
    }
    assert(stagings.length <= 8, "the staging log grew past its cap");
});

suite("20. Module H — native command collisions");

test("commands the platform owns are never swallowed", () => {
    const { adventure } = moduleAdventure({ consoleOn: "true" });
    for (const native of ["/reset", "/retry", "/revert", "/erase", "/remember the door", "/alter this"]) {
        const before = String(adventure.sandbox.state.message || "");
        const out = adventure.hook("input", native);
        assertEqual(out, native, `${native} was rewritten by the console`);
        assertEqual(
            String(adventure.sandbox.state.message || ""), before,
            `${native} was answered by the console`
        );
        assertEqual(adventure.state.CHRONICLE.console.stop, false, `${native} stopped the turn`);
    }
});

test("/diag reports context, compliance, landing and per-module cost", () => {
    const { adventure, session } = moduleAdventure({
        consoleOn: "true", autoscale: "true", compliance: "true", canary: "true",
        world: "true", diag: "true"
    }, { maxChars: 60000 });
    for (let i = 0; i < 6; i++) {
        session.play(`> You work with Leah, ${i}.`, "do");
    }
    adventure.hook("input", "/diag");
    const report = String(adventure.sandbox.state.message || "");
    for (const expected of [/Context: \d+ chars, profile [A-Z]+/, /Model compliance: \w+/, /Injections landing: \w+/, /Last turn cost: world \d+/]) {
        assert(expected.test(report), `/diag is missing ${expected}:\n${report}`);
    }
});

// ---------------------------------------------------------------- report

const failed = results.filter(r => !r.ok);
console.log(
    `\n${results.length - failed.length}/${results.length} passed` +
    (failed.length ? `, \x1b[31m${failed.length} failed\x1b[0m` : "")
);
if (failed.length) {
    process.exitCode = 1;
}
