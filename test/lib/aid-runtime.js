"use strict";
/**
 * A stub of the AI Dungeon scripting runtime, good enough to replay real adventures
 *
 * Each Adventure owns one vm context holding the globals the platform provides:
 * state, info, history, storyCards, text, stop, addStoryCard, updateStoryCard,
 * removeStoryCard and log. The library source is evaluated once inside that context and
 * its hook function is called per hook, exactly as the three shim scripts would.
 *
 * Two deliberate cruelties make the stub stricter than the platform:
 * - state is JSON round-tripped after every hook, so anything unserializable is destroyed
 *   immediately rather than silently on some later save
 * - Math.random and Date are deterministic, so two adventures fed the same script produce
 *   byte-identical results and any divergence is a real one
 */

const vm = require("vm");

/**
 * xorshift32, seeded, so every run is reproducible
 * @param {number} seed
 * @returns {function(): number} random in [0, 1)
 */
function makeRng(seed) {
    let s = (seed >>> 0) || 0x9e3779b9;
    return () => {
        s ^= (s << 13); s >>>= 0;
        s ^= (s >>> 17);
        s ^= (s << 5); s >>>= 0;
        return s / 4294967296;
    };
}

const FIXED_NOW = Date.UTC(2026, 0, 3, 17, 45, 0);

class Adventure {
    /**
     * @param {Object} options
     * @param {string} options.source - Library source to evaluate
     * @param {string} options.entry - Name of the hook function to call
     * @param {number} [options.seed] - RNG seed
     * @param {number} [options.maxChars] - info.maxChars during the context hook
     * @param {boolean} [options.legacyAddStoryCard] - Emulate a platform whose
     *        addStoryCard ignores {returnCard: true} and just returns a boolean
     */
    constructor({ source, entry, seed = 1, maxChars = 25000, legacyAddStoryCard = false, clockStepMs = 0 }) {
        this.entry = entry;
        this.maxChars = maxChars;
        this.logs = [];
        this.hookCalls = 0;
        this.throws = [];
        let nextId = 1;
        const sandbox = {
            state: {},
            info: { actionCount: 0, memoryLength: 0 },
            history: [],
            storyCards: [],
            text: "",
            stop: false,
            log: (...args) => {
                this.logs.push(args.map(a => String(a)).join(" "));
            },
            addStoryCard: (keys, entry2, type, title, description, options) => {
                const card = {
                    id: `card-${nextId++}`,
                    keys: (typeof keys === "string") ? keys : "",
                    entry: (typeof entry2 === "string") ? entry2 : "",
                    type: (typeof type === "string") ? type : "class",
                    title: (typeof title === "string") ? title : "",
                    description: (typeof description === "string") ? description : ""
                };
                sandbox.storyCards.push(card);
                if (legacyAddStoryCard) {
                    // The documented signature: three arguments, boolean result
                    return true;
                }
                return (options && options.returnCard) ? card : true;
            },
            updateStoryCard: (index, keys, entry2, type, title, description) => {
                const card = sandbox.storyCards[index];
                if (!card) {
                    return false;
                }
                Object.assign(card, { keys, entry: entry2, type, title, description });
                return true;
            },
            removeStoryCard: (index) => {
                if (!Number.isInteger(index) || (index < 0) || (index >= sandbox.storyCards.length)) {
                    return false;
                }
                sandbox.storyCards.splice(index, 1);
                return true;
            },
            __rand: makeRng(seed),
            __now: FIXED_NOW,
            // Date.now() may be made to advance so the time budget can be tested; new Date()
            // stays frozen so story card timestamps remain deterministic
            __clock: (() => {
                let ticks = 0;
                return () => (FIXED_NOW + (clockStepMs * ticks++));
            })()
        };
        this.sandbox = sandbox;
        this.context = vm.createContext(sandbox);
        // Determinism has to be installed inside the realm, not handed in from outside
        vm.runInContext(`
            Math.random = globalThis.__rand;
            const RealDate = Date;
            class FrozenDate extends RealDate {
                constructor(...args) {
                    super(...((args.length === 0) ? [globalThis.__now] : args));
                }
                static now() { return globalThis.__clock(); }
            }
            FrozenDate.parse = RealDate.parse;
            FrozenDate.UTC = RealDate.UTC;
            globalThis.Date = FrozenDate;
        `, this.context, { filename: "determinism.js" });
        vm.runInContext(source, this.context, { filename: "library.js" });
    }

    /**
     * Runs one hook the way the matching shim script would
     * @param {string} hook - "input", "context" or "output"
     * @param {string} text - Incoming text
     * @returns {string} Outgoing text
     */
    hook(hook, text) {
        const sandbox = this.sandbox;
        sandbox.text = text;
        sandbox.stop = false;
        sandbox.info.actionCount = sandbox.history.length;
        // Only the context hook is told the context limits
        if (hook === "context") {
            sandbox.info.maxChars = this.maxChars;
            sandbox.info.memoryLength = 0;
        } else {
            delete sandbox.info.maxChars;
        }
        this.hookCalls++;
        try {
            vm.runInContext(`${this.entry}(${JSON.stringify(hook)});`, this.context, {
                filename: `${hook}.js`,
                timeout: 20000
            });
        } catch (error) {
            this.throws.push({ hook, message: error && error.message });
            throw error;
        }
        // The platform persists state as JSON between turns, so anything that cannot
        // survive that round trip must not survive here either
        sandbox.state = JSON.parse(JSON.stringify(sandbox.state));
        return sandbox.text;
    }

    get state() { return this.sandbox.state; }
    get history() { return this.sandbox.history; }
    get storyCards() { return this.sandbox.storyCards; }

    /**
     * Appends an action the way the platform does once a hook has returned
     * @param {string} text
     * @param {string} type
     * @returns {void}
     */
    push(text, type) {
        this.sandbox.history.push({ text, type });
        this.sandbox.info.actionCount = this.sandbox.history.length;
    }

    /**
     * Removes the most recent actions, as the erase button does
     * @param {number} count
     * @returns {Object[]} the removed actions
     */
    pop(count = 1) {
        const removed = this.sandbox.history.splice(-count, count);
        this.sandbox.info.actionCount = this.sandbox.history.length;
        return removed;
    }

    /**
     * Everything a comparison should care about, minus object identity
     * @returns {Object}
     */
    snapshot() {
        return {
            cards: this.storyCards.map(c => ({
                keys: c.keys, entry: c.entry, type: c.type, title: c.title, description: c.description
            })),
            history: this.history.map(a => ({ text: a.text, type: a.type })),
            state: JSON.parse(JSON.stringify(this.sandbox.state))
        };
    }

    /**
     * The brain cards only, keyed by agent name, for parity checks that must ignore the
     * config card (whose text legitimately differs between Inner Self and Chronicle)
     * @returns {Object}
     */
    brains() {
        const out = {};
        for (const card of this.storyCards) {
            if ((typeof card.keys === "string") && card.keys.includes("\"agent\"")) {
                let agent = "";
                try {
                    agent = JSON.parse(card.keys).agent;
                } catch { /* not ours */ }
                if (typeof agent === "string" && agent !== "") {
                    out[agent] = {
                        entry: card.entry,
                        description: card.description,
                        type: card.type,
                        keys: card.keys
                    };
                }
            }
        }
        return out;
    }
}

module.exports = { Adventure, makeRng, FIXED_NOW };
