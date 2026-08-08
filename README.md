<p align="center">
  <img src="./assets/cover1.png" width="800">
</p>

# Chronicle 📜
### *A world that remembers, for stories that go long*
Built on [Inner Self](https://github.com/LewdLeah/Inner-Self) by LewdLeah ❤️

---

## Overview

Chronicle is an AI Dungeon mod that lets the characters in your story keep their own memories, and gives the world around them a calendar. Characters form private thoughts, revise them, and act on them, and they keep the ones that define them, however long the story runs. The world keeps a date that moves when the story says it moves — three weeks on the road advance it by three weeks — and the place you are in.

It is built for adventures that run for hundreds of turns, so the thing it protects hardest is your history. Nothing a character learns is written down until the response it came from is really part of your story. Retry as often as you like: the version you threw away leaves no trace in anyone's memory.

Two features are off when you install it. Turn on what you want, one at a time.

---

## What this is, next to Inner Self

Chronicle is a fork of [Inner Self v1.0.2](https://github.com/LewdLeah/Inner-Self), and Inner Self is still the engine underneath: the trigger system, the prompts that ask a character to think, the label encoding that ties a thought to the moment it mattered, the brain card format, and the bundled Auto-Cards integration are all LewdLeah's work, kept as they were.

Inner Self gives individual characters memory. Chronicle keeps that and adds the parts a long story needs around it:

- **World state** — an in-game date with a season and a year, and a location, on a card you can edit.
- **In-game time** — a calendar that moves when the story says it moves, not once per turn.
- **A transaction ledger** — every one of those writes is staged and only committed once the generation that produced it survives into your story, so a retry cannot corrupt a memory or the calendar.

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
| **World Chronicle** | The in-game date and where you are, on a card that outranks the script |
| **Answers For Itself** | A diagnostics card showing what each turn cost and what was overruled |
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

### Optimized Context must be off

Gemma 31B and GLM 5.1 offer an Optimized Context toggle. With it **on**, the context hook may become read-only: everything Chronicle writes is silently thrown away, and your world simulation quietly does nothing.

The honest trade: turning Optimized Context **off** roughly halves the context those models give you, so Chronicle has less room to work in. Leaving it **on** gives you the room and then disables the thing you wanted the room for. Off is the right answer for this mod.

Chronicle does not try to detect this for you. An earlier build did, by asking the model to begin the occasional reply with a marker, and it could not tell a blocked channel from a model that simply ignored the instruction — so it was removed rather than left to guess. The diagnostics card reports the context size it was last handed; turn Optimized Context off and judge for yourself.

### What you get at each context size

`info.maxChars` is read every single turn by Module K, which has no switch, and mapped to a profile. These are the values in `BUDGET_TABLE` at the top of the module, which is the only place they exist:

| Profile | `maxChars` | World block | Chronicle's share |
|:--|:--|:--|:--|
| **XS** | under 12,000 | 350 ch | 12% |
| **S** | 12,000–32,000 | 500 ch | 20% |
| **M** | 32,000–80,000 | 700 ch | 30% |
| **L** | 80,000–200,000 | 700 ch | 35% |
| **XL** | over 200,000 | 900 ch | 40% |

The table had a column per module once. Most of those modules are gone, and what is left is the world block and the share of your context Chronicle may spend in total. A profile only ever takes away — your own settings stay the ceiling — and if a turn would still overrun its share, the world block is what gives, down to a floor it never goes below.

Two things worth knowing:

- **GLM can land at XS even on a high tier.** Its range starts at 4K, and the Optimized Context toggle halves it again. Do not assume your subscription tier decides your profile.
- **GLM's credit extension is charged per action**, so the number moves turn to turn inside one adventure. This is exactly why the module has no switch. Chronicle re-reads the number every turn and never caches it, needs two consecutive turns at a new size before switching so a flicker cannot thrash your feature set, and reports the size it last saw on the diagnostics card, for you to judge.

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

Two optional modules, so there is not much to stage:

1. **Turn on B and play.** The ledger (A), budget autoscaling (K), the compliance monitor (L) and lean emission (N) already run and need no setup. Tiered memory costs nothing extra and is the difference between a character who is still themselves at turn 800 and one who is not.
2. **Add C when you want the world to keep time.** About 40 characters a turn.
3. **Diagnostics (J) is already on.** Its card is where Chronicle tells you what each turn cost and what your context size overruled.

---

## Module reference

Four modules have no switch and always run: **A** the transaction ledger, **K** budget autoscaling, **L** the compliance monitor, and **N** lean emission. A fixed injection budget cannot meet a context that changes per action, nothing else notices when a model stops honouring the operation format, and a 4,000 character context has no room for a verbose prompt — so all four are infrastructure rather than features. **J** ships on and can be switched off; the other two are off until you turn them on. Settings below are the labels as they appear on the "Configure Chronicle" card.

| | Module | What you notice in play | Default |
|:--|:--|:--|:--|
| **A** | Transaction ledger | Retrying leaves no trace | **always on** |
| **B** | Tiered memory | Characters stop forgetting what defines them | off |
| **C** | World chronicle | A date and a place that persist | off |
| **J** | Diagnostics | State and timings stay under control, and a card that answers for itself | **on** |
| **K** | Budget autoscaling | The mod fits whatever context you have | **always on** |
| **L** | Compliance monitor | Chronicle stops nagging a model that cannot answer | **always on** |
| **N** | Lean emission | Prompts get short when room is tight | **always on** |

### A — Transaction ledger

Nothing is written to a story card during the turn that produced it. The turn's changes are staged, then committed on your next action, once the generation they came from can be proven to be in your history.

**You notice:** retrying no longer leaves a thought behind from the version you discarded, and a retried response is free to think its own thought. Every other module writes through this ledger too, so a retry cannot leave the calendar moved.
**Settings:** none. It is a bug fix, not a feature, and it is always on.
**Small print:** a thought appears on the brain card one action later than it used to. The model never sees the difference, because the commit happens before the next context is built.

### B — Tiered memory

*Setting: **Tiered memory with pinned core thoughts***

Thoughts sit in three tiers. **Core** thoughts are pinned and are never evicted, never renamed and never deleted, even when the model explicitly asks. **Long-term** thoughts have earned their place by being linked to the story often enough, and can only be merged, never dropped. **Working** thoughts are everything else, and are evicted coldest-first when a brain outgrows its budget.

**You notice:** a character stops losing the thing that defines them at turn 400. Pin a thought by putting `#` in front of its key in the card notes. Each character is also seeded with one pinned fact taken from their own story card the first time they think, stored as `#defining_fact`.
**Settings:** *Maximum pinned core thoughts per character* (default 5) · *Maximum characters of thought per brain* (default 4000) · *Story links before a thought becomes long-term* (default 2).
**Small print:** when only long-term thoughts remain, Chronicle spends a turn asking the model to merge the two coldest into one. Going over the pin limit demotes the coldest pins rather than deleting them.

### C — World chronicle

*Setting: **Track the in-game date and location***

A story card called "Chronicle" holds the in-game date and where you are. One short line is injected above the character brain every turn. It used to hold factions, debts, threats and lost memories too; those were lists you typed being read back to you, which a plain story card does for free, so they were cut.

**You notice:** the narrator stops forgetting where you are and what day it is. Edit the card and Chronicle believes you over its own memory, immediately.
**Settings:** *Maximum characters of world state per turn* (default 700) · *In-game date the adventure began on* (default "Day 1") · *Maximum days one turn may advance* (default 30). In practice the line costs about 40 characters.
**Calendar:** the date carries a season and a year, both derived from the day count so they cannot drift out of step with it. The season names and season length are yours to edit on the Chronicle card — `Seasons: Spring; Summer; Autumn; Winter` and `Season length: 91` — and a scenario with its own calendar just writes its own names there.
**Small print:** the calendar moves on narrative phrasing, from an editable table (`TIME_TABLE`) mapping both time skips ("the next morning", "a fortnight later") and travel ("you set off for the guild", "three days on the road", "for two weeks") onto days. An explicit `[+3 days]` marker is trusted past the per-turn cap. One advance per turn: the first phrase that matches wins. Travel phrasing is a heuristic and your scenario will have its own — that table is where you add it. When the block does not fit, whole lines are dropped by priority; nothing is cut mid-sentence.

### J — Diagnostics and safety rails

*Setting: **Enable diagnostics and safety rails***

Watches the saved state size, warning at 60% of budget and trimming at 85% by dropping the most expendable things first; skips optional work rather than risking a hook timeout; caches a card index so a large adventure does not pay for a full scan every turn; and keeps a "Chronicle Diagnostics" card summarising the last twenty transactions.

**You notice:** mostly nothing, which is the point. The "Chronicle Diagnostics" card is where Chronicle answers for itself: the context it was handed, the profile that came from it, anything that profile overruled, whether the model is still answering the task format, and what the last turn cost.
**Settings:** *Milliseconds a hook may spend before skipping extras* (default 1200) · *Maximum characters of saved adventure state* (default 40000).

### K — Runtime budget autoscaling

*Always on. No setting.*

Reads `info.maxChars` every turn and maps it to a profile, then derives every injection budget from that. See [what you get at each context size](#what-you-get-at-each-context-size).

**You notice:** the world block gets shorter when your context shrinks, instead of everything being truncated at random. The diagnostics card names the current profile and everything it overruled.
**Settings:** none. The profile table is `BUDGET_TABLE` at the top of the module, and editing it is how you change what each size buys.
**Small print:** because it always runs, a profile can cap a setting you chose. Asking for a 700 character world block at a 25,000 character context gets you 500. The diagnostics card names every override explicitly — `world block 500 (you set 700)` — so a capped setting is never silent.

### L — Compliance monitor

*Always on. One setting.*

Keeps a rolling window of the last 40 task turns, scoring each as answered, recovered from malformed output, or ignored, and puts the model in one of three bands: **healthy** at 0.8 and above, **degraded** between 0.4 and 0.8, **minimal** below 0.4.

**You notice:** on a model that cannot hold the format, Chronicle stops asking rather than wasting every turn on it — and tells you once that it has. The band is on the diagnostics card. Degraded shortens the prompts and drops the extras competing for the model's attention. Minimal stops tasks entirely, keeps the world and existing memories injected read-only, and tries again later.
**Settings:** *Turns to stop asking after the model cannot answer* (default 25). The monitor itself cannot be switched off.
**Small print:** falling is immediate; climbing is one band per 20 compliant turns. Because it always runs, a model that stops answering will quietly cost you the optional extras before it costs you thoughts — that is the degradation working, and the diagnostics card names the band. This is what makes Dynamic DeepSeek workable — it rotates between three models on every action, so Chronicle measures capability instead of assuming it.

### N — Lean emission

*Always on. No setting.*

Under the XS and S profiles, or whenever the compliance band is not healthy, every prompt drops to a terse register: one imperative line plus the grammar example, brains as bare `key: value` lines, the world as one comma-joined line.

**You notice:** more of a small context left for the actual story. Measured with both optional modules on: 6.8% of an 8,000 character context at XS, 4.6% of a 20,000 character context at S.
**Settings:** none. Module K supplies the profile, and also always runs.

---

## For Creators

### Creator Control Panel
At the very top of the Chronicle `Library` script tab you'll find optional settings with simple explanations. Modify these before publishing to customize your scenario's default experience.

Setting *names* are unchanged from Inner Self on purpose. If your scenario already has a control panel that says `static InnerSelf = {`, it keeps working untouched — the library looks for `Chronicle`, then `InnerSelf`, then `IS`.

### Editing the config card by hand

Settings live across two cards: **Configure Chronicle** holds the thirteen base settings, and
**Configure Chronicle · Modules** holds the module toggles. A module's detail rows appear on the
second card only while that module is switched on, and a third card appears on demand if the rows
ever outgrow one. The entry field is the only part of a story card the platform limits, so it carries
nothing but `> label: value` rows; every word of explanation lives in the notes, which the script
reads directly and the model never sees.

Chronicle rewrites those cards every turn from its own template, and reads your settings back by
matching each row's label after lowercasing it and stripping everything that is not a letter. Change a value and it is read; change the *wording* of a label and that row stops being a
setting and becomes decoration — the script silently keeps the scenario default instead.

So if you hand-author or transplant a config card, the label text on the left of each colon has to
match the generator exactly. Adding a prefix like `[B]` in front of a row is enough to break it. The
safest way to get a valid card is to let the script build one, then edit only the values.

Turning a module off hides its detail rows rather than discarding them. Whatever you had set is
remembered and comes back when you switch the module on again.

A reference copy of exactly what the generator emits lives at
[`docs/configure-chronicle.card.json`](./docs/configure-chronicle.card.json) — both cards — and the
harness fails if the code and that copy ever drift apart, if any emitted row stops being one the
parser reads, if a card outgrows the entry limit, or if entry and notes stop documenting each other.

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

Two modules have a switch, and both default off in the creator control panel. If your scenario is built around one of them, switch it on there so players get it from turn one:

- A **long survival or travel** scenario wants **C** most of all, for the calendar.
- A **relationship-led** or long-running character scenario wants **B**, so a defining thought cannot be evicted.
- **Any** scenario aimed at DeepSeek, Gemma or GLM players needs no decision from you: K, L and N run unconditionally and are the whole of what keeps a small context alive.

**J** already ships on. Leave it on unless you have a reason: it is the only window into what Chronicle is doing, and it costs one story card and nothing in context.

</details>

---

## Honest limitations

Things that are true and worth knowing before you are disappointed by them.

**The sanitizer keeps prose that Inner Self deleted.** Inner Self dropped any output line containing "task" or "output", or containing both "story" and "continu" — ordinary English words. A model answering in a single paragraph containing one of them had its entire generation erased. Chronicle matches the shapes leaked prompt text actually takes instead: SYSTEM tags, markdown headers, shouted instruction lines, and the grammar examples verbatim. This is a deliberate divergence from upstream, and both halves of it are pinned by tests.

**The calendar is a phrase table, not understanding.** Module C moves the date by matching `TIME_TABLE`, which covers time skips ("the next morning", "a fortnight later") and travel ("you set off for the guild", "three days on the road"). It will miss phrasings your scenario uses, and it advances at most once per turn on the first match. That table is a plain list near the top of the module, and adding your own phrasing is the intended fix.

**The tests use a scripted model, not a real one.** The harness replays 300 turn sessions and asserts the ledger, the caps, the migration, the profiles and the bands, and the fuzzer throws thousands of hostile strings at every parser. None of that proves a real model will hold the parenthetical format under load, because that varies by model, by turn, and on Dynamic DeepSeek by the individual action. Module L exists precisely because it varies. Treat compliance as something to watch on the diagnostics card, not something the tests have settled.

**Small models will not hold the grammar.** Anything in the 12B class will produce the op format unreliably at best. Module L degrades instead of failing — you keep your existing memories and the world, you just stop gaining new thoughts — but the experience is thinner, and no setting changes that.

**Brains live on undocumented platform surface.** Every brain is stored in a story card's `description` field, which AI Dungeon does not document. This is inherited from Inner Self, it has worked for a long time, and Chronicle reads it defensively and complains loudly in the script log if it ever comes back missing. It is not guaranteed by the platform.

**Whether `onOutput` fires once per retry batch or once per candidate is unverified.** AI Dungeon generates retry candidates in a batch. The ledger keeps up to four stagings for one visible turn and commits the one that matches your history, so both behaviours are safe, and every staging is listed on the diagnostics card. If you can watch that log in a real game, you can settle the question.

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

For the compatibility modules it replays 300 turns at 8k, 20k, 60k, 150k and 400k characters plus an oscillating context; drives a configurable sloppy-model stub at 0%, 20%, 50% and 80% failure rates to check the compliance bands and gradual recovery; and fires `onOutput` three times for one visible turn to prove exactly one commit lands.

The fuzzer feeds every parser unbalanced brackets, 10,000 character keys, zero-width floods, nested backticks, injected boundary markers, prototype-pollution key names, hostile world cards, and `info.maxChars` values of `NaN`, `Infinity`, negatives and strings — asserting nothing throws, no hook returns an empty string, no prototype is touched, no unrelated card is modified, and every byte cap holds.

Measured over three 300 turn runs with every module enabled, 2,700 hook calls: 0.54 ms median, 0.95 ms at the 95th percentile, 1.9 ms at the 99th, 3.2 ms worst — against the platform's 2 second ceiling. Occasional outliers above that are garbage collection, not work. Saved state about 7.7 KB after 300 turns with both optional modules on, about 7.0 KB with them off.

</details>

---

## Changelog

### Chronicle 1.0.0
- **A** transaction ledger — staged writes, committed only once the generation survives into history
- **B** tiered memory — pinned core, long-term merged by compression, working evicted coldest-first
- **C** world chronicle — the in-game date and where you are, on an authoritative card
- **J** diagnostics — state budget, hook time rails, card index, diagnostics card, on by default
- **K** budget autoscaling — every injection scaled to `info.maxChars`, read fresh each turn, no switch
- **L** compliance monitor — measures whether the model can answer and stops asking when it cannot, no switch
- **N** lean emission — terse prompts under small contexts or poor compliance, no switch
- Seven modules were built and cut before release: ensemble, the knowledge model, clocks and
  consequences, the continuity auditor, the player console, bonds, and the injection canary. They
  competed for one context budget and one thought per turn, and at a small context most of them
  could not fit. See `MIGRATION.md`.
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
