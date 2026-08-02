<p align="center">
  <img src="./assets/cover1.png" width="800">
</p>

# Chronicle 📜
### *A world that remembers, for stories that go long*
Built on [Inner Self](https://github.com/LewdLeah/Inner-Self) by LewdLeah ❤️

---

## Overview

Chronicle is an AI Dungeon mod that lets the characters in your story keep their own memories, and lets the world around them keep track of itself. Characters form private thoughts, revise them, and act on them. The world keeps a date, a place, an arc, and a list of who owes what to whom. Clocks fill as pressure builds, and the things they set in motion come back later.

It is built for adventures that run for hundreds of turns, so the thing it protects hardest is your history. Nothing a character learns is written down until the response it came from is really part of your story. Retry as often as you like: the version you threw away leaves no trace in anyone's memory.

Everything past the basics is off when you install it. Turn on what you want, one at a time.

---

## What this is, next to Inner Self

Chronicle is a fork of [Inner Self v1.0.2](https://github.com/LewdLeah/Inner-Self), and Inner Self is still the engine underneath: the trigger system, the prompts that ask a character to think, the label encoding that ties a thought to the moment it mattered, the brain card format, and the bundled Auto-Cards integration are all LewdLeah's work, kept as they were.

Inner Self gives individual characters memory. Chronicle keeps that and adds the parts a long story needs around it:

- **World state** — a date, a location, an arc, faction standing, open debts and threats, on a card you can edit.
- **In-game time** — a calendar that moves when the story says it moves, not once per turn.
- **A knowledge model** — who witnessed what, and what they still wrongly believe because they were not there.
- **Clocks and consequences** — pressure that fills on triggers you declare, and events that surface later.
- **A transaction ledger** — every one of those writes is staged and only committed once the generation that produced it survives into your story, so a retry cannot corrupt a memory, a clock, or the calendar.

With every module switched off, Chronicle produces byte-for-byte the same output Inner Self does. That is asserted in the test harness against upstream, over a 300 turn replay.

---

## Main Features

| Feature | Description |
|:--------|:------------|
| **Segmented Memory** | Each NPC keeps their own private thoughts, separate from other characters |
| **Self-Organizing Thoughts** | Characters revise, prune and maintain their own mental state |
| **Retry-Safe** | Retrying or erasing a response discards everything it wrote, memories and world alike |
| **Zero Immersion Breaks** | Absolutely NO "please select continue" messages (!!!) |
| **Real-Time Brain Editor** | View or edit any NPC brain in the associated story card notes |
| **Pinned Core Memories** | Protect a defining thought so nothing may ever forget it |
| **World Chronicle** | Date, place, arc, standing, debts and threats, on a card that outranks the script |
| **Clocks & Consequences** | Author your own progress tracks and the events they set off |
| **Knowledge & Rumour** | Characters act on what they saw, and stay wrong about the rest |
| **Player Console** | `/state`, `/who`, `/pin`, `/undo`, `/diag` and more, in game |
| **Context-Aware** | Every injection scales to the context your model and tier actually give you |
| **Auto-Cards Integration** | Bundled unmodified, enable it whenever you like (optional) |

---

## Model compatibility

**Read this before installing.** It decides whether the mod works at all for you.

### Supported and tuned

DeepSeek V3.2 · Dynamic DeepSeek · Gemma 31B · GLM 5.1

Everything else is best effort. Chronicle asks the model to answer in a small parenthetical format, and models differ enormously in how reliably they do that.

### Atlas and Raven do not work

They are cache-efficient models and do not support all scripting functions. Chronicle cannot inject anything into their context, **no configuration fixes it, and the script has no way to detect which model you are using.** Upstream Inner Self warns players off these two for the same reason. If you play Atlas or Raven, this mod has nothing to give you.

Module M can detect that injections are being discarded and will say so in a message, but detecting it is all it can do.

### Optimized Context must be off

Gemma 31B and GLM 5.1 offer an Optimized Context toggle. With it **on**, the context hook may become read-only: everything Chronicle writes is silently thrown away, and your world simulation quietly does nothing.

The honest trade: turning Optimized Context **off** roughly halves the context those models give you, so Chronicle has less room to work in. Leaving it **on** gives you the room and then disables the thing you wanted the room for. Off is the right answer for this mod.

Enable Module M and Chronicle will check the channel for you — it asks the model to begin one reply in twelve with `(ok)`, and after three misses in a row it concludes the channel is closed, moves the world block to `state.memory.frontMemory`, and tells you once what the setting is costing you. But you should know before you install rather than after.

### What you get at each context size

With **Module K** on, `info.maxChars` is read every single turn and mapped to a profile. These are the values in `BUDGET_TABLE` at the top of the module, which is the only place they exist:

| Profile | `maxChars` | World block | Full brains | Digests | Witness lines | Clock lines | Audit | Chronicle's share |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| **XS** | under 12,000 | 350 ch | 1 | off | off | 1 | off | 12% |
| **S** | 12,000–32,000 | 500 ch | 1 | 2 | off | 1 | every 150 turns | 20% |
| **M** | 32,000–80,000 | 700 ch | 2 | 3 | 1 | 2 | every 100 turns | 30% |
| **L** | 80,000–200,000 | 700 ch | 3 | 4 | 2 | all | every 75 turns | 35% |
| **XL** | over 200,000 | 900 ch | 4 | all | all | all | every 75 turns | 40% |

A profile only ever takes away — your own settings stay the ceiling. If a turn would still overrun its share, features are given up in a fixed order rather than all shaved evenly: **audit → witness lines → digests → extra brains → bond note → clock detail → world block**, down to a floor the world never goes below. Losing the audit entirely beats keeping half of everything.

Two things worth knowing:

- **GLM can land at XS even on a high tier.** Its range starts at 4K, and the Optimized Context toggle halves it again. Do not assume your subscription tier decides your profile.
- **GLM's credit extension is charged per action**, so the number moves turn to turn inside one adventure. Chronicle re-reads it every turn and never caches it, needs two consecutive turns at a new size before switching so a flicker cannot thrash your feature set, and shows the current profile and the last change in `/diag`.

Without Module K, budgets are simply whatever you set on the config card, whatever context you have.

---

## Scenario Script Install Guide
1. Use the [AI Dungeon website](https://aidungeon.com/) on PC (or view as desktop if mobile-only)
2. [Create a new scenario](https://help.aidungeon.com/faq/what-are-scenarios) or edit an existing scenario
3. Open the `DETAILS` tab at the top while editing your scenario
4. Scroll down to `Scripting` and toggle ON → `Scripts Enabled`
5. Select `EDIT SCRIPTS`
6. Select the `Input` tab on the left
7. Delete all code within said tab
8. Copy and paste the following code into your empty `Input` tab:
```javascript
// Your "Input" tab should look like this
Chronicle("input");
const modifier = (text) => {
  // Any other input modifier scripts can go here
  return { text };
};
modifier(text);
```
9. Select the `Context` tab on the left
10. Delete all code within said tab
11. Copy and paste the following code into your empty `Context` tab:
```javascript
// Your "Context" tab should look like this
Chronicle("context");
const modifier = (text) => {
  // Any other context modifier scripts can go here
  return { text, stop };
};
modifier(text);
```
12. Select the `Output` tab on the left
13. Delete all code within said tab
14. Copy and paste the following code into your empty `Output` tab:
```javascript
// Your "Output" tab should look like this
Chronicle("output");
const modifier = (text) => {
  // Any other output modifier scripts can go here
  return { text };
};
modifier(text);
```
15. Select the `Library` tab on the left
16. Delete all code within said tab
17. Open the Library code (hyperlink below) in a new browser tab
- [Library code](./src/library.js)
18. Copy the *full* code from the page above and paste into your empty `Library` tab
19. Click the big yellow `SAVE` button in the top right corner

### *And you're done!*

All adventures played from your scenario will now include Chronicle (even existing adventures)

<sub>Remember to read the in-game config card! It is called "Configure Chronicle".</sub>

<details>
<summary><b>Already running Inner Self? (click to expand)</b></summary>

You only need to replace the `Library` tab. Your hook tabs can keep calling `InnerSelf("input")` and friends — the library defines that name as an alias, so nothing breaks. Update them to `Chronicle(...)` whenever you feel like it, or never.

Your existing adventures carry over with no data loss: the config card is found under its old name and renamed in place, every setting you chose is preserved, brains are untouched, and the thought label counter continues where it was. See **[MIGRATION.md](./MIGRATION.md)** for the details, including the one kind of key name that can be dropped.

</details>

---

## Gameplay Tips

- Read the in-game config card to learn how to easily add NPCs
- Set response length to 200 tokens if you notice short or empty outputs
- Enable scripts if you don't see a config card (homepage > settings > gameplay)
- Retry freely — a response you throw away leaves nothing behind in anyone's memory
- Turn Optimized Context off if your model offers it (see [Model compatibility](#model-compatibility))
- Protect your mental health: Chronicle is intended to be a narrative experience only
- Plot components matter because the AI sees them when writing thoughts
- Different story models manage brains differently
- But avoid Atlas and Raven models for this one 😅

### Suggested play order

Modules interact, and the ones that ask more of the model are the ones that break first. A gentle ramp:

1. **Turns 1–50: nothing but the basics.** The ledger (Module A) is already on and needs no setup. Turn on **B** for pinned memories, and **L**, then watch `/diag` every so often. If the compliance band holds at *healthy*, your model can follow the format.
2. **Once the band holds: add C and J.** The world card gives you a date and a place; diagnostics start watching state size and hook timings for you.
3. **Around turn 100: add E and F.** By then there is enough history for witnessed events and stale beliefs to mean something, and enough plot for a clock to be worth authoring.
4. **Add D last, and only at Mythic context or above.** Concurrent brains are where format compliance breaks first: more characters in the prompt means more for the model to get wrong, and a small context makes it worse.
5. **On DeepSeek, Gemma or GLM, turn K, M and N on at any point.** They only ever protect you.

---

## Player console

Turn on **"Enable player commands like /help and /undo"**, then type these as ordinary input.

| Command | Does |
|:--|:--|
| `/help` | Lists these commands |
| `/state` | The world as Chronicle sees it |
| `/clocks` | Progress clocks and what is queued |
| `/bonds` | Where each character stands with you |
| `/who` | Who is present and how the context is split |
| `/pin <name> <key>` | Protect a thought from ever being forgotten |
| `/unpin <name> <key>` | Let it be forgotten again |
| `/forget <name> <key>` | Delete a thought now |
| `/undo` | Revert the last committed change |
| `/date <value>` | Set the in-game date |
| `/audit` | Run a continuity check on the next turn |
| `/diag` | Context profile, compliance band, whether injections are landing, per-module cost, state size, timings, recent transactions |

A command answers you in a message and stops the turn, so no generation is spent on it. Anything else beginning with `/` falls through to the story untouched.

**Commands AI Dungeon owns are deliberately never registered.** `/reset` and its neighbours are listed in `NATIVE_COMMANDS` inside Module H, and Chronicle stands aside for every one of them. That list cannot be verified from inside a script, so it is a deliberately wide guess:

```
reset, retry, revert, erase, redo, undoall, alter, remember, note, continue,
do, say, story, see, image, settings, quit, exit, save, load, ac
```

If your scenario needs one of those words as a story action, or you know the platform does not claim it, narrow the list — it is a plain array near the top of Module H.

---

## Module reference

Everything except the ledger is off until you turn it on. Settings below are the labels as they appear on the "Configure Chronicle" card.

| | Module | What you notice in play | Default |
|:--|:--|:--|:--|
| **A** | Transaction ledger | Retrying leaves no trace | **always on** |
| **B** | Tiered memory | Characters stop forgetting what defines them | off |
| **C** | World chronicle | A date and a place that persist | off |
| **D** | Ensemble | Everyone in the room thinks, not just one | off |
| **E** | Knowledge model | Characters are wrong about things they missed | off |
| **F** | Clocks | Pressure builds, then pays off later | off |
| **G** | Continuity auditor | You get told when the story contradicts itself | off |
| **H** | Player console | Slash commands work | off |
| **I** | Bonds | Relationships move one rung at a time | off |
| **J** | Diagnostics | State and timings stay under control | off |
| **K** | Budget autoscaling | The mod fits whatever context you have | off |
| **L** | Compliance monitor | Chronicle stops nagging a model that cannot answer | off |
| **M** | Injection canary | You find out if Optimized Context is eating your world | off |
| **N** | Lean emission | Prompts get short when room is tight | off |

### A — Transaction ledger

Nothing is written to a story card during the turn that produced it. The turn's changes are staged, then committed on your next action, once the generation they came from can be proven to be in your history.

**You notice:** retrying no longer leaves a thought behind from the version you discarded, and a retried response is free to think its own thought. Every other module writes through this ledger too, so a retry cannot leave a clock advanced or the calendar moved.
**Settings:** none. It is a bug fix, not a feature, and it is always on.
**Small print:** a thought appears on the brain card one action later than it used to. The model never sees the difference, because the commit happens before the next context is built.

### B — Tiered memory

*Setting: **Tiered memory with pinned core thoughts***

Thoughts sit in three tiers. **Core** thoughts are pinned and are never evicted, never renamed and never deleted, even when the model explicitly asks. **Long-term** thoughts have earned their place by being linked to the story often enough, and can only be merged, never dropped. **Working** thoughts are everything else, and are evicted coldest-first when a brain outgrows its budget.

**You notice:** a character stops losing the thing that defines them at turn 400. Pin a thought with `/pin`, or by putting `#` in front of its key in the card notes. Each character is also seeded with one pinned fact taken from their own story card the first time they think, stored as `#defining_fact`.
**Settings:** *Maximum pinned core thoughts per character* (default 5) · *Maximum characters of thought per brain* (default 4000) · *Story links before a thought becomes long-term* (default 2).
**Small print:** when only long-term thoughts remain, Chronicle spends a turn asking the model to merge the two coldest into one. Going over the pin limit demotes the coldest pins rather than deleting them.

### C — World chronicle

*Setting: **Track world state (date, place, arc, factions)***

A story card called "Chronicle" holds the in-game date, location, active arc, faction standing, open debts, open threats, and what has been lost to memory. A short block of it is injected above the character brains every turn.

**You notice:** the narrator stops forgetting where you are and what day it is. Edit the card and Chronicle believes you over its own memory, immediately.
**Settings:** *Maximum characters of world state per turn* (default 700) · *In-game date the adventure began on* (default "Day 1") · *Maximum days one turn may advance* (default 30).
**Small print:** the calendar moves on narrative phrasing, from an editable table (`TIME_TABLE`) mapping things like "the next morning" or "a fortnight later" to days. An explicit `[+3 days]` marker in the text is trusted past the per-turn cap. When the block does not fit, whole lines are dropped by priority; nothing is cut mid-sentence.

### D — Ensemble

*Setting: **Let several present characters think at once***

Presence means acting or speaking in the last two actions, not being mentioned. "Leah sets down the ledger" is present; "the letter from Silas" is not.

**You notice:** in a three-character scene, all three have minds instead of one having a mind and two being furniture. Everyone present shares the same context budget rather than one of them taking it all; anyone triggered but crowded out gets a one-line digest.
**Settings:** *Maximum full brains sharing one context* (default 3).
**Small print:** thought *writing* stays one character per turn, rotated and weighted toward whoever spoke last. This is the most demanding module — see the [suggested play order](#suggested-play-order).

### E — Knowledge model

*Setting: **Track who witnessed what, and what they still believe***

A byte-capped log of what happened and who was there. When a character's context is built they are told what they did **not** witness, and any fact they last knew in an older form is injected as what they still believe.

**You notice:** a character walks in and confidently acts on information that stopped being true while they were away. That is the feature, not a bug.
**Settings:** *Maximum characters of witnessed event log* (default 3000) · *Chance per turn that a secret spreads to someone* (default 10%).
**Small print:** facts carry a visibility class — public, household, private, sealed — and spread at a rate set by the class times your setting. Sealed facts never move on their own; someone has to carry them.

### F — Clocks and consequences

*Setting: **Track progress clocks and scheduled consequences***

You author clocks on a "Chronicle Clocks" card. A clock advances only when the trigger phrase you declared appears in the turn's prose. Never on atmosphere. When it fills it queues its consequence, then resets or locks.

**You notice:** the tension you are writing has a number attached, visible in the world block and in `/clocks`, and the thing it promised actually arrives.
**Settings:** none beyond the on/off switch; the clocks themselves live on the card.
**Small print:** a queued consequence can wait for a phrase as well as a turn, which is what lets a letter intercepted early arrive in the wrong hands much later.

<details>
<summary><b>Clock card format (click to expand)</b></summary>

```
silas_war: 3/8
  trigger: the watch searches the barge
  consequence: Silas moves against the watch openly
  after: (optional) a phrase the story must reach first
  reset: false
```

`trigger` is matched case-insensitively as plain text against the turn's prose. `consequence` is injected as a directive when the clock fills. `after` holds the consequence back until that phrase appears in recent history. `reset: true` empties the clock so it can fill again; otherwise it locks once spent.

The card is created with one worked example the first time you enable the module.

</details>

### G — Continuity auditor

*Setting: **Run periodic continuity audits***

Every so often, one thought-formation slot is spent on a verification task instead: the model compares the scene against the world card and reports the clearest contradiction, or says there is none.

**You notice:** an occasional message telling you the ledger says one thing and the scene says another, plus a "Chronicle Continuity Log" card that keeps the findings.
**Settings:** *Turns between continuity audits* (default 75).
**Small print:** it reports and never repairs. A confident wrong correction does more damage to a long story than a flagged inconsistency.

### H — Player console

*Setting: **Enable player commands like /help and /undo***

See the [console reference](#player-console) above.

**You notice:** you can ask the mod what it thinks, and tell it when it is wrong.
**Settings:** just the switch.

### I — Bonds

*Setting: **Track relationship bonds with the player***

Seven rungs: unknown → noticed → sought out → trusted with something costly → defended publicly → privately committed → formally bound. One rung at a time, never skipped upward. A betrayal may cost several at once.

**You notice:** relationships that cannot be rushed, and a standing stated inside the character's own head rather than shouted at them from outside.
**Settings:** *Minimum turns between bond advances* (default 150).
**Small print:** the model records an advance in the same parenthetical grammar it uses for thoughts, read by the same parser. The standing is stored on the character's own card under `#bond`, where you can edit it by hand — and if you do, your edit wins.

### J — Diagnostics and safety rails

*Setting: **Enable diagnostics and safety rails***

Watches the saved state size, warning at 60% of budget and trimming at 85% by dropping the most expendable things first; skips optional work rather than risking a hook timeout; caches a card index so a large adventure does not pay for a full scan every turn; and keeps a "Chronicle Diagnostics" card summarising the last twenty transactions.

**You notice:** mostly nothing, which is the point. `/diag` gets more informative.
**Settings:** *Milliseconds a hook may spend before skipping extras* (default 1200) · *Maximum characters of saved adventure state* (default 40000).

### K — Runtime budget autoscaling

*Setting: **Scale injections to the context the model has***

Reads `info.maxChars` every turn and maps it to a profile, then derives every injection budget from that. See [what you get at each context size](#what-you-get-at-each-context-size).

**You notice:** the world block gets shorter and the audit stops when your context shrinks, instead of everything being truncated at random. `/diag` names the current profile and the last change.
**Settings:** just the switch; the profile table is `BUDGET_TABLE` at the top of the module.

### L — Compliance monitor

*Setting: **Watch whether the model can follow the task format***

Keeps a rolling window of the last 40 task turns, scoring each as answered, recovered from malformed output, or ignored, and puts the model in one of three bands: **healthy** at 0.8 and above, **degraded** between 0.4 and 0.8, **minimal** below 0.4.

**You notice:** on a model that cannot hold the format, Chronicle stops asking rather than wasting every turn on it — and tells you once that it has. Degraded shortens the prompts and drops the extras competing for the model's attention. Minimal stops tasks entirely, keeps the world and existing memories injected read-only, and tries again later.
**Settings:** *Turns to stop asking after the model cannot answer* (default 25).
**Small print:** falling is immediate; climbing is one band per 20 compliant turns. This is what makes Dynamic DeepSeek workable — it rotates between three models on every action, so Chronicle measures capability instead of assuming it.

### M — Injection canary

*Setting: **Check that context injections are landing at all***

Asks the model to begin one reply in twelve with `(ok)`. Three misses in a row and Chronicle concludes the context channel is closed.

**You notice:** if Optimized Context is discarding your world simulation, you get told, once, plainly — and the world moves to `state.memory.frontMemory` so at least the date and place still reach the model.
**Settings:** just the switch.
**Small print:** a context modifier cannot see its own return value, so this is the only honest test available: it distinguishes "the model did not see the instruction" from "the model cannot follow instructions". Once confirmed working it re-checks far less often. If the evidence is mixed it prefers the cautious path.

### N — Lean emission

*Setting: **Use terse prompts when context or compliance is tight***

Under the XS and S profiles, or whenever the compliance band is not healthy, every prompt drops to a terse register: one imperative line plus the grammar example, brains as bare `key: value` lines, the world as one comma-joined line.

**You notice:** more of a small context left for the actual story. Measured with every module on: 10.8% of an 8,000 character context at XS, 7.9% of a 20,000 character context at S.
**Settings:** just the switch. Needs Module K to know which profile you are in.

---

## For Creators

### Creator Control Panel
At the very top of the Chronicle `Library` script tab you'll find optional settings with simple explanations. Modify these before publishing to customize your scenario's default experience.

Setting *names* are unchanged from Inner Self on purpose. If your scenario already has a control panel that says `static InnerSelf = {`, it keeps working untouched — the library looks for `Chronicle`, then `InnerSelf`, then `IS`.

### Editing the config card by hand

Chronicle rewrites the "Configure Chronicle" card every turn from its own template, and reads your
settings back by matching each row's label after lowercasing it and stripping everything that is not
a letter. Change a value and it is read; change the *wording* of a label and that row stops being a
setting and becomes decoration — the script silently keeps the scenario default instead.

So if you hand-author or transplant a config card, the label text on the left of each colon has to
match the generator exactly. Adding a prefix like `[B]` in front of a row is enough to break it. The
safest way to get a valid card is to let the script build one, then edit only the values.

### Preparing Scenario NPCs
To work on its own, provide Chronicle with the names of your scenario's most important NPCs. Chronicle will create a new brain card for each NPC you prepare, after their name appears in the story. (Kinda like story card triggers, if that makes sense!) Brains are created on-demand to avoid overwhelming players.

Creators provide Chronicle with scenario NPC names in one of two ways:

<details>
<summary><b>regular method (click to expand)</b></summary>

In the creator control panel near the top of your `Library` script tab:
```javascript
// List the first name of every scenario NPC whose brain should be simulated by Chronicle:
IMPORTANT_SCENARIO_CHARACTERS: ""
// (write a comma separated list of names inside the "" like so: "Leah, Lily, Lydia")
```
Simply list your NPC names inside the quotations. Then click the yellow `SAVE` button!

</details>

<details>
<summary><b>alternative method for mobile creators (click to expand)</b></summary>

Prefix regular AID story card titles with the `@` symbol so Chronicle knows which characters should think:
- Example card name: `@Leah`
- Remember to use simple first names here!
- This method is easier on mobile

</details>

### Custom NPC Brains
Chronicle uses the full context of your scenario to form minds that follow your creative vision. No extra effort required.

But if you want more advanced control:

<details>
<summary><b>initial thoughts (click to expand)</b></summary>

1. Transfer any NPC brain card from adventure to scenario
2. Leave the card entry completely empty
3. Replace the notes section with `key: thought` lines, one per line — or with valid string-valued JSON; both parse
4. Prefix a key with `#` to pin it, so nothing may ever forget it
5. Keys must be at most 60 characters, and `__proto__`, `constructor` and `prototype` are refused

Feel free to use an AI assistant to turn a character concept into thoughts by filling out the prompt below:
````markdown
# You are a JSON generator:
- Always reply with valid JSON only, no extra text
- Base your output on the instructions provided
- Do not include comments or explanations

## Overarching setting:
```
[Describe the setting of your scenario here!]
```

## Fictional character concept:
```
[Describe your character concept here!]
```

## Task instructions:
Your task is to transform the character concept into a JSON object
- The object should resemble a flat collection of key-value pairs
- All values are strings written from the character's inner 1st person PoV
- Values should be short single-sentence thoughts that capture core aspects
- Keys use distinct and descriptive lower snake_case syntax
- The object represents the character's identity of self
- Be creative when roleplaying as the character
- Respect the overarching setting
````

</details>

<details>
<summary><b>which modules to ship enabled (click to expand)</b></summary>

Every module defaults off, including in the creator control panel. If your scenario is built around one of them, switch it on there so players get it from turn one:

- A **mystery or intrigue** scenario wants **F** (clocks) and **E** (knowledge), and probably **C** for the date.
- A **relationship-led** scenario wants **I** (bonds) and **B** (pinned memories).
- A **long survival or travel** scenario wants **C** most of all, for the calendar.
- **Any** scenario aimed at DeepSeek, Gemma or GLM players wants **K, L, M, N** on. They cost almost nothing and they are what keeps the rest alive on a small context.

Leave **D** off unless you know your players have a large context.

</details>

---

## Honest limitations

Things that are true and worth knowing before you are disappointed by them.

**Presence detection and the calendar are heuristics, not understanding.** Module D decides who is in a scene by looking for a name followed by a verb-ish word, or near dialogue, and by rejecting names preceded by a preposition — that list is `MENTION_WORDS` at the top of the module. Module C moves the date by matching phrases from `TIME_TABLE`. Both are plain tables near the top of their modules, and both will misfire: an unusual sentence shape will make someone furniture, and a phrase your scenario uses for time skips will do nothing until you add it. When one misfires, edit the table.

**The tests use a scripted model, not a real one.** The harness replays 300 turn sessions and asserts the ledger, the caps, the migration, the profiles and the bands, and the fuzzer throws thousands of hostile strings at every parser. None of that proves a real model will hold the parenthetical format under load, because that varies by model, by turn, and on Dynamic DeepSeek by the individual action. Module L exists precisely because it varies. Treat compliance as something to watch in `/diag`, not something the tests have settled.

**Small models will not hold the grammar.** Anything in the 12B class will produce the op format unreliably at best. Module L degrades instead of failing — you keep your existing memories and the world, you just stop gaining new thoughts — but the experience is thinner, and no setting changes that.

**Brains live on undocumented platform surface.** Every brain is stored in a story card's `description` field, which AI Dungeon does not document. This is inherited from Inner Self, it has worked for a long time, and Chronicle reads it defensively and complains loudly in the script log if it ever comes back missing. It is not guaranteed by the platform.

**Whether `onOutput` fires once per retry batch or once per candidate is unverified.** AI Dungeon generates retry candidates in a batch. The ledger keeps up to four stagings for one visible turn and commits the one that matches your history, so both behaviours are safe, and every staging is logged for `/diag`. If you can watch that log in a real game, you can settle the question.

**Module A changes retry semantics on purpose.** That is the fix, but it is a behaviour change: a retried response now forms its own thought, where Inner Self would have kept the first one.

---

## Attribution and licence

Chronicle is a fork of **Inner Self v1.0.2**, made by **LewdLeah**, and released under the same MIT licence. The original copyright notice is retained in [LICENSE](./LICENSE) and in the header of [`src/library.js`](./src/library.js).

LewdLeah gave open permission for anyone to use, copy or modify Inner Self, and that generosity is the only reason this exists. The thought engine at the heart of Chronicle is theirs.

- Inner Self — <https://github.com/LewdLeah/Inner-Self>
- Auto-Cards, also by LewdLeah — <https://github.com/LewdLeah/Auto-Cards>
- LewdLeah on AI Dungeon — <https://play.aidungeon.com/profile/LewdLeah>

**Auto-Cards is bundled unmodified.** The Auto-Cards section of `src/library.js` is byte-identical to upstream and is reached only through the handshake Inner Self already used; the test harness asserts that byte-for-byte on every run. Enable it from the "Install Auto-Cards" row on the config card whenever you like.

Contributions to Inner Self before the fork: v1.0.1 → v1.0.2 by [dirtymined13](https://github.com/dirtymined13), v1.0.0 → v1.0.1 by [-Vinny-](https://play.aidungeon.com/profile/-Vinny-).

---

## Upgrading from Inner Self

Replace the `Library` tab and keep playing — [MIGRATION.md](./MIGRATION.md) covers first load, what each module costs when you switch it on, and rollback.

One thing worth pulling out of that document, because getting the order wrong is annoying: **if you ever roll back to Inner Self, retitle the config card to `Configure Inner Self` first**, with the line break, before you swap the library. Inner Self's title matching cannot recognise "Configure Chronicle", so it will build a fresh card with default settings and leave yours orphaned. Retitle first and everything survives.

---

## Development

```
node test/harness.js   # 86 tests: upstream parity, migration, rollback, ledger, every module
node test/fuzz.js      # ~3000 assertions of hostile input against every parser
```

<details>
<summary><b>What the tests actually check (click to expand)</b></summary>

The harness runs Chronicle and upstream Inner Self side by side in stubbed AI Dungeon runtimes, with deterministic randomness and a JSON round-trip of `state` after every hook, and asserts byte-identical text out of every hook across a 300 turn replay with mid-session setting changes. It replays a save produced by genuinely running upstream to prove migration is lossless, replays a Chronicle save back into upstream to prove rollback, and drives retries, erases, continues and injected exceptions through the ledger.

For the compatibility modules it replays 300 turns at 8k, 20k, 60k, 150k and 400k characters plus an oscillating context; drives a configurable sloppy-model stub at 0%, 20%, 50% and 80% failure rates to check the compliance bands and gradual recovery; discards the context hook's return value to prove Module M notices and that the world still reaches the model; and fires `onOutput` three times for one visible turn to prove exactly one commit lands.

The fuzzer feeds every parser unbalanced brackets, 10,000 character keys, zero-width floods, nested backticks, injected boundary markers, prototype-pollution key names, hostile world and clock cards, hostile console arguments, and `info.maxChars` values of `NaN`, `Infinity`, negatives and strings — asserting nothing throws, no hook returns an empty string, no prototype is touched, no unrelated card is modified, and every byte cap holds.

Measured over three 300 turn runs with every module enabled, 2,700 hook calls: 0.54 ms median, 0.95 ms at the 95th percentile, 1.9 ms at the 99th, 3.2 ms worst — against the platform's 2 second ceiling. Occasional outliers above that are garbage collection, not work. Saved state about 20 KB, or about 5.6 KB with every module off.

</details>

---

## Changelog

### Chronicle 1.0.0
- **A** transaction ledger — staged writes, committed only once the generation survives into history
- **B** tiered memory — pinned core, long-term merged by compression, working evicted coldest-first
- **C** world chronicle — date, place, arc, standing, debts, threats, on an authoritative card
- **D** ensemble — several present characters thinking, sharing one budget
- **E** knowledge model — witnessed events, stale beliefs, rumour by visibility class
- **F** clocks and consequences — player-authored progress tracks and scheduled events
- **G** continuity auditor — reports contradictions, never auto-corrects
- **H** player console — twelve commands, colliding native names deliberately unregistered
- **I** bonds — a seven rung ladder that cannot be skipped upward
- **J** diagnostics — state budget, hook time rails, card index, diagnostics card
- **K** budget autoscaling — every injection scaled to `info.maxChars`, read fresh each turn
- **L** compliance monitor — measures whether the model can answer, and stops asking when it cannot
- **M** injection canary — detects a read-only context hook, falls back to the memory channel
- **N** lean emission — terse prompts under small contexts or poor compliance
- Reserved property names and oversized keys refused at every parse boundary
- Forked from Inner Self v1.0.2

<details>
<summary><b>Inner Self changelog before the fork (click to expand)</b></summary>

### 1.0.2
- Added config "Brain card notes store brains as JSON"
- When disabled, brain card notes use a simpler colon + newline delimited format instead of JSON
- Makes it much easier to manually edit NPC thoughts without accidentally breaking syntax
- Backward and forward compatible; both formats are safe during parsing
- Pull request by [dirtymined13](https://github.com/dirtymined13)

### 1.0.1
- Added config "Half thought chance for Do/Say/Story"
- Lets players decide if the thought formation chance should be reduced by half during Do/Say/Story turns
- Pull request by [-Vinny-](https://play.aidungeon.com/profile/-Vinny-)

### 1.0.0
- Inner Self released!

</details>

<p align="center"><i>Thank you so much for your curiosity and support~</i> ❤️</p>
<p align="center"><b>Chronicle v1.0.0</b> · built on <b>Inner Self v1.0.2</b> by <a href="https://play.aidungeon.com/profile/LewdLeah">LewdLeah</a></p>
