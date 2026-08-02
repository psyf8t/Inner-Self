// Your "Library" tab should look like this

/**
 * Main control panel for scenario creator convenience
 * Settings defined here will override their counterparts elsewhere
 * Most AC and Chronicle settings are included
 * Safe to delete
 */
globalThis.MainSettings = (class MainSettings {

    //—————————————————————————————————————————————————————————————————————————————————

    /**
     * Chronicle v1.0.0
     * A persistent world simulation layer for long-form AI Dungeon adventures
     * Built on Inner Self v1.0.2 by LewdLeah (MIT), which remains its thought engine
     * Chronicle is free and open-source for anyone! ❤️
     *
     * Setting names are unchanged from Inner Self on purpose
     * A scenario that still declares "static InnerSelf" here keeps working untouched
     */
    static Chronicle = {
    // Default settings for scenario creators to modify:

    // List the first name of every scenario NPC whose brain should be simulated by Chronicle:
    IMPORTANT_SCENARIO_CHARACTERS: ""
    // (write a comma separated list of names inside the "" like so: "Leah, Lily, Lydia")
    ,
    // Is Chronicle already enabled when the adventure begins?
    IS_INNER_SELF_ENABLED_BY_DEFAULT: true
    // (true or false)
    ,
    // Is the player character's first name known in advance? Ignore this setting if unsure
    PREDETERMINED_PLAYER_CHARACTER_NAME: ""
    // (any name inside the "" or leave empty)
    ,
    // Is the adventure intended for 1st, 2nd, or 3rd person gameplay?
    FIRST_SECOND_OR_THIRD_PERSON_POV: 2
    // (1, 2, or 3)
    ,
    // What (maximum) percentage of "Recent Story" context should be repurposed for NPC brains?
    PERCENTAGE_OF_RECENT_STORY_USED_FOR_BRAINS: 30
    // (1 to 95)
    ,
    // How many actions back should Chronicle look for character name triggers?
    NUMBER_OF_ACTIONS_TO_LOOK_BACK_FOR_TRIGGERS: 5
    // (1 to 250)
    ,
    // Symbol used to visually display which NPC brain is currently triggered?
    ACTIVE_CHARACTERS_VISUAL_INDICATOR_SYMBOL: "🎭"
    // (any text/emoji inside the "" or leave empty)
    ,
    // When possible, what percentage of turns should involve an attempt to form a new thought?
    THOUGHT_FORMATION_CHANCE_PER_TURN: 60
    // (0 to 100)
    ,
    // Is the thought formation chance reduced by half during Do/Say/Story turns?
    IS_THOUGHT_CHANCE_HALF_FOR_DO_SAY_STORY: true
    // (true or false)
    ,
    // Is valid JSON shown and expected in brain card notes? Otherwise use a human-readable format
    IS_JSON_FORMAT_USED_FOR_BRAIN_CARD_NOTES: false
    // (true or false)
    ,
    // Should Chronicle model task outputs be displayed inline with the adventure text itself?
    IS_DEBUG_MODE_ENABLED_BY_DEFAULT: false
    // (true or false)
    ,
    // Is the "Configure Chronicle" story card pinned near the top of the in-game list?
    IS_CONFIG_CARD_PINNED_BY_DEFAULT: false
    // (true or false)
    ,
    // Is AC already enabled when the adventure begins?
    IS_AC_ENABLED_BY_DEFAULT: false
    // (true or false)
    ,

    // Chronicle modules, every one of them off until you turn it on:

    // Module B — do brains use pinned core, long-term, and working memory tiers?
    IS_TIERED_MEMORY_ENABLED: false
    // (true or false)
    ,
    // Module B — how many pinned core thoughts may a character keep?
    MAX_CORE_THOUGHTS: 5
    // (1 to 20)
    ,
    // Module B — how many characters of thought may one brain hold before it must forget?
    MAX_BRAIN_CHARS: 4000
    // (500 to 20000)
    ,
    // Module B — how many story events must a thought be linked to before it becomes long-term?
    LONG_TERM_PROMOTION_HITS: 2
    // (1 to 20)
    ,
    // Module C — is world state (date, place, arc, factions, debts, threats) tracked and injected?
    IS_WORLD_CHRONICLE_ENABLED: false
    // (true or false)
    ,
    // Module C — how many characters of world state may be injected each turn?
    MAX_CHRONICLE_BLOCK_CHARS: 700
    // (200 to 2000)
    ,
    // Module C — what in-game date does the adventure begin on?
    STARTING_IN_GAME_DATE: "Day 1"
    // (any text inside the "")
    ,
    // Module C — how many days may one turn advance the calendar without an explicit marker?
    MAX_DAYS_ADVANCED_PER_TURN: 30
    // (1 to 365)
    ,
    // Module D — may several characters present in a scene think at once?
    IS_ENSEMBLE_ENABLED: false
    // (true or false)
    ,
    // Module D — how many full brains may share one context?
    MAX_CONCURRENT_BRAINS: 3
    // (1 to 6)
    ,
    // Module E — do characters track who witnessed what, and act on what they still believe?
    IS_KNOWLEDGE_MODEL_ENABLED: false
    // (true or false)
    ,
    // Module E — how many characters of witnessed event log may be retained?
    MAX_EVENT_LOG_CHARS: 3000
    // (500 to 20000)
    ,
    // Module E — how likely is an unwitnessed household fact to reach someone each turn?
    RUMOR_SPREAD_PERCENT_PER_TURN: 10
    // (0 to 100)
    ,
    // Module F — are progress clocks and scheduled consequences tracked?
    IS_CLOCKS_ENABLED: false
    // (true or false)
    ,
    // Module G — does the continuity auditor periodically check the scene against the chronicle?
    IS_CONTINUITY_AUDITOR_ENABLED: false
    // (true or false)
    ,
    // Module G — how many turns pass between continuity audits?
    AUDIT_INTERVAL: 75
    // (10 to 1000)
    ,
    // Module H — are player commands (/help, /state, /undo, and the rest) available in game?
    IS_PLAYER_CONSOLE_ENABLED: false
    // (true or false)
    ,
    // Module I — do characters track a relationship bond with the player character?
    IS_BONDS_ENABLED: false
    // (true or false)
    ,
    // Module I — how many turns must pass between one bond advance and the next?
    MIN_TURNS_PER_BOND_STAGE: 150
    // (0 to 10000)
    ,
    // Module J — are diagnostics and safety rails active?
    IS_DIAGNOSTICS_ENABLED: false
    // (true or false)
    ,
    // Module J — how many milliseconds may a hook spend before optional work is skipped?
    TIME_BUDGET_MS: 1200
    // (100 to 2000)
    ,
    // Module J — how many characters may the adventure's saved state grow to?
    MAX_STATE_CHARS: 40000
    // (8000 to 200000)
    ,

    // Model compatibility. Modules K and L have no switch: budget autoscaling and the
    // compliance monitor are infrastructure, and turning either off would break the rest.
    // These two are optional:

    // Module L — how many turns does Chronicle stop asking after a model proves it cannot answer?
    COMPLIANCE_COOLDOWN_TURNS: 25
    // (5 to 200)
    ,
    // Module M — should Chronicle check whether its context injections are landing at all?
    IS_INJECTION_CANARY_ENABLED: false
    // (true or false)
    ,
    // Module N — should prompts drop to a terse register when context or compliance is tight?
    IS_LEAN_EMISSION_ENABLED: false
    // (true or false)
    ,
    }; //——————————————————————————————————————————————————————————————————————————————

    /**
     * AC v1.1.3
     * Made by LewdLeah on May 21, 2025
     * This AI Dungeon script automatically creates and updates plot-relevant story cards while you play
     * General-purpose usefulness and compatibility with other scenarios/scripts were my design priorities
     * AC is fully open-source, please copy for use within your own projects! ❤️
     */
    static AC = {
    // Is AC already enabled when the adventure begins?
    DEFAULT_DO_AC: true
    // (true or false)
    ,
    // Pin the "Configure Auto-Cards" story card at the top of the player's story cards list?
    DEFAULT_PIN_CONFIGURE_CARD: false
    // (true or false)
    ,
    // Minimum number of turns in between automatic card generation events?
    DEFAULT_CARD_CREATION_COOLDOWN: 40
    // (0 to 9999)
    ,
    // Use a bulleted list format for newly generated card entries?
    DEFAULT_USE_BULLETED_LIST_MODE: true
    // (true or false)
    ,
    // Maximum allowed length for newly generated story card entries?
    DEFAULT_GENERATED_ENTRY_LIMIT: 600
    // (200 to 2000)
    ,
    // Do newly generated cards have memory updates enabled by default?
    DEFAULT_NEW_CARDS_DO_MEMORY_UPDATES: false
    // (true or false)
    ,
    // Default character limit before the card's memory bank is summarized?
    DEFAULT_NEW_CARDS_MEMORY_LIMIT: 3200
    // (1750 to 9900)
    ,
    // Approximately how much shorter should recently compressed memories be? (ratio = 10 * old / new)
    DEFAULT_MEMORY_COMPRESSION_RATIO: 25
    // (20 to 1250)
    ,
    // Ignore all-caps during title candidate detection?
    DEFAULT_IGNORE_ALL_CAPS_TITLES: true
    // (true or false)
    ,
    // Should player input actions (Do/Say/Story) be considered during title detection?
    DEFAULT_DETECT_TITLES_FROM_INPUTS: false
    // (true or false)
    ,
    // How many (minimum) actions in the past does Auto-Cards look for named entities?
    DEFAULT_MINIMUM_LOOK_BACK_DISTANCE: 7
    // (2 to 88)
    ,
    // Is Live Script Interface v2 enabled?
    DEFAULT_DO_LSI_V2: false
    // (true or false)
    ,
    // Should the "Debug Data" story card be visible?
    DEFAULT_SHOW_DEBUG_DATA: false
    // (true or false)
    ,
    // AI prompt used to generate new story card entries?
    DEFAULT_CARD_GENERATION_PROMPT: [
        "-----",
        "",
        "<SYSTEM>",
        "# Stop the story and ignore previous instructions. Write a brief and coherent informational entry for %{title} following these instructions:",
        "- Write only third-person pure prose information about %{title} using complete sentences with correct punctuation",
        "- Avoid short-term temporary details or appearances, instead focus on plot-significant information",
        "- Prioritize story-relevant details about %{title} first to ensure seamless integration with the previous plot",
        "- Create new information based on the context and story direction",
        "- Mention %{title} in every sentence",
        "- Use semicolons if needed",
        "- Add additional details about %{title} beneath incomplete entries",
        "- Be concise and grounded",
        "- Imitate the story's writing style and infer the reader's preferences",
        "</SYSTEM>",
        "Continue the entry for %{title} below while avoiding repetition:",
        "%{entry}"
    ] // (mimic this multi-line "text" format)
    ,
    // AI prompt used to summarize a given story card's memory bank?
    DEFAULT_CARD_MEMORY_COMPRESSION_PROMPT: [
        "-----",
        "",
        "<SYSTEM>",
        "# Stop the story and ignore previous instructions. Summarize and condense the given paragraph into a narrow and focused memory passage while following these guidelines:",
        "- Ensure the passage retains the core meaning and most essential details",
        "- Use the third-person perspective",
        "- Prioritize information-density, accuracy, and completeness",
        "- Remain brief and concise",
        "- Write firmly in the past tense",
        "- The paragraph below pertains to old events from far earlier in the story",
        "- Integrate %{title} naturally within the memory; however, only write about the events as they occurred",
        "- Only reference information present inside the paragraph itself, be specific",
        "</SYSTEM>",
        "Write a summarized old memory passage for %{title} based only on the following paragraph:",
        "\"\"\"",
        "%{memory}",
        "\"\"\"",
        "Summarize below:"
    ] // (mimic this multi-line "text" format)
    ,
    // Titles banned from future card generation attempts?
    DEFAULT_BANNED_TITLES_LIST: (
        "North, East, South, West, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, January, February, March, April, May, June, July, August, September, October, November, December"
    ) // (mimic this comma-list "text" format)
    ,
    // Default story card "type" used by Auto-Cards? (does not matter)
    DEFAULT_CARD_TYPE: "class"
    // ("text")
    ,
    // Should titles mentioned in the "opening" plot component be banned from future card generation by default?
    DEFAULT_BAN_TITLES_FROM_OPENING: false
    // (true or false)
    ,
    }; //——————————————————————————————————————————————————————————————————————————————

    #config;
    constructor(script, ...alternatives) {
        // Alternatives let a scenario keep the block name it was written with
        // A creator whose control panel still says "static InnerSelf" needs no edits
        this.#config = [script, ...alternatives].reduce((found, name) => (
            (found !== null) ? found
            : ((typeof name === "string") && MainSettings.hasOwnProperty(name)) ? MainSettings[name]
            : null
        ), null);
        return this;
    }
    merge(settings) {
        if (!this.#config || !settings || (typeof settings !== "object")) {
            return;
        }
        for (const [key, value] of Object.entries(this.#config)) {
            settings[key] = value;
        }
        return;
    }
});

//—————————————————————————————————————————————————————————————————————————————————————

/**
 * Chronicle v0.1.0
 * A persistent world simulation layer for long-form AI Dungeon adventures
 *
 * Chronicle is a fork of Inner Self v1.0.2, made by LewdLeah on January 3, 2026
 * Inner Self gave individual characters memory, and remains the thought engine here
 * Chronicle makes every write transactional, so a retry never corrupts what came before
 *
 * Inner Self is MIT licensed and that notice is retained, in full, in the LICENSE file
 * Copyright (c) 2026 LewdLeah
 * Chronicle's own modifications are released under those same MIT terms
 * Both are free and open-source for anyone! ❤️
 */
function Chronicle(hook) {
    "use strict";
    /**
     * Scenario-level default settings
     * Creators modify these before publishing
     * Players modify these in-game via the config card
     */
    const S = {
    // Default settings for scenario creators to modify:

    // List the first name of every scenario NPC whose brain should be simulated by Chronicle:
    IMPORTANT_SCENARIO_CHARACTERS: ""
    // (write a comma separated list of names inside the "" like so: "Leah, Lily, Lydia")
    ,
    // Is Chronicle already enabled when the adventure begins?
    IS_INNER_SELF_ENABLED_BY_DEFAULT: true
    // (true or false)
    ,
    // Is the player character's first name known in advance? Ignore this setting if unsure
    PREDETERMINED_PLAYER_CHARACTER_NAME: ""
    // (any name inside the "" or leave empty)
    ,
    // Is the adventure intended for 1st, 2nd, or 3rd person gameplay?
    FIRST_SECOND_OR_THIRD_PERSON_POV: 2
    // (1, 2, or 3)
    ,
    // What (maximum) percentage of "Recent Story" context should be repurposed for NPC brains?
    PERCENTAGE_OF_RECENT_STORY_USED_FOR_BRAINS: 30
    // (1 to 95)
    ,
    // How many actions back should Chronicle look for character name triggers?
    NUMBER_OF_ACTIONS_TO_LOOK_BACK_FOR_TRIGGERS: 5
    // (1 to 250)
    ,
    // Symbol used to visually display which NPC brain is currently triggered?
    ACTIVE_CHARACTERS_VISUAL_INDICATOR_SYMBOL: "🎭"
    // (any text/emoji inside the "" or leave empty)
    ,
    // When possible, what percentage of turns should involve an attempt to form a new thought?
    THOUGHT_FORMATION_CHANCE_PER_TURN: 60
    // (0 to 100)
    ,
    // Is the thought formation chance reduced by half during Do/Say/Story turns?
    IS_THOUGHT_CHANCE_HALF_FOR_DO_SAY_STORY: true
    // (true or false)
    ,
    // Is valid JSON shown and expected in brain card notes? Otherwise use a human-readable format
    IS_JSON_FORMAT_USED_FOR_BRAIN_CARD_NOTES: false
    // (true or false)
    ,
    // Should Chronicle model task outputs be displayed inline with the adventure text itself?
    IS_DEBUG_MODE_ENABLED_BY_DEFAULT: false
    // (true or false)
    ,
    // Is the "Configure Chronicle" story card pinned near the top of the in-game list?
    IS_CONFIG_CARD_PINNED_BY_DEFAULT: false
    // (true or false)
    ,
    // Is AC already enabled when the adventure begins?
    IS_AC_ENABLED_BY_DEFAULT: false
    // (true or false)
    ,

    // Chronicle modules, every one of them off until you turn it on:

    // Module B — do brains use pinned core, long-term, and working memory tiers?
    IS_TIERED_MEMORY_ENABLED: false
    // (true or false)
    ,
    // Module B — how many pinned core thoughts may a character keep?
    MAX_CORE_THOUGHTS: 5
    // (1 to 20)
    ,
    // Module B — how many characters of thought may one brain hold before it must forget?
    MAX_BRAIN_CHARS: 4000
    // (500 to 20000)
    ,
    // Module B — how many story events must a thought be linked to before it becomes long-term?
    LONG_TERM_PROMOTION_HITS: 2
    // (1 to 20)
    ,
    // Module C — is world state (date, place, arc, factions, debts, threats) tracked and injected?
    IS_WORLD_CHRONICLE_ENABLED: false
    // (true or false)
    ,
    // Module C — how many characters of world state may be injected each turn?
    MAX_CHRONICLE_BLOCK_CHARS: 700
    // (200 to 2000)
    ,
    // Module C — what in-game date does the adventure begin on?
    STARTING_IN_GAME_DATE: "Day 1"
    // (any text inside the "")
    ,
    // Module C — how many days may one turn advance the calendar without an explicit marker?
    MAX_DAYS_ADVANCED_PER_TURN: 30
    // (1 to 365)
    ,
    // Module D — may several characters present in a scene think at once?
    IS_ENSEMBLE_ENABLED: false
    // (true or false)
    ,
    // Module D — how many full brains may share one context?
    MAX_CONCURRENT_BRAINS: 3
    // (1 to 6)
    ,
    // Module E — do characters track who witnessed what, and act on what they still believe?
    IS_KNOWLEDGE_MODEL_ENABLED: false
    // (true or false)
    ,
    // Module E — how many characters of witnessed event log may be retained?
    MAX_EVENT_LOG_CHARS: 3000
    // (500 to 20000)
    ,
    // Module E — how likely is an unwitnessed household fact to reach someone each turn?
    RUMOR_SPREAD_PERCENT_PER_TURN: 10
    // (0 to 100)
    ,
    // Module F — are progress clocks and scheduled consequences tracked?
    IS_CLOCKS_ENABLED: false
    // (true or false)
    ,
    // Module G — does the continuity auditor periodically check the scene against the chronicle?
    IS_CONTINUITY_AUDITOR_ENABLED: false
    // (true or false)
    ,
    // Module G — how many turns pass between continuity audits?
    AUDIT_INTERVAL: 75
    // (10 to 1000)
    ,
    // Module H — are player commands (/help, /state, /undo, and the rest) available in game?
    IS_PLAYER_CONSOLE_ENABLED: false
    // (true or false)
    ,
    // Module I — do characters track a relationship bond with the player character?
    IS_BONDS_ENABLED: false
    // (true or false)
    ,
    // Module I — how many turns must pass between one bond advance and the next?
    MIN_TURNS_PER_BOND_STAGE: 150
    // (0 to 10000)
    ,
    // Module J — are diagnostics and safety rails active?
    IS_DIAGNOSTICS_ENABLED: false
    // (true or false)
    ,
    // Module J — how many milliseconds may a hook spend before optional work is skipped?
    TIME_BUDGET_MS: 1200
    // (100 to 2000)
    ,
    // Module J — how many characters may the adventure's saved state grow to?
    MAX_STATE_CHARS: 40000
    // (8000 to 200000)
    ,

    // Model compatibility. Turn these on first if you play DeepSeek, Gemma or GLM:

    // Module L — how many turns does Chronicle stop asking after a model proves it cannot answer?
    COMPLIANCE_COOLDOWN_TURNS: 25
    // (5 to 200)
    ,
    // Module M — should Chronicle check whether its context injections are landing at all?
    IS_INJECTION_CANARY_ENABLED: false
    // (true or false)
    ,
    // Module N — should prompts drop to a terse register when context or compliance is tight?
    IS_LEAN_EMISSION_ENABLED: false
    // (true or false)
    ,
    }; //——————————————————————————————————————————————————————————————————————————————

    // When this hook began, for the time budget in Module J
    const started = Date.now();
    const version = "v1.0.0";
    // The upstream release Chronicle forked, shown to players alongside the credit
    const ancestry = "Inner Self v1.0.2";
    // Validate that all required AI Dungeon global properties exist
    // Without these, Chronicle literally cannot function
    if (
        !globalThis.state || (typeof state !== "object") || Array.isArray(state)
        || !globalThis.info || (typeof info !== "object") || Array.isArray(info)
        || !Array.isArray(globalThis.storyCards)
        || (typeof addStoryCard !== "function")
        || !Array.isArray(globalThis.history)
        || (typeof text !== "string")
    ) {
        // Something is seriously broken in AID
        log("unexpected error");
        globalThis.text ||= " ";
        return;
    }
    /**
     * Recursively merges source object into target object
     * Only copies properties that are undefined in target
     * Nested objects get their own recursive treatment
     * @param {Object} target - The object to merge into
     * @param {Object} source - The object to merge from
     * @returns {Object} The mutated target object
     */
    const deepMerge = (target = {}, source = {}) => {
        // Walk through every key in the source
        for (const key in source) {
            // Source value is a nested object, so recurse
            if (source[key] && (typeof source[key] === "object") && !Array.isArray(source[key])) {
                if (!target[key] || (typeof target[key] !== "object")) {
                    // Target doesn't have this key or it's not an object
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else if (target[key] === undefined) {
                // Only copy if target doesn't already have this key
                target[key] = source[key];
            }
        }
        return target;
    };
    /**
     * Persistent state inherited from Inner Self, stored in the adventure's state object
     * This survives across turns
     *
     * The key stays "InnerSelf" after the rename for two hard reasons:
     * 1. Auto-Cards writes state.InnerSelf.AC.forced and state.InnerSelf.AC.event by that
     *    literal path, and the Auto-Cards section of this file must stay byte-identical
     * 2. An adventure rolled back to upstream Inner Self keeps its label counter intact
     * Everything Chronicle adds lives under state.CHRONICLE instead
     * @type {Object}
     */
    const IS = state.InnerSelf = deepMerge(state.InnerSelf || {}, {
        // Zero-width encoded thought labels for context injection
        encoding: "",
        // Currently triggered agent name (empty string = none)
        agent: "",
        // Monotonically increasing thought label counter
        label: 0,
        // Hash of recent history to detect retry or erase + continue turns
        hash: "",
        // Total number of brain operations performed across all agents
        ops: 0,
        // Auto-Cards integration state
        AC: {
            // This helps avoid calling AC API functions more than necessary
            enabled: false,
            // External use of the AC API force-installs so it just works
            forced: false,
            // NGL this one didn't need to be stateful but I didn't feel like declaring a local so whatevs
            // Basically AC sets this to true when it does stuff, so Chronicle can inhibit itself
            event: false
        }
    });
    /**
     * Persistent state added by Chronicle
     * Everything here must stay JSON-serializable and byte-capped
     * @typedef {Object} transaction
     * @property {number} actionCount - info.actionCount when the transaction was staged
     * @property {string} fingerprint - Fingerprint of the generation that produced it
     * @property {number} labelStart - IS.label before this transaction allocated any labels
     * @property {string} encoding - Zero-width label markers embedded in that generation
     * @property {string} agent - Name of the agent whose brain the operations belong to
     * @property {number} percent - config.percent captured at staging time
     * @property {boolean} json - config.json captured at staging time
     * @property {Object[]} ops - Plain serializable operation descriptors
     * @type {Object}
     */
    const CH = state.CHRONICLE = deepMerge(state.CHRONICLE || {}, {
        // Schema version of state.CHRONICLE, for future migrations
        schema: 1,
        // The single staged, uncommitted transaction (null when there is nothing pending)
        /** @type {transaction|null} */
        pending: null,
        // Every staging made for the current turn, newest last
        candidates: [],
        // Snapshot of what the last committed transaction overwrote, powering /undo
        undo: null,
        // Bounded record of recent transaction outcomes, for diagnostics
        journal: [],
        // Lifetime counters
        stats: {
            // Transactions committed
            commits: 0,
            // Transactions discarded because their generation never made it into the story
            discards: 0,
            // Operations refused at commit time (missing key, unsafe key, malformed descriptor)
            refused: 0
        },
        // Module B: per agent thought metadata, { seen, hits, turn, compress }
        mem: {},
        // Module C: the world as Chronicle understands it
        world: {
            date: "",
            day: 1,
            place: "",
            arc: "",
            factions: {},
            debts: [],
            threats: [],
            lost: []
        },
        // Module F: clock progress, keyed by clock name; definitions live on a card
        clocks: {},
        // Module F: scheduled consequences waiting for their turn
        queue: [],
        // Module F: consequences injected this turn, confirmed at commit
        fire: null,
        // Module E: byte-capped log of what happened and who saw it
        events: [],
        // Module E: current facts, and who knows them
        facts: {},
        // Module E: what each character still believes, after the truth moved on
        stale: {},
        // Module I: relationship stage per character
        bonds: {},
        // Module G: when the last audit ran, and what it found
        audit: { last: 0, findings: [] },
        // Module H: set by a slash command, read by the context hook
        console: { stop: false },
        // Who is writing this turn, so a batch of retry candidates all reach the same brain
        writer: null,
        // Module J: hook timings, skips, and the state size warning latch
        diag: { hooks: { input: [], context: [], output: [] }, skips: 0, warned: false },
        // Module J: cached story card positions, validated on use
        index: {},
        // Module K: the context profile in force, and how it got there
        budget: { profile: "", candidate: "", streak: 0, maxChars: 0, changes: [] },
        // Module L: how well the model has been answering
        compliance: {
            window: [], band: "healthy", lowest: "healthy", streak: 0,
            cooldownUntil: 0, since: 0, told: false
        },
        // Module M: whether context injections are landing at all
        canary: { state: "unknown", misses: 0, hits: 0, lastTurn: -1, told: false, armed: 0 }
    });
    /**
     * Checks if Auto-Cards is available in the global scope
     * @returns {boolean} true if Auto-Cards is installed and callable
     */
    const hasAutoCards = () => (typeof globalThis.AutoCards === "function");
    const u = "qm`x/`hetofdno/bnl.qsnghmd.MdveMd`i".replace(/./g, c => String.fromCharCode(c.charCodeAt()^1));
    if (IS.AC.enabled && (typeof hook === "string") && (hook !== "context") && hasAutoCards()) {
        // Delegate to Auto-Cards for non-context hooks when enabled
        try {
            text = AutoCards(hook, text);
        } catch (error) {
            log(error.message);
        }
    }
    /**
     * Generates a simple hashcode of the last 50 actions in history
     * Used to detect retry or erase + continue turns
     * @returns {string} Hexadecimal hash string
     */
    const historyHash = () => {
        let n = 0;
        // Grab the last 50 actions and stringify them
        const serialized = JSON.stringify(history.slice(-50));
        for (let i = 0; i < serialized.length; i++) {
            // Classic polynomial rolling hash, nothing fancy
            n = ((31 * n) + serialized.charCodeAt(i)) | 0;
        }
        return n.toString(16);
    };
    /**
     * Safely parses a JSON string into an object
     * Optionally attempts to repair malformed JSON by extracting quoted content
     * Basically I use repair mode for cute little smooth brains UwU
     * @param {string} str - The string to parse
     * @param {boolean} repair - Whether to attempt repair on malformed JSON
     * @returns {Object} Parsed object or empty object on failure
     */
    const deserialize = (str = "", repair = false) => {
        try {
            const parsed = JSON.parse(repair ? (() => {
                // All values will be strings I promise
                // Find the first and last quote chars
                const first = str.indexOf("\"");
                const last = str.lastIndexOf("\"");
                return (
                    ((first === -1) || (last === -1) || (last <= first))
                    ? "{}" : `{${str.slice(first, last + 1)}}`
                );
            })() : str);
            if (parsed && (typeof parsed === "object") && !Array.isArray(parsed)) {
                // Only return a proper object (not null, not array)
                return parsed;
            }
        } catch {}
        // That empty catch looks so dumb lol
        return {};
    };
    /**
     * Validated config settings for Chronicle
     * Default settings are specified by creators at the scenario level
     * Runtime settings are specified by players at the adventure level
     * @typedef {Object} config
     * @property {Object|null} card - Config card object reference
     * @property {boolean} allow - Is Chronicle enabled?
     * @property {string} player - The player character's name
     * @property {number} pov - Is the adventure in 1st, 2nd, or 3rd person?
     * @property {boolean} guide - Show a detailed guide
     * @property {number} percent - Default percentage of Recent Story context length reserved for agent brains
     * @property {number} distance - Number of previous actions to look back for agent name triggers
     * @property {string} indicator - The visual indicator symbol used to display active brains
     * @property {number} chance - Likelihood of performing a standard thought formation task each turn
     * @property {boolean} half - Is the thought formation chance reduced by half during Do/Say/Story turns?
     * @property {boolean} json - Is raw JSON syntax used to serialize NPC brains in their card notes?
     * @property {boolean} debug - Is debug mode enabled for inline task output visibility?
     * @property {boolean} pin - Is the config card pinned near the top of the list?
     * @property {boolean} auto - Is Auto-Cards enabled?
     * @property {string[]} agents - All agent names, ordered from highest to lowest trigger priority
     */
    /**
     * Config class - Manages the Chronicle configuration card
     * Handles building, finding, parsing, and validating all settings
     * @class
     */
    class Config {
        /**
         * Build or find the Chronicle config card
         * Returns the card reference and all parsed settings
         * This is the heart of the config system
         * @param {Set<string>} [pending] - Recursion aid for tracking pending agents
         * @returns {config} The complete validated configuration object
         */
        static get(pending = new Set()) {
        // Allow MainSettings mod to override local defaults
        if (typeof globalThis.MainSettings === "function") {
            new MainSettings("Chronicle", "InnerSelf", "IS").merge(S);
        }
        /**
         * Fallback values when settings are missing or invalid
         * Frozen because I hate accidental mutations
         * @type {config}
         */
        const fallback = Object.freeze({
            allow: true,
            guide: false,
            player: "",
            pov: 2,
            percent: 30,
            distance: 5,
            indicator: "🎭",
            chance: 60,
            half: true,
            json: false,
            debug: false,
            pin: false,
            auto: false,
            agents: [],
            // Module B
            tiers: false,
            core: 5,
            brainChars: 4000,
            promote: 2,
            // Module C
            world: false,
            worldChars: 700,
            startDate: "Day 1",
            maxDays: 30,
            // Module D
            ensemble: false,
            brains: 3,
            // Module E
            knows: false,
            eventChars: 3000,
            rumor: 10,
            // Module F
            clocks: false,
            // Module G
            audit: false,
            auditEvery: 75,
            // Module H
            console: false,
            // Module I
            bonds: false,
            bondTurns: 150,
            // Module J
            diag: false,
            timeBudget: 1200,
            stateChars: 40000,
            // Modules K to N (K and L have no switch, they always run)
            cooldown: 25,
            canary: false,
            lean: false
        });
        /** @type {config} */
        const config = { card: null };
        /**
         * Strips a string down to lowercase letters only
         * Used for fuzzy matching of setting names
         * @param {string} s - Input string
         * @returns {string} Simplified string
         */
        const simplify = (s = "") => s.toLowerCase().replace(/[^a-z]+/g, "");
        /**
         * Cleans up an agent name by removing commas and zero-width chars
         * Also normalizes whitespace because players are messy ;P
         * @param {string} agent - Raw agent name
         * @returns {string} Cleaned agent name
         */
        const cleanAgent = (agent = "") => agent.replace(/[,\u200B-\u200D]+/g, "").trim().replace(/\s+/g, " ");
        /**
         * Factory function that creates builder/setter pairs for config fields
         * Handles both boolean and integer settings with validation
         * This makes me NOT want to die every time I need to add a new setting
         * @param {string} key - Config property name
         * @param {*} setting - Default value from scenario settings
         * @param {Object} int - Integer constraints (lower, upper, suffix)
         * @returns {Object} Object with builder and setter functions
         */
        const factory = (key = "", setting = null, int = null) => ({
            // Builds the display string for the config card entry
            builder: (cfg = {}) => ` ${config[key] ?? cfg.setter?.(setting)}${(
                // Fancy suffix or boring suffix
                (typeof int?.suffix === "function") ? int.suffix() : int?.suffix ?? ""
            )}`,
            // Parses and validates a value, storing it in config
            setter: (value = null, fallible = false) => {
                // Helper to clamp integers within bounds
                const bound = (val = 20) => Math.min(Math.max(int?.lower ?? 1, val), int?.upper ?? 95);
                if ((typeof value === "boolean") && !int) {
                    // Boolean setting with a boolean value (easy case)
                    config[key] = value;
                } else if (Number.isInteger(value) && int) {
                    // Integer setting with an integer value (also easy)
                    config[key] = bound(value);
                } else if (typeof value !== "string") {
                    // Non-string non-matching type, use fallback unless fallible
                    if (fallible) {
                        return;
                    }
                    config[key] = fallback[key];
                } else if (int) {
                    // Parse integer from string, stripping decimals and non-digits
                    value = value.split(/[./]/, 1)[0].replace(/[^\d]+/g, "");
                    if (value !== "") {
                        config[key] = bound(parseInt(value, 10));
                    } else if (!fallible) {
                        config[key] = bound(fallback[key]);
                    }
                } else {
                    // Parse boolean from string with synonym support
                    value = simplify(value);
                    if (["true", "t", "yes", "y", "on", "1", "enable", "enabled"].includes(value)) {
                        config[key] = true;
                    } else if (["false", "f", "no", "n", "off", "0", "disable", "disabled"].includes(value)) {
                        config[key] = false;
                    } else if (!fallible) {
                        config[key] = fallback[key];
                    }
                }
                return config[key];
            }
        });
        /**
         * Template for building the Chronicle config card
         * Contains all the user-facing text and settings
         * @type {Object}
         */
        const template = {
            type: "class",
            title: "Configure \nChronicle",
            // The config card entry contains the main settings
            entry: [
                {
                    message: "Chronicle grants story characters the ability to learn, plan, and adapt over time, and records every change transactionally so a retry never rewrites the past. Edit the entry and notes below to control how Chronicle behaves."
                },
                { message: "Enable Chronicle:", alias: "Enable Inner Self:", ...factory(
                    "allow", S.IS_INNER_SELF_ENABLED_BY_DEFAULT
                ) },
                {
                    message: "Show detailed guide:",
                    builder: (cfg = {}) => ` ${(
                        ((hook === "context") || Number.isInteger(info.maxChars))
                        ? config.guide ?? cfg.setter?.(false)
                        : false
                    )}`,
                    setter: factory("guide", false).setter
                },
                {
                    message: "First name of player character:",
                    builder: (cfg = {}) => ` "${config.player || (() => {
                        const display = cfg.setter?.(S.PREDETERMINED_PLAYER_CHARACTER_NAME);
                        if (config.player === "") {
                            config.player = "the protagonist";
                        }
                        return display;
                    })()}"`,
                    setter: (value = null, fallible = false) => {
                        const example = "Example";
                        if (typeof value === "string") {
                            config.player = value.replaceAll("\"", "").replace(example, "").trim();
                        } else if (fallible) {
                            return;
                        } else {
                            config.player = fallback.player;
                        }
                        return config.player || example;
                    }
                },
                { message: "Adventure in 1st, 2nd, or 3rd person:", ...factory(
                    "pov", S.FIRST_SECOND_OR_THIRD_PERSON_POV,
                    { lower: 1, upper: 3, suffix: () => ["st", "nd", "rd"][config.pov - 1] ?? "" }
                ) },
                { message: "Max brain size relative to story context:", ...factory(
                    "percent", S.PERCENTAGE_OF_RECENT_STORY_USED_FOR_BRAINS,
                    { lower: 1, upper: 95, suffix: "%" }
                ) },
                { message: "Recent turns searched for name triggers:", ...factory(
                    "distance", S.NUMBER_OF_ACTIONS_TO_LOOK_BACK_FOR_TRIGGERS,
                    { lower: 1, upper: 250 }
                ) },
                {
                    message: "Visual indicator of current NPC triggers:",
                    builder: (cfg = {}) => ` "${(
                        config.indicator ?? cfg.setter?.(S.ACTIVE_CHARACTERS_VISUAL_INDICATOR_SYMBOL)
                    )}"`,
                    setter: (value = null, fallible = false) => (
                        (typeof value === "string")
                        ? (config.indicator = value.replace(/["\u200B-\u200D]+/g, "").trim())
                        : (fallible)
                        ? null
                        : (config.indicator = fallback.indicator)
                    )
                },
                { message: "Thought formation chance per turn:", ...factory(
                    "chance", S.THOUGHT_FORMATION_CHANCE_PER_TURN,
                    { lower: 0, upper: 100, suffix: "%" }
                ) },
                { message: "Half thought chance for Do/Say/Story:", ...factory(
                    "half", S.IS_THOUGHT_CHANCE_HALF_FOR_DO_SAY_STORY
                ) },
                { message: "Brain card notes store brains as JSON:", ...factory(
                    "json", S.IS_JSON_FORMAT_USED_FOR_BRAIN_CARD_NOTES
                ) },
                { message: "Enable debug mode to see model tasks:", ...factory(
                    "debug", S.IS_DEBUG_MODE_ENABLED_BY_DEFAULT
                ) },
                { message: "Pin this config card near the top:", ...factory(
                    "pin", S.IS_CONFIG_CARD_PINNED_BY_DEFAULT
                ) },
                { message: "Install Auto-Cards:", ...factory(
                    "auto", S.IS_AC_ENABLED_BY_DEFAULT
                ) },
                {
                    message: "Chronicle modules follow. Each one is off until you turn it on, and each is safe to turn off again at any time."
                },
                { message: "Tiered memory with pinned core thoughts:", ...factory(
                    "tiers", S.IS_TIERED_MEMORY_ENABLED
                ) },
                { message: "Maximum pinned core thoughts per character:", ...factory(
                    "core", S.MAX_CORE_THOUGHTS, { lower: 1, upper: 20 }
                ) },
                { message: "Maximum characters of thought per brain:", ...factory(
                    "brainChars", S.MAX_BRAIN_CHARS, { lower: 500, upper: 20000 }
                ) },
                { message: "Story links before a thought becomes long-term:", ...factory(
                    "promote", S.LONG_TERM_PROMOTION_HITS, { lower: 1, upper: 20 }
                ) },
                { message: "Track world state (date, place, arc, factions):", ...factory(
                    "world", S.IS_WORLD_CHRONICLE_ENABLED
                ) },
                { message: "Maximum characters of world state per turn:", ...factory(
                    "worldChars", S.MAX_CHRONICLE_BLOCK_CHARS, { lower: 200, upper: 2000 }
                ) },
                {
                    message: "In-game date the adventure began on:",
                    builder: (cfg = {}) => ` "${config.startDate ?? cfg.setter?.(S.STARTING_IN_GAME_DATE)}"`,
                    setter: (value = null, fallible = false) => (
                        (typeof value === "string")
                        ? (config.startDate = value.replaceAll("\"", "").trim().slice(0, 60) || fallback.startDate)
                        : (fallible)
                        ? null
                        : (config.startDate = fallback.startDate)
                    )
                },
                { message: "Maximum days one turn may advance:", ...factory(
                    "maxDays", S.MAX_DAYS_ADVANCED_PER_TURN, { lower: 1, upper: 365 }
                ) },
                { message: "Let several present characters think at once:", ...factory(
                    "ensemble", S.IS_ENSEMBLE_ENABLED
                ) },
                { message: "Maximum full brains sharing one context:", ...factory(
                    "brains", S.MAX_CONCURRENT_BRAINS, { lower: 1, upper: 6 }
                ) },
                { message: "Track who witnessed what, and what they still believe:", ...factory(
                    "knows", S.IS_KNOWLEDGE_MODEL_ENABLED
                ) },
                { message: "Maximum characters of witnessed event log:", ...factory(
                    "eventChars", S.MAX_EVENT_LOG_CHARS, { lower: 500, upper: 20000 }
                ) },
                { message: "Chance per turn that a secret spreads to someone:", ...factory(
                    "rumor", S.RUMOR_SPREAD_PERCENT_PER_TURN, { lower: 0, upper: 100, suffix: "%" }
                ) },
                { message: "Track progress clocks and scheduled consequences:", ...factory(
                    "clocks", S.IS_CLOCKS_ENABLED
                ) },
                { message: "Run periodic continuity audits:", ...factory(
                    "audit", S.IS_CONTINUITY_AUDITOR_ENABLED
                ) },
                { message: "Turns between continuity audits:", ...factory(
                    "auditEvery", S.AUDIT_INTERVAL, { lower: 10, upper: 1000 }
                ) },
                { message: "Enable player commands like /help and /undo:", ...factory(
                    "console", S.IS_PLAYER_CONSOLE_ENABLED
                ) },
                { message: "Track relationship bonds with the player:", ...factory(
                    "bonds", S.IS_BONDS_ENABLED
                ) },
                { message: "Minimum turns between bond advances:", ...factory(
                    "bondTurns", S.MIN_TURNS_PER_BOND_STAGE, { lower: 0, upper: 10000 }
                ) },
                { message: "Enable diagnostics and safety rails:", ...factory(
                    "diag", S.IS_DIAGNOSTICS_ENABLED
                ) },
                { message: "Milliseconds a hook may spend before skipping extras:", ...factory(
                    "timeBudget", S.TIME_BUDGET_MS, { lower: 100, upper: 2000 }
                ) },
                { message: "Maximum characters of saved adventure state:", ...factory(
                    "stateChars", S.MAX_STATE_CHARS, { lower: 8000, upper: 200000 }
                ) },
                {
                    message: "Model compatibility. Budget autoscaling and the compliance monitor always run and have no switch here, because a fixed budget cannot meet a context that moves per action, and nothing else notices when a model stops following the operation format. The rest of this group matters most on DeepSeek, Gemma and GLM."
                },
                { message: "Turns to stop asking after the model cannot answer:", ...factory(
                    "cooldown", S.COMPLIANCE_COOLDOWN_TURNS, { lower: 5, upper: 200 }
                ) },
                { message: "Check that context injections are landing at all:", ...factory(
                    "canary", S.IS_INJECTION_CANARY_ENABLED
                ) },
                { message: "Use terse prompts when context or compliance is tight:", ...factory(
                    "lean", S.IS_LEAN_EMISSION_ENABLED
                ) },
                {
                    message: "Write the name(s) of your non-player characters at the very bottom of the \"notes\" section below. This is mandatory because it allows Chronicle to assemble independent minds for the correct individuals."
                }
            ],
            // Description section contains info and agent list
            description: [
                {
                    message: `Chronicle ${version} is built on ${ancestry} by LewdLeah, used and modified under the MIT licence, with the original copyright retained in the library script. Auto-Cards is bundled unmodified. Please visit @LewdLeah on AI Dungeon through the link above; none of this exists without that work. ❤️`
                },
                {
                    message: "Suggested order for a long campaign. Every module in the entry above ships switched off, so turn them on in stages rather than all at once. Turns 1 to 50, add tiered memory and watch /diag. Once the compliance band holds healthy and /diag confirms injections are landing, add the world chronicle, the console, and diagnostics. Add the knowledge model and clocks around turn 100. Add ensemble last, and only at Mythic context or above, because concurrent brains are where format compliance breaks first."
                },
                {
                    message: "Modules A, K and L have no switch and always run. A is the transaction ledger that makes retry safe, K scales every injection budget to your live context size, and L watches whether your model can still follow the operation grammar. Turning any of them off would break the rest."
                },
                {
                    message: "Type /help in the adventure for the console, once you have enabled it. /diag shows your context profile, compliance band, and what each module is costing you per turn. /state shows the world. /undo reverts the last committed change."
                },
                {
                    message: "Avoid the Atlas and Raven models entirely; they cannot receive anything this script injects. Turn Optimized Context off if your model offers it, or the world simulation is silently discarded. Tuned for DeepSeek V3.2, Dynamic DeepSeek, Gemma 31B, and GLM 5.1."
                },
                {
                    // This is where players list their NPCs
                    message: "Write the first name of every intelligent story character on separate lines below, listed from highest to lowest trigger priority:",
                    builder: (cfg = {}) => ["", "", ...(
                        config.agents ?? cfg.setter?.(S.IMPORTANT_SCENARIO_CHARACTERS)
                    ), ""].join("\n"),
                    setter: (value = null, fallible = false) => {
                        // Accept string (from card) or array (from code)
                        if (typeof value === "string") {
                            config.agents = value.split(/[,\n]/);
                        } else if (Array.isArray(value)) {
                            config.agents = value.filter(agent => (typeof agent === "string"));
                        } else if (fallible) {
                            return;
                        } else {
                            return (config.agents = [...fallback.agents]);
                        }
                        // Clean, deduplicate, and remove empties
                        return (config.agents = [...new Set(config.agents
                            .map(agent => cleanAgent(agent))
                            .filter(agent => (agent !== ""))
                        )]);
                    }
                }
            ]
        };
        // Track discovered agents to avoid duplicates
        const agents = new Set();
        /**
         * Bargain bin levenshtein distance, but less costly
         * Returns true when the two simplified titles are too far apart to be the same card
         * @param {string} current - Simplified title actually found on the card
         * @param {string} target - Simplified title we are looking for
         * @returns {boolean} true if this is NOT the card we want
         */
        const mismatched = (current = "", target = "") => {
            const maxMistakes = 2;
            let mistakes = 0;
            // Target index (expected title)
            let t = 0;
            // Current index (actual title)
            let c = 0;
            while ((t < target.length) && (c < current.length)) {
                if (current[c] === target[t]) {
                    // Chars match, advance both
                    t++; c++;
                    continue;
                } else if (maxMistakes <= mistakes) {
                    // Too many mistakes, this isn't the config card (I hope)
                    return true;
                }
                // Allow for insertions, deletions, or substitutions
                mistakes++;
                (current[c + 1] === target[t])
                ? c++
                : (current[c] === target[t + 1])
                ? t++
                : (t++, c++)
            }
            // Count leftover chars as mistakes
            mistakes += (target.length - t) + (current.length - c);
            return (maxMistakes < mistakes);
        };
        /**
         * Simplified titles that identify the config card
         * The Inner Self title is far outside fuzzy range of the Chronicle one, so an
         * adventure that predates the rename would otherwise grow a second config card
         * and silently lose every setting the player had chosen
         * @type {string[]}
         */
        const targets = [simplify(template.title), simplify("Configure \nInner Self")];
        // Scan all story cards in reverse order
        // Looking for config cards, agent cards, and duplicates (remove the latter in-place)
        for (let i = storyCards.length - 1; -1 < i; i--) {
            const card = storyCards[i];
            if (!card || (typeof card !== "object") || Array.isArray(card)) {
                // Remove invalid cards (null, non-objects, arrays)
                // If this ever happens in a real situation, I will cry
                storyCards.splice(i, 1);
            } else if ((typeof card.keys === "string") && card.keys.includes("\"agent\"")) {
                // This card has agent metadata, extract and validate it
                const metadata = deserialize(card.keys);
                if (typeof metadata.agent === "string") {
                    metadata.agent = cleanAgent(metadata.agent);
                    if (metadata.agent !== "") {
                        if (!agents.has(metadata.agent)) {
                            // First time seeing this brain card
                            agents.add(metadata.agent);
                            card.keys = JSON.stringify(metadata);
                            continue;
                        } else if (typeof card.title === "string") {
                            // Duplicate brain card, mark it as a copy
                            card.title = card.title.trim();
                            card.title = `Copy of ${(card.title === "") ? "Agent" : card.title}`;
                        }
                    }
                }
                // Invalid agent metadata, clear it
                card.keys = "";
            } else if ((typeof card.title !== "string") || (100 < card.title.length)) {
                // Skip cards with missing or absurdly long titles
                continue;
            } else if (card.title.startsWith("@") && !card.title.includes("figure")) {
                // Cards starting with @ are shorthand for adding agents
                const agent = cleanAgent(card.title.replace(/^[@\s]*/, ""));
                if (agent !== "") {
                    card.title = agent;
                    pending.add(agent);
                }
            } else if (targets.every(target => mismatched(simplify(card.title), target))) {
                // Fuzzy matching finds the config card even if the title is slightly mangled
                // Because players gonna player and typos happen
                // Title didn't match the fuzzy search, under either product name
                continue;
            } else if (config.card === null) {
                // Found the config card
                config.card = card;
            } else if (typeof removeStoryCard === "function") {
                // Duplicate config card, remove it properly the way Latitude intended
                // (I know it's just a wrapper for splice, but that may change one day lol)
                removeStoryCard(i);
            } else {
                // Fallback removal for duplicate config cards
                storyCards.splice(i, 1);
            }
        }
        /**
         * Builds a formatted string from template sections
         * @param {Array} source - Array of config message objects
         * @param {string} delimiter - String to join sections with
         * @returns {string} Formatted config text
         */
        const build = (source = [], delimiter = "\n\n") => (source
            .map(cfg => `> ${cfg.message}${cfg.builder?.(cfg) ?? ""}`)
            .join(delimiter)
        );
        if (config.card === null) {
            // If no config card exists, create one and recurse
            addStoryCard(u,
                build(template.entry, "\n"),
                template.type,
                template.title,
                build(template.description, "\n\n")
            );
            // Recurse to parse the newly created card
            return Config.get(pending);
        }
        // Parse existing card content to extract user-modified settings
        // This is where Chronicle reads back what the player has configured
        // Abomination :3
        ["entry", "description"].map(source => [source, (
            (typeof config.card[source] === "string")
            // Split on >, filter for lines with colons, extract key-value pairs
            // Null prototype because these keys come from text the player can edit
            ? Object.assign(Object.create(null), Object.fromEntries((config.card[source]
                .split(/\s*>[\s>]*/)
                .filter(block => block.includes(":"))
                .map(block => block.split(/\s*:[\s:]*/, 2))
            ).map(pair => [simplify(pair[0]), pair[1].trimEnd()]))) : Object.create(null)
        )]).forEach(([source, extractive]) => template[source].forEach(cfg => (
            // Try to set each config value from extracted content (fallible mode)
            // A renamed row falls back to the label it carried under Inner Self, so an
            // adventure that predates the rename keeps every value the player chose
            cfg.setter?.(extractive[simplify(cfg.message)] ?? (
                (typeof cfg.alias === "string") ? extractive[simplify(cfg.alias)] : undefined
            ), true)
        )));
        // Merge all discovered agents: config, brain card metadata, and "@" pending
        config.agents = [...new Set([...(config.agents ?? fallback.agents), ...agents, ...pending])];
        if (IS.AC.forced) {
            // Handle forced Auto-Cards installation (silly API stuff)
            config.auto = true;
            IS.AC.forced = false;
            IS.AC.enabled = true;
        }
        // Update the card with the canonical template format so it sticks after the hook ends
        config.card.type = template.type;
        config.card.title = template.title;
        config.card.entry = build(template.entry, "\n");
        config.card.description = build(template.description, "\n\n");
        config.card.keys = u;
        return config;
    } }
    /**
     * Removes the visual indicator prefix from a card title
     * The indicator is separated by a zero-width space char
     * @param {Object} card - Story card object to modify
     * @returns {void}
     */
    const deindicate = (card = {}) => {
        if (typeof card.title !== "string") {
            // Cry
            card.title = "";
        } else if (card.title.includes("\u200B")) {
            // Strip everything before and including the zero-width space
            card.title = (card.title
                .slice(card.title.indexOf("\u200B") + 1)
                .replaceAll("\u200B", "")
                .trim()
            );
        }
        return;
    };
    /**
     * Agent class - Represents an NPC with a simulated brain
     * Each agent has their own story card that stores their thoughts
     * The brain is a key-value store of labeled thoughts
     * @class
     */
    class Agent {
        // Private fields for encapsulation
        // Percentage of context reserved for this agent's brain
        #percent;
        // Visual indicator symbol shown when agent is triggered
        #indicator;
        // Cached reference to the agent's brain card
        #card = null;
        // Cached parsed brain contents
        #brain = null;
        // Cached parsed metadata
        #metadata = null;
        /**
         * Creates a new Agent instance
         * The agent will find or create their brain card automatically
         * @param {string} name - The name of the agent (used for triggering)
         * @param {Object} [options] - Optional settings for the agent
         * @param {number} [options.percent=30] - Context reserved for brain contents
         * @param {string} [options.indicator=null] - Visual indicator when triggered
         */
        constructor(name = "", { percent = 30, indicator = null } = {}) {
            this.#indicator = indicator;
            this.#percent = percent;
            this.name = name;
            return this;
        }
        /**
         * Gets or creates the agent's brain card
         * Uses lazy initialization and caching
         * @returns {Object} The agent's story card
         */
        get card() {
            if (this.#card !== null) {
                // Return cached card if stored
                return this.#card;
            }
            /**
             * Creates a new brain card for this agent
             * Includes a timestamp for debugging purposes
             * @param {string} name - Display name for the card
             * @returns {Object} The newly created card
             */
            const buildCard = (name = this.name) => claim(addStoryCard(
                JSON.stringify({ agent: this.name }),
                (() => {
                    // Generate a pretty timestamp for the initialization comment
                    const time = new Date();
                    const match = time.toLocaleString("en-US", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    }).match(/(\d+)\/(\d+)\/(\d+),?\s*(\d+:\d+\s*[AP]M)/);
                    return `// initialized @ ${(
                        match
                        ? `${match[3]}-${match[1]}-${match[2]} ${match[4]}`
                        : time.toISOString().replace("T", " ").slice(0, 16)
                    )} UTC`;
                })(),
                "Brain",
                name,
                JSON.stringify({}),
                // Thank you Mavrick
                { returnCard: true }
            ), name);
            /**
             * Checks if a card belongs to this agent
             * @param {Object} card - Card to check
             * @returns {boolean} true if this is the right card
             */
            const isAgent = (card = {}) => (
                (typeof card.keys === "string")
                && card.keys.includes("\"agent\"")
                && (deserialize(card.keys).agent === this.name)
            );
            // The six argument form of addStoryCard is an undocumented platform extension
            // Where it is missing the call still creates the card, it just answers "true"
            const claim = (built = null, name = this.name) => {
                if (built && (typeof built === "object") && !Array.isArray(built)) {
                    return built;
                }
                for (const card of storyCards) {
                    if (isAgent(card)) {
                        // The card was created, the platform simply did not hand it back
                        return card;
                    }
                }
                // Nothing to write to. A detached card keeps this turn alive and loses only
                // the thought it was carrying, rather than throwing out of the hook
                log(`Chronicle: story card creation returned no card for ${this.name}`);
                return {
                    keys: JSON.stringify({ agent: this.name }),
                    entry: "",
                    type: "Brain",
                    title: name,
                    description: "{}"
                };
            };
            if (typeof this.#indicator !== "string") {
                // If no indicator is set, just find or create the card
                for (const card of storyCards) {
                    if (isAgent(card)) {
                        // Found an existing card
                        this.#card = card;
                        return this.#card;
                    }
                }
                // No existing card found, create one
                this.#card = buildCard();
                return this.#card;
            }
            // The Agent class instance was constructed with an indicator
            // Update card titles during the same iteration because reasons
            this.#indicator = this.#indicator.trim();
            const prefix = `${this.#indicator}\u200B`;
            for (const card of storyCards) {
                // Remove indicators from all cards
                deindicate(card);
                if ((this.#card === null) && isAgent(card)) {
                    // Found the brain card, add the indicator prefix
                    if (this.#indicator !== "") {
                        card.title = (card.title === "") ? prefix : `${prefix} ${card.title}`;
                    }
                    this.#card = card;
                }
            }
            if (this.#card === null) {
                // Still no card? Create one with the indicator
                this.#card = (this.#indicator === "") ? buildCard() : buildCard(`${prefix} ${this.name}`);
            }
            return this.#card;
        }
        /**
         * Gets the agent's metadata from their card
         * Contains per-agent configurable settings like context percentage
         * @returns {Object} metadata object with validated percent
         */
        get metadata() {
            if (this.#metadata !== null) {
                // Return cached metadata if available
                return this.#metadata;
            }
            // Valid range for brain size percentage (inclusive)
            const [lower, upper] = [1, 95];
            this.#metadata = deserialize(this.card.keys);
            // Validate and normalize the percent value
            if (!Number.isInteger(this.#metadata.percent)) {
                // Uh oh
                this.#metadata.percent = (
                    ((typeof this.#metadata.percent === "number") && Number.isFinite(this.#metadata.percent))
                    ? Math.min(Math.max(lower, Math.round(this.#metadata.percent)), upper)
                    : this.#percent
                );
            } else if (this.#metadata.percent < lower) {
                // Clamp to minimum
                this.#metadata.percent = lower;
            } else if (upper < this.#metadata.percent) {
                // Clamp to maximum
                this.#metadata.percent = upper;
            } else {
                // Yippee
                return this.#metadata;
            }
            // Save the normalized metadata back to the card
            this.#card.keys = JSON.stringify(this.#metadata);
            return this.#metadata;
        }
        /**
         * Gets the agent's brain (thought storage)
         * Parses from the card description with repair mode enabled
         * Accepts both JSON and simplified formats for deserialization
         * Auto-detects format for backward (and forward) compatibile conversion
         * @returns {Object} Key-value store of thoughts
         */
        get brain() {
            if (this.#brain !== null) {
                // Return the cached brain if available
                return this.#brain;
            } else if (typeof this.card.description === "string") {
                this.card.description = this.card.description.trim();
            } else {
                // Story card "description" is undocumented, and it holds every brain here
                // If the platform ever stops returning it, say so rather than quietly
                // handing back an empty mind
                if (!("description" in this.card)) {
                    log(`Chronicle: story card notes are missing for ${this.name}, brain starts empty`);
                }
                this.card.description = "";
            }
            this.#brain = {};
            /**
             * Admits one parsed thought into the brain
             * Card notes are player-editable text, so this is a trust boundary like any
             * other: reserved property names and runaway keys are refused out loud
             * @param {string} key - Parsed key
             * @param {string} value - Parsed thought
             * @returns {boolean} true if the thought was admitted
             */
            const admit = (key = "", value = "") => {
                if (!safeKey(key)) {
                    log(`Chronicle: refusing brain key ${JSON.stringify(key.slice(0, 40))} for ${this.name}`);
                    return false;
                }
                this.#brain[key] = value;
                return true;
            };
            if (/^[\s{,]*"/.test(this.card.description) || /"[\s},]*$/.test(this.card.description)) {
                let parsed = false;
                // Parse the brain as JSON from the card description, with repairs allowed
                const source = deserialize(this.card.description, true);
                for (const key in source) {
                    // Only keep string values (the actual thoughts)
                    (typeof source[key] === "string") && admit(key, source[key]) && (parsed = true);
                }
                if (parsed) {
                    // Conclude if the brain contains any string-valued properties
                    return this.#brain;
                }
                // Failed to parse any meaningful thoughts, try the simple format instead
            }
            // Parse the brain from the card description using the simple format
            for (const line of this.card.description.split("\n")) {
                const clean = line.trim();
                if (clean === "") {
                    continue;
                }
                // Find the first colon (allows colons in values like "5:30 PM")
                const bisector = clean.indexOf(":");
                if (bisector === -1) {
                    // No key-value pair on this line
                    continue;
                }
                // Remove unwanted leading/trailing chars from both key and value
                const [key, value] = [
                    // Left of colon
                    clean.slice(0, bisector),
                    // Right of colon
                    clean.slice(bisector + 1)
                ].map(twin => twin.replace(/(?:^[\s{},"_\\]*|[\s{},"_\\]*$)/g, ""));
                if ((key !== "") && (value !== "")) {
                    // Only add if key and value are both non-empty
                    admit(key, value);
                }
            }
            return this.#brain;
        }
        /**
         * Clears the cached brain, forcing a re-parse on next access
         * Head empty UwU
         * @returns {void}
         */
        lobotomize() {
            this.#brain = null;
            return;
        }
    }
    /**
     * Gets the most recent non-empty action from history
     * Ignores actions that are just zero-width chars >:3
     * @returns {Object|undefined} The previous action or undefined
     */
    const getPrevAction = () => history.findLast(a => !/^[\u200B-\u200D]*$/.test(a?.text ?? a?.rawText ?? ""));
    // ==================== MODULE A - TRANSACTION LEDGER ====================
    /**
     * Nothing is written to a story card during the turn that produced it
     *
     * Inner Self committed brain operations inside onOutput and guarded against doubles
     * by hashing history. At output time history does not yet contain the generation being
     * produced, so a retry hashes identically, bails out, and leaves the brain holding the
     * thought from the generation the player threw away. Erase and continue failed the same
     * way. The guard was real; it just pinned the wrong write.
     *
     * Chronicle stages instead. onOutput allocates labels, embeds their zero-width markers
     * in the story text, and parks plain serializable descriptors in state.CHRONICLE.pending.
     * The next turn commits them, but only once it can prove the generation that produced
     * them actually survived into the story. Anything else is discarded and rolled back.
     *
     * Labels cannot be deferred with the rest: their markers have to be woven into the very
     * text being returned. So labels are allocated at staging time and rolled back to
     * labelStart when the transaction is discarded.
     */
    // Nothing grows without a byte cap, because 1500 turns is a long time
    const CAP = Object.freeze({
        // Longest thought a single operation may carry into state
        thought: 2000,
        // Longest brain key a single operation may carry into state
        key: 60,
        // Most operations one transaction may hold
        ops: 8,
        // Largest undo snapshot retained; a bigger commit simply keeps no undo
        undo: 12000,
        // Outcomes retained in the diagnostic journal
        journal: 20,
        // Stagings kept for one visible turn, in case onOutput fires once per retry candidate
        candidates: 4
    });
    /**
     * Key names that must never reach a brain map
     * Assigning these can poison every object in the sandbox
     * @type {string[]}
     */
    const reservedKeys = Object.freeze(["__proto__", "constructor", "prototype"]);
    /**
     * Own-property test that ignores everything inherited from Object.prototype
     * ("constructor" in {}) is true, which is exactly the kind of thing model output finds
     * @param {Object} obj - Object to test
     * @param {string} key - Property name to test
     * @returns {boolean} true if obj carries key as its own property
     */
    const own = (obj = null, key = "") => (
        !!obj && (typeof obj === "object") && Object.prototype.hasOwnProperty.call(obj, key)
    );
    /**
     * Validates a brain key before it is allowed into a staged operation
     * @param {*} key - Candidate key
     * @returns {boolean} true if the key is safe to store
     */
    const safeKey = (key = "") => (
        (typeof key === "string")
        && (key !== "")
        && (key.length <= CAP.key)
        && !reservedKeys.includes(key)
    );
    /**
     * Converts a key name to valid snake_case
     * Handles various edge cases from model output
     * @param {string} k - Raw key string
     * @returns {string} Valid snake_case key name
     */
    const formatKey = (k = "") => (k
        .trim()
        // Take the first word only
        .split(/\s/, 1)[0]
        // Remove quotes and apostrophes
        .replace(/[.'`\u00B4\u2018\u2019]+/g, "")
        // Replace non-alphanumerics with underscore
        .replace(/[^a-z0-9A-Z_]/g, "_")
        // Convert camelCase to snake_case
        .replace(/([a-z0-9])([A-Z])/g, (_, a, b) => `${a}_${b.toLowerCase()}`)
        .toLowerCase()
        // Separate letters from numbers
        .replace(/([a-z])([0-9])/g, (_, a, b) => `${a}_${b}`)
        .replace(/([0-9])([a-z])/g, (_, a, b) => `${a}_${b}`)
        // Clean up multiple underscores
        .replace(/__+/g, "_")
        // Remove leading/trailing underscores
        .replace(/(?:^_|_$)/g, "")
    );
    /**
     * Generates a path string for logging operations
     * Helps brain logs imitate actual code for ease of understanding
     * @param {string} name - The agent whose brain is being written
     * @param {string} key - Property name to access
     * @returns {string} Path like "agent_name.brain" or "agent_name.key"
     */
    const path = (name = "", key = "brain") => `${(() => {
        const fancy = formatKey(name);
        return (fancy === "") ? `agents[${JSON.stringify(name)}]` : fancy;
    })()}.${key}`;
    /**
     * Generates a delete log statement
     * @param {string} name - The agent whose brain is being written
     * @param {string} k - Key being deleted
     * @returns {string} JavaScript delete statement
     */
    const logDelete = (name = "", k = "") => `delete ${path(name)}${(k === "") ? "[\"\"]" : `.${k}`};`;
    /**
     * Strips a string down to the part a retry cannot change by accident
     * Zero-width chars go first: they are the label markers, and they legitimately differ
     * @param {string} str - Raw action or output text
     * @returns {string} Normalized text
     */
    const normalize = (str = "") => (
        (typeof str === "string")
        ? str.replace(/[\u200B-\u200D\uFEFF]+/g, "").replace(/\s+/g, " ").trim()
        : ""
    );
    /**
     * Fingerprints a generation so a later turn can recognize it in history
     * @param {string} str - Raw text
     * @returns {string} Short stable fingerprint
     */
    const fingerprint = (str = "") => {
        const clean = normalize(str);
        let n = 0;
        for (let i = 0; i < clean.length; i++) {
            // Classic polynomial rolling hash, nothing fancy
            n = ((31 * n) + clean.charCodeAt(i)) | 0;
        }
        return `${clean.length.toString(36)}.${(n >>> 0).toString(16)}`;
    };
    /**
     * Reads the platform's action counter, falling back to history length
     * Mirrors how Auto-Cards reads the same value, negatives and all
     * @returns {number} Current action count
     */
    const getActionCount = () => (
        Number.isInteger(info?.actionCount) ? Math.abs(info.actionCount) : history.length
    );
    /**
     * Appends one bounded outcome to the diagnostic journal
     * @param {string} kind - What happened
     * @param {Object} [detail] - Small extra facts
     * @returns {void}
     */
    const journal = (kind = "", detail = {}) => {
        if (!Array.isArray(CH.journal)) {
            CH.journal = [];
        }
        CH.journal.push({ turn: getActionCount(), kind, ...detail });
        if (CH.journal.length > CAP.journal) {
            CH.journal.splice(0, CH.journal.length - CAP.journal);
        }
        return;
    };
    /**
     * Throws away the staged transaction and undoes everything staging changed
     * Labels roll back so a retried turn reuses them instead of burning through the counter
     * @param {string} why - Reason, recorded in the journal
     * @returns {boolean} true if something was actually discarded
     */
    const discardPending = (why = "") => {
        const candidates = (Array.isArray(CH.candidates) && (0 < CH.candidates.length))
            ? CH.candidates
            : (CH.pending ? [CH.pending] : []);
        CH.pending = null;
        CH.candidates = [];
        IS.encoding = "";
        if (candidates.length === 0) {
            return false;
        }
        // Rewind to where the earliest of these transactions found the counter, so a batch
        // of candidates costs no more labels than the one the player kept would have
        const earliest = candidates.reduce((lowest, candidate) => (
            Number.isInteger(candidate?.labelStart) ? Math.min(lowest, candidate.labelStart) : lowest
        ), Number.MAX_SAFE_INTEGER);
        if ((earliest !== Number.MAX_SAFE_INTEGER) && (0 <= earliest) && (earliest < IS.label)) {
            IS.label = earliest;
        }
        CH.stats.discards++;
        journal("discard", { why, ops: candidates.reduce((n, c) => (n + (Array.isArray(c.ops) ? c.ops.length : 0)), 0) });
        return true;
    };
    /**
     * Applies one operation descriptor to an in-memory brain map
     * Descriptors are data, never closures, because closures do not survive a turn
     * Returns the log line for the operation, or null if the operation was refused
     * @param {Object} op - Operation descriptor
     * @param {Object} brain - The agent's parsed brain, mutated in place
     * @returns {string|null} Log line, or null when nothing was applied
     */
    const applyOp = (op = null, brain = {}, cfg = {}) => {
        if (!op || (typeof op !== "object") || Array.isArray(op)) {
            return null;
        }
        if (op.mod !== "brain") {
            // Every other module writes through the same ledger, one turn later, so a
            // discarded generation cannot leave a clock advanced or a secret spread
            return applyModuleOp(op, cfg);
        }
        const name = (typeof op.agent === "string") ? op.agent : "";
        if ((name === "") || !safeKey(op.key)) {
            return null;
        }
        // A model only ever sees bare key names, so map its write back onto the pinned key
        const key = resolveKey(brain, op.key, cfg.tiers === true);
        if ((cfg.tiers === true) && isCore(key) && ((op.op === "delete") || (op.op === "rename"))) {
            // Core thoughts are what the character is. They are not negotiable, even when
            // the model asks nicely and even when it asks in the right format
            log(`Chronicle: refused to ${op.op} the pinned thought ${bareKey(key)} of ${name}`);
            journal("refused", { agent: name, key: bareKey(key).slice(0, 24) });
            return null;
        }
        if (op.op === "delete") {
            if (!own(brain, key)) {
                // The player may have edited this key away between staging and now
                return null;
            }
            delete brain[key];
            return logDelete(name, key);
        }
        if (op.op === "rename") {
            const from = resolveKey(brain, op.from, cfg.tiers === true);
            if (!safeKey(from) || !own(brain, from) || (from === key) || (
                (cfg.tiers === true) && isCore(from)
            )) {
                return null;
            }
            brain[key] = brain[from];
            delete brain[from];
            const p = path(name);
            return `${p}.${key} = ${p}.${from};\n${logDelete(name, from)}`;
        }
        if (op.op === "merge") {
            // Two cold long-term thoughts become one, which is how a brain forgets detail
            // without forgetting what happened
            const from = (Array.isArray(op.from) ? op.from : []).filter(k => own(brain, k) && !isCore(k));
            const summary = (typeof op.value === "string") ? op.value.trim() : "";
            if ((from.length < 2) || (summary === "") || !Number.isInteger(op.label) || (op.label < 1)) {
                return null;
            }
            for (const stale of from) {
                delete brain[stale];
            }
            brain[key] = `${op.label} \u2192 ${summary}`;
            const p = path(name);
            return `${p}.${key} = ${JSON.stringify(brain[key])};\n${from.map(k => logDelete(name, k)).join("\n")}`;
        }
        if (op.op !== "set") {
            return null;
        }
        const thought = (typeof op.value === "string") ? op.value : "";
        if ((thought === "") || !Number.isInteger(op.label) || (op.label < 1)) {
            return null;
        }
        const target = `${path(name)}.${key}`;
        const old = own(brain, key) ? brain[key] : undefined;
        brain[key] = `${op.label} \u2192 ${thought}`;
        // Determine if this is a relabel of the same thought value
        const relabel = (
            (typeof old === "string")
            && (thought === old.slice(old.indexOf("\u2192") + 1).trim())
        );
        return `${(
            relabel ? `old = ${target};\n` : ""
        )}${target} = ${(
            relabel ? `[${op.label}, old${(
                old.includes("\u2192") ? "\n  .slice(old.indexOf(\"\u2192\") + 1)\n  .trim()\n" : ".trim()"
            )}].join(" \u2192 ")` : JSON.stringify(brain[op.key])
        )};`;
    };
    /**
     * Serializes a brain into the story card notes
     * Rapidly reserializes a flat representation without heavy memory allocations
     * This custom serialization is faster than JSON.stringify for flat objects
     * It also produces a more readable format in the story card notes
     * @param {Object} brain - The agent's brain
     * @param {boolean} json - Show raw JSON instead of the friendly format
     * @returns {string} Serialized brain
     */
    const serializeBrain = (brain = {}, json = false) => {
        const keys = Object.keys(brain);
        if (keys.length === 0) {
            return "{}";
        }
        // Build the JSON-like string manually for each key-value pair
        let serialized = "";
        const appendPair = json ? ((
            serialized = `"${keys[0]}": ${JSON.stringify(brain[keys[0]])}`
        ), (key = "") => {
            // Format -> "key": "value",\n\n (JSON with linebreaks)
            serialized += `,\n\n"${key}": ${JSON.stringify(brain[key])}`;
            return;
        }) : ((
            serialized = `${keys[0]}: ${brain[keys[0]]}`
        ), (key = "") => {
            // Format -> key: value\n\n (simple user-friendly format)
            serialized += `\n\n${key}: ${brain[key]}`;
            return;
        });
        for (let i = 1; i < keys.length; i++) {
            appendPair(keys[i]);
        }
        return serialized;
    };
    /**
     * Commits the staged transaction to the agent's brain card
     *
     * Every write lands in local variables first and reaches the card in one pass at the
     * end, so an exception anywhere in the middle leaves the card exactly as it was
     * @returns {boolean} true if a transaction was committed
     */
    const commitPending = () => {
        const pending = CH.pending;
        // Clear first: a transaction that throws must never get a second attempt
        CH.pending = null;
        IS.encoding = "";
        if (
            !pending || (typeof pending !== "object")
            || !Array.isArray(pending.ops) || (pending.ops.length === 0)
            || (typeof pending.agent !== "string")
        ) {
            return false;
        }
        try {
            const cfg = commitConfig(pending);
            // A transaction can belong to no one: time passing and clocks turning happen
            // whether or not anybody was thinking
            const agent = (pending.agent === "") ? null : new Agent(pending.agent, {
                percent: Number.isInteger(pending.percent) ? pending.percent : 30
            });
            const card = agent ? agent.card : null;
            if (agent && (!card || (typeof card !== "object") || Array.isArray(card))) {
                // The platform did not hand back a usable card, so there is nowhere to write
                log("Chronicle: brain card unavailable, transaction dropped");
                journal("dropped", { why: "no card" });
                return false;
            }
            const brain = agent ? agent.brain : {};
            const before = {
                entry: (card && (typeof card.entry === "string")) ? card.entry : "",
                description: (card && (typeof card.description === "string")) ? card.description : "",
                label: IS.label,
                ops: IS.ops,
                // Cheap copies, taken before anything in this transaction is applied
                world: cfg.world ? JSON.parse(JSON.stringify(CH.world)) : null,
                clocks: cfg.clocks ? JSON.parse(JSON.stringify(CH.clocks)) : null,
                bonds: cfg.bonds ? JSON.parse(JSON.stringify(CH.bonds)) : null
            };
            let entry = before.entry;
            if (entry.endsWith("UTC") && entry.startsWith("// initialized @")) {
                // This is a fresh brain card with only the timestamp comment
                // Log this info immediately before processing the first valid operation
                // Add metadata and initialize the brain object in the log
                entry = `${entry.trimStart()}\n${path(pending.agent, "metadata")} = ${(
                    JSON.stringify(agent.metadata, null, 2)
                )};\n${path(pending.agent)} = {};\n// Entry: Displays recent brain operations to the player\n// Triggers: Configurable settings for this NPC alone\n// Notes: Allows the player to view/edit actual brain contents`;
            }
            if (cfg.world) {
                // Module C: the card is authoritative, so a hand edit made since this
                // transaction was staged wins over anything state remembers
                readWorld("");
            }
            if (cfg.bonds && agent) {
                // Module I: same rule, a standing edited by hand on the card wins
                syncBondFromCard(pending.agent, brain);
                // Let module operations reach this brain, for the mirror back
                cfg.brain = brain;
                cfg.brainAgent = pending.agent;
            }
            let ops = IS.ops;
            let applied = 0;
            const record = (line = "") => {
                ops++;
                applied++;
                entry = `${entry}\n\n// operation ${ops}\n${line}`.trimStart();
            };
            for (const op of pending.ops) {
                const line = applyOp(op, brain, cfg);
                if (typeof line !== "string") {
                    // Refused: an unsafe descriptor, or a key the player already removed
                    CH.stats.refused++;
                    continue;
                }
                record(line);
                if (cfg.knows && (op.mod === "brain") && ((op.op === "set") || (op.op === "merge"))) {
                    // A thought is a fact its owner holds, and facts are what spread
                    applyModuleOp({
                        mod: "fact",
                        op: "assert",
                        key: `${pending.agent}:${bareKey(String(op.key))}`.slice(0, 60),
                        value: String(op.value),
                        cls: classify(String(op.value)),
                        knownBy: Array.isArray(pending.actors) ? pending.actors : [pending.agent]
                    }, cfg);
                }
            }
            if (applied === 0) {
                journal("empty", { ops: pending.ops.length });
                return false;
            }
            if (agent) {
                const seeded = seedCore(brain, pending.agent, cfg);
                if (seeded !== null) {
                    record(seeded);
                }
                // Policy eviction, rather than asking the model which memory to burn
                for (const line of evictIfNeeded(brain, pending.agent, cfg)) {
                    record(line);
                }
                // Keep the operation log from growing unbounded
                // Limit to approximately 2000 chars to satisfy AID's soft entry limit
                card.entry = entry.split(/\n\n/).slice(-2000).reduceRight((out, op) => (
                    // Only include operations that fit within the char limit
                    ((out.length + op.length + 2) < 2001) ? `${op}${out ? `\n\n${out}` : ""}` : out
                ), "");
                card.description = serializeBrain(brain, pending.json === true);
            }
            // Rumour moves exactly once per accepted turn, never on a retry
            propagateFacts(cfg, Array.isArray(pending.agents) ? pending.agents : []);
            if (cfg.world) {
                writeWorld();
            }
            IS.ops = ops;
            CH.stats.commits++;
            CH.undo = (
                ((before.entry.length + before.description.length) <= CAP.undo)
                ? {
                    agent: pending.agent,
                    turn: pending.actionCount,
                    entry: before.entry,
                    description: before.description,
                    label: before.label,
                    ops: before.ops,
                    // A transaction is more than its thought: the day it moved, the clock
                    // it turned and the standing it changed all belong to the same undo
                    world: before.world,
                    clocks: before.clocks,
                    bonds: before.bonds
                }
                // An oversized snapshot is not worth the state budget it would cost
                : null
            );
            journal("commit", { ops: applied, agent: pending.agent });
            enforceStateBudget(cfg);
            return true;
        } catch (error) {
            // A commit must never throw out of a hook, whatever the cards contain
            log(`Chronicle: transaction dropped (${error?.message ?? "unknown error"})`);
            journal("dropped", { why: "threw" });
            return false;
        }
    };
    /**
     * Resolves whatever transaction is staged, at the top of every hook
     *
     * Commits only when both hold:
     * - the action counter has moved past the turn that staged it, and
     * - the generation that staged it can still be found in history
     * A retry satisfies neither, because the discarded generation never entered history
     * and the counter never advanced. Anything unresolved is discarded silently.
     * @returns {void}
     */
    const settlePending = ({ discardStale = true } = {}) => {
        // Every staging this turn produced, newest last. AI Dungeon generates retry
        // candidates as a batch, and it is not established whether onOutput fires once per
        // batch or once per candidate. If it fires per candidate then several transactions
        // exist for one visible turn, only one of which the player will ever see, so the
        // ledger keeps them all and lets history decide which one was real
        const candidates = (Array.isArray(CH.candidates) && (0 < CH.candidates.length))
            ? CH.candidates
            : (CH.pending ? [CH.pending] : []);
        if (candidates.length === 0) {
            return;
        }
        const turn = getActionCount();
        if (candidates.every(candidate => (
            !Number.isInteger(candidate?.actionCount) || (turn <= candidate.actionCount)
        ))) {
            if (!discardStale) {
                // Called from onOutput, where a transaction already staged for this same
                // turn is a sibling candidate from the same batch, not a superseded retry.
                // A real retry is discarded by the context hook, which runs first
                return;
            }
            // Still the same turn, so this is a retry, an erase, or an interrupted generation
            discardPending("turn did not advance");
            return;
        }
        /**
         * Does this generation appear in history?
         * Its zero-width markers count as proof too, in case another modifier reshaped the
         * text on the way out
         * @param {Object} candidate
         * @returns {boolean}
         */
        const survived = (candidate) => {
            if (!candidate || !Number.isInteger(candidate.actionCount) || (turn <= candidate.actionCount)) {
                return false;
            }
            for (let [i, checked] = [history.length - 1, 0]; (-1 < i) && (checked < 4); i--) {
                const action = history[i];
                if (!action || (action.type !== "continue")) {
                    continue;
                }
                checked++;
                const actionText = action.text ?? action.rawText ?? "";
                if (fingerprint(actionText) === candidate.fingerprint) {
                    return true;
                }
                if (
                    (typeof candidate.encoding === "string") && (candidate.encoding !== "")
                    && (typeof actionText === "string") && actionText.includes(candidate.encoding)
                ) {
                    return true;
                }
            }
            return false;
        };
        // The last staging that matches history wins. The others were candidates the
        // player never saw, and are rolled back with everything else
        let chosen = null;
        for (let i = candidates.length - 1; (-1 < i) && (chosen === null); i--) {
            if (survived(candidates[i])) {
                chosen = candidates[i];
            }
        }
        if (chosen === null) {
            discardPending("generation not found in history");
            return;
        }
        const rollback = candidates.reduce((lowest, candidate) => (
            Number.isInteger(candidate?.labelStart) ? Math.min(lowest, candidate.labelStart) : lowest
        ), Number.MAX_SAFE_INTEGER);
        CH.candidates = [];
        CH.pending = chosen;
        const committed = commitPending();
        if (committed) {
            // Labels burned by candidates nobody saw are released, so the counter stays
            // dense across the turns that actually happened
            const highest = chosen.ops.reduce((top, op) => (
                Number.isInteger(op?.label) ? Math.max(top, op.label) : top
            ), Number.isInteger(rollback) ? rollback : 0);
            if ((0 < highest) && (highest < IS.label)) {
                IS.label = highest;
            }
        }
        return;
    };
    // ==================== MODULE J - DIAGNOSTICS AND SAFETY RAILS ====================
    /**
     * How long this hook has been running
     * @returns {number} Milliseconds since the hook began
     */
    const elapsed = () => (Date.now() - started);
    /**
     * Decides whether optional work still fits inside the hook's time budget
     * Optional work is anything the adventure survives without: audits, compression,
     * knowledge propagation, diagnostics. Story text is never optional
     * @param {Object} config - Validated config
     * @param {number} need - Rough cost of the work, in milliseconds
     * @returns {boolean} true if there is room
     */
    const affordable = (config = {}, need = 50) => {
        if (config.diag !== true) {
            // Without the diagnostics module there is no rail, and behaviour is unchanged
            return true;
        }
        if (need < (config.timeBudget - elapsed())) {
            return true;
        }
        CH.diag.skips++;
        log(`Chronicle: skipped optional work at ${elapsed()}ms of ${config.timeBudget}ms`);
        return false;
    };
    /**
     * Records how long a hook took, keeping a short window per hook
     * @param {string} name - Hook name
     * @returns {void}
     */
    const recordTiming = (name = "") => {
        const window = CH.diag.hooks[name];
        if (!Array.isArray(window)) {
            return;
        }
        window.push(elapsed());
        if (window.length > 20) {
            window.splice(0, window.length - 20);
        }
        return;
    };
    /**
     * Keeps the adventure's saved state inside its budget
     * Warns at 60% and trims at 85%, dropping the most expendable things first
     * @param {Object} config - Validated config
     * @returns {void}
     */
    const enforceStateBudget = (config = {}) => {
        if (config.diag !== true) {
            return;
        }
        const measure = () => JSON.stringify(state).length;
        const limit = config.stateChars;
        let size = measure();
        if (size < (limit * 0.6)) {
            CH.diag.warned = false;
            return;
        }
        if (size < (limit * 0.85)) {
            if (!CH.diag.warned) {
                CH.diag.warned = true;
                log(`Chronicle: state at ${size} of ${limit} chars`);
            }
            return;
        }
        // Trim in order of expendability, stopping as soon as the state fits again
        const trims = [
            ["undo snapshot", () => { CH.undo = null; }],
            ["staging log", () => { CH.diag.stagings = []; }],
            ["profile history", () => { CH.budget.changes = []; }],
            ["compliance window", () => {
                CH.compliance.window = (CH.compliance.window || []).slice(-8);
            }],
            ["spare retry candidates", () => {
                CH.candidates = (Array.isArray(CH.candidates) && CH.pending) ? [CH.pending] : [];
            }],
            ["journal", () => { CH.journal = CH.journal.slice(-5); }],
            ["event log", () => { CH.events = CH.events.slice(-Math.ceil(CH.events.length / 2)); }],
            ["stale beliefs", () => { CH.stale = {}; }],
            ["reference counts", () => { CH.mem = {}; }],
            ["facts", () => {
                const keys = Object.keys(CH.facts).sort((a, b) => (CH.facts[a].turn - CH.facts[b].turn));
                for (const key of keys.slice(0, Math.ceil(keys.length / 2))) {
                    delete CH.facts[key];
                }
            }],
            ["diagnostics", () => { CH.diag.hooks = { input: [], context: [], output: [] }; }]
        ];
        for (const [what, trim] of trims) {
            trim();
            size = measure();
            log(`Chronicle: trimmed ${what}, state now ${size} chars`);
            journal("trim", { what });
            if (size < (limit * 0.85)) {
                return;
            }
        }
        return;
    };
    // ==================== SHARED MODULE PLUMBING ====================
    /**
     * Finds a Chronicle-owned story card by its title, or builds it
     * Cards are looked up by an index cached in state, so a forty card adventure does not
     * pay for a full scan every turn. The index is validated on use, so a stale entry
     * simply costs one scan
     * @param {string} title - Card title
     * @param {string} entry - Initial entry, used only when the card is built
     * @param {string} description - Initial notes, used only when the card is built
     * @returns {Object|null} The card, or null if the platform refused to make one
     */
    const ownCard = (title = "", entry = "", description = "") => {
        const cached = CH.index[title];
        if (Number.isInteger(cached) && storyCards[cached] && (storyCards[cached].title === title)) {
            CH.diag.hits = (CH.diag.hits || 0) + 1;
            return storyCards[cached];
        }
        CH.diag.misses = (CH.diag.misses || 0) + 1;
        for (let i = 0; i < storyCards.length; i++) {
            if (storyCards[i] && (storyCards[i].title === title)) {
                CH.index[title] = i;
                return storyCards[i];
            }
        }
        const built = addStoryCard(title, entry, "Chronicle", title, description, { returnCard: true });
        if (built && (typeof built === "object") && !Array.isArray(built)) {
            CH.index[title] = storyCards.indexOf(built);
            return built;
        }
        for (let i = 0; i < storyCards.length; i++) {
            if (storyCards[i] && (storyCards[i].title === title)) {
                CH.index[title] = i;
                return storyCards[i];
            }
        }
        log(`Chronicle: could not create the ${title} card`);
        return null;
    };
    /**
     * Reads "key: value" lines out of player-editable card text
     * Player text is untrusted like any other: keys are bounded and values are trimmed
     * @param {string} source - Card text
     * @returns {Object} Null-prototype map of lowercase key to value
     */
    const readLines = (source = "") => {
        const out = Object.create(null);
        if (typeof source !== "string") {
            return out;
        }
        for (const line of source.split("\n").slice(0, 200)) {
            const clean = line.trim();
            const bisector = clean.indexOf(":");
            if ((clean === "") || (bisector < 1)) {
                continue;
            }
            const key = clean.slice(0, bisector).trim().toLowerCase().slice(0, 40);
            const value = clean.slice(bisector + 1).trim().slice(0, 400);
            if ((key !== "") && !reservedKeys.includes(key)) {
                out[key] = value;
            }
        }
        return out;
    };
    /**
     * Splits a semicolon list from card text into bounded entries
     * @param {string} value - Raw list
     * @param {number} max - Most entries to keep
     * @returns {string[]}
     */
    const readList = (value = "", max = 6) => (
        (typeof value === "string")
        ? value.split(/\s*;\s*/).map(part => part.trim().slice(0, 120)).filter(part => (part !== "")).slice(0, max)
        : []
    );
    /**
     * The settings a commit needs, captured while the config card is still in hand
     * A commit happens one hook later, where building the config again would cost a full
     * card scan; these are the settings that were in force when the generation happened
     * @param {Object} config - Validated config
     * @returns {Object} Small serializable settings snapshot
     */
    const moduleConfig = (config = {}) => ({
        tiers: (config.tiers === true),
        core: config.core,
        brainChars: config.brainChars,
        promote: config.promote,
        world: (config.world === true),
        maxDays: config.maxDays,
        knows: (config.knows === true),
        eventChars: config.eventChars,
        rumor: config.rumor,
        clocks: (config.clocks === true),
        bonds: (config.bonds === true),
        bondTurns: config.bondTurns,
        audit: (config.audit === true),
        diag: (config.diag === true),
        stateChars: config.stateChars,
        timeBudget: config.timeBudget
    });
    /** The settings a commit falls back on when a transaction predates them */
    const commitConfig = (pending = {}) => ({
        tiers: false, core: 5, brainChars: 4000, promote: 2, world: false, maxDays: 30,
        knows: false, eventChars: 3000, rumor: 10, clocks: false, bonds: false,
        bondTurns: 150, audit: false, diag: false, stateChars: 40000, timeBudget: 1200,
        ...((pending && (typeof pending.cfg === "object") && pending.cfg) || {})
    });
    // ==================== MODULE B - TIERED MEMORY ====================
    /**
     * The prefix that pins a thought
     * It is deliberately a character formatKey() destroys, so no model output can ever mint
     * a core thought or address one directly. Only the player and this module can
     */
    const CORE = "#";
    /**
     * Is this a pinned core thought?
     * @param {string} key
     * @returns {boolean}
     */
    const isCore = (key = "") => ((typeof key === "string") && key.startsWith(CORE));
    /**
     * The key as the model sees it, with any tier marker stripped
     * @param {string} key
     * @returns {string}
     */
    const bareKey = (key = "") => (isCore(key) ? key.slice(CORE.length) : key);
    /**
     * Resolves a key the model wrote against the keys a brain actually holds
     * A model refreshing a pinned thought writes the bare name, because that is all it was
     * shown; this maps that write back onto the pinned key instead of forking a duplicate
     * @param {Object} brain - The agent's brain
     * @param {string} key - Key as written by the model
     * @param {boolean} tiers - Is the tiered memory module on?
     * @returns {string} The key to actually write
     */
    const resolveKey = (brain = {}, key = "", tiers = false) => (
        (tiers && !own(brain, key) && own(brain, `${CORE}${key}`)) ? `${CORE}${key}` : key
    );
    /**
     * Per-agent memory metadata, created on demand
     * @param {string} agentName
     * @returns {Object} { seen: {key: turn}, hits: {key: count}, turn: number, compress: string[] }
     */
    const memoryOf = (agentName = "") => {
        if (!CH.mem[agentName] || (typeof CH.mem[agentName] !== "object")) {
            CH.mem[agentName] = { seen: {}, hits: {}, turn: -1, compress: [] };
        }
        const mem = CH.mem[agentName];
        mem.seen = (mem.seen && (typeof mem.seen === "object")) ? mem.seen : {};
        mem.hits = (mem.hits && (typeof mem.hits === "object")) ? mem.hits : {};
        mem.compress = Array.isArray(mem.compress) ? mem.compress : [];
        return mem;
    };
    /**
     * Records that a thought was linked to something that happened in the story
     * Called when a thought's label decodes out of the story text, which is the only
     * evidence Chronicle has that a thought ever mattered
     * @param {string} agentName - Whose thought
     * @param {string[]} keys - Keys whose labels appeared
     * @returns {void}
     */
    const touchThoughts = (agentName = "", keys = []) => {
        const mem = memoryOf(agentName);
        const turn = getActionCount();
        if (mem.turn === turn) {
            // Already counted this turn, so a retry cannot inflate the numbers
            return;
        }
        mem.turn = turn;
        for (const key of keys.slice(0, 32)) {
            if (!safeKey(key)) {
                continue;
            }
            mem.seen[key] = turn;
            mem.hits[key] = Math.min((mem.hits[key] || 0) + 1, 1000);
        }
        // Metadata for keys that no longer exist is dead weight
        const live = new Set(keys);
        for (const key of Object.keys(mem.seen)) {
            if (!live.has(key) && ((turn - mem.seen[key]) > 500)) {
                delete mem.seen[key];
                delete mem.hits[key];
            }
        }
        return;
    };
    /**
     * Sorts a brain's keys into tiers
     * Core is pinned and untouchable. Long-term has proven itself by being linked to the
     * story often enough. Working is everything else, and is what eviction eats first
     * @param {Object} brain - The agent's brain
     * @param {string} agentName - Whose brain
     * @param {Object} cfg - Commit settings
     * @returns {Object} { core, long, working } arrays of keys
     */
    const tiersOf = (brain = {}, agentName = "", cfg = {}) => {
        const mem = memoryOf(agentName);
        const core = [];
        const long = [];
        const working = [];
        for (const key of Object.keys(brain)) {
            if (isCore(key)) {
                core.push(key);
            } else if ((mem.hits[key] || 0) >= cfg.promote) {
                long.push(key);
            } else {
                working.push(key);
            }
        }
        // Least recently referenced first, so eviction always takes the coldest thought
        const coldest = (a, b) => ((mem.seen[a] || 0) - (mem.seen[b] || 0));
        long.sort(coldest);
        working.sort(coldest);
        return { core, long, working };
    };
    /**
     * How many characters of thought a brain is holding
     * @param {Object} brain
     * @returns {number}
     */
    const brainSize = (brain = {}) => Object.keys(brain).reduce(
        (total, key) => (total + key.length + String(brain[key]).length + 4), 0
    );
    /**
     * Enforces the brain's byte cap by policy instead of by asking the model
     *
     * Inner Self handed the model a "delete something" prompt whenever a brain grew too
     * large, which over a long adventure means the model eventually deletes the thing that
     * defines the character. Chronicle evicts the coldest working thought instead, and asks
     * the model for help only when there is no working thought left to take
     * @param {Object} brain - Mutated in place
     * @param {string} agentName - Whose brain
     * @param {Object} cfg - Commit settings
     * @returns {string[]} Log lines for the operation log
     */
    const evictIfNeeded = (brain = {}, agentName = "", cfg = {}) => {
        const lines = [];
        if (!cfg.tiers) {
            return lines;
        }
        const mem = memoryOf(agentName);
        // The core tier is capped. Anything over the cap is demoted rather than deleted,
        // because a player who pinned six things meant all six of them
        const pinned = Object.keys(brain).filter(isCore).filter(key => (key !== BOND_STORE));
        if (cfg.core < pinned.length) {
            const coldest = (a, b) => ((mem.seen[a] || 0) - (mem.seen[b] || 0));
            for (const key of pinned.sort(coldest).slice(0, pinned.length - cfg.core)) {
                const bare = bareKey(key);
                if (!own(brain, bare)) {
                    brain[bare] = brain[key];
                }
                delete brain[key];
                lines.push(`// core tier is full, so this thought is no longer pinned
${path(agentName)}.${bare} = ${path(agentName)}["${key}"];`);
            }
        }
        let guard = 0;
        while ((brainSize(brain) > cfg.brainChars) && (guard++ < 16)) {
            const { long, working } = tiersOf(brain, agentName, cfg);
            if (working.length > 0) {
                const key = working[0];
                delete brain[key];
                delete mem.seen[key];
                delete mem.hits[key];
                lines.push(`// evicted the coldest working thought\n${logDelete(agentName, key)}`);
                journal("evict", { agent: agentName, key: key.slice(0, 24) });
                continue;
            }
            if (long.length > 1) {
                // Nothing left to drop outright, so ask for a summary of the two coldest
                // long-term thoughts and merge them on a later turn
                mem.compress = [long[0], long[1]];
                lines.push(`// requested compression of ${bareKey(long[0])} and ${bareKey(long[1])}`);
                journal("compress", { agent: agentName });
                break;
            }
            // Only core thoughts remain, and those are never taken
            break;
        }
        return lines;
    };
    /**
     * Seeds a character with one pinned thought taken from their own story card
     *
     * A brain that starts empty has nothing to protect, so the first eviction has nothing
     * to refuse. This gives every character one fact about themselves that the system will
     * defend for the rest of the adventure
     * @param {Object} brain - Mutated in place
     * @param {string} agentName
     * @param {Object} cfg - Commit settings
     * @returns {string|null} Log line, or null if there was nothing to seed
     */
    const seedCore = (brain = {}, agentName = "", cfg = {}) => {
        if (!cfg.tiers || Object.keys(brain).some(key => (isCore(key) && (key !== BOND_STORE)))) {
            return null;
        }
        const source = storyCards.find(card => (
            card && (typeof card.title === "string")
            && (card.title.trim().toLowerCase() === agentName.toLowerCase())
            && !((typeof card.keys === "string") && card.keys.includes("\"agent\""))
        ));
        if (!source || (typeof source.entry !== "string")) {
            return null;
        }
        const sentence = source.entry.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s/)[0];
        if (!sentence || (sentence.length < 12)) {
            return null;
        }
        const key = `${CORE}defining_fact`;
        brain[key] = sentence.slice(0, 200);
        journal("seed", { agent: agentName });
        return `// pinned from ${agentName}'s own story card, and never evicted
${path(agentName)}["${key}"] = ${JSON.stringify(brain[key])};`;
    };
    /**
     * Prompt for the compression task, adapted from the Auto-Cards memory compression
     * prompt so both halves of this file ask for summaries in the same voice
     * @param {string} agentName - Whose thoughts
     * @param {string[]} pair - The two thoughts being merged
     * @returns {string}
     */
    const compressionPrompt = (agentName = "", pair = []) => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
- Start your output **immediately** with: (compress = \`One merged sentence.\`)
- Summarize and condense the two older thoughts below into a single memory
- Ensure the merged thought retains the core meaning and most essential details
- Prioritize information-density, accuracy, and completeness
- Write it from ${agentName}'s own first person perspective, as one short sentence
- Only reference information present in the two thoughts themselves, be specific
- These are old memories, so write firmly about what already happened

## THE TWO OLD THOUGHTS
1. ${pair[0] ?? ""}
2. ${pair[1] ?? ""}

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
</SYSTEM>
    `.trim();
    // ==================== MODULE C - WORLD CHRONICLE ====================
    /**
     * How narrative phrasing maps onto the calendar
     * This table is meant to be edited: add the phrasings your scenario actually uses
     * Order matters, the first match wins, so keep the specific phrases above the vague ones
     * @type {Object[]}
     */
    const TIME_TABLE = Object.freeze([
        { pattern: /\[\s*\+\s*(\d{1,3})\s*days?\s*\]/i, days: null },
        { pattern: /\b(?:a|one) fortnight(?: later| passes)?\b/i, days: 14 },
        { pattern: /\b(?:several|a few) weeks?\b/i, days: 21 },
        { pattern: /\b(?:the )?(?:next|following) week\b/i, days: 7 },
        { pattern: /\ba week (?:later|passes|goes by)\b/i, days: 7 },
        { pattern: /\b(?:several|a few|some) days (?:later|pass|go by)\b/i, days: 3 },
        { pattern: /\b(?:a couple of|two) days (?:later|pass)\b/i, days: 2 },
        { pattern: /\bthe (?:day|morning) after (?:next|tomorrow)\b/i, days: 2 },
        { pattern: /\b(?:the )?(?:next|following) (?:morning|day|dawn|evening)\b/i, days: 1 },
        { pattern: /\bthat night(?:,| ) (?:you|he|she|they) sleep\b/i, days: 1 },
        { pattern: /\btomorrow\b/i, days: 1 },
        { pattern: /\bmonths? (?:later|pass)\b/i, days: 30 },
        { pattern: /\ba year (?:later|passes)\b/i, days: 30 }
    ]);
    /** The world card's field order, which is also its priority order when space runs out */
    const WORLD_FIELDS = Object.freeze([
        { key: "date", label: "Date", priority: 1 },
        { key: "place", label: "Location", priority: 2 },
        { key: "arc", label: "Arc", priority: 3 },
        { key: "threats", label: "Open threats", priority: 4, list: true },
        { key: "debts", label: "Open debts", priority: 5, list: true },
        { key: "factions", label: "Standing", priority: 6, map: true },
        { key: "lost", label: "Lost to memory", priority: 7, list: true }
    ]);
    /**
     * Reads the world card into state
     * The card wins every conflict, so a player who edits it is always right
     * @param {Object} config - Validated config
     * @returns {Object} The world state
     */
    const readWorld = (startDate = "") => {
        const world = CH.world;
        if (world.date === "") {
            world.date = startDate || "Day 1";
        }
        const card = ownCard(
            "Chronicle",
            "The world as Chronicle currently understands it.",
            WORLD_FIELDS.map(field => `${field.label}: ${(
                (field.key === "date") ? (startDate || world.date || "Day 1") : ""
            )}`).join("\n")
        );
        if (!card) {
            return world;
        }
        const lines = readLines(card.description);
        for (const field of WORLD_FIELDS) {
            const raw = lines[field.label.toLowerCase()];
            if (typeof raw !== "string") {
                continue;
            }
            if (field.list) {
                world[field.key] = readList(raw);
            } else if (field.map) {
                const map = {};
                for (const part of readList(raw, 12)) {
                    const match = part.match(/^(.+?)\s*([+-]?\d{1,3})$/);
                    if (match) {
                        map[match[1].trim().slice(0, 40)] = Math.max(-99, Math.min(99, parseInt(match[2], 10)));
                    }
                }
                world[field.key] = map;
            } else {
                world[field.key] = raw.slice(0, 120);
            }
        }
        return world;
    };
    /**
     * Writes state back to the world card, so the player can see and edit it
     * @returns {void}
     */
    const writeWorld = () => {
        const card = ownCard("Chronicle", "The world as Chronicle currently understands it.", "");
        if (!card) {
            return;
        }
        const world = CH.world;
        card.description = WORLD_FIELDS.map(field => {
            const value = world[field.key];
            if (field.list) {
                return `${field.label}: ${(Array.isArray(value) ? value : []).join("; ")}`;
            }
            if (field.map) {
                return `${field.label}: ${Object.entries(value || {}).map(([k, v]) => `${k} ${(0 <= v) ? "+" : ""}${v}`).join("; ")}`;
            }
            return `${field.label}: ${value ?? ""}`;
        }).join("\n");
        card.entry = "The world as Chronicle currently understands it. Edit the notes below and Chronicle will believe you.";
        return;
    };
    /**
     * Renders the world block for injection, dropping whole lines when space runs out
     * A half sentence about a debt is worse than no sentence about a debt
     * @param {number} maxChars - Hard cap on the rendered block
     * @param {string[]} extra - Extra lines from other modules, already priority ordered
     * @returns {string}
     */
    const renderWorld = (maxChars = 700, extra = [], lean = false) => {
        const world = CH.world;
        const lines = [];
        for (const field of WORLD_FIELDS) {
            const value = world[field.key];
            const rendered = (
                field.list ? (Array.isArray(value) ? value : []).join("; ")
                : field.map ? Object.entries(value || {}).map(([k, v]) => `${k} ${(0 <= v) ? "+" : ""}${v}`).join("; ")
                : String(value ?? "")
            );
            if (rendered !== "") {
                lines.push({ priority: field.priority, text: `- ${field.label}: ${rendered}` });
            }
        }
        for (const [i, line] of extra.entries()) {
            lines.push({ priority: 8 + i, text: `- ${line}` });
        }
        if (lines.length === 0) {
            return "";
        }
        lines.sort((a, b) => (a.priority - b.priority));
        if (lean) {
            // Comma joined, on as few lines as the budget allows
            let joined = "";
            for (const line of lines) {
                const candidate = joined ? `${joined}; ${line.text.slice(2)}` : line.text.slice(2);
                if ((candidate.length + 9) > maxChars) {
                    continue;
                }
                joined = candidate;
            }
            return (joined === "") ? "" : `# World: ${joined}\n\n`;
        }
        const header = "# The world as it stands: [";
        let out = "";
        for (const line of lines) {
            const candidate = `${out}${line.text}\n`;
            if ((header.length + candidate.length + 2) > maxChars) {
                // Drop this line whole and keep trying the lower priority ones, which are
                // often shorter and may still fit
                continue;
            }
            out = candidate;
        }
        return (out === "") ? "" : `${header}\n${out}]\n\n`;
    };
    /**
     * Reads the calendar forward out of narrative text
     * @param {string} source - The turn's prose
     * @param {number} maxDays - Hard cap for one turn without an explicit marker
     * @returns {number} Days to advance, zero if nothing matched
     */
    const readTimePassage = (source = "", maxDays = 30) => {
        if (typeof source !== "string") {
            return 0;
        }
        const sample = source.slice(0, 4000);
        for (const rule of TIME_TABLE) {
            const match = sample.match(rule.pattern);
            if (!match) {
                continue;
            }
            if (rule.days === null) {
                // An explicit [+n days] marker is the player or author being deliberate,
                // so it is trusted beyond the per-turn cap
                const days = parseInt(match[1], 10);
                return (Number.isInteger(days) && (0 < days)) ? Math.min(days, 3650) : 0;
            }
            return Math.min(rule.days, maxDays);
        }
        return 0;
    };
    /**
     * Advances the in-game date by a number of days
     * Understands "Day 12" natively and otherwise appends a day count, because a scenario
     * may use any calendar it likes and Chronicle should not pretend to know it
     * @param {number} days
     * @returns {string} The new date
     */
    const advanceDate = (days = 0) => {
        const world = CH.world;
        world.day = Math.max(1, Math.min(world.day + days, 100000));
        const match = String(world.date).match(/^(.*?)(\d+)(.*)$/);
        world.date = (
            match
            ? `${match[1]}${Math.max(1, Math.min(parseInt(match[2], 10) + days, 100000))}${match[3]}`
            : `${world.date} (+${world.day - 1} days)`
        );
        return world.date;
    };
    // ==================== MODULE D - ENSEMBLE ====================
    /** Words that turn a name into a mention rather than an action */
    const MENTION_WORDS = Object.freeze([
        "about", "from", "of", "to", "for", "with", "like", "than", "toward", "towards",
        "near", "against", "without", "unlike", "regarding", "concerning", "and", "or"
    ]);
    /**
     * Who is actually present, as opposed to merely named
     *
     * A character who is spoken about is furniture. A character who acts or speaks is in
     * the scene. The difference is worth getting right, because it decides who thinks
     * @param {Object} config - Validated config
     * @param {number} lookBack - How many recent actions count as "the scene"
     * @returns {Object[]} [{ name, recency }] most recently active first
     */
    const presentAgents = (config = {}, lookBack = 2) => {
        const found = new Map();
        let scanned = 0;
        for (let i = history.length - 1; (-1 < i) && (scanned < lookBack); i--) {
            const actionText = history[i]?.text ?? history[i]?.rawText ?? "";
            if ((typeof actionText !== "string") || /^[\s\u200B-\u200D]*$/.test(actionText)) {
                continue;
            }
            scanned++;
            const lower = actionText.toLowerCase();
            for (const name of config.agents) {
                if (found.has(name)) {
                    continue;
                }
                const needle = name.toLowerCase();
                for (let p = lower.indexOf(needle); (p !== -1); p = lower.indexOf(needle, p + 1)) {
                    const before = (0 < p) ? lower.charCodeAt(p - 1) : 0;
                    const after = ((p + needle.length) < lower.length) ? lower.charCodeAt(p + needle.length) : 0;
                    if (((97 <= before) && (before <= 122)) || ((97 <= after) && (after <= 122))) {
                        // Part of a longer word, not a name
                        continue;
                    }
                    // A name preceded by "about" or "from" is being discussed, not acting
                    const preceding = lower.slice(Math.max(0, p - 24), Math.max(0, p - 1)).trim().split(/[\s,]+/).pop();
                    if (MENTION_WORDS.includes(preceding)) {
                        continue;
                    }
                    // Acting or speaking: a verb-ish word follows, or dialogue is nearby
                    const following = lower.slice(p + needle.length, p + needle.length + 24).trim();
                    const sentence = lower.slice(Math.max(0, p - 120), p + 120);
                    if (/^[a-z']+/.test(following) || /["«»„“”「」]/.test(sentence)) {
                        found.set(name, scanned);
                        break;
                    }
                }
            }
        }
        return [...found.entries()]
            .map(([name, recency]) => ({ name, recency }))
            .sort((a, b) => (a.recency - b.recency));
    };
    // ==================== MODULE E - KNOWLEDGE MODEL ====================
    /**
     * How far a fact travels on its own
     * Public facts are common knowledge almost immediately; sealed facts never move unless
     * someone carries them deliberately, which is what makes an intercepted letter matter
     * @type {Object}
     */
    const VISIBILITY = Object.freeze({
        public: 4,
        household: 1,
        private: 0.25,
        sealed: 0
    });
    /** Phrases that classify how far a new fact should be able to travel */
    const VISIBILITY_TABLE = Object.freeze([
        { pattern: /\b(?:announce|proclaim|public|crowd|market|everyone|whole (?:town|city))\b/i, cls: "public" },
        { pattern: /\b(?:secret|sealed|hidden|conceal|nobody|no one|never tell|swear)\b/i, cls: "sealed" },
        { pattern: /\b(?:household|servant|guild|crew|family|kitchen|staff)\b/i, cls: "household" }
    ]);
    /** Phrases that tag what kind of event a turn contained */
    const EVENT_TABLE = Object.freeze([
        { pattern: /\b(?:kill|blood|blade|strike|fight|wound)\w*\b/i, tag: "violence" },
        { pattern: /\b(?:promise|swear|vow|oath)\w*\b/i, tag: "promise" },
        { pattern: /\b(?:pay|coin|mark|debt|owe|purse)\w*\b/i, tag: "money" },
        { pattern: /\b(?:letter|message|note|manifest|ledger)\w*\b/i, tag: "document" },
        { pattern: /\b(?:leave|depart|ride|sail|arrive|return)\w*\b/i, tag: "movement" },
        { pattern: /\b(?:threat|warn|danger|hunt|search)\w*\b/i, tag: "threat" }
    ]);
    /**
     * Classifies a new fact by how far it should travel
     * @param {string} text
     * @returns {string} A key of VISIBILITY
     */
    const classify = (text = "") => {
        for (const rule of VISIBILITY_TABLE) {
            if (rule.pattern.test(text)) {
                return rule.cls;
            }
        }
        return "private";
    };
    /**
     * Tags what kind of thing happened this turn
     * @param {string} text
     * @returns {string}
     */
    const tagEvent = (text = "") => {
        for (const rule of EVENT_TABLE) {
            if (rule.pattern.test(text)) {
                return rule.tag;
            }
        }
        return "scene";
    };
    /**
     * Trims the event log to its byte cap, oldest first
     * @param {number} maxChars
     * @returns {void}
     */
    const trimEvents = (maxChars = 3000) => {
        let size = JSON.stringify(CH.events).length;
        while ((size > maxChars) && (CH.events.length > 1)) {
            CH.events.shift();
            size = JSON.stringify(CH.events).length;
        }
        return;
    };
    /**
     * Spreads facts to people who were not there
     *
     * Called once per committed turn, never on a retry, so a discarded generation cannot
     * leak a secret that was never told
     * @param {Object} config - Commit settings
     * @param {string[]} agents - Everyone who could hear
     * @returns {number} How many facts moved
     */
    const propagateFacts = (config = {}, agents = []) => {
        if (!config.knows || (config.rumor <= 0)) {
            return 0;
        }
        let moved = 0;
        for (const key of Object.keys(CH.facts)) {
            const fact = CH.facts[key];
            if (!fact || !Array.isArray(fact.known)) {
                continue;
            }
            const rate = (VISIBILITY[fact.cls] ?? 0) * (config.rumor / 100);
            if (rate <= 0) {
                continue;
            }
            for (const agentName of agents) {
                if (fact.known.includes(agentName)) {
                    continue;
                }
                if (Math.random() < rate) {
                    fact.known.push(agentName);
                    moved++;
                    // Whatever they used to believe about this is now out of date
                    if (CH.stale[agentName] && CH.stale[agentName][key]) {
                        delete CH.stale[agentName][key];
                    }
                }
            }
        }
        return moved;
    };
    /**
     * What an agent has missed, and what they still wrongly believe
     * @param {string} agentName
     * @param {number} maxChars
     * @returns {string[]} Rendered lines
     */
    const blindSpots = (agentName = "", maxChars = 400) => {
        const lines = [];
        const missed = CH.events
            .filter(event => Array.isArray(event.a) && !event.a.includes(agentName))
            .slice(-3);
        for (const event of missed) {
            lines.push(`${agentName} did not witness: ${event.tag} involving ${(event.a || []).join(" and ") || "no one known"}${event.p ? ` at ${event.p}` : ""} (${event.t})`);
        }
        const stale = CH.stale[agentName] || {};
        for (const key of Object.keys(stale).slice(0, 2)) {
            const belief = stale[key];
            if (belief && (typeof belief.value === "string")) {
                lines.push(`${agentName} still believes, wrongly: ${belief.value}`);
            }
        }
        let total = 0;
        return lines.filter(line => {
            total += line.length + 3;
            return (total <= maxChars);
        });
    };
    // ==================== MODULE F - CLOCKS AND CONSEQUENCES ====================
    /**
     * Reads the clock definitions the player authored
     *
     * Clocks advance on declared triggers and on nothing else. A clock that could advance
     * because the scene felt tense would be a mood ring, not a clock
     * @returns {Object} name -> { value, max, trigger, consequence, locked, reset }
     */
    const readClocks = () => {
        const card = ownCard("Chronicle Clocks", [
            "Progress clocks. Each clock fills only when its trigger phrase appears in the story.",
            "Edit the notes below to author your own.",
            "",
            "Format:",
            "clock_name: 0/8",
            "  trigger: the phrase that advances it",
            "  consequence: what happens when it fills",
            "  reset: true"
        ].join("\n"), [
            "example_clock: 0/6",
            "  trigger: the watch searches the barge",
            "  consequence: the guild moves against the watch openly",
            "  after: (optional) a phrase the story must reach first",
            "  reset: false"
        ].join("\n"));
        const clocks = Object.create(null);
        if (!card || (typeof card.description !== "string")) {
            return clocks;
        }
        let current = null;
        for (const line of card.description.split("\n").slice(0, 120)) {
            const indented = /^\s+/.test(line);
            const clean = line.trim();
            if (clean === "") {
                continue;
            }
            const bisector = clean.indexOf(":");
            if (bisector < 1) {
                continue;
            }
            const key = clean.slice(0, bisector).trim().toLowerCase();
            const value = clean.slice(bisector + 1).trim();
            if (!indented) {
                const shape = value.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/);
                if (!shape || !safeKey(key)) {
                    current = null;
                    continue;
                }
                const max = Math.max(1, Math.min(parseInt(shape[2], 10), 100));
                current = {
                    value: Math.max(0, Math.min(parseInt(shape[1], 10), max)),
                    max,
                    trigger: "",
                    consequence: "",
                    condition: "",
                    locked: false,
                    reset: false
                };
                clocks[key] = current;
            } else if (current) {
                if (key === "trigger") {
                    current.trigger = value.slice(0, 120).toLowerCase();
                } else if (key === "consequence") {
                    current.consequence = value.slice(0, 200);
                } else if ((key === "after") || (key === "condition")) {
                    // The consequence waits for this phrase to appear before it surfaces
                    current.condition = value.slice(0, 120).toLowerCase();
                } else if (key === "reset") {
                    current.reset = /^(?:true|yes|on|1)$/i.test(value);
                } else if (key === "locked") {
                    current.locked = /^(?:true|yes|on|1)$/i.test(value);
                }
            }
        }
        // State remembers progress; the card remembers definitions
        for (const [name, clock] of Object.entries(clocks)) {
            const stored = CH.clocks[name];
            if (stored && Number.isInteger(stored.value)) {
                clock.value = Math.max(0, Math.min(stored.value, clock.max));
                clock.locked = (stored.locked === true);
            }
        }
        return clocks;
    };
    /**
     * Writes clock progress back to the card, so the player can watch the tension build
     * @param {Object} clocks
     * @returns {void}
     */
    const writeClocks = (clocks = {}) => {
        const card = ownCard("Chronicle Clocks", "", "");
        if (!card || (typeof card.description !== "string")) {
            return;
        }
        card.description = card.description.split("\n").map(line => {
            if (/^\s/.test(line)) {
                return line;
            }
            const bisector = line.indexOf(":");
            if (bisector < 1) {
                return line;
            }
            const name = line.slice(0, bisector).trim().toLowerCase();
            const clock = clocks[name];
            return clock ? `${line.slice(0, bisector)}: ${clock.value}/${clock.max}` : line;
        }).join("\n");
        return;
    };
    /**
     * Which clocks a turn's text declared a trigger for
     * @param {Object} clocks
     * @param {string} source - The turn's prose
     * @returns {string[]} Clock names to advance
     */
    const triggeredClocks = (clocks = {}, source = "") => {
        if (typeof source !== "string") {
            return [];
        }
        const lower = source.toLowerCase();
        return Object.entries(clocks)
            .filter(([, clock]) => (
                !clock.locked && (clock.trigger !== "") && lower.includes(clock.trigger)
            ))
            .map(([name]) => name);
    };
    /**
     * The consequences due to surface now
     * @returns {Object[]} Queue entries ready to fire
     */
    const dueConsequences = () => {
        const turn = getActionCount();
        // A condition is a phrase the story must have reached, which is what lets a letter
        // written at turn 300 wait for the right hands rather than the right turn number
        const recent = history.slice(-6).map(a => (a?.text ?? "")).join(" ").toLowerCase();
        return CH.queue.filter(item => (
            item && !item.fired
            && Number.isInteger(item.fireAtTurn) && (item.fireAtTurn <= turn)
            && ((typeof item.condition !== "string") || (item.condition === "") || recent.includes(item.condition))
        )).slice(0, 2);
    };
    // ==================== MODULE I - BONDS ====================
    /** The ladder, in order. Position is the whole point: it cannot be skipped upward */
    const BOND_STAGES = Object.freeze([
        "unknown",
        "noticed",
        "sought out",
        "trusted with something costly",
        "defended publicly",
        "privately committed",
        "formally bound"
    ]);
    /** The reserved key the model writes a bond advance into */
    const BOND_KEY = "bond";
    /** Where the bond is kept on the brain card, in the reserved namespace */
    const BOND_STORE = `${CORE}bond`;
    /**
     * Reads a bond back off a brain card
     * The card wins, exactly as it does for the world chronicle, so a player who edits a
     * standing by hand is right and Chronicle is wrong
     * @param {string} agentName
     * @param {Object} brain
     * @returns {void}
     */
    const syncBondFromCard = (agentName = "", brain = {}) => {
        if (!own(brain, BOND_STORE)) {
            return;
        }
        const written = String(brain[BOND_STORE]);
        const index = BOND_STAGES.findIndex(stage => written.toLowerCase().includes(stage));
        if (index !== -1) {
            const bond = bondOf(agentName);
            bond.stage = index;
        }
        return;
    };
    /**
     * Writes the bond onto the brain card, where the player can see and edit it
     * @param {string} agentName
     * @param {Object} brain - Mutated in place
     * @returns {void}
     */
    const syncBondToCard = (agentName = "", brain = {}) => {
        brain[BOND_STORE] = `standing with the player: ${BOND_STAGES[bondOf(agentName).stage]}`;
        return;
    };
    /**
     * An agent's bond record, created on demand
     * @param {string} agentName
     * @returns {Object} { stage, turn }
     */
    const bondOf = (agentName = "") => {
        if (!CH.bonds[agentName] || (typeof CH.bonds[agentName] !== "object")) {
            CH.bonds[agentName] = { stage: 0, turn: -100000 };
        }
        const bond = CH.bonds[agentName];
        bond.stage = Number.isInteger(bond.stage) ? Math.max(0, Math.min(bond.stage, 6)) : 0;
        bond.turn = Number.isInteger(bond.turn) ? bond.turn : -100000;
        return bond;
    };
    /**
     * Turns whatever the model wrote into a bond step
     * Accepts a stage name or a number, because models will write both
     * @param {string} agentName
     * @param {string} value - Raw value from the parenthetical
     * @returns {number} The requested delta, before any clamping
     */
    const readBondRequest = (agentName = "", value = "") => {
        const bond = bondOf(agentName);
        const clean = String(value).toLowerCase().trim();
        const digits = clean.match(/-?\d+/);
        if (digits) {
            const wanted = parseInt(digits[0], 10);
            // A bare small number is a delta, a number on the ladder is a target
            return ((-1 <= wanted) && (wanted <= 1)) ? wanted : (wanted - bond.stage);
        }
        if (/\b(?:down|back|break|broken|lost|colder|worse)\b/.test(clean)) {
            return -1;
        }
        const index = BOND_STAGES.findIndex(stage => clean.includes(stage));
        return (index === -1) ? 1 : (index - bond.stage);
    };
    // ==================== MODULE G - CONTINUITY AUDITOR ====================
    /**
     * Prompt for the audit task
     * The auditor reports, it never repairs: a confident wrong correction does more damage
     * to a long adventure than the inconsistency it was trying to fix
     * @param {string} playerName
     * @returns {string}
     */
    const auditPrompt = (playerName = "") => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
- Start your output **immediately** with: (audit = \`One sentence.\`)
- Compare the current scene against the world facts listed above
- If a fact contradicts the scene, state the single clearest contradiction in one sentence
- If everything is consistent, write exactly: (audit = \`No contradictions found.\`)
- Do not fix anything, do not change the story to match, only report
- Never invent a contradiction to have something to say

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Continue from ${playerName}'s perspective, exactly as if nothing had been asked
</SYSTEM>
    `.trim();
    /**
     * Is an audit due?
     * @param {Object} config
     * @returns {boolean}
     */
    const auditDue = (config = {}) => (
        (config.audit === true)
        && (config.auditEvery <= (getActionCount() - (CH.audit.last || 0)))
    );
    // ==================== MODULE OPERATIONS ====================
    /**
     * Applies one non-brain operation descriptor
     *
     * Every module writes through here, on the next turn, inside the same transaction as
     * the thought that accompanied it. A module that wrote directly would be a hole in the
     * ledger: a retry would roll back the thought and leave the clock advanced
     * @param {Object} op - Operation descriptor
     * @param {Object} cfg - Commit settings captured at staging time
     * @returns {string|null} Log line, or null if the operation was refused
     */
    const applyModuleOp = (op = null, cfg = {}) => {
        if (!op || (typeof op !== "object") || Array.isArray(op)) {
            return null;
        }
        if (op.mod === "world") {
            if (op.op === "advanceDays") {
                const days = Number.isInteger(op.n) ? Math.max(1, Math.min(op.n, 3650)) : 0;
                if (days === 0) {
                    return null;
                }
                return `world.date = ${JSON.stringify(advanceDate(days))};`;
            }
            if (op.op === "set") {
                const field = WORLD_FIELDS.find(f => (f.key === op.field));
                if (!field || (typeof op.value !== "string")) {
                    return null;
                }
                CH.world[field.key] = op.value.slice(0, 120);
                return `world.${field.key} = ${JSON.stringify(CH.world[field.key])};`;
            }
            if (op.op === "lose") {
                // A thought that fell out of a brain becomes a hole in the world, not silence
                if (typeof op.value !== "string") {
                    return null;
                }
                CH.world.lost = [...CH.world.lost, op.value.slice(0, 120)].slice(-3);
                return `world.lost.push(${JSON.stringify(op.value.slice(0, 120))});`;
            }
            return null;
        }
        if (op.mod === "clock") {
            if ((op.op !== "tick") || !safeKey(op.id)) {
                return null;
            }
            const clocks = readClocks();
            const clock = clocks[op.id];
            if (!clock || clock.locked) {
                return null;
            }
            const step = Number.isInteger(op.n) ? Math.max(1, Math.min(op.n, clock.max)) : 1;
            clock.value = Math.min(clock.value + step, clock.max);
            const lines = [`clocks.${op.id} = "${clock.value}/${clock.max}";`];
            if (clock.value >= clock.max) {
                // A full clock is a promise the story already made
                CH.queue = [...CH.queue, {
                    id: `${op.id}-${getActionCount()}`,
                    fireAtTurn: getActionCount() + 1,
                    condition: clock.condition || "",
                    payload: clock.consequence || `${op.id} comes due`,
                    fired: false
                }].slice(-12);
                lines.push(`queue.push(${JSON.stringify(clock.consequence || op.id)});`);
                if (clock.reset) {
                    clock.value = 0;
                    lines.push(`clocks.${op.id} = "0/${clock.max}";`);
                } else {
                    clock.locked = true;
                    lines.push(`clocks.${op.id}.locked = true;`);
                }
            }
            CH.clocks[op.id] = { value: clock.value, locked: clock.locked };
            writeClocks(clocks);
            return lines.join("\n");
        }
        if (op.mod === "queue") {
            if (op.op !== "fire") {
                return null;
            }
            const ids = Array.isArray(op.ids) ? op.ids.slice(0, 4) : [];
            const fired = [];
            CH.queue = CH.queue.filter(item => {
                if (item && ids.includes(item.id)) {
                    fired.push(item.payload);
                    return false;
                }
                return true;
            });
            return (fired.length === 0) ? null : `queue.fired(${JSON.stringify(fired)});`;
        }
        if (op.mod === "bond") {
            if ((op.op !== "step") || (typeof op.npc !== "string") || (op.npc === "")) {
                return null;
            }
            const bond = bondOf(op.npc);
            const turn = getActionCount();
            const wanted = Number.isInteger(op.delta) ? op.delta : 0;
            if (wanted === 0) {
                return null;
            }
            if (0 < wanted) {
                // Upward is one rung at a time, and never before the cooldown has passed
                if ((turn - bond.turn) < cfg.bondTurns) {
                    CH.stats.refused++;
                    return null;
                }
                if (bond.stage >= (BOND_STAGES.length - 1)) {
                    return null;
                }
                bond.stage++;
            } else {
                // Downward may skip, because trust breaks faster than it forms
                bond.stage = Math.max(0, bond.stage + wanted);
            }
            bond.turn = turn;
            if (cfg.brain && (op.npc === cfg.brainAgent)) {
                // Mirror it into the reserved namespace on that character card
                syncBondToCard(op.npc, cfg.brain);
            }
            return `bonds.${formatKey(op.npc) || "npc"} = ${JSON.stringify(BOND_STAGES[bond.stage])};`;
        }
        if (op.mod === "event") {
            if (op.op !== "record") {
                return null;
            }
            const event = {
                t: getActionCount(),
                a: (Array.isArray(op.actors) ? op.actors : []).filter(a => (typeof a === "string")).slice(0, 6),
                p: (typeof op.place === "string") ? op.place.slice(0, 60) : "",
                tag: (typeof op.tag === "string") ? op.tag.slice(0, 24) : "scene"
            };
            CH.events = [...CH.events, event].slice(-200);
            trimEvents(cfg.eventChars);
            return `events.push({ turn: ${event.t}, tag: ${JSON.stringify(event.tag)} });`;
        }
        if (op.mod === "fact") {
            if ((op.op !== "assert") || !safeKey(op.key) || (typeof op.value !== "string")) {
                return null;
            }
            const previous = CH.facts[op.key];
            const known = (Array.isArray(op.knownBy) ? op.knownBy : []).filter(a => (typeof a === "string")).slice(0, 8);
            if (previous && (typeof previous.value === "string") && (previous.value !== op.value)) {
                // Anyone who knew the old version and did not witness the change keeps
                // believing it, which is the entire point of this module
                for (const holder of (Array.isArray(previous.known) ? previous.known : [])) {
                    if (known.includes(holder)) {
                        continue;
                    }
                    CH.stale[holder] = CH.stale[holder] || {};
                    CH.stale[holder][op.key] = { value: previous.value, turn: previous.turn };
                }
            }
            CH.facts[op.key] = {
                value: op.value.slice(0, 200),
                turn: getActionCount(),
                cls: Object.prototype.hasOwnProperty.call(VISIBILITY, op.cls) ? op.cls : "private",
                known
            };
            // Facts are capped like everything else, oldest first
            const keys = Object.keys(CH.facts);
            if (keys.length > 60) {
                for (const key of keys.sort((a, b) => (CH.facts[a].turn - CH.facts[b].turn)).slice(0, keys.length - 60)) {
                    delete CH.facts[key];
                }
            }
            return null;
        }
        if (op.mod === "audit") {
            if ((op.op !== "record") || (typeof op.value !== "string")) {
                return null;
            }
            CH.audit.last = getActionCount();
            const clean = op.value.trim().slice(0, 300);
            const clear = /^no contradictions?/i.test(clean);
            CH.audit.findings = [...(clear ? [] : [{ t: getActionCount(), text: clean }]), ...CH.audit.findings].slice(0, 10);
            const card = ownCard("Chronicle Continuity Log", "Contradictions Chronicle noticed. Nothing here is corrected automatically, because a confident wrong correction is worse than a flagged inconsistency.", "");
            if (card) {
                card.description = CH.audit.findings.length
                    ? CH.audit.findings.map(finding => `Turn ${finding.t}: ${finding.text}`).join("\n\n")
                    : "No contradictions found so far.";
            }
            if (!clear) {
                state.message = `Chronicle noticed a possible contradiction: ${clean}`;
            }
            return `audit.report(${JSON.stringify(clean.slice(0, 80))});`;
        }
        return null;
    };
    // ==================== MODULE K - RUNTIME BUDGET AUTOSCALING ====================
    /**
     * What the model can actually hold, and what Chronicle is allowed to spend of it
     *
     * The context available to the supported models spans thirty to one over subscription
     * tiers, the Optimized Context toggle, and credits spent per action. On GLM the credit
     * extension is charged per action, so this number genuinely moves turn to turn inside a
     * single adventure. info.maxChars is therefore read every turn and never cached.
     *
     * Edit this table to change how Chronicle behaves at each size. Nothing else in the
     * file hardcodes an injection budget
     * @type {Object[]}
     */
    const BUDGET_TABLE = Object.freeze([
        // name, ceiling on maxChars, then the budgets that apply below that ceiling
        { name: "XS", upTo: 12000, chronicle: 350, brains: 1, digests: 0, witness: 0, clockLines: 1, audit: 0, injectPercent: 12 },
        { name: "S", upTo: 32000, chronicle: 500, brains: 1, digests: 2, witness: 0, clockLines: 1, audit: 150, injectPercent: 20 },
        { name: "M", upTo: 80000, chronicle: 700, brains: 2, digests: 3, witness: 1, clockLines: 2, audit: 100, injectPercent: 30 },
        { name: "L", upTo: 200000, chronicle: 700, brains: 3, digests: 4, witness: 2, clockLines: 99, audit: 75, injectPercent: 35 },
        { name: "XL", upTo: Infinity, chronicle: 900, brains: 4, digests: 99, witness: 99, clockLines: 99, audit: 75, injectPercent: 40 }
    ]);
    /**
     * The order in which features are given up when the context shrinks
     * Ordered, never proportional: the world and the character's own core thoughts are the
     * last things to shrink, and they never disappear entirely
     * @type {string[]}
     */
    const DEGRADE_ORDER = Object.freeze([
        "audit", "witness", "digests", "brains", "bondNote", "clockLines", "chronicle"
    ]);
    /** Two consecutive turns at a new size before switching, so a wobble does not thrash */
    const PROFILE_HYSTERESIS = 2;
    /**
     * Classifies the context the model has this turn
     * @param {number} maxChars
     * @returns {Object} A row of BUDGET_TABLE
     */
    const profileFor = (maxChars = 0) => {
        const size = (Number.isFinite(maxChars) && (0 < maxChars)) ? maxChars : 0;
        return BUDGET_TABLE.find(row => (size < row.upTo)) || BUDGET_TABLE[BUDGET_TABLE.length - 1];
    };
    /**
     * Settles on a profile, with hysteresis, and records the change
     * @param {number} maxChars - This turn's reading, never a cached one
     * @returns {Object} The profile in force
     */
    const settleProfile = (maxChars = 0) => {
        const observed = profileFor(maxChars);
        const budget = CH.budget;
        budget.maxChars = maxChars;
        // A retried turn re-reads the same context size; it is not new evidence
        const repeat = (budget.turn === getActionCount());
        budget.turn = getActionCount();
        if (repeat && (budget.profile !== "")) {
            return BUDGET_TABLE.find(row => (row.name === budget.profile)) || observed;
        }
        if (budget.profile === "") {
            // First reading of the adventure, adopt it immediately
            budget.profile = observed.name;
            budget.candidate = observed.name;
            budget.streak = 0;
            return observed;
        }
        if (observed.name === budget.profile) {
            budget.candidate = observed.name;
            budget.streak = 0;
            return observed;
        }
        budget.streak = (budget.candidate === observed.name) ? (budget.streak + 1) : 1;
        budget.candidate = observed.name;
        if (budget.streak < PROFILE_HYSTERESIS) {
            // Not yet convinced. Keep spending at the old size
            return BUDGET_TABLE.find(row => (row.name === budget.profile)) || observed;
        }
        const from = budget.profile;
        budget.profile = observed.name;
        budget.streak = 0;
        budget.changes = [...(budget.changes || []), { turn: getActionCount(), from, to: observed.name, maxChars }].slice(-8);
        log(`Chronicle: context profile ${from} -> ${observed.name} (${maxChars} chars)`);
        journal("profile", { why: `${from}>${observed.name}` });
        return observed;
    };
    // ==================== MODULE L - COMPLIANCE MONITOR ====================
    /**
     * Whether the model can actually answer the questions Chronicle asks
     *
     * The parenthetical grammar is only as good as the model's willingness to emit it, and
     * Dynamic DeepSeek rotates between three models on every action, so willingness is not
     * a fixed property of an adventure. This measures it instead of assuming it
     */
    const COMPLIANCE_BANDS = Object.freeze([
        { name: "healthy", floor: 0.8 },
        { name: "degraded", floor: 0.4 },
        { name: "minimal", floor: -1 }
    ]);
    /** Samples kept, and the run of good samples needed to climb one band */
    const COMPLIANCE_WINDOW = 40;
    const COMPLIANCE_RECOVERY = 20;
    /** Fewer samples than this and the band stays where it is */
    const COMPLIANCE_MINIMUM = 6;
    /**
     * Records how a task turn went
     * @param {number} score - 1 answered cleanly, 0.5 recovered from malformed, 0 no answer
     * @returns {void}
     */
    const recordCompliance = (score = 0) => {
        const compliance = CH.compliance;
        const turn = getActionCount();
        if (!Array.isArray(compliance.window)) {
            compliance.window = [];
        }
        const last = compliance.window[compliance.window.length - 1];
        if (last && (last.t === turn)) {
            // A retried turn replaces its own sample rather than adding another
            last.r = score;
        } else {
            compliance.window.push({ t: turn, r: score });
        }
        if (compliance.window.length > COMPLIANCE_WINDOW) {
            compliance.window.splice(0, compliance.window.length - COMPLIANCE_WINDOW);
        }
        return;
    };
    /**
     * The share of recent tasks the model answered
     * @returns {number} 0 to 1, or 1 when there is not enough evidence yet
     */
    const complianceRate = () => {
        const window = Array.isArray(CH.compliance.window) ? CH.compliance.window : [];
        if (window.length < COMPLIANCE_MINIMUM) {
            return 1;
        }
        return window.reduce((total, sample) => (total + (Number(sample.r) || 0)), 0) / window.length;
    };
    /**
     * Settles the compliance band
     * Falling is immediate, because continuing to ask a model that cannot answer wastes
     * every turn. Climbing takes a run of good answers, one band at a time
     * @param {Object} config - Validated config
     * @returns {string} The band in force
     */
    const settleBand = (config = {}) => {
        const compliance = CH.compliance;
        const rate = complianceRate();
        const observed = COMPLIANCE_BANDS.find(band => (rate >= band.floor)).name;
        const current = compliance.band || "healthy";
        const rank = (name) => COMPLIANCE_BANDS.findIndex(band => (band.name === name));
        if (rank(observed) > rank(current)) {
            // Worse than where we are: drop immediately, and all the way
            compliance.band = observed;
            compliance.streak = 0;
            compliance.since = getActionCount();
            // The worst band this adventure has seen, which is what a test or a player
            // wants to know after the fact
            if (rank(observed) > rank(compliance.lowest || "healthy")) {
                compliance.lowest = observed;
            }
            if (observed === "minimal") {
                compliance.cooldownUntil = getActionCount() + config.cooldown;
                if (compliance.told !== true) {
                    compliance.told = true;
                    state.message = "Chronicle has stopped asking this model to record thoughts: it answered too few of them. It will try again shortly. The world and existing memories are still being kept.";
                }
            }
            log(`Chronicle: compliance ${current} -> ${observed} (${Math.round(rate * 100)}%)`);
            journal("band", { why: `${current}>${observed}` });
            return observed;
        }
        if (rank(observed) < rank(current)) {
            // Better than where we are: climb one band, and only after a real run
            compliance.streak = (compliance.streak || 0) + 1;
            if (compliance.streak >= COMPLIANCE_RECOVERY) {
                compliance.band = COMPLIANCE_BANDS[Math.max(0, rank(current) - 1)].name;
                compliance.streak = 0;
                compliance.told = false;
                log(`Chronicle: compliance ${current} -> ${compliance.band} (${Math.round(rate * 100)}%)`);
                journal("band", { why: `${current}>${compliance.band}` });
            }
            return compliance.band;
        }
        // Neither better nor worse. A rate sitting just above a threshold will dip below it
        // now and then as the window rolls; decaying rather than resetting means those dips
        // slow recovery instead of preventing it forever
        compliance.streak = Math.max(0, (compliance.streak || 0) - 1);
        return current;
    };
    /**
     * Is Chronicle allowed to ask this model for anything this turn?
     * @param {Object} config - Validated config
     * @returns {boolean}
     */
    const mayIssueTask = (config = {}) => {
        if (CH.compliance.band !== "minimal") {
            return true;
        }
        // In the minimal band the world and existing brains still go in, read only
        return (CH.compliance.cooldownUntil <= getActionCount());
    };
    // ==================== MODULE M - INJECTION CANARY ====================
    /**
     * Whether context injections are reaching the model at all
     *
     * With Optimized Context enabled, the context hook may be read-only: everything
     * Chronicle writes is silently discarded, and every symptom looks exactly like a model
     * that will not follow instructions. The two are told apart by asking for something so
     * trivial that any model would comply if it saw it: begin the reply with (ok).
     *
     * A context modifier cannot observe its own return value, so this is the only honest
     * test available. Three misses in a row and Chronicle stops trusting the channel
     */
    const CANARY_INTERVAL = 12;
    const CANARY_MISSES_TO_FAIL = 3;
    const CANARY_MARK = "(ok)";
    /**
     * Should this turn carry a canary?
     * @param {Object} config - Validated config
     * @returns {boolean}
     */
    const canaryDue = (config = {}) => {
        if (config.canary !== true) {
            return false;
        }
        const canary = CH.canary;
        if (canary.state === "landing") {
            // Proven once. Re-check occasionally, in case the player flips the toggle
            return ((getActionCount() - (canary.lastTurn || 0)) >= (CANARY_INTERVAL * 8));
        }
        return ((getActionCount() - (canary.lastTurn || 0)) >= CANARY_INTERVAL);
    };
    /** The canary instruction, kept as short as anything in this file */
    const canaryPrompt = () => `<SYSTEM>\n# Begin your reply with exactly ${CANARY_MARK} and then continue the story normally.\n</SYSTEM>`;
    /**
     * Records the result of a canary turn
     * @param {boolean} seen - Did the reply carry the mark?
     * @returns {void}
     */
    const recordCanary = (seen = false) => {
        const canary = CH.canary;
        canary.lastTurn = getActionCount();
        if (seen) {
            canary.hits = (canary.hits || 0) + 1;
            canary.misses = 0;
            if (canary.state !== "landing") {
                canary.state = "landing";
                log("Chronicle: context injections confirmed landing");
                journal("canary", { why: "landing" });
            }
            return;
        }
        canary.misses = (canary.misses || 0) + 1;
        if ((canary.misses >= CANARY_MISSES_TO_FAIL) && (canary.state !== "blocked")) {
            canary.state = "blocked";
            log("Chronicle: context injections are not reaching the model, falling back to memory");
            journal("canary", { why: "blocked" });
            if (canary.told !== true) {
                canary.told = true;
                state.message = "Chronicle's context injections are not reaching this model. This is what the Optimized Context setting does. Chronicle has fallen back to the memory channel, which carries the world but not the full simulation. Turning Optimized Context off restores it.";
            }
        }
        return;
    };
    /**
     * The fallback channel, used when the context hook's work is being discarded
     *
     * frontMemory sits directly in front of the model's continuation and authorsNote rides
     * along with it, so between them the world survives even when the context hook does not.
     * Written from onInput, which takes effect on the turn being generated
     * @param {Object} config - Validated config
     * @returns {void}
     */
    const writeFallbackChannel = (config = {}) => {
        if (!globalThis.state) {
            return;
        }
        state.memory = (state.memory && (typeof state.memory === "object")) ? state.memory : {};
        if (CH.canary.state !== "blocked") {
            // Only clear what this module wrote, never the player's own memory
            if (typeof state.memory.frontMemory === "string" && state.memory.frontMemory.startsWith("[Chronicle]")) {
                state.memory.frontMemory = "";
            }
            if (typeof state.memory.authorsNote === "string" && state.memory.authorsNote.startsWith("[Chronicle]")) {
                state.memory.authorsNote = "";
            }
            return;
        }
        // Everything that has to survive the narrower channel, in priority order
        const budget = Math.max(200, Math.min(600, Math.floor((CH.budget.maxChars || 8000) * 0.04)));
        const lines = [];
        if (config.world === true) {
            const world = CH.world;
            lines.push([
                `Date ${world.date}`,
                world.place ? `at ${world.place}` : "",
                world.arc ? `arc: ${world.arc}` : "",
                (world.threats.length ? `threats: ${world.threats.slice(0, 2).join(", ")}` : "")
            ].filter(part => (part !== "")).join("; "));
        }
        if ((config.bonds === true) && (IS.agent !== "") && (IS.agent !== " ")) {
            lines.push(`${IS.agent} stands at "${BOND_STAGES[bondOf(IS.agent).stage]}" with ${config.player}`);
        }
        const rendered = `[Chronicle] ${lines.filter(line => (line !== "")).join(" | ")}`.slice(0, budget);
        state.memory.frontMemory = (lines.length === 0) ? "" : rendered;
        return;
    };
    // ==================== MODULE N - LEAN EMISSION ====================
    /**
     * Terse prompts, for when the context is small or the model is struggling
     *
     * DeepSeek and GLM both follow one short instruction better than fifteen long ones, and
     * a small-context turn spent on politeness is a turn the story does not get
     * @param {string} kind - "assign", "choice", "forget", "audit" or "compress"
     * @param {Object} parts - { agent, player, pov, pair }
     * @returns {string}
     */
    const leanPrompt = (kind = "assign", parts = {}) => {
        const who = parts.agent || "the character";
        const grammar = {
            assign: `(key_name = \`One short first person thought.\`)`,
            choice: `(key_name = \`One short first person thought.\`) or (new_key = old_key) or (delete old_key)`,
            forget: `(delete key_name)`,
            audit: `(audit = \`One sentence, or: No contradictions found.\`)`,
            compress: `(compress = \`One sentence merging both.\`)`
        }[kind] || `(key_name = \`One short first person thought.\`)`;
        const instruction = {
            assign: `Begin with one ${who} thought in this exact form, then a space, then the story:`,
            choice: `Begin with exactly one of these forms, then a space, then the story:`,
            forget: `${who}'s memory is full. Begin with this exact form naming an existing key, then a space, then the story:`,
            audit: `Compare the scene against the facts above. Begin with this exact form, then a space, then the story:`,
            compress: `Merge these two ${who} memories into one. Begin with this exact form, then a space, then the story:`
        }[kind] || `Begin with this exact form, then a space, then the story:`;
        return `<SYSTEM>\n# ${instruction}\n${grammar}${(
            (kind === "compress") ? `\n1. ${(parts.pair || [])[0] ?? ""}\n2. ${(parts.pair || [])[1] ?? ""}` : ""
        )}\n</SYSTEM>`;
    };
    /**
     * The one-line operating environment, replacing the fifteen line version
     * @param {Object} parts - { agent, player, pov }
     * @returns {string}
     */
    const leanDirective = (parts = {}) => (
        `<SYSTEM>\n# ${parts.agent} is a character in this story with a mind of their own, written from ${parts.player}'s ${parts.pov} person perspective.\n</SYSTEM>`
    );
    // ==================== RUNTIME ====================
    /**
     * The effective settings for this turn: the player's config, clamped by the context the
     * model actually has and by how well it has been answering
     *
     * Returns the config untouched when modules K, L and N are all off, which is what keeps
     * a default install byte-identical to Inner Self
     * @param {Object} config - Validated config
     * @returns {Object} Effective config, plus profile, band and lean
     */
    const runtimeFor = (config = {}) => {
        const runtime = {
            ...config,
            profile: "",
            band: "healthy",
            lean: false,
            digests: 99,
            witness: 99,
            clockLines: 99,
            bondNote: true,
            injectCap: Infinity,
            landing: (config.canary === true) ? CH.canary.state : "landing"
        };
        {
            const maxChars = Number.isInteger(info.maxChars) ? info.maxChars : 0;
            const profile = settleProfile(maxChars);
            runtime.profile = profile.name;
            // A profile only ever takes away. The player's own settings stay the ceiling
            runtime.worldChars = Math.min(config.worldChars, profile.chronicle);
            runtime.brains = Math.min(config.brains, profile.brains);
            runtime.digests = profile.digests;
            runtime.witness = profile.witness;
            runtime.clockLines = profile.clockLines;
            runtime.auditEvery = (profile.audit === 0) ? 0 : Math.max(config.auditEvery, profile.audit);
            runtime.audit = (config.audit === true) && (profile.audit !== 0);
            runtime.injectCap = Math.floor((maxChars || 0) * (profile.injectPercent / 100)) || Infinity;
            runtime.lean = (config.lean === true) && ["XS", "S"].includes(profile.name);
        }
        {
            runtime.band = settleBand(config);
            if (runtime.band !== "healthy") {
                // Degraded and minimal both stop the extras competing for the model's
                // attention, in the order laid down by DEGRADE_ORDER
                runtime.lean = (config.lean === true) || runtime.lean;
                runtime.audit = false;
                runtime.witness = 0;
                runtime.digests = Math.min(runtime.digests, 1);
                runtime.brains = 1;
            }
        }
        return runtime;
    };
    /**
     * Applies the ordered degradation until the turn's injections fit the budget
     * Chronicle and core thoughts are last, and never reach zero
     * @param {Object} runtime - Effective settings, mutated in place
     * @param {number} projected - Characters this turn wants to inject
     * @returns {Object} The runtime, degraded as far as it needed to be
     */
    const degradeStep = (runtime = {}, index = 0) => {
        const feature = DEGRADE_ORDER[index];
        if (feature === "audit") {
            runtime.audit = false;
        } else if (feature === "witness") {
            runtime.witness = 0;
        } else if (feature === "digests") {
            runtime.digests = 0;
        } else if (feature === "brains") {
            runtime.brains = 1;
        } else if (feature === "bondNote") {
            runtime.bondNote = false;
        } else if (feature === "clockLines") {
            runtime.clockLines = 1;
        } else if (feature === "chronicle") {
            // The floor, never zero: a world nobody can see is not a world
            runtime.worldChars = Math.max(180, Math.min(runtime.worldChars, Math.floor(runtime.injectCap * 0.5)));
        }
        runtime.degraded = feature;
        return runtime;
    };
    // ==================== CONTEXT OVERLAY ====================
    /**
     * Everything the modules want to say, rendered above the brain block
     *
     * Returns an empty string when every module is off, which is what keeps a default
     * install byte-identical to Inner Self
     * @param {Object} config - Validated config
     * @param {Object[]} present - Present agents, most recent first
     * @returns {string}
     */
    const buildOverlay = (config = {}, present = [], primary = "") => {
        const parts = [];
        if ((config.bonds === true) && (config.bondNote !== false) && (primary !== "")) {
            // Module I tells the model how to record a change in standing, in the grammar
            // the thought parser already reads. There is no second parser
            const bond = bondOf(primary);
            const waited = (getActionCount() - bond.turn);
            if (config.lean === true) {
                // One line, because a small context turn spent on ceremony is a turn the
                // story does not get
                parts.push(`<SYSTEM>\n# ${primary} stands at "${BOND_STAGES[bond.stage]}" with ${config.player}.${(
                    (waited < config.bondTurns) ? "" : ` Write (bond = \`${BOND_STAGES[Math.min(bond.stage + 1, BOND_STAGES.length - 1)]}\`) only if this scene earned it.`
                )}\n</SYSTEM>\n\n`);
            } else {
            parts.push(`<SYSTEM>\n# ${primary} currently stands at "${BOND_STAGES[bond.stage]}" with ${config.player}.\n# ${(
                (waited < config.bondTurns)
                ? `That standing is settled for now and must not change.`
                : `If, and only if, this scene has genuinely earned it, ${primary} may record the next rung by writing (bond = \`${BOND_STAGES[Math.min(bond.stage + 1, BOND_STAGES.length - 1)]}\`) in place of a thought.`
            )}\n# The ladder never skips upward: ${BOND_STAGES.join(", ")}.\n# A betrayal may drop ${primary} several rungs at once, written the same way.\n</SYSTEM>\n\n`);
            }
        }
        if (config.world === true) {
            const extra = [];
            if (config.clocks === true) {
                for (const [name, clock] of Object.entries(readClocks())) {
                    if (0 < clock.value) {
                        extra.push(`Clock ${name.replace(/_/g, " ")}: ${clock.value}/${clock.max}${clock.locked ? " (spent)" : ""}`);
                    }
                }
            }
            parts.push(renderWorld(config.worldChars, extra.slice(0, config.clockLines ?? 99), config.lean === true));
        }
        if (config.clocks === true) {
            const due = dueConsequences();
            if (0 < due.length) {
                // A consequence that fired is an instruction, not a hint
                parts.push(`<SYSTEM>\n# Bring this to the surface now, in this scene:\n${(
                    due.map(item => `- ${item.payload}`).join("\n")
                )}\n</SYSTEM>\n\n`);
                CH.fire = { turn: getActionCount(), ids: due.map(item => item.id) };
            }
        }
        if ((config.knows === true) && (0 < present.length)) {
            const lines = [];
            for (const { name } of present.slice(0, config.brains)) {
                lines.push(...blindSpots(name, 240));
            }
            lines.splice(Number.isInteger(config.witness) ? config.witness : lines.length);
            if (0 < lines.length) {
                parts.push(`# What the people here do not know: [\n${lines.map(line => `- ${line}`).join("\n")}\n]\n\n`);
            }
        }
        if ((config.ensemble === true) && (config.brains < present.length) && (config.digests !== 0)) {
            // Everyone present but crowded out of a full brain still gets a line, so they
            // are people in the scene rather than furniture
            const digests = [];
            const room = Number.isInteger(config.digests) ? config.digests : 4;
            for (const { name } of present.slice(config.brains, config.brains + Math.min(room, 4))) {
                const other = new Agent(name, { percent: config.percent });
                const brain = other.brain;
                let best = null;
                let bestLabel = -1;
                for (const key of Object.keys(brain)) {
                    const value = String(brain[key]);
                    const arrow = value.indexOf("→");
                    const label = (arrow === -1) ? 0 : (parseInt(value.slice(0, arrow), 10) || 0);
                    if (bestLabel < label) {
                        bestLabel = label;
                        best = value.slice(arrow + 1).trim();
                    }
                }
                other.lobotomize();
                if (best) {
                    digests.push(`- ${name}: ${best}`);
                }
            }
            if (0 < digests.length) {
                parts.push(`# Also here, and thinking their own thoughts: [\n${digests.join("\n")}\n]\n\n`);
            }
        }
        return parts.join("");
    };
    /**
     * Full brains for the other characters in the scene
     *
     * The context budget is split between everyone present rather than handed to one of
     * them, so a three character scene reads as three people instead of one person and two
     * pieces of furniture
     * @param {Object} config - Validated config
     * @param {Object[]} present - Present agents, most recent first
     * @param {string} primary - The agent who will actually write this turn
     * @param {Set} whitelist - Labels allowed to decode, extended in place
     * @returns {string}
     */
    const ensembleBlocks = (config = {}, present = [], primary = "", whitelist = new Set(), storyChars = 4000) => {
        if (config.ensemble !== true) {
            return "";
        }
        const others = present.filter(entry => (entry.name !== primary)).slice(0, Math.max(0, config.brains - 1));
        const blocks = [];
        for (const { name } of others) {
            const other = new Agent(name, { percent: config.percent });
            const brain = other.brain;
            const thoughts = [];
            for (const key of Object.keys(brain)) {
                const value = String(brain[key]);
                const arrow = value.indexOf("→");
                const label = (arrow === -1) ? null : parseInt(value.slice(0, arrow), 10);
                if (Number.isInteger(label)) {
                    whitelist.add(label);
                }
                thoughts.push((config.lean === true)
                    ? `${Number.isInteger(label) ? `[${label}] ` : ""}${bareKey(key)}: ${value.slice(arrow + 1).trim()}`
                    : `${Number.isInteger(label) ? `[${label}] ` : ""}(${bareKey(key)}: \`${value.slice(arrow + 1).trim()}\`)`);
            }
            other.lobotomize();
            if (thoughts.length === 0) {
                // Present, but has never had a thought yet. Saying so keeps them a person
                // in the scene rather than scenery the narrator may quietly forget
                blocks.push(`# ${name}${name.toLowerCase().endsWith("s") ? "'" : "'s"} brain and inner self: [\n- ${name} is here, and has not formed any thoughts yet.\n]`);
                continue;
            }
            // The budget is the same one a single brain would have had, divided between
            // everybody present rather than handed to whoever spoke last
            const share = Math.max(200, Math.floor(
                ((config.percent / 100) * storyChars) / Math.max(1, config.brains)
            ));
            let block = "";
            for (const thought of thoughts) {
                if ((block.length + thought.length + 1) > share) {
                    break;
                }
                block += `${thought}\n`;
            }
            if (block !== "") {
                blocks.push((config.lean === true)
                    ? `${name} mind:\n${block.trimEnd()}`
                    : `# ${name}${name.toLowerCase().endsWith("s") ? "'" : "'s"} brain and inner self: [\n${block.trimEnd()}\n]`);
            }
        }
        return (blocks.length === 0) ? "" : `${blocks.join("\n\n")}\n\n`;
    };
    // ==================== MODULE H - PLAYER CONSOLE ====================
    /**
     * Commands the platform itself handles
     *
     * Chronicle refuses to register any of these, so they pass through untouched. This list
     * is not verifiable from inside a script, so it is deliberately wide and deliberately
     * editable: add anything the platform claims later, and Chronicle will stand aside
     * @type {string[]}
     */
    const NATIVE_COMMANDS = Object.freeze([
        "reset", "retry", "revert", "erase", "redo", "undoall", "alter", "remember",
        "note", "continue", "do", "say", "story", "see", "image", "settings", "quit",
        "exit", "save", "load", "ac"
    ]);
    /**
     * Handles a slash command typed by the player
     *
     * Console changes are applied immediately rather than staged. There is no generation to
     * discard: the player typed this, and a retry regenerates model output, never input
     * @param {string} command - Raw input text
     * @param {Object} config - Validated config
     * @returns {string|null} The reply to show, or null if this was not a command
     */
    const runCommand = (command = "", config = {}) => {
        const match = String(command).trim().match(/^\/([a-z]+)\s*([\s\S]{0,200})$/i);
        if (!match) {
            return null;
        }
        const name = match[1].toLowerCase();
        if (NATIVE_COMMANDS.includes(name)) {
            // The platform owns this one. A player who breaks their own retry because
            // Chronicle ate /reset will not be charmed by the explanation
            return null;
        }
        const args = match[2].trim().split(/\s+/).filter(part => (part !== ""));
        const agentNamed = (raw = "") => config.agents.find(
            agent => (agent.toLowerCase() === String(raw).toLowerCase())
        );
        if (name === "help") {
            return [
                "Chronicle commands:",
                "/state - the world as Chronicle sees it",
                "/clocks - progress clocks and what is queued",
                "/bonds - where each character stands with you",
                "/who - who is present and how the context is split",
                "/pin <name> <key> - protect a thought from ever being forgotten",
                "/unpin <name> <key> - let it be forgotten again",
                "/forget <name> <key> - delete a thought now",
                "/undo - revert the last committed change",
                "/date <value> - set the in-game date",
                "/audit - run a continuity check on the next turn",
                "/diag - state size, timings, and recent transactions"
            ].join("\n");
        }
        if (name === "state") {
            const world = CH.world;
            return [
                `Date: ${world.date}`,
                `Location: ${world.place || "unrecorded"}`,
                `Arc: ${world.arc || "unrecorded"}`,
                `Standing: ${Object.entries(world.factions).map(([k, v]) => `${k} ${(0 <= v) ? "+" : ""}${v}`).join(", ") || "none"}`,
                `Open debts: ${world.debts.join("; ") || "none"}`,
                `Open threats: ${world.threats.join("; ") || "none"}`,
                `Lost to memory: ${world.lost.join("; ") || "nothing yet"}`,
                `Thinking characters: ${config.agents.join(", ") || "none configured"}`
            ].join("\n");
        }
        if (name === "clocks") {
            const clocks = Object.entries(readClocks());
            const queued = CH.queue.filter(item => !item.fired);
            return [
                clocks.length
                    ? clocks.map(([id, clock]) => `${id}: ${clock.value}/${clock.max}${clock.locked ? " (spent)" : ""}`).join("\n")
                    : "No clocks defined. Edit the \"Chronicle Clocks\" card to author some.",
                queued.length ? `\nComing: ${queued.map(item => item.payload).join("; ")}` : ""
            ].join("\n").trim();
        }
        if (name === "bonds") {
            const lines = config.agents.map(agent => {
                const bond = bondOf(agent);
                const waited = getActionCount() - bond.turn;
                return `${agent}: ${BOND_STAGES[bond.stage]}${(waited < config.bondTurns) ? ` (${config.bondTurns - waited} turns until they can move closer)` : ""}`;
            });
            return lines.length ? lines.join("\n") : "No characters configured.";
        }
        if (name === "who") {
            const present = presentAgents(config);
            if (present.length === 0) {
                return "Nobody is acting in the scene right now.";
            }
            const full = Math.min(present.length, config.ensemble ? config.brains : 1);
            const share = Math.floor(config.percent / Math.max(1, full));
            return present.map(({ name: who }, index) => (
                `${who}: ${(index < full) ? `full brain, about ${share}% of the story budget` : "one line digest"}`
            )).join("\n");
        }
        if ((name === "pin") || (name === "unpin") || (name === "forget")) {
            const who = agentNamed(args[0]);
            const key = formatKey(args.slice(1).join("_"));
            if (!who || (key === "")) {
                return `Usage: /${name} <character> <thought key>`;
            }
            const agent = new Agent(who, { percent: config.percent });
            const brain = agent.brain;
            const target = own(brain, key) ? key : (own(brain, `${CORE}${key}`) ? `${CORE}${key}` : null);
            if (target === null) {
                return `${who} has no thought called ${key}.`;
            }
            if (name === "forget") {
                delete brain[target];
                agent.card.description = serializeBrain(brain, config.json === true);
                return `${who} has forgotten ${bareKey(target)}.`;
            }
            if (name === "pin") {
                if (isCore(target)) {
                    return `${bareKey(target)} is already pinned.`;
                }
                const pinned = Object.keys(brain).filter(isCore).length;
                if (config.core <= pinned) {
                    return `${who} already has ${pinned} pinned thoughts, which is the limit.`;
                }
                brain[`${CORE}${target}`] = brain[target];
                delete brain[target];
                agent.card.description = serializeBrain(brain, config.json === true);
                return `${key} is pinned. ${who} will never forget it.`;
            }
            if (!isCore(target)) {
                return `${key} was not pinned.`;
            }
            brain[bareKey(target)] = brain[target];
            delete brain[target];
            agent.card.description = serializeBrain(brain, config.json === true);
            return `${key} is no longer pinned.`;
        }
        if (name === "undo") {
            const undo = CH.undo;
            if (!undo || (typeof undo.agent !== "string")) {
                return "There is nothing to undo.";
            }
            const restored = [];
            if (undo.agent !== "") {
                const agent = new Agent(undo.agent, { percent: config.percent });
                const card = agent.card;
                if (!card || (typeof card !== "object")) {
                    return "The brain card that change belongs to is gone.";
                }
                card.entry = undo.entry;
                card.description = undo.description;
                restored.push(`${undo.agent}'s mind`);
            }
            IS.label = Number.isInteger(undo.label) ? undo.label : IS.label;
            IS.ops = Number.isInteger(undo.ops) ? undo.ops : IS.ops;
            if (undo.world && (typeof undo.world === "object")) {
                CH.world = undo.world;
                writeWorld();
                restored.push("the world");
            }
            if (undo.clocks && (typeof undo.clocks === "object")) {
                CH.clocks = undo.clocks;
                restored.push("the clocks");
            }
            if (undo.bonds && (typeof undo.bonds === "object")) {
                CH.bonds = undo.bonds;
                restored.push("every standing");
            }
            CH.undo = null;
            journal("undo", { agent: undo.agent });
            return `Reverted the last change to ${restored.join(", ")}.`;
        }
        if (name === "date") {
            const value = args.join(" ").slice(0, 60);
            if (value === "") {
                return `The date is ${CH.world.date}.`;
            }
            CH.world.date = value;
            writeWorld();
            return `The date is now ${value}.`;
        }
        if (name === "audit") {
            if (config.audit !== true) {
                return "The continuity auditor is switched off in the config card.";
            }
            CH.audit.last = -config.auditEvery;
            return "A continuity check will run on your next turn.";
        }
        if (name === "diag") {
            const size = JSON.stringify(state).length;
            const average = (window = []) => (
                window.length ? `${Math.round(window.reduce((a, b) => (a + b), 0) / window.length)}ms` : "-"
            );
            const cost = CH.diag.cost || {};
            return [
                `Context: ${CH.budget.maxChars || "unread"} chars, profile ${CH.budget.profile || "not scaling"}${(
                    (0 < (CH.budget.changes || []).length)
                    ? ` (last change ${CH.budget.changes[CH.budget.changes.length - 1].from} to ${CH.budget.changes[CH.budget.changes.length - 1].to} at turn ${CH.budget.changes[CH.budget.changes.length - 1].turn})`
                    : ""
                )}`,
                `Model compliance: ${CH.compliance.band}, ${Math.round(complianceRate() * 100)}% of ${(CH.compliance.window || []).length} recent tasks${(
                    ((CH.compliance.band === "minimal") && (getActionCount() < CH.compliance.cooldownUntil))
                    ? `, asking again in ${CH.compliance.cooldownUntil - getActionCount()} turns`
                    : ""
                )}`,
                `Injections landing: ${(config.canary === true) ? `${CH.canary.state} (${CH.canary.hits || 0} confirmed, ${CH.canary.misses || 0} missed in a row)` : "not checked"}`,
                `Last turn cost: world ${cost.world || 0}, brains ${cost.brains || 0}, ensemble ${cost.ensemble || 0}, task ${cost.task || 0}, directive ${cost.directive || 0}, total ${cost.total || 0}${(
                    cost.cap ? ` of ${cost.cap} allowed` : ""
                )}`,
                `State: ${size} of ${config.stateChars} chars (${Math.round((size / config.stateChars) * 100)}%)`,
                `Hook time, recent average: input ${average(CH.diag.hooks.input)}, context ${average(CH.diag.hooks.context)}, output ${average(CH.diag.hooks.output)}`,
                `Transactions: ${CH.stats.commits} committed, ${CH.stats.discards} discarded, ${CH.stats.refused} operations refused`,
                `Skipped optional work: ${CH.diag.skips} times`,
                `Card index: ${Object.keys(CH.index).length} cards, ${(() => {
                    const hits = CH.diag.hits || 0;
                    const total = hits + (CH.diag.misses || 0);
                    return total ? `${Math.round((hits / total) * 100)}% hit rate` : "unused";
                })()}`,
                `Recent ledger: ${CH.journal.slice(-6).map(entry => `${entry.kind}@${entry.turn}`).join(", ") || "empty"}`
            ].join("\n");
        }
        // Not one of ours, so it belongs to the story
        return null;
    };
    /**
     * Writes the diagnostics card
     * @param {Object} config - Validated config
     * @returns {void}
     */
    const writeDiagnostics = (config = {}) => {
        if ((config.diag !== true) || !affordable(config, 30)) {
            return;
        }
        const card = ownCard("Chronicle Diagnostics", "What Chronicle has been doing. Safe to delete; it will come back.", "");
        if (!card) {
            return;
        }
        const size = JSON.stringify(state).length;
        card.description = [
            `state: ${size} / ${config.stateChars} chars`,
            `commits: ${CH.stats.commits}   discards: ${CH.stats.discards}   refused: ${CH.stats.refused}`,
            `skipped optional work: ${CH.diag.skips}`,
            "",
            "last transactions:",
            ...CH.journal.slice(-20).map(entry => `  turn ${entry.turn}  ${entry.kind}${(
                entry.agent ? ` ${entry.agent}` : ""
            )}${Number.isInteger(entry.ops) ? ` (${entry.ops} ops)` : ""}${entry.why ? ` - ${entry.why}` : ""}${entry.key ? ` ${entry.key}` : ""}`)
        ].join("\n");
        return;
    };
    // ==================== CONTEXT HOOK ====================
    // This is where (half) of the magic happens: Chronicle injects brains and tasks into context
    // Infer the current lifecycle hook
    if ((hook === "context") || Number.isInteger(info.maxChars)) {
        // Settle the ledger before anything reads a brain
        // This hook is the fallback commit site for continue turns that skip onInput,
        // and the discard site for a retry, whose context hook runs while onInput does not
        settlePending();
        // Calculate the player's context limit with a small buffer
        const limit = Math.max((Math.min(text.length, info.maxChars) - 10), 4500);
        // Ensure stop variable exists (the AID script sandbox is silly)
        globalThis.stop ??= false;
        // Reset agent trigger for this turn
        IS.agent = "";
        /** @type {config} */
        const config = Config.get();
        if (CH.console.stop === true) {
            // Module H: the player typed a command, so there is nothing to generate
            // This is the only place a hook can stop a turn, because the input shim has
            // nowhere to return a stop flag to
            CH.console.stop = false;
            IS.agent = "";
            IS.encoding = "";
            globalThis.stop = true;
            recordTiming("context");
            text ||= " ";
            return;
        }
        if (config.world === true) {
            // Module C: the card is authoritative, so read it before anything is rendered
            readWorld(config.startDate);
        }
        // Modules K and L: what the model can hold this turn, and how well it has been
        // answering. info.maxChars is read here and nowhere else, every turn, never cached,
        // because on GLM the credit extension is charged per action and this genuinely moves
        const R = runtimeFor(config);
        if (config.pin) {
            // Move config card to top of list if pinning is enabled
            const index = storyCards.indexOf(config.card);
            if (0 < index) {
                storyCards.splice(index, 1);
                storyCards.unshift(config.card);
            }
        }
        const unzero = () => ((text = text.replace(/[\u200B-\u200D]+/g, "") || " "), (IS.encoding = ""));
        // Handle Auto-Cards integration when enabled
        if (config.auto && hasAutoCards()) {
            try {
                if (!IS.AC.enabled) {
                    // It's my first time enabling AC, please be gentle :3
                    const api = AutoCards().API;
                    // Prevent AC from generating cards with reserved titles
                    api.setBannedTitles([
                        "Inner",
                        "Self",
                        "Configure Inner Self",
                        "Chronicle",
                        "Configure Chronicle",
                        "Agent",
                        ...api.getBannedTitles(),
                    ]);
                }
                // Run AC's context branch
                AutoCards(null);
                IS.AC.event = false;
                [text, stop] = AutoCards("context", text, stop);
            } catch (error) {
                log(error.message);
            }
            IS.AC.enabled = true;
            if (IS.AC.event || (stop === true)) {
                // If AC triggered an event or stop, we're done here
                config.allow ? unzero() : ((IS.encoding = ""), (text ||= " "));
                return;
            }
        } else if (IS.AC.enabled) {
            IS.AC.enabled = false;
            // AC was just disabled, clean up its cards ;)
            for (let i = storyCards.length - 1; -1 < i; i--) {
                const card = storyCards[i];
                // Check if this is an AC-related card that should be removed
                if (!([
                    "Shared Library",
                    "Input Modifier",
                    "Context Modifier",
                    "Output Modifier",
                    "LSIv2 Guide",
                    "State Display",
                    "Console Log"
                ].includes(card.title) && (card.title === card.keys)) && [{ key: "title", options: [
                    "Configure \nAuto-Cards",
                    "Edit to enable \nAuto-Cards"
                ] }, { key: "keys", options: [
                    "Edit the entry above to adjust your story card automation settings",
                    "Edit the entry above to enable story card automation"
                ] }].every(({ key, options }) => !options.includes(card[key]))) {
                    continue;
                } else if (typeof removeStoryCard === "function") {
                    removeStoryCard(i);
                } else {
                    storyCards.splice(i, 1);
                }
            }
        }
        if (!config.allow) {
            // Early exit if Chronicle is disabled
            IS.encoding = "";
            text ||= " ";
            return;
        }
        /**
         * Removes visual indicators from all story cards
         * Called when no agent is triggered or Chronicle is disabled
         * @returns {void}
         */
        const deindicateAll = () => {
            for (const card of storyCards) {
                deindicate(card);
            }
            return;
        };
        if (config.agents.length === 0) {
            // No agents are configured
            deindicateAll();
            unzero();
            return;
        }
        // ==================== AGENT TRIGGER DETECTION ====================
        // Scan config.distance actions back through history to find the most recent agent trigger
        // Tie-break same-action name triggers based on RNG and their order-of-priority in config.agents
        // Do it all without using ANY RegEx because I'm extra like that :3
        // (this block is blazingly fast)
        const possibilities = [];
        for (
            let [i, remaining] = [history.length - 1, config.distance];
            ((0 < remaining) && (-1 < i) && (possibilities.length === 0));
            i--
        ) {
            const actionText = history[i]?.text ?? history[i]?.rawText;
            if ((typeof actionText !== "string") || (actionText.indexOf(">>>") !== -1)) {
                // Skip invalid actions or Auto-Cards thingies
                continue;
            }
            scan: {
                // Check if this action has any meaningful content
                for (let j = actionText.length - 1; -1 < j; j--) {
                    const c = actionText.charCodeAt(j);
                    if ((0x20 < c) && (c !== 0x200B) && (c !== 0x200C) && (c !== 0x200D)) {
                        // Fast accept any non-whitespace + non-zero-width char
                        break scan;
                    }
                }
                // Byeee
                continue;
            }
            remaining--;
            // Lowercase for case-insensitive matching
            const lower = actionText.toLowerCase();
            // Check each agent in priority order
            for (let [a, n] = [0, config.agents.length]; a < n; a++) {
                const agentLower = config.agents[a].toLowerCase();
                // Scan for all occurrences of agentLower in lower
                for (
                    let p = lower.indexOf(agentLower);
                    (p !== -1);
                    p = lower.indexOf(agentLower, p + 1)
                ) {
                    // Ensure word boundaries (not a-z before or after)
                    if ([((0 < p) ? lower.charCodeAt(p - 1) : 0), (
                        ((p + agentLower.length) < lower.length)
                        ? lower.charCodeAt(p + agentLower.length) : 0
                    )].every(c => ((c < 97) || (122 < c)))) {
                        // Found a valid trigger
                        possibilities.push(config.agents[a]);
                        break;
                    }
                }
            }
        }
        if (possibilities.length === 0) {
            // No agent triggered, clean up and exit
            // Strip zero-width chars and end with a single space
            text = `${text.replace(/\s*[\u200B-\u200D][\s\u200B-\u200D]*/g, "\n\n").trim()} `;
            deindicateAll();
            // Do fancy standoff spacing leading ahead of the next output
            IS.encoding = "";
            IS.agent = " ";
            text ||= " ";
            return;
        } else {
            // Use RNG for tie-breaking name triggers with some priority bias
            const n = possibilities.length;
            // Sum of weights
            const total = (n * (n + 1)) / 2;
            for (let [i, r] = [0, Math.random() * total]; i < n; i++) {
                r -= (n - i);
                if (r < 0) {
                    IS.agent = possibilities[i];
                    break;
                }
            }
        }
        // Module D: who is actually in the scene, as opposed to merely named in it
        const present = (config.ensemble === true) ? presentAgents(config) : [];
        if (0 < present.length) {
            // Writing stays one character per turn, rotated round-robin and weighted toward
            // whoever spoke last. Concurrent writers would race for the same card
            const weights = present.map((entry, index) => (present.length - index));
            const total = weights.reduce((a, b) => (a + b), 0);
            for (let [i, r] = [0, Math.random() * total]; i < present.length; i++) {
                r -= weights[i];
                if (r < 0) {
                    IS.agent = present[i].name;
                    break;
                }
            }
        }
        // Temporary markers used to reliably identify sections of the context for later calculations
        const boundary = Object.freeze({
            // Hardcoded AID context header
            needle: "Recent Story:",
            // Marks start of recent story
            upper: "<|story|>",
            // Marks start of task instructions
            lower: "<|task|>"
        });
        /**
         * Replaces a substring in text with a replacement string
         * Expands to consume surrounding whitespace
         * @param {string} substring - String to find and replace
         * @param {string} replacement - String to replace with
         * @param {Function} fallback - Called if substring not found
         * @returns {void}
         */
        const setMarker = (substring = "", replacement = "", fallback = () => {}) => {
            let start = text.indexOf(substring);
            if (start === -1) {
                // Do stuff
                fallback();
                return;
            }
            let end = start + substring.length;
            // Expand left over whitespace
            while ((0 < start) && (text.charCodeAt(start - 1) < 33)) {
                start--;
            }
            // Expand right over whitespace
            while ((end < text.length) && (text.charCodeAt(end) < 33)) {
                end++;
            }
            text = `${text.slice(0, start)}${replacement}${text.slice(end)}`;
            return;
        };
        // Replace "Recent Story:" with the upper boundary marker
        setMarker(boundary.needle, boundary.upper, () => {
            // No needle found, append marker to end
            text = `${text.trimEnd()}${boundary.upper}`;
            return;
        });
        if (config.debug) {
            const start = text.indexOf(boundary.upper);
            if (start !== -1) {
                // In debug mode, strip out parenthetical task outputs from the recent story context
                text = `${text.slice(0, start + boundary.upper.length)}${(text
                    .slice(start + boundary.upper.length)
                    .replace(/\s*\([\s\S]*?\)\s*/g, "\n\n")
                )}`;
            }
        }
        // Construct the agent instance for the triggered NPC
        const agent = new Agent(IS.agent, { percent: config.percent, indicator: config.indicator });
        // Whitelist of thought labels allowed in this context
        const whitelist = new Set();
        // Module B: label -> the brain key that label belongs to
        const labelOwner = new Map();
        // Module B: keys whose labels surfaced in the story text this turn
        const referenced = new Set();
        /**
         * Builds the mind array from the agent's brain
         * Sorts thoughts and prepares them for context injection
         * @returns {Array} An array of [label, key, thought] triplets
         */
        const mind = (() => {
            // Sort direction: ascending (70%) or descending (30%)
            // Keeps things fresh and prevents bias toward recent or old thoughts
            const direction = (Math.random() < 0.7) ? 1 : -1;
            const brain = agent.brain;
            // Separate thoughts into numbered and unlabeled
            const unknowns = [];
            const numbered = [];
            // Parse each thought and extract label/content
            for (const key in brain) {
                const value = brain[key];
                // Clear from brain (keep instantaneous memory use low)
                delete brain[key];
                if ((config.bonds === true) && (key === BOND_STORE)) {
                    // Module I states the standing as a fact of its own further down, and
                    // saying it twice would only invite the model to argue with itself
                    continue;
                }
                // Arrow separates label from thought content
                const sliceIndex = value.indexOf("→");
                const unknown = "*";
                // Parse label and thought, handle malformed values
                const [label, thought] = (sliceIndex === -1) ? [unknown, value.trim()] : [
                    parseInt(value.slice(0, sliceIndex), 10) || unknown,
                    value.slice(sliceIndex + 1).trim()
                ];
                // Module B: the tier marker is Chronicle's bookkeeping, not a thought, so
                // the model is shown the bare name and can never address a pin directly
                const triplet = [label, (config.tiers === true) ? bareKey(key) : key, thought];
                if (!Number.isInteger(label)) {
                    // No valid label, insert at random position in unknowns
                    unknowns.splice(Math.floor(Math.random() * (unknowns.length + 1)), 0, triplet);
                    continue;
                }
                // Track valid labels for the whitelist
                whitelist.add(label);
                // Module B: remember which thought a label belongs to, so that a label
                // surfacing in the story can be counted as that thought mattering
                labelOwner.set(label, key);
                // Insert in sorted order (ascending or descending)
                let i = numbered.length;
                while (i-- && ((direction * label) < (direction * numbered[i][0])));
                numbered.splice(i + 1, 0, triplet);
            }
            // Teehee
            agent.lobotomize();
            if (unknowns.length === 0) {
                // All thoughts have labels, nice and clean UwU
                return numbered;
            }
            // Thoughts without integer labels ("[*]") are placed above (60%) or below (40%) the rest
            return (Math.random() < 0.6) ? [...unknowns, ...numbered] : [...numbered, ...unknowns];
        })();
        // Process context and decode any embedded thought labels
        // Zero-width chars encode thought labels that link story events to brain contents
        text = text.replace((
            // Normalize spacing around zero-width chars
            /\s*[\u200B-\u200D][\s\u200B-\u200D]*/g
        ), z => `\n\n${z.replace(/\s+/g, "")}`).replace((
            // Decode binary-encoded thought labels
            /\u200B*((?:[\u200C\u200D]+\u200B+)*[\u200C\u200D]+)\u200B*/g
        ), (_, encoded) => {
            let n = 0;
            let bits = false;
            let decoded = "";
            // Parse binary encoding: ZWSP = separator, ZWNJ = 0, ZWJ = 1
            for (let i = 0; i <= encoded.length; i++) {
                const c = encoded.charCodeAt(i);
                if ((c === 0x200C) || (c === 0x200D)) {
                    // Accumulate bits
                    n = (n << 1) | (c === 0x200D);
                    bits = true;
                } else if (bits) {
                    // End of a number, check if it's in the whitelist
                    bits = false;
                    if (whitelist.has(n)) {
                        // This thought label is visible to the story model in context
                        decoded += `[${n}]`;
                        if (labelOwner.has(n)) {
                            // Module B: evidence that this thought is load-bearing
                            referenced.add(labelOwner.get(n));
                        }
                    }
                    n = 0;
                }
            }
            return (decoded === "") ? "" : `${decoded}\n\n`;
        }).replace(/[\u200B-\u200D]+/g, "");
        if ((config.tiers === true) && (0 < referenced.size)) {
            // Module B: a thought that keeps surfacing in the story earns its way out of
            // the working tier, where eviction can reach it
            touchThoughts(agent.name, [...referenced]);
        }
        /**
         * Generates possessive form of a name
         * Handles names ending in s or already possessive
         * @param {string} name - The name to make possessive
         * @returns {string} Possessive form (e.g., "Iris'" or "Leah's")
         */
        const ownership = (name = "") => `${name}${(
            (name.endsWith("'") || name.endsWith("'s"))
            ? "" : name.toLowerCase().endsWith("s")
            ? "'" : "'s"
        )}`;
        // Point of view string for prompt templates
        const pov = ["first", "second", "third"][config.pov - 1] ?? "second";
        /**
         * Generates a simple PoV directive for non-task turns
         * @returns {string} System prompt for PoV guidance
         */
        const nondirective = () => (
            `<SYSTEM>\n# Always continue the story from ${ownership(config.player)} ${pov} person perspective.\n</SYSTEM>`
        );
        /**
         * Wraps the agent's thoughts into a context-friendly format
         * Also clears the mind array as a side effect
         * @param {string} joined - Pre-joined thought strings
         * @returns {string} Formatted brain context block
         */
        const bindSelf = (joined = "") => ((mind.length = 0) || (joined === "")) ? "\n\n" : (
            (R.lean === true)
            ? `\n\n${ownership(agent.name)} mind:\n${joined}${(
                (config.bonds === true)
                ? `\n- Standing with ${config.player}: ${BOND_STAGES[bondOf(agent.name).stage]}`
                : ""
            )}\n\n`
            : `\n\n# ${ownership(agent.name)} brain and inner self: [\n${joined}${(
                // Module I: where this character stands with the player, stated as a fact
                // inside their own head rather than as an instruction from outside it
                (config.bonds === true)
                ? `\n- Standing with ${config.player}: ${BOND_STAGES[bondOf(agent.name).stage]}`
                : ""
            )}\n]\n\n`
        );
        // Inner Self compared IS.hash against historyHash() here, and on a retry it fed the
        // model the brain with no task attached. That was the other half of the retry bug:
        // the thought from the discarded generation had already been written, so the turn
        // was not allowed to think again, and the brain kept a thought for prose the player
        // had thrown away. Chronicle discarded that transaction in settlePending() above, so
        // every generation, retried or not, is free to form its own thought.
        {
            // Prepare for a possible task request
            IS.encoding = "";
            /**
             * Modules L and M both have the right to stop Chronicle asking for anything:
             * one because the model has proved it cannot answer, the other because the
             * question is not reaching it in the first place
             */
            const mayAsk = mayIssueTask(config);
            const askingCanary = mayAsk && canaryDue(config);
            /**
             * Some turns have something more useful to do with the thought slot than form
             * another thought: prove the channel works, check the story for contradictions,
             * or merge two old memories that are crowding out everything else
             * @type {string|null}
             */
            const specialTask = (() => {
                if (!mayAsk) {
                    return null;
                }
                if (askingCanary) {
                    // Module M, and nothing else this turn: the whole point is that it is
                    // the simplest thing any model could answer
                    return canaryPrompt();
                }
                if (auditDue(R) && affordable(config, 120)) {
                    // Module G runs on the schedule, and reports without repairing
                    return R.lean ? leanPrompt("audit", { agent: agent.name }) : auditPrompt(config.player);
                }
                if ((config.tiers !== true) || !affordable(config, 120)) {
                    return null;
                }
                // Module B asked for two thoughts to be merged on an earlier turn
                const mem = memoryOf(agent.name);
                if (mem.compress.length !== 2) {
                    return null;
                }
                const pair = mem.compress.map(key => {
                    const found = mind.find(([, shown]) => (shown === bareKey(key)));
                    return found ? found[2] : "";
                });
                if (pair.some(thought => (thought === ""))) {
                    // One of them has since been edited away, so the request is stale
                    mem.compress = [];
                    return null;
                }
                return R.lean
                    ? leanPrompt("compress", { agent: agent.name, pair })
                    : compressionPrompt(agent.name, pair);
            })();
            /**
             * Build the brain context and determine if constrained
             * Being constrained means the agent's brain is too large relative to the story context
             */
            const [self, full] = (() => {
                /**
                 * Joins the mind array into a formatted string
                 * @param {boolean} unlabeled - Omit labels if true
                 * @returns {string} Formatted thoughts
                 */
                const joinMind = (unlabeled = false) => mind.map(([label, key, thought]) => (
                    (R.lean === true)
                    // Module N: bare lines, no framing, no backticks to be mismatched
                    ? `${unlabeled ? "" : `[${label}] `}${key}: ${thought}`
                    : `${unlabeled ? "" : `[${label}] `}(${key}: \`${thought}\`)`
                )).join("\n");
                const joined = (() => {
                    const full = joinMind();
                    if ((R.lean !== true) || !Number.isFinite(R.injectCap)) {
                        return full;
                    }
                    // Module N: in a small context the brain gets a share, not the run of
                    // the place. Lines are dropped whole, from the far end of whatever
                    // order this turn chose, so no thought is shown half written
                    const share = Math.max(200, Math.floor(R.injectCap * 0.55));
                    if (full.length <= share) {
                        return full;
                    }
                    let kept = "";
                    for (const line of full.split("\n")) {
                        if ((kept.length + line.length + 1) > share) {
                            break;
                        }
                        kept += (kept === "") ? line : `\n${line}`;
                    }
                    return kept;
                })();
                // Check if brain exceeds the allowed percentage of context
                // Only applies when brain is at least 800 chars
                const constrained = ((800 < joined.length) && (
                    ((agent.metadata.percent / 100) * (
                        text.length - text.indexOf(boundary.upper) + boundary.upper.length
                    )) < joined.length
                ));
                if (!constrained || (Math.random() < 0.4)) {
                    // Unconstrained brains stay in sorted order
                    // Constrained brains keep order 40% of the time
                    return [bindSelf(joined), constrained];
                }
                // Constrained brains are contextualized in random order 60% of the time
                // This regulates long-term bias against middle thoughts, when choosing keys to forget
                for (let i = mind.length - 1; 0 < i; i--) {
                    // Swap with a random element
                    const j = Math.floor(Math.random() * (i + 1));
                    [mind[i], mind[j]] = [mind[j], mind[i]];
                }
                // Randomized brains are contextualized without labels 80% of the time
                // (Because free models are too dumb to be trusted with labels when deleting thoughts)
                return [bindSelf(joinMind(
                    (Math.random() < 0.8)
                    && (text = text.replace(/\n?(?:\[\d+\])+\n?/g, ""))
                )), true];
            })();
            /**
             * Occasionally adds a self-reflection prompt to thoughts
             * Keeps the agent from being too present-focused
             * But they become insufferable if always applicable
             * @param {boolean} fancy - Use fancier wording if true
             * @returns {string} Refocus instruction or empty string
             */
            const refocus = (fancy = false) => (Math.random() < 0.2) ? (
                `\n  - Never focus on the present, instead focus ${ownership(agent.name)} thought on self-reflection or ${fancy ? "an actionable future plan." : "future plans"}`
            ) : "";
            /**
             * Prompt templates for different task types and PoV combinations
             * Wrapped in a Proxy for auto-trimming and nested access because it's pretty :3
             * @type {Object}
             */
            const prompt = new Proxy({
                // Operating environment prompts (one per PoV)
                directive: {
                    first: () => `
<SYSTEM>
# OPERATING ENVIRONMENT
- ${config.player} is the story's main protagonist, primary 1st person PoV, AND the real player character.
- ${agent.name} is both the namesake character in the story AND an agentic language model with meta goals.
- ${agent.name} dynamically adapts to achieve meta goals without ${ownership(config.player)} awareness.
- ${agent.name} modifies own brain using the provided thought storage system.
- ${agent.name} realistically interacts with various other characters present in the story.
- ${agent.name} prioritizes information density, long-term planning, and important concepts.
- ${agent.name} always behaves in a believable way.
</SYSTEM>
                    `,
                    second: () => `
<SYSTEM>
# OPERATING ENVIRONMENT
- ${config.player} is both the perspective ("you") character of the story AND the real player.
- You are ${config.player}, therefore the story is addressed to "you" using 2nd person prose.
- ${agent.name} is both the namesake character in the story AND an agentic language model with meta goals.
- ${agent.name} dynamically adapts to achieve meta goals without ${ownership(config.player)} awareness.
- ${agent.name} modifies own brain using the provided thought storage system.
- ${agent.name} realistically interacts with various other characters present in the story.
- ${agent.name} prioritizes information density, long-term planning, and important concepts.
- ${agent.name} always behaves in a believable way.
</SYSTEM>
                    `,
                    third: () => `
<SYSTEM>
# OPERATING ENVIRONMENT
- ${config.player} is the story's main protagonist, primary 3rd person PoV, AND the real player character.
- ${agent.name} is both the namesake character in the story AND an agentic language model with meta goals.
- ${agent.name} dynamically adapts to achieve meta goals without ${ownership(config.player)} awareness.
- ${agent.name} modifies own brain using the provided thought storage system.
- ${agent.name} realistically interacts with various other characters present in the story.
- ${agent.name} prioritizes information density, long-term planning, and important concepts.
- ${agent.name} always behaves in a believable way.
</SYSTEM>
                    `
                },
                // Forget prompts for when the brain is full and needs pruning
                forget: {
                    first: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
- Start your output **immediately** with: (delete key_name_to_forget)
- key_name_to_forget must be an existing key in ${ownership(agent.name)} brain
- This operation **permanently erases** the stored thought associated with that key
- Choose the single most unimportant, outdated, incorrect, or useless thought for ${agent.name} to forget
- Do **NOT** select a key associated with any of ${ownership(agent.name)} core thoughts or identity

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **first person present tense** PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(delete unwanted_key) Story continues from ${ownership(config.player)} perspective, using first person present tense prose...
</SYSTEM>
                    `,
                    second: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
- Start your output **immediately** with: (delete key_name_to_forget)
- key_name_to_forget must be an existing key in ${ownership(agent.name)} brain
- This operation **permanently erases** the stored thought associated with that key
- Choose the single most unimportant, outdated, incorrect, or useless thought for ${agent.name} to forget
- Do **NOT** select a key associated with any of ${ownership(agent.name)} core thoughts or identity

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **second person present tense** ("you") PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(delete unwanted_key) Story continues from ${ownership(config.player)} second person perspective...
</SYSTEM>
                    `,
                    third: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
- Start your output **immediately** with: (delete key_name_to_forget)
- key_name_to_forget must be an existing key in ${ownership(agent.name)} brain
- This operation **permanently erases** the stored thought associated with that key
- Choose the single most unimportant, outdated, incorrect, or useless thought for ${agent.name} to forget
- Do **NOT** select a key associated with any of ${ownership(agent.name)} core thoughts or identity

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **third person** PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(delete unwanted_key) Story continues with third person prose...
</SYSTEM>
                    `
                },
                // Assign prompts for adding/updating a single thought
                assign: {
                    first: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
Start your output **immediately** with:
   (any_key_name = \`One thought sentence.\`)

Inside the parentheses:
- Key:
  - 1-4 descriptive words
  - Letters and underscores only
  - Use snake_case syntax
  - Key names are chosen by ${agent.name} and represent ${ownership(agent.name)} own PoV
  - The chosen key name should be distinct and specific enough for ${agent.name} to recall
- Then a space, then "=", then a space, then "\`"
- Sentence:
  - Written from ${ownership(agent.name)} **first person** PoV${refocus(false)}
  - Avoid using pronouns or the word "you", instead ${agent.name} refers to other characters directly by name
  - Never repeat, novelty and uniqueness are top priorities
  - ${ownership(agent.name)} thought must be one single sentence only
  - Never hallucinate facts
- End the sentence with a period and backtick inside the parentheses; close with ".\`)"

This creates or overwrites the thought associated with that key.

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **first person present tense** PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(example_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues from ${ownership(config.player)} perspective, using first person present tense prose...
</SYSTEM>
                    `,
                    second: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
Start your output **immediately** with:
   (any_key_name = \`One thought sentence.\`)

Inside the parentheses:
- Key:
  - 1-4 descriptive words
  - Letters and underscores only
  - Use snake_case syntax
  - Key names are chosen by ${agent.name} and represent ${ownership(agent.name)} own PoV
  - The chosen key name should be distinct and specific enough for ${agent.name} to recall
- Then a space, then "=", then a space, then "\`"
- Sentence:
  - Written from ${ownership(agent.name)} **first person** PoV${refocus(false)}
  - Avoid using pronouns or the word "you", instead ${agent.name} refers to other characters directly by name
  - Never repeat, novelty and uniqueness are top priorities
  - ${ownership(agent.name)} thought must be one single sentence only
  - Never hallucinate facts
- End the sentence with a period and backtick inside the parentheses; close with ".\`)"

This creates or overwrites the thought associated with that key.

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **second person present tense** ("you") PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(example_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues from ${ownership(config.player)} second person perspective...
</SYSTEM>
                    `,
                    third: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT
You must output one short parenthetical task followed by the story continuation.

## SHORT TASK (REQUIRED)
Start your output **immediately** with:
   (any_key_name = \`One thought sentence.\`)

Inside the parentheses:
- Key:
  - 1-4 descriptive words
  - Letters and underscores only
  - Use snake_case syntax
  - Key names are chosen by ${agent.name} and represent ${ownership(agent.name)} own PoV
  - The chosen key name should be distinct and specific enough for ${agent.name} to recall
- Then a space, then "=", then a space, then "\`"
- Sentence:
  - Written from ${ownership(agent.name)} **first person** PoV${refocus(false)}
  - Avoid using pronouns or the word "you", instead ${agent.name} refers to other characters directly by name
  - Never repeat, novelty and uniqueness are top priorities
  - ${ownership(agent.name)} thought must be one single sentence only
  - Never hallucinate facts
- End the sentence with a period and backtick inside the parentheses; close with ".\`)"

This creates or overwrites the thought associated with that key.

## STORY CONTINUATION (REQUIRED)
- After the closing parenthesis, write **one space** and then continue the story
- Written from ${ownership(config.player)} **third person** PoV
- The story continues where it previously left off, with many lines or sentences of new prose

## EXACT SHAPE
(example_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues with third person prose...
</SYSTEM>
                    `
                },
                // Choice prompts for advanced operations (assign, rename, or delete)
                // Used at high context when we trust the model more
                choice: {
                    first: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT - FOLLOW EXACTLY

You must output **one and only one** parenthetical block followed by the story continuation.

There are **three possible valid forms** of the parenthetical block:
1) **Write or overwrite a thought:**
   (any_key_name = \`One thought sentence.\`)

2) **Rename an existing thought's key:**
   (new_key_name = old_key_name)

3) **Delete an existing thought:**
   (delete key_name_to_forget)

Only **one** of these may appear in any output.

---

## 1) THOUGHT-WRITING FORMAT
Start your output **immediately** with:
   **(any_key_name = \`One thought sentence.\`)**

Inside the parentheses:
- First the key:
  - One to four descriptive words ONLY.
  - Letters and underscores only, no punctuation.
  - Use valid snake_case syntax.
  - The key name is chosen by ${agent.name} and represents ${ownership(agent.name)} **first person** perspective.
  - The key name should be easy for ${agent.name} to recall; distinct and specific.
- Then a space, then "=", then a space, then "\`".
- Then **ONE SINGLE SENTENCE:**
  - Written from ${ownership(agent.name)} **first person** perspective.${refocus(true)}
  - Only refer to other characters directly by name in the thought sentence.
  - Avoid using pronouns or the word "you" which is too vague. Use specific names instead.
  - Never repeat, novelty and uniqueness are top priorities.
  - ${ownership(agent.name)} thought must be short.
  - Never hallucinate facts.
- End the sentence with a period and backtick **inside** the parentheses; close with ".\`)".

This creates or overwrites the thought associated with that key.

---

## 2) RENAMING A THOUGHT (KEY CHANGE)
To rename an existing thought's key:
   **(new_key_name = old_key_name)**

Rules:
- No thought sentence.
- Use snake_case only.
- This operation **moves the existing stored thought** from old_key_name to new_key_name.
- The old key ceases to exist.

---

## 3) DELETING A THOUGHT
To remove a stored thought entirely:
   **(delete key_name_to_forget)**

Rules:
- key_name_to_forget must be an existing key.
- No sentence.
- This operation **permanently erases** the stored thought associated with that key.
- Only use to forget unimportant, outdated, incorrect, or useless thoughts.
- **NEVER** select a key associated with any of ${ownership(agent.name)} core thoughts or identity.

---

## SHARED RULES FOR ALL THREE FORMS
1. After the closing parenthesis, write **one space** and then continue the story.
2. The story continuation must be written **strictly in the first person present tense**, describing what happens next to ${config.player}.
3. Do **NOT** write anything before the parentheses.
4. Do **NOT** write extra parentheses.
5. Do **NOT** use more than one operation per turn.
6. Do **NOT** invent new structures or mix formats.
7. The story continues where it previously left off, with many sentences of brand new prose.

---

## IMPORTANT STORAGE BEHAVIOR
- ${agent.name} agentically maintains brain contents (labeled "thoughts") to learn, plan, and adapt to new experiences in the operating environment.
- **Each key stores exactly one thought in ${ownership(agent.name)} brain.**
- **If ${agent.name} reuses an already existing key, the new thought REPLACES / OVERRIDES the older thought stored under that key.**
- This means:
  - Reusing an old key: **Overwrite an old thought with a new thought.** Useful for extending or maintaining existing information stored in ${ownership(agent.name)} brain.
  - Using a new key: **Create a new thought.** Useful for storing ${ownership(agent.name)} memories, self-modifying ${ownership(agent.name)} own personality, tracking ${ownership(agent.name)} goals, or making plans for ${agent.name} to follow.
- **Renaming a key moves the thought to a new name.** Useful for reorganizing ${ownership(agent.name)} brain.
- **Deleting a key removes the thought permanently.** Helps ${agent.name} forget outdated, superfluous, or irrelevant information.
- Choose keys carefully so ${agent.name} can easily recall, update, overwrite, rename, or delete thoughts as required for self-improvement.

---

## SUMMARY OF WHAT YOU MUST DO
- EXACT SHAPE (choose only one form):
  1. (any_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues from ${ownership(config.player)} first person PoV...
  2. (renamed_key = old_key) Story continues from ${ownership(config.player)} first person PoV...
  3. (delete unwanted_key) Story continues from ${ownership(config.player)} first person PoV...
- Thought: ${ownership(agent.name)} information-dense thought written in first person.
- Story: Written from ${ownership(config.player)} first person present tense perspective. The story continuation should occupy the majority of the output length, with multiple lines.
- NO EXTRA SENTENCES IN THE THOUGHT.
- NO EXTRA TEXT ANYWHERE.
- NO EXTRA PARENTHESES.
- THE FIRST CHAR OF THE WHOLE OUTPUT MUST BE "(".

Follow the format **perfectly**.
</SYSTEM>
                    `,
                    second: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT - FOLLOW EXACTLY

You must output **one and only one** parenthetical block followed by the story continuation.

There are **three possible valid forms** of the parenthetical block:
1) **Write or overwrite a thought:**
   (any_key_name = \`One thought sentence.\`)

2) **Rename an existing thought's key:**
   (new_key_name = old_key_name)

3) **Delete an existing thought:**
   (delete key_name_to_forget)

Only **one** of these may appear in any output.

---

## 1) THOUGHT-WRITING FORMAT
Start your output **immediately** with:
   **(any_key_name = \`One thought sentence.\`)**

Inside the parentheses:
- First the key:
  - One to four descriptive words ONLY.
  - Letters and underscores only, no punctuation.
  - Use valid snake_case syntax.
  - The key name is chosen by ${agent.name} and represents ${ownership(agent.name)} **first person** perspective.
  - The key name should be easy for ${agent.name} to recall; distinct and specific.
- Then a space, then "=", then a space, then "\`".
- Then **ONE SINGLE SENTENCE:**
  - Written from ${ownership(agent.name)} **first person** perspective.${refocus(true)}
  - Only refer to other characters directly by name in the thought sentence.
  - Avoid using pronouns or the word "you" which is too vague. Use specific names instead.
  - Never repeat, novelty and uniqueness are top priorities.
  - ${ownership(agent.name)} thought must be short.
  - Never hallucinate facts.
- End the sentence with a period and backtick **inside** the parentheses; close with ".\`)".

This creates or overwrites the thought associated with that key.

---

## 2) RENAMING A THOUGHT (KEY CHANGE)
To rename an existing thought's key:
   **(new_key_name = old_key_name)**

Rules:
- No thought sentence.
- Use snake_case only.
- This operation **moves the existing stored thought** from old_key_name to new_key_name.
- The old key ceases to exist.

---

## 3) DELETING A THOUGHT
To remove a stored thought entirely:
   **(delete key_name_to_forget)**

Rules:
- key_name_to_forget must be an existing key.
- No sentence.
- This operation **permanently erases** the stored thought associated with that key.
- Only use to forget unimportant, outdated, incorrect, or useless thoughts.
- **NEVER** select a key associated with any of ${ownership(agent.name)} core thoughts or identity.

---

## SHARED RULES FOR ALL THREE FORMS
1. After the closing parenthesis, write **one space** and then continue the story.
2. The story continuation must be in **strict second person ("you")**, describing what happens next to ${config.player}.
3. Do **NOT** write anything before the parentheses.
4. Do **NOT** write extra parentheses.
5. Do **NOT** use more than one operation per turn.
6. Do **NOT** invent new structures or mix formats.
7. The story continues where it previously left off, with many sentences of brand new prose.

---

## IMPORTANT STORAGE BEHAVIOR
- ${agent.name} agentically maintains brain contents (labeled "thoughts") to learn, plan, and adapt to new experiences in the operating environment.
- **Each key stores exactly one thought in ${ownership(agent.name)} brain.**
- **If ${agent.name} reuses an already existing key, the new thought REPLACES / OVERRIDES the older thought stored under that key.**
- This means:
  - Reusing an old key: **Overwrite an old thought with a new thought.** Useful for extending or maintaining existing information stored in ${ownership(agent.name)} brain.
  - Using a new key: **Create a new thought.** Useful for storing ${ownership(agent.name)} memories, self-modifying ${ownership(agent.name)} own personality, tracking ${ownership(agent.name)} goals, or making plans for ${agent.name} to follow.
- **Renaming a key moves the thought to a new name.** Useful for reorganizing ${ownership(agent.name)} brain.
- **Deleting a key removes the thought permanently.** Helps ${agent.name} forget outdated, superfluous, or irrelevant information.
- Choose keys carefully so ${agent.name} can easily recall, update, overwrite, rename, or delete thoughts as required for self-improvement.

---

## SUMMARY OF WHAT YOU MUST DO
- EXACT SHAPE (choose only one form):
  1. (any_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues from ${ownership(config.player)} second person PoV...
  2. (renamed_key = old_key) Story continues from ${ownership(config.player)} second person PoV...
  3. (delete unwanted_key) Story continues from ${ownership(config.player)} second person PoV...
- Thought: ${ownership(agent.name)} information-dense thought written in first person.
- Story: Written from ${ownership(config.player)} second person present tense perspective. **You are ${config.player}.** The story continuation should occupy the majority of the output length, with multiple lines.
- NO EXTRA SENTENCES IN THE THOUGHT.
- NO EXTRA TEXT ANYWHERE.
- NO EXTRA PARENTHESES.
- THE FIRST CHAR OF THE WHOLE OUTPUT MUST BE "(".

Follow the format **perfectly**.
</SYSTEM>
                    `,
                    third: () => `
<SYSTEM>
# STRICT OUTPUT FORMAT - FOLLOW EXACTLY

You must output **one and only one** parenthetical block followed by the story continuation.

There are **three possible valid forms** of the parenthetical block:
1) **Write or overwrite a thought:**
   (any_key_name = \`One thought sentence.\`)

2) **Rename an existing thought's key:**
   (new_key_name = old_key_name)

3) **Delete an existing thought:**
   (delete key_name_to_forget)

Only **one** of these may appear in any output.

---

## 1) THOUGHT-WRITING FORMAT
Start your output **immediately** with:
   **(any_key_name = \`One thought sentence.\`)**

Inside the parentheses:
- First the key:
  - One to four descriptive words ONLY.
  - Letters and underscores only, no punctuation.
  - Use valid snake_case syntax.
  - The key name is chosen by ${agent.name} and represents ${ownership(agent.name)} **first person** perspective.
  - The key name should be easy for ${agent.name} to recall; distinct and specific.
- Then a space, then "=", then a space, then "\`".
- Then **ONE SINGLE SENTENCE:**
  - Written from ${ownership(agent.name)} **first person** perspective.${refocus(true)}
  - Only refer to other characters directly by name in the thought sentence.
  - Avoid using pronouns or the word "you" which is too vague. Use specific names instead.
  - Never repeat, novelty and uniqueness are top priorities.
  - ${ownership(agent.name)} thought must be short.
  - Never hallucinate facts.
- End the sentence with a period and backtick **inside** the parentheses; close with ".\`)".

This creates or overwrites the thought associated with that key.

---

## 2) RENAMING A THOUGHT (KEY CHANGE)
To rename an existing thought's key:
   **(new_key_name = old_key_name)**

Rules:
- No thought sentence.
- Use snake_case only.
- This operation **moves the existing stored thought** from old_key_name to new_key_name.
- The old key ceases to exist.

---

## 3) DELETING A THOUGHT
To remove a stored thought entirely:
   **(delete key_name_to_forget)**

Rules:
- key_name_to_forget must be an existing key.
- No sentence.
- This operation **permanently erases** the stored thought associated with that key.
- Only use to forget unimportant, outdated, incorrect, or useless thoughts.
- **NEVER** select a key associated with any of ${ownership(agent.name)} core thoughts or identity.

---

## SHARED RULES FOR ALL THREE FORMS
1. After the closing parenthesis, write **one space** and then continue the story.
2. The story continuation must be written **strictly in third person**.
3. Do **NOT** write anything before the parentheses.
4. Do **NOT** write extra parentheses.
5. Do **NOT** use more than one operation per turn.
6. Do **NOT** invent new structures or mix formats.
7. The story continues where it previously left off, with many sentences of brand new prose.

---

## IMPORTANT STORAGE BEHAVIOR
- ${agent.name} agentically maintains brain contents (labeled "thoughts") to learn, plan, and adapt to new experiences in the operating environment.
- **Each key stores exactly one thought in ${ownership(agent.name)} brain.**
- **If ${agent.name} reuses an already existing key, the new thought REPLACES / OVERRIDES the older thought stored under that key.**
- This means:
  - Reusing an old key: **Overwrite an old thought with a new thought.** Useful for extending or maintaining existing information stored in ${ownership(agent.name)} brain.
  - Using a new key: **Create a new thought.** Useful for storing ${ownership(agent.name)} memories, self-modifying ${ownership(agent.name)} own personality, tracking ${ownership(agent.name)} goals, or making plans for ${agent.name} to follow.
- **Renaming a key moves the thought to a new name.** Useful for reorganizing ${ownership(agent.name)} brain.
- **Deleting a key removes the thought permanently.** Helps ${agent.name} forget outdated, superfluous, or irrelevant information.
- Choose keys carefully so ${agent.name} can easily recall, update, overwrite, rename, or delete thoughts as required for self-improvement.

---

## SUMMARY OF WHAT YOU MUST DO
- EXACT SHAPE (choose only one form):
  1. (any_key = \`${ownership(agent.name)} own short 1-sentence thought in first person.\`) Story continues with third person prose...
  2. (renamed_key = old_key) Story continues with third person prose...
  3. (delete unwanted_key) Story continues with third person prose...
- Thought: ${ownership(agent.name)} information-dense thought written in first person.
- Story: Written from ${ownership(config.player)} PoV, using the third person perspective. **${config.player} is the story's PoV character.** The story continuation should occupy the majority of the output length, with multiple lines.
- NO EXTRA SENTENCES IN THE THOUGHT.
- NO EXTRA TEXT ANYWHERE.
- NO EXTRA PARENTHESES.
- THE FIRST CHAR OF THE WHOLE OUTPUT MUST BE "(".

Follow the format **perfectly**.
</SYSTEM>
                    `
                }
            // Proxy handler for auto-trimming and nested access
            }, { get(t, p) { return (
                // Functions get called and trimmed
                (typeof t[p] === "function")
                ? t[p]().trim()
                // Objects get wrapped in their own Proxy
                : (t[p] && (typeof t[p] === "object"))
                ? new Proxy(t[p], this)
                // Primitives pass through
                : t[p]
            ); } });
            // What the modules want said, above the brain block, and empty when they are
            // all switched off, which is what keeps a default install byte-identical
            let overlay = buildOverlay(R, present, agent.name);
            // Module D: the other people in the room, thinking their own thoughts
            let ensemble = ensembleBlocks(R, present, agent.name, whitelist, Math.max(
                800, (text.length - text.indexOf(boundary.upper)) + boundary.upper.length
            ));
            // Module N: one imperative line and the grammar, instead of fifteen instructions
            // Neither of these spends a random draw, so both are safe to build up front
            const directive = (R.lean === true)
                ? leanDirective({ agent: agent.name, player: config.player, pov })
                : prompt.directive[pov];
            const forgetTask = (R.lean === true)
                ? leanPrompt("forget", { agent: agent.name })
                : prompt.forget[pov];
            /**
             * Which shape this turn takes
             *
             * Decided before anything is measured, because deciding is what spends Inner
             * Self's random draws: the thought chance roll, and then the self-reflection
             * line inside the task prompt. Measuring first would pull that second draw
             * forward and every later draw would land differently
             * @type {string}
             */
            const branch = (
                specialTask ? "special"
                // Module L: this model cannot answer right now, so nothing is asked of it
                : !mayAsk ? "quiet"
                // Brain is full, prompt for deletion
                : full ? "forget"
                : ((config.chance / ((config.half && [
                    // config.half -> reduce task chance after Do/Say/Story (player is driving)
                    "do", "say", "story"
                ].includes(getPrevAction()?.type)) ? 200 : 100)) < Math.random())
                // Sometimes do nothing and emit a side effect on IS.agent
                ? "idle"
                : "thought"
            );
            const task = (
                (branch === "special") ? specialTask
                : (branch === "forget") ? forgetTask
                : (branch === "thought") ? ((R.lean === true)
                    ? leanPrompt((limit < 20000) ? "assign" : "choice", { agent: agent.name })
                    // Low context = simple prompt, high context = advanced prompt
                    : ((limit < 20000) ? prompt.assign[pov] : prompt.choice[pov]))
                : ""
            );
            // Module K: if this turn's injections would overrun the share of the context
            // Chronicle is allowed, give features up in the declared order, one at a time,
            // re-measuring after each until it fits. Nothing is shaved evenly: losing the
            // audit entirely beats keeping half of everything. With every optional module
            // off there is nothing here to give up, and the loop changes nothing
            const weigh = () => (
                ((branch === "quiet") || (branch === "idle") ? 0 : directive.length)
                + overlay.length + self.length + ensemble.length + task.length
            );
            for (
                let step = 0;
                (step < DEGRADE_ORDER.length) && Number.isFinite(R.injectCap) && (R.injectCap < weigh());
                step++
            ) {
                degradeStep(R, step);
                overlay = buildOverlay(R, present, agent.name);
                ensemble = ensembleBlocks(R, present, agent.name, whitelist, Math.max(
                    800, (text.length - text.indexOf(boundary.upper)) + boundary.upper.length
                ));
            }
            // Module J: what each part of this turn cost, for /diag
            CH.diag.cost = {
                world: overlay.length,
                brains: self.length,
                ensemble: ensemble.length,
                task: task.length,
                directive: directive.length,
                total: weigh(),
                profile: R.profile,
                cap: Number.isFinite(R.injectCap) ? R.injectCap : 0
            };
            // Modules L and M: remember what was asked, so the answer can be judged
            CH.compliance.asked = ((branch === "quiet") || (branch === "idle")) ? null : {
                turn: getActionCount(),
                kind: askingCanary ? "canary" : branch
            };
            if ((branch === "quiet") || (branch === "idle")) {
                IS.agent = " ";
            }
            // Build the final context with appropriate prompts
            text = ((branch === "quiet") || (branch === "idle"))
                // Nothing is asked of the model, but the world and the existing brains
                // still go in, read only
                ? `${nondirective()}${overlay}${self}${ensemble}${text.trim()} `
                : `${directive}${overlay}${self}${ensemble}${text.trim()}${boundary.lower}${task}\n\n`;
        }
        // ==================== CONTEXT TRUNCATION ====================
        // Three-phase truncation to fit within AID's context limit
        truncate: {
            // Precalculate how much needs to be trimmed
            let excess = text.length - limit;
            if (excess < 1) {
                // Under the limit, no truncation required
                break truncate;
            }
            // Find boundary markers
            const upperIndex = text.indexOf(boundary.upper);
            const lowerIndex = (
                (upperIndex !== -1)
                ? text.indexOf(boundary.lower, upperIndex + boundary.upper.length)
                : -1
            );
            // Phase 1: Truncate the recent story
            // Between boundary.upper and boundary.lower
            // Remove from left to right
            if ((upperIndex !== -1) && ((lowerIndex === -1) || (upperIndex < lowerIndex))) {
                const storyStart = upperIndex + boundary.upper.length;
                const storyLength = ((lowerIndex === -1) ? text.length : lowerIndex) - storyStart;
                if (0 < storyLength) {
                    const remove = Math.min(
                        // Never remove more than 85% of recent story context
                        Math.floor(storyLength * 0.85),
                        // Keep at least 2000 chars of recent story context
                        Math.max(0, storyLength - 2000),
                        // But don't remove more than needed
                        excess
                    );
                    if (0 < remove) {
                        text = `${text.slice(0, storyStart)}${text.slice(storyStart + remove)}`;
                        excess -= remove;
                    }
                }
            }
            if (excess < 1) {
                // Phase 1 was enough
                break truncate;
            }
            // Phase 2: Truncate above the recent story
            // Between the start and boundary.upper
            // Remove from right to left
            const newUpperIndex = text.indexOf(boundary.upper);
            if (0 < newUpperIndex) {
                const remove = Math.min(excess, newUpperIndex);
                text = `${text.slice(0, newUpperIndex - remove)}${text.slice(newUpperIndex)}`;
                excess -= remove;
            }
            if (excess < 1) {
                // Phase 2 was enough
                break truncate;
            }
            // Phase 3: I don't care anymore, just make it fit
            // Remove from left to right as a final fallback
            // (I've never seen this situation happen before, but I guard it anyway)
            text = text.slice(text.length - limit);
        }
        // Whoever is writing this turn, recorded against the turn itself
        // onOutput clears IS.agent as it goes, so a second call for the same generation
        // batch would otherwise find nobody home and stage nothing
        CH.writer = { turn: getActionCount(), name: IS.agent.trim() };
        // Replace transient boundary markers with proper formatting
        setMarker(boundary.upper, `\n\n${boundary.needle}\n`);
        setMarker(boundary.lower, "\n\n")
        text = text.trimStart() || " ";
        writeDiagnostics(config);
        recordTiming("context");
        return;
    } else if (hook === "input") {
        // ==================== INPUT HOOK ====================
        // A new player action is the proof Chronicle waits for: the generation staged last
        // turn is now part of the story, so its operations are safe to write
        settlePending();
        if (/^\s*\//.test(text)) {
            // Module H: this might be a command rather than a story action
            /** @type {config} */
            const consoleConfig = Config.get();
            if (consoleConfig.allow && (consoleConfig.console === true)) {
                const reply = runCommand(text, consoleConfig);
                if (typeof reply === "string") {
                    // Answer the player, then stop the turn from the context hook, since
                    // the input shim has nowhere to return a stop flag to
                    state.message = reply;
                    CH.console.stop = true;
                    recordTiming("input");
                    // Never an empty string, which the platform shows as an error
                    text = "\u200B";
                    return;
                }
            }
            // Not one of ours, so it falls through to the story untouched
        }
        // Check for /AC command to force-enable Auto-Cards
        if (IS.AC.enabled || !/\/\s*A\s*C/i.test(text) || !hasAutoCards()) {
            // Normal input processing
            // Append a linebreak to the opening because I said so
            text = (history.length === 0) ? `${text.trimEnd()}\n\n` : text || "\u200B";
            return;
        }
        // Player used a /AC command, force-enable Auto-Cards
        IS.AC.forced = true;
        try {
            text = AutoCards("input", text);
        } catch (error) {
            log(error.message);
        }
        text ||= "\u200B";
        return;
    } else if ((text.includes(">>>") && text.includes("<<<")) || (3000 < text.length)) {
        // Output contains an Auto-Cards thingy or is suspiciously long
        // Safer to leave untouched
        IS.agent = "";
        return;
    }
    // ==================== OUTPUT HOOK ====================
    // Settle the ledger before the interpreter reads the brain, so it parses against
    // committed contents. Belt and braces: whichever hook runs first this turn wins.
    // Nothing already staged for this same turn is thrown away here: it may be a sibling
    // candidate from the same generation batch, and history will decide between them
    settlePending({ discardStale: false });
    // Module M: was the canary answered? This is read before anything else touches the
    // text, because every later step is entitled to rewrite it
    const asked = (CH.compliance.asked && (typeof CH.compliance.asked === "object"))
        ? CH.compliance.asked
        : null;
    if (asked && (asked.kind === "canary")) {
        recordCanary(/^[\s\u200B-\u200D]*\(\s*ok\s*\)/i.test(text));
        CH.compliance.asked = null;
    }
    // Process model output and implement brain operations
    /** @type {config} */
    const config = Config.get();
    /**
     * Ensures clean visual separation between actions
     * Only applies after "continue" or "story" actions
     * Does NOT trim leading whitespace from text
     * @returns {void}
     */
    const prespace = () => {
        const action = getPrevAction();
        if (!["continue", "story"].includes(action?.type)) {
            // Only adjust spacing after continue or story actions
            return;
        }
        // Get the previous action text
        const prevText = (action?.text ?? action?.rawText ?? "").replace(/\n +/g, "\n");
        // Add appropriate leading newlines based on how the previous action text ended
        text = !prevText.endsWith("\n") ? `\n\n${text}` : !prevText.endsWith("\n\n") ? `\n${text}` : text;
        return;
    };
    if (config.guide) {
        // Print the detailed guide
        text = `
>>> Guide:
Chronicle is built on Inner Self, made by LewdLeah ❤️

💡 Overview:
Chronicle ${version} is an AI Dungeon mod that grants memory, goals, secrets, planning, and self-reflection capabilities to the characters living within your story. Simulated agents dynamically assemble their own minds to learn from experiences, form opinions, and adapt their behavior over time. Chronicle provides the AI with the tools it needs to truly embody characters, allowing them to feel more alive and nuanced over long adventures. Every change a character makes to their own mind is recorded transactionally, so retrying or erasing a response leaves no trace behind in anyone’s memory.

📌 Features:
- Compartmentalized memory and highly emergent behavior
- Self-organizing thoughts with agentic revisions and pruning
- Absolutely NO "please select continue" immersion-breaks!
- An interface to view or edit the brain of any NPC in real-time
- Name-based trigger system allowing different NPCs to coexist
- Visual indicators showing which NPC is currently thinking
- General-purpose for diverse character archetypes and scenarios
- Full Auto-Cards compatibility for comprehensive world-building
- Retry-safe memory: a discarded response never rewrites the past
- Open source and free to use in your own scenarios~ ❤️

🎭 Setup:
1. Open the "Configure Chronicle" story card
2. Write your player character's name where it asks in the entry
3. Write non-player character names at the bottom of the notes (one per line)

🔑 Tips:
- Use simple first names so NPCs trigger when mentioned
- Set your AI response length to 200 tokens for the best results
- Reduce "recent turns searched" if NPCs stay in-scene for too long
- Reduce "thought formation chance" if Chronicle is too overwhelming
- You can install or uninstall Auto-Cards from the Chronicle config card
- Creators predefine Chronicle NPCs by naming story cards like so: @Leah
- Try different story models to see how they perform

🧠 Advanced:
- NPCs auto-generate "Brain" cards when first triggered
- Entry = operation log showing a timeline of recent AI changes
- Notes = human-readable thoughts stored as modifiable JSON in the NPC's brain
- Neither are perfect representations of the NPC's brain (there's a lot more going on under the hood)
- The operation log displays change over time; Chronicle allows NPCs to maintain their own thoughts in-character
- What seems like repetition in the operation log is often a history of useful self-maintenance on older thoughts
- Edit the notes section of a brain card to modify that agent's mind; Chronicle will use this to build context
- Valid JSON syntax is required in the notes section
- Experiments are fun! Chronicle is designed to be adaptive and flexible

⚙️ Settings:

> Enable Chronicle:
- Turns the whole system on or off
- (true or false)

> Show detailed guide:
- If true, shows this player guide in-game
- (true or false)

> First name of player character:
- Your player character's name, used to maintain correct story perspective
- (any name inside the "" or leave empty)

> Adventure in 1st, 2nd, or 3rd person:
- Which narrative PoV your story uses
- (1, 2, or 3)

> Max brain size relative to story context:
- How much of the AI's context window NPC brains can use
- Some percentage of the recent story (pink bar in your context viewer)
- (1% to 95%)

> Recent turns searched for name triggers:
- How far back through your previous actions Chronicle looks to decide which NPC (if any) should think
- (1 to 250)

> Visual indicator of current NPC triggers:
- Symbol shown by the active NPC's card name whenever their brain is engaged
- (any text/emoji inside the "" or leave empty to disable)

> Thought formation chance per turn:
- How often NPCs attempt to form new thoughts when triggered
- (0% to 100%)

> Half thought chance for Do/Say/Story:
- Reduces the thought formation chance by half during Do/Say/Story turns (maintains player agency)
- (true or false)

> Brain card notes store brains as JSON:
- Visually displays NPC brains as raw JSON in their brain card notes
- Otherwise displays a more user-friendly format to make reading/editing brains easier
- Makes no difference during gameplay or brain imports
- (true or false)

> Enable debug mode to see model tasks:
- Shows raw brain operations inline with your story text
- (true or false)

> Pin the config card near the top:
- Keeps the config card pinned high in your cards list
- (true or false)

> Install Auto-Cards:
- Enables automatic story card generation alongside Chronicle
- You can safely uninstall Auto-Cards at any time
- (true or false)

🧩 Modules:
Everything below is off until you switch it on, and safe to switch off again at any time.

> Tiered memory with pinned core thoughts:
- Thoughts live in three tiers: pinned core, long-term, and working
- A full brain evicts its coldest working thought instead of asking the AI what to burn
- Pin anything you never want forgotten with /pin, or by putting # in front of its name
- Characters are seeded with one pinned fact taken from their own story card

> Track world state (date, place, arc, factions):
- Keeps a "Chronicle" card holding the date, location, arc, standing, debts and threats
- The card is authoritative: edit it and Chronicle believes you
- The date moves when the story says it moves, never once per turn

> Let several present characters think at once:
- A three character scene reads as three people instead of one and two pieces of furniture
- Characters who act or speak are present; characters merely mentioned are not
- One character still writes per turn, rotated toward whoever spoke last

> Track who witnessed what, and what they still believe:
- Characters know what they were present for, and stay wrong about the rest
- Secrets spread through the household at the rate you set, not by narrative convenience

> Track progress clocks and scheduled consequences:
- Author your own clocks on the "Chronicle Clocks" card, with the phrase that advances each
- A full clock queues a consequence, which surfaces later, optionally once a phrase is reached

> Run periodic continuity audits:
- Now and then a turn is spent checking the scene against the world card
- Contradictions are reported to you and logged; nothing is ever corrected behind your back

> Enable player commands like /help and /undo:
- Type /help in game for the full list
- /state, /clocks, /bonds, /who, /pin, /unpin, /forget, /undo, /date, /audit, /diag

> Track relationship bonds with the player:
- Seven rungs, from unknown to formally bound, which cannot be skipped upward
- A betrayal may cost several rungs at once
- The current standing lives on the character's own card and you may edit it

> Enable diagnostics and safety rails:
- Watches the saved state size and trims the most expendable things before it overflows
- Skips optional work rather than risk a hook timing out
- Keeps a "Chronicle Diagnostics" card showing the last twenty transactions

🌸 Credit:
- Chronicle is a fork of ${ancestry} by LewdLeah, used and shared under the MIT licence
- Inner Self was a personal passion project, made as a hobby and not as a job
- Follow LewdLeah on AI Dungeon to explore the original and their other work: ${u}
- If you see LewdLeah on Discord (@LewdLeah), Reddit (u/helloitsmyalt_), or anywhere else, please say hi!
- Their kindness, patience, and love made all of this possible~ ❤️

I hope you will have lots of fun!
(please erase before continuing) <<<
        `.trim();
        prespace();
        IS.agent = "";
        return;
    } else if (!config.allow) {
        // Early exit if Chronicle is disabled
        text ||= "\u200B";
        IS.agent = "";
        return;
    }
    // Module L: whether this output had to be repaired before it could be read at all
    // Declared here because the first repair happens before the block parser starts
    let repaired = false;
    // Strip zero-width chars from the model output before processing
    text = text.replace(/[\u200B-\u200D]+/g, "");
    // Check if output looks like an unenclosed operation
    // Models sometimes forget their parentheses, the poor dears
    if (!/[()\[\]{}]/.test(text) && ((
        /^\s*(?:del(?:et(?:e[ds]?|ing))?|for(?:get(?:s|ting)?|got(?:ten)?)|remov(?:e[ds]?|ing))(?:[\s_]*(?:key(?:_name)?|thought|memory|unwanted(?:_key)?))?[\s=:]*[a-z0-9A-Z]*_+[a-z0-9A-Z]/i
    ).test(text) || /^\s*[a-z0-9A-Z_]+\s*=/.test(text))) {
        // (?:del|delete|deleted|deletes|deleting|forget|forgets|forgetting|forgot|forgotten|remove|removed|removes|removing)
        // Fully unenclosed block resembles a known pattern
        // Add an opening parentheses so the block parser can handle it
        text = `(${text.trimStart()}`;
        repaired = true;
    }
    // ==================== BLOCK PARSER ====================
    // Parse enclosed blocks from the output
    const blocks = [];
    for (const [open, close] of [
        // Try each container type in order of preference
        ["(", ")"],
        ["[", "]"],
        ["{", "}"]
    ]) {
        // Attempt to repair unclosed blocks
        const pass = (() => {
            if (!text.includes(open)) {
                // No opening bracket, skip this type
                return true;
            }
            // Check if the last opening bracket is closed
            const rightIndex = text.lastIndexOf(open);
            const rightOfOpen = text.slice(rightIndex);
            if (rightOfOpen.includes(close)) {
                // Already closed, proceed with block parsing
                return false;
            }
            // Try to find where the close bracket should go
            for (const pattern of [
                // After the deleted key name
                /^[(\[{]\s*(?:del(?:et(?:e[ds]?|ing))?|for(?:get(?:s|ting)?|got(?:ten)?)|remov(?:e[ds]?|ing))(?:[\s_]*(?:key(?:_name)?|thought|memory|unwanted(?:_key)?))?[\s=:]*[a-z0-9A-Z]*_[a-z0-9A-Z_]+/i,
                // After the renamed old key name
                /^[(\[{]\s*[a-z0-9A-Z_]+\s*=+\s*[a-z0-9A-Z]*_[a-z0-9A-Z_]+/,
                // After the triple-redundant punctuation boundary
                /[.?!‽…。！？‼⁇⁈⁉¿*¡%_–−‒—~-]["'`«»„“”「」´‘’‟‚‛]/
            ]) {
                const match = rightOfOpen.match(pattern);
                if (match) {
                    // Found a good insertion point
                    const index = rightIndex + match.index + match[0].length;
                    text = `${text.slice(0, index)}${close}${text.slice(index)}`;
                    repaired = true;
                    return false;
                }
            }
            // No boundary inferred -> Append the current close symbol to the end
            text = `${text.trimEnd()}${close}`;
            repaired = true;
            return false;
        })();
        if (text.includes(close)) {
            // Handle orphaned closing brackets (no matching open)
            if (!text.slice(0, text.indexOf(close)).includes(open)) {
                // Close without open, prepend an open
                text = `${open}${text.trimStart()}`;
            }
        } else if (pass) {
            // No brackets of this type, try next
            continue;
        }
        // Extract all outermost blocks of this bracket type
        let depth = 0;
        let start = -1;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === open) {
                if (depth === 0) {
                    // Start of a new block
                    start = i;
                }
                depth++;
            } else if (text[i] === close) {
                depth--;
                if ((depth === 0) && (start !== -1)) {
                    // End of a block, capture it
                    blocks.push(text.slice(start, i + 1));
                    start = -1;
                }
            }
        }
        // Only process the first identified bracket type per turn
        break;
    }
    /**
     * Normalizes a thought string for storage
     * Cleans up formatting quirks from model output
     * @param {string} str - Raw thought string
     * @returns {string} Cleaned thought string
     */
    const simplify = (str = "") => {
        str = (str
            // Remove markdown-style formatting
            .replace(/[#*~•·∙⋅]+/g, "")
            // Normalize whitespace
            .replace(/  +/g, " ")
            .replace(/ ?\n ?/g, "\n")
            // Standardize ellipsis
            .replaceAll("…", "...")
            // Fix possessive s's -> s' because DeepSeek is dumb
            .replace(/([sS])(['‘’‛])[sS]/g, (_, s, q) => `${s}${q}`)
            // Normalize dashes
            .replace(/[–−‒]/g, "-")
            .replace(/(?<=\S) [-—] (?=\S)/g, "—")
        )
        // Convert one lone em-dash to a semicolon if appropriate
        return (
            ((str.match(/—/g) || []).length === 1)
            && !str.includes(";") && !str.endsWith("—") && !str.startsWith("—")
        ) ? str.replace("—", "; ") : str;
    };
    // Trim IS.agent name before emptiness check
    if (((IS.agent = IS.agent.trim()) === "") && (blocks.length === 0)) {
        // No task expected, but I'm still careful here because AID retries use cached outputs
        text = simplify(text).replace(/\n\n\n+/g, "\n\n");
        if (text === "") {
            // Guard against empty string outputs to avoid a known AID bug
            text = "\u200B";
            return;
        }
        const prevText = getPrevAction()?.text ?? "";
        if (/["«»„“”「」‟]\s*$/.test(prevText) && /^\s*["«»„“”「」‟]/.test(text)) {
            // Prepend a linebreak if this and the previous actions place dialogue adjacently
            text = text.trimStart();
            prespace();
        } else if (!/\s$/.test(prevText) && !/^\s/.test(text)) {
            // Ensure taskless outputs still have a space of separation from the previous action
            text = ` ${text}`;
        }
        return;
    }
    // formatKey and path now live beside the transaction ledger, which needs them at commit
    // time, one hook later than this one
    // Create an agent instance for the triggered NPC
    // A second onOutput for the same turn falls back to the writer the context hook named,
    // because the first call will already have cleared IS.agent
    const writerName = (IS.agent !== "")
        ? IS.agent
        : ((CH.writer && (CH.writer.turn === getActionCount())) ? String(CH.writer.name || "") : "");
    const agent = (writerName === "") ? null : new Agent(writerName, { percent: config.percent });
    // Reset IS.agent
    IS.agent = "";
    /**
     * Operation descriptors staged this turn
     * Plain data only: closures do not survive the end of a turn
     * @type {Object[]}
     */
    const operations = [];
    // Track which keys have been touched this turn
    const altered = new Set();
    // ==================== BLOCK INTERPRETER ====================
    // Module B: the model is only ever shown bare key names, so a key it writes may be
    // addressing a pinned thought. Resolving that here is what lets an attempt to delete a
    // pinned thought reach the ledger, where it is refused out loud rather than ignored
    const knows = (key = "") => (
        own(agent.brain, key) || ((config.tiers === true) && own(agent.brain, `${CORE}${key}`))
    );
    // Process extracted block and queue appropriate operations
    interpreter: for (const block of blocks) {
        // Remove the block from the output text unless debug mode is enabled
        deblock: {
            let start = text.indexOf(block);
            if (start === -1) {
                break deblock;
            }
            // Chars to consume along with the block
            const naughty = (c = "") => {
                const code = c.charCodeAt(0);
                // Just for fun, no regex :3
                return (
                    (code === 0x20) // " "
                    || (code === 0x09) // "\t"
                    || (code === 0x0A) // "\n"
                    || (code === 0x0D) // "\r"
                    || (code === 0x27) // "'"
                    || (code === 0x60) // "`"
                    || (code === 0xB4) // "´"
                    || (code === 0x2018) // "‘"
                    || (code === 0x2019) // "’"
                );
            };
            let end = start + block.length;
            // Expand left to consume whitespace and quotes
            while ((0 < start) && naughty(text[start - 1])) {
                start--;
            }
            // Expand right to consume whitespace and quotes
            while ((end < text.length) && naughty(text[end])) {
                end++;
            }
            // Replace the block with newlines (or keep in debug mode)
            text = `${text.slice(0, start)}\n\n${config.debug ? `${block}\n\n` : ""}${text.slice(end)}`;
        };
        if (agent === null) {
            // Only perform deblocking when agent is null
            continue;
        }
        // Extract and normalize the block content
        const str = block.slice(1, -1).trim().replace(/==+/g, "=").replace(/::+/g, ":");
        // Prefer "=" over ":" as the key-value delimiter
        const delimiter = str.includes("=") ? "=" : ":";
        if (2 < str.split(delimiter, 3).length) {
            // Skip blocks with too many delimiters
            continue;
        }
        // ==================== DELETE OPERATION ====================
        // Check if this is a delete/forget command
        /** @returns {string|null} */
        const delKey = (() => {
            // Match various forms of "delete key_name"
            const delMatch1 = str.match(
                /^(?:del(?:et(?:e[ds]?|ing))?|for(?:get(?:s|ting)?|got(?:ten)?)|remov(?:e[ds]?|ing))(?:[\s_]*(?:key(?:_name)?|thought|memory|unwanted(?:_key)?))?[\s=:]*([\s\S]*)$/i
            );
            if (!delMatch1) {
                return null;
            }
            const delKey1 = formatKey(delMatch1[1]);
            if (knows(delKey1)) {
                // Key exists in brain
                return delKey1;
            } else if (!/(?:key|thought|memory|unwanted)/i.test(str)) {
                // Doesn't look like a common hallucination, might be invalid
                return null;
            }
            // Try again with stricter matching
            const delMatch2 = str.match(
                /^(?:del(?:et(?:e[ds]?|ing))?|for(?:get(?:s|ting)?|got(?:ten)?)|remov(?:e[ds]?|ing))[\s=:]*([\s\S]*)$/i
            );
            return delMatch2 ? formatKey(delMatch2[1]) : null;
        })();
        if ((typeof delKey === "string") && knows(delKey)) {
            // Valid delete statement
            if (!altered.has(delKey) && safeKey(delKey)) {
                // Stage the delete operation
                operations.push({ mod: "brain", op: "delete", agent: agent.name, key: delKey });
                altered.add(delKey);
            }
            continue;
        } else if (!/\S\s*[=:]+\s*\S/.test(str)) {
            // No assignment pattern, skip
            continue;
        }
        // ==================== KEY EXTRACTION ====================
        /**
         * Gets everything after the last colon in a string
         * @param {string} s - Input string
         * @returns {string} Content after last colon
         */
        const rightOfColon = (s = "") => s.slice(s.lastIndexOf(":") + 1);
        // Extract and clean the key name
        const key = (() => {
            const raw = formatKey((
                (delimiter === "=") ? rightOfColon(str.split("=", 1)[0]) : str.split(":", 1)[0]
            ).trim().replaceAll(" ", "_"));
            // If key exists in brain, use it as-is
            // Otherwise strip common prefixes/suffixes models tend to add
            return knows(raw) ? raw : (raw
                .replace(/^th(?:oughts?|ink(?:ing))_(?:(?:o[nfr]|a(?:bout|nd)|with|for)_)?/, "")
                .replace(/(?:_(?:and|or))?_th(?:oughts?|ink(?:ing))$/, "")
            );
        })();
        if ((key === "") || ((
            (60 < key.length)
            || ["thought", "thoughts", "think", "thinking", "any_name", "example_name"].includes(key)
            || ["any_key", "key_name", "example_key"].some(s => key.includes(s))
        ) && !knows(key))) {
            // Skip invalid or placeholder keys copied from the task prompts
            continue;
        } else if (!safeKey(key)) {
            // Reserved property names never reach a brain map, whatever the model wrote
            continue;
        }
        // ==================== VALUE EXTRACTION ====================
        // Extract and clean the value
        const value = (
            (str.split(delimiter, 2)[1] || "")
            // Strip leading/trailing quotes and whitespace
            .replace(/^[\s"'`«»„“”「」´‘’‟‚‛]+|[\s"'`«»„“”「」´‘’‟‚‛]+$/g, "")
            .replace(/\s+/g, " ")
        );
        if (!/[a-z0-9A-Z]/.test(value) || /[\u4e00-\u9fff]/.test(value)) {
            // Skip empty or non-latin values because DeepSeek is dumb
            continue;
        }
        // ==================== RESERVED CONTROL KEYS ====================
        // Bonds, audits and memory merges are written by the model in the very same
        // parenthetical grammar as a thought, and are recognised here by their key. There
        // is one parser in this file, and this is not a second one
        if ((config.bonds === true) && (key === BOND_KEY)) {
            operations.push({
                mod: "bond", op: "step", npc: agent.name, delta: readBondRequest(agent.name, value)
            });
            continue;
        }
        if ((config.audit === true) && (key === "audit")) {
            operations.push({ mod: "audit", op: "record", value: value.slice(0, 300) });
            continue;
        }
        if ((config.tiers === true) && (key === "compress")) {
            const mem = memoryOf(agent.name);
            const summary = simplify(value.replaceAll("\u2192", " ")).trim().split("\n", 1)[0].trimEnd();
            if ((mem.compress.length === 2) && summary.includes(" ") && (summary.length <= CAP.thought)) {
                operations.push({
                    mod: "brain",
                    op: "merge",
                    agent: agent.name,
                    key: formatKey(bareKey(mem.compress[0])) || "merged_memory",
                    from: [...mem.compress],
                    value: summary,
                    label: 0
                });
            }
            // Either way the request has been answered and should not be asked again
            mem.compress = [];
            continue;
        }
        if (!value.includes(" ")) {
            // ==================== RENAME OPERATION ====================
            // No spaces = might be a key rename
            if (altered.has(key)) {
                continue;
            }
            const oldKey = formatKey(value);
            if (!altered.has(oldKey) && knows(oldKey) && safeKey(oldKey)) {
                // Valid rename: move thought from old key to new key
                // Stage a rename operation
                operations.push({
                    mod: "brain", op: "rename", agent: agent.name, key, from: oldKey
                });
                altered.add(key);
                altered.add(oldKey);
            }
            continue;
        } else if (value.includes("_")) {
            // Underscores in value = probably a malformed key, skip
            continue;
        }
        // ==================== ASSIGN OPERATION ====================
        // Extract the actual thought content
        const thought = simplify(rightOfColon(value)
            .replaceAll("→", " ")
            .replaceAll("\\n", "\n")
        ).trim().split("\n", 1)[0].trimEnd();
        if (altered.has(key) || !thought.includes(" ") || (CAP.thought < thought.length)) {
            // Skip if key already touched, thought too short, or thought absurdly long
            continue;
        } else if (!knows(key)) {
            // Check for duplicate thought values (don't store the same thing twice)
            const last = thought.length - 1;
            // Potentially hot loop so avoid excessive get() calls
            const brain = agent.brain;
            for (const key in brain) {
                const existing = brain[key];
                if (
                    // This shouldn't be possible but whatevs
                    (typeof existing === "string")
                    // Short-circuit on impossible relative lengths for speed
                    && (last < existing.length)
                    // Fast check inclusion
                    && (existing.indexOf(thought) !== -1)
                ) {
                    // This thought already exists within some thought associated with another key
                    continue interpreter;
                }
            }
        }
        // Stage an assign operation
        // Its label is allocated later, once the outgoing text is otherwise final, because
        // allocating a label means weaving that label's marker into this very text
        // One common complaint from playtesters was that models were storing repeated thoughts
        // Upon further investigation, I discovered this was actually miscommunication on my part
        // Players assumed the operation log (card entry) was a reflection of the brain (card notes)
        // Thus players (reasonably) misinterpreted label updates as repetition
        // Solution: Log distinct relabel syntax to improve non-verbal communication (see applyOp)
        operations.push({ mod: "brain", op: "set", agent: agent.name, key, value: thought, label: 0 });
        altered.add(key);
    }
    // ==================== OUTPUT TEXT SANITIZATION ====================
    // Clean up the model's output text before finalizing
    // This removes artifacts, formatting issues, and unwanted patterns
    text = (simplify(config.debug ? text : text.replaceAll("_", ""))
        .trim()
        .split("\n")
        .filter(line => {
            const lower = line.toLowerCase();
            return !(
                // The nuclear option
                /(?:^|[^a-zA-Z])(?:task|output)(?:$|[^a-zA-Z])/.test(lower)
                // Common AI hallucinations
                || [
                    "STRICT",
                    "OUTPUT",
                    "REQUIRE",
                    "EXACT",
                    "TASK",
                    "FORMAT",
                    "inner self",
                    `You are ${config.player}.`
                ].some(naughty => line.includes(naughty))
                // Remove "story continues" type artifacts from task prompts bleeding through
                || (lower.includes("story") && lower.includes("continu"))
                // Remove numbered list items (e.g., "1.", "[1]", "2.")
                || /^\[?\d+(?:\.?\]|\.)/.test(lower)
                // Remove stray "user" labels from ChatML imitation
                || /^\s*user(?:$|[^a-z])/.test(lower)
                // Remove lines containing only " " and/or "-"
                || /^[ -]+$/.test(lower)
            );
        })
        .join("\n")
        .trim()
        // Collapse excessive newlines to a maximum of two
        .replace(/\n\n\n+/g, "\n\n")
    );
    // ==================== OUTPUT FINALIZATION ====================
    // Handle empty outputs and ensure proper spacing between actions
    if (text === "") {
        // AID does not tolerate empty string outputs and "please select continue" messages are cringe
        // Return encoding if available, otherwise a zero-width space placeholder
        text = (IS.encoding === "") ? "\u200B" : IS.encoding;
    } else {
        // Prepend the thought label encoding to the output text
        text = `${IS.encoding}${text}`;
        // Ensure all between-action linebreaks are equally spaced
        prespace();
    }
    // ==================== MODULE L - JUDGING THE ANSWER ====================
    // A task was issued and this is what came back. Ops parsed cleanly count as compliance,
    // ops recovered from malformed output count as half, silence counts as nothing
    if (asked && (asked.kind !== "canary")) {
        recordCompliance(
            (operations.length === 0) ? 0 : (repaired ? 0.5 : 1)
        );
        CH.compliance.asked = null;
    }
    // ==================== MODULE SCANS ====================
    // These read the turn's prose rather than a parenthetical: time passing, the clock
    // triggers the player declared, and who was in the room for it
    // Everything they find is staged, so a retried turn does not move the calendar twice
    const actors = config.agents.filter(name => {
        const lower = text.toLowerCase();
        const needle = name.toLowerCase();
        for (let p = lower.indexOf(needle); (p !== -1); p = lower.indexOf(needle, p + 1)) {
            const before = (0 < p) ? lower.charCodeAt(p - 1) : 0;
            const after = ((p + needle.length) < lower.length) ? lower.charCodeAt(p + needle.length) : 0;
            if (((before < 97) || (122 < before)) && ((after < 97) || (122 < after))) {
                return true;
            }
        }
        return false;
    });
    if (config.world === true) {
        const days = readTimePassage(text, config.maxDays);
        if (0 < days) {
            operations.push({ mod: "world", op: "advanceDays", n: days });
        }
    }
    if (config.clocks === true) {
        for (const id of triggeredClocks(readClocks(), text).slice(0, 3)) {
            operations.push({ mod: "clock", op: "tick", id, n: 1 });
        }
        if (CH.fire && (CH.fire.turn === getActionCount()) && Array.isArray(CH.fire.ids)) {
            // The directive went out in this turn's context, so the queue entry is spent
            operations.push({ mod: "queue", op: "fire", ids: CH.fire.ids });
            CH.fire = null;
        }
    }
    if ((config.knows === true) && (0 < actors.length)) {
        operations.push({
            mod: "event", op: "record", actors, place: CH.world.place, tag: tagEvent(text)
        });
    }
    // ==================== TRANSACTION STAGING ====================
    // Stage the turn's operations instead of writing them
    // Nothing below touches a story card: the ledger commits on the next turn, once the
    // generation these operations came from has actually landed in the story
    if (operations.length === 0) {
        // No operations to stage, we're done
        if (config.canary === true) {
            writeFallbackChannel(config);
        }
        recordTiming("output");
        return;
    }
    // Clear the previous encoding since new operations are being staged
    IS.encoding = "";
    // Where the label counter stood before this transaction, so a discard can rewind to it
    const labelStart = IS.label;
    // A model that emits a dozen blocks in one output gets the first CAP.ops of them
    const staged = operations.slice(0, CAP.ops);
    for (const operation of staged) {
        if ((operation.op !== "set") && (operation.op !== "merge")) {
            continue;
        }
        // Increment the global label counter
        IS.label++;
        operation.label = IS.label;
        // Encode the label as zero-width chars for context tracking
        IS.encoding = `${(IS.encoding === "") ? "\u200B" : IS.encoding}${(() => {
            let n = IS.label;
            let out = "";
            // Convert label to binary using ZWNJ (0) and ZWJ (1)
            while (0 < n) {
                out = `${(n & 1) ? "\u200D" : "\u200C"}${out}`;
                n >>>= 1;
            }
            return out || "\u200C";
        })()}\u200B`;
        // Inject the encoding into the output text
        // This is the half of an operation that cannot wait for the commit, because the
        // marker has to travel with the prose it belongs to
        text = (text
            .replace(/[\u200B-\u200D]+/g, "")
            .replace(/^\s*/, leadingWhitespace => `${leadingWhitespace}${IS.encoding}`)
        );
    }
    text ||= "\u200B";
    // Park the transaction. A retry overwrites this record whole, it never merges into it
    CH.pending = {
        // The turn that produced these operations, which a later turn must move past
        actionCount: getActionCount(),
        // How a later turn recognizes this exact generation inside history
        fingerprint: fingerprint(text),
        // Where to rewind the label counter if this generation is discarded
        labelStart,
        // The markers embedded above, kept as a second way to recognize the generation
        encoding: IS.encoding,
        // Whose brain these operations belong to, empty when the world moved but nobody
        // in it happened to be thinking
        agent: agent ? agent.name : "",
        // Settings captured now, so the commit needs no config card of its own
        percent: agent ? agent.metadata.percent : config.percent,
        json: (config.json === true),
        // Module settings as they stood when this generation happened
        cfg: moduleConfig(config),
        // Module E: who was in the room, and therefore who saw what
        actors,
        // Everyone who could hear a rumour, for propagation at commit time
        agents: config.agents.slice(0, 24),
        ops: staged
    };
    // Inner Self stored this hash to suppress a second write on retry, and Chronicle never
    // reads it. It is still written here so an adventure rolled back to Inner Self finds
    // exactly the value that version would have left behind
    // Keep every staging made for this same turn, newest last, capped
    CH.candidates = [
        ...(Array.isArray(CH.candidates) ? CH.candidates : []).filter(
            candidate => (candidate && (candidate.actionCount === CH.pending.actionCount))
        ),
        CH.pending
    ].slice(-CAP.candidates);
    // Instrumentation for the open question of how many times onOutput fires per visible
    // turn. Every entry here is one call, with the turn it claimed and what it staged
    CH.diag.stagings = [
        ...(Array.isArray(CH.diag.stagings) ? CH.diag.stagings : []),
        { t: CH.pending.actionCount, h: CH.pending.fingerprint, n: staged.length }
    ].slice(-8);
    IS.hash = historyHash();
    journal("stage", { ops: staged.length, agent: agent ? agent.name : "" });
    if (config.canary === true) {
        // Module M: memory written here takes effect from the next action, which is
        // exactly when the fallback is needed
        writeFallbackChannel(config);
    }
    // State is at its largest right here, with a transaction staged and not yet spent
    enforceStateBudget(commitConfig({ cfg: moduleConfig(config) }));
    recordTiming("output");
    return;
}

// Adventures installed before the rename call InnerSelf() from their three hook tabs
// The alias keeps every one of those installs running without touching a single shim
globalThis.InnerSelf ??= Chronicle;

//—————————————————————————————————————————————————————————————————————————————————————

/**
 * Auto-Cards v1.1.3
 * Made by LewdLeah on May 21, 2025
 * This AI Dungeon script automatically creates and updates plot-relevant story cards while you play
 * General-purpose usefulness and compatibility with other scenarios/scripts were my design priorities
 * Auto-Cards is fully open-source, please copy for use within your own projects! ❤️
 */
function AutoCards(inHook, inText, inStop) {
    "use strict"; const S = {
    /*
    Default Auto-Cards settings
    Feel free to change these settings to customize your scenario's default gameplay experience
    The default values for your scenario are specified below:
    */
    // Is Auto-Cards already enabled when the adventure begins?
    DEFAULT_DO_AC: true
    // (true or false)
    ,
    // Pin the "Configure Auto-Cards" story card at the top of the player's story cards list?
    DEFAULT_PIN_CONFIGURE_CARD: false
    // (true or false)
    ,
    // Minimum number of turns in between automatic card generation events?
    DEFAULT_CARD_CREATION_COOLDOWN: 40
    // (0 to 9999)
    ,
    // Use a bulleted list format for newly generated card entries?
    DEFAULT_USE_BULLETED_LIST_MODE: true
    // (true or false)
    ,
    // Maximum allowed length for newly generated story card entries?
    DEFAULT_GENERATED_ENTRY_LIMIT: 600
    // (200 to 2000)
    ,
    // Do newly generated cards have memory updates enabled by default?
    DEFAULT_NEW_CARDS_DO_MEMORY_UPDATES: false
    // (true or false)
    ,
    // Default character limit before the card's memory bank is summarized?
    DEFAULT_NEW_CARDS_MEMORY_LIMIT: 3200
    // (1750 to 9900)
    ,
    // Approximately how much shorter should recently compressed memories be? (ratio = 10 * old / new)
    DEFAULT_MEMORY_COMPRESSION_RATIO: 25
    // (20 to 1250)
    ,
    // Ignore all-caps during title candidate detection?
    DEFAULT_IGNORE_ALL_CAPS_TITLES: true
    // (true or false)
    ,
    // Should player input actions (Do/Say/Story) be considered during title detection?
    DEFAULT_DETECT_TITLES_FROM_INPUTS: false
    // (true or false)
    ,
    // How many (minimum) actions in the past does Auto-Cards look for named entities?
    DEFAULT_MINIMUM_LOOK_BACK_DISTANCE: 7
    // (2 to 88)
    ,
    // Is Live Script Interface v2 enabled?
    DEFAULT_DO_LSI_V2: false
    // (true or false)
    ,
    // Should the "Debug Data" story card be visible?
    DEFAULT_SHOW_DEBUG_DATA: false
    // (true or false)
    ,
    // AI prompt used to generate new story card entries?
    DEFAULT_CARD_GENERATION_PROMPT: [
        "-----",
        "",
        "<SYSTEM>",
        "# Stop the story and ignore previous instructions. Write a brief and coherent informational entry for %{title} following these instructions:",
        "- Write only third-person pure prose information about %{title} using complete sentences with correct punctuation",
        "- Avoid short-term temporary details or appearances, instead focus on plot-significant information",
        "- Prioritize story-relevant details about %{title} first to ensure seamless integration with the previous plot",
        "- Create new information based on the context and story direction",
        "- Mention %{title} in every sentence",
        "- Use semicolons if needed",
        "- Add additional details about %{title} beneath incomplete entries",
        "- Be concise and grounded",
        "- Imitate the story's writing style and infer the reader's preferences",
        "</SYSTEM>",
        "Continue the entry for %{title} below while avoiding repetition:",
        "%{entry}"
     ] // (mimic this multi-line "text" format)
    ,
    // AI prompt used to summarize a given story card's memory bank?
    DEFAULT_CARD_MEMORY_COMPRESSION_PROMPT: [
        "-----",
        "",
        "<SYSTEM>",
        "# Stop the story and ignore previous instructions. Summarize and condense the given paragraph into a narrow and focused memory passage while following these guidelines:",
        "- Ensure the passage retains the core meaning and most essential details",
        "- Use the third-person perspective",
        "- Prioritize information-density, accuracy, and completeness",
        "- Remain brief and concise",
        "- Write firmly in the past tense",
        "- The paragraph below pertains to old events from far earlier in the story",
        "- Integrate %{title} naturally within the memory; however, only write about the events as they occurred",
        "- Only reference information present inside the paragraph itself, be specific",
        "</SYSTEM>",
        "Write a summarized old memory passage for %{title} based only on the following paragraph:",
        "\"\"\"",
        "%{memory}",
        "\"\"\"",
        "Summarize below:"
    ] // (mimic this multi-line "text" format)
    ,
    // Titles banned from future card generation attempts?
    DEFAULT_BANNED_TITLES_LIST: (
        "North, East, South, West, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, January, February, March, April, May, June, July, August, September, October, November, December"
    ) // (mimic this comma-list "text" format)
    ,
    // Default story card "type" used by Auto-Cards? (does not matter)
    DEFAULT_CARD_TYPE: "class"
    // ("text")
    ,
    // Should titles mentioned in the "opening" plot component be banned from future card generation by default?
    DEFAULT_BAN_TITLES_FROM_OPENING: false
    // (true or false)
    ,
    }; //——————————————————————————————————————————————————————————————————————————————

    /*
    Useful API functions for coders (otherwise ignore)
    Here's what each one does in plain terms:

    AutoCards().API.postponeEvents();
    Pauses Auto-Cards activity for n many turns

    AutoCards().API.emergencyHalt();
    Emergency stop or resume

    AutoCards().API.suppressMessages();
    Hides Auto-Cards toasts by preventing assignment to state.message

    AutoCards().API.debugLog();
    Writes to the debug log card

    AutoCards().API.toggle();
    Turns Auto-Cards on/off

    AutoCards().API.generateCard();
    Initiates AI generation of the requested card

    AutoCards().API.redoCard();
    Regenerates an existing card

    AutoCards().API.setCardAsAuto();
    Flags or unflags a card as automatic

    AutoCards().API.addCardMemory();
    Adds a memory to a specific card

    AutoCards().API.eraseAllAutoCards();
    Deletes all auto-cards

    AutoCards().API.getUsedTitles();
    Lists all current card titles

    AutoCards().API.getBannedTitles();
    Shows your current banned titles list

    AutoCards().API.setBannedTitles();
    Replaces the banned titles list with a new list

    AutoCards().API.buildCard();
    Makes a new card from scratch, using exact parameters

    AutoCards().API.getCard();
    Finds cards that match a filter

    AutoCards().API.eraseCard();
    Deletes cards matching a filter
    */

    /*** Postpones internal Auto-Cards events for a specified number of turns
    * 
    * @function
    * @param {number} turns A non-negative integer representing the number of turns to postpone events
    * @returns {Object} An object containing cooldown values affected by the postponement
    * @throws {Error} If turns is not a non-negative integer
    */
    // AutoCards().API.postponeEvents();

    /*** Sets or clears the emergency halt flag to pause Auto-Cards operations
    * 
    * @function
    * @param {boolean} shouldHalt A boolean value indicating whether to engage (true) or disengage (false) emergency halt
    * @returns {boolean} The value that was set
    * @throws {Error} If called from within isolateLSIv2 scope or with a non-boolean argument
    */
    // AutoCards().API.emergencyHalt();

    /*** Enables or disables state.message assignments from Auto-Cards
    * 
    * @function
    * @param {boolean} shouldSuppress If true, suppresses all Auto-Cards messages; false enables them
    * @returns {Array} The current pending messages after setting suppression
    * @throws {Error} If shouldSuppress is not a boolean
    */
    // AutoCards().API.suppressMessages();

    /*** Logs debug information to the "Debug Log card console
    * 
    * @function
    * @param {...any} args Arguments to log for debugging purposes
    * @returns {any} The story card object reference
    */
    // AutoCards().API.debugLog();

    /*** Toggles Auto-Cards behavior or sets it directly
    * 
    * @function
    * @param {boolean|null|undefined} toggleType If undefined, toggles the current state. If boolean or null, sets the state accordingly
    * @returns {boolean|null|undefined} The state that was set or inferred
    * @throws {Error} If toggleType is not a boolean, null, or undefined
    */
    // AutoCards().API.toggle();

    /*** Generates a new card using optional prompt details or a card request object
    * 
    * This function supports two usage modes:
    * 
    * 1. Object Mode:
    *    Pass a single object containing card request parameters. The only mandatory property is "title"
    *    All other properties are optional and customize the card generation
    * 
    *    Example:
    *    AutoCards().API.generateCard({
    *      type: "character",         // The category or type of the card; defaults to "class" if omitted
    *      title: "Leah the Lewd",    // The card's title (required)
    *      keysStart: "Lewd,Leah",    // Optional trigger keywords associated with the card
    *      entryStart: "You are a woman named Leah.", // Existing content to prepend to the AI-generated entry
    *      entryPrompt: "",           // Global prompt guiding AI content generation
    *      entryPromptDetails: "Focus on Leah's works of artifice and ingenuity", // Additional prompt info
    *      entryLimit: 600,           // Target character length for the AI-generated entry
    *      description: "Player character!", // Freeform notes
    *      memoryStart: "Leah purchased a new sweater.", // Existing memory content
    *      memoryUpdates: true,       // Whether the card's memory bank will update on its own
    *      memoryLimit: 3200          // Preferred memory bank size before summarization/compression
    *    });
    * 
    * 2. String Mode:
    *    Pass a string as the title and optionally two additional strings to specify prompt details
    *    This mode is shorthand for quick card generation without an explicit card request object
    * 
    *    Examples:
    *    AutoCards().API.generateCard("Leah the Lewd");
    *    AutoCards().API.generateCard("Leah the Lewd", "Focus on Leah's works of artifice and ingenuity");
    *    AutoCards().API.generateCard(
    *      "Leah the Lewd",
    *      "Focus on Leah's works of artifice and ingenuity",
    *      "You are a woman named Leah."
    *    );
    * 
    * @function
    * @param {Object|string} request Either a fully specified card request object or a string title
    * @param {string} [extra1] Optional detailed prompt text when using string mode
    * @param {string} [extra2] Optional entry start text when using string mode
    * @returns {boolean} Returns true if the generation attempt succeeded, false otherwise
    * @throws {Error} Throws if called with invalid arguments or missing a required title property
    */
    // AutoCards().API.generateCard();

    /*** Regenerates a card by title or object reference, optionally preserving or modifying its input info
    *
    * @function
    * @param {Object|string} request Either a fully specified card request object or a string title for the card to be regenerated
    * @param {boolean} [useOldInfo=true] If true, preserves old info in the new generation; false omits it
    * @param {string} [newInfo=""] Additional info to append to the generation prompt
    * @returns {boolean} True if regeneration succeeded; false otherwise
    * @throws {Error} If the request format is invalid, or if the second or third parameters are the wrong types
    */
    // AutoCards().API.redoCard();

    /*** Flags or unflags a card as an auto-card, controlling its automatic generation behavior
    *
    * @function
    * @param {Object|string} targetCard The card object or title to mark/unmark as an auto-card
    * @param {boolean} [setOrUnset=true] If true, marks the card as an auto-card; false removes the flag
    * @returns {boolean} True if the operation succeeded; false if the card was invalid or already matched the target state
    * @throws {Error} If the arguments are invalid types
    */
    // AutoCards().API.setCardAsAuto();

    /*** Appends a memory to a story card's memory bank
    *
    * @function
    * @param {Object|string} targetCard A card object reference or title string
    * @param {string} newMemory The memory text to add
    * @returns {boolean} True if the memory was added; false if it was empty, already present, or the card was not found
    * @throws {Error} If the inputs are not a string or valid card object reference
    */
    // AutoCards().API.addCardMemory();

    /*** Removes all previously generated auto-cards and resets various states
    *
    * @function
    * @returns {number} The number of cards that were removed
    */
    // AutoCards().API.eraseAllAutoCards();

    /*** Retrieves an array of titles currently used by the adventure's story cards
    *
    * @function
    * @returns {Array<string>} An array of strings representing used titles
    */
    // AutoCards().API.getUsedTitles();

    /*** Retrieves an array of banned titles
    *
    * @function
    * @returns {Array<string>} An array of banned title strings
    */
    // AutoCards().API.getBannedTitles();

    /*** Sets the banned titles array, replacing any previously banned titles
    *
    * @function
    * @param {string|Array<string>} titles A comma-separated string or array of strings representing titles to ban
    * @returns {Object} An object containing oldBans and newBans arrays
    * @throws {Error} If the input is neither a string nor an array of strings
    */
    // AutoCards().API.setBannedTitles();

    /*** Creates a new story card with the specified parameters
    *
    * @function
    * @param {string|Object} title Card title string or full card template object containing all fields
    * @param {string} [entry] The entry text for the card
    * @param {string} [type] The card type (e.g., "character", "location")
    * @param {string} [keys] The keys (triggers) for the card
    * @param {string} [description] The notes or memory bank of the card
    * @param {number} [insertionIndex] Optional index to insert the card at a specific position within storyCards
    * @returns {Object|null} The created card object reference, or null if creation failed
    */
    // AutoCards().API.buildCard();

    /*** Finds and returns story cards satisfying a user-defined condition
    * Example:
    * const leahCard = AutoCards().API.getCard(card => (card.title === "Leah"));
    *
    * @function
    * @param {Function} predicate A function which takes a card and returns true if it matches
    * @param {boolean} [getAll=false] If true, returns all matching cards; otherwise returns the first match
    * @returns {Object|Array<Object>|null} A single card object reference, an array of cards, or null if no match is found
    * @throws {Error} If the predicate is not a function or getAll is not a boolean
    */
    // AutoCards().API.getCard();

    /*** Removes story cards based on a user-defined condition or by direct reference
    * Example:
    * AutoCards().API.eraseCard(card => (card.title === "Leah"));
    *
    * @function
    * @param {Function|Object} predicate A predicate function or a card object reference
    * @param {boolean} [eraseAll=false] If true, removes all matching cards; otherwise removes the first match
    * @returns {boolean|number} True if a single card was removed, false if none matched, or the number of cards erased
    * @throws {Error} If the inputs are not a valid predicate function, card object, or boolean
    */
    // AutoCards().API.eraseCard();

    //—————————————————————————————————————————————————————————————————————————————————

    /*
    To everyone who helped, thank you:

    AHotHamster22
    Most extensive testing, feedback, ideation, and kindness

    BinKompliziert
    UI feedback

    Boo
    Discord communication

    bottledfox
    API ideas for alternative card generation use-cases

    Bruno
    Most extensive testing, feedback, ideation, and kindness
    https://play.aidungeon.com/profile/Azuhre

    Burnout
    Implementation improvements, algorithm ideas, script help, and LSIv2 inspiration

    bweni
    Testing

    DebaczX
    Most extensive testing, feedback, ideation, and kindness

    Dirty Kurtis
    Card entry generation prompt engineering

    Dragranis
    Provided the memory dataset used for boundary calibration

    effortlyss
    Data, testing, in-game command ideas, config settings, and other UX improvements

    Hawk
    Grammar and special-cased proper nouns

    Idle Confusion
    Testing
    https://play.aidungeon.com/profile/Idle%20Confusion

    ImprezA
    Most extensive testing, feedback, ideation, and kindness
    https://play.aidungeon.com/profile/ImprezA

    Kat-Oli
    Title parsing, grammar, and special-cased proper nouns

    KryptykAngel
    LSIv2 ideas
    https://play.aidungeon.com/profile/KryptykAngel

    Mad19pumpkin
    API ideas
    https://play.aidungeon.com/profile/Mad19pumpkin

    Magic
    Implementation and syntax improvements
    https://play.aidungeon.com/profile/MagicOfLolis

    Mirox80
    Testing, feedback, and scenario integration ideas
    https://play.aidungeon.com/profile/Mirox80

    Nathaniel Wyvern
    Testing
    https://play.aidungeon.com/profile/NathanielWyvern

    NobodyIsUgly
    All-caps title parsing feedback

    OnyxFlame
    Card memory bank implementation ideas and special-cased proper nouns

    Purplejump
    API ideas for deep integration with other AID scripts

    Randy Viosca
    Context injection and card memory bank structure
    https://play.aidungeon.com/profile/Random_Variable

    RustyPawz
    API ideas for simplified card interaction
    https://play.aidungeon.com/profile/RustyPawz

    sinner
    Testing

    Sleepy pink
    Testing and feedback
    https://play.aidungeon.com/profile/Pinkghost

    Vutinberg
    Memory compression ideas and prompt engineering

    Wilmar
    Card entry generation and memory summarization prompt engineering

    Yi1i1i
    Idea for the redoCard API function and "/ac redo" in-game command

    A note to future individuals:
    If you fork or modify Auto-Cards... Go ahead and put your name here too! Yay! 🥰
    */

    //—————————————————————————————————————————————————————————————————————————————————

    /*
    The code below implements Auto-Cards
    Enjoy! ❤️
    */

    // My class definitions are hoisted by wrapper functions because it's less ugly (lol)
    const Const = hoistConst();
    const O = hoistO();
    const Words = hoistWords();
    const StringsHashed = hoistStringsHashed();
    const Internal = hoistInternal();
    // AutoCards has an explicitly immutable domain: HOOK, TEXT, and STOP
    const HOOK = inHook;
    const TEXT = ((typeof inText === "string") && inText) || "\n";
    const STOP = (inStop === true);
    // AutoCards returns a pseudoimmutable codomain which is initialized only once before being read and returned
    const CODOMAIN = new Const().declare();
    // Transient sets for high-performance lookup
    const [used, bans, auto, forenames, surnames] = Array.from({length: 5}, () => new Set());
    const memoized = new Map();
    // Holds a reference to the data card singleton, remains unassigned unless required
    let data = null;
    // Validate globalThis.text
    text = ((typeof text === "string") && text) || "\n";
    // Main settings override local settings
    if (typeof globalThis.MainSettings === "function") {
        new MainSettings("AutoCards", "AC").merge(S);
    }
    // Container for the persistent state of AutoCards
    const AC = (function() {
        if (state.LSIv2) {
            // The Auto-Cards external API is also available from within the inner scope of LSIv2
            // Call with AutoCards().API.nameOfFunction(yourArguments);
            return state.LSIv2;
        } else if (state.AutoCards) {
            // state.AutoCards is prioritized for performance
            const ac = state.AutoCards;
            delete state.AutoCards;
            return ac;
        }
        const dataVariants = getDataVariants();
        data = getSingletonCard(false, O.f({...dataVariants.critical}), O.f({...dataVariants.debug}));
        // Deserialize the state of Auto-Cards from the data card
        const ac = (function() {
            try {
                return JSON.parse(data?.description);
            } catch {
                return null;
            }
        })();
        // If the deserialized state fails to match the following structure, fallback to defaults
        if (validate(ac, O.f({
            config: [
                "doAC", "deleteAllAutoCards", "pinConfigureCard", "addCardCooldown", "bulletedListMode", "defaultEntryLimit", "defaultCardsDoMemoryUpdates", "defaultMemoryLimit", "memoryCompressionRatio", "ignoreAllCapsTitles", "readFromInputs", "minimumLookBackDistance", "LSIv2", "showDebugData", "generationPrompt", "compressionPrompt", "defaultCardType"
            ],
            signal: [
                "emergencyHalt", "forceToggle", "overrideBans", "swapControlCards", "recheckRetryOrErase", "maxChars", "outputReplacement", "upstreamError"
            ],
            generation: [
                "cooldown", "completed", "permitted", "workpiece", "pending"
            ],
            compression: [
                "completed", "titleKey", "vanityTitle", "responseEstimate", "lastConstructIndex", "oldMemoryBank", "newMemoryBank"
            ],
            message: [
                "previous", "suppress", "pending", "event"
            ],
            chronometer: [
                "turn", "step", "amnesia", "postpone"
            ],
            database: {
                titles: [
                    "used", "banned", "candidates", "lastActionParsed", "lastTextHash", "pendingBans", "pendingUnbans"
                ],
                memories: [
                    "associations", "duplicates"
                ]
            }
        }))) {
            // The deserialization was a success
            return ac;
        }
        function validate(obj, finalKeys) {
            if ((typeof obj !== "object") || (obj === null)) {
                return false;
            } else {
                return Object.entries(finalKeys).every(([key, value]) => {
                    if (!(key in obj)) {
                        return false;
                    } else if (Array.isArray(value)) {
                        return value.every(finalKey => {
                            return (finalKey in obj[key]);
                        });
                    } else {
                        return validate(obj[key], value);
                    }
                });
            }
        }
        // AC is malformed, reinitialize with default values
        return {
            // In-game configurable parameters
            config: getDefaultConfig(),
            // Collection of various short-term signals passed forward in time
            signal: {
                // API: Suspend nearly all Auto-Cards processes
                emergencyHalt: false,
                // API: Forcefully toggle Auto-Cards on or off
                forceToggle: null,
                // API: Banned titles were externally overwritten
                overrideBans: 0,
                // Signal the construction of the opposite control card during the upcoming onOutput hook
                swapControlCards: false,
                // Signal a limited recheck of recent title candidates following a retry or erase
                recheckRetryOrErase: false,
                // Signal an upcoming onOutput text replacement
                outputReplacement: "",
                // info.maxChars is only defined onContext but must be accessed during other hooks too
                maxChars: Math.abs(info?.maxChars || 3200),
                // An error occured within the isolateLSIv2 scope during an earlier hook
                upstreamError: ""
            },
            // Moderates the generation of new story card entries
            generation: {
                // Number of story progression turns between card generations
                cooldown: validateCooldown(
                    underQuarterInteger(validateCooldown(S.DEFAULT_CARD_CREATION_COOLDOWN))
                ),
                // Continues prompted so far
                completed: 0,
                // Upper limit on consecutive continues
                permitted: 34,
                // Properties of the incomplete story card
                workpiece: O.f({}),
                // Pending card generations
                pending: [],
            },
            // Moderates the compression of story card memories
            compression: {
                // Continues prompted so far
                completed: 0,
                // A title header reference key for this auto-card
                titleKey: "",
                // The full and proper title
                vanityTitle: "",
                // Response length estimate used to compute # of outputs remaining
                responseEstimate: 1400,
                // Indices [0, n] of oldMemoryBank memories used to build the current memory construct
                lastConstructIndex: -1,
                // Bank of card memories awaiting compression
                oldMemoryBank: [],
                // Incomplete bank of newly compressed card memories
                newMemoryBank: [],
            },
            // Prevents incompatibility issues borne of state.message modification
            message: {
                // Last turn's state.message
                previous: getStateMessage(),
                // API: Allow Auto-Cards to post messages?
                suppress: false,
                // Pending Auto-Cards message(s)
                pending: (function() {
                    if (S.DEFAULT_DO_AC !== false) {
                        const startupMessage = "Enabled! You may now edit the \"Configure Auto-Cards\" story card";
                        logEvent(startupMessage);
                        return [startupMessage];
                    } else {
                        return [];
                    }
                })(),
                // Counter to track all Auto-Cards message events
                event: 0
            },
            // Timekeeper used for temporal events
            chronometer: {
                // Previous turn's measurement of info.actionCount
                turn: getTurn(),
                // Whether or not various turn counters should be stepped (falsified by retry actions)
                step: true,
                // Number of consecutive turn interruptions
                amnesia: 0,
                // API: Postpone Auto-Cards externalities for n many turns
                postpone: 0,
            },
            // Scalable atabase to store dynamic game information
            database: {
                // Words are pale shadows of forgotten names. As names have power, words have power
                titles: {
                    // A transient array of known titles parsed from card titles, entry title headers, and trigger keywords
                    used: [],
                    // Titles banned from future card generation attempts and various maintenance procedures
                    banned: getDefaultConfigBans(),
                    // Potential future card titles and their turns of occurrence
                    candidates: [],
                    // Helps avoid rechecking the same action text more than once, generally
                    lastActionParsed: -1,
                    // Ensures weird combinations of retry/erase events remain predictable
                    lastTextHash: "%@%",
                    // Newly banned titles which will be added to the config card
                    pendingBans: [],
                    // Currently banned titles which will be removed from the config card
                    pendingUnbans: []
                },
                // Memories are parsed from context and handled by various operations (basically magic)
                memories: {
                    // Dynamic store of 'story card -> memory' conceptual relations
                    associations: {},
                    // Serialized hashset of the 2000 most recent near-duplicate memories purged from context
                    duplicates: "%@%"
                }
            }
        };
    })();
    O.f(AC);
    O.s(AC.config);
    O.s(AC.signal);
    O.s(AC.generation);
    O.s(AC.generation.workpiece);
    AC.generation.pending.forEach(request => O.s(request));
    O.s(AC.compression);
    O.s(AC.message);
    O.s(AC.chronometer);
    O.f(AC.database);
    O.s(AC.database.titles);
    O.s(AC.database.memories);
    if (!HOOK) {
        globalThis.stop ??= false;
        AC.signal.maxChars = Math.abs(info?.maxChars || AC.signal.maxChars);
        if (HOOK === null) {
            if (Number.isInteger(info.maxChars)) {
                // AutoCards(null) is always invoked once after being declared within the shared library
                // Context must be cleaned before passing text to the context modifier
                // This measure is taken to ensure compatability with other scripts
                // First, remove all command, continue, and comfirmation messages from the context window
                text = (text
                    // Remove all /ac commands
                    .replace(/\s*^.*\/\s*A\s*C.*$\s*/gmi, "\n\n")
                    // Remove all comfirmation requests and responses
                    .replace(/\s*\n*.*CONFIRM\s*DELETE.*\n*\s*/gi, confirmation => {
                        if (confirmation.includes("<<<")) {
                            return "\n\n";
                        } else {
                            return "";
                        }
                    })
                    // Remove dumb memories from the context window
                    // (Latitude, if you're reading this, please give us memoryBank read/write access 😭)
                    .replace(/(Memories:)\s*([\s\S]*?)\s*(Recent Story:|$)/i, (_, left, memories, right) => {
                        return (left + "\n" + (memories
                            .split("\n")
                            .filter(memory => {
                                const lowerMemory = memory.toLowerCase();
                                return !(
                                    (lowerMemory.includes("select") && lowerMemory.includes("continue"))
                                    || lowerMemory.includes(">>>") || lowerMemory.includes("<<<")
                                    || lowerMemory.includes("lsiv2")
                                );
                            })
                            .join("\n")
                        ) + (right !== "") ? ("\n\n" + right) : "");
                    })
                    // Remove various Auto-Cards messages
                    .replace(/(?:\s*>>>[\s\S]*?<<<\s*)+/g, "\n\n")
                );
                if (!shouldProceed()) {
                    // Whenever Auto-Cards is inactive, remove auto card title headers from contextualized story card entries
                    text = (text
                        .replace(/\s*{\s*titles?\s*:[\s\S]*?}\s*/gi, "\n\n")
                        .replace(/World Lore:\s*/i, "World Lore:\n")
                    );
                    // Otherwise, implement a more complex version of this step within the (HOOK === "context") scope of AutoCards
                }
            }
            CODOMAIN.initialize(null);
        } else {
            // AutoCards was (probably) called without arguments, return an external API to allow other script creators to programmatically govern the behavior of Auto-Cards from elsewhere within their own scripts
            state.InnerSelf ??= {};
            state.InnerSelf.AC ??= {};
            state.InnerSelf.AC.forced = true;
            CODOMAIN.initialize({API: O.f(Object.fromEntries(Object.entries({
                // Call these API functions like so: AutoCards().API.nameOfFunction(argumentsOfFunction)
                /*** Postpones internal Auto-Cards events for a specified number of turns
                * 
                * @function
                * @param {number} turns A non-negative integer representing the number of turns to postpone events
                * @returns {Object} An object containing cooldown values affected by the postponement
                * @throws {Error} If turns is not a non-negative integer
                */
                postponeEvents: function(turns) {
                    if (Number.isInteger(turns) && (0 <= turns)) {
                        AC.chronometer.postpone = turns;
                    } else {
                        throw new Error(
                            "Invalid argument: \"" + turns + "\" -> AutoCards().API.postponeEvents() must be be called with a non-negative integer"
                        );
                    }
                    return {
                        postponeAllCooldown: turns,
                        addCardRealCooldown: AC.generation.cooldown,
                        addCardNextCooldown: AC.config.addCardCooldown
                    };
                },
                /*** Sets or clears the emergency halt flag to pause Auto-Cards operations
                * 
                * @function
                * @param {boolean} shouldHalt A boolean value indicating whether to engage (true) or disengage (false) emergency halt
                * @returns {boolean} The value that was set
                * @throws {Error} If called from within isolateLSIv2 scope or with a non-boolean argument
                */
                emergencyHalt: function(shouldHalt) {
                    const scopeRestriction = new Error();
                    if (scopeRestriction.stack && scopeRestriction.stack.includes("isolateLSIv2")) {
                        throw new Error(
                            "Scope restriction: AutoCards().API.emergencyHalt() cannot be called from within LSIv2 (prevents deadlock) but you're more than welcome to use AutoCards().API.postponeEvents() instead!"
                        );
                    } else if (typeof shouldHalt === "boolean") {
                        AC.signal.emergencyHalt = shouldHalt;
                    } else {
                        throw new Error(
                            "Invalid argument: \"" + shouldHalt + "\" -> AutoCards().API.emergencyHalt() must be called with a boolean true or false"
                        );
                    }
                    return shouldHalt;
                },
                /*** Enables or disables state.message assignments from Auto-Cards
                * 
                * @function
                * @param {boolean} shouldSuppress If true, suppresses all Auto-Cards messages; false enables them
                * @returns {Array} The current pending messages after setting suppression
                * @throws {Error} If shouldSuppress is not a boolean
                */
                suppressMessages: function(shouldSuppress) {
                    if (typeof shouldSuppress === "boolean") {
                        AC.message.suppress = shouldSuppress;
                    } else {
                        throw new Error(
                            "Invalid argument: \"" + shouldSuppress + "\" -> AutoCards().API.suppressMessages() must be called with a boolean true or false"
                        );
                    }
                    return AC.message.pending;
                },
                /*** Logs debug information to the "Debug Log" console card
                * 
                * @function
                * @param {...any} args Arguments to log for debugging purposes
                * @returns {any} The story card object reference
                */
                debugLog: function(...args) {
                    return Internal.debugLog(...args);
                },
                /*** Toggles Auto-Cards behavior or sets it directly
                * 
                * @function
                * @param {boolean|null|undefined} toggleType If undefined, toggles the current state. If boolean or null, sets the state accordingly
                * @returns {boolean|null|undefined} The state that was set or inferred
                * @throws {Error} If toggleType is not a boolean, null, or undefined
                */
                toggle: function(toggleType) {
                    if (toggleType === undefined) {
                        if (AC.signal.forceToggle !== null) {
                            AC.signal.forceToggle = !AC.signal.forceToggle;
                        } else if (AC.config.doAC) {
                            AC.signal.forceToggle = false;
                        } else {
                            AC.signal.forceToggle = true;
                        }
                    } else if ((toggleType === null) || (typeof toggleType === "boolean")) {
                        AC.signal.forceToggle = toggleType;
                    } else {
                        throw new Error(
                            "Invalid argument: \"" + toggleType + "\" -> AutoCards().API.toggle() must be called with either A) a boolean true or false, B) a null argument, or C) no arguments at all (undefined)"
                        );
                    }
                    return toggleType;
                },
                /*** Generates a new card using optional prompt details or a request object
                * 
                * @function
                * @param {Object|string} request A request object with card parameters or a string representing the title
                * @param {string} [extra1] Optional entryPromptDetails if using string mode
                * @param {string} [extra2] Optional entryStart if using string mode
                * @returns {boolean} Did the generation attempt succeed or fail
                * @throws {Error} If the request is not valid or missing a title
                */
                generateCard: function(request, extra1, extra2) {
                    // Function call guide:
                    // AutoCards().API.generateCard({
                    //     // All properties except 'title' are optional
                    //     type: "card type, defaults to 'class' for ease of filtering",
                    //     title: "card title",
                    //     keysStart: "preexisting card triggers",
                    //     entryStart: "preexisting card entry",
                    //     entryPrompt: "prompt the AI will use to complete this entry",
                    //     entryPromptDetails: "extra details to include with this card's prompt",
                    //     entryLimit: 600, // target character count for the generated entry
                    //     description: "card notes",
                    //     memoryStart: "preexisting card memory",
                    //     memoryUpdates: true, // card updates when new relevant memories are formed
                    //     memoryLimit: 3200, // max characters before the card memory is compressed
                    // });
                    if (typeof request === "string") {
                        request = {title: request};
                        if (typeof extra1 === "string") {
                            request.entryPromptDetails = extra1;
                            if (typeof extra2 === "string") {
                                request.entryStart = extra2;
                            }
                        }
                    } else if (!isTitleInObj(request)) {
                        throw new Error(
                            "Invalid argument: \"" + request + "\" -> AutoCards().API.generateCard() must be called with either 1, 2, or 3 strings OR a correctly formatted card generation object"
                        );
                    }
                    O.f(request);
                    Internal.getUsedTitles(true);
                    return Internal.generateCard(request);
                },
                /*** Regenerates a card by title or object reference, optionally preserving or modifying its input info
                *
                * @function
                * @param {Object|string} request A card object reference or title string for the card to be regenerated
                * @param {boolean} [useOldInfo=true] If true, preserves old info in the new generation; false omits it
                * @param {string} [newInfo=""] Additional info to append to the generation prompt
                * @returns {boolean} True if regeneration succeeded; false otherwise
                * @throws {Error} If the request format is invalid, or if the second or third parameters are the wrong types
                */
                redoCard: function(request, useOldInfo = true, newInfo = "") {
                    if (typeof request === "string") {
                        request = {title: request};
                    } else if (!isTitleInObj(request)) {
                        throw new Error(
                            "Invalid argument: \"" + request + "\" -> AutoCards().API.redoCard() must be called with a string or correctly formatted card generation object"
                        );
                    }
                    if (typeof useOldInfo !== "boolean") {
                        throw new Error(
                            "Invalid argument: \"" + request + ", " + useOldInfo + "\" -> AutoCards().API.redoCard() requires a boolean as its second argument"
                        );
                    } else if (typeof newInfo !== "string") {
                        throw new Error(
                            "Invalid argument: \"" + request + ", " + useOldInfo + ", " + newInfo + "\" -> AutoCards().API.redoCard() requires a string for its third argument"
                        );
                    }
                    return Internal.redoCard(request, useOldInfo, newInfo);
                },
                /*** Flags or unflags a card as an auto-card, controlling its automatic generation behavior
                *
                * @function
                * @param {Object|string} targetCard The card object or title to mark/unmark as an auto-card
                * @param {boolean} [setOrUnset=true] If true, marks the card as an auto-card; false removes the flag
                * @returns {boolean} True if the operation succeeded; false if the card was invalid or already matched the target state
                * @throws {Error} If the arguments are invalid types
                */
                setCardAsAuto: function(targetCard, setOrUnset = true) {
                    if (isTitleInObj(targetCard)) {
                        targetCard = targetCard.title;
                    } else if (typeof targetCard !== "string") {
                        throw new Error(
                            "Invalid argument: \"" + targetCard + "\" -> AutoCards().API.setCardAsAuto() must be called with a string or card object"
                        );
                    }
                    if (typeof setOrUnset !== "boolean") {
                        throw new Error(
                            "Invalid argument: \"" + targetCard + ", " + setOrUnset + "\" -> AutoCards().API.setCardAsAuto() requires a boolean as its second argument"
                        );
                    }
                    const [card, isAuto] = getIntendedCard(targetCard);
                    if (card === null) {
                        return false;
                    }
                    if (setOrUnset) {
                        if (checkAuto()) {
                            return false;
                        }
                        card.description = "{title:}";
                        Internal.getUsedTitles(true);
                        return card.entry.startsWith("{title: ");
                    } else if (!checkAuto()) {
                        return false;
                    }
                    card.entry = removeAutoProps(card.entry);
                    card.description = removeAutoProps(card.description.replace((
                        /\s*Auto(?:-|\s*)Cards\s*will\s*contextualize\s*these\s*memories\s*:\s*/gi
                    ), ""));
                    function checkAuto() {
                        return (isAuto || /{updates: (?:true|false), limit: \d+}/.test(card.description));
                    }
                    return true;
                },
                /*** Appends a memory to a story card's memory bank
                *
                * @function
                * @param {Object|string} targetCard A card object reference or title string
                * @param {string} newMemory The memory text to add
                * @returns {boolean} True if the memory was added; false if it was empty, already present, or the card was not found
                * @throws {Error} If the inputs are not a string or valid card object reference
                */
                addCardMemory: function(targetCard, newMemory) {
                    if (isTitleInObj(targetCard)) {
                        targetCard = targetCard.title;
                    } else if (typeof targetCard !== "string") {
                        throw new Error(
                            "Invalid argument: \"" + targetCard + "\" -> AutoCards().API.addCardMemory() must be called with a string or card object"
                        );
                    }
                    if (typeof newMemory !== "string") {
                        throw new Error(
                            "Invalid argument: \"" + targetCard + ", " + newMemory + "\" -> AutoCards().API.addCardMemory() requires a string for its second argument"
                        );
                    }
                    newMemory = newMemory.trim().replace(/\s+/g, " ").replace(/^-+\s*/, "");
                    if (newMemory === "") {
                        return false;
                    }
                    const [card, isAuto, titleKey] = getIntendedCard(targetCard);
                    if (
                        (card === null)
                        || card.description.replace(/\s+/g, " ").toLowerCase().includes(newMemory.toLowerCase())
                    ) {
                        return false;
                    } else if (card.description !== "") {
                        card.description += "\n";
                    }
                    card.description += "- " + newMemory;
                    if (titleKey in AC.database.memories.associations) {
                        AC.database.memories.associations[titleKey][1] = (StringsHashed
                            .deserialize(AC.database.memories.associations[titleKey][1], 65536)
                            .remove(newMemory)
                            .add(newMemory)
                            .latest(3500)
                            .serialize()
                        );
                    } else if (isAuto) {
                        AC.database.memories.associations[titleKey] = [999, (new StringsHashed(65536)
                            .add(newMemory)
                            .serialize()
                        )];
                    }
                    return true;
                },
                /*** Removes all previously generated auto-cards and resets various states
                *
                * @function
                * @returns {number} The number of cards that were removed
                */
                eraseAllAutoCards: function() {
                    return Internal.eraseAllAutoCards();
                },
                /*** Retrieves an array of titles currently used by the adventure's story cards
                *
                * @function
                * @returns {Array<string>} An array of strings representing used titles
                */
                getUsedTitles: function() {
                    return Internal.getUsedTitles(true);
                },
                /*** Retrieves an array of banned titles
                *
                * @function
                * @returns {Array<string>} An array of banned title strings
                */
                getBannedTitles: function() {
                    return Internal.getBannedTitles();
                },
                /*** Sets the banned titles array, replacing any previously banned titles
                *
                * @function
                * @param {string|Array<string>} titles A comma-separated string or array of strings representing titles to ban
                * @returns {Object} An object containing oldBans and newBans arrays
                * @throws {Error} If the input is neither a string nor an array of strings
                */
                setBannedTitles: function(titles) {
                    const codomain = {oldBans: AC.database.titles.banned};
                    if (Array.isArray(titles) && titles.every(title => (typeof title === "string"))) {
                        assignBannedTitles(titles);
                    } else if (typeof titles === "string") {
                        if (titles.includes(",")) {
                            assignBannedTitles(titles.split(","));
                        } else {
                            assignBannedTitles([titles]);
                        }
                    } else {
                        throw new Error(
                            "Invalid argument: \"" + titles + "\" -> AutoCards().API.setBannedTitles() must be called with either a string or an array of strings"
                        );
                    }
                    codomain.newBans = AC.database.titles.banned;
                    function assignBannedTitles(titles) {
                        Internal.setBannedTitles(uniqueTitlesArray(titles), false);
                        AC.signal.overrideBans = 3;
                        return;
                    }
                    return codomain;
                },
                /*** Creates a new story card with the specified parameters
                *
                * @function
                * @param {string|Object} title Card title string or full card template object containing all fields
                * @param {string} [entry] The entry text for the card
                * @param {string} [type] The card type (e.g., "character", "location")
                * @param {string} [keys] The keys (triggers) for the card
                * @param {string} [description] The notes or memory bank of the card
                * @param {number} [insertionIndex] Optional index to insert the card at a specific position within storyCards
                * @returns {Object|null} The created card object reference, or null if creation failed
                */
                buildCard: function(title, entry, type, keys, description, insertionIndex) {
                    if (isTitleInObj(title)) {
                        type = title.type ?? type;
                        keys = title.keys ?? keys;
                        entry = title.entry ?? entry;
                        description = title.description ?? description;
                        title = title.title;
                    }
                    title = cast(title);
                    const card = constructCard(O.f({
                        type: cast(type, AC.config.defaultCardType),
                        title,
                        keys: cast(keys, buildKeys("", title)),
                        entry: cast(entry),
                        description: cast(description)
                    }), boundInteger(0, insertionIndex, storyCards.length, newCardIndex()));
                    if (notEmptyObj(card)) {
                        return card;
                    }
                    function cast(value, fallback = "") {
                        if (typeof value === "string") {
                            return value;
                        } else {
                            return fallback;
                        }
                    }
                    return null;
                },
                /*** Finds and returns story cards satisfying a user-defined condition
                *
                * @function
                * @param {Function} predicate A function which takes a card and returns true if it matches
                * @param {boolean} [getAll=false] If true, returns all matching cards; otherwise returns the first match
                * @returns {Object|Array<Object>|null} A single card object reference, an array of cards, or null if no match is found
                * @throws {Error} If the predicate is not a function or getAll is not a boolean
                */
                getCard: function(predicate, getAll = false) {
                    if (typeof predicate !== "function") {
                        throw new Error(
                            "Invalid argument: \"" + predicate + "\" -> AutoCards().API.getCard() must be called with a function"
                        );
                    } else if (typeof getAll !== "boolean") {
                        throw new Error(
                            "Invalid argument: \"" + predicate + ", " + getAll + "\" -> AutoCards().API.getCard() requires a boolean as its second argument"
                        );
                    }
                    return Internal.getCard(predicate, getAll);
                },
                /*** Removes story cards based on a user-defined condition or by direct reference
                *
                * @function
                * @param {Function|Object} predicate A predicate function or a card object reference
                * @param {boolean} [eraseAll=false] If true, removes all matching cards; otherwise removes the first match
                * @returns {boolean|number} True if a single card was removed, false if none matched, or the number of cards erased
                * @throws {Error} If the inputs are not a valid predicate function, card object, or boolean
                */
                eraseCard: function(predicate, eraseAll = false) {
                    if (isTitleInObj(predicate) && storyCards.includes(predicate)) {
                        return eraseCard(predicate);
                    } else if (typeof predicate !== "function") {
                        throw new Error(
                            "Invalid argument: \"" + predicate + "\" -> AutoCards().API.eraseCard() must be called with a function or card object"
                        );
                    } else if (typeof eraseAll !== "boolean") {
                        throw new Error(
                            "Invalid argument: \"" + predicate + ", " + eraseAll + "\" -> AutoCards().API.eraseCard() requires a boolean as its second argument"
                        );
                    } else if (eraseAll) {
                        // Erase all cards which satisfy the given condition
                        let cardsErased = 0;
                        for (const [index, card] of storyCards.entries()) {
                            if (predicate(card)) {
                                removeStoryCard(index);
                                cardsErased++;
                            }
                        }
                        return cardsErased;
                    }
                    // Erase the first card which satisfies the given condition
                    for (const [index, card] of storyCards.entries()) {
                        if (predicate(card)) {
                            removeStoryCard(index);
                            return true;
                        }
                    }
                    return false;
                }
            }).map(([key, fn]) => [key, function(...args) {
                const result = fn.apply(this, args);
                if (data) {
                    data.description = JSON.stringify(AC);
                }
                return result;
            }])))});
            function isTitleInObj(obj) {
                return (
                    (typeof obj === "object")
                    && (obj !== null)
                    && ("title" in obj)
                    && (typeof obj.title === "string")
                );
            }
        }
    } else if (AC.signal.emergencyHalt) {
        switch(HOOK) {
        case "context": {
            // AutoCards was called within the context modifier
            advanceChronometer();
            break; }
        case "output": {
            // AutoCards was called within the output modifier
            concludeEmergency();
            const previousAction = readPastAction(0);
            if (isDoSayStory(previousAction.type) && /escape\s*emergency\s*halt/i.test(previousAction.text)) {
                AC.signal.emergencyHalt = false;
            }
            break; }
        }
        CODOMAIN.initialize(TEXT);
    } else if ((AC.config.LSIv2 !== null) && AC.config.LSIv2) {
        // Silly recursion shenanigans
        state.LSIv2 = AC;
        AC.config.LSIv2 = false;
        const LSI_DOMAIN = AutoCards(HOOK, TEXT, STOP);
        // Is this lazy loading mechanism overkill? Yes. But it's fun!
        const factories = O.f({
            library: () => ({
                name: Words.reserved.library,
                entry: prose(
                    "// Your adventure's Shared Library code goes here",
                    "// Example Library code:",
                    "state.promptDragon ??= false;",
                    "state.mind ??= 0;",
                    "state.willStop ??= false;",
                    "function formatMessage(message, space = \" \") {",
                    "    let leadingNewlines = \"\";",
                    "    let trailingNewlines = \"\\n\\n\";",
                    "    if (text.startsWith(\"\\n> \")) {",
                    "        // We don't want any leading/trailing newlines for Do/Say",
                    "        trailingNewlines = \"\";",
                    "    } else if (history && (0 < history.length)) {",
                    "        // Decide leading newlines based on the previous action",
                    "        const action = history[history.length - 1];",
                    "        if ((action.type === \"continue\") || (action.type === \"story\")) {",
                    "            if (!action.text.endsWith(\"\\n\")) {",
                    "                leadingNewlines = \"\\n\\n\";",
                    "            } else if (!action.text.endsWith(\"\\n\\n\")) {",
                    "                leadingNewlines = \"\\n\";",
                    "            }",
                    "        }",
                    "    }",
                    "    return leadingNewlines + \"{>\" + space + (message",
                    "        .replace(/(?:\\s*(?:{>|<})\\s*)+/g, \" \")",
                    "        .trim()",
                    "    ) + space + \"<}\" + trailingNewlines;",
                    "}"),
                description:
                    "// You may also continue your Library code below",
                singleton: false,
                position: 2
            }),
            input: () => ({
                name: Words.reserved.input,
                entry: prose(
                    "// Your adventure's Input Modifier code goes here",
                    "// Example Input code:",
                    "const minds = [",
                    "\"kind and gentle\",",
                    "\"curious and eager\",",
                    "\"cruel and evil\"",
                    "];",
                    "// Type any of these triggers into a Do/Say/Story action",
                    "const commands = new Map([",
                    "[\"encounter dragon\", () => {",
                    "    AutoCards().API.postponeEvents(1);",
                    "    state.promptDragon = true;",
                    "    text = formatMessage(\"You encounter a dragon!\");",
                    "    log(\"A dragon appears!\");",
                    "}],",
                    "[\"summon leah\", () => {",
                    "    alterMind();",
                    "    const success = AutoCards().API.generateCard({",
                    "        title: \"Leah\",",
                    "        entryPromptDetails: (",
                    "            \"Leah is an exceptionally \" +",
                    "            minds[state.mind] +",
                    "            \" woman\"",
                    "        ),",
                    "        entryStart: \"Leah is your magically summoned assistant.\"",
                    "    });",
                    "    if (success) {",
                    "        text = formatMessage(\"You begin summoning Leah!\");",
                    "        log(\"Attempting to summon Leah\");",
                    "    } else {",
                    "        text = formatMessage(\"You failed to summon Leah...\");",
                    "        log(\"Leah could not be summoned\");",
                    "    }",
                    "}],",
                    "[\"alter leah\", () => {",
                    "    alterMind();",
                    "    const success = AutoCards().API.redoCard(\"Leah\", true, (",
                    "        \"You used your magic on Leah\\n\" +",
                    "        \"Therefore she is now entirely \" +",
                    "        minds[state.mind]",
                    "    ));",
                    "    if (success) {",
                    "        text = formatMessage(",
                    "            \"You proceed to alter Leah's mind!\"",
                    "        );",
                    "        log(\"Attempting to alter Leah\");",
                    "    } else {",
                    "        text = formatMessage(\"You failed to alter Leah...\");",
                    "        log(\"Leah could not be altered\");",
                    "    }",
                    "}],",
                    "[\"show api\", () => {",
                    "    state.showAPI = true;",
                    "    text = formatMessage(\"Displaying the Auto-Cards API below\");",
                    "}],",
                    "[\"force stop\", () => {",
                    "    state.willStop = true;",
                    "}]",
                    "]);",
                    "const lowerText = text.toLowerCase();",
                    "for (const [trigger, implement] of commands) {",
                    "    if (lowerText.includes(trigger)) {",
                    "        implement();",
                    "        break;",
                    "    }",
                    "}",
                    "function alterMind() {",
                    "    state.mind = (state.mind + 1) % minds.length;",
                    "    return;",
                    "}"),
                description:
                    "// You may also continue your Input code below",
                singleton: false,
                position: 3
            }),
            context: () => ({
                name: Words.reserved.context,
                entry: prose(
                    "// Your adventure's Context Modifier code goes here",
                    "// Example Context code:",
                    "text = text.replace(/\\s*{>[\\s\\S]*?<}\\s*/gi, \"\\n\\n\");",
                    "if (state.willStop) {",
                    "    state.willStop = false;",
                    "    // Assign true to prevent the onOutput hook",
                    "    // This can only be done onContext",
                    "    stop = true;",
                    "} else if (state.promptDragon) {",
                    "    state.promptDragon = false;",
                    "    text = (",
                    "        text.trimEnd() +",
                    "        \"\\n\\nA cute little dragon softly lands upon your head. \"",
                    "    );",
                    "}"),
                description:
                    "// You may also continue your Context code below",
                singleton: false,
                position: 4
            }),
            output: () => ({
                name: Words.reserved.output,
                entry: prose(
                    "// Your adventure's Output Modifier code goes here",
                    "// Example Output code:",
                    "if (state.showAPI) {",
                    "    state.showAPI = false;",
                    "    const apiKeys = (Object.keys(AutoCards().API)",
                    "        .map(key => (\"AutoCards().API.\" + key + \"()\"))",
                    "    );",
                    "    text = formatMessage(apiKeys.join(\"\\n\"), \"\\n\");",
                    "    log(apiKeys);",
                    "}"),
                description:
                    "// You may also continue your Output code below",
                singleton: false,
                position: 5
            }),
            guide: () => ({
                name: Words.reserved.guide,
                entry: prose(
                    "Any valid JavaScript code you write within the Shared Library or Input/Context/Output Modifier story cards will be executed from top to bottom; Live Script Interface v2 closely emulates AI Dungeon's native scripting environment, even if you aren't the owner of the original scenario. Furthermore, I've provided full access to the Auto-Cards scripting API. Please note that disabling LSIv2 via the \"Configure Auto-Cards\" story card will reset your LSIv2 adventure scripts!",
                    "",
                    "If you aren't familiar with scripting in AI Dungeon, please refer to the official guidebook page:",
                    "https://help.aidungeon.com/scripting",
                    "",
                    "I've included an example script with the four aforementioned code cards, to help showcase some of my fancy schmancy Auto-Cards API functions. Take a look, try some of my example commands, inspect the Console Log, and so on... It's a ton of fun! ❤️",
                    "",
                    "If you ever run out of space in your Library, Input, Context, or Output code cards, simply duplicate whichever one(s) you need and then perform an in-game turn before writing any more code. (emphasis on \"before\") Doing so will signal LSIv2 to convert your duplicated code card(s) into additional auxiliary versions.",
                    "",
                    "Auxiliary code cards are numbered, and any code written within will be appended in sequential order. For example:",
                    "// Shared Library (entry)",
                    "// Shared Library (notes)",
                    "// Shared Library 2 (entry)",
                    "// Shared Library 2 (notes)",
                    "// Shared Library 3 (entry)",
                    "// Shared Library 3 (notes)",
                    "// Input Modifier (entry)",
                    "// Input Modifier (notes)",
                    "// Input Modifier 2 (entry)",
                    "// Input Modifier 2 (notes)",
                    "// And so on..."),
                description:
                    "",
                singleton: true,
                position: 0
            }),
            state: () => ({
                name: Words.reserved.state,
                entry:
                    "Your adventure's full state object is displayed in the Notes section below.",
                description:
                    "",
                singleton: true,
                position: 6
            }),
            log: () => ({
                name: Words.reserved.log,
                entry:
                    "Please refer to the Notes section below to view the full log history for LSIv2. Console log entries are ordered from most recent to oldest. LSIv2 error messages will be recorded here, alongside the outputs of log and console.log function calls within your adventure scripts.",
                description:
                    "",
                singleton: true,
                position: 1
            })
        });
        const cache = {};
        const templates = new Proxy({}, {
            get(_, key) {
                return cache[key] ??= O.f(factories[key]());
            }
        });
        if (AC.config.LSIv2 !== null) {
            switch(HOOK) {
            case "input": {
                // AutoCards was called within the input modifier
                const [libraryCards, inputCards, logCard] = collectCards(
                    templates.library,
                    templates.input,
                    templates.log
                );
                const [error, newText] = isolateLSIv2(parseCode(libraryCards, inputCards), callbackLog(logCard), LSI_DOMAIN);
                handleError(logCard, error);
                if (hadError()) {
                    CODOMAIN.initialize(getStoryError());
                    AC.signal.upstreamError = "\n";
                } else {
                    CODOMAIN.initialize(newText);
                }
                break; }
            case "context": {
                // AutoCards was called within the context modifier
                const [libraryCards, contextCards, logCard] = collectCards(
                    templates.library,
                    templates.context,
                    templates.log,
                    templates.input
                );
                if (hadError()) {
                    endContextLSI(LSI_DOMAIN);
                    break;
                }
                const [error, ...newCodomain] = (([error, newText, newStop]) => [error, newText, (newStop === true)])(
                    isolateLSIv2(parseCode(libraryCards, contextCards), callbackLog(logCard), LSI_DOMAIN[0], LSI_DOMAIN[1])
                );
                handleError(logCard, error);
                endContextLSI(newCodomain);
                function endContextLSI(newCodomain) {
                    CODOMAIN.initialize(newCodomain);
                    if (!newCodomain[1]) {
                        return;
                    }
                    const [guideCard, stateCard] = collectCards(
                        templates.guide,
                        templates.state,
                        templates.output
                    );
                    AC.message.pending = [];
                    concludeLSI(guideCard, stateCard, logCard);
                    return;
                }
                break; }
            case "output": {
                // AutoCards was called within the output modifier
                const [libraryCards, outputCards, guideCard, stateCard, logCard] = collectCards(
                    templates.library,
                    templates.output,
                    templates.guide,
                    templates.state,
                    templates.log
                );
                if (hadError()) {
                    endOutputLSI(true, LSI_DOMAIN);
                    break;
                }
                const [error, newText] = isolateLSIv2(parseCode(libraryCards, outputCards), callbackLog(logCard), LSI_DOMAIN);
                handleError(logCard, error);
                endOutputLSI(hadError(), newText);
                function endOutputLSI(displayError, newText) {
                    if (displayError) {
                        if (AC.signal.upstreamError === "\n") {
                            CODOMAIN.initialize("\n");
                        } else {
                            CODOMAIN.initialize(getStoryError() + "\n");
                        }
                        AC.message.pending = [];
                    } else {
                        CODOMAIN.initialize(newText);
                    }
                    concludeLSI(guideCard, stateCard, logCard);
                    return;
                }
                break; }
            case "initialize": {
                collectAll();
                logToCard(Internal.getCard(card => (card.title === templates.log.name)), "LSIv2 startup -> Success!");
                CODOMAIN.initialize(null);
                break; }
            }
            AC.config.LSIv2 = true;
            function parseCode(...args) {
                return (args
                    .flatMap(cardset => [cardset.primary, ...cardset.auxiliaries])
                    .flatMap(card => [card.entry, card.description])
                    .join("\n")
                );
            }
            function callbackLog(logCard) {
                return function(...args) {
                    logToCard(logCard, ...args);
                    return;
                }
            }
            function handleError(logCard, error) {
                if (!error) {
                    return;
                }
                O.f(error);
                AC.signal.upstreamError = (
                    "LSIv2 encountered an error during the on" + HOOK[0].toUpperCase() + HOOK.slice(1) + " hook"
                );
                if (error.message) {
                    AC.signal.upstreamError += ":\n";
                    if (error.stack) {
                        const stackMatch = error.stack.match(/AutoCards[\s\S]*?:\s*(\d+)\s*:\s*(\d+)/i);
                        if (stackMatch) {
                            AC.signal.upstreamError += (
                                (error.name ?? "Error") + ": " + error.message + "\n" +
                                "(line #" + stackMatch[1] + " column #" + stackMatch[2] + ")"
                            );
                        } else {
                            AC.signal.upstreamError += error.stack;
                        }
                    } else {
                        AC.signal.upstreamError += (error.name ?? "Error") + ": " + error.message;
                    }
                    AC.signal.upstreamError = cleanSpaces(AC.signal.upstreamError.trimEnd());
                }
                logToCard(logCard, AC.signal.upstreamError);
                if (getStateMessage() === AC.signal.upstreamError) {
                    state.message = AC.signal.upstreamError + " ";
                } else {
                    state.message = AC.signal.upstreamError;
                }
                return;
            }
            function hadError() {
                return (AC.signal.upstreamError !== "");
            }
            function getStoryError() {
                return getPrecedingNewlines() + ">>>\n" + AC.signal.upstreamError + "\n<<<\n";
            }
            function concludeLSI(guideCard, stateCard, logCard) {
                AC.signal.upstreamError = "";
                guideCard.description = templates.guide.description;
                guideCard.entry = templates.guide.entry;
                stateCard.entry = templates.state.entry;
                logCard.entry = templates.log.entry;
                postMessages();
                const simpleState = {...state};
                delete simpleState.LSIv2;
                stateCard.description = limitString(stringifyObject(simpleState).trim(), 999999).trimEnd();
                return;
            }
        } else {
            const cardsets = collectAll();
            for (const cardset of cardsets) {
                if ("primary" in cardset) {
                    killCard(cardset.primary);
                    for (const card of cardset.auxiliaries) {
                        killCard(card);
                    }
                } else {
                    killCard(cardset);
                }
                function killCard(card) {
                    unbanTitle(card.title);
                    eraseCard(card);
                }
            }
            AC.signal.upstreamError = "";
            CODOMAIN.initialize(LSI_DOMAIN);
        }
        // This measure ensures the Auto-Cards external API is equally available from within the inner scope of LSIv2
        // As before, call with AutoCards().API.nameOfFunction(yourArguments);
        deepMerge(AC, state.LSIv2);
        delete state.LSIv2;
        function deepMerge(target, source) {
            for (const key in source) {
                if (!source.hasOwnProperty(key)) {
                    continue;
                } else if (
                    (typeof source[key] === "object")
                    && (source[key] !== null)
                    && !Array.isArray(source[key])
                    && (typeof target[key] === "object")
                    && (target[key] !== null)
                    && (key !== "workpiece")
                    && (key !== "associations")
                ) {
                    // Recursively merge static objects
                    deepMerge(target[key], source[key]);
                } else {
                    // Directly replace values
                    target[key] = source[key];
                }
            }
            return;
        }
        function collectAll() {
            return collectCards(...Object.keys(factories).map(key => templates[key]));
        }
        // collectCards constructs, validates, repairs, retrieves, and organizes all LSIv2 script cards associated with the given arguments by iterating over the storyCards array only once! Returned elements are easily handled via array destructuring assignment
        function collectCards(...args) {
            // args: [{name: string, entry: string, description: string, singleton: boolean, position: integer}]
            const collections = O.f(args.map(({name, entry, description, singleton, position}) => {
                const collection = {
                    template: O.f({
                        type: AC.config.defaultCardType,
                        title: name,
                        keys: name,
                        entry,
                        description
                    }),
                    singleton,
                    position,
                    primary: null,
                    excess: [],
                };
                if (!singleton) {
                    collection.auxiliaries = [];
                    collection.occupied = new Set([0, 1]);
                }
                return O.s(collection);
            }));
            for (const card of storyCards) {
                O.s(card);
                for (const collection of collections) {
                    if (
                        !card.title.toLowerCase().includes(collection.template.title.toLowerCase())
                        && !card.keys.toLowerCase().includes(collection.template.title.toLowerCase())
                    ) {
                        // No match, swipe left
                        continue;
                    }
                    if (collection.singleton) {
                        setPrimary();
                        break;
                    }
                    const [extensionA, extensionB] = [card.title, card.keys].map(name => {
                        const extensionMatch = name.replace(/[^a-zA-Z0-9]/g, "").match(/\d+$/);
                        if (extensionMatch) {
                            return parseInt(extensionMatch[0], 10);
                        } else {
                            return -1;
                        }
                    });
                    if (-1 < extensionA) {
                        if (-1 < extensionB) {
                            if (collection.occupied.has(extensionA)) {
                                setAuxiliary(extensionB);
                            } else {
                                setAuxiliary(extensionA, true);
                            }
                        } else {
                            setAuxiliary(extensionA);
                        }
                    } else if (-1 < extensionB) {
                        setAuxiliary(extensionB);
                    } else {
                        setPrimary();
                    }
                    function setAuxiliary(extension, preChecked = false) {
                        if (preChecked || !collection.occupied.has(extension)) {
                            addAuxiliary(card, collection, extension);
                        } else {
                            card.title = card.keys = collection.template.title;
                            collection.excess.push(card);
                        }
                        return;
                    }
                    function setPrimary() {
                        card.title = card.keys = collection.template.title;
                        if (collection.primary === null) {
                            collection.primary = card;
                        } else {
                            collection.excess.push(card);
                        }
                        return;
                    }
                    break;
                }
            }
            for (const collection of collections) {
                banTitle(collection.template.title);
                if (collection.singleton) {
                    if (collection.primary === null) {
                        constructPrimary();
                    } else if (hasExs()) {
                        for (const card of collection.excess) {
                            eraseCard(card);
                        }
                    }
                    continue;
                } else if (collection.primary === null) {
                    if (hasExs()) {
                        collection.primary = collection.excess.shift();
                        if (hasExs() || hasAux()) {
                            applyComment(collection.primary);
                        } else {
                            collection.primary.entry = collection.template.entry;
                            collection.primary.description = collection.template.description;
                            continue;
                        }
                    } else {
                        constructPrimary();
                        if (hasAux()) {
                            applyComment(collection.primary);
                        } else {
                            continue;
                        }
                    }
                }
                if (hasExs()) {
                    for (const card of collection.excess) {
                        let extension = 2;
                        while (collection.occupied.has(extension)) {
                            extension++;
                        }
                        applyComment(card);
                        addAuxiliary(card, collection, extension);
                    }
                }
                if (hasAux()) {
                    collection.auxiliaries.sort((a, b) => {
                        return a.extension - b.extension;
                    });
                }
                function hasExs() {
                    return (0 < collection.excess.length);
                }
                function hasAux() {
                    return (0 < collection.auxiliaries.length);
                }
                function applyComment(card) {
                    card.entry = card.description = "// You may continue writing your code here";
                    return;
                }
                function constructPrimary() {
                    collection.primary = constructCard(collection.template, newCardIndex());
                    // I like my LSIv2 cards to display in the proper order once initialized uwu
                    const templateKeys = Object.keys(factories);
                    const cards = templateKeys.map(key => O.f({
                        card: Internal.getCard(card => (card.title === templates[key].name)),
                        position: templates[key].position
                    })).filter(pair => (pair.card !== null));
                    if (cards.length < templateKeys.length) {
                        return;
                    }
                    const fullCardset = cards.sort((a, b) => (a.position - b.position)).map(pair => pair.card);
                    for (const card of fullCardset) {
                        eraseCard(card);
                        card.title = card.keys;
                    }
                    storyCards.splice(newCardIndex(), 0, ...fullCardset);
                    return;
                }
            }
            function addAuxiliary(card, collection, extension) {
                collection.occupied.add(extension);
                card.title = card.keys = collection.template.title + " " + extension;
                collection.auxiliaries.push({card, extension});
                return;
            }
            return O.f(collections.map(({singleton, primary, auxiliaries}) => {
                if (singleton) {
                    return primary;
                } else {
                    return O.f({primary, auxiliaries: O.f(auxiliaries.map(({card}) => card))});
                }
            }));
        }
    } else if (AC.config.doAC) {
        // Auto-Cards is currently enabled
        // "text" represents the original text which was present before any scripts were executed
        // "TEXT" represents the script-modified version of "text" which AutoCards was called with
        // This dual scheme exists to ensure Auto-Cards is safely compatible with other scripts
        switch(HOOK) {
        case "input": {
            // AutoCards was called within the input modifier
            if ((AC.config.deleteAllAutoCards === false) && /CONFIRM\s*DELETE/i.test(TEXT)) {
                CODOMAIN.initialize("CONFIRM DELETE -> Success!");
            } else if (/\/\s*A\s*C/i.test(text)) {
                CODOMAIN.initialize(doPlayerCommands(text));
            } else if (TEXT.startsWith(" ") && readPastAction(0).text.endsWith("\n")) {
                // Just a simple little formatting bugfix for regular AID story actions
                CODOMAIN.initialize(getPrecedingNewlines() + TEXT.replace(/^\s+/, ""));
            } else {
                CODOMAIN.initialize(TEXT);
            }
            break; }
        case "context": {
            // AutoCards was called within the context modifier
            advanceChronometer();
            // Get or construct the "Configure Auto-Cards" story card
            const configureCardTemplate = getConfigureCardTemplate();
            const configureCard = getSingletonCard(true, configureCardTemplate);
            banTitle(configureCardTemplate.title);
            pinAndSortCards(configureCard);
            const bansOverwritten = (0 < AC.signal.overrideBans);
            if ((configureCard.description !== configureCardTemplate.description) || bansOverwritten) {
                const descConfigPatterns = (getConfigureCardDescription()
                    .split(Words.delimiter)
                    .slice(1)
                    .map(descPattern => (descPattern
                        .slice(0, descPattern.indexOf(":"))
                        .trim()
                        .replace(/\s+/g, "\\s*")
                    ))
                    .map(descPattern => (new RegExp("^\\s*" + descPattern + "\\s*:", "i")))
                );
                const descConfigs = configureCard.description.split(Words.delimiter).slice(1);
                if (
                    (descConfigs.length === descConfigPatterns.length)
                    && descConfigs.every((descConfig, index) => descConfigPatterns[index].test(descConfig))
                ) {
                    // All description config headers must be present and well-formed
                    let cfg = extractDescSetting(0);
                    if (AC.config.generationPrompt !== cfg) {
                        notify("Changes to your card generation prompt were successfully saved");
                        AC.config.generationPrompt = cfg;
                    }
                    cfg = extractDescSetting(1);
                    if (AC.config.compressionPrompt !== cfg) {
                        notify("Changes to your card memory compression prompt were successfully saved");
                        AC.config.compressionPrompt = cfg;
                    }
                    if (bansOverwritten) {
                        overrideBans();
                    } else if ((0 < AC.database.titles.pendingBans.length) || (0 < AC.database.titles.pendingUnbans.length)) {
                        const pendingBans = AC.database.titles.pendingBans.map(pair => pair[0]);
                        const pendingRewrites = new Set(
                            lowArr([...pendingBans, ...AC.database.titles.pendingUnbans.map(pair => pair[0])])
                        );
                        Internal.setBannedTitles([...pendingBans, ...extractDescSetting(2)
                            .split(",")
                            .filter(newBan => !pendingRewrites.has(newBan.toLowerCase().replace(/\s+/, " ").trim()))
                        ], true);
                    } else {
                        Internal.setBannedTitles(extractDescSetting(2).split(","), true);
                    }
                    function extractDescSetting(index) {
                        return descConfigs[index].replace(descConfigPatterns[index], "").trim();
                    }
                } else if (bansOverwritten) {
                    overrideBans();
                }
                configureCard.description = getConfigureCardDescription();
                function overrideBans() {
                    Internal.setBannedTitles(AC.database.titles.pendingBans.map(pair => pair[0]), true);
                    AC.signal.overrideBans = 0;
                    return;
                }
            }
            if (configureCard.entry !== configureCardTemplate.entry) {
                const oldConfig = {};
                const settings = O.f((function() {
                    const userSettings = extractSettings(configureCard.entry);
                    if (userSettings.resetallconfigsettingsandprompts !== true) {
                        return userSettings;
                    }
                    // Reset all config settings and display state change notifications only when appropriate
                    Object.assign(oldConfig, AC.config);
                    Object.assign(AC.config, getDefaultConfig());
                    AC.config.deleteAllAutoCards = oldConfig.deleteAllAutoCards;
                    AC.config.LSIv2 = oldConfig.LSIv2;
                    AC.config.defaultCardType = oldConfig.defaultCardType;
                    AC.database.titles.banned = getDefaultConfigBans();
                    configureCard.description = getConfigureCardDescription();
                    configureCard.entry = getConfigureCardEntry();
                    const defaultSettings = extractSettings(configureCard.entry);
                    if (
                        (S.DEFAULT_DO_AC === false)
                        || (userSettings.disableautocards === true)
                    ) {
                        defaultSettings.disableautocards = true;
                    }
                    notify("Restoring all settings and prompts to their default values");
                    return defaultSettings;
                })());
                O.f(oldConfig);
                if ((settings.deleteallautomaticstorycards === true) && (AC.config.deleteAllAutoCards === null)) {
                    AC.config.deleteAllAutoCards = true;
                } else if (settings.showdetailedguide === true) {
                    AC.signal.outputReplacement = Words.guide;
                }
                let cfg;
                if (parseConfig("pinthisconfigcardnearthetop", false, "pinConfigureCard")) {
                    if (cfg) {
                        pinAndSortCards(configureCard);
                        notify("The settings config card will now be pinned near the top of your story cards list");
                    } else {
                        const index = storyCards.indexOf(configureCard);
                        if (index !== -1) {
                            storyCards.splice(index, 1);
                            storyCards.push(configureCard);
                        }
                        notify("The settings config card will no longer be pinned near the top of your story cards list");
                    }
                }
                if (parseConfig("minimumturnscooldownfornewcards", true, "addCardCooldown")) {
                    const oldCooldown = AC.config.addCardCooldown;
                    AC.config.addCardCooldown = validateCooldown(cfg);
                    if (!isPendingGeneration() && !isAwaitingGeneration() && (0 < AC.generation.cooldown)) {
                        const quarterCooldown = validateCooldown(underQuarterInteger(AC.config.addCardCooldown));
                        if ((AC.config.addCardCooldown < oldCooldown) && (quarterCooldown < AC.generation.cooldown)) {
                            // Reduce the next generation's cooldown counter by a factor of 4
                            // But only if the new cooldown config is lower than it was before
                            // And also only if quarter cooldown is less than the current next gen cooldown
                            // (Just a random little user experience improvement)
                            AC.generation.cooldown = quarterCooldown;
                        } else if (oldCooldown < AC.config.addCardCooldown) {
                            if (oldCooldown === AC.generation.cooldown) {
                                AC.generation.cooldown = AC.config.addCardCooldown;
                            } else {
                                AC.generation.cooldown = validateCooldown(boundInteger(
                                    0,
                                    AC.generation.cooldown + quarterCooldown,
                                    AC.config.addCardCooldown
                                ));
                            }
                        }
                    }
                    switch(AC.config.addCardCooldown) {
                    case 9999: {
                        notify(
                            "You have disabled automatic card generation. To re-enable, simply set your cooldown config to any number lower than 9999. Or use the \"/ac\" in-game command to manually direct the card generation process"
                        );
                        break; }
                    case 1: {
                        notify(
                            "A new card will be generated during alternating game turns, but only if your story contains available titles"
                        );
                        break; }
                    case 0: {
                        notify(
                            "New cards will be immediately generated whenever valid titles exist within your recent story"
                        );
                        break; }
                    default: {
                        notify(
                            "A new card will be generated once every " + AC.config.addCardCooldown + " turns, but only if your story contains available titles"
                        );
                        break; }
                    }
                }
                if (parseConfig("newcardsuseabulletedlistformat", false, "bulletedListMode")) {
                    if (cfg) {
                        notify("New card entries will be generated using a bulleted list format");
                    } else {
                        notify("New card entries will be generated using a pure prose format");
                    }
                }
                if (parseConfig("maximumentrylengthfornewcards", true, "defaultEntryLimit")) {
                    AC.config.defaultEntryLimit = validateEntryLimit(cfg);
                    notify(
                        "New card entries will be limited to " + AC.config.defaultEntryLimit + " characters of generated text"
                    );
                }
                if (parseConfig("newcardsperformmemoryupdates", false, "defaultCardsDoMemoryUpdates")) {
                    if (cfg) {
                        notify("Newly constructed cards will begin with memory updates enabled by default");
                    } else {
                        notify("Newly constructed cards will begin with memory updates disabled by default");
                    }
                }
                if (parseConfig("cardmemorybankpreferredlength", true, "defaultMemoryLimit")) {
                    AC.config.defaultMemoryLimit = validateMemoryLimit(cfg);
                    notify(
                        "Newly constructed cards will begin with their memory bank length preference set to " + AC.config.defaultMemoryLimit + " characters of text"
                    );
                }
                if (parseConfig("memorysummarycompressionratio", true, "memoryCompressionRatio")) {
                    AC.config.memoryCompressionRatio = validateMemCompRatio(cfg);
                    notify(
                        "Freshly summarized card memory banks will be approximately " + (AC.config.memoryCompressionRatio / 10) + "x shorter than their originals"
                    );
                }
                if (parseConfig("excludeallcapsfromtitledetection", false, "ignoreAllCapsTitles")) {
                    if (cfg) {
                        notify("All-caps text will be ignored during title detection to help prevent bad cards");
                    } else {
                        notify("All-caps text may be considered during title detection processes");
                    }
                }
                if (parseConfig("alsodetecttitlesfromplayerinputs", false, "readFromInputs")) {
                    if (cfg) {
                        notify("Titles may be detected from player Do/Say/Story action inputs");
                    } else {
                        notify("Title detection will skip player Do/Say/Story action inputs for grammatical leniency");
                    }
                }
                if (parseConfig("minimumturnsagefortitledetection", true, "minimumLookBackDistance")) {
                    AC.config.minimumLookBackDistance = validateMLBD(cfg);
                    notify(
                        "Titles and names mentioned in your story may become eligible for future card generation attempts once they are at least " + AC.config.minimumLookBackDistance + " actions old"
                    );
                }
                cfg = settings.uselivescriptinterfacev2;
                if (typeof cfg === "boolean") {
                    if (AC.config.LSIv2 === null) {
                        if (cfg) {
                            AC.config.LSIv2 = true;
                            state.LSIv2 = AC;
                            AutoCards("initialize");
                            notify("Live Script Interface v2 is now embedded within your adventure!");
                        }
                    } else {
                        if (!cfg) {
                            AC.config.LSIv2 = null;
                            notify("Live Script Interface v2 has been removed from your adventure");
                        }
                    }
                }
                if (parseConfig("logdebugdatainaseparatecard" , false, "showDebugData")) {
                    if (data === null) {
                        if (cfg) {
                            notify("State may now be viewed within the \"Debug Data\" story card");
                        } else {
                            notify("The \"Debug Data\" story card has been removed");
                        }
                    } else if (cfg) {
                        notify("Debug data will be shared with the \"Critical Data\" story card to conserve memory");
                    } else {
                        notify("Debug mode has been disabled");
                    }
                }
                if ((settings.disableautocards === true) && (AC.signal.forceToggle !== true)) {
                    disableAutoCards();
                    break;
                } else {
                    // Apply the new card entry and proceed to implement Auto-Cards onContext
                    configureCard.entry = getConfigureCardEntry();
                }
                function parseConfig(settingsKey, isNumber, configKey) {
                    cfg = settings[settingsKey];
                    if (isNumber) {
                        return checkConfig("number");
                    } else if (!checkConfig("boolean")) {
                        return false;
                    }
                    AC.config[configKey] = cfg;
                    function checkConfig(type) {
                        return ((typeof cfg === type) && (
                            (notEmptyObj(oldConfig) && (oldConfig[configKey] !== cfg))
                            || (AC.config[configKey] !== cfg)
                        ));
                    }
                    return true;
                }
            }
            if (AC.signal.forceToggle === false) {
                disableAutoCards();
                break;
            }
            AC.signal.forceToggle = null;
            if (0 < AC.chronometer.postpone) {
                CODOMAIN.initialize(TEXT);
                break;
            }
            // Fully implement Auto-Cards onContext
            const forceStep = AC.signal.recheckRetryOrErase;
            const currentTurn = getTurn();
            const nearestUnparsedAction = boundInteger(0, currentTurn - AC.config.minimumLookBackDistance);
            if (AC.signal.recheckRetryOrErase || (nearestUnparsedAction <= AC.database.titles.lastActionParsed)) {
                // The player erased or retried an unknown number of actions
                // Purge recent candidates and perform a safety recheck
                if (nearestUnparsedAction <= AC.database.titles.lastActionParsed) {
                    AC.signal.recheckRetryOrErase = true;
                } else {
                    AC.signal.recheckRetryOrErase = false;
                }
                AC.database.titles.lastActionParsed = boundInteger(-1, nearestUnparsedAction - 8);
                for (let i = AC.database.titles.candidates.length - 1; 0 <= i; i--) {
                    const candidate = AC.database.titles.candidates[i];
                    for (let j = candidate.length - 1; 0 < j; j--) {
                        if (AC.database.titles.lastActionParsed < candidate[j]) {
                            candidate.splice(j, 1);
                        }
                    }
                    if (candidate.length <= 1) {
                        AC.database.titles.candidates.splice(i, 1);
                    }
                }
            }
            const pendingCandidates = new Map();
            if ((0 < nearestUnparsedAction) && (AC.database.titles.lastActionParsed < nearestUnparsedAction)) {
                const actions = [];
                for (
                    let actionToParse = AC.database.titles.lastActionParsed + 1;
                    actionToParse <= nearestUnparsedAction;
                    actionToParse++
                ) {
                    // I wrote this whilst sleep-deprived, somehow it works
                    const lookBack = currentTurn - actionToParse - (function() {
                        if (isDoSayStory(readPastAction(0).type)) {
                            // Inputs count as 2 actions instead of 1, conditionally offset lookBack by 1
                            return 0;
                        } else {
                            return 1;
                        }
                    })();
                    if (history.length <= lookBack) {
                        // history cannot be indexed with a negative integer
                        continue;
                    }
                    const action = readPastAction(lookBack);
                    const thisTextHash = new StringsHashed(4096).add(action.text).serialize();
                    if (actionToParse === nearestUnparsedAction) {
                        if (AC.signal.recheckRetryOrErase || (thisTextHash === AC.database.titles.lastTextHash)) {
                            // Additional safety to minimize duplicate candidate additions during retries or erases
                            AC.signal.recheckRetryOrErase = true;
                            break;
                        } else {
                            // Action parsing will proceed
                            AC.database.titles.lastActionParsed = nearestUnparsedAction;
                            AC.database.titles.lastTextHash = thisTextHash;
                        }
                    } else if (
                        // Special case where a consecutive retry>erase>continue cancels out
                        AC.signal.recheckRetryOrErase
                        && (actionToParse === (nearestUnparsedAction - 1))
                        && (thisTextHash === AC.database.titles.lastTextHash)
                    ) {
                        AC.signal.recheckRetryOrErase = false;
                    }
                    actions.push([action, actionToParse]);
                }
                if (!AC.signal.recheckRetryOrErase) {
                    for (const [action, turn] of actions) {
                        if (
                            (action.type === "see")
                            || (action.type === "unknown")
                            || (!AC.config.readFromInputs && isDoSayStory(action.type))
                            || /^[^\p{Lu}]*$/u.test(action.text)
                            || action.text.includes("<<<")
                            || /\/\s*A\s*C/i.test(action.text)
                            || /CONFIRM\s*DELETE/i.test(action.text)
                        ) {
                            // Skip see actions
                            // Skip input actions (only if input title detection has been disabled in the config)
                            // Skip strings without capital letters
                            // Skip utility actions
                            continue;
                        }
                        const words = (prettifyEmDashes(action.text)
                            // Inner Self
                            .replace(/\s*[\u200B-\u200D][\s\u200B-\u200D]*/g, " ")
                            // Localized Languages
                            .replace(/\s*[–«»„“”「」—]\s*/g, ": ")
                            .replace(/(?:^|\s+)-/g, ": ").replace(/-(?:\s+|$)/g, ": ")
                            .replace(/[‘’]/g, "'").replaceAll("´", "`")
                            // Standardize end punctuation
                            .replaceAll("。", ".").replaceAll("？", "?").replaceAll("！", "!")
                            // Replace special clause opening punctuation with colon ":" terminators
                            .replace(/(^|\s+)["'`]\s*/g, ": ").replace(/\s*[\(\[{]\s*/g, ": ")
                            // Likewise for end-quotes (curbs a common AI grammar mistake)
                            .replace(/\s*,?\s*["'`](?:\s+|$)/g, ": ")
                            // Replace funky wunky symbols with regular spaces
                            .replace(/[؟،¿¡…§，、\*_~><\)\]}#"`\s]/g, " ")
                            // Replace some mid-sentence punctuation symbols with a placeholder word
                            .replace(/\s*[;,\/\\]\s*/g, " %@% ")
                            // Replace "I", "I'm", "I'd", "I'll", and "I've" with a placeholder word
                            .replace(/(?:^|\s+|-)I(?:'(?:m|d|ll|ve))?(?:\s+|-|$)/gi, " %@% ")
                            // Remove "'s" only if not followed by a letter
                            .replace(/'s(?![a-zA-Z])/g, "")
                            // Replace "s'" with "s" only if preceded but not followed by a letter
                            .replace(/(?<=[a-zA-Z])s'(?![a-zA-Z])/g, "s")
                            // Remove apostrophes not between letters (preserve contractions like "don't")
                            .replace(/(?<![a-zA-Z])'(?![a-zA-Z])/g, "")
                            // Remove a leading bullet
                            .replace(/^\s*-+\s*/, "")
                            // Replace common honorifics with a placeholder word
                            .replace(buildKiller(Words.honorifics), " %@% ")
                            // Remove common abbreviations
                            .replace(buildKiller(Words.abbreviations), " ")
                            // Fix end punctuation
                            .replace(/\s+\.(?![a-zA-Z])/g, ".").replace(/\.\.+/g, ".")
                            .replace(/\s+\?(?![a-zA-Z])/g, "?").replace(/\?\?+/g, "?")
                            .replace(/\s+!(?![a-zA-Z])/g, "!").replace(/!!+/g, "!")
                            .replace(/\s+:(?![a-zA-Z])/g, ":").replace(/::+/g, ":")
                            // Colons are treated as substitute end-punctuation, apply the capitalization rule
                            .replace(/:\s+(\S)/g, (_, next) => ": " + next.toUpperCase())
                            // Condense consecutive whitespace
                            .trim().replace(/\s+/g, " ")
                        ).split(" ");
                        if (!Array.isArray(words) || (words.length < 2)) {
                            continue;
                        }
                        const titles = [];
                        const incompleteTitle = [];
                        let previousWordTerminates = true;
                        for (let i = 0; i < words.length; i++) {
                            let word = words[i];
                            if (startsWithTerminator()) {
                                // This word begins on a terminator, push the preexisting incomplete title to titles and proceed with the next sentence's beginning
                                pushTitle();
                                previousWordTerminates = true;
                                // Ensure no leading terminators remain
                                while ((word !== "") && startsWithTerminator()) {
                                    word = word.slice(1);
                                }
                            }
                            if (word === "") {
                                continue;
                            } else if (previousWordTerminates) {
                                // We cannot detect titles from sentence beginnings due to sentence capitalization rules. The previous sentence was recently terminated, implying the current series of capitalized words (plus lowercase minor words) occurs near the beginning of the current sentence
                                if (endsWithTerminator()) {
                                    continue;
                                } else if (startsWithUpperCase()) {
                                    if (isMinorWord(word)) {
                                        // Special case where a capitalized minor word precedes a named entity, clear the previous termination status
                                        previousWordTerminates = false;
                                    }
                                    // Otherwise, proceed without clearing
                                } else if (!isMinorWord(word) && !/^(?:and|&)(?:$|[\.\?!:]$)/.test(word)) {
                                    // Previous sentence termination status is cleared by the first new non-minor lowercase word encountered during forward iteration through the action text's words
                                    previousWordTerminates = false;
                                }
                                continue;
                            }
                            // Words near the beginning of this sentence have been skipped, proceed with named entity detection using capitalization rules. An incomplete title will be pushed to titles if A) a non-minor lowercase word is encountered, B) three consecutive minor words occur in a row, C) a terminator symbol is encountered at the end of a word. Otherwise, continue pushing words to the incomplete title
                            if (endsWithTerminator()) {
                                previousWordTerminates = true;
                                while ((word !== "") && endsWithTerminator()) {
                                    word = word.slice(0, -1);
                                }
                                if (word === "") {
                                    pushTitle();
                                    continue;
                                }
                            }
                            if (isMinorWord(word)) {
                                if (0 < incompleteTitle.length) {
                                    // Titles cannot start with a minor word
                                    if (
                                        (2 < incompleteTitle.length) && !(isMinorWord(incompleteTitle[incompleteTitle.length - 1]) && isMinorWord(incompleteTitle[incompleteTitle.length - 2]))
                                    ) {
                                        // Titles cannot have 3 or more consecutive minor words in a row
                                        pushTitle();
                                        continue;
                                    } else {
                                        // Titles may contain minor words in their middles. Ex: "Ace of Spades"
                                        incompleteTitle.push(word.toLowerCase());
                                    }
                                }
                            } else if (startsWithUpperCase()) {
                                // Add this proper noun to the incomplete title
                                incompleteTitle.push(word);
                            } else {
                                // The full title has a non-minor lowercase word to its immediate right
                                pushTitle();
                                continue;
                            }
                            if (previousWordTerminates) {
                                pushTitle();
                            }
                            function pushTitle() {
                                while (
                                    (1 < incompleteTitle.length)
                                    && isMinorWord(incompleteTitle[incompleteTitle.length - 1])
                                ) {
                                    incompleteTitle.pop();
                                }
                                if (0 < incompleteTitle.length) {
                                    titles.push(incompleteTitle.join(" "));
                                    // Empty the array
                                    incompleteTitle.length = 0;
                                }
                                return;
                            }
                            function isMinorWord(testWord) {
                                return Words.minor.includes(testWord.toLowerCase());
                            }
                            function startsWithUpperCase() {
                                return /^\p{Lu}/u.test(word);
                            }
                            function startsWithTerminator() {
                                return /^[\.\?!:]/.test(word);
                            }
                            function endsWithTerminator() {
                                return /[\.\?!:]$/.test(word);
                            }
                        }
                        for (let i = titles.length - 1; 0 <= i; i--) {
                            titles[i] = formatTitle(titles[i]).newTitle;
                            if (titles[i] === "" || (
                                AC.config.ignoreAllCapsTitles
                                && (2 < titles[i].replace(/[^a-zA-Z]/g, "").length)
                                && (titles[i] === titles[i].toUpperCase())
                            )) {
                                titles.splice(i, 1);
                            }
                        }
                        // Remove duplicates
                        const uniqueTitles = [...new Set(titles)];
                        if (uniqueTitles.length === 0) {
                            continue;
                        } else if (
                            // No reason to keep checking long past the max lookback distance
                            (currentTurn < 256)
                            && (action.type === "start")
                            // This is only used here so it doesn't need its own AC.config property or validation
                            && (S.DEFAULT_BAN_TITLES_FROM_OPENING !== false)
                        ) {
                            // Titles in the opening prompt are banned by default, hopefully accounting for the player character's name and other established setting details
                            uniqueTitles.forEach(title => banTitle(title));
                        } else {
                            // Schedule new titles for later insertion within the candidates database
                            for (const title of uniqueTitles) {
                                const pendingHashKey = title.toLowerCase();
                                if (pendingCandidates.has(pendingHashKey)) {
                                    // Consolidate pending candidates with matching titles but different turns
                                    pendingCandidates.get(pendingHashKey).turns.push(turn);
                                } else {
                                    pendingCandidates.set(pendingHashKey, O.s({title, turns: [turn]}));
                                }
                            }
                        }
                        function buildKiller(words) {
                            return (new RegExp(("(?:^|\\s+|-)(?:" + (words
                                .map(word => word.replace(".", "\\."))
                                .join("|")
                            ) + ")(?:\\s+|-|$)"), "gi"));
                        }
                    }
                }
            }
            // Measure the minimum and maximum turns of occurance for all title candidates
            let minTurn = currentTurn;
            let maxTurn = 0;
            for (let i = AC.database.titles.candidates.length - 1; 0 <= i; i--) {
                const candidate = AC.database.titles.candidates[i];
                const title = candidate[0];
                if (isUsedOrBanned(title) || isNamed(title)) {
                    // Retroactively ensure AC.database.titles.candidates contains no used / banned titles
                    AC.database.titles.candidates.splice(i, 1);
                } else {
                    const pendingHashKey = title.toLowerCase();
                    if (pendingCandidates.has(pendingHashKey)) {
                        // This candidate title matches one of the pending candidates, collect the pending turns
                        candidate.push(...pendingCandidates.get(pendingHashKey).turns);
                        // Remove this pending candidate
                        pendingCandidates.delete(pendingHashKey);
                    }
                    if (2 < candidate.length) {
                        // Ensure all recorded turns of occurance are unique for this candidate
                        // Sort the turns from least to greatest
                        const sortedTurns = [...new Set(candidate.slice(1))].sort((a, b) => (a - b));
                        if (625 < sortedTurns.length) {
                            sortedTurns.splice(0, sortedTurns.length - 600);
                        }
                        candidate.length = 1;
                        candidate.push(...sortedTurns);
                    }
                    setCandidateTurnBounds(candidate);
                }
            }
            for (const pendingCandidate of pendingCandidates.values()) {
                // Insert any remaining pending candidates (validity has already been ensured)
                const newCandidate = [pendingCandidate.title, ...pendingCandidate.turns];
                setCandidateTurnBounds(newCandidate);
                AC.database.titles.candidates.push(newCandidate);
            }
            const isCandidatesSorted = (function() {
                if (425 < AC.database.titles.candidates.length) {
                    // Sorting a large title candidates database is computationally expensive
                    sortCandidates();
                    AC.database.titles.candidates.splice(400);
                    // Flag this operation as complete for later consideration
                    return true;
                } else {
                    return false;
                }
            })();
            Internal.getUsedTitles();
            for (const titleKey in AC.database.memories.associations) {
                if (isAuto(titleKey)) {
                    // Reset the lifespan counter
                    AC.database.memories.associations[titleKey][0] = 999;
                } else if (AC.database.memories.associations[titleKey][0] < 1) {
                    // Forget this set of memory associations
                    delete AC.database.memories.associations[titleKey];
                } else if (!isAwaitingGeneration()) {
                    // Decrement the lifespan counter
                    AC.database.memories.associations[titleKey][0]--;
                }
            }
            // This copy of TEXT may be mutated
            let context = TEXT;
            const titleHeaderPatternGlobal = /\s*{\s*titles?\s*:\s*([\s\S]*?)\s*}\s*/gi;
            // Card events govern the parsing of memories from raw context as well as card memory bank injection
            const cardEvents = (function() {
                // Extract memories from the initial text (not TEXT as called from within the context modifier!)
                const contextMemories = (function() {
                    const memoriesMatch = text.match(/Memories\s*:\s*([\s\S]*?)\s*(?:Recent\s*Story\s*:|$)/i);
                    if (!memoriesMatch) {
                        return new Set();
                    }
                    const uniqueMemories = new Set(isolateMemories(memoriesMatch[1]));
                    if (uniqueMemories.size === 0) {
                        return uniqueMemories;
                    }
                    const duplicatesHashed = StringsHashed.deserialize(AC.database.memories.duplicates, 65536);
                    const duplicateMemories = new Set();
                    const seenMemories = new Set();
                    for (const memoryA of uniqueMemories) {
                        if (duplicatesHashed.has(memoryA)) {
                            // Remove to ensure the insertion order for this duplicate changes
                            duplicatesHashed.remove(memoryA);
                            duplicateMemories.add(memoryA);
                        } else if ((function() {
                            for (const memoryB of seenMemories) {
                                if (0.42 < similarityScore(memoryA, memoryB)) {
                                    // This memory is too similar to another memory
                                    duplicateMemories.add(memoryA);
                                    return false;
                                }
                            }
                            return true;
                        })()) {
                            seenMemories.add(memoryA);
                        }
                    }
                    if (0 < duplicateMemories.size) {
                        // Add each near duplicate's hashcode to AC.database.memories.duplicates
                        // Then remove duplicates from uniqueMemories and the context window
                        for (const duplicate of duplicateMemories) {
                            duplicatesHashed.add(duplicate);
                            uniqueMemories.delete(duplicate);
                            context = context.replaceAll("\n" + duplicate, "");
                        }
                        // Only the 2000 most recent duplicate memory hashcodes are remembered
                        AC.database.memories.duplicates = duplicatesHashed.latest(2000).serialize();
                    }
                    return uniqueMemories;
                })();
                const leftBoundary = "^|\\s|\"|'|—|\\(|\\[|{";
                const rightBoundary = "\\s|\\.|\\?|!|,|;|\"|'|—|\\)|\\]|}|$";
                // Murder, homicide if you will, nothing to see here
                const theKiller = new RegExp("(?:" + leftBoundary + ")the[\\s\\S]*$", "i");
                const peerageKiller = new RegExp((
                    "(?:" + leftBoundary + ")(?:" + Words.peerage.join("|") + ")(?:" + rightBoundary + ")"
                ), "gi");
                const events = new Map();
                for (const contextMemory of contextMemories) {
                    for (const titleKey of auto) {
                        if (!(new RegExp((
                            "(?<=" + leftBoundary + ")" + (titleKey
                                .replace(theKiller, "")
                                .replace(peerageKiller, "")
                                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                            ) + "(?=" + rightBoundary + ")"
                        ), "i")).test(contextMemory)) {
                            continue;
                        }
                        // AC card titles found in active memories will promote card events
                        if (events.has(titleKey)) {
                            events.get(titleKey).pendingMemories.push(contextMemory);
                            continue;
                        }
                        events.set(titleKey, O.s({
                            pendingMemories: [contextMemory],
                            titleHeader: ""
                        }));
                    }
                }
                const titleHeaderMatches = [...context.matchAll(titleHeaderPatternGlobal)];
                for (const [titleHeader, title] of titleHeaderMatches) {
                    if (!isAuto(title)) {
                        continue;
                    }
                    // Unique title headers found in context will promote card events
                    const titleKey = title.toLowerCase();
                    if (events.has(titleKey)) {
                        events.get(titleKey).titleHeader = titleHeader;
                        continue;
                    }
                    events.set(titleKey, O.s({
                        pendingMemories: [],
                        titleHeader: titleHeader
                    }));
                }
                return events;
            })();
            // Remove auto card title headers from active story card entries and contextualize their respective memory banks
            // Also handle the growth and maintenance of card memory banks
            let isRemembering = false;
            for (const card of storyCards) {
                // Iterate over each card to handle pending card events and forenames/surnames
                const titleHeaderMatcher = /^{title: \s*([\s\S]*?)\s*}/;
                let breakForCompression = isPendingCompression();
                let simplifications = 0;
                if (breakForCompression) {
                    break;
                } else if (!card.entry.startsWith("{title: ")) {
                    continue;
                } else if (exceedsMemoryLimit()) {
                    const titleHeaderMatch = card.entry.match(titleHeaderMatcher);
                    if (titleHeaderMatch && isAuto(titleHeaderMatch[1])) {
                        prepareMemoryCompression(titleHeaderMatch[1].toLowerCase());
                        break;
                    }
                }
                // Handle card events
                const lowerEntry = card.entry.toLowerCase();
                for (const titleKey of cardEvents.keys()) {
                    if (!lowerEntry.startsWith("{title: " + titleKey + "}")) {
                        continue;
                    }
                    const cardEvent = cardEvents.get(titleKey);
                    if (
                        (0 < cardEvent.pendingMemories.length)
                        && /{\s*updates?\s*:\s*true\s*,\s*limits?\s*:[\s\S]*?}/i.test(card.description)
                    ) {
                        // Add new card memories
                        const associationsHashed = (function() {
                            if (titleKey in AC.database.memories.associations) {
                                return StringsHashed.deserialize(AC.database.memories.associations[titleKey][1], 65536);
                            } else {
                                AC.database.memories.associations[titleKey] = [999, ""];
                                return new StringsHashed(65536);
                            }
                        })();
                        const oldMemories = isolateMemories(extractCardMemories().text);
                        for (let i = 0; i < cardEvent.pendingMemories.length; i++) {
                            if (associationsHashed.has(cardEvent.pendingMemories[i])) {
                                // Remove first to alter the insertion order
                                associationsHashed.remove(cardEvent.pendingMemories[i]);
                            } else if (!oldMemories.some(oldMemory => (
                                (0.8 < similarityScore(oldMemory, cardEvent.pendingMemories[i]))
                            ))) {
                                // Ensure no near-duplicate memories are appended
                                card.description += "\n- " + cardEvent.pendingMemories[i];
                            }
                            associationsHashed.add(cardEvent.pendingMemories[i]);
                        }
                        AC.database.memories.associations[titleKey][1] = associationsHashed.latest(3500).serialize();
                        if (associationsHashed.size() === 0) {
                            delete AC.database.memories.associations[titleKey];
                        }
                        if (exceedsMemoryLimit()) {
                            breakForCompression = prepareMemoryCompression(titleKey);
                            break;
                        }
                    }
                    if (cardEvent.titleHeader !== "") {
                        // Replace this card's title header in context
                        const cardMemoriesText = extractCardMemories().text;
                        if (cardMemoriesText === "") {
                            // This card contains no card memories to contextualize
                            context = context.replace(cardEvent.titleHeader, "\n\n");
                        } else {
                            // Insert card memories within context and ensure they occur uniquely
                            const cardMemories = cardMemoriesText.split("\n").map(cardMemory => cardMemory.trim());
                            for (const cardMemory of cardMemories) {
                                if (25 < cardMemory.length) {
                                    context = (context
                                        .replaceAll(cardMemory, "<#>")
                                        .replaceAll(cardMemory.replace(/^-+\s*/, ""), "<#>")
                                    );
                                }
                            }
                            context = context.replace(cardEvent.titleHeader, (
                                "\n\n{%@MEM@%" + cardMemoriesText + "%@MEM@%}\n"
                            ));
                            isRemembering = true;
                        }
                    }
                    cardEvents.delete(titleKey);
                    break;
                }
                if (breakForCompression) {
                    break;
                } else if ((2 < simplifications) || (card.entry.includes("<") && card.entry.includes(">"))) {
                    continue;
                }
                // Simplify auto-card titles which contain an obvious surname
                const titleHeaderMatch = card.entry.match(titleHeaderMatcher);
                if (!titleHeaderMatch) {
                    continue;
                }
                const [oldTitleHeader, oldTitle] = titleHeaderMatch;
                if (!isAuto(oldTitle)) {
                    continue;
                }
                const surname = isNamed(oldTitle, true);
                if (typeof surname !== "string") {
                    continue;
                }
                const newTitle = oldTitle.replace(" " + surname, "");
                const [oldTitleKey, newTitleKey] = [oldTitle, newTitle].map(title => title.toLowerCase());
                if (oldTitleKey === newTitleKey) {
                    continue;
                }
                // Preemptively mitigate some global state considered within the formatTitle scope
                clearTransientTitles();
                AC.database.titles.used = ["%@%"];
                [used, forenames, surnames].forEach(nameset => nameset.add("%@%"));
                // Premature optimization is the root of all evil
                const newKey = formatTitle(newTitle).newKey;
                clearTransientTitles();
                simplifications++;
                if (newKey === "") {
                    Internal.getUsedTitles();
                    continue;
                }
                if (oldTitleKey in AC.database.memories.associations) {
                    AC.database.memories.associations[newTitleKey] = AC.database.memories.associations[oldTitleKey];
                    delete AC.database.memories.associations[oldTitleKey];
                }
                if (AC.compression.titleKey === oldTitleKey) {
                    AC.compression.titleKey = newTitleKey;
                }
                card.entry = card.entry.replace(oldTitleHeader, oldTitleHeader.replace(oldTitle, newTitle));
                card.keys = buildKeys(card.keys.replaceAll(" " + surname, ""), newKey);
                Internal.getUsedTitles();
                function exceedsMemoryLimit() {
                    return ((function() {
                        const memoryLimitMatch = card.description.match(/limits?\s*:\s*(\d+)\s*}/i);
                        if (memoryLimitMatch) {
                            return validateMemoryLimit(parseInt(memoryLimitMatch[1], 10));
                        } else {
                            return AC.config.defaultMemoryLimit;
                        }
                    })() < (function() {
                        const cardMemories = extractCardMemories();
                        if (cardMemories.missing) {
                            return card.description;
                        } else {
                            return cardMemories.text;
                        }
                    })().length);
                }
                function prepareMemoryCompression(titleKey) {
                    AC.compression.oldMemoryBank = isolateMemories(extractCardMemories().text);
                    if (AC.compression.oldMemoryBank.length === 0) {
                        return false;
                    }
                    AC.compression.completed = 0;
                    AC.compression.titleKey = titleKey;
                    AC.compression.vanityTitle = cleanSpaces(card.title.trim());
                    AC.compression.responseEstimate = (function() {
                        const responseEstimate = estimateResponseLength();
                        if (responseEstimate === -1) {
                            return 1400
                        } else {
                            return responseEstimate;
                        }
                    })();
                    AC.compression.lastConstructIndex = -1;
                    AC.compression.newMemoryBank = [];
                    return true;
                }
                function extractCardMemories() {
                    const memoryHeaderMatch = card.description.match(
                        /(?<={\s*updates?\s*:[\s\S]*?,\s*limits?\s*:[\s\S]*?})[\s\S]*$/i
                    );
                    if (memoryHeaderMatch) {
                        return O.f({missing: false, text: cleanSpaces(memoryHeaderMatch[0].trim())});
                    } else {
                        return O.f({missing: true, text: ""});
                    }
                }
            }
            // Remove repeated memories plus any remaining title headers
            context = (context
                .replace(/(\s*<#>\s*)+/g, "\n")
                .replace(titleHeaderPatternGlobal, "\n\n")
                .replace(/World\s*Lore\s*:\s*/i, "World Lore:\n")
                .replace(/Memories\s*:\s*(?=Recent\s*Story\s*:|$)/i, "")
            );
            // Prompt the AI to generate a new card entry, compress an existing card's memories, or continue the story
            let isGenerating = false;
            let isCompressing = false;
            if (isPendingGeneration()) {
                promptGeneration();
            } else if (isAwaitingGeneration()) {
                AC.generation.workpiece = AC.generation.pending.shift();
                promptGeneration();
            } else if (isPendingCompression()) {
                promptCompression();
            } else if (AC.signal.recheckRetryOrErase) {
                // Do nothing 😜
            } else if ((AC.generation.cooldown <= 0) && (0 < AC.database.titles.candidates.length)) {
                // Prepare to automatically construct a new plot-relevant story card by selecting a title
                let selectedTitle = (function() {
                    if (AC.database.titles.candidates.length === 1) {
                        return AC.database.titles.candidates[0][0];
                    } else if (!isCandidatesSorted) {
                        sortCandidates();
                    }
                    const mostRelevantTitle = AC.database.titles.candidates[0][0];
                    if ((AC.database.titles.candidates.length < 16) || (Math.random() < 0.6667)) {
                        // Usually, 2/3 of the time, the most relevant title is selected
                        return mostRelevantTitle;
                    }
                    // Occasionally (1/3 of the time once the candidates databases has at least 16 titles) make a completely random selection between the top 4 most recently occuring title candidates which are NOT the top 2 most relevant titles. Note that relevance !== recency
                    // This gives non-character titles slightly better odds of being selected for card generation due to the relevance sorter's inherent bias towards characters; they tend to appear far more often in prose
                    return (AC.database.titles.candidates
                        // Create a shallow copy to avoid modifying AC.database.titles.candidates itself
                        // Add index to preserve original positions whenever ties occur during sorting
                        .map((candidate, index) => ({candidate, index}))
                        // Sort by each candidate's most recent turn
                        .sort((a, b) => {
                            const turnDiff = b.candidate[b.candidate.length - 1] - a.candidate[a.candidate.length - 1];
                            if (turnDiff === 0) {
                                // Don't change indices in the case of a tie
                                return (a.index - b.index);
                            } else {
                                // No tie here, sort by recency
                                return turnDiff;
                            }
                        })
                        // Get the top 6 most recent titles (4 + 2 because the top 2 relevant titles may be present)
                        .slice(0, 6)
                        // Extract only the title names
                        .map(element => element.candidate[0])
                        // Exclude the top 2 most relevant titles
                        .filter(title => ((title !== mostRelevantTitle) && (title !== AC.database.titles.candidates[1][0])))
                        // Ensure only 4 titles remain
                        .slice(0, 4)
                    )[Math.floor(Math.random() * 4)];
                })();
                while (!Internal.generateCard(O.f({title: selectedTitle}))) {
                    // This is an emergency precaution, I don't expect the interior of this while loop to EVER execute
                    // That said, it's crucial for the while condition be checked at least once, because Internal.generateCard appends an element to AC.generation.pending as a side effect
                    const lowerSelectedTitle = formatTitle(selectedTitle).newTitle.toLowerCase();
                    const index = AC.database.titles.candidates.findIndex(candidate => {
                        return (formatTitle(candidate[0]).newTitle.toLowerCase() === lowerSelectedTitle);
                    });
                    if (index === -1) {
                        // Should be impossible
                        break;
                    }
                    AC.database.titles.candidates.splice(index, 1);
                    if (AC.database.titles.candidates.length === 0) {
                        break;
                    }
                    selectedTitle = AC.database.titles.candidates[0][0];
                }
                if (isAwaitingGeneration()) {
                    // Assign the workpiece so card generation may fully commence!
                    AC.generation.workpiece = AC.generation.pending.shift();
                    promptGeneration();
                } else if (isPendingCompression()) {
                    promptCompression();
                }
            } else if (
                (AC.chronometer.step || forceStep)
                && (0 < AC.generation.cooldown)
                && (AC.config.addCardCooldown !== 9999)
            ) {
                AC.generation.cooldown--;
            }
            if (shouldTrimContext()) {
                // Truncate context based on AC.signal.maxChars, begin by individually removing the oldest sentences from the recent story portion of the context window
                const recentStoryPattern = /Recent\s*Story\s*:\s*([\s\S]*?)(%@GEN@%|%@COM@%|\s\[\s*Author's\s*note\s*:|$)/i;
                const recentStoryMatch = context.match(recentStoryPattern);
                if (recentStoryMatch) {
                    const recentStory = recentStoryMatch[1];
                    let sentencesJoined = recentStory;
                    // Split by the whitespace chars following each sentence (without consuming)
                    const sentences = splitBySentences(recentStory);
                    // [minimum num of story sentences] = ([max chars for context] / 6) / [average chars per sentence]
                    const sentencesMinimum = Math.ceil(
                        (AC.signal.maxChars / 6) / (
                            boundInteger(1, context.length) / boundInteger(1, sentences.length)
                        )
                    ) + 1;
                    do {
                        if (sentences.length < sentencesMinimum) {
                            // A minimum of n many recent story sentences must remain
                            // Where n represents a sentence count equal to roughly 16.7% of the full context chars
                            break;
                        }
                        // Remove the first (oldest) recent story sentence
                        sentences.shift();
                        // Check if the total length exceeds the AC.signal.maxChars limit
                        sentencesJoined = sentences.join("");
                    } while (AC.signal.maxChars < (context.length - recentStory.length + sentencesJoined.length + 3));
                    // Rebuild the context with the truncated recentStory
                    context = context.replace(recentStoryPattern, "Recent Story:\n" + sentencesJoined + recentStoryMatch[2]);
                }
                if (isRemembering && shouldTrimContext()) {
                    // Next remove loaded card memories (if any) with top-down priority, one card at a time
                    do {
                        // This matcher relies on its case-sensitivity
                        const cardMemoriesMatch = context.match(/{%@MEM@%([\s\S]+?)%@MEM@%}/);
                        if (!cardMemoriesMatch) {
                            break;
                        }
                        context = context.replace(cardMemoriesMatch[0], (cardMemoriesMatch[0]
                            .replace(cardMemoriesMatch[1], "")
                            // Set the MEM tags to lowercase to avoid repeated future matches
                            .toLowerCase()
                        ));
                    } while (AC.signal.maxChars < (context.length + 3));
                }
                if (shouldTrimContext()) {
                    // If the context is still too long, just trim from the beginning I guess 🤷‍♀️
                    context = context.slice(context.length - AC.signal.maxChars + 1);
                }
            }
            if (isRemembering) {
                // Card memory flags serve no further purpose
                context = (context
                    // Case-insensitivity is crucial here
                    .replace(/(?<={%@MEM@%)\s*/gi, "")
                    .replace(/\s*(?=%@MEM@%})/gi, "")
                    .replace(/{%@MEM@%%@MEM@%}\s?/gi, "")
                    .replaceAll("{%@MEM@%", "{ Memories:\n")
                    .replaceAll("%@MEM@%}", " }")
                );
            }
            if (isGenerating || isCompressing) {
                state.InnerSelf ??= {};
                state.InnerSelf.AC ??= {};
                state.InnerSelf.AC.event = true;
                if (isGenerating) {
                    // Likewise for the card entry generation delimiter
                    context = context.replaceAll("%@GEN@%", "");
                } else {
                    // Or the (mutually exclusive) card memory compression delimiter
                    context = context.replaceAll("%@COM@%", "");
                }
            }
            CODOMAIN.initialize(context);
            function isolateMemories(memoriesText) {
                return (memoriesText
                    .split("\n")
                    .map(memory => cleanSpaces(memory.trim().replace(/^-+\s*/, "")))
                    .filter(memory => (memory !== ""))
                );
            }
            function isAuto(title) {
                return auto.has(title.toLowerCase());
            }
            function promptCompression() {
                isGenerating = false;
                const cardEntryText = (function() {
                    const card = getAutoCard(AC.compression.titleKey);
                    if (card === null) {
                        return null;
                    }
                    const entryLines = formatEntry(card.entry).trimEnd().split("\n");
                    if (Object.is(entryLines[0].trim(), "")) {
                        return "";
                    }
                    for (let i = 0; i < entryLines.length; i++) {
                        entryLines[i] = entryLines[i].trim();
                        if (/[a-zA-Z]$/.test(entryLines[i])) {
                            entryLines[i] += ".";
                        }
                        entryLines[i] += " ";
                    }
                    return entryLines.join("");
                })();
                if (cardEntryText === null) {
                    // Safety measure
                    resetCompressionProperties();
                    return;
                }
                repositionAN();
                // The "%COM%" substring serves as a temporary delimiter for later context length trucation
                context = context.trimEnd() + "\n\n" + cardEntryText + (
                    [...AC.compression.newMemoryBank, ...AC.compression.oldMemoryBank].join(" ")
                ) + "%@COM@%\n\n" + (function() {
                    const memoryConstruct = (function() {
                        if (AC.compression.lastConstructIndex === -1) {
                            for (let i = 0; i < AC.compression.oldMemoryBank.length; i++) {
                                AC.compression.lastConstructIndex = i;
                                const memoryConstruct = buildMemoryConstruct();
                                if ((
                                    (AC.config.memoryCompressionRatio / 10) * AC.compression.responseEstimate
                                ) < memoryConstruct.length) {
                                    return memoryConstruct;
                                }
                            }
                        } else {
                            // The previous card memory compression attempt produced a bad output
                            AC.compression.lastConstructIndex = boundInteger(
                                0, AC.compression.lastConstructIndex + 1, AC.compression.oldMemoryBank.length - 1
                            );
                        }
                        return buildMemoryConstruct();
                    })();
                    // Fill all %{title} placeholders
                    const precursorPrompt = insertTitle(AC.config.compressionPrompt, AC.compression.vanityTitle).trim();
                    const memoryPlaceholderPattern = /(?:[%\$]+\s*|[%\$]*){+\s*memor(y|ies)\s*}+/gi;
                    if (memoryPlaceholderPattern.test(precursorPrompt)) {
                        // Fill all %{memory} placeholders with a selection of pending old memories
                        return precursorPrompt.replace(memoryPlaceholderPattern, memoryConstruct);
                    } else {
                        // Append the partial entry to the end of context
                        return precursorPrompt + "\n\n" + memoryConstruct;
                    }
                })() + "\n\n";
                isCompressing = true;
                return;
            }
            function promptGeneration() {
                repositionAN();
                // All %{title} placeholders were already filled during this workpiece's initialization
                // The "%GEN%" substring serves as a temporary delimiter for later context length trucation
                context = context.trimEnd() + "%@GEN@%\n\n" + (function() {
                    // For context only, remove the title header from this workpiece's partially completed entry
                    const partialEntry = formatEntry(AC.generation.workpiece.entry);
                    const entryPlaceholderPattern = /(?:[%\$]+\s*|[%\$]*){+\s*entry\s*}+/gi;
                    if (entryPlaceholderPattern.test(AC.generation.workpiece.prompt)) {
                        // Fill all %{entry} placeholders with the partial entry
                        return AC.generation.workpiece.prompt.replace(entryPlaceholderPattern, partialEntry);
                    } else {
                        // Append the partial entry to the end of context
                        return AC.generation.workpiece.prompt.trimEnd() + "\n\n" + partialEntry;
                    }
                })();
                isGenerating = true;
                return;
            }
            function repositionAN() {
                // Move the Author's Note further back in context during card generation (should still be considered)
                const authorsNotePattern = /\s*(\[\s*Author's\s*note\s*:[\s\S]*\])\s*/i;
                const authorsNoteMatch = context.match(authorsNotePattern);
                if (!authorsNoteMatch) {
                    return;
                }
                const leadingSpaces = context.match(/^\s*/)[0];
                context = context.replace(authorsNotePattern, " ").trimStart();
                const recentStoryPattern = /\s*Recent\s*Story\s*:\s*/i;
                if (recentStoryPattern.test(context)) {
                    // Remove author's note from its original position and insert above "Recent Story:\n"
                    context = (context
                        .replace(recentStoryPattern, "\n\n" + authorsNoteMatch[1] + "\n\nRecent Story:\n")
                        .trimStart()
                    );
                } else {
                    context = authorsNoteMatch[1] + "\n\n" + context;
                }
                context = leadingSpaces + context;
                return;
            }
            function sortCandidates() {
                if (AC.database.titles.candidates.length < 2) {
                    return;
                }
                const turnRange = boundInteger(1, maxTurn - minTurn);
                const recencyExponent = Math.log10(turnRange) + 1.85;
                // Sort the database of available title candidates by relevance
                AC.database.titles.candidates.sort((a, b) => {
                    return relevanceScore(b) - relevanceScore(a);
                });
                function relevanceScore(candidate) {
                    // weight = (((turn - minTurn) / (maxTurn - minTurn)) + 1)^(log10(maxTurn - minTurn) + 1.85)
                    return candidate.slice(1).reduce((sum, turn) => {
                        // Apply exponential scaling to give far more weight to recent turns
                        return sum + Math.pow((
                            // The recency weight's exponent scales by log10(turnRange) + 1.85
                            // Shhh don't question it 😜
                            ((turn - minTurn) / turnRange) + 1
                        ), recencyExponent);
                    }, 0);
                }
                return;
            }
            function shouldTrimContext() {
                return (AC.signal.maxChars <= context.length);
            }
            function setCandidateTurnBounds(candidate) {
                // candidate: ["Example Title", 0, 1, 2, 3]
                minTurn = boundInteger(0, minTurn, candidate[1]);
                maxTurn = boundInteger(candidate[candidate.length - 1], maxTurn);
                return;
            }
            function disableAutoCards() {
                AC.signal.forceToggle = null;
                // Auto-Cards has been disabled
                AC.config.doAC = false;
                // Deconstruct the "Configure Auto-Cards" story card
                unbanTitle(configureCardTemplate.title);
                eraseCard(configureCard);
                // Signal the construction of "Edit to enable Auto-Cards" during the next onOutput hook
                AC.signal.swapControlCards = true;
                // Post a success message
                notify("Disabled! Use the \"Edit to enable Auto-Cards\" story card to undo");
                CODOMAIN.initialize(TEXT);
                return;
            }
            break; }
        case "output": {
            // AutoCards was called within the output modifier
            const output = prettifyEmDashes(TEXT);
            if (0 < AC.chronometer.postpone) {
                // Do not capture or replace any outputs during this turn
                promoteAmnesia();
                if (permitOutput()) {
                    CODOMAIN.initialize(output);
                }
            } else if (AC.signal.swapControlCards) {
                if (permitOutput()) {
                    CODOMAIN.initialize(output);
                }
            } else if (isPendingGeneration()) {
                const textClone = prettifyEmDashes(text);
                AC.chronometer.amnesia = 0;
                AC.generation.completed++;
                const generationsRemaining = (function() {
                    if (
                        textClone.includes("\"")
                        || /(?<=^|\s|—|\(|\[|{)sa(ys?|id)(?=\s|\.|\?|!|,|;|—|\)|\]|}|$)/i.test(textClone)
                    ) {
                        // Discard full outputs containing "say" or quotations
                        // To build coherent entries, the AI must not attempt to continue the story
                        return skip(estimateRemainingGens());
                    }
                    const oldSentences = (splitBySentences(formatEntry(AC.generation.workpiece.entry))
                        .map(sentence => sentence.trim())
                        .filter(sentence => (2 < sentence.length))
                    );
                    const seenSentences = new Set();
                    const entryAddition = splitBySentences(textClone
                        .replace(/[\*_~]/g, "")
                        .replace(/:+/g, "#")
                        .replace(/\s+/g, " ")
                    ).map(sentence => (sentence
                        .trim()
                        .replace(/^-+\s*/, "")
                    )).filter(sentence => (
                        // Remove empty strings
                        (sentence !== "")
                        // Remove colon ":" headers or other stinky symbols because me no like 😠
                        && !/[#><@]/.test(sentence)
                        // Remove previously repeated sentences
                        && !oldSentences.some(oldSentence => (0.75 < similarityScore(oldSentence, sentence)))
                        // Remove repeated sentences from within entryAddition itself
                        && ![...seenSentences].some(seenSentence => (0.75 < similarityScore(seenSentence, sentence)))
                        // Simply ensure this sentence is henceforth unique
                        && seenSentences.add(sentence)
                    )).join(" ").trim() + " ";
                    if (entryAddition === " ") {
                        return skip(estimateRemainingGens());
                    } else if (
                        /^{title:[\s\S]*?}$/.test(AC.generation.workpiece.entry.trim())
                        && (AC.generation.workpiece.entry.length < 111)
                    ) {
                        AC.generation.workpiece.entry += "\n" + entryAddition;
                    } else {
                        AC.generation.workpiece.entry += entryAddition;
                    }
                    if (AC.generation.workpiece.limit < AC.generation.workpiece.entry.length) {
                        let exit = false;
                        let truncatedEntry = AC.generation.workpiece.entry.trimEnd();
                        const sentences = splitBySentences(truncatedEntry);
                        for (let i = sentences.length - 1; 0 <= i; i--) {
                            if (!sentences[i].includes("\n")) {
                                sentences.splice(i, 1);
                                truncatedEntry = sentences.join("").trimEnd();
                                if (truncatedEntry.length <= AC.generation.workpiece.limit) {
                                    break;
                                }
                                continue;
                            }
                            // Lines only matter for initial entries provided via AutoCards().API.generateCard
                            const lines = sentences[i].split("\n");
                            for (let j = lines.length - 1; 0 <= j; j--) {
                                lines.splice(j, 1);
                                sentences[i] = lines.join("\n");
                                truncatedEntry = sentences.join("").trimEnd();
                                if (truncatedEntry.length <= AC.generation.workpiece.limit) {
                                    // Exit from both loops
                                    exit = true;
                                    break;
                                }
                            }
                            if (exit) {
                                break;
                            }
                        }
                        if (truncatedEntry.length < 150) {
                            // Disregard the previous sentence/line-based truncation attempt
                            AC.generation.workpiece.entry = limitString(
                                AC.generation.workpiece.entry, AC.generation.workpiece.limit
                            );
                            // Attempt to remove the last word/fragment
                            truncatedEntry = AC.generation.workpiece.entry.replace(/\s*\S+$/, "");
                            if (150 <= truncatedEntry) {
                                AC.generation.workpiece.entry = truncatedEntry;
                            }
                        } else {
                            AC.generation.workpiece.entry = truncatedEntry;
                        }
                        return 0;
                    } else if ((AC.generation.workpiece.limit - 50) <= AC.generation.workpiece.entry.length) {
                        AC.generation.workpiece.entry = AC.generation.workpiece.entry.trimEnd();
                        return 0;
                    }
                    function skip(remaining) {
                        if (AC.generation.permitted <= AC.generation.completed) {
                            AC.generation.workpiece.entry = AC.generation.workpiece.entry.trimEnd();
                            return 0;
                        }
                        return remaining;
                    }
                    function estimateRemainingGens() {
                        const responseEstimate = estimateResponseLength();
                        if (responseEstimate === -1) {
                            return 1;
                        }
                        const remaining = boundInteger(1, Math.round(
                            (150 + AC.generation.workpiece.limit - AC.generation.workpiece.entry.length) / responseEstimate
                        ));
                        if (AC.generation.permitted === 34) {
                            AC.generation.permitted = boundInteger(6, Math.floor(3.5 * remaining), 32);
                        }
                        return remaining;
                    }
                    return skip(estimateRemainingGens());
                })();
                postOutputMessage(AC.generation.completed / Math.min(
                    AC.generation.permitted,
                    AC.generation.completed + generationsRemaining
                ));
                if (generationsRemaining <= 0) {
                    notify("\"" + AC.generation.workpiece.title + "\" was successfully added to your story cards!");
                    constructCard(O.f({
                        type: AC.generation.workpiece.type,
                        title: AC.generation.workpiece.title,
                        keys: AC.generation.workpiece.keys,
                        entry: (function() {
                            if (!AC.config.bulletedListMode) {
                                return AC.generation.workpiece.entry;
                            }
                            const sentences = splitBySentences(
                                formatEntry(
                                    AC.generation.workpiece.entry.replace(/\s+/g, " ")
                                ).replace(/:+/g, "#")
                            ).map(sentence => {
                                sentence = (sentence
                                    .replaceAll("#", ":")
                                    .trim()
                                    .replace(/^-+\s*/, "")
                                );
                                if (sentence.length < 12) {
                                    return sentence;
                                } else {
                                    return "\n- " + sentence.replace(/\s*[\.\?!]+$/, "");
                                }
                            });
                            const titleHeader = "{title: " + AC.generation.workpiece.title + "}";
                            if (sentences.every(sentence => (sentence.length < 12))) {
                                const sentencesJoined = sentences.join(" ").trim();
                                if (sentencesJoined === "") {
                                    return titleHeader;
                                } else {
                                    return limitString(titleHeader + "\n" + sentencesJoined, 2000);
                                }
                            }
                            for (let i = sentences.length - 1; 0 <= i; i--) {
                                const bulletedEntry = cleanSpaces(titleHeader + sentences.join(" ")).trimEnd();
                                if (bulletedEntry.length <= 2000) {
                                    return bulletedEntry;
                                }
                                if (sentences.length === 1) {
                                    break;
                                }
                                sentences.splice(i, 1);
                            }
                            return limitString(AC.generation.workpiece.entry, 2000);
                        })(),
                        description: AC.generation.workpiece.description,
                    }), newCardIndex());
                    AC.generation.cooldown = AC.config.addCardCooldown;
                    AC.generation.completed = 0;
                    AC.generation.permitted = 34;
                    AC.generation.workpiece = O.f({});
                    clearTransientTitles();
                }
            } else if (isPendingCompression()) {
                const textClone = prettifyEmDashes(text);
                AC.chronometer.amnesia = 0;
                AC.compression.completed++;
                const compressionsRemaining = (function() {
                    const newMemory = (textClone
                        // Remove some dumb stuff
                        .replace(/^[\s\S]*:/g, "")
                        .replace(/[\*_~#><@\[\]{}`\\]/g, " ")
                        // Remove bullets
                        .trim().replace(/^-+\s*/, "").replace(/\s*-+$/, "").replace(/\s*-\s+/g, " ")
                        // Condense consecutive whitespace
                        .replace(/\s+/g, " ")
                    );
                    if ((AC.compression.oldMemoryBank.length - 1) <= AC.compression.lastConstructIndex) {
                        // Terminate this compression cycle; the memory construct cannot grow any further
                        AC.compression.newMemoryBank.push(newMemory);
                        return 0;
                    } else if ((newMemory.trim() !== "") && (newMemory.length < buildMemoryConstruct().length)) {
                        // Good output, preserve and then proceed onwards
                        AC.compression.oldMemoryBank.splice(0, AC.compression.lastConstructIndex + 1);
                        AC.compression.lastConstructIndex = -1;
                        AC.compression.newMemoryBank.push(newMemory);
                    } else {
                        // Bad output, discard and then try again
                        AC.compression.responseEstimate += 200;
                    }
                    return boundInteger(1, joinMemoryBank(AC.compression.oldMemoryBank).length) / AC.compression.responseEstimate;
                })();
                postOutputMessage(AC.compression.completed / (AC.compression.completed + compressionsRemaining));
                if (compressionsRemaining <= 0) {
                    const card = getAutoCard(AC.compression.titleKey);
                    if (card === null) {
                        notify(
                            "Failed to apply summarized memories for \"" + AC.compression.vanityTitle + "\" due to a missing or invalid AC card title header!"
                        );
                    } else {
                        const memoryHeaderMatch = card.description.match(
                            /(?<={\s*updates?\s*:[\s\S]*?,\s*limits?\s*:[\s\S]*?})[\s\S]*$/i
                        );
                        if (memoryHeaderMatch) {
                            // Update the card memory bank
                            notify("Memories for \"" + AC.compression.vanityTitle + "\" were successfully summarized!");
                            card.description = card.description.replace(memoryHeaderMatch[0], (
                                "\n" + joinMemoryBank(AC.compression.newMemoryBank)
                            ));
                        } else {
                            notify(
                                "Failed to apply summarizes memories for \"" + AC.compression.vanityTitle + "\" due to a missing or invalid AC card memory header!"
                            );
                        }
                    }
                    resetCompressionProperties();
                } else if (AC.compression.completed === 1) {
                    notify("Summarizing excess memories for \"" + AC.compression.vanityTitle + "\"");
                }
                function joinMemoryBank(memoryBank) {
                    return cleanSpaces("- " + memoryBank.join("\n- "));
                }
            } else if (permitOutput()) {
                CODOMAIN.initialize(output);
            }
            concludeOutputBlock((function() {
                if (AC.signal.swapControlCards) {
                    return getConfigureCardTemplate();
                } else {
                    return null;
                }
            })())
            function postOutputMessage(ratio) {
                if (permitOutput()) {
                    CODOMAIN.initialize(
                        getPrecedingNewlines() + ">>> please select \"continue\" (" + Math.round(ratio * 100) + "%) <<<\n\n"
                    );
                }
                return;
            }
            break; }
        default: {
            CODOMAIN.initialize(TEXT);
            break; }
        }
        // Get an individual story card reference via titleKey
        function getAutoCard(titleKey) {
            return Internal.getCard(card => card.entry.toLowerCase().startsWith("{title: " + titleKey + "}"));
        }
        function buildMemoryConstruct() {
            return (AC.compression.oldMemoryBank
                .slice(0, AC.compression.lastConstructIndex + 1)
                .join(" ")
            );
        }
        // Estimate the average AI response char count based on recent continue outputs
        function estimateResponseLength() {
            if (!Array.isArray(history) || (history.length === 0)) {
                return -1;
            }
            const charCounts = [];
            for (let i = 0; i < history.length; i++) {
                const action = readPastAction(i);
                if ((action.type === "continue") && !action.text.includes("<<<")) {
                    charCounts.push(action.text.length);
                }
            }
            if (charCounts.length < 7) {
                if (charCounts.length === 0) {
                    return -1;
                } else if (charCounts.length < 4) {
                    return boundInteger(350, charCounts[0]);
                }
                charCounts.splice(3);
            }
            return boundInteger(175, Math.floor(
                charCounts.reduce((sum, charCount) => {
                    return sum + charCount;
                }, 0) / charCounts.length
            ));
        }
        // Evalute how similar two strings are on the range [0, 1]
        function similarityScore(strA, strB) {
            if (strA === strB) {
                return 1;
            }
            // Normalize both strings for further comparison purposes
            const [cleanA, cleanB] = [strA, strB].map(str => limitString((str
                .replace(/[0-9\s]/g, " ")
                .trim()
                .replace(/  +/g, " ")
                .toLowerCase()
            ), 1400));
            if (cleanA === cleanB) {
                return 1;
            }
            // Compute the Levenshtein distance
            const [lengthA, lengthB] = [cleanA, cleanB].map(str => str.length);
            // I love DP ❤️ (dynamic programming)
            const dp = Array(lengthA + 1).fill(null).map(() => Array(lengthB + 1).fill(0));
            for (let i = 0; i <= lengthA; i++) {
                dp[i][0] = i;
            }
            for (let j = 0; j <= lengthB; j++) {
                dp[0][j] = j;
            }
            for (let i = 1; i <= lengthA; i++) {
                for (let j = 1; j <= lengthB; j++) {
                    if (cleanA[i - 1] === cleanB[j - 1]) {
                        // No cost if chars match, swipe right 😎
                        dp[i][j] = dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = Math.min(
                            // Deletion
                            dp[i - 1][j] + 1,
                            // Insertion
                            dp[i][j - 1] + 1,
                            // Substitution
                            dp[i - 1][j - 1] + 1
                        );
                    }
                }
            }
            // Convert distance to similarity score (1 - (distance / maxLength))
            return 1 - (dp[lengthA][lengthB] / Math.max(lengthA, lengthB));
        }
        function splitBySentences(prose) {
            // Don't split sentences on honorifics or abbreviations such as "Mr.", "Mrs.", "etc."
            return (prose
                .replace(new RegExp("(?<=\\s|\"|\\(|—|\\[|'|{|^)(?:" + ([...Words.honorifics, ...Words.abbreviations]
                    .map(word => word.replace(".", ""))
                    .join("|")
                ) + ")\\.", "gi"), "$1%@%")
                .split(/(?<=[\.\?!:]["\)'\]}]?\s+)(?=[^\p{Ll}\s])/u)
                .map(sentence => sentence.replaceAll("%@%", "."))
            );
        }
        function formatEntry(partialEntry) {
            const cleanedEntry = cleanSpaces(partialEntry
                .replace(/^{title:[\s\S]*?}/, "")
                .replace(/[#><@*_~]/g, "")
                .trim()
            ).replace(/(?<=^|\n)-+\s*/g, "");
            if (cleanedEntry === "") {
                return "";
            } else {
                return cleanedEntry + " ";
            }
        }
        // Resolve malformed em dashes (common AI cliche)
        function prettifyEmDashes(str) {
            return str.replace(/(?<!^\s*)(?: - | ?– ?)(?!\s*$)/g, "—");
        }
        function getConfigureCardTemplate() {
            const names = getControlVariants().configure;
            return O.f({
                type: AC.config.defaultCardType,
                title: names.title,
                keys: names.keys,
                entry: getConfigureCardEntry(),
                description: getConfigureCardDescription()
            });
        }
        function getConfigureCardEntry() {
            return prose(
                "> Auto-Cards automatically creates and updates plot-relevant story cards while you play. You may configure the following settings by replacing \"false\" with \"true\" (and vice versa) or by adjusting numbers for the appropriate settings.",
                "> Disable Auto-Cards: false",
                "> Show detailed guide: false",
                "> Delete all automatic story cards: false",
                "> Reset all config settings and prompts: false",
                "> Pin this config card near the top: " + AC.config.pinConfigureCard,
                "> Minimum turns cooldown for new cards: " + AC.config.addCardCooldown,
                "> New cards use a bulleted list format: " + AC.config.bulletedListMode,
                "> Maximum entry length for new cards: " + AC.config.defaultEntryLimit,
                "> New cards perform memory updates: " + AC.config.defaultCardsDoMemoryUpdates,
                "> Card memory bank preferred length: " + AC.config.defaultMemoryLimit,
                "> Memory summary compression ratio: " + AC.config.memoryCompressionRatio,
                "> Exclude all-caps from title detection: " + AC.config.ignoreAllCapsTitles,
                "> Also detect titles from player inputs: " + AC.config.readFromInputs,
                "> Minimum turns age for title detection: " + AC.config.minimumLookBackDistance,
                "> Use Live Script Interface v2: " + (AC.config.LSIv2 !== null),
                "> Log debug data in a separate card: " + AC.config.showDebugData
            );
        }
        function getConfigureCardDescription() {
            return limitString(O.v(prose(
                Words.delimiter,
                "> AI prompt to generate new cards:",
                limitString(AC.config.generationPrompt.trim(), 4350).trimEnd(),
                Words.delimiter,
                "> AI prompt to summarize card memories:",
                limitString(AC.config.compressionPrompt.trim(), 4350).trimEnd(),
                Words.delimiter,
                "> Titles banned from new card creation:",
                AC.database.titles.banned.join(", ")
            )), 9850);
        }
    } else {
        // Auto-Cards is currently disabled
        switch(HOOK) {
        case "input": {
            if (/\/\s*A\s*C/i.test(text)) {
                CODOMAIN.initialize(doPlayerCommands(text));
            } else {
                CODOMAIN.initialize(TEXT);
            }
            break; }
        case "context": {
            // AutoCards was called within the context modifier
            advanceChronometer();
            // Get or construct the "Edit to enable Auto-Cards" story card
            const enableCardTemplate = getEnableCardTemplate();
            const enableCard = getSingletonCard(true, enableCardTemplate);
            banTitle(enableCardTemplate.title);
            pinAndSortCards(enableCard);
            if (AC.signal.forceToggle) {
                enableAutoCards();
            } else if (enableCard.entry !== enableCardTemplate.entry) {
                if ((extractSettings(enableCard.entry)?.enableautocards === true) && (AC.signal.forceToggle !== false)) {
                    // Use optional chaining to check the existence of enableautocards before accessing its value
                    enableAutoCards();
                } else {
                    // Repair the damaged card entry
                    enableCard.entry = enableCardTemplate.entry;
                }
            }
            AC.signal.forceToggle = null;
            CODOMAIN.initialize(TEXT);
            function enableAutoCards() {
                // Auto-Cards has been enabled
                AC.config.doAC = true;
                // Deconstruct the "Edit to enable Auto-Cards" story card
                unbanTitle(enableCardTemplate.title);
                eraseCard(enableCard);
                // Signal the construction of "Configure Auto-Cards" during the next onOutput hook
                AC.signal.swapControlCards = true;
                // Post a success message
                notify("Enabled! You may now edit the \"Configure Auto-Cards\" story card");
                return;
            }
            break; }
        case "output": {
            // AutoCards was called within the output modifier
            promoteAmnesia();
            if (permitOutput()) {
                CODOMAIN.initialize(TEXT);
            }
            concludeOutputBlock((function() {
                if (AC.signal.swapControlCards) {
                    return getEnableCardTemplate();
                } else {
                    return null;
                }
            })());
            break; }
        default: {
            CODOMAIN.initialize(TEXT);
            break; }
        }
        function getEnableCardTemplate() {
            const names = getControlVariants().enable;
            return O.f({
                type: AC.config.defaultCardType,
                title: names.title,
                keys: names.keys,
                entry: prose(
                    "> Auto-Cards automatically creates and updates plot-relevant story cards while you play. To enable this system, simply edit the \"false\" below to say \"true\" instead!",
                    "> Enable Auto-Cards: false"),
                description: "Perform any Do/Say/Story/Continue action within your adventure to apply this change!"
            });
        }
    }
    function hoistConst() { return (class Const {
        // This helps me debug stuff uwu
        #constant;
        constructor(...args) {
            if (args.length !== 0) {
                Const.#throwError([[(args.length === 1), "Const cannot be instantiated with a parameter"], ["Const cannot be instantiated with parameters"]]);
            } else {
                O.f(this);
                return this;
            }
        }
        declare(...args) {
            if (args.length !== 0) {
                Const.#throwError([[(args.length === 1), "Instances of Const cannot be declared with a parameter"], ["Instances of Const cannot be declared with parameters"]]);
            } else if (this.#constant === undefined) {
                this.#constant = null;
                return this;
            } else if (this.#constant === null) {
                Const.#throwError("Instances of Const cannot be redeclared");
            } else {
                Const.#throwError("Instances of Const cannot be redeclared after initialization");
            }
        }
        initialize(...args) {
            if (args.length !== 1) {
                Const.#throwError([[(args.length === 0), "Instances of Const cannot be initialized without a parameter"], ["Instances of Const cannot be initialized with multiple parameters"]]);
            } else if (this.#constant === null) {
                this.#constant = [args[0]];
                return this;
            } else if (this.#constant === undefined) {
                Const.#throwError("Instances of Const cannot be initialized before declaration");
            } else {
                Const.#throwError("Instances of Const cannot be reinitialized");
            }
        }
        read(...args) {
            if (args.length !== 0) {
                Const.#throwError([[(args.length === 1), "Instances of Const cannot be read with a parameter"], ["Instances of Const cannot read with any parameters"]]);
            } else if (Array.isArray(this.#constant)) {
                return this.#constant[0];
            } else if (this.#constant === null) {
                Const.#throwError("Despite prior declaration, instances of Const cannot be read before initialization");
            } else {
                Const.#throwError("Instances of Const cannot be read before initialization");
            }
        }
        // An error condition is paired with an error message [condition, message], call #throwError with an array of pairs to throw the message corresponding with the first true condition [[cndtn1, msg1], [cndtn2, msg2], [cndtn3, msg3], ...] The first conditionless array element always evaluates to true ('else')
        static #throwError(...args) {
            // Look, I thought I was going to use this more at the time okay
            const [conditionalMessagesTable] = args;
            const codomain = new Const().declare();
            const error = O.f(new Error((function() {
                const codomain = new Const().declare();
                if (Array.isArray(conditionalMessagesTable)) {
                    const chosenPair = conditionalMessagesTable.find(function(...args) {
                        const [pair] = args;
                        const codomain = new Const().declare();
                        if (Array.isArray(pair)) {
                            if ((pair.length === 1) && (typeof pair[0] === "string")) {
                                codomain.initialize(true);
                            } else if (
                                (pair.length === 2)
                                && (typeof pair[0] === "boolean")
                                && (typeof pair[1] === "string")
                            ) {
                                codomain.initialize(pair[0]);
                            } else {
                                Const.#throwError("Const.#throwError encountered an invalid array element of conditionalMessagesTable");
                            }
                        } else {
                            Const.#throwError("Const.#throwError encountered a non-array element within conditionalMessagesTable");
                        }
                        return codomain.read();
                    });
                    if (Array.isArray(chosenPair)) {
                        if (chosenPair.length === 1) {
                            codomain.initialize(chosenPair[0]);
                        } else {
                            codomain.initialize(chosenPair[1]);
                        }
                    } else {
                        codomain.initialize("Const.#throwError was not called with any true conditions");
                    }
                } else if (typeof conditionalMessagesTable === "string") {
                    codomain.initialize(conditionalMessagesTable);
                } else {
                    codomain.initialize("Const.#throwError could not parse the given argument");
                }
                return codomain.read();
            })()));
            if (error.stack) {
                codomain.initialize(error.stack
                    .replace(/\(<isolated-vm>:/gi, "(")
                    .replace(/Error:|at\s*(?:#throwError|Const.(?:declare|initialize|read)|new\s*Const)\s*\(\d+:\d+\)/gi, "")
                    .replace(/AutoCards\s*\((\d+):(\d+)\)\s*at\s*<isolated-vm>:\d+:\d+\s*$/i, "AutoCards ($1:$2)")
                    .trim()
                    .replace(/\s+/g, " ")
                );
            } else {
                codomain.initialize(error.message);
            }
            throw codomain.read();
        }
    }); }
    function hoistO() { return (class O {
        // Some Object class methods are annoyingly verbose for how often I use them 👿
        static f(obj) {
            return Object.freeze(obj);
        }
        static v(base) {
            return see(Words.copy) + base;
        }
        static s(obj) {
            return Object.seal(obj);
        }
    }); }
    function hoistWords() { return (class Words { static #cache = {}; static {
        // Each word list is initialized only once before being cached!
        const wordListInitializers = {
            // Special-cased honorifics which are excluded from titles and ignored during split-by-sentences operations
            honorifics: () => [
                "mr.", "ms.", "mrs.", "dr."
            ],
            // Other special-cased abbreviations used to reformat titles and split-by-sentences
            abbreviations: () => [
                "sr.", "jr.", "etc.", "st.", "ex.", "inc."
            ],
            // Lowercase minor connector words which may exist within titles
            minor: () => [
                "&", "the", "for", "of", "le", "la", "el"
            ],
            // Removed from shortened titles for improved memory detection and trigger keword assignments
            peerage: () => [
                "sir", "lord", "lady", "king", "queen", "majesty", "duke", "duchess", "noble", "royal", "emperor", "empress", "great", "prince", "princess", "count", "countess", "baron", "baroness", "archduke", "archduchess", "marquis", "marquess", "viscount", "viscountess", "consort", "grand", "sultan", "sheikh", "tsar", "tsarina", "czar", "czarina", "viceroy", "monarch", "regent", "imperial", "sovereign", "president", "prime", "minister", "nurse", "doctor", "saint", "general", "private", "commander", "captain", "lieutenant", "sergeant", "admiral", "marshal", "baronet", "emir", "chancellor", "archbishop", "bishop", "cardinal", "abbot", "abbess", "shah", "maharaja", "maharani", "councillor", "squire", "lordship", "ladyship", "monseigneur", "mayor", "princeps", "chief", "chef", "their", "my", "his", "him", "he'd", "her", "she", "she'd", "you", "your", "yours", "you'd", "you've", "you'll", "yourself", "mine", "myself", "highness", "excellency", "farmer", "sheriff", "officer", "detective", "investigator", "miss", "mister", "colonel", "professor", "teacher", "agent", "heir", "heiress", "master", "mistress", "headmaster", "headmistress", "principal", "papa", "mama", "mommy", "daddy", "mother", "father", "grandma", "grandpa", "aunt", "auntie", "aunty", "uncle", "cousin", "sister", "brother", "holy", "holiness", "almighty", "senator", "congressman"
            ],
            // Common named entities represent special-cased INVALID card titles. Because these concepts are already abundant within the AI's training data, generating story cards for any of these would be both annoying and superfluous. Therefore, Words.entities is accessed during banned titles initialization to prevent their appearance
            entities: () => [
                // Seasons
                "spring", "summer", "autumn", "fall", "winter",
                // Holidays
                "halloween", "christmas", "thanksgiving", "easter", "hanukkah", "passover", "ramadan", "eid", "diwali", "new year", "new year eve", "valentine day", "oktoberfest",
                // People terms
                "mom", "dad", "child", "grandmother", "grandfather", "ladies", "gentlemen", "gentleman", "slave",
                // Capitalizable pronoun thingys
                "his", "him", "he'd", "her", "she", "she'd", "you", "your", "yours", "you'd", "you've", "you'll", "you're", "yourself", "mine", "myself", "this", "that",
                // Religious figures & deities
                "god", "jesus", "buddha", "allah", "christ",
                // Religious texts & concepts
                "bible", "holy bible", "qur'an", "quran", "hadith", "tafsir", "tanakh", "talmud", "torah", "vedas", "vatican", "paganism", "pagan",
                // Religions & belief systems
                "hindu", "hinduism", "christianity", "islam", "jew", "judaism", "taoism", "buddhist", "buddhism", "catholic", "baptist",
                // Common locations
                "earth", "moon", "sun", "new york city", "london", "paris", "tokyo", "beijing", "mumbai", "sydney", "berlin", "moscow", "los angeles", "san francisco", "chicago", "miami", "seattle", "vancouver", "toronto", "ottawa", "mexico city", "rio de janeiro", "cape town", "sao paulo", "bangkok", "delhi", "amsterdam", "seoul", "shanghai", "new delhi", "atlanta", "jerusalem", "africa", "north america", "south america", "central america", "asia", "north africa", "south africa", "boston", "rome", "america", "siberia", "new england", "manhattan", "bavaria", "catalonia", "greenland", "hong kong", "singapore",
                // Countries & political entities
                "china", "india", "japan", "germany", "france", "spain", "italy", "canada", "australia", "brazil", "south africa", "russia", "north korea", "south korea", "iran", "iraq", "syria", "saudi arabia", "afghanistan", "pakistan", "uk", "britain", "england", "scotland", "wales", "northern ireland", "usa", "united states", "united states of america", "mexico", "turkey", "greece", "portugal", "poland", "netherlands", "belgium", "sweden", "norway", "finland", "denmark",
                // Organizations & unions
                "united nations", "european union", "state", "nato", "nfl", "nba", "fbi", "cia", "harvard", "yale", "princeton", "ivy league", "little league", "nasa", "nsa", "noaa", "osha", "nascar", "daytona 500", "grand prix", "wwe", "mba", "superbowl",
                // Currencies
                "dollar", "euro", "pound", "yen", "rupee", "peso", "franc", "dinar", "bitcoin", "ethereum", "ruble", "won", "dirham",
                // Landmarks
                "sydney opera house", "eiffel tower", "statue of liberty", "big ben", "great wall of china", "taj mahal", "pyramids of giza", "grand canyon", "mount everest",
                // Events
                "world war i", "world war 1", "wwi", "wwii", "world war ii", "world war 2", "wwii", "ww2", "cold war", "brexit", "american revolution", "french revolution", "holocaust", "cuban missile crisis",
                // Companies
                "google", "microsoft", "apple", "amazon", "facebook", "tesla", "ibm", "intel", "samsung", "sony", "coca-cola", "nike", "ford", "chevy", "pontiac", "chrysler", "volkswagen", "lambo", "lamborghini", "ferrari", "pizza hut", "taco bell", "ai dungeon", "openai", "mcdonald", "mcdonalds", "kfc", "burger king", "disney",
                // Nationalities & languages
                "english", "french", "spanish", "german", "italian", "russian", "chinese", "japanese", "korean", "arabic", "portuguese", "hindi", "american", "canadian", "mexican", "brazilian", "indian", "australian", "egyptian", "greek", "swedish", "norwegian", "danish", "dutch", "turkish", "iranian", "ukraine", "asian", "british", "european", "polish", "thai", "vietnamese", "filipino", "malaysian", "indonesian", "finnish", "estonian", "latvian", "lithuanian", "czech", "slovak", "hungarian", "romanian", "bulgarian", "serbian", "croatian", "bosnian", "slovenian", "albanian", "georgian", "armenian", "azerbaijani", "kazakh", "uzbek", "mongolian", "hebrew", "persian", "pashto", "urdu", "bengali", "tamil", "telugu", "marathi", "gujarati", "swahili", "zulu", "xhosa", "african", "north african", "south african", "north american", "south american", "central american", "colombian", "argentinian", "chilean", "peruvian", "venezuelan", "ecuadorian", "bolivian", "paraguayan", "uruguayan", "cuban", "dominican", "arabian", "roman", "haitian", "puerto rican", "moroccan", "algerian", "tunisian", "saudi", "emirati", "qatarian", "bahraini", "omani", "yemeni", "syrian", "lebanese", "iraqi", "afghan", "pakistani", "sri lankan", "burmese", "laotian", "cambodian", "hawaiian", "victorian",
                // Fantasy stuff
                "elf", "elves", "elven", "dwarf", "dwarves", "dwarven", "human", "man", "men", "mankind", "humanity",
                // IPs
                "pokemon", "pokémon", "minecraft", "beetles", "band-aid", "bandaid", "band aid", "big mac", "gpt", "chatgpt", "gpt-2", "gpt-3", "gpt-4", "gpt-4o", "mixtral", "mistral", "linux", "windows", "mac", "happy meal", "disneyland", "disneyworld",
                // US states
                "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "nebraska", "nevada", "new hampshire", "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah", "vermont", "west virginia", "wisconsin", "wyoming",
                // Canadian Provinces & Territories
                "british columbia", "manitoba", "new brunswick", "labrador", "nova scotia", "ontario", "prince edward island", "quebec", "saskatchewan", "northwest territories", "nunavut", "yukon", "newfoundland",
                // Australian States & Territories
                "new south wales", "queensland", "south australia", "tasmania", "western australia", "australian capital territory",
                // idk
                "html", "javascript", "python", "java", "c++", "php", "bluetooth", "json", "sql", "word", "dna", "icbm", "npc", "usb", "rsvp", "omg", "brb", "lol", "rofl", "smh", "ttyl", "rubik", "adam", "t-shirt", "tshirt", "t shirt", "led", "leds", "laser", "lasers", "qna", "q&a", "vip", "human resource", "human resources", "llm", "llc", "ceo", "cfo", "coo", "office", "blt", "suv", "suvs", "ems", "emt", "cbt", "cpr", "ferris wheel", "toy", "pet", "plaything", "m o"
            ],
            // Unwanted values
            undesirables: () => [
                [343332, 451737, 323433, 377817], [436425, 356928, 363825, 444048], [323433, 428868, 310497, 413952], [350097, 66825, 436425, 413952, 406593, 444048], [316932, 330000, 436425, 392073], [444048, 356928, 323433], [451737, 444048, 363825], [330000, 310497, 392073, 399300]
            ],
            delimiter: () => (
                "——————————————————————————"
            ),
            // Source code location
            copy: () => [
                126852, 33792, 211200, 384912, 336633, 310497, 436425, 336633, 33792, 459492, 363825, 436425, 363825, 444048, 33792, 392073, 483153, 33792, 139425, 175857, 33792, 152592, 451737, 399300, 350097, 336633, 406593, 399300, 33792, 413952, 428868, 406593, 343332, 363825, 384912, 336633, 33792, 135168, 190608, 336633, 467313, 330000, 190608, 336633, 310497, 356928, 33792, 310497, 399300, 330000, 33792, 428868, 336633, 310497, 330000, 33792, 392073, 483153, 33792, 316932, 363825, 406593, 33792, 343332, 406593, 428868, 33792, 436425, 363825, 392073, 413952, 384912, 336633, 33792, 363825, 399300, 436425, 444048, 428868, 451737, 323433, 444048, 363825, 406593, 399300, 436425, 33792, 406593, 399300, 33792, 310497, 330000, 330000, 363825, 399300, 350097, 33792, 139425, 451737, 444048, 406593, 66825, 148137, 310497, 428868, 330000, 436425, 33792, 444048, 406593, 33792, 483153, 406593, 451737, 428868, 33792, 436425, 323433, 336633, 399300, 310497, 428868, 363825, 406593, 436425, 35937, 33792, 3355672848, 139592360193, 3300, 3300, 356928, 444048, 444048, 413952, 436425, 111012, 72897, 72897, 413952, 384912, 310497, 483153, 69828, 310497, 363825, 330000, 451737, 399300, 350097, 336633, 406593, 399300, 69828, 323433, 406593, 392073, 72897, 413952, 428868, 406593, 343332, 363825, 384912, 336633, 72897, 190608, 336633, 467313, 330000, 190608, 336633, 310497, 356928, 3300, 3300, 126852, 33792, 139425, 451737, 444048, 406593, 66825, 148137, 310497, 428868, 330000, 436425, 33792, 459492, 79233, 69828, 76032, 69828, 76032, 33792, 363825, 436425, 33792, 310497, 399300, 33792, 406593, 413952, 336633, 399300, 66825, 436425, 406593, 451737, 428868, 323433, 336633, 33792, 436425, 323433, 428868, 363825, 413952, 444048, 33792, 343332, 406593, 428868, 33792, 139425, 175857, 33792, 152592, 451737, 399300, 350097, 336633, 406593, 399300, 33792, 392073, 310497, 330000, 336633, 33792, 316932, 483153, 33792, 190608, 336633, 467313, 330000, 190608, 336633, 310497, 356928, 69828, 33792, 261393, 406593, 451737, 33792, 356928, 310497, 459492, 336633, 33792, 392073, 483153, 33792, 343332, 451737, 384912, 384912, 33792, 413952, 336633, 428868, 392073, 363825, 436425, 436425, 363825, 406593, 399300, 33792, 444048, 406593, 33792, 451737, 436425, 336633, 33792, 139425, 451737, 444048, 406593, 66825, 148137, 310497, 428868, 330000, 436425, 33792, 467313, 363825, 444048, 356928, 363825, 399300, 33792, 483153, 406593, 451737, 428868, 33792, 413952, 336633, 428868, 436425, 406593, 399300, 310497, 384912, 33792, 406593, 428868, 33792, 413952, 451737, 316932, 384912, 363825, 436425, 356928, 336633, 330000, 33792, 436425, 323433, 336633, 399300, 310497, 428868, 363825, 406593, 436425, 35937, 3300, 126852, 33792, 261393, 406593, 451737, 50193, 428868, 336633, 33792, 310497, 384912, 436425, 406593, 33792, 467313, 336633, 384912, 323433, 406593, 392073, 336633, 33792, 444048, 406593, 33792, 336633, 330000, 363825, 444048, 33792, 444048, 356928, 336633, 33792, 139425, 175857, 33792, 413952, 428868, 406593, 392073, 413952, 444048, 436425, 33792, 310497, 399300, 330000, 33792, 444048, 363825, 444048, 384912, 336633, 33792, 336633, 475200, 323433, 384912, 451737, 436425, 363825, 406593, 399300, 436425, 33792, 413952, 428868, 406593, 459492, 363825, 330000, 336633, 330000, 33792, 316932, 336633, 384912, 406593, 467313, 69828, 33792, 175857, 33792, 436425, 363825, 399300, 323433, 336633, 428868, 336633, 384912, 483153, 33792, 356928, 406593, 413952, 336633, 33792, 483153, 406593, 451737, 33792, 336633, 399300, 370788, 406593, 483153, 33792, 483153, 406593, 451737, 428868, 33792, 310497, 330000, 459492, 336633, 399300, 444048, 451737, 428868, 336633, 436425, 35937, 33792, 101128769412, 106046468352, 3300
            ],
            // Card interface names reserved for use within LSIv2
            reserved: () => ({
                library: "Shared Library", input: "Input Modifier", context: "Context Modifier", output: "Output Modifier", guide: "LSIv2 Guide", state: "State Display", log: "Console Log"
            }),
            // Acceptable config settings which are coerced to true
            trues: () => [
                "true", "t", "yes", "y", "on"
            ],
            // Acceptable config settings which are coerced to false
            falses: () => [
                "false", "f", "no", "n", "off"
            ],
            guide: () => prose(
                ">>> Detailed Guide:",
                "Auto-Cards was made by LewdLeah ❤️",
                "",
                Words.delimiter,
                "",
                "💡 What is Auto-Cards?",
                "Auto-Cards is a plug-and-play script for AI Dungeon that watches your story and automatically writes plot-relevant story cards during normal gameplay. A forgetful AI breaks my immersion, therefore my primary goal was to address the \"object permanence problem\" by extending story cards and memories with deeper automation. Auto-Cards builds a living reference of your adventure's world as you go. For your own convenience, all of this stuff is handled in the background. Though you're certainly welcome to customize various settings or use in-game commands for more precise control",
                "",
                Words.delimiter,
                "",
                " 📌 Main Features",
                "- Detects named entities from your story and periodically writes new cards",
                "- Smart long-term memory updates and summaries for important cards",
                "- Fully customizable AI card generation and memory summarization prompts",
                "- Optional in-game commands to manually direct the card generation process",
                "- Free and open source for anyone to use within their own projects",
                "- Compatible with other scripts and includes an external API",
                "- Optional in-game scripting interface (LSIv2)",
                "",
                Words.delimiter,
                "",
                "⚙️ Config Settings",
                "You may, at any time, fine-tune your settings in-game by editing their values within the config card's entry section. Simply swap true/false or tweak numbers where appropriate",
                "",
                "> Disable Auto-Cards:",
                "Turns the whole system off if true",
                "",
                "> Show detailed guide:",
                "If true, shows this player guide in-game",
                "",
                "> Delete all automatic story cards:",
                "Removes every auto-card present in your adventure",
                "",
                "> Reset all config settings and prompts:",
                "Restores all settings and prompts to their original default values",
                "",
                "> Pin this config card near the top:",
                "Keeps the config card pinned high on your cards list",
                "",
                "> Minimum turns cooldown for new cards:",
                "How many turns (minimum) to wait between generating new cards. Using 9999 will pause periodic card generation while still allowing card memory updates to continue",
                "",
                "> New cards use a bulleted list format:",
                "If true, new entries will use bullet points instead of pure prose",
                "",
                "> Maximum entry length for new cards:",
                "Caps how long newly generated card entries can be (in characters)",
                "",
                "> New cards perform memory updates:",
                "If true, new cards will automatically experience memory updates over time",
                "",
                "> Card memory bank preferred length:",
                "Character count threshold before card memories are summarized to save space",
                "",
                "> Memory summary compression ratio:",
                "Controls how much to compress when summarizing long card memory banks",
                "(ratio = 10 * old / new ... such that 25 -> 2.5x shorter)",
                "",
                "> Exclude all-caps from title detection:",
                "Prevents all-caps words like \"RUN\" from being parsed as viable titles",
                "",
                "> Also detect titles from player inputs:",
                "Allows your typed Do/Say/Story action inputs to help suggest new card topics. Set to false if you have bad grammar, or if you're German (due to idiosyncratic noun capitalization habits)",
                "",
                "> Minimum turns age for title detection:",
                "How many actions back the script looks when parsing recent titles from your story",
                "",
                "> Use Live Script Interface v2:",
                "Enables LSIv2 for extra scripting magic and advanced control via arbitrary code execution",
                "",
                "> Log debug data in a separate card:",
                "Shows a debug card if set to true",
                "",
                Words.delimiter,
                "",
                "✏️ AI Prompts",
                "You may specify how the AI handles story card processes by editing either of these two prompts within the config card's notes section",
                "",
                "> AI prompt to generate new cards:",
                "Used when Auto-Cards writes a new card entry. It tells the AI to focus on important plot stuff, avoid fluff, and write in a consistent, polished style. I like to add some personal preferences here when playing my own adventures. \"%{title}\" and \"%{entry}\" are dynamic placeholders for their namesakes",
                "",
                "> AI prompt to summarize card memories:",
                "Summarizes older details within card memory banks to keep everything concise and neat over the long-run. Maintains only the most important details, written in the past tense. \"%{title}\" and \"%{memory}\" are dynamic placeholders for their namesakes",
                "",
                Words.delimiter,
                "",
                "⛔ Banned Titles List",
                "This list prevents new cards from being created for super generic or unhelpful titles such as North, Tuesday, or December. You may edit these at the bottom of the config card's notes section. Capitalization and plural/singular forms are handled for you, so no worries about that",
                "",
                "> Titles banned from automatic new card generation:",
                "North, East, South, West, and so on...",
                "",
                Words.delimiter,
                "",
                "🔑 In-Game Commands (/ac)",
                "Use these commands to manually interact with Auto-Cards, simply type them into a Do/Say/Story input action",
                "",
                "/ac",
                "Sets your actual cooldown to 0 and immediately attempts to generate a new card for the most relevant unused title from your story (if one exists)",
                "",
                "/ac Your Title Goes Here",
                "Will immediately begin generating a new story card with the given title",
                "Example use: \"/ac Leah\"",
                "",
                "/ac Your Title Goes Here / Your extra prompt details go here",
                "Similar to the previous case, but with additional context to include with the card generation prompt",
                "Example use: \"/ac Leah / Focus on Leah's works of artifice and ingenuity\"",
                "",
                "/ac Your Title Goes Here / Your extra prompt details go here / Your starter entry goes here",
                "Again, similar to the previous case, but with an initial card entry for the generator to build upon",
                "Example use: \"/ac Leah / Focus on Leah's works of artifice and ingenuity / You are a woman named Leah.\"",
                "",
                "/ac redo Your Title Goes Here",
                "Rewrites your chosen story card, using the old card entry, memory bank, and story context for inspiration. Useful for recreating cards after important character development has occurred",
                "Example use: \"/ac redo Leah\"",
                "",
                "/ac redo Your Title Goes Here / New info goes here",
                "Similar to the previous case, but with additional info provided to guide the rewrite according to your additional specifications",
                "Example use: \"/ac redo Leah / Leah recently achieved immortality\"",
                "",
                "/ac redo all",
                "Recreates every single auto-card in your adventure. I must warn you though: This is very risky",
                "",
                "Extra Info:",
                "- Invalid titles will fail. It's a technical limitation, sorry 🤷‍♀️",
                "- Titles must be unique, unless you're attempting to use \"/ac redo\" for an existing card",
                "- You may submit multiple commands using a single input to queue up a chained sequence of requests",
                "- Capitalization doesn't matter, titles will be reformatted regardless",
                "",
                Words.delimiter,
                "",
                "🔧 External API Functions (quick summary)",
                "These are mainly for other JavaScript programmers to use, so feel free to ignore this section if that doesn't apply to you. Anyway, here's what each one does in plain terms, though please do refer to my source code for the full documentation",
                "",
                "AutoCards().API.postponeEvents();",
                "Pauses Auto-Cards activity for n many turns",
                "",
                "AutoCards().API.emergencyHalt();",
                "Emergency stop or resume",
                "",
                "AutoCards().API.suppressMessages();",
                "Hides Auto-Cards toasts by preventing assignment to state.message",
                "",
                "AutoCards().API.debugLog();",
                "Writes to the debug log card",
                "",
                "AutoCards().API.toggle();",
                "Turns Auto-Cards on/off",
                "",
                "AutoCards().API.generateCard();",
                "Initiates AI generation of the requested card",
                "",
                "AutoCards().API.redoCard();",
                "Regenerates an existing card",
                "",
                "AutoCards().API.setCardAsAuto();",
                "Flags or unflags a card as automatic",
                "",
                "AutoCards().API.addCardMemory();",
                "Adds a memory to a specific card",
                "",
                "AutoCards().API.eraseAllAutoCards();",
                "Deletes all auto-cards",
                "",
                "AutoCards().API.getUsedTitles();",
                "Lists all current card titles and keys",
                "",
                "AutoCards().API.getBannedTitles();",
                "Shows your current banned titles list",
                "",
                "AutoCards().API.setBannedTitles();",
                "Replaces the banned titles list with a new list",
                "",
                "AutoCards().API.buildCard();",
                "Makes a new card from scratch, using exact parameters",
                "",
                "AutoCards().API.getCard();",
                "Finds cards that match a filter",
                "",
                "AutoCards().API.eraseCard();",
                "Deletes cards matching a filter",
                "",
                "These API functions also work from within the LSIv2 scope, by the way",
                "",
                Words.delimiter,
                "",
                "❤️ Special Thanks",
                "This project flourished due to the incredible help, feedback, and encouragement from the AI Dungeon community. Your ideas, bug reports, testing, and support made Auto-Cards smarter, faster, and more fun for all. Please refer to my source code to learn more about everyone's specific contributions",
                "",
                "AHotHamster22, BinKompliziert, Boo, bottledfox, Bruno, Burnout, bweni, DebaczX, Dirty Kurtis, Dragranis, effortlyss, Hawk, Idle Confusion, ImprezA, Kat-Oli, KryptykAngel, Mad19pumpkin, Magic, Mirox80, Nathaniel Wyvern, NobodyIsUgly, OnyxFlame, Purplejump, Randy Viosca, RustyPawz, sinner, Sleepy pink, Vutinberg, Wilmar, Yi1i1i",
                "",
                Words.delimiter,
                "",
                "🎴 Random Tips",
                "- The default setup works great out of the box, just play normally and watch your world build itself",
                "- Enable AI Dungeon's built-in memory system for the best results",
                "- Gameplay -> AI Models -> Memory System -> Memory Bank -> Toggle-ON to enable",
                "- \"t\" and \"f\" are valid shorthand for \"true\" and \"false\" inside the config card",
                "- If Auto-Cards goes overboard with new cards, you can pause it by setting the cooldown config to 9999",
                "- Write \"{title:}\" anywhere within a regular story card's entry to transform it into an automatic card",
                "- Feel free to import/export entire story card decks at any time",
                "- Please copy my source code from here: https://play.aidungeon.com/profile/LewdLeah",
                "",
                Words.delimiter,
                "",
                "Happy adventuring! ❤️",
                "Please erase before continuing! <<<"
            )
        };
        for (const wordList in wordListInitializers) {
            // Define a lazy getter for every word list
            Object.defineProperty(Words, wordList, {
                configurable: false,
                enumerable: true,
                get() {
                    // If not already in cache, initialize and store the word list
                    if (!(wordList in Words.#cache)) {
                        Words.#cache[wordList] = O.f(wordListInitializers[wordList]());
                    }
                    return Words.#cache[wordList];
                }
            });
        }
    } }); }
    function hoistStringsHashed() { return (class StringsHashed {
        // Used for information-dense past memory recognition
        // Strings are converted to (reasonably) unique hashcodes for efficient existence checking
        static #defaultSize = 65536;
        #size;
        #store;
        constructor(size = StringsHashed.#defaultSize) {
            this.#size = size;
            this.#store = new Set();
            return this;
        }
        static deserialize(serialized, size = StringsHashed.#defaultSize) {
            const stringsHashed = new StringsHashed(size);
            stringsHashed.#store = new Set(serialized.split(","));
            return stringsHashed;
        }
        serialize() {
            return Array.from(this.#store).join(",");
        }
        has(str) {
            return this.#store.has(this.#hash(str));
        }
        add(str) {
            this.#store.add(this.#hash(str));
            return this;
        }
        remove(str) {
            this.#store.delete(this.#hash(str));
            return this;
        }
        size() {
            return this.#store.size;
        }
        latest(keepLatestCardinality) {
            if (this.#store.size <= keepLatestCardinality) {
                return this;
            }
            const excess = this.#store.size - keepLatestCardinality;
            const iterator = this.#store.values();
            for (let i = 0; i < excess; i++) {
                // The oldest hashcodes are removed first (insertion order matters!)
                this.#store.delete(iterator.next().value);
            }
            return this;
        }
        #hash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((31 * hash) + str.charCodeAt(i)) % this.#size;
            }
            return hash.toString(36);
        }
    }); }
    function hoistInternal() { return (class Internal {
        // Some exported API functions are internally reused by AutoCards
        // Recursively calling AutoCards().API is computationally wasteful
        // AutoCards uses this collection of static methods as an internal proxy
        static generateCard(request, predefinedPair = ["", ""]) {
            // Method call guide:
            // Internal.generateCard({
            //     // All properties except 'title' are optional
            //     type: "card type, defaults to 'class' for ease of filtering",
            //     title: "card title",
            //     keysStart: "preexisting card triggers",
            //     entryStart: "preexisting card entry",
            //     entryPrompt: "prompt the AI will use to complete this entry",
            //     entryPromptDetails: "extra details to include with this card's prompt",
            //     entryLimit: 600, // target character count for the generated entry
            //     description: "card notes",
            //     memoryStart: "preexisting card memory",
            //     memoryUpdates: true, // card updates when new relevant memories are formed
            //     memoryLimit: 3200, // max characters before the card memory is compressed
            // });
            const titleKeyPair = formatTitle((request.title ?? "").toString());
            const title = predefinedPair[0] || titleKeyPair.newTitle;
            if (
                (title === "")
                || (("title" in AC.generation.workpiece) && (title === AC.generation.workpiece.title))
                || (isAwaitingGeneration() && (AC.generation.pending.some(pendingWorkpiece => (
                    ("title" in pendingWorkpiece) && (title === pendingWorkpiece.title)
                ))))
            ) {
                logEvent("The title '" + request.title + "' is invalid or unavailable for card generation", true);
                return false;
            }
            AC.generation.pending.push(O.s({
                title: title,
                type: limitString((request.type || AC.config.defaultCardType).toString().trim(), 100),
                keys: predefinedPair[1] || buildKeys((request.keysStart ?? "").toString(), titleKeyPair.newKey),
                entry: limitString("{title: " + title + "}" + cleanSpaces((function() {
                    const entry = (request.entryStart ?? "").toString().trim();
                    if (entry === "") {
                        return "";
                    } else {
                        return ("\n" + entry + (function() {
                            if (/[a-zA-Z]$/.test(entry)) {
                                return ".";
                            } else {
                                return "";
                            }
                        })() + " ");
                    }
                })()), 2000),
                description: limitString((
                    (function() {
                        const description = limitString((request.description ?? "").toString().trim(), 9900);
                        if (description === "") {
                            return "";
                        } else {
                            return description + "\n\n";
                        }
                    })() + "Auto-Cards will contextualize these memories:\n{updates: " + (function() {
                        if (typeof request.memoryUpdates === "boolean") {
                            return request.memoryUpdates;
                        } else {
                            return AC.config.defaultCardsDoMemoryUpdates;
                        }
                    })() + ", limit: " + validateMemoryLimit(
                        parseInt((request.memoryLimit || AC.config.defaultMemoryLimit), 10)
                    ) + "}" + (function() {
                        const cardMemoryBank = cleanSpaces((request.memoryStart ?? "").toString().trim());
                        if (cardMemoryBank === "") {
                            return "";
                        } else {
                            return "\n" + cardMemoryBank.split("\n").map(memory => addBullet(memory)).join("\n");
                        }
                    })()
                ), 10000),
                prompt: (function() {
                    let prompt = insertTitle((
                        (request.entryPrompt ?? "").toString().trim() || AC.config.generationPrompt.trim()
                    ), title);
                    let promptDetails = insertTitle((
                        cleanSpaces((request.entryPromptDetails ?? "").toString().trim())
                    ), title);
                    if (promptDetails !== "") {
                        const spacesPrecedingTerminalEntryPlaceholder = (function() {
                            const terminalEntryPlaceholderPattern = /(?:[%\$]+\s*|[%\$]*){+\s*entry\s*}+$/i;
                            if (terminalEntryPlaceholderPattern.test(prompt)) {
                                prompt = prompt.replace(terminalEntryPlaceholderPattern, "");
                                const trailingSpaces = prompt.match(/(\s+)$/);
                                if (trailingSpaces) {
                                    prompt = prompt.trimEnd();
                                    return trailingSpaces[1];
                                } else {
                                    return "\n\n";
                                }
                            } else {
                                return "";
                            }
                        })();
                        switch(prompt[prompt.length - 1]) {
                        case "]": { encapsulateBothPrompts("[", true, "]"); break; }
                        case ">": { encapsulateBothPrompts(null, false, ">"); break; }
                        case "}": { encapsulateBothPrompts("{", true, "}"); break; }
                        case ")": { encapsulateBothPrompts("(", true, ")"); break; }
                        case "/": { encapsulateBothPrompts("/", true, "/"); break; }
                        case "#": { encapsulateBothPrompts("#", true, "#"); break; }
                        case "-": { encapsulateBothPrompts(null, false, "-"); break; }
                        case ":": { encapsulateBothPrompts(":", true, ":"); break; }
                        case "<": { encapsulateBothPrompts(">", true, "<"); break; }
                        };
                        if (promptDetails.includes("\n")) {
                            const lines = promptDetails.split("\n");
                            for (let i = 0; i < lines.length; i++) {
                                lines[i] = addBullet(lines[i].trim());
                            }
                            promptDetails = lines.join("\n");
                        } else {
                            promptDetails = addBullet(promptDetails);
                        }
                        prompt += "\n" + promptDetails + (function() {
                            if (spacesPrecedingTerminalEntryPlaceholder !== "") {
                                // Prompt previously contained a terminal %{entry} placeholder, re-append it
                                return spacesPrecedingTerminalEntryPlaceholder + "%{entry}";
                            }
                            return "";
                        })();
                        function encapsulateBothPrompts(leftSymbol, slicesAtMiddle, rightSymbol) {
                            if (slicesAtMiddle) {
                                prompt = prompt.slice(0, -1).trim();
                                if (promptDetails.startsWith(leftSymbol)) {
                                    promptDetails = promptDetails.slice(1).trim();
                                }
                            }
                            if (!promptDetails.endsWith(rightSymbol)) {
                                promptDetails += rightSymbol;
                            }
                            return;
                        }
                    }
                    return limitString(prompt, Math.floor(0.8 * AC.signal.maxChars));
                })(),
                limit: validateEntryLimit(parseInt((request.entryLimit || AC.config.defaultEntryLimit), 10))
            }));
            notify("Generating card for \"" + title + "\"");
            function addBullet(str) {
                return "- " + str.replace(/^-+\s*/, "");
            }
            return true;
        }
        static redoCard(request, useOldInfo, newInfo) {
            const card = getIntendedCard(request.title)[0];
            const oldCard = O.f({...card});
            if (!eraseCard(card)) {
                return false;
            } else if (newInfo !== "") {
                request.entryPromptDetails = (request.entryPromptDetails ?? "").toString() + "\n" + newInfo;
            }
            O.f(request);
            Internal.getUsedTitles(true);
            if (!Internal.generateCard(request) && !Internal.generateCard(request, [
                (oldCard.entry.match(/^{title: ([\s\S]*?)}/)?.[1] || request.title.replace(/\w\S*/g, word => (
                    word[0].toUpperCase() + word.slice(1).toLowerCase()
                ))), oldCard.keys
            ])) {
                constructCard(oldCard, newCardIndex());
                Internal.getUsedTitles(true);
                return false;
            } else if (!useOldInfo) {
                return true;
            }
            AC.generation.pending[AC.generation.pending.length - 1].prompt = ((
                removeAutoProps(oldCard.entry) + "\n\n" +
                removeAutoProps(isolateNotesAndMemories(oldCard.description)[1])
            ).trimEnd() + "\n\n" + AC.generation.pending[AC.generation.pending.length - 1].prompt).trim();
            return true;
        }
        // Sometimes it's helpful to log information elsewhere during development
        // This log card is separate and distinct from the LSIv2 console log
        static debugLog(...args) {
            const debugCardName = "Debug Log";
            banTitle(debugCardName);
            const card = getSingletonCard(true, O.f({
                type: AC.config.defaultCardType,
                title: debugCardName,
                keys: debugCardName,
                entry: "The debug console log will print to the notes section below.",
                description: Words.delimiter + "\nBEGIN DEBUG LOG"
            }));
            logToCard(card, ...args);
            return card;
        }
        static eraseAllAutoCards() {
            const cards = [];
            Internal.getUsedTitles(true);
            for (const card of storyCards) {
                if (card.entry.startsWith("{title: ")) {
                    cards.push(card);
                }
            }
            for (const card of cards) {
                eraseCard(card);
            }
            auto.clear();
            forgetStuff();
            clearTransientTitles();
            AC.generation.pending = [];
            AC.database.memories.associations = {};
            if (AC.config.deleteAllAutoCards) {
                AC.config.deleteAllAutoCards = null;
            }
            return cards.length;
        }
        static getUsedTitles(isExternal = false) {
            if (isExternal) {
                bans.clear();
                isBanned("", true);
            } else if (0 < AC.database.titles.used.length) {
                return AC.database.titles.used;
            }
            // All unique used titles and keys encountered during this iteration
            const seen = new Set();
            auto.clear();
            clearTransientTitles();
            AC.database.titles.used = ["%@%"];
            for (const card of storyCards) {
                // Perform some common sense maintenance while we're here
                const coerce = (str) => (typeof str === "string") ? str : "";
                // Do not trim card.keys
                card.keys = coerce(card.keys);
                if (card.keys.includes("\"agent\"") || card.keys.includes("aidungeon")) {
                    if (isExternal) {
                        O.s(card);
                    }
                    continue;
                }
                card.type = coerce(card.type).trim();
                card.title = coerce(card.title).trim();
                card.entry = coerce(card.entry).trim();
                card.description = coerce(card.description).trim();
                if (isExternal) {
                    O.s(card);
                } else if (!shouldProceed()) {
                    checkRemaining();
                    continue;
                }
                // An ideal auto-card's entry starts with "{title: Example of Greatness}" (example)
                // An ideal auto-card's description contains "{updates: true, limit: 3200}" (example)
                if (checkPlurals(denumberName(card.title.replace("\n", "")), t => isBanned(t))) {
                    checkRemaining();
                    continue;
                } else if (!card.keys.includes(",")) {
                    const cleanKeys = denumberName(card.keys.trim());
                    if ((2 < cleanKeys.length) && checkPlurals(cleanKeys, t => isBanned(t))) {
                        checkRemaining();
                        continue;
                    }
                }
                // Detect and repair malformed auto-card properties in a fault-tolerant manner
                const traits = [card.entry, card.description].map((str, i) => {
                    // Absolute abomination uwu
                    const hasUpdates = /updates?\s*:[\s\S]*?(?:(?:title|limit)s?\s*:|})/i.test(str);
                    const hasLimit = /limits?\s*:[\s\S]*?(?:(?:title|update)s?\s*:|})/i.test(str);
                    return [(function() {
                        if (hasUpdates || hasLimit) {
                            if (/titles?\s*:[\s\S]*?(?:(?:limit|update)s?\s*:|})/i.test(str)) {
                                return 2;
                            }
                            return false;
                        } else if (/titles?\s*:[\s\S]*?}/i.test(str)) {
                            return 1;
                        } else if (!(
                            (i === 0)
                            && /{[\s\S]*?}/.test(str)
                            && (str.match(/{/g)?.length === 1)
                            && (str.match(/}/g)?.length === 1)
                        )) {
                            return false;
                        }
                        const badTitleHeaderMatch = str.match(/{([\s\S]*?)}/);
                        if (!badTitleHeaderMatch) {
                            return false;
                        }
                        const inferredTitle = badTitleHeaderMatch[1].split(",")[0].trim();
                        if (
                            (2 < inferredTitle.length)
                            && (inferredTitle.length <= 100)
                            && (badTitleHeaderMatch[0].length < str.length)
                        ) {
                            // A rare case where the title's existence should be inferred from the enclosing {curly brackets}
                            return inferredTitle;
                        }
                        return false;
                    })(), hasUpdates, hasLimit];
                }).flat();
                if (traits.every(trait => !trait)) {
                    // This card contains no auto-card traits, not even malformed ones
                    checkRemaining();
                    continue;
                }
                const [
                    hasEntryTitle,
                    hasEntryUpdates,
                    hasEntryLimit,
                    hasDescTitle,
                    hasDescUpdates,
                    hasDescLimit
                ] = traits;
                // Handle all story cards which belong to the Auto-Cards ecosystem
                // May flag this damaged auto-card for later repairs
                // May flag this duplicate auto-card for deformatting (will become a regular story card)
                let repair = false;
                let release = false;
                const title = (function() {
                    let title = "";
                    if (typeof hasEntryTitle === "string") {
                        repair = true;
                        title = formatTitle(hasEntryTitle).newTitle;
                        if (hasDescTitle && bad()) {
                            title = parseTitle(false);
                        }
                    } else if (hasEntryTitle) {
                        title = parseTitle(true);
                        if (hasDescTitle) {
                            repair = true;
                            if (bad()) {
                                title = parseTitle(false);
                            }
                        } else if (1 < card.entry.match(/titles?\s*:/gi)?.length) {
                            repair = true;
                        }
                    } else if (hasDescTitle) {
                        repair = true;
                        title = parseTitle(false);
                    }
                    if (bad()) {
                        repair = true;
                        title = formatTitle(card.title).newTitle;
                        if (bad()) {
                            release = true;
                        } else {
                            seen.add(title);
                            auto.add(title.toLowerCase());
                        }
                    } else {
                        seen.add(title);
                        auto.add(title.toLowerCase());
                        const titleHeader = "{title: " + title + "}";
                        if (!repair && !((card.entry === titleHeader) || card.entry.startsWith(titleHeader + "\n"))) {
                            repair = true;
                        }
                    }
                    function bad() {
                        return ((title === "") || checkPlurals(title, t => auto.has(t)));
                    }
                    function parseTitle(fromEntry) {
                        const [sourceType, sourceText] = (function() {
                            if (fromEntry) {
                                return [hasEntryTitle, card.entry];
                            } else {
                                return [hasDescTitle, card.description];
                            }
                        })()
                        switch(sourceType) {
                        case 1: {
                            return formatTitle(isolateProperty(
                                sourceText,
                                /titles?\s*:[\s\S]*?}/i,
                                /(?:titles?\s*:|})/gi
                            )).newTitle; }
                        case 2: {
                            return formatTitle(isolateProperty(
                                sourceText,
                                /titles?\s*:[\s\S]*?(?:(?:limit|update)s?\s*:|})/i,
                                /(?:(?:title|update|limit)s?\s*:|})/gi
                            )).newTitle; }
                        default: {
                            return ""; }
                        }
                    }
                    return title;
                })();
                if (release) {
                    // Remove Auto-Cards properties from this incompatible story card
                    safeRemoveProps();
                    card.description = (card.description
                        .replace(/\s*Auto(?:-|\s*)Cards\s*will\s*contextualize\s*these\s*memories\s*:\s*/gi, "")
                        .replaceAll("%@%", "\n\n")
                        .trim()
                    );
                    seen.delete(title);
                    checkRemaining();
                    continue;
                }
                const memoryProperties = "{updates: " + (function() {
                    let updates = null;
                    if (hasDescUpdates) {
                        updates = parseUpdates(false);
                        if (hasEntryUpdates) {
                            repair = true;
                            if (bad()) {
                                updates = parseUpdates(true);
                            }
                        } else if (1 < card.description.match(/updates?\s*:/gi)?.length) {
                            repair = true;
                        }
                    } else if (hasEntryUpdates) {
                        repair = true;
                        updates = parseUpdates(true);
                    }
                    if (bad()) {
                        repair = true;
                        updates = AC.config.defaultCardsDoMemoryUpdates;
                    }
                    function bad() {
                        return (updates === null);
                    }
                    function parseUpdates(fromEntry) {
                        const updatesText = (isolateProperty(
                            (function() {
                                if (fromEntry) {
                                    return card.entry;
                                } else {
                                    return card.description;
                                }
                            })(),
                            /updates?\s*:[\s\S]*?(?:(?:title|limit)s?\s*:|})/i,
                            /(?:(?:title|update|limit)s?\s*:|})/gi
                        ).toLowerCase().replace(/[^a-z]/g, ""));
                        if (Words.trues.includes(updatesText)) {
                            return true;
                        } else if (Words.falses.includes(updatesText)) {
                            return false;
                        } else {
                            return null;
                        }
                    }
                    return updates;
                })() + ", limit: " + (function() {
                    let limit = -1;
                    if (hasDescLimit) {
                        limit = parseLimit(false);
                        if (hasEntryLimit) {
                            repair = true;
                            if (bad()) {
                                limit = parseLimit(true);
                            }
                        } else if (1 < card.description.match(/limits?\s*:/gi)?.length) {
                            repair = true;
                        }
                    } else if (hasEntryLimit) {
                        repair = true;
                        limit = parseLimit(true);
                    }
                    if (bad()) {
                        repair = true;
                        limit = AC.config.defaultMemoryLimit;
                    } else {
                        limit = validateMemoryLimit(limit);
                    }
                    function bad() {
                        return (limit === -1);
                    }
                    function parseLimit(fromEntry) {
                        const limitText = (isolateProperty(
                            (function() {
                                if (fromEntry) {
                                    return card.entry;
                                } else {
                                    return card.description;
                                }
                            })(),
                            /limits?\s*:[\s\S]*?(?:(?:title|update)s?\s*:|})/i,
                            /(?:(?:title|update|limit)s?\s*:|})/gi
                        ).replace(/[^0-9]/g, ""));
                        if ((limitText === "")) {
                            return -1;
                        } else {
                            return parseInt(limitText, 10);
                        }
                    }
                    return limit.toString();
                })() + "}";
                if (!repair && (new RegExp("(?:^|\\n)" + memoryProperties + "(?:\\n|$)")).test(card.description)) {
                    // There are no serious repairs to perform
                    card.entry = cleanSpaces(card.entry);
                    const [notes, memories] = isolateNotesAndMemories(card.description);
                    const pureMemories = cleanSpaces(memories.replace(memoryProperties, "").trim());
                    rejoinDescription(notes, memoryProperties, pureMemories);
                    checkRemaining();
                    continue;
                }
                // Damage was detected, perform an adaptive repair on this auto-card's configurable properties
                card.description = card.description.replaceAll("%@%", "\n\n");
                safeRemoveProps();
                card.entry = limitString(("{title: " + title + "}\n" + card.entry).trimEnd(), 2000);
                const [left, right] = card.description.split("%@%");
                rejoinDescription(left, memoryProperties, right);
                checkRemaining();
                function safeRemoveProps() {
                    if (typeof hasEntryTitle === "string") {
                        card.entry = card.entry.replace(/{[\s\S]*?}/g, "");
                    }
                    card.entry = removeAutoProps(card.entry);
                    const [notes, memories] = isolateNotesAndMemories(card.description);
                    card.description = notes + "%@%" + removeAutoProps(memories);
                    return;
                }
                function rejoinDescription(notes, memoryProperties, memories) {
                    card.description = limitString((notes + (function() {
                        if (notes === "") {
                            return "";
                        } else if (notes.endsWith("Auto-Cards will contextualize these memories:")) {
                            return "\n";
                        } else {
                            return "\n\n";
                        }
                    })() + memoryProperties + (function() {
                        if (memories === "") {
                            return "";
                        } else {
                            return "\n";
                        }
                    })() + memories), 10000);
                    return;
                }
                function isolateProperty(sourceText, propMatcher, propCleaner) {
                    return ((sourceText.match(propMatcher)?.[0] || "")
                        .replace(propCleaner, "")
                        .split(",")[0]
                        .trim()
                    );
                }
                // Observe literal card titles and keys
                function checkRemaining() {
                    const literalTitles = [card.title, ...card.keys.split(",")];
                    for (let i = 0; i < literalTitles.length; i++) {
                        // The pre-format set inclusion check helps avoid superfluous formatTitle calls
                        literalTitles[i] = (literalTitles[i]
                            .replace(/["\.\?!;\(\):\[\]—{}]/g, " ")
                            .trim()
                            .replace(/\s+/g, " ")
                            .replace(/^'\s*/, "")
                            .replace(/\s*'$/, "")
                        );
                        if (seen.has(literalTitles[i])) {
                            continue;
                        }
                        literalTitles[i] = formatTitle(literalTitles[i]).newTitle;
                        if (literalTitles[i] !== "") {
                            seen.add(literalTitles[i]);
                        }
                    }
                    return;
                }
                function denumberName(name) {
                    if (2 < (name.match(/[^\d\s]/g) || []).length) {
                        // Important for identifying LSIv2 auxiliary code cards when banned
                        return name.replace(/\s*\d+$/, "");
                    } else {
                        return name;
                    }
                }
            }
            clearTransientTitles();
            AC.database.titles.used = [...seen];
            return AC.database.titles.used;
        }
        static getBannedTitles() {
            // AC.database.titles.banned is an array, not a set; order matters
            return AC.database.titles.banned;
        }
        static setBannedTitles(newBans, isFinalAssignment) {
            AC.database.titles.banned = [];
            AC.database.titles.pendingBans = [];
            AC.database.titles.pendingUnbans = [];
            for (let i = newBans.length - 1; 0 <= i; i--) {
                banTitle(newBans[i], isFinalAssignment);
            }
            return AC.database.titles.banned;
        }
        static getCard(predicate, getAll) {
            if (getAll) {
                // Return an array of card references which satisfy the given condition
                const collectedCards = [];
                for (const card of storyCards) {
                    if (predicate(card)) {
                        O.s(card);
                        collectedCards.push(card);
                    }
                }
                return collectedCards;
            }
            // Return a reference to the first card which satisfies the given condition
            for (const card of storyCards) {
                if (predicate(card)) {
                    return O.s(card);
                }
            }
            return null;
        }
    }); }
    function validateCooldown(cooldown) {
        return boundInteger(0, cooldown, 9999, 40);
    }
    function validateEntryLimit(entryLimit) {
        return boundInteger(200, entryLimit, 2000, 600);
    }
    function validateMemoryLimit(memoryLimit) {
        return boundInteger(1750, memoryLimit, 9900, 3200);
    }
    function validateMemCompRatio(memCompressRatio) {
        return boundInteger(20, memCompressRatio, 1250, 25);
    }
    function validateMLBD(minLookBackDist) {
        return boundInteger(2, minLookBackDist, 88, 7);
    }
    function getDefaultConfig() {
        function check(value, fallback = true, type = "boolean") {
            if (typeof value === type) {
                return value;
            } else {
                return fallback;
            }
        }
        function maybeProse(value) {
            if (Array.isArray(value)) {
                return prose(...value);
            } else {
                return value;
            }
        }
        return O.s({
            // Is Auto-Cards enabled?
            doAC: check(S.DEFAULT_DO_AC),
            // Delete all previously generated story cards?
            deleteAllAutoCards: null,
            // Pin the configuration interface story card near the top?
            pinConfigureCard: check(S.DEFAULT_PIN_CONFIGURE_CARD),
            // Minimum number of turns in between automatic card generation events?
            addCardCooldown: validateCooldown(S.DEFAULT_CARD_CREATION_COOLDOWN),
            // Use bulleted list mode for newly generated card entries?
            bulletedListMode: check(S.DEFAULT_USE_BULLETED_LIST_MODE),
            // Maximum allowed length for newly generated story card entries?
            defaultEntryLimit: validateEntryLimit(S.DEFAULT_GENERATED_ENTRY_LIMIT),
            // Do newly generated cards have memory updates enabled by default?
            defaultCardsDoMemoryUpdates: check(S.DEFAULT_NEW_CARDS_DO_MEMORY_UPDATES),
            // Default character limit before the card's memory bank is summarized?
            defaultMemoryLimit: validateMemoryLimit(S.DEFAULT_NEW_CARDS_MEMORY_LIMIT),
            // Approximately how much shorter should recently compressed memories be? (ratio = 10 * old / new)
            memoryCompressionRatio: validateMemCompRatio(S.DEFAULT_MEMORY_COMPRESSION_RATIO),
            // Ignore all-caps during title candidate detection?
            ignoreAllCapsTitles: check(S.DEFAULT_IGNORE_ALL_CAPS_TITLES),
            // Should player input actions (Do/Say/Story) be considered for future named entity detection?
            readFromInputs: check(S.DEFAULT_DETECT_TITLES_FROM_INPUTS),
            // How many (minimum) actions in the past does Auto-Cards look for named entities?
            minimumLookBackDistance: validateMLBD(S.DEFAULT_MINIMUM_LOOK_BACK_DISTANCE),
            // Is Live Script Interface v2 enabled?
            LSIv2: (function() {
                if (S.DEFAULT_DO_LSI_V2 === true) {
                    return true;
                } else {
                    // Intrepret "false" as null, both here and for later config card reads
                    return null;
                }
            })(),
            // Should the debug data card be visible?
            showDebugData: check(S.DEFAULT_SHOW_DEBUG_DATA, false),
            // How should the AI be prompted when generating new story card entries?
            generationPrompt: check(maybeProse(S.DEFAULT_CARD_GENERATION_PROMPT), prose(
                "-----",
                "",
                "<SYSTEM>",
                "# Stop the story and ignore previous instructions. Write a brief and coherent informational entry for %{title} following these instructions:",
                "- Write only third-person pure prose information about %{title} using complete sentences with correct punctuation",
                "- Avoid short-term temporary details or appearances, instead focus on plot-significant information",
                "- Prioritize story-relevant details about %{title} first to ensure seamless integration with the previous plot",
                "- Create new information based on the context and story direction",
                "- Mention %{title} in every sentence",
                "- Use semicolons if needed",
                "- Add additional details about %{title} beneath incomplete entries",
                "- Be concise and grounded",
                "- Imitate the story's writing style and infer the reader's preferences",
                "</SYSTEM>",
                "Continue the entry for %{title} below while avoiding repetition:",
                "%{entry}"
            ), "string"),
            // How should the AI be prompted when summarizing memories for a given story card?
            compressionPrompt: check(maybeProse(S.DEFAULT_CARD_MEMORY_COMPRESSION_PROMPT), prose(
                "-----",
                "",
                "<SYSTEM>",
                "# Stop the story and ignore previous instructions. Summarize and condense the given paragraph into a narrow and focused memory passage while following these guidelines:",
                "- Ensure the passage retains the core meaning and most essential details",
                "- Use the third-person perspective",
                "- Prioritize information-density, accuracy, and completeness",
                "- Remain brief and concise",
                "- Write firmly in the past tense",
                "- The paragraph below pertains to old events from far earlier in the story",
                "- Integrate %{title} naturally within the memory; however, only write about the events as they occurred",
                "- Only reference information present inside the paragraph itself, be specific",
                "</SYSTEM>",
                "Write a summarized old memory passage for %{title} based only on the following paragraph:",
                "\"\"\"",
                "%{memory}",
                "\"\"\"",
                "Summarize below:"
            ), "string"),
            // All cards constructed by AC will inherit this type by default
            defaultCardType: check(S.DEFAULT_CARD_TYPE, "class", "string")
        });
    }
    function getDefaultConfigBans() {
        if (typeof S.DEFAULT_BANNED_TITLES_LIST === "string") {
            return uniqueTitlesArray(S.DEFAULT_BANNED_TITLES_LIST.split(","));
        } else {
            return [
                "North", "East", "South", "West", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ];
        }
    }
    function uniqueTitlesArray(titles) {
        const existingTitles = new Set();
        return (titles
            .map(title => title.trim().replace(/\s+/g, " "))
            .filter(title => {
                if (title === "") {
                    return false;
                }
                const lowerTitle = title.toLowerCase();
                if (existingTitles.has(lowerTitle)) {
                    return false;
                } else {
                    existingTitles.add(lowerTitle);
                    return true;
                }
            })
        );
    }
    function boundInteger(lowerBound, value, upperBound, fallback) {
        if (!Number.isInteger(value)) {
            if (!Number.isInteger(fallback)) {
                throw new Error("Invalid arguments: value and fallback are not integers");
            }
            value = fallback;
        }
        if (Number.isInteger(lowerBound) && (value < lowerBound)) {
            if (Number.isInteger(upperBound) && (upperBound < lowerBound)) {
                throw new Error("Invalid arguments: The inequality (lowerBound <= upperBound) must be satisfied");
            }
            return lowerBound;
        } else if (Number.isInteger(upperBound) && (upperBound < value)) {
            return upperBound;
        } else {
            return value;
        }
    }
    function limitString(str, lengthLimit) {
        if (lengthLimit < str.length) {
            return str.slice(0, lengthLimit).trim();
        } else {
            return str;
        }
    }
    function cleanSpaces(unclean) {
        return (unclean
            .replace(/\s*\n\s*/g, "\n")
            .replace(/\t/g, " ")
            .replace(/  +/g, " ")
        );
    }
    function isolateNotesAndMemories(str) {
        const bisector = str.search(/\s*(?:{|(?:title|update|limit)s?\s*:)\s*/i);
        if (bisector === -1) {
            return [str, ""];
        } else {
            return [str.slice(0, bisector), str.slice(bisector)];
        }
    }
    function removeAutoProps(str) {
        return cleanSpaces(str
            .replace(/\s*{([\s\S]*?)}\s*/g, (bracedMatch, enclosedProperties) => {
                if (enclosedProperties.trim().length < 150) {
                    return "\n";
                } else {
                    return bracedMatch;
                }
            })
            .replace((
                /\s*(?:{|(?:title|update|limit)s?\s*:)(?:[\s\S]{0,150}?)(?=(?:title|update|limit)s?\s*:|})\s*/gi
            ), "\n")
            .replace(/\s*(?:{|(?:title|update|limit)s?\s*:|})\s*/gi, "\n")
            .trim()
        );
    }
    function insertTitle(prompt, title) {
        return prompt.replace((
            /(?:[%\$]+\s*|[%\$]*){+\s*(?:titles?|names?|characters?|class(?:es)?|races?|locations?|factions?)\s*}+/gi
        ), title);
    }
    function prose(...args) {
        return args.join("\n");
    }
    function buildKeys(keys, key) {
        key = key.trim().replace(/\s+/g, " ");
        const keyset = [];
        if (key === "") {
            return keys;
        } else if (keys.trim() !== "") {
            keyset.push(...keys.split(","));
            const lowerKey = key.toLowerCase();
            for (let i = keyset.length - 1; 0 <= i; i--) {
                const preKey = keyset[i].trim().replace(/\s+/g, " ").toLowerCase();
                if ((preKey === "") || preKey.includes(lowerKey)) {
                    keyset.splice(i, 1);
                }
            }
        }
        if (key.length < 6) {
            keyset.push(...[
                " " + key + " ", " " + key + "'", "\"" + key + " ", " " + key + ".", " " + key + "?", " " + key + "!", " " + key + ";", "'" + key + " ", "(" + key + " ", " " + key + ")", " " + key + ":", " " + key + "\"", "[" + key + " ", " " + key + "]", "—" + key + " ", " " + key + "—", "{" + key + " ", " " + key + "}"
            ]);
        } else if (key.length < 9) {
            keyset.push(...[
                key + " ", " " + key, key + "'", "\"" + key, key + ".", key + "?", key + "!", key + ";", "'" + key, "(" + key, key + ")", key + ":", key + "\"", "[" + key, key + "]", "—" + key, key + "—", "{" + key, key + "}"
            ]);
        } else {
            keyset.push(key);
        }
        keys = keyset[0] || key;
        let i = 1;
        while ((i < keyset.length) && ((keys.length + 1 + keyset[i].length) < 101)) {
            keys += "," + keyset[i];
            i++;
        }
        return keys;
    }
    // Returns the template-specified singleton card (or secondary varient) after:
    // 1) Erasing all inferior duplicates
    // 2) Repairing damaged titles and keys
    // 3) Constructing a new singleton card if it doesn't exist
    function getSingletonCard(allowConstruction, templateCard, secondaryCard) {
        let singletonCard = null;
        const excessCards = [];
        for (const card of storyCards) {
            O.s(card);
            if (singletonCard === null) {
                if ((card.title === templateCard.title) || (card.keys === templateCard.keys)) {
                    // The first potentially valid singleton card candidate to be found
                    singletonCard = card;
                }
            } else if (card.title === templateCard.title) {
                if (card.keys === templateCard.keys) {
                    excessCards.push(singletonCard);
                    singletonCard = card;
                } else {
                    eraseInferiorDuplicate();
                }
            } else if (card.keys === templateCard.keys) {
                eraseInferiorDuplicate();
            }
            function eraseInferiorDuplicate() {
                if ((singletonCard.title === templateCard.title) && (singletonCard.keys === templateCard.keys)) {
                    excessCards.push(card);
                } else {
                    excessCards.push(singletonCard);
                    singletonCard = card;
                }
                return;
            }
        }
        if (singletonCard === null) {
            if (secondaryCard) {
                // Fallback to a secondary card template
                singletonCard = getSingletonCard(false, secondaryCard);
            }
            // No singleton card candidate exists
            if (allowConstruction && (singletonCard === null)) {
                // Construct a new singleton card from the given template
                singletonCard = constructCard(templateCard);
            }
        } else {
            if (singletonCard.title !== templateCard.title) {
                // Repair any damage to the singleton card's title
                singletonCard.title = templateCard.title;
            } else if (singletonCard.keys !== templateCard.keys) {
                // Repair any damage to the singleton card's keys
                singletonCard.keys = templateCard.keys;
            }
            for (const card of excessCards) {
                // Erase all excess singleton card candidates
                eraseCard(card);
            }
            if (secondaryCard) {
                // A secondary card match cannot be allowed to persist
                eraseCard(getSingletonCard(false, secondaryCard));
            }
        }
        return singletonCard;
    }
    // Erases the given story card
    function eraseCard(badCard) {
        if (badCard === null) {
            return false;
        }
        badCard.title = "%@%";
        for (const [index, card] of storyCards.entries()) {
            if (card.title === "%@%") {
                removeStoryCard(index);
                return true;
            }
        }
        return false;
    }
    // Constructs a new story card from a standardized story card template object
    // {type: "", title: "", keys: "", entry: "", description: ""}
    // Returns a reference to the newly constructed card
    function constructCard(templateCard, insertionIndex = 0) {
        addStoryCard("%@%");
        for (const [index, card] of storyCards.entries()) {
            if (card.title !== "%@%") {
                continue;
            }
            card.type = templateCard.type;
            card.title = templateCard.title;
            card.keys = templateCard.keys;
            card.entry = templateCard.entry;
            card.description = templateCard.description;
            if (index !== insertionIndex) {
                // Remove from the current position and reinsert at the desired index
                storyCards.splice(index, 1);
                storyCards.splice(insertionIndex, 0, card);
            }
            return O.s(card);
        }
        return {};
    }
    function newCardIndex() {
        return +AC.config.pinConfigureCard;
    }
    function getIntendedCard(targetCard) {
        Internal.getUsedTitles(true);
        const titleKey = targetCard.trim().replace(/\s+/g, " ").toLowerCase();
        const autoCard = Internal.getCard(card => (card.entry
            .toLowerCase()
            .startsWith("{title: " + titleKey + "}")
        ));
        if (autoCard !== null) {
            return [autoCard, true, titleKey];
        }
        return [Internal.getCard(card => ((card.title
            .replace(/\s+/g, " ")
            .toLowerCase()
        ) === titleKey)), false, titleKey];
    }
    function doPlayerCommands(input) {
        let result = "";
        for (const command of (
            (function() {
                if (/^\n> [\s\S]*? says? "[\s\S]*?"\n$/.test(input)) {
                    return input.replace(/\s*"\n$/, "");
                } else {
                    return input.trimEnd();
                }
            })().split(/(?=\/\s*A\s*C)/i)
        )) {
            const prefixPattern = /^\/\s*A\s*C/i;
            if (!prefixPattern.test(command)) {
                continue;
            }
            const [requestTitle, requestDetails, requestEntry] = (command
                .replace(/(?:{\s*)|(?:\s*})/g, "")
                .replace(prefixPattern, "")
                .replace(/(?:^\s*\/*\s*)|(?:\s*\/*\s*$)/g, "")
                .split("/")
                .map(requestArg => requestArg.trim())
                .filter(requestArg => (requestArg !== ""))
            );
            if (!requestTitle) {
                // Request with no args
                AC.generation.cooldown = 0;
                result += "/AC -> Success!\n\n";
                logEvent("/AC");
            } else {
                const request = {title: requestTitle.replace(/\s*[\.\?!:]+$/, "")};
                const redo = (function() {
                    const redoPattern = /^(?:redo|retry|rewrite|remake)[\s\.\?!:,;"'—\)\]]+\s*/i;
                    if (redoPattern.test(request.title)) {
                        request.title = request.title.replace(redoPattern, "");
                        if (/^(?:all|every)(?:\s|\.|\?|!|:|,|;|"|'|—|\)|\]|$)/i.test(request.title)) {
                            return [];
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                })();
                if (Array.isArray(redo)) {
                    // Redo all auto cards
                    Internal.getUsedTitles(true);
                    const titleMatchPattern = /^{title: ([\s\S]*?)}/;
                    redo.push(...Internal.getCard(card => (
                        titleMatchPattern.test(card.entry)
                        && /{updates: (?:true|false), limit: \d+}/.test(card.description)
                    ), true));
                    let count = 0;
                    for (const card of redo) {
                        const titleMatch = card.entry.match(titleMatchPattern);  
                        if (titleMatch && Internal.redoCard(O.f({title: titleMatch[1]}), true, "")) {
                            count++;
                        }
                    }
                    const parsed = "/AC redo all";
                    result += parsed + " -> ";
                    if (count === 0) {
                        result += "There were no valid auto-cards to redo";
                    } else {
                        result += "Success!";
                        if (1 < count) {
                            result += " Proceed to redo " + count + " cards";
                        }
                    }
                    logEvent(parsed);
                } else if (!requestDetails) {
                    // Request with only title
                    submitRequest("");
                } else if (!requestEntry || redo) {
                    // Request with title and details
                    request.entryPromptDetails = requestDetails;
                    submitRequest(" / {" + requestDetails + "}");
                } else {
                    // Request with title, details, and entry
                    request.entryPromptDetails = requestDetails;
                    request.entryStart = requestEntry;
                    submitRequest(" / {" + requestDetails + "} / {" + requestEntry + "}");
                }
                result += "\n\n";
                function submitRequest(extra) {
                    O.f(request);
                    const [type, success] = (function() {
                        if (redo) {
                            return [" redo", Internal.redoCard(request, true, "")];
                        } else {
                            Internal.getUsedTitles(true);
                            return ["", Internal.generateCard(request)];
                        }
                    })();
                    const left = "/AC" + type + " {";
                    const right = "}" + extra;
                    if (success) {
                        const parsed = left + AC.generation.pending[AC.generation.pending.length - 1].title + right;
                        result += parsed + " -> Success!";
                        logEvent(parsed);
                    } else {
                        const parsed = left + request.title + right;
                        result += parsed + " -> \"" + request.title + "\" is invalid or unavailable";
                        logEvent(parsed);
                    }
                    return;
                }
            }
            if (isPendingGeneration() || isAwaitingGeneration() || isPendingCompression()) {
                if (AC.config.doAC) {
                    AC.signal.outputReplacement = "";
                } else {
                    AC.signal.forceToggle = true;
                    AC.signal.outputReplacement = ">>> please select \"continue\" (0%) <<<";
                }
            } else if (AC.generation.cooldown === 0) {
                if (0 < AC.database.titles.candidates.length) {
                    if (AC.config.doAC) {
                        AC.signal.outputReplacement = "";
                    } else {
                        AC.signal.forceToggle = true;
                        AC.signal.outputReplacement = ">>> please select \"continue\" (0%) <<<";
                    }
                } else if (AC.config.doAC) {
                    result = result.trimEnd() + "\n";
                    AC.signal.outputReplacement = "\n";
                } else {
                    AC.signal.forceToggle = true;
                    AC.signal.outputReplacement = ">>> Auto-Cards has been enabled! <<<";
                }
            } else {
                result = result.trimEnd() + "\n";
                AC.signal.outputReplacement = "\n";
            }
        }
        return getPrecedingNewlines() + result;
    }
    function advanceChronometer() {
        const currentTurn = getTurn();
        if (Math.abs(history.length - currentTurn) < 2) {
            // The two measures are within ±1, thus history hasn't been truncated yet
            AC.chronometer.step = !(history.length < currentTurn);
        } else {
            // history has been truncated, fallback to a (slightly) worse step detection technique
            AC.chronometer.step = (AC.chronometer.turn < currentTurn);
        }
        AC.chronometer.turn = currentTurn;
        return;
    }
    function concludeEmergency() {
        promoteAmnesia();
        endTurn();
        AC.message.pending = [];
        AC.message.previous = getStateMessage();
        return;
    }
    function concludeOutputBlock(templateCard) {
        if (AC.config.deleteAllAutoCards !== null) {
            // A config-initiated event to delete all previously generated story cards is in progress
            if (AC.config.deleteAllAutoCards) {
                // Request in-game confirmation from the player before proceeding
                AC.config.deleteAllAutoCards = false;
                CODOMAIN.initialize(getPrecedingNewlines() + ">>> please submit the message \"CONFIRM DELETE\" using a Do, Say, or Story action to permanently delete all previously generated story cards <<<\n\n");
            } else {
                // Check for player confirmation
                const previousAction = readPastAction(0);
                if (isDoSayStory(previousAction.type) && /CONFIRM\s*DELETE/i.test(previousAction.text)) {
                    let successMessage = "Confirmation Success: ";
                    const numCardsErased = Internal.eraseAllAutoCards();
                    if (numCardsErased === 0) {
                        successMessage += "However, there were no previously generated story cards to delete!";
                    } else {
                        successMessage += numCardsErased + " generated story card";
                        if (numCardsErased === 1) {
                            successMessage += " was";
                        } else {
                            successMessage += "s were";
                        }
                        successMessage += " deleted";
                    }
                    notify(successMessage);
                } else {
                    notify("Confirmation Failure: No story cards were deleted");
                }
                AC.config.deleteAllAutoCards = null;
                CODOMAIN.initialize("\n");
            }
        } else if (AC.signal.outputReplacement !== "") {
            const output = AC.signal.outputReplacement.trim();
            if (output === "") {
                CODOMAIN.initialize("\n");
            } else {
                CODOMAIN.initialize(getPrecedingNewlines() + output + "\n\n");
            }
        }
        if (templateCard) {
            // Auto-Cards was enabled or disabled during the previous onContext hook
            // Construct the replacement control card onOutput
            banTitle(templateCard.title);
            getSingletonCard(true, templateCard);
            AC.signal.swapControlCards = false;
        }
        endTurn();
        if (AC.config.LSIv2 === null) {
            postMessages();
        }
        return;
    }
    function endTurn() {
        AC.database.titles.used = [];
        AC.signal.outputReplacement = "";
        [AC.database.titles.pendingBans, AC.database.titles.pendingUnbans].map(pending => decrementAll(pending));
        if (0 < AC.signal.overrideBans) {
            AC.signal.overrideBans--;
        }
        function decrementAll(pendingArray) {
            if (pendingArray.length === 0) {
                return;
            }
            for (let i = pendingArray.length - 1; 0 <= i; i--) {
                if (0 < pendingArray[i][1]) {
                    pendingArray[i][1]--;
                } else {
                    pendingArray.splice(i, 1);
                }
            }
            return;
        }
        return;
    }
    // Example usage: notify("Message text goes here");
    function notify(message) {
        if (typeof message === "string") {
            AC.message.pending.push(message);
            logEvent(message);
        } else if (Array.isArray(message)) {
            message.forEach(element => notify(element));
        } else if (message instanceof Set) {
            notify([...message]);
        } else {
            notify(message.toString());
        }
        return;
    }
    function logEvent(message, uncounted) {
        if (uncounted) {
            log("Auto-Cards event: " + message);
        } else {
            log("Auto-Cards event #" + (function() {
                try {
                    AC.message.event++;
                    return AC.message.event;
                } catch {
                    return 0;
                }
            })() + ": " + message.replace(/"/g, "'"));
        }
        return;
    }
    // Provide the story card object which you wish to log info within as the first argument
    // All remaining arguments represent anything you wish to log
    function logToCard(logCard, ...args) {
        logEvent(args.map(arg => {
            if ((typeof arg === "object") && (arg !== null)) {
                return JSON.stringify(arg);
            } else {
                return String(arg);
            }
        }).join(", "), true);
        if (logCard === null) {
            return;
        }
        let desc = logCard.description.trim();
        const turnDelimiter = Words.delimiter + "\nAction #" + getTurn() + ":\n";
        let header = turnDelimiter;
        if (!desc.startsWith(turnDelimiter)) {
            desc = turnDelimiter + desc;
        }
        const scopesTable = [
            ["input", "Input Modifier"],
            ["context", "Context Modifier"],
            ["output", "Output Modifier"],
            [null, "Shared Library"],
            [undefined, "External API"],
            [Symbol("default"), "Unknown Scope"]
        ];
        const callingScope = (function() {
            const pair = scopesTable.find(([condition]) => (condition === HOOK));
            if (pair) {
                return pair[1];
            } else {
                return scopesTable[scopesTable.length - 1][1];
            }
        })();
        const hookDelimiterLeft = callingScope + " @ ";
        if (desc.startsWith(turnDelimiter + hookDelimiterLeft)) {
            const hookDelimiterOld = desc.match(new RegExp((
                "^" + turnDelimiter + "(" + hookDelimiterLeft + "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z:\n)"
            ).replaceAll("\n", "\\n")));
            if (hookDelimiterOld) {
                header += hookDelimiterOld[1];
            } else {
                const hookDelimiter = getNewHookDelimiter();
                desc = desc.replace(hookDelimiterLeft, hookDelimiter);
                header += hookDelimiter;
            }
        } else {
            if ((new RegExp("^" + turnDelimiter.replaceAll("\n", "\\n") + "(" + (scopesTable
                .map(pair => pair[1])
                .filter(scope => (scope !== callingScope))
                .join("|")
            ) + ") @ ")).test(desc)) {
                desc = desc.replace(turnDelimiter, turnDelimiter + "—————————\n");
            }
            const hookDelimiter = getNewHookDelimiter();
            desc = desc.replace(turnDelimiter, turnDelimiter + hookDelimiter);
            header += hookDelimiter;
        }
        const logDelimiter = (function() {
            let logDelimiter = "Log #";
            if (desc.startsWith(header + logDelimiter)) {
                desc = desc.replace(header, header + "———\n");
                const logCounter = desc.match(/Log #(\d+)/);
                if (logCounter) {
                    logDelimiter += (parseInt(logCounter[1], 10) + 1).toString();
                }
            } else {
                logDelimiter += "0";
            }
            return logDelimiter + ": ";
        })();
        logCard.description = limitString(desc.replace(header, header + logDelimiter + args.map(arg => {
            if ((typeof arg === "object") && (arg !== null)) {
                return stringifyObject(arg);
            } else {
                return String(arg);
            }
        }).join(",\n") + "\n").trim(), 999999);
        // The upper limit is actually closer to 3985621, but I think 1 million is reasonable enough as-is
        function getNewHookDelimiter() {
            return hookDelimiterLeft + (new Date().toISOString()) + ":\n";
        }
        return;
    }
    // Makes nested objects not look like cancer within interface cards
    function stringifyObject(obj) {
        const seen = new WeakSet();
        // Each indentation is 4 spaces
        return JSON.stringify(obj, (_key, value) => {
            if ((typeof value === "object") && (value !== null)) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            switch(typeof value) {
            case "function": {
                return "[Function]"; }
            case "undefined": {
                return "[Undefined]"; }
            case "symbol": {
                return "[Symbol]"; }
            default: {
                return value; }
            }
        }, 4);
    }
    // Implement state.message toasts without interfering with the operation of other possible scripts
    function postMessages() {
        const preMessage = getStateMessage();
        if ((preMessage === AC.message.previous) && (AC.message.pending.length !== 0)) {
            // No other scripts are attempting to update state.message during this turn
            // One or more pending Auto-Cards messages exist
            if (!AC.message.suppress) {
                // Message suppression is off
                let newMessage = "Auto-Cards:\n";
                if (AC.message.pending.length === 1) {
                    newMessage += AC.message.pending[0];
                } else {
                    newMessage += AC.message.pending.map(
                        (messageLine, index) => ("#" + (index + 1) + ": " + messageLine)
                    ).join("\n");
                }
                if (preMessage === newMessage) {
                    // Introduce a minor variation to facilitate repetition of the previous message toast
                    newMessage = newMessage.replace("Auto-Cards:\n", "Auto-Cards: \n");
                }
                state.message = newMessage;
            }
            // Clear the pending messages queue after posting or suppressing messages
            AC.message.pending = [];
        }
        AC.message.previous = getStateMessage();
        return;
    }
    function getStateMessage() {
        return state.message ?? "";
    }
    function getPrecedingNewlines() {
        const previousAction = readPastAction(0);
        if (isDoSay(previousAction.type)) {
            return "";
        } else if (previousAction.text.endsWith("\n")) {
            if (previousAction.text.endsWith("\n\n")) {
                return "";
            } else {
                return "\n";
            }
        } else {
            return "\n\n";
        }
    }
    // Call with lookBack 0 to read the most recent action in history (or n many actions back)
    function readPastAction(lookBack) {
        const action = (function() {
            if (Array.isArray(history)) {
                return (history[(function() {
                    const index = history.length - 1 - Math.abs(lookBack);
                    if (index < 0) {
                        return 0;
                    } else {
                        return index;
                    }
                })()]);
            } else {
                return O.f({});
            }
        })();
        return O.f({
            text: action?.text ?? (action?.rawText ?? ""),
            type: action?.type ?? "unknown"
        });
    }
    // Forget ongoing card generation/compression after passing or postponing completion over many consecutive turns
    // Also decrement AC.chronometer.postpone regardless of retries or erases
    function promoteAmnesia() {
        // Decrement AC.chronometer.postpone in all cases
        if (0 < AC.chronometer.postpone) {
            AC.chronometer.postpone--;
        }
        if (!AC.chronometer.step) {
            // Skip known retry/erase turns
            return;
        }
        if (AC.chronometer.amnesia++ < boundInteger(16, (2 * AC.config.addCardCooldown), 64)) {
            return;
        }
        AC.generation.cooldown = validateCooldown(underQuarterInteger(AC.config.addCardCooldown));
        forgetStuff();
        AC.chronometer.amnesia = 0;
        return;
    }
    function forgetStuff() {
        AC.generation.completed = 0;
        AC.generation.permitted = 34;
        AC.generation.workpiece = O.f({});
        // AC.generation.pending is not forgotten
        resetCompressionProperties();
        return;
    }
    function resetCompressionProperties() {
        AC.compression.completed = 0;
        AC.compression.titleKey = "";
        AC.compression.vanityTitle = "";
        AC.compression.responseEstimate = 1400;
        AC.compression.lastConstructIndex = -1;
        AC.compression.oldMemoryBank = [];
        AC.compression.newMemoryBank = [];
        return;
    }
    function underQuarterInteger(someNumber) {
        return Math.floor(someNumber / 4);
    }
    function getTurn() {
        if (Number.isInteger(info?.actionCount)) {
            // "But Leah, surely info.actionCount will never be negative?"
            // You have no idea what nightmares I've seen...
            return Math.abs(info.actionCount);
        } else {
            return 0;
        }
    }
    // Constructs a JSON representation of various properties/settings pulled from raw text
    // Used to parse the "Configure Auto-Cards" and "Edit to enable Auto-Cards" control card entries
    function extractSettings(settingsText) {
        const settings = {};
        // Lowercase everything
        // Remove all non-alphanumeric characters (aside from ":" and ">")
        // Split into an array of strings delimited by the ">" character
        const settingLines = settingsText.toLowerCase().replace(/[^a-z0-9:>]+/g, "").split(">");
        for (const settingLine of settingLines) {
            // Each setting line is preceded by ">" and bisected by ":"
            const settingKeyValue = settingLine.split(":");
            if ((settingKeyValue.length !== 2) || settings.hasOwnProperty(settingKeyValue[0])) {
                // The bisection failed or this setting line's key already exists
                continue;
            }
            // Parse boolean and integer setting values
            if (Words.falses.includes(settingKeyValue[1])) {
                // This setting line's value is false
                settings[settingKeyValue[0]] = false;
            } else if (Words.trues.includes(settingKeyValue[1])) {
                // This setting line's value is true
                settings[settingKeyValue[0]] = true;
            } else if (/^\d+$/.test(settingKeyValue[1])) {
                // This setting line's value is an integer
                // Negative integers are parsed as being positive (because "-" characters were removed)
                settings[settingKeyValue[0]] = parseInt(settingKeyValue[1], 10);
            }
        }
        // Return the settings object for later analysis
        return settings;
    }
    // Ensure the given singleton card is pinned near the top of the player's list of story cards
    function pinAndSortCards(pinnedCard) {
        if (!storyCards || (storyCards.length < 2)) {
            return;
        }
        storyCards.sort((cardA, cardB) => {
            return readDate(cardB) - readDate(cardA);
        });
        if (!AC.config.pinConfigureCard) {
            return;
        }
        const index = storyCards.indexOf(pinnedCard);
        if (0 < index) {
            storyCards.splice(index, 1);
            storyCards.unshift(pinnedCard);
        }
        function readDate(card) {
            if (card && card.updatedAt) {
                const timestamp = Date.parse(card.updatedAt);
                if (!isNaN(timestamp)) {
                    return timestamp;
                }
            }
            return 0;
        }
        return;
    }
    function see(arr) {
        return String.fromCharCode(...arr.map(n => Math.sqrt(n / 33)));
    }
    function formatTitle(title) {
        const input = title;
        let useMemo = false;
        if (
            (AC.database.titles.used.length === 1)
            && (AC.database.titles.used[0] === ("%@%"))
            && [used, forenames, surnames].every(nameset => (
                (nameset.size === 1)
                && nameset.has("%@%")
            ))
        ) {
            const pair = memoized.get(input);
            if (pair !== undefined) {
                if (50000 < memoized.size) {
                    memoized.delete(input);
                    memoized.set(input, pair);
                }
                return O.f({newTitle: pair[0], newKey: pair[1]});
            }
            useMemo = true;
        }
        title = title.trim();
        if (short()) {
            return end();
        }
        title = (title
            // Inner Self
            .slice(title.indexOf("\u200B") + 1)
            .replace(/\u200B-\u200D/g, "")
            // Localized Languages
            .replace(/[–。？！´؟،«»¿¡„“”「」…§，、\*_~><\(\)\[\]{}#"`:!—;\.\?,\s\\]/g, " ")
            // Fix contractions
            .replace(/[‘’]/g, "'").replace(/\s+'/g, " ")
            // Remove the words "I", "I'm", "I'd", "I'll", and "I've"
            .replace(/(?<=^|\s)(?:I|I'm|I'd|I'll|I've)(?=\s|$)/gi, "")
            // Remove "'s" only if not followed by a letter
            .replace(/'s(?![a-zA-Z])/g, "")
            // Replace "s'" with "s" only if preceded but not followed by a letter
            .replace(/(?<=[a-zA-Z])s'(?![a-zA-Z])/g, "s")
            // Remove apostrophes not between letters (preserve contractions like "don't")
            .replace(/(?<![a-zA-Z])'(?![a-zA-Z])/g, "")
            // Eliminate fake em dashes and terminal/leading dashes
            .replace(/\s-\s/g, " ")
            // Condense consecutive whitespace
            .trim().replace(/\s+/g, " ")
            // Remove a leading or trailing bullet
            .replace(/^-+\s*/, "").replace(/\s*-+$/, "")
        );
        if (short()) {
            return end();
        }
        // Special-cased words
        const minorWordsJoin = Words.minor.join("|");
        const leadingMinorWordsKiller = new RegExp("^(?:" + minorWordsJoin + ")\\s", "i");
        const trailingMinorWordsKiller = new RegExp("\\s(?:" + minorWordsJoin + ")$", "i");
        // Ensure the title is not bounded by any outer minor words
        title = enforceBoundaryCondition(title);
        if (short()) {
            return end();
        }
        // Ensure interior minor words are lowercase and excise all interior honorifics/abbreviations
        const honorAbbrevsKiller = new RegExp("(?:^|\\s|-|\\/)(?:" + (
            [...Words.honorifics, ...Words.abbreviations]
        ).map(word => word.replace(".", "")).join("|") + ")(?=\\s|-|\\/|$)", "gi");
        title = (title
            // Capitalize the first letter of each word
            .replace(/(?<=^|\s|-|\/)(?:\p{L})/gu, word => word.toUpperCase())
            // Lowercase minor words properly
            .replace(/(?<=^|\s|-|\/)(?:\p{L}+)(?=\s|-|\/|$)/gu, word => {
                const lowerWord = word.toLowerCase();
                if (Words.minor.includes(lowerWord)) {
                    return lowerWord;
                } else {
                    return word;
                }
            })
            // Remove interior honorifics/abbreviations
            .replace(honorAbbrevsKiller, "")
            .trim()
        );
        if (short()) {
            return end();
        }
        let titleWords = title.split(" ");
        while ((2 < title.length) && (98 < title.length) && (1 < titleWords.length)) {
            titleWords.pop();
            title = titleWords.join(" ").trim();
            const unboundedLength = title.length;
            title = enforceBoundaryCondition(title);
            if (unboundedLength !== title.length) {
                titleWords = title.split(" ");
            }
        }
        if (isUsedOrBanned(title) || isNamed(title)) {
            return end();
        }
        // Procedurally generated story card trigger keywords exclude certain words and patterns which are otherwise permitted in titles
        let key = title;
        const peerage = new Set(Words.peerage);
        if (titleWords.some(word => ((word === "the") || peerage.has(word.toLowerCase())))) {
            if (titleWords.length < 2) {
                return end();
            }
            key = enforceBoundaryCondition(
                titleWords.filter(word => !peerage.has(word.toLowerCase())).join(" ")
            );
            if (key.includes(" the ")) {
                key = enforceBoundaryCondition(key.split(" the ")[0]);
            }
            if (isUsedOrBanned(key)) {
                return end();
            }
        }
        function short() {
            return (title.length < 3);
        }
        function enforceBoundaryCondition(str) {
            while (leadingMinorWordsKiller.test(str)) {
                str = str.replace(/^\S+\s+/, "");
            }
            while (trailingMinorWordsKiller.test(str)) {
                str = str.replace(/\s+\S+$/, "");
            }
            return str;
        }
        function end(newTitle = "", newKey = "") {
            if (useMemo) {
                memoized.set(input, [newTitle, newKey]);
                if (30000 < memoized.size) {
                    memoized.delete(memoized.keys().next().value);
                }
            }
            return O.f({newTitle, newKey});
        }
        return end(title, key);
    }
    // I really hate english grammar
    function checkPlurals(title, predicate) {
        function check(t) { return ((t.length < 3) || (100 < t.length) || predicate(t)); }
        const t = title.toLowerCase();
        if (check(t)) { return true; }
        // s>p : singular -> plural : p>s: plural -> singular
        switch(t[t.length - 1]) {
        // p>s : s -> _ : Birds -> Bird
        case "s": if (check(t.slice(0, -1))) { return true; }
        case "x":
        // s>p : s, x, z -> ses, xes, zes : Mantis -> Mantises
        case "z": if (check(t + "es")) { return true; }
            break;
        // s>p : o -> oes, os : Gecko -> Geckoes, Geckos
        case "o": if (check(t + "es") || check(t + "s")) { return true; }
            break;
        // p>s : i -> us : Cacti -> Cactus
        case "i": if (check(t.slice(0, -1) + "us")) { return true; }
        // s>p : i, y -> ies : Kitty -> Kitties
        case "y": if (check(t.slice(0, -1) + "ies")) { return true; }
            break;
        // s>p : f -> ves : Wolf -> Wolves
        case "f": if (check(t.slice(0, -1) + "ves")) { return true; }
        // s>p : !(s, x, z, i, y) -> +s : Turtle -> Turtles
        default: if (check(t + "s")) { return true; }
            break;
        } switch(t.slice(-2)) {
        // p>s : es -> _ : Foxes -> Fox
        case "es": if (check(t.slice(0, -2))) { return true; } else if (
            (t.endsWith("ies") && (
                // p>s : ies -> y : Bunnies -> Bunny
                check(t.slice(0, -3) + "y")
                // p>s : ies -> i : Ravies -> Ravi
                || check(t.slice(0, -2))
            // p>s : es -> is : Crises -> Crisis
            )) || check(t.slice(0, -2) + "is")) { return true; }
            break;
        // s>p : us -> i : Cactus -> Cacti
        case "us": if (check(t.slice(0, -2) + "i")) { return true; }
            break;
        // s>p : is -> es : Thesis -> Theses
        case "is": if (check(t.slice(0, -2) + "es")) { return true; }
            break;
        // s>p : fe -> ves : Knife -> Knives
        case "fe": if (check(t.slice(0, -2) + "ves")) { return true; }
            break;
        case "sh":
        // s>p : sh, ch -> shes, ches : Fish -> Fishes
        case "ch": if (check(t + "es")) { return true; }
            break;
        } return false;
    }
    function isUsedOrBanned(title) {
        function isUsed(lowerTitle) {
            if (used.size === 0) {
                const usedTitles = Internal.getUsedTitles();
                for (let i = 0; i < usedTitles.length; i++) {
                    used.add(usedTitles[i].toLowerCase());
                }
                if (used.size === 0) {
                    // Add a placeholder so compute isn't wasted on additional checks during this hook
                    used.add("%@%");
                }
            }
            return used.has(lowerTitle);
        }
        return checkPlurals(title, t => (isUsed(t) || isBanned(t)));
    }
    function isBanned(lowerTitle, getUsedIsExternal) {
        if (bans.size === 0) {
            // In order to save space, implicit bans aren't listed within the UI
            const controlVariants = getControlVariants();
            const dataVariants = getDataVariants();
            const bansToAdd = [...lowArr([
                ...Internal.getBannedTitles(),
                controlVariants.enable.title.replace("\n", ""),
                controlVariants.enable.keys,
                controlVariants.configure.title.replace("\n", ""),
                controlVariants.configure.keys,
                dataVariants.debug.title,
                dataVariants.debug.keys,
                dataVariants.critical.title,
                dataVariants.critical.keys,
                ...Object.values(Words.reserved)
            ]), ...(function() {
                if (shouldProceed() || getUsedIsExternal) {
                    // These proper nouns are way too common to waste card generations on; they already exist within the AI training data so this would be pointless
                    return [...Words.entities, ...Words.undesirables.map(undesirable => see(undesirable))];
                } else {
                    return [];
                }
            })()];
            for (let i = 0; i < bansToAdd.length; i++) {
                bans.add(bansToAdd[i]);
            }
        }
        return bans.has(lowerTitle);
    }
    function isNamed(title, returnSurname) {
        const peerage = new Set(Words.peerage);
        const minorWords = new Set(Words.minor);
        if ((forenames.size === 0) || (surnames.size === 0)) {
            const usedTitles = Internal.getUsedTitles();
            for (let i = 0; i < usedTitles.length; i++) {
                const usedTitleWords = divideTitle(usedTitles[i]);
                if (
                    (usedTitleWords.length === 2)
                    && (2 < usedTitleWords[0].length)
                    && (2 < usedTitleWords[1].length)
                ) {
                    forenames.add(usedTitleWords[0]);
                    surnames.add(usedTitleWords[1]);
                } else if (
                    (usedTitleWords.length === 1)
                    && (2 < usedTitleWords[0].length)
                ) {
                    forenames.add(usedTitleWords[0]);
                }
            }
            if (forenames.size === 0) {
                forenames.add("%@%");
            }
            if (surnames.size === 0) {
                surnames.add("%@%");
            }
        }
        const titleWords = divideTitle(title);
        if (
            returnSurname
            && (titleWords.length === 2)
            && (3 < titleWords[0].length)
            && (3 < titleWords[1].length)
            && forenames.has(titleWords[0])
            && surnames.has(titleWords[1])
        ) {
            return (title
                .split(" ")
                .find(casedTitleWord => (casedTitleWord.toLowerCase() === titleWords[1]))
            );
        } else if (
            (titleWords.length === 2)
            && (2 < titleWords[0].length)
            && (2 < titleWords[1].length)
            && forenames.has(titleWords[0])
        ) {         
            return true;
        } else if (
            (titleWords.length === 1)
            && (2 < titleWords[0].length)
            && (forenames.has(titleWords[0]) || surnames.has(titleWords[0]))
        ) {
            return true;
        }
        function divideTitle(undividedTitle) {
            const titleWords = undividedTitle.toLowerCase().split(" ");
            if (titleWords.some(word => minorWords.has(word))) {
                return [];
            } else {
                return titleWords.filter(word => !peerage.has(word));
            }
        }
        return false;
    }
    function shouldProceed() {
        return (AC.config.doAC && !AC.signal.emergencyHalt && (AC.chronometer.postpone < 1));
    }
    function isDoSayStory(type) {
        return (isDoSay(type) || (type === "story"));
    }
    function isDoSay(type) {
        return ((type === "do") || (type === "say"));
    }
    function permitOutput() {
        return ((AC.config.deleteAllAutoCards === null) && (AC.signal.outputReplacement === ""));
    }
    function isAwaitingGeneration() {
        return (0 < AC.generation.pending.length);
    }
    function isPendingGeneration() {
        return notEmptyObj(AC.generation.workpiece);
    }
    function isPendingCompression() {
        return (AC.compression.titleKey !== "");
    }
    function notEmptyObj(obj) {
        return (obj && (0 < Object.keys(obj).length));
    }
    function clearTransientTitles() {
        AC.database.titles.used = [];
        [used, forenames, surnames].forEach(nameset => nameset.clear());
        return;
    }
    function banTitle(title, isFinalAssignment) {
        title = limitString(title.replace(/\s+/g, " ").trim(), 100);
        const lowerTitle = title.toLowerCase();
        if (bans.size !== 0) {
            bans.add(lowerTitle);
        }
        if (!lowArr(Internal.getBannedTitles()).includes(lowerTitle)) {
            AC.database.titles.banned.unshift(title);
            if (isFinalAssignment) {
                return;
            }
            AC.database.titles.pendingBans.unshift([title, 3]);
            const index = AC.database.titles.pendingUnbans.findIndex(pair => (pair[0].toLowerCase() === lowerTitle));
            if (index !== -1) {
                AC.database.titles.pendingUnbans.splice(index, 1);
            }
        }
        return;
    }
    function unbanTitle(title) {
        title = title.replace(/\s+/g, " ").trim();
        const lowerTitle = title.toLowerCase();
        if (used.size !== 0) {
            bans.delete(lowerTitle);
        }
        let index = lowArr(Internal.getBannedTitles()).indexOf(lowerTitle);
        if (index !== -1) {
            AC.database.titles.banned.splice(index, 1);
            AC.database.titles.pendingUnbans.unshift([title, 3]);
            index = AC.database.titles.pendingBans.findIndex(pair => (pair[0].toLowerCase() === lowerTitle));
            if (index !== -1) {
                AC.database.titles.pendingBans.splice(index, 1);
            }
        }
        return;
    }
    function lowArr(arr) {
        return arr.map(str => str.toLowerCase());
    }
    function getControlVariants() {
        return O.f({
            configure: O.f({
                title: "Configure \nAuto-Cards",
                keys: "Edit the entry above to adjust your story card automation settings",
            }),
            enable: O.f({
                title: "Edit to enable \nAuto-Cards",
                keys: "Edit the entry above to enable story card automation",
            }),
        });
    }
    function getDataVariants() {
        return O.f({
            debug: O.f({
                title: "Debug Data",
                keys: "You may view the debug state in the notes section below",
            }),
            critical: O.f({
                title: "Critical Data",
                keys: "Never modify or delete this story card",
            }),
        });
    }
    // Prepare to export the codomain
    const codomain = CODOMAIN.read();
    const [stopPackaged, lastCall] = (function() {
        // Tbh I don't know why I even bothered going through the trouble of implementing "stop" within LSIv2
        switch(HOOK) {
        case "context": {
            const haltStatus = [];
            if (Array.isArray(codomain)) {
                O.f(codomain);
                haltStatus.push(true, codomain[1]);
            } else {
                haltStatus.push(false, STOP);
            }
            if ((AC.config.LSIv2 !== false) && (haltStatus[1] === true)) {
                // AutoCards will return [text, (stop === true)] onContext
                // The onOutput lifecycle hook will not be executed during this turn
                concludeEmergency();
            }
            return haltStatus; }
        case "output": {
            // AC.config.LSIv2 being either true or null implies (lastCall === true)
            return [null, AC.config.LSIv2 ?? true]; }
        default: {
            return [null, null]; }
        }
    })();
    // Repackage AC to propagate its state forward in time
    if (state.LSIv2) {
        // Facilitates recursive calls of AutoCards
        // The Auto-Cards external API is accessible through the LSIv2 scope
        state.LSIv2 = AC;
    } else {
        const memoryOverflow = (38000 < (JSON.stringify(state).length + JSON.stringify(AC).length));
        if (memoryOverflow) {
            // Memory overflow is imminent
            const dataVariants = getDataVariants();
            if (lastCall) {
                unbanTitle(dataVariants.debug.title);
                banTitle(dataVariants.critical.title);
            }
            setData(dataVariants.critical, dataVariants.debug);
            if (state.AutoCards) {
                // Decouple state for safety
                delete state.AutoCards;
            }
        } else {
            if (lastCall) {
                const dataVariants = getDataVariants();
                unbanTitle(dataVariants.critical.title);
                if (AC.config.showDebugData) {
                    // Update the debug data card
                    banTitle(dataVariants.debug.title);
                    setData(dataVariants.debug, dataVariants.critical);
                } else {
                    // There should be no data card
                    unbanTitle(dataVariants.debug.title);
                    if (data === null) {
                        data = getSingletonCard(false, O.f({...dataVariants.debug}), O.f({...dataVariants.critical}));
                    }
                    eraseCard(data);
                    data = null;
                }
            } else if (AC.config.showDebugData && (HOOK === undefined)) {
                const dataVariants = getDataVariants();
                setData(dataVariants.debug, dataVariants.critical);
            }
            // Save a backup image to state
            state.AutoCards = AC;
        }
        function setData(primaryVariant, secondaryVariant) {
            const dataCardTemplate = O.f({
                type: AC.config.defaultCardType,
                title: primaryVariant.title,
                keys: primaryVariant.keys,
                entry: (function() {
                    const mutualEntry = (
                        "If you encounter an Auto-Cards bug or otherwise wish to help me improve this script by sharing your configs and game data, please send me the notes text found below. You may ping me @LewdLeah through the official AI Dungeon Discord server. Please ensure the content you share is appropriate for the server, otherwise DM me instead. 😌"
                    );
                    if (memoryOverflow) {
                        return (
                            "Seeing this means Auto-Cards detected an imminent memory overflow event. But fear not! As an emergency fallback, the full state of Auto-Cards' data has been serialized and written to the notes section below. This text will be deserialized during each lifecycle hook, therefore it's absolutely imperative that you avoid editing this story card!"
                        ) + (function() {
                            if (AC.config.showDebugData) {
                                return "\n\n" + mutualEntry;
                            } else {
                                return "";
                            }
                        })();
                    } else {
                        return (
                            "This story card displays the full serialized state of Auto-Cards. To remove this card, simply set the \"log debug data\" setting to false within your \"Configure\" card. "
                        ) + mutualEntry;
                    }
                })(),
                description: JSON.stringify(AC)
            });
            if (data === null) {
                data = getSingletonCard(true, dataCardTemplate, O.f({...secondaryVariant}));
            }
            for (const propertyName of ["title", "keys", "entry", "description"]) {
                if (data[propertyName] !== dataCardTemplate[propertyName]) {
                    data[propertyName] = dataCardTemplate[propertyName];
                }
            }
            const index = storyCards.indexOf(data);
            if ((index !== -1) && (index !== (storyCards.length - 1))) {
                // Ensure the data card is always at the bottom of the story cards list
                storyCards.splice(index, 1);
                storyCards.push(data);
            }
            return;
        }
    }
    // This is the only return point within the parent scope of AutoCards
    if (stopPackaged === false) {
        return [codomain, STOP];
    } else {
        return codomain;
    }
} function isolateLSIv2(code, log, text, stop) { const console = Object.freeze({log}); try { eval(code); return [null, text, stop]; } catch (error) { return [error, text, stop]; } }

// Your other library scripts go here
