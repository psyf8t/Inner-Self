# Migrating from Inner Self to Chronicle

Chronicle v1.0.0 forks Inner Self v1.0.2. This document covers what changed, what an existing
adventure does on its first load, what each module adds once you switch it on, and how to go
back if you want to.

---

## What changed

### Behaviour, with every module off

| Change | Who notices |
|:--|:--|
| Brain writes are staged during a turn and committed at the start of the next one | Nobody, unless they retry |
| Retrying or erasing a response discards that response's thought entirely | Players, immediately and for the better |
| A retried response is asked to form its own thought, where before it was given the brain with no task | Players and models |
| Brain keys named `__proto__`, `constructor` or `prototype`, or longer than 60 characters, are refused | Only hostile or broken output |
| The config card is titled "Configure Chronicle" and a second card carries six new module rows | Players |
| The hook tabs call `Chronicle(...)` | Creators, optionally |

Everything else is unchanged. With every module off, Chronicle produces byte-identical text to
Inner Self out of all three hooks, and byte-identical brain cards. The harness proves it over a
300 turn replay with mid-session setting changes (`node test/harness.js`).

**The one visible timing difference:** a thought now appears on the brain card one action later
than it used to. It is staged when the response is generated and written when you take your next
action. The context the model sees is never affected, because the commit happens before the
context is built.

### Storage

- `state.InnerSelf` is unchanged and still holds `encoding`, `agent`, `label`, `hash`, `ops` and
  `AC`. It cannot be renamed: the bundled Auto-Cards writes `state.InnerSelf.AC.forced` and
  `state.InnerSelf.AC.event` by that literal path, and the Auto-Cards section is byte-identical to
  upstream by design.
- `state.InnerSelf.hash` is still written, with exactly the value Inner Self would have written,
  but Chronicle never reads it. It exists so a rollback finds sane state.
- `state.CHRONICLE` is new. It holds the ledger and its diagnostics: about 7.0 KB after 300 turns
  with the optional modules off, about 7.7 KB with both on, and Module J will keep it under the
  budget you set.
- Brain cards are untouched: same `keys` metadata, same `Brain` type, same entry log format, same
  notes format in both the JSON and the friendly style.

---

## First load of an existing adventure

Nothing is asked of you. On the first turn after the library is replaced:

1. **The config card is migrated in place, and the module rows move to a second card.** Chronicle
   looks for its own card title *and* the Inner Self one, so your existing card is found, renamed to
   "Configure Chronicle", and rewritten holding the thirteen base settings. Module toggles go on a
   new "Configure Chronicle · Modules" card, and a third appears on demand if they outgrow it. This
   is because a story card entry is limited to roughly a thousand characters and the settings no
   longer fit on one; the notes, which have no such limit, carry all the explanation.
2. **Every setting you had chosen is preserved.** Rows are matched by label, and the renamed
   "Enable Inner Self" row is matched by its old label too. Percentages, the player name, the NPC
   list, the indicator symbol, the JSON format toggle: all carried over.
3. **Every module arrives switched off.** Nothing about your adventure changes until you say so.
4. **Brains are preserved exactly.** No brain card is re-parsed, rewritten or reformatted on load.
   A brain is only rewritten when its agent next has a thought, in the format your config says.
5. **The label counter continues.** `state.InnerSelf.label` is read as-is, so new thoughts get
   labels above the markers already embedded in your story text and every existing
   thought-to-event link keeps working.
6. **A creator control panel that still says `static InnerSelf = {` keeps applying.** The library
   looks for `Chronicle`, then `InnerSelf`, then `IS`.
7. **Hook tabs that still call `InnerSelf("input")` keep working**, through a top-level alias. You
   can update them to `Chronicle(...)` whenever you like, or never.

The harness runs this migration against a save produced by genuinely running upstream Inner Self
for 40 turns, then asserts the settings, the brains and the label counter all survive.

### If you are coming from a build with one oversized config card

Earlier builds put all thirty-eight setting rows in one entry field, about 2,700 characters, well
past what a story card entry holds. On first load those rows are read, split across the base and
module cards, and every value you had set is carried over. Values belonging to a module that is
switched off are not shown, because that module's detail rows only appear while it is on, but they
are remembered: switch the module on and your number is still there.

### If you are coming from a build that had K and L switches

Earlier builds of Chronicle put budget autoscaling and the compliance monitor behind config card rows
that defaulted off. Those rows are gone. If your config card still carries them, they are ignored and
dropped the next time the card is rewritten, and both modules run regardless of what the old row said.
Nothing is asked of you, and the harness covers this case.

### The one thing that can be dropped

If a brain card's notes contain a key named `__proto__`, `constructor` or `prototype`, or a key
longer than 60 characters, that line is refused when the brain is parsed, and a line is written to
the script log naming the key. It is dropped from the card the next time that agent writes a
thought. Inner Self accepted such keys; Chronicle does not, because they are how model output
reaches places it should not. No thought written by Inner Self's own prompts can hit this: the
model was already held to 60 characters and snake_case.

If you have hand-authored a key like that on purpose, rename it before upgrading.

---

## Turning modules on, mid-adventure

Four modules have no switch and are already running: the transaction ledger (**A**), budget
autoscaling (**K**), the compliance monitor (**L**) and lean emission (**N**). A fifth, diagnostics
(**J**), ships switched on but can be switched off. Only the two in the table below start off, and
both are safe to enable in the middle of a running adventure and safe to disable again.

One consequence of K running unconditionally, worth knowing before you wonder where a feature went:
a world block budget you set can be capped by your live context size. The diagnostics card names the
profile in force and every setting it overrode.

| Module | What appears when you switch it on | What it costs you |
|:--|:--|:--|
| **B** Tiered memory | Keys prefixed `#` are now pinned. Each character gets one pinned fact seeded from their own story card the next time they think | A brain over its character budget starts evicting its coldest working thought. Set the budget high if you would rather it never did |
| **C** World chronicle | A "Chronicle" card appears, holding the date and the location. One line of about 40 characters is injected each turn | Almost nothing. The date starts from the config card's starting date, not from your story so far — edit the card once by hand to set it |

Switching a module back off stops all of it immediately. Its cards stay where they are, inert, and
are safe to delete — they will be rebuilt if you switch the module on again. State it wrote stays
too, ignored, and Module J will trim it if the state budget ever comes under pressure.

---

## What was removed, and what happens to it

Seven modules were cut: ensemble, the knowledge model, clocks and consequences, the continuity
auditor, the player console, bonds, and the injection canary. They shared one context budget, one operation queue and one thought
slot per turn with everything else, and at a small context most of them could not fit.

Upgrading is automatic and needs nothing from you:

- Their config card rows stop being emitted, so they disappear from the card rather than lingering as
  rows that read as decoration.
- Their state is deleted once, on the first turn after the upgrade: clock progress, the consequence
  queue, bond stages, audit findings, console state, canary state, the witnessed event log, the fact
  table and every stale belief.
- The "Chronicle Clocks" and "Chronicle Continuity Log" cards are removed, once.
- Anything the canary wrote to `state.memory.frontMemory` is cleared.
- Bond stages stored on a character's card under `#bond` are left alone. They read as an ordinary
  pinned thought now, and you can delete them by hand or leave them as flavour.

The world card is trimmed to the date and the location. Factions, debts, threats and lost memories
were lists you typed being read back to you, so those rows disappear from the card; whatever you had
written in them is gone, and a plain story card holds the same text for free if you want it back.

The world row on the config card is renamed from "Track world state (date, place, arc, factions)" to
"Track the in-game date and location". The old label is still matched, so a save that had it switched
on stays switched on.

Diagnostics now ships **on**. With the console gone it is the only window into what Chronicle is doing,
and it costs one story card and no context.

Everything else that survived is unchanged. Brains and the ledger carry over exactly.

The console went with them, so `/diag` and its siblings no longer exist: a command could only end a
turn by stopping it, which surfaced to the player as an error. What `/diag` reported now lives on the
"Chronicle Diagnostics" card, which needs no turn and costs no context.

---

## If you play DeepSeek, Gemma or GLM

Modules **K**, **L** and **N** already run for you, with no switch. Between them:

- Context on those models ranges from 4K to 128K depending on tier, the Optimized Context toggle, and credits. **K** scales every injection to what you actually have this turn, rather than to a number chosen when the mod was written.
- On GLM the credit extension is charged per action, so the size changes turn to turn. K re-reads it every turn and never caches it. This is why it has no switch: a fixed budget cannot meet a moving context.
- Dynamic DeepSeek rotates between DeepSeek 3.0, 3.1 and 3.2 on every action, and they follow instructions differently. **L** discovers each rotation's capability instead of assuming it, and stops asking a model that cannot answer. It has no switch either, because a silently degrading model is exactly the failure nobody notices.
- Optimized Context on Gemma and GLM can make the context hook read-only, silently discarding every injection. Chronicle no longer tries to detect this, because it could not tell a blocked channel from a model ignoring an instruction. Turn Optimized Context off; the diagnostics card reports the context size it was last handed, and you can judge.
- **N** keeps the prompt short enough that a 4K turn still has room for the story, and now applies automatically at the two smallest context sizes rather than waiting to be switched on.

**Atlas and Raven are unsupported.** They are permanently cache-efficient and do not support all scripting functions. Chronicle cannot detect which model you are using, and there is no configuration that makes them work.

---

## Rollback

Chronicle stays rollback-safe on purpose. To go back to Inner Self v1.0.2:

1. Retitle **only the base card** to `Configure Inner Self` (with the line break, as it appears in
   the card list). **Do this first**, and do *not* retitle the "· Modules" cards — two cards with
   the same name and Inner Self keeps the wrong one, taking your base settings with it. Leaving the
   module cards under their own names is harmless; Inner Self ignores them.
2. Replace the `Library` tab with the Inner Self v1.0.2 source.
3. Change the three hook tabs back to `InnerSelf("input")`, `InnerSelf("context")`,
   `InnerSelf("output")`. This is required: the alias lives in the Chronicle library, so once that
   library is gone, `Chronicle` is undefined.
4. Play one turn.

What happens:

- **Brains, labels and operation counts survive.** They live in `state.InnerSelf` and on the
  cards, both of which Inner Self still understands. `state.InnerSelf.hash` holds the value Inner
  Self itself would have left, so its retry guard behaves normally from the first turn.
- **The config card is the one thing that needs your hand.** Inner Self's fuzzy title match cannot
  see "Configure Chronicle", so without step 1 it builds a fresh card with default settings and
  leaves yours behind as an orphan. Both outcomes are covered by tests; step 1 is the one that
  keeps your settings.
- **A transaction staged but not yet committed is lost.** At most one thought, from the response
  generated immediately before the rollback. Take one more action before swapping the library if
  you want to avoid even that.
- **Anything an earlier Chronicle build wrote to `state.memory.frontMemory` is cleared** on the first turn after upgrading, and only ever a line it wrote itself, marked `[Chronicle]`. Current builds never write there at all.
- **Module cards and `state.CHRONICLE` are left in place, ignored and inert.** Delete them only if
  you want the space back. Pinned keys keep their `#` prefix and read as ordinary thought names
  under Inner Self, so nothing is lost, only unprotected.

---

## Verifying an upgrade yourself

```
node test/harness.js
node test/fuzz.js
```

The harness reads upstream Inner Self straight out of git at the pinned commit `297a1a0`, so the
parity claim is checked against the real thing rather than a copy that could drift.
