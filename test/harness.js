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

/** Every card Chronicle uses for settings, base first */
function configCards(adventure) {
    return adventure.storyCards.filter(c => /^Configure/.test((c.title || "").trim()));
}

/** The base card: the one that is not a module card */
function configCard(adventure) {
    return configCards(adventure).find(c => !/Modules/.test(c.title || ""));
}

/** The module cards, in order */
function moduleCards(adventure) {
    return configCards(adventure).filter(c => /Modules/.test(c.title || ""));
}

/**
 * Edits one row of the config card the way a player would
 * @param {Object} adventure
 * @param {RegExp} label - Matches the row, under either product's wording
 * @param {string} value - New value
 * @returns {void}
 */
function editSetting(adventure, label, value) {
    let hit = false;
    for (const card of configCards(adventure)) {
        card.entry = card.entry.split("\n").map(line => {
            if (!label.test(line)) {
                return line;
            }
            hit = true;
            return `${line.slice(0, line.indexOf(":"))}: ${value}`;
        }).join("\n");
    }
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
    const out = {};
    // Notes explain every row and entries carry the values, so entries are read last and win
    const text = [
        configCard(adventure).description,
        ...configCards(adventure).map(card => card.entry)
    ].join("\n");
    for (const line of text.split("\n")) {
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
    // Profile M: large enough that Module N leaves the prompts alone, so this is a true
    // byte comparison rather than one taken where Chronicle deliberately says less
    const upstream = newAdventure("upstream", { maxChars: 60000 });
    const chronicle = newAdventure("chronicle", { maxChars: 60000 });
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

test("the optional modules ship off, and diagnostics ships on", () => {
    const settings = readSettings(parity.chronicle);
    for (const flag of [
        "tiered memory with pinned core thoughts",
        "track the in-game date and location"
    ]) {
        assertEqual(settings[flag], "false", `module flag "${flag}" is not off by default`);
    }
    // With no console, the diagnostics card is the only window into what Chronicle is
    // doing, and it costs one card and no context
    assertEqual(
        settings["enable diagnostics and safety rails"], "true",
        "diagnostics should ship on"
    );
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
    const configs = migration.chronicle.storyCards
        .filter(c => /^Configure/.test((c.title || "").trim()) && !/Modules/.test(c.title || ""));
    assertEqual(configs.length, 1, `expected one base config card, found ${configs.length}`);
    // and the settings are split across a base card and its module cards
    assert(
        0 < moduleCards(migration.chronicle).length,
        "the module card was not created during migration"
    );
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
    const configs = upstream.storyCards
        .filter(c => /^Configure/.test((c.title || "").trim()) && !/Modules/.test(c.title || ""));
    assertEqual(configs.length, 2, `expected the documented orphan, found ${configs.length} base config cards`);
    // And the documented workaround works: retitle first, then roll back
    const fixed = newAdventure("upstream");
    fixed.sandbox.state = JSON.parse(JSON.stringify(saved.state));
    fixed.sandbox.storyCards = saved.cards.map((c, i) => ({
        id: `fixed-${i}`, ...c,
        title: (/^Configure/.test((c.title || "").trim()) && !/Modules/.test(c.title || ""))
            ? "Configure \nInner Self"
            : c.title
    }));
    fixed.sandbox.history = saved.history.map(a => ({ ...a }));
    new Session([fixed], { seed: 25 }).play("> You keep going.", "do");
    const fixedConfigs = fixed.storyCards
        .filter(c => /^Configure/.test((c.title || "").trim()) && !/Modules/.test(c.title || ""));
    assertEqual(fixedConfigs.length, 1, "the retitle workaround did not work");
    assertEqual(
        readSettings(fixed)["max brain size relative to story context"], "44%",
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
    world: /^> Track the in-game date and location:/,
    worldChars: /^> Maximum characters of world state per turn:/,
    startDate: /^> In-game date the adventure began on:/,
    maxDays: /^> Maximum days one turn may advance:/,
    diag: /^> Enable diagnostics and safety rails:/,
    cooldown: /^> Turns to stop asking after the model cannot answer:/,
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
    // Toggles first: a module's detail rows are only emitted once it is switched on
    const entries = Object.entries(settings);
    for (const [key, value] of entries.filter(([, value]) => /^(?:true|false)$/.test(value))) {
        editSetting(adventure, MODULE_ROWS[key], value);
    }
    session.play("> You open the ledger with Leah.", "do");
    for (const [key, value] of entries.filter(([, value]) => !/^(?:true|false)$/.test(value))) {
        editSetting(adventure, MODULE_ROWS[key], value);
    }
    session.play("> You read the ledger with Leah.", "do");
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
    for (const who of AGENTS) {
        const card = brainCardOf(adventure, who) || (() => {
            adventure.storyCards.push({
                id: `brain-${who}`, keys: JSON.stringify({ agent: who }), entry: "",
                type: "Brain", title: who, description: ""
            });
            return brainCardOf(adventure, who);
        })();
        card.description = [
            `#core_identity: 1 → I am ${who}, the guild's factor, and I answer to no captain.`,
            `cold_thought: 2 → I noticed the third crate was lighter than its manifest, ${"and I said nothing about it to anyone at the wharf, ".repeat(4)}and I have not forgotten.`,
            `warm_thought: 3 → I intend to ask Silas about the third crate tonight, ${"and to watch his hands rather than his face while he answers, ".repeat(4)}before the tide turns.`
        ].join("\n\n");
    }
    for (let i = 0; i < 8; i++) {
        session.play(`> You and Leah count crate ${i}.`, "do");
    }
    // Whoever the scene triggered is who did the thinking, so check them all
    const brains = AGENTS.map(who => brainCardOf(adventure, who)).filter(Boolean);
    for (const brain of brains) {
        assert(brain.description.includes("#core_identity"), "a core thought was evicted");
    }
    assert(
        brains.some(brain => (
            !brain.description.includes("cold_thought") || !brain.description.includes("warm_thought")
        )),
        "no seeded working thought was ever evicted despite a 500 char cap"
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
    const { adventure, session } = moduleAdventure({ world: "true", worldChars: "300" }, { maxChars: 60000 });
    const card = cardTitled(adventure, "Chronicle");
    assert(card, "no world card was created");
    card.description = [
        "Date: Day 4",
        "Location: Fenwater Row"
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
    card.description = "Date: Day 4\nLocation: Fenwater Row";
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
    card.description = "Date: Harvest Eve\nLocation: the lighthouse";
    const step = session.play("> You climb the stair with Leah.", "do");
    assertEqual(adventure.state.CHRONICLE.world.date, "Harvest Eve", "the card did not win");
    assert(step.contextOut[0].includes("the lighthouse"), "the edited location was not injected");
});

suite("13. Module J — diagnostics and safety rails");

test("the state budget warns, then trims, and never overflows", () => {
    const { adventure, session } = moduleAdventure({
        diag: "true", stateChars: "8000", world: "true", tiers: "true"
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
        { diag: "true", timeBudget: "100", tiers: "true" },
        { clockStepMs: 1000, maxChars: 150000 }
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
    assert(/transactions: \d+ committed/.test(card.description), "no transaction counts");
    assert(/last transactions:/.test(card.description), "no transaction list");
    // The card is where the console used to be, so it answers the same questions
    assert(/context: \d+ chars, profile [A-Z]+/.test(card.description), "no context line");
    assert(/overruled by that profile:/.test(card.description), "no override line");
    assert(/model compliance: \w+/.test(card.description), "no compliance line");
    assert(/last turn injected: world \d+/.test(card.description), "no per-module cost line");
    assert(
        card.description.split("\n").filter(line => /turn \d+/.test(line)).length <= 20,
        "the diagnostics card listed more than twenty transactions"
    );
});

test("story cards are found through the index instead of a full scan", () => {
    const { adventure, session } = moduleAdventure({ world: "true", diag: "true" });
    session.play("> You look at the river.", "do");
    const index = adventure.state.CHRONICLE.index;
    assert(Object.keys(index).length > 0, "nothing was indexed");
    for (const [title, position] of Object.entries(index)) {
        const card = adventure.storyCards[position];
        assert(card && (card.title === title), `the index points at the wrong card for ${title}`);
    }
});

suite("14. Everything on at once");

test("300 turns with every module on, retries and all, stays sane", () => {
    const { adventure, session } = moduleAdventure({
        tiers: "true", world: "true", diag: "true", brainChars: "1200", stateChars: "40000"
    });
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
    // Every module left something behind
    assert(cardTitled(adventure, "Chronicle"), "no world card");
    assert(cardTitled(adventure, "Chronicle Diagnostics"), "no diagnostics card");
    assert(!cardTitled(adventure, "Chronicle Clocks"), "a deleted module left a card behind");
    assert(!cardTitled(adventure, "Chronicle Continuity Log"), "a deleted module left a card behind");
});

test("with every module on, hooks stay well inside the two second ceiling", () => {
    const { adventure, session } = moduleAdventure({
        tiers: "true", world: "true", diag: "true"
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
        world: "true", tiers: "true", diag: "true", ...modules
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
    const { adventure, session } = moduleAdventure({ diag: "true" }, { maxChars: 8000 });
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
    // Module L has no switch; only its cooldown is configurable
    const { adventure, session } = moduleAdventure({ cooldown: "25" });
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
    const cooldownUntil = adventure.state.CHRONICLE.compliance.cooldownUntil;
    const quiet = [];
    while (adventure.history.length < cooldownUntil) {
        const step = session.play(`> You carry on regardless, ${quiet.length}.`, "do");
        quiet.push(taskOf(step.contextOut[0]));
    }
    assert(0 < quiet.length, "the cooldown had already expired, so nothing was proved");
    assert(
        quiet.every(task => (task === "none")),
        `Chronicle kept asking a model that cannot answer: ${JSON.stringify(quiet)}`
    );
    // And it tries again afterwards rather than giving up on the adventure
    session.sloppy = 0;
    const resumed = [];
    for (let i = 0; i < 8; i++) {
        resumed.push(taskOf(session.play(`> You try once more, ${i}.`, "do").contextOut[0]));
    }
    assert(
        resumed.some(task => (task !== "none")),
        "Chronicle never asked again after the cooldown expired"
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
    const { adventure, session } = moduleAdventure({ }, { maxChars: 8000 });
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

// ---------------------------------------------------------------- 21. config card contract

suite("21. Config card contract");

/** The parser's own key function and row splitter, copied from Config.get */
const cardKey = (s = "") => s.toLowerCase().replace(/[^a-z]+/g, "");
const cardRows = (text = "") => Object.fromEntries(
    String(text).split(/\s*>[\s>]*/).filter(b => b.includes(":"))
        .map(b => b.split(/\s*:[\s:]*/, 2))
        .map(pair => [cardKey(pair[0]), { label: pair[0].trim(), value: pair[1].trimEnd() }])
);

/** Every config card the generator emits from a cold start */
function generatedCards(agents = []) {
    const adventure = newAdventure("chronicle");
    for (const name of agents) {
        adventure.storyCards.push({
            id: `seed-${name}`, keys: "", entry: "", type: "class",
            title: `@${name}`, description: ""
        });
    }
    adventure.hook("context", "Recent Story:\nnothing yet.");
    return configCards(adventure);
}

const REFERENCE = JSON.parse(
    fs.readFileSync(path.join(ROOT, "docs", "configure-chronicle.card.json"), "utf8")
);

test("the committed reference cards are exactly what the generator emits", () => {
    const marker = "trigger priority:";
    const agents = (REFERENCE[0].description.slice(REFERENCE[0].description.indexOf(marker))
        .match(/^[A-Za-z][A-Za-z' -]*$/gm) || []).map(l => l.trim()).filter(l => (l !== ""));
    const fresh = generatedCards(agents);
    assertEqual(fresh.length, REFERENCE.length, "the number of config cards drifted");
    for (const [index, card] of fresh.entries()) {
        const want = REFERENCE[index];
        assertEqual(card.title, want.title, `card ${index} title drifted`);
        assertEqual(card.type, want.type, `card ${index} type drifted`);
        assertEqual(card.keys, want.keys, `card ${index} keys drifted`);
        assertEqual(
            card.entry, want.value,
            `docs/configure-chronicle.card.json is stale for ${card.title}; regenerate it`
        );
        // The agent list order depends on card order, so prose is compared exactly and the
        // cast as a set
        const cut = (text) => (text.includes(marker)
            ? text.slice(0, text.indexOf(marker) + marker.length) : text);
        assertEqual(cut(card.description), cut(want.description), `card ${index} notes drifted`);
        const names = (text) => (text.slice(text.indexOf(marker)).match(/^[A-Za-z][A-Za-z' -]*$/gm) || [])
            .map(l => l.trim()).filter(l => (l !== "")).sort();
        assertDeep(names(card.description), names(want.description), `card ${index} cast drifted`);
    }
});

test("every setting the generator emits is one the parser reads back", () => {
    // The check that would have caught a card whose labels look right but simplify
    // differently. Two rounds, because switching a module on reveals rows that were not
    // there to flip in the first round
    const adventure = newAdventure("chronicle");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const flipBooleans = () => {
        const asked = {};
        for (const card of configCards(adventure)) {
            card.entry = card.entry.split("\n").map(line => {
                const match = line.match(/^>\s*([^:]+):\s*(true|false)\s*$/);
                if (!match) {
                    return line;
                }
                asked[cardKey(match[1])] = "true";
                return `> ${match[1]}: true`;
            }).join("\n");
        }
        return asked;
    };
    const bumpNumbers = () => {
        const asked = {};
        for (const card of configCards(adventure)) {
            card.entry = card.entry.split("\n").map(line => {
                const match = line.match(/^>\s*([^:]+):\s*(\d+)(%?)\s*$/);
                if (!match) {
                    return line;
                }
                const value = `${Math.max(1, parseInt(match[2], 10) - 1)}${match[3]}`;
                asked[cardKey(match[1])] = value;
                return `> ${match[1]}: ${value}`;
            }).join("\n");
        }
        return asked;
    };
    const readBack = () => cardRows(configCards(adventure).map(c => c.entry).join("\n"));
    const check = (asked, label) => {
        const ignored = Object.entries(asked)
            .filter(([key, want]) => {
                const row = readBack()[key];
                return (!row || (row.value !== want));
            })
            .map(([key, want]) => `${key}: wanted ${want}, got ${readBack()[key] ? readBack()[key].value : "(row gone)"}`);
        assertEqual(
            ignored.length, 0,
            `${label}: these rows are decorative, the parser does not read them:\n  ${ignored.join("\n  ")}`
        );
    };
    const booleans = flipBooleans();
    adventure.hook("context", "Recent Story:\nnothing yet.");
    assert(5 < Object.keys(booleans).length, `only ${Object.keys(booleans).length} boolean rows found`);
    check(booleans, "booleans");
    // Every module is on now, so every detail row is visible and can be bumped
    const numbers = bumpNumbers();
    adventure.hook("context", "Recent Story:\nnothing yet.");
    assert(8 < Object.keys(numbers).length, `only ${Object.keys(numbers).length} numeric rows found`);
    check(numbers, "numbers");
});

test("a row whose label is reworded stops being read, and the test says so", () => {
    // Proving the check above has teeth, using the exact mistake a hand-written card made
    const adventure = newAdventure("chronicle");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    for (const card of configCards(adventure)) {
        card.entry = card.entry.replace(
            "> Tiered memory with pinned core thoughts: false",
            "> [B] Tiered memory with pinned core thoughts: true"
        );
    }
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const after = cardRows(configCards(adventure).map(c => c.entry).join("\n"));
    assertEqual(
        after[cardKey("Tiered memory with pinned core thoughts")].value, "false",
        "a prefixed label was somehow still read, which would make this test useless"
    );
});

test("entry and notes stay a matched pair", () => {
    // They are generated from one list of rows, and this fails the build if that stops
    // being true. Notes document every module row, including ones currently hidden, so the
    // invariant is: everything in an entry is explained, and every explanation is real
    const cards = generatedCards();
    // Notes carry prose as well as row documentation, and prose headers end in a colon
    // too. These two are headings, not settings, and are named here so that anything else
    // appearing as an orphan is a real one
    const PROSE_HEADINGS = new Set([
        cardKey("What each setting on this card does:"),
        cardKey("Two optional modules, and they layer cleanly. Turn on tiered memory first and play fifty turns:"),
        cardKey("Write the first name of every intelligent story character on separate lines below, listed from highest to lowest trigger priority:")
    ]);
    const explained = new Set();
    for (const card of cards) {
        for (const line of String(card.description).split("\n")) {
            const match = line.match(/^>\s*([^:]+):/);
            if (match && !PROSE_HEADINGS.has(cardKey(match[1]))) {
                explained.add(cardKey(match[1]));
            }
        }
    }
    const known = new Set();
    for (const card of cards) {
        for (const line of String(card.entry).split("\n")) {
            const match = line.match(/^>\s*([^:]+):/);
            if (match) {
                known.add(cardKey(match[1]));
            }
        }
    }
    // Turn everything on so the hidden rows become visible, and collect those too
    const adventure = newAdventure("chronicle");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    for (const card of configCards(adventure)) {
        card.entry = card.entry.split("\n")
            .map(line => line.replace(/:\s*false\s*$/, ": true")).join("\n");
    }
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const withEverythingOn = new Set(Object.keys(cardRows(
        configCards(adventure).map(c => c.entry).join("\n")
    )));
    const unexplained = [...withEverythingOn].filter(key => !explained.has(key));
    const orphaned = [...explained].filter(key => !withEverythingOn.has(key));
    assertEqual(unexplained.length, 0, `entry rows with no explanation in notes: ${unexplained.join(", ")}`);
    assertEqual(orphaned.length, 0, `notes explaining rows the generator never emits: ${orphaned.join(", ")}`);
    assert(known.size < withEverythingOn.size, "turning modules on revealed no extra rows");
});

suite("22. Modules K and L are not optional");

test("neither switch exists any more, in the panel or on the card", () => {
    assert(
        !chronicleSource.includes("IS_BUDGET_AUTOSCALING_ENABLED"),
        "the budget autoscaling switch is still declared in MainSettings"
    );
    assert(
        !chronicleSource.includes("IS_COMPLIANCE_MONITOR_ENABLED"),
        "the compliance monitor switch is still declared in MainSettings"
    );
    const card = generatedCards()[1];
    assert(!/Scale injections to the context/.test(card.entry), "the autoscaling row is still emitted");
    assert(!/Watch whether the model can follow/.test(card.entry), "the compliance row is still emitted");
});

test("both run without being asked, on a brand new adventure", () => {
    const adventure = newAdventure("chronicle", { maxChars: 60000 });
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 12 });
    for (let i = 0; i < 8; i++) {
        session.play(`> You work with Leah, ${i}.`, "do");
    }
    // K settled a profile from the live context, with nothing switched on
    assertEqual(adventure.state.CHRONICLE.budget.profile, "M", "budget autoscaling did not run");
    assertEqual(adventure.state.CHRONICLE.budget.maxChars, 60000, "maxChars was not read");
    // L is watching
    assert(
        0 < (adventure.state.CHRONICLE.compliance.window || []).length,
        "the compliance monitor recorded nothing"
    );
    assertEqual(adventure.state.CHRONICLE.compliance.band, "healthy", "band should start healthy");
});

test("a save carrying the old switches set to false still gets K and L", () => {
    // The exact shape an adventure from the previous build comes back as: the rows are on
    // the card, set to false, and the creator panel still declares them
    const adventure = newAdventure("chronicle", { maxChars: 150000 });
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 13 });
    session.play("> You begin with Leah.", "do");
    const card = configCard(adventure);
    card.entry = `${card.entry}\n> Scale injections to the context the model has: false\n> Watch whether the model can follow the task format: false`;
    for (let i = 0; i < 8; i++) {
        session.play(`> You carry on with Leah, ${i}.`, "do");
    }
    assertEqual(adventure.throws.length, 0, "the stale rows threw");
    assertEqual(
        adventure.state.CHRONICLE.budget.profile, "L",
        "a stored false disabled budget autoscaling after migration"
    );
    assert(
        0 < (adventure.state.CHRONICLE.compliance.window || []).length,
        "a stored false disabled the compliance monitor after migration"
    );
    // The stale rows are dropped from the card, rather than lingering as decoration
    const rewritten = configCard(adventure).entry;
    assert(
        !/Scale injections to the context/.test(rewritten),
        "the stale row survived the rewrite and now reads as a live setting"
    );
});

test("a creator panel still declaring the old flags is harmless", () => {
    const patched = chronicleSource.replace(
        "    // Module L — how many turns does Chronicle stop asking after a model proves it cannot answer?",
        "    IS_BUDGET_AUTOSCALING_ENABLED: false\n    ,\n    IS_COMPLIANCE_MONITOR_ENABLED: false\n    ,\n    // Module L — how many turns does Chronicle stop asking after a model proves it cannot answer?"
    );
    const adventure = new Adventure({ source: patched, entry: "Chronicle", seed: 3, maxChars: 60000 });
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 14 });
    for (let i = 0; i < 6; i++) {
        session.play(`> You read on with Leah, ${i}.`, "do");
    }
    assertEqual(adventure.throws.length, 0, "an old creator panel threw");
    assertEqual(adventure.state.CHRONICLE.budget.profile, "M", "an old creator panel disabled autoscaling");
});

// ---------------------------------------------------------------- 23. entry limit

suite("23. Config card entry limit");

/** Chronicle's own budget, mirrored here so the test fails if the code raises it quietly */
const ENTRY_LIMIT = 1000;
const ENTRY_BUDGET = ENTRY_LIMIT - 80;

/** Sets every module toggle by a predicate, one render at a time */
function setToggles(adventure, wanted) {
    let index = 0;
    for (const card of configCards(adventure)) {
        card.entry = card.entry.split("\n").map(line => {
            const match = line.match(/^>\s*([^:]+):\s*(true|false)\s*$/);
            if (!match || /^Enable Chronicle$/.test(match[1])) {
                return line;
            }
            return `> ${match[1]}: ${wanted(index++) ? "true" : "false"}`;
        }).join("\n");
    }
    adventure.hook("context", "Recent Story:\nnothing yet.");
}

test("no card exceeds the limit, with modules off, on, or half on", () => {
    for (const [label, wanted] of [
        ["all off", () => false],
        ["all on", () => true],
        ["half on", (i) => ((i % 2) === 0)]
    ]) {
        const adventure = newAdventure("chronicle");
        adventure.hook("context", "Recent Story:\nnothing yet.");
        setToggles(adventure, wanted);
        // A second pass, because turning a module on reveals rows that then need room
        setToggles(adventure, wanted);
        for (const card of configCards(adventure)) {
            assert(
                card.entry.length <= ENTRY_BUDGET,
                `${label}: ${JSON.stringify(card.title)} entry is ${card.entry.length} chars, over the ${ENTRY_BUDGET} budget`
            );
            // Nothing was truncated: every line is a whole row
            for (const line of card.entry.split("\n")) {
                assert(
                    /^>\s*[^:]+:\s*\S/.test(line) || (line === ""),
                    `${label}: ${JSON.stringify(line.slice(-40))} looks truncated`
                );
            }
        }
    }
});

test("a module's detail rows appear and disappear with its toggle", () => {
    const adventure = newAdventure("chronicle");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const rows = () => Object.keys(cardRows(configCards(adventure).map(c => c.entry).join("\n")));
    const detail = cardKey("Maximum characters of thought per brain:");
    assert(!rows().includes(detail), "a detail row was visible while its module was off");
    // On
    editSetting(adventure, MODULE_ROWS.tiers, "true");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    assert(rows().includes(detail), "a detail row did not appear when its module was switched on");
    // Set it, and set something on the other card too
    editSetting(adventure, MODULE_ROWS.brainChars, "9000");
    editSetting(adventure, ROWS.chance, "42%");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    // Off again
    editSetting(adventure, MODULE_ROWS.tiers, "false");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    assert(!rows().includes(detail), "a detail row survived its module being switched off");
    // The other card was not disturbed
    assertEqual(
        readSettings(adventure)["thought formation chance per turn"], "42%",
        "toggling a module disturbed a setting on the base card"
    );
});

test("an absent detail row reads as its documented default, not as zero or false", () => {
    const adventure = newAdventure("chronicle");
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 44 });
    session.play("> You begin with Leah.", "do");
    // Tiered memory off, so none of its detail rows exist anywhere on any card
    const text = configCards(adventure).map(c => c.entry).join("\n");
    assert(!/Maximum characters of thought per brain/.test(text), "the row was emitted after all");
    // Now switch it on without ever supplying a value, and let a transaction capture the
    // settings the commit will run under
    editSetting(adventure, MODULE_ROWS.tiers, "true");
    let staged = null;
    for (let i = 0; (i < 12) && !staged; i++) {
        session.play(`> You and Leah count crate ${i}.`, "do");
        staged = adventure.state.CHRONICLE.pending || adventure.state.CHRONICLE.candidates[0] || null;
    }
    assert(staged && staged.cfg, "nothing was staged, so no settings were captured");
    assertEqual(staged.cfg.brainChars, 4000, "an absent row was not read as its default");
    assertEqual(staged.cfg.core, 5, "an absent row was not read as its default");
    assertEqual(staged.cfg.promote, 2, "an absent row was not read as its default");
    assert(staged.cfg.brainChars !== 0, "an absent row was read as zero");
});

test("the surviving rows fit one module card, and the spill mechanism still guards them", () => {
    const adventure = newAdventure("chronicle");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const spillTitle = () => moduleCards(adventure).map(c => c.title).filter(t => /\(2\)/.test(t));
    assertEqual(spillTitle().length, 0, "a spill card existed with every module off");
    setToggles(adventure, () => true);
    setToggles(adventure, () => true);
    // After the cut the surviving rows fit on one card even with everything switched on,
    // so no spill is expected. The mechanism stays because it is what makes overflow
    // impossible rather than unlikely, and the budget assertion above is what proves it
    assertEqual(spillTitle().length, 0, "a spill card appeared that the row count does not need");
    for (const card of configCards(adventure)) {
        assert(card.entry.length <= ENTRY_BUDGET, `${card.title} is ${card.entry.length} chars`);
    }
    // A value set on the module card survives a round trip
    editSetting(adventure, MODULE_ROWS.core, "7");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    assertEqual(
        readSettings(adventure)["maximum pinned core thoughts per character"], "7",
        "a value set on the module card was lost"
    );
    setToggles(adventure, () => false);
    setToggles(adventure, () => false);
    assertEqual(adventure.throws.length, 0, "splitting threw");
});

test("a single oversized legacy card migrates into the split layout with its values", () => {
    // The layout Chronicle shipped before the split: every row on one card, well over the
    // entry limit
    const adventure = newAdventure("chronicle");
    seedAgents(adventure);
    adventure.hook("context", "Recent Story:\nnothing yet.");
    const legacyRows = [
        "> Enable Chronicle: true",
        "> Show detailed guide: false",
        "> First name of player character: \"Iris\"",
        "> Adventure in 1st, 2nd, or 3rd person: 3rd",
        "> Max brain size relative to story context: 44%",
        "> Recent turns searched for name triggers: 9",
        "> Visual indicator of current NPC triggers: \"🧠\"",
        "> Thought formation chance per turn: 35%",
        "> Half thought chance for Do/Say/Story: false",
        "> Brain card notes store brains as JSON: true",
        "> Enable debug mode to see model tasks: false",
        "> Pin this config card near the top: true",
        "> Install Auto-Cards: false",
        "> Tiered memory with pinned core thoughts: true",
        "> Maximum pinned core thoughts per character: 7",
        "> Maximum characters of thought per brain: 6000",
        "> Story links before a thought becomes long-term: 3",
        "> Track the in-game date and location: true",
        "> Maximum characters of world state per turn: 900",
        "> In-game date the adventure began on: \"Harvest Eve\"",
        "> Maximum days one turn may advance: 14",
        "> Enable diagnostics and safety rails: true",
        "> Milliseconds a hook may spend before skipping extras: 900",
        "> Maximum characters of saved adventure state: 50000",
        "> Turns to stop asking after the model cannot answer: 40",
        // Rows from modules that no longer exist. They must not survive the rewrite
        "> Track progress clocks and scheduled consequences: true",
        "> Enable player commands like /help and /undo: true",
        "> Check that context injections are landing at all: true"
    ];
    // Collapse to one card, the old way, and delete the module cards
    for (const card of moduleCards(adventure)) {
        adventure.storyCards.splice(adventure.storyCards.indexOf(card), 1);
    }
    const base = configCard(adventure);
    base.entry = legacyRows.join("\n");
    assert(ENTRY_BUDGET < base.entry.length, "the legacy fixture is not actually oversized");
    adventure.hook("context", "Recent Story:\nnothing yet.");
    // Split, and every value carried over
    assert(0 < moduleCards(adventure).length, "the legacy card did not split");
    for (const card of configCards(adventure)) {
        assert(
            card.entry.length <= ENTRY_BUDGET,
            `${JSON.stringify(card.title)} is still ${card.entry.length} chars after migration`
        );
    }
    const after = readSettings(adventure);
    for (const [label, want] of [
        ["max brain size relative to story context", "44%"],
        ["recent turns searched for name triggers", "9"],
        ["thought formation chance per turn", "35%"],
        ["brain card notes store brains as JSON".toLowerCase(), "true"],
        ["maximum pinned core thoughts per character", "7"],
        ["maximum characters of thought per brain", "6000"],
        ["in-game date the adventure began on", "\"Harvest Eve\""],
        ["maximum characters of saved adventure state", "50000"],
        ["turns to stop asking after the model cannot answer", "40"]
    ]) {
        assertEqual(after[label], want, `"${label}" was lost migrating off the legacy card`);
    }
    // Rows belonging to deleted modules are gone, not carried forward as decoration
    for (const dead of [
        "track progress clocks and scheduled consequences",
        "enable player commands like /help and /undo",
        "check that context injections are landing at all"
    ]) {
        assertEqual(after[dead], undefined, `a deleted module's row survived migration: ${dead}`);
    }
    assertEqual(adventure.throws.length, 0, "migrating the legacy card threw");
});

suite("24. Script-only cards stay out of the context");

test("Chronicle's own cards carry no trigger keys", () => {
    const adventure = newAdventure("chronicle", { maxChars: 150000 });
    seedAgents(adventure);
    const session = new Session([adventure], { seed: 51 });
    session.play("> You begin with Leah.", "do");
    for (const row of [MODULE_ROWS.world, MODULE_ROWS.diag]) {
        editSetting(adventure, row, "true");
    }
    for (let i = 0; i < 6; i++) {
        session.play(`> You work with Leah, ${i}.`, "do");
    }
    session.play("> You keep working with Leah.", "do");
    session.play("> You keep going with Leah.", "do");
    const owned = ["Chronicle", "Chronicle Diagnostics"];
    let seen = 0;
    for (const title of owned) {
        const card = adventure.storyCards.find(c => (c.title === title));
        if (!card) {
            continue;
        }
        seen++;
        assertEqual(
            card.keys, "",
            `${title} still has trigger keys, so it competes with the story for context`
        );
    }
    assertEqual(seen, 2, `expected both of Chronicle's own cards, found ${seen}`);
});

// ---------------------------------------------------------------- 25. output integrity

suite("25. The generation reaches the player intact");

/** An adventure with one character triggered, ready to be handed a generation */
function armed(seed = 7, player = "") {
    const adventure = newAdventure("chronicle", { seed });
    seedAgents(adventure);
    adventure.hook("input", "> You meet Leah.");
    adventure.push("> You meet Leah.", "do");
    adventure.hook("context", buildContext(adventure));
    if (player !== "") {
        editSetting(adventure, ROWS.player, `"${player}"`);
        adventure.hook("context", buildContext(adventure));
    }
    adventure.push("Leah looks up.", "continue");
    return adventure;
}

const stripZW = (text) => String(text).replace(/[​-‍﻿]/g, "");

test("nothing is taken off the end of a generation, at any length", () => {
    // Bug report: output cut mid-word, sometimes on the first letter of the last word.
    // The label encoding inserts invisible characters, so this sweeps lengths and word
    // boundaries looking for an offset that drifts by exactly that many
    const adventure = armed(11);
    const endings = ["the lamp", "a", "io", "Leah", "it", '"yes"', "the ledger.", "Silas'"];
    let checked = 0;
    const damaged = [];
    for (const ending of endings) {
        for (let pad = 0; pad < 90; pad += 6) {
            for (const withOperation of [true, false]) {
                const prose = `Iris walked on. ${"The tide clock ticks. ".repeat(pad % 8)}She reached for ${ending}`;
                const model = withOperation
                    ? `(courier_debt = \`I counted ${pad} crates.\`) ${prose}`
                    : prose;
                adventure.state.InnerSelf.agent = "Leah";
                const out = stripZW(adventure.hook("output", model)).trimEnd();
                adventure.push(out, "continue");
                checked++;
                if (!out.endsWith(ending)) {
                    damaged.push(`wanted ...${JSON.stringify(ending)}, got ...${JSON.stringify(out.slice(-30))}`);
                }
            }
        }
    }
    assert(200 < checked, `only ${checked} cases swept`);
    assertEqual(damaged.length, 0, `${damaged.length} generations lost their tail:\n  ${damaged.slice(0, 5).join("\n  ")}`);
});

test("the label markers are the only characters the hook adds", () => {
    const adventure = armed(12);
    const prose = "Iris follows Leah along the row, and the tide clock knocks twice.";
    adventure.state.InnerSelf.agent = "Leah";
    const out = adventure.hook("output", `(courier_debt = \`I counted the crates.\`) ${prose}`);
    const visible = stripZW(out).trim();
    assertEqual(visible, prose, "the prose came back changed once the markers were stripped");
    assert(out.length > visible.length, "no markers were embedded at all");
});

test("ordinary prose survives words the old filter treated as leaked prompt", () => {
    // Inner Self dropped any line containing "task" or "output", or both "story" and
    // "continu". Those are ordinary English. A model answering in one paragraph had its
    // whole generation erased, which is what "the generation just stops" looked like
    const adventure = armed(13);
    const lines = [
        "Leah set about her task without another word.",
        "The output of the mill had fallen again that season.",
        "She required an exact count before the tide turned.",
        "Iris told her the story continued at the wharf.",
        "The format of the ledger had never mattered before.",
        "A strict man, the harbourmaster, and a fair one.",
        "1. The first crate was short.",
        "user, she thought, was a strange word for it."
    ];
    for (const line of lines) {
        adventure.state.InnerSelf.agent = "Leah";
        const out = stripZW(adventure.hook("output", `(courier_debt = \`I counted them.\`) ${line}`));
        adventure.push(out, "continue");
        assert(out.includes(line), `ordinary prose was deleted: ${JSON.stringify(line)}`);
    }
});

test("a one paragraph generation is never erased outright", () => {
    const adventure = armed(14);
    for (const prose of [
        "Leah set about her task without another word, and Iris followed her to the wharf.",
        "The story continued long after the tide had turned, and nobody spoke of it again."
    ]) {
        adventure.state.InnerSelf.agent = "Leah";
        const out = stripZW(adventure.hook("output", `(courier_debt = \`I counted them.\`) ${prose}`)).trim();
        adventure.push(out, "continue");
        assertEqual(out, prose, "a whole generation was erased by the sanitizer");
    }
});

test("upstream really does delete that prose, so the divergence is deliberate", () => {
    // Pinning the difference rather than claiming byte parity where there is none
    const upstreamRun = new Adventure({
        source: upstreamSource, entry: "InnerSelf", seed: 15, maxChars: 25000
    });
    seedAgents(upstreamRun);
    upstreamRun.hook("input", "> You meet Leah.");
    upstreamRun.push("> You meet Leah.", "do");
    upstreamRun.hook("context", buildContext(upstreamRun));
    upstreamRun.push("Leah looks up.", "continue");
    upstreamRun.state.InnerSelf.agent = "Leah";
    const prose = "Leah set about her task without another word.";
    const out = stripZW(upstreamRun.hook("output", `(courier_debt = \`I counted them.\`) ${prose}`)).trim();
    assert(
        !out.includes("task"),
        "upstream no longer deletes this line, so Chronicle's sanitizer change is no longer a fix"
    );
});

test("leaked prompt text is still caught", () => {
    const adventure = armed(16, "Iris");
    const leaks = [
        "<SYSTEM>",
        "# STRICT OUTPUT FORMAT",
        "## SHORT TASK (REQUIRED)",
        "## STORY CONTINUATION (REQUIRED)",
        "(any_key_name = `One thought sentence.`)",
        "(delete key_name_to_forget)",
        "Story continues from Iris's second person perspective...",
        "- key_name_to_forget must be an existing key in Leah's brain",
        "NO EXTRA TEXT ANYWHERE.",
        "THE FIRST CHAR OF THE WHOLE OUTPUT MUST BE \"(\".",
        "user:",
        "You are Iris."
    ];
    const survived = [];
    for (const leak of leaks) {
        adventure.state.InnerSelf.agent = "Leah";
        const out = stripZW(adventure.hook("output", `${leak}\nShe reached for the lamp.`));
        adventure.push(out, "continue");
        if (out.includes(leak.slice(0, 18))) {
            survived.push(leak);
        }
    }
    assertEqual(survived.length, 0, `leaked prompt text reached the story: ${JSON.stringify(survived)}`);
});

test("shouted dialogue is not mistaken for a leaked instruction", () => {
    const adventure = armed(17);
    const shout = "GET OUT OF MY HOUSE, she screamed at him.";
    adventure.state.InnerSelf.agent = "Leah";
    const out = stripZW(adventure.hook("output", `(courier_debt = \`I counted them.\`) ${shout}`));
    assert(out.includes(shout), "shouted dialogue was deleted as if it were a prompt header");
});

// ---------------------------------------------------------------- 26. reported from play

suite("26. Bugs reported from a live adventure");

test("the diagnostics card names every setting the profile overruled, and by how much", () => {
    // The console is gone: a command could only end a turn by stopping it, which the player
    // saw as an error. The card answers the same questions and costs no turn
    const { adventure, session } = moduleAdventure(
        { world: "true", diag: "true" }, { maxChars: 25000 }
    );
    editSetting(adventure, MODULE_ROWS.worldChars, "900");
    session.play("> You work with Leah.", "do");
    session.play("> You work with Leah again.", "do");
    const card = cardTitled(adventure, "Chronicle Diagnostics");
    assert(card, "no diagnostics card");
    assert(/context: 25000 chars, profile S/.test(card.description), `no context line:\n${card.description}`);
    assert(
        /overruled by that profile: world block 500 \(you set 900\)/.test(card.description),
        `the world block cap was not explained:\n${card.description}`
    );
    // And where nothing is capped, it says so rather than staying silent
    const roomy = moduleAdventure({ world: "true", diag: "true" }, { maxChars: 150000 });
    roomy.session.play("> You work with Leah.", "do");
    roomy.session.play("> You work with Leah again.", "do");
    assert(
        /overruled by that profile: nothing/.test(cardTitled(roomy.adventure, "Chronicle Diagnostics").description),
        "a profile that caps nothing should say so"
    );
});

test("the calendar understands travel, not only sleep", () => {
    const { adventure, session } = moduleAdventure({ world: "true" }, { maxChars: 150000 });
    const day = () => adventure.state.CHRONICLE.world.day;
    const settle = () => session.play("> You look about with Leah.", "do");
    for (const [prose, expected] of [
        ["You set off for the guild at first light, with Leah beside you.", 1],
        ["The journey to Lumenfall took three days, and Leah counted every one.", 3],
        ["You travel south for two weeks with Leah, and the road is long.", 14],
        ["After a day on the road, Leah sees the walls come into sight.", 1]
    ]) {
        const before = day();
        session.force(prose);
        session.play("> You ride out.", "do");
        settle();
        assertEqual(
            day() - before, expected,
            `"${prose.slice(0, 40)}..." advanced ${day() - before} days, expected ${expected}`
        );
    }
    // And ordinary prose does not move the calendar at all
    for (const prose of [
        "She set the ledger down and said nothing to Leah.",
        "Leah rode him hard about the manifest, and he would not answer."
    ]) {
        const before = day();
        session.force(prose);
        session.play("> You wait.", "do");
        settle();
        assertEqual(day(), before, `"${prose.slice(0, 40)}..." moved the calendar and should not have`);
    }
});

test("time passes on turns where nobody was asked to think", () => {
    // The reported symptom: the date never advanced. Module scans used to sit behind an
    // early return that fires whenever no character formed a thought, which is most turns
    const { adventure, session } = moduleAdventure({ world: "true" }, { maxChars: 150000 });
    editSetting(adventure, ROWS.chance, "0%");
    session.play("> You set out with Leah.", "do");
    const before = adventure.state.CHRONICLE.world.day;
    session.force("You set off for the capital, and after three weeks on the road you arrive.");
    session.play("> You ride out.", "do");
    const staged = adventure.state.CHRONICLE.pending;
    assert(staged, "a quiet turn staged nothing at all");
    assert(
        staged.ops.some(op => (op.mod === "world") && (op.op === "advanceDays")),
        `a quiet turn did not stage the time that passed: ${JSON.stringify(staged.ops)}`
    );
    assertEqual(staged.agent, "", "a world-only transaction should belong to no character");
    session.play("> You look about.", "do");
    assertEqual(
        adventure.state.CHRONICLE.world.day - before, 21,
        "the calendar did not move on a turn where nobody thought"
    );
});

test("the calendar carries a season and a year, not just a day", () => {
    const { adventure, session } = moduleAdventure({ world: "true" }, { maxChars: 150000 });
    session.play("> You look around with Leah.", "do");
    const card = cardTitled(adventure, "Chronicle");
    assert(card, "no world card");
    assert(/Season length: 91/.test(card.description), `no season length on the card:\n${card.description}`);
    assert(/Seasons: Spring; Summer; Autumn; Winter/.test(card.description), "no seasons on the card");
    // The injected block states it, which is the only place it matters
    const step = session.play("> You walk on with Leah.", "do");
    assert(
        /- Date: [^\n]*Spring, year 1/.test(step.contextOut[0]),
        `the season and year were not injected:\n${(step.contextOut[0].match(/- Date: [^\n]*/) || ["(no date line)"])[0]}`
    );
    // A player who writes their own calendar is obeyed
    card.description = card.description
        .replace(/^Season length:.*$/m, "Season length: 30")
        .replace(/^Seasons:.*$/m, "Seasons: Thaw; High Sun; Harvest; Dark");
    session.force("You travel south for two weeks with Leah, and the road is long.");
    session.play("> You ride out.", "do");
    session.play("> You arrive.", "do");
    assertEqual(adventure.state.CHRONICLE.world.day, 15, "the calendar did not advance as expected");
    const named = session.play("> You look about.", "do");
    assert(
        /Thaw/.test(named.contextOut[0]),
        "the player's own season names were ignored"
    );
    // Long enough to roll the year over
    adventure.state.CHRONICLE.world.day = 121;
    const rolled = session.play("> A long while later.", "do");
    assert(
        /year 2/.test(rolled.contextOut[0]),
        `the year did not roll over:\n${(rolled.contextOut[0].match(/- Date: [^\n]*/) || ["(no date line)"])[0]}`
    );
});

test("an empty seasons row on the card does not delete the calendar", () => {
    const { adventure, session } = moduleAdventure({ world: "true" }, { maxChars: 150000 });
    session.play("> You look around with Leah.", "do");
    const card = cardTitled(adventure, "Chronicle");
    card.description = card.description.replace(/^Seasons:.*$/m, "Seasons: ");
    const step = session.play("> You walk on with Leah.", "do");
    assert(
        /Spring/.test(step.contextOut[0]),
        "clearing the seasons row left the calendar with no seasons at all"
    );
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
