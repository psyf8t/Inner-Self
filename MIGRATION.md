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
| The config card is titled "Configure Chronicle" and carries twenty-seven new module rows | Players |
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
- `state.CHRONICLE` is new. With every module off it holds the ledger and its diagnostics, about
  5 KB after 300 turns. With every module on, about 16 KB, and Module J will keep it under the
  budget you set.
- Brain cards are untouched: same `keys` metadata, same `Brain` type, same entry log format, same
  notes format in both the JSON and the friendly style.

---

## First load of an existing adventure

Nothing is asked of you. On the first turn after the library is replaced:

1. **The config card is migrated in place.** Chronicle looks for its own card title *and* the
   Inner Self one, so the existing card is found, renamed to "Configure Chronicle", and rewritten
   with the module rows appended. No second config card is created.
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

Every module is safe to enable in the middle of a running adventure, and safe to disable again.
They are independent; enable them one at a time if you want to feel what each one does.

| Module | What appears when you switch it on | What it costs you |
|:--|:--|:--|
| **B** Tiered memory | Keys prefixed `#` are now pinned. Each character gets one pinned fact seeded from their own story card the next time they think | A brain over its character budget starts evicting its coldest working thought. Set the budget high if you would rather it never did |
| **C** World chronicle | A "Chronicle" card appears, holding the date and the rest. Up to 700 characters are injected each turn | That much of your context. The date starts from the config card's starting date, not from your story so far — set it once by hand or with `/date` |
| **D** Ensemble | Several present characters share the brain budget | Each present character gets a smaller share than a single character used to |
| **E** Knowledge model | Characters are told what they missed, and what they still wrongly believe | An event log in state, capped by the setting. Characters will act on stale information on purpose |
| **F** Clocks | A "Chronicle Clocks" card appears with one example clock. Nothing advances until you author a trigger phrase | Nothing until you author one |
| **G** Auditor | Every 75 turns, one thought slot is spent checking continuity instead. A "Chronicle Continuity Log" card appears | One thought every 75 turns |
| **H** Console | `/help` and eleven other commands start working | Any story action that begins with `/` and happens to match a command name is treated as a command. Unknown ones still fall through |
| **I** Bonds | Each character gets a standing, stored on their own card under `#bond` | The model is told it may record advances, which spends part of the prompt |
| **J** Diagnostics | A "Chronicle Diagnostics" card appears; the state budget and hook time rails start enforcing | Optional work is skipped when a hook runs long, which is the point |
| **K** Budget autoscaling | Injection budgets start scaling to `info.maxChars`, read fresh every turn | On a small tier the world block shrinks and the audit stops. That is the module working, and `/diag` says so |
| **L** Compliance monitor | Chronicle starts measuring whether the model answers its tasks | On a model that cannot, thought formation stops for 25 turns at a time. Existing memories are still injected |
| **M** Injection canary | Every twelfth turn asks the model to begin with `(ok)` | One turn in twelve is spent proving the channel works. Once confirmed, it drops to one in ninety-six |
| **N** Lean emission | Prompts and blocks drop to a terse register under XS/S or poor compliance | Less instruction for the model to follow, which is the intent; the grammar it must produce is unchanged |

Switching a module back off stops all of it immediately. Its cards stay where they are, inert, and
are safe to delete — they will be rebuilt if you switch the module on again. State it wrote stays
too, ignored, and Module J will trim it if the state budget ever comes under pressure.

---

## If you play DeepSeek, Gemma or GLM

Turn on **K, L, M and N** before anything else, whatever else you enable. They cost almost nothing and they are what makes the rest survive:

- Context on those models ranges from 4K to 128K depending on tier, the Optimized Context toggle, and credits. **K** scales every injection to what you actually have this turn, rather than to a number chosen when the mod was written.
- On GLM the credit extension is charged per action, so the size changes turn to turn. K re-reads it every turn and never caches it.
- Dynamic DeepSeek rotates between DeepSeek 3.0, 3.1 and 3.2 on every action, and they follow instructions differently. **L** discovers each rotation's capability instead of assuming it, and stops asking a model that cannot answer.
- Optimized Context on Gemma and GLM can make the context hook read-only, silently discarding every injection. **M** detects that and moves the world to the memory channel, then tells you what the toggle is costing you.
- **N** keeps the prompt short enough that a 4K turn still has room for the story.

**Atlas and Raven are unsupported.** They are permanently cache-efficient and do not support all scripting functions. Chronicle will detect it (with M on) and say so, but there is no configuration that makes them work.

---

## Rollback

Chronicle stays rollback-safe on purpose. To go back to Inner Self v1.0.2:

1. Retitle the config card to `Configure Inner Self` (with the line break, as it appears in the
   card list). **Do this first** — see below.
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
- **Anything Chronicle wrote to `state.memory.frontMemory` is cleared** the moment Module M sees a working channel again, and only ever touched lines it wrote itself, marked `[Chronicle]`. If you roll back while the fallback is active, clear that field by hand.
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
