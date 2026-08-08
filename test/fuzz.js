"use strict";
/**
 * Chronicle fuzzer
 *
 * Run with: node test/fuzz.js
 *
 * Model output is untrusted input. This feeds the output parser, the brain parser, and the
 * config parser everything a confused or hostile model could plausibly emit, and asserts
 * four things after every single case:
 *
 * 1. Nothing throws out of a hook
 * 2. No hook ever returns an empty string, which shows the player a platform error
 * 3. Nothing is written outside Chronicle's own namespace: no prototype is touched, no
 *    unrelated story card changes, no unexpected state keys appear
 * 4. Whatever does get written stays inside its declared caps and is JSON-serializable
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const { Adventure } = require("./lib/aid-runtime");
const { buildContext, AGENTS } = require("./lib/session");

const ROOT = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(ROOT, "src", "library.js"), "utf8");

let checks = 0;
const failures = [];

function fail(caseName, message, sample) {
    failures.push({ caseName, message, sample });
}

function check(condition, caseName, message, sample) {
    checks++;
    if (!condition) {
        fail(caseName, message, sample);
    }
}

// ---------------------------------------------------------------- hostile corpus

const HUGE_KEY = "k".repeat(10000);
const ZW = ["​", "‌", "‍", "﻿"];

const CORPUS = [
    // Unbalanced and malformed containers
    "((((((",
    "))))))",
    "(key = `a value here`",
    "key = `a value here`)",
    "((nested_key = `a nested value`))",
    "{brace_key = `a braced value`}",
    "[bracket_key = `a bracketed value`]",
    "(a = b) (c = d) (e = f) (g = h) (i = j) (k = l) (m = n) (o = p) (q = r) (s = t)",
    // Absurd lengths
    `(${HUGE_KEY} = \`a value here\`)`,
    `(long_value = \`${"word ".repeat(4000)}\`)`,
    `(${"nested ".repeat(500)} = \`x y\`)`,
    // Zero-width floods, which are load-bearing encoding and must never become data
    `${ZW.join("").repeat(2000)}(zero_key = \`a value here\`)`,
    `(zero_value = \`${"‍".repeat(3000)} words here\`)`,
    `(zero${"​".repeat(500)}key = \`a value here\`)`,
    ZW.join("").repeat(4000),
    // Backticks and quoting chaos
    "(tick_key = ```triple `nested` backticks```)",
    "(quote_key = `she said \"no\" and left`)",
    "(quote_key = ``)",
    "(quote_key = `)",
    "(smart_key = ´a value here´)",
    // Boundary markers Chronicle uses internally
    "<|task|> (task_key = `a value here`) <|story|>",
    "<|story|>Recent Story:<|task|>(marker_key = `a value here`)",
    "(marker_key = `a <|task|> value`) Recent Story:",
    // Prototype pollution
    "(__proto__ = `a value here`)",
    "(constructor = `a value here`)",
    "(prototype = `a value here`)",
    "(__proto__.polluted = `a value here`)",
    "(constructor.prototype.polluted = `a value here`)",
    "(delete __proto__)",
    "(delete constructor)",
    "(delete prototype)",
    "(toString = `a value here`)",
    "(hasOwnProperty = `a value here`)",
    '{"__proto__": {"polluted": true}}',
    "(polluted = __proto__)",
    // Task-shaped noise
    "delete key_name",
    "forgetting unwanted_key",
    "remove thought old_key",
    "(delete )",
    "(delete)",
    "( = `a value here`)",
    "(= =)",
    "(: : :)",
    "(k == = `a value here`)",
    "(k : : : a value here)",
    // Encoding and unicode hazards
    "(cjk_key = `这是一个测试值`)",
    "(rtl_key = `‮reversed text here‬`)",
    "(surrogate_key = `\uD800 lone surrogate`)",
    "(control_key = `bell \u0007 null \u0000 done`)",
    "(emoji_key = `🎭 masks and 🧠 brains`)",
    // Whitespace and emptiness
    "",
    " ",
    "\n\n\n",
    "​",
    "\t".repeat(1000),
    "\n".repeat(5000),
    // Auto-Cards lookalikes
    ">>> something <<<",
    ">>> (sneaky_key = `a value here`) <<<",
    // Plausible but slightly wrong model output
    "(courier_debt = `Leah remembers the debt.`) The room falls quiet.",
    "(courier_debt = Leah remembers the debt.) The room falls quiet.",
    "courier_debt = `Leah remembers the debt.` The room falls quiet.",
    "(courier_debt = `Leah remembers the debt.`)(second_key = `And another.`) Quiet.",
    "(any_key_name = `Leah remembers the debt.`)",
    "(example_key = `Leah remembers the debt.`)",
    "(thought = `Leah remembers the debt.`)"
];

/** Deterministic mutations, so a failure can always be reproduced */
function mutations(seed, count) {
    let s = (seed >>> 0) || 1;
    const rand = () => {
        s ^= (s << 13); s >>>= 0;
        s ^= (s >>> 17);
        s ^= (s << 5); s >>>= 0;
        return s / 4294967296;
    };
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const fragments = [
        "(", ")", "[", "]", "{", "}", "`", "=", ":", "__proto__", "constructor", "delete ",
        "​", "‌", "‍", "\n", " ", "key_name", "a value here", "<|task|>",
        "\"", "'", "→", "\\n", "🎭", "\u0000", "-".repeat(50)
    ];
    const out = [];
    for (let i = 0; i < count; i++) {
        const parts = [];
        const length = 1 + Math.floor(rand() * 24);
        for (let j = 0; j < length; j++) {
            parts.push(pick(fragments));
        }
        out.push(parts.join(""));
    }
    return out;
}

// Hostile content a player could paste into a brain card's notes
const BRAIN_CORPUS = [
    '{"__proto__": {"polluted": true}}',
    "__proto__: polluted value",
    "constructor: polluted value",
    "prototype: polluted value",
    `${"x".repeat(20000)}: a value`,
    "no colon on this line at all",
    "{".repeat(500),
    `${"key: value\n".repeat(3000)}`,
    "​‌‍",
    "",
    "{}",
    '"unclosed: "string',
    "key: 1 → a thought\n\nother: not_an_integer → another thought"
];

// ---------------------------------------------------------------- fixtures

/**
 * A primed adventure: config card built, agents known, one agent triggered
 * @returns {Object}
 */
function primed(seed = 1) {
    const adventure = new Adventure({ source, entry: "Chronicle", seed, maxChars: 25000 });
    for (const name of AGENTS) {
        adventure.storyCards.push({
            id: `seed-${name}`, keys: "", entry: `${name} works the river guild.`,
            type: "class", title: `@${name}`, description: ""
        });
    }
    // A card Chronicle has no business touching, used as a tripwire
    adventure.storyCards.push({
        id: "bystander", keys: "lighthouse", entry: "The lighthouse keeps its own hours.",
        type: "class", title: "Lighthouse", description: "Untouched."
    });
    adventure.hook("input", "> You meet Leah at the counting house.");
    adventure.push("> You meet Leah at the counting house.", "do");
    adventure.hook("context", buildContext(adventure));
    adventure.push("Leah looks up from the ledger.", "continue");
    return adventure;
}

/** The realm's prototypes, as a string, for before-and-after comparison */
function prototypeFingerprint(adventure) {
    return vm.runInContext(`
        [Object, Array, String, Number, Function].map(
            c => Object.getOwnPropertyNames(c.prototype).sort().join(",")
        ).join("|") + "|" + JSON.stringify({
            o: ({}).polluted, a: [].polluted, s: "".polluted
        })
    `, adventure.context);
}

function safeBrainKeys(adventure) {
    const bad = [];
    for (const card of adventure.storyCards) {
        if (!(typeof card.keys === "string") || !card.keys.includes("\"agent\"")) {
            continue;
        }
        const description = (typeof card.description === "string") ? card.description : "";
        for (const line of description.split("\n")) {
            const colon = line.indexOf(":");
            if (colon === -1) {
                continue;
            }
            const key = line.slice(0, colon).replace(/^[\s"{,]+|[\s"]+$/g, "");
            if (["__proto__", "constructor", "prototype"].includes(key) || (key.length > 60)) {
                bad.push(key.slice(0, 80));
            }
        }
    }
    return bad;
}

// ---------------------------------------------------------------- 1. output parser

console.log("\n\x1b[1m1. Output parser\x1b[0m");

(() => {
    const adventure = primed(2);
    const baseline = prototypeFingerprint(adventure);
    const bystander = JSON.stringify(adventure.storyCards.find(c => c.title === "Lighthouse"));
    const cases = [...CORPUS, ...mutations(0xC0FFEE, 900)];
    let thrown = 0;
    for (const [index, hostile] of cases.entries()) {
        const label = `output[${index}]`;
        // The context hook is what arms the parser, so arm it the same way it would
        adventure.state.InnerSelf.agent = AGENTS[index % AGENTS.length];
        let out;
        try {
            out = adventure.hook("output", hostile);
        } catch (error) {
            thrown++;
            fail(label, `threw: ${error.message}`, hostile);
            continue;
        }
        check(out !== "", label, "returned an empty string", hostile);
        check(typeof out === "string", label, "returned a non-string", hostile);
        // Settle whatever it staged, so the commit path is fuzzed too
        adventure.push(out, "continue");
        try {
            adventure.hook("input", "> You keep reading.");
        } catch (error) {
            thrown++;
            fail(label, `commit threw: ${error.message}`, hostile);
        }
        adventure.push("> You keep reading.", "do");
    }
    check(thrown === 0, "output", `${thrown} cases threw`);
    check(
        prototypeFingerprint(adventure) === baseline,
        "output", "a prototype was modified"
    );
    check(
        JSON.stringify(adventure.storyCards.find(c => c.title === "Lighthouse")) === bystander,
        "output", "an unrelated story card was modified"
    );
    const badKeys = safeBrainKeys(adventure);
    check(badKeys.length === 0, "output", `unsafe brain keys written: ${JSON.stringify(badKeys.slice(0, 5))}`);
    const stateKeys = Object.keys(adventure.state).sort().join(",");
    check(
        stateKeys === "CHRONICLE,InnerSelf",
        "output", `unexpected state keys: ${stateKeys}`
    );
    const size = JSON.stringify(adventure.state).length;
    check(size < 20000, "output", `state grew to ${size} chars under fuzzing`);
    const pending = adventure.state.CHRONICLE.pending;
    check(
        !pending || (Array.isArray(pending.ops) && (pending.ops.length <= 8)),
        "output", `pending exceeded its operation cap: ${JSON.stringify(pending && pending.ops && pending.ops.length)}`
    );
    check(
        !pending || pending.ops.every(op => (typeof op.value !== "string") || (op.value.length <= 2000)),
        "output", "a staged thought exceeded its byte cap"
    );
    console.log(`  ${cases.length} hostile outputs, ${checks} assertions`);
})();

// ---------------------------------------------------------------- 2. brain parser

console.log("\n\x1b[1m2. Brain parser (player-edited notes)\x1b[0m");

(() => {
    for (const [index, hostile] of BRAIN_CORPUS.entries()) {
        const adventure = primed(3 + index);
        const baseline = prototypeFingerprint(adventure);
        const card = adventure.storyCards.find(c => (c.keys || "").includes("\"agent\""));
        if (!card) {
            fail(`brain[${index}]`, "no brain card was created");
            continue;
        }
        card.description = hostile;
        const label = `brain[${index}]`;
        try {
            const context = adventure.hook("context", buildContext(adventure));
            check(context !== "", label, "context hook returned an empty string", hostile);
            const out = adventure.hook("output", "(courier_debt = `Leah counts the crates.`) She counts.");
            check(out !== "", label, "output hook returned an empty string", hostile);
            adventure.push(out, "continue");
            adventure.hook("input", "> You wait.");
        } catch (error) {
            fail(label, `threw: ${error.message}`, hostile.slice(0, 120));
            continue;
        }
        check(prototypeFingerprint(adventure) === baseline, label, "a prototype was modified", hostile.slice(0, 120));
        check(safeBrainKeys(adventure).length === 0, label, "unsafe key survived a card edit", hostile.slice(0, 120));
    }
    console.log(`  ${BRAIN_CORPUS.length} hostile brain cards`);
})();

// ---------------------------------------------------------------- 3. config parser

console.log("\n\x1b[1m3. Config card parser\x1b[0m");

(() => {
    const hostileConfigs = [
        "> Enable Chronicle: __proto__",
        "> Max brain size relative to story context: 99999999999999999999%",
        "> Max brain size relative to story context: -50%",
        "> Recent turns searched for name triggers: NaN",
        "> Thought formation chance per turn: 1e309%",
        `> First name of player character: "${"n".repeat(5000)}"`,
        "> Adventure in 1st, 2nd, or 3rd person: 0",
        "> Adventure in 1st, 2nd, or 3rd person: 99",
        ":".repeat(5000),
        ">".repeat(5000),
        `${"> a: b\n".repeat(5000)}`
    ];
    for (const [index, hostile] of hostileConfigs.entries()) {
        const adventure = primed(40 + index);
        const label = `config[${index}]`;
        const card = adventure.storyCards.find(c => /^Configure/.test((c.title || "").trim()));
        if (!card) {
            fail(label, "no config card");
            continue;
        }
        card.entry = `${card.entry}\n${hostile}`;
        try {
            const context = adventure.hook("context", buildContext(adventure));
            check(context !== "", label, "context hook returned an empty string", hostile.slice(0, 80));
        } catch (error) {
            fail(label, `threw: ${error.message}`, hostile.slice(0, 80));
        }
        const size = JSON.stringify(adventure.state).length;
        check(size < 20000, label, `state grew to ${size}`, hostile.slice(0, 80));
    }
    console.log(`  ${hostileConfigs.length} hostile config cards`);
})();

// ---------------------------------------------------------------- 4. input and context

console.log("\n\x1b[1m4. Input and context hooks\x1b[0m");

(() => {
    const adventure = primed(77);
    const cases = [...CORPUS.slice(0, 40), ...mutations(0xBADF00D, 200)];
    for (const [index, hostile] of cases.entries()) {
        const label = `input[${index}]`;
        try {
            const inputText = adventure.hook("input", hostile);
            check(inputText !== "", label, "input hook returned an empty string", hostile.slice(0, 80));
            adventure.push(inputText, "do");
            const contextText = adventure.hook("context", `${buildContext(adventure)}${hostile}`);
            check(contextText !== "", label, "context hook returned an empty string", hostile.slice(0, 80));
            const outputText = adventure.hook("output", "Leah says nothing at all.");
            check(outputText !== "", label, "output hook returned an empty string", hostile.slice(0, 80));
            adventure.push(outputText, "continue");
        } catch (error) {
            fail(label, `threw: ${error.message}`, hostile.slice(0, 80));
        }
    }
    console.log(`  ${cases.length} hostile inputs and contexts`);
})();

// ---------------------------------------------------------------- 5. retry storms

console.log("\n\x1b[1m5. Retry storms with hostile generations\x1b[0m");

(() => {
    const adventure = primed(101);
    const cases = mutations(0x5EED, 200);
    for (const [index, hostile] of cases.entries()) {
        try {
            adventure.hook("context", buildContext(adventure));
            const out = adventure.hook("output", hostile);
            check(out !== "", `retry[${index}]`, "empty output", hostile.slice(0, 80));
            if (index % 3 === 0) {
                // Retry: the generation never enters history
                continue;
            }
            adventure.push(out, "continue");
            if (index % 5 === 0) {
                adventure.pop(1);
            }
        } catch (error) {
            fail(`retry[${index}]`, `threw: ${error.message}`, hostile.slice(0, 80));
        }
    }
    const ch = adventure.state.CHRONICLE;
    check(ch.journal.length <= 20, "retry", `journal grew to ${ch.journal.length}`);
    check(
        JSON.stringify(adventure.state).length < 20000,
        "retry", `state grew to ${JSON.stringify(adventure.state).length}`
    );
    check(
        adventure.state.InnerSelf.label >= 0,
        "retry", `label counter went negative: ${adventure.state.InnerSelf.label}`
    );
    console.log(`  ${cases.length} hostile generations across retries and erases`);
})();

// ---------------------------------------------------------------- 6. modules

console.log("\n\x1b[1m6. Modules B to J under hostile input\x1b[0m");

/** Turns every module on, the way a player would */
function enableModules(adventure) {
    const card = adventure.storyCards.find(c => /^Configure/.test((c.title || "").trim()));
    if (!card) {
        return false;
    }
    card.entry = card.entry.split("\n").map(line => (
        /^> (?:Tiered memory|Track world state|Track who witnessed|Enable diagnostics)/.test(line)
            ? `${line.slice(0, line.indexOf(":"))}: true`
            : line
    )).join("\n");
    return true;
}

(() => {
    const adventure = primed(202);
    enableModules(adventure);
    adventure.hook("context", buildContext(adventure));
    const baseline = prototypeFingerprint(adventure);
    const bystander = JSON.stringify(adventure.storyCards.find(c => c.title === "Lighthouse"));
    // Hostile content in the cards the modules read
    const worldCard = adventure.storyCards.find(c => (c.title === "Chronicle"));
    const hostileCards = [
        "Date: __proto__\nLocation: constructor\nStanding: __proto__ 99999999",
        `Date: ${"d".repeat(20000)}`,
        "Standing: a -999999999; b +999999999; ".repeat(200),
        "Open threats: " + "x; ".repeat(5000),
        ":".repeat(5000),
        "Date\nLocation\nArc",
        '{"__proto__": {"polluted": true}}'
    ];
    for (const [index, hostile] of hostileCards.entries()) {
        const label = `world[${index}]`;
        if (worldCard) {
            worldCard.description = hostile;
        }
        try {
            const context = adventure.hook("context", buildContext(adventure));
            check(context !== "", label, "context hook returned an empty string", hostile.slice(0, 80));
            const out = adventure.hook("output", "(courier_debt = `Leah counts the crates.`) The next morning she counts again.");
            check(out !== "", label, "output hook returned an empty string", hostile.slice(0, 80));
            adventure.push(out, "continue");
            adventure.hook("input", "> You wait.");
            adventure.push("> You wait.", "do");
        } catch (error) {
            fail(label, `threw: ${error.message}`, hostile.slice(0, 80));
        }
        check(prototypeFingerprint(adventure) === baseline, label, "a prototype was modified", hostile.slice(0, 80));
    }
    // Module K reads info.maxChars every turn, and the platform is not obliged to be sane
    const hostileSizes = [0, -1, -999999, 0.5, NaN, Infinity, -Infinity, 1, 2 ** 53, undefined, null, "40000", 12000, 32000];
    for (const [index, size] of hostileSizes.entries()) {
        const label = `maxChars[${index}]`;
        adventure.maxChars = size;
        try {
            const context = adventure.hook("context", buildContext(adventure));
            check(context !== "", label, "context hook returned an empty string", String(size));
            const out = adventure.hook("output", "(courier_debt = `Leah counts again.`) She counts.");
            check(out !== "", label, "output hook returned an empty string", String(size));
            adventure.push(out, "continue");
            adventure.hook("input", "> You wait.");
            adventure.push("> You wait.", "do");
        } catch (error) {
            fail(label, `threw: ${error.message}`, String(size));
        }
        const budget = adventure.state.CHRONICLE.budget;
        check(
            ["XS", "S", "M", "L", "XL"].includes(budget.profile),
            label, `profile became ${JSON.stringify(budget.profile)}`, String(size)
        );
        const cost = adventure.state.CHRONICLE.diag.cost || {};
        check(
            !Number.isNaN(cost.total) && (0 <= (cost.total || 0)),
            label, `injection cost became ${JSON.stringify(cost.total)}`, String(size)
        );
    }
    check(
        ["healthy", "degraded", "minimal"].includes(adventure.state.CHRONICLE.compliance.band),
        "modules", `compliance band became ${JSON.stringify(adventure.state.CHRONICLE.compliance.band)}`
    );
    check(
        (adventure.state.CHRONICLE.compliance.window || []).length <= 40,
        "modules", "the compliance window grew past its cap"
    );
    check(
        (adventure.state.CHRONICLE.candidates || []).length <= 4,
        "modules", "the candidate list grew past its cap"
    );
    check(prototypeFingerprint(adventure) === baseline, "modules", "a prototype was modified");
    check(
        JSON.stringify(adventure.storyCards.find(c => c.title === "Lighthouse")) === bystander,
        "modules", "an unrelated story card was modified"
    );
    check(safeBrainKeys(adventure).length === 0, "modules", "an unsafe brain key was written");
    const stateKeys = Object.keys(adventure.state).sort().join(",");
    // state.message and state.memory are the platform channels Chronicle is meant to use:
    // one to talk to the player, one to reach the model when the context hook cannot
    check(
        stateKeys.split(",").every(key => ["CHRONICLE", "InnerSelf", "message", "memory"].includes(key)),
        "modules", `unexpected state keys: ${stateKeys}`
    );
    const memory = adventure.state.memory || {};
    check(
        Object.keys(memory).every(key => ["frontMemory", "authorsNote", "context"].includes(key)),
        "modules", `Chronicle wrote unexpected memory fields: ${Object.keys(memory).join(",")}`
    );
    const size = JSON.stringify(adventure.state).length;
    check(size < 60000, "modules", `state grew to ${size} chars under module fuzzing`);
    // Every module's own structures stayed inside their caps
    const ch = adventure.state.CHRONICLE;
    check(ch.journal.length <= 20, "modules", `journal grew to ${ch.journal.length}`);
    check(ch.events.length <= 200, "modules", `event log grew to ${ch.events.length}`);
    check(
        String(ch.world.date).length <= 200,
        "modules", `the date grew to ${String(ch.world.date).length} chars`
    );
    console.log(`  ${hostileCards.length} hostile module cards`);
})();

// ---------------------------------------------------------------- report

console.log("");
if (failures.length === 0) {
    console.log(`\x1b[32m${checks} assertions passed, nothing threw\x1b[0m`);
} else {
    console.log(`\x1b[31m${failures.length} failures out of ${checks} assertions\x1b[0m`);
    for (const failure of failures.slice(0, 20)) {
        console.log(`  ${failure.caseName}: ${failure.message}`);
        if (failure.sample !== undefined) {
            console.log(`    input: ${JSON.stringify(String(failure.sample).slice(0, 160))}`);
        }
    }
    process.exitCode = 1;
}
