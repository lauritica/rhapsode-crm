# Screen — Pipeline Timeline

**Route:** `/` (default landing)
**File reference:** `Rhapsode Pipeline.html`
**Demo (scrubbed data):** `Rhapsode Pipeline - Demo.html`

---

## Purpose
One screen that shows every active client, their current pipeline stage, time-in-stage, next action, and the entire history of how they've moved through the funnel — without leaving the page.

## Layout

- **Top bar (~64px):** App mark `Rhapsode` (Instrument Serif italic) · tab switcher (Sellers / Buyers) · search · sort · "+ Add" primary button
- **Stage header row (~52px sticky):** one column per stage; first column is a fixed-width client cell (~280px); stage columns are equal-flex
- **Pipeline rows (~80px each):**
  - Client cell (sticky left): avatar (initials, gradient bg), name, address (mono), price chip (mono accent), days-since-contact dot
  - Timeline track: thin horizontal bar, filled solid through current stage, faint beyond. Bright chevron + translucent vertical wash on current column. Completed cells = checkmark. Current cell = temperature icon + days in mono.
- **Right drawer (slides in, ~480px):** full client detail — contact, notes, all stage transitions with timestamps, files, next-action form. Esc/overlay click closes.
- **Cell popover (on stage-cell click):** inline log-activity form — note text, "advance to next stage" toggle, save.

## Interactions

| Trigger | Behavior |
|---|---|
| Tab switch | Instant. Stage column headers update. |
| Search | Live filter, case-insensitive substring on name + address |
| Sort | `Most recent activity` · `Days in stage` · `Stage progression` · `Alphabetical` |
| Row click | Opens drawer at `/clients/[id]` |
| Stage-cell click | Opens popover anchored to cell (no route change) |
| Drawer Esc / overlay | Closes drawer |
| Stage advance | Animate bar fill 400ms ease-out, pulse new marker once |

## Data
See [[Design System]] for the `Client` type.

---

## Related
- [[Decisions]] — why this replaced the [[Today List]]
- [[Today List]] — predecessor
