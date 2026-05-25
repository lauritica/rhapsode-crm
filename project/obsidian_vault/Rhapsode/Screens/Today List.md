# Screen — Today List (legacy)

**File reference:** `Rhapsode Today Before.html`
**Status:** Predecessor to [[Pipeline Timeline]]. Kept as migration reference.

---

## Purpose
Daily call list. Each row = one client to contact today, with one-tap quick actions.

## Layout
- Centered single-column, max-width ~720px
- Date headline + "X calls remaining" counter
- Stack of client cards: avatar, name, address, last-contact age, three quick-action buttons

## Why retired
Today List worked but only showed one day at a time. I lost the shape of where each client was in the overall funnel. The [[Pipeline Timeline]] absorbs Today as a filter/preset (`next_action_due <= today`).

## Migration plan
- Today logic preserved as a sort/filter on the new Timeline
- Quick-action buttons surface in the cell popover on the new view
- Daily counter moves to the top bar
