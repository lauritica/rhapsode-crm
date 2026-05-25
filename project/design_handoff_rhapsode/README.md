# Handoff: Rhapsode CRM — Pipeline Timeline + Today List

A handoff package for a developer using **Claude Code** to implement Rhapsode (Laura Rao's solo-realtor CRM) in a real codebase.

---

## Overview

**Rhapsode** is a CRM for an independent real-estate brokerage. The two screens in this bundle:

1. **Pipeline Timeline** — the centerpiece view. Rows are clients (sellers/buyers), columns are pipeline stages (Lead → Qualified → … → Closed). A continuous horizontal "career bar" runs across each row, with a bright marker on the client's *current* stage. Inspired visually by a TV-show cast/season grid: rows are people, columns are seasons.
2. **Today List** — a simple daily call list (the "before" version of Rhapsode that Laura built solo before this redesign). Included as reference for migration / parity.

The product voice and brand sit inside the **Unicorn Guild design system** (see `Unicorn Guild Design System.html`) — editorial-zine warmth, NOT B2B SaaS chrome. The Pipeline view itself uses a **darker, denser working surface** because it's an operator tool used for hours per day; the brand system applies to marketing, listing presentations, and customer-facing artifacts.

---

## About the Design Files

The HTML files in this folder are **design references**, not production code. They are interactive prototypes built to communicate intended look, behavior, and information density. **Do not ship the HTML directly.** Recreate these designs in the target codebase using its established framework, component library, and patterns.

If no codebase exists yet, **Next.js (App Router) + React + Tailwind CSS + shadcn/ui** is the recommended starting stack — it matches the density and component vocabulary of the prototypes most closely. Use **TanStack Table** for the pipeline grid and **Radix UI** primitives for the drawer and popover.

---

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and interaction patterns are locked. Recreate pixel-perfectly using the codebase's existing libraries. The prototypes use real spacing values, real font stacks, and exact hex codes — all listed below in the Design Tokens section.

---

## Screens / Views

### 1. Pipeline Timeline (`Rhapsode Pipeline.html`, `Rhapsode Pipeline - Demo.html`)

**Purpose:** Single screen that shows every active client, their current pipeline stage, time-in-stage, next action, and the entire history of how they've moved through the funnel — without leaving the page.

**Layout:**
- Full-viewport, dark surface. No sidebar nav (Laura is a solo operator; nav lives in a top bar only).
- **Top bar** (~64px): app mark `Rhapsode` (Instrument Serif italic), tab switcher (Sellers / Buyers), search input (right-aligned), sort dropdown, "+ Add" primary button.
- **Stage header row** (~52px sticky): one column per pipeline stage. Sellers: `Lead → Qualified → Listing Prep → Listed → Under Contract → Inspection → Closing → Closed`. Buyers: `Lead → Qualified → Tour → Offer → Under Contract → Inspection → Closing → Closed`. First column is fixed-width client cell (~280px); stage columns are equal-flex.
- **Pipeline rows** — one per client. Each row is ~80px tall:
  - **Client cell** (left, sticky): avatar (initials, gradient bg), name, address (mono font, smaller), price chip (mono, accent color), days-since-contact dot (status color).
  - **Timeline track**: a thin horizontal bar runs the full width of the stage area. The bar is filled solid from start through the client's current stage; faint/dashed beyond. The current stage is marked with a bright chevron + a translucent vertical wash on that column. Each completed stage cell shows a tiny checkmark; the current cell shows an icon (🔥 hot / 🌤 warming / 🧊 cold) + days-in-stage in mono.
- **Right drawer** (slides in on row click, ~480px wide): full client detail — contact, all notes, all stage transitions with timestamps, files, "next action" form. Closes on Esc or overlay click.
- **Cell popover** (on stage-cell click): inline log-activity form — note text, "move to next stage" toggle, save.

**Components & exact tokens** are in the Design Tokens section below.

### 2. Today List (`Rhapsode Today Before.html`)

**Purpose:** Daily call list. Each row = one client to contact today, with one-tap "Called / Left VM / Texted" actions.

**Layout:**
- Centered single-column layout, max-width ~720px.
- Top: date headline + "X calls remaining" counter.
- Stack of cards, one per client: avatar, name, address, last-contact age, three quick-action buttons.
- This is included as **migration reference** — the new Pipeline Timeline replaces it as the primary daily view, but Today logic should be preserved as a filter/preset on the new view ("Today" = clients with `next_action_due <= today`).

### 3. Unicorn Guild Design System (`Unicorn Guild Design System.html`)

**Purpose:** Brand system for everything customer-facing (marketing site, listing presentations, one-pagers, emails). **Do not apply this to the operator CRM** — the CRM uses the dark working surface defined in the Pipeline file. The two systems coexist intentionally.

---

## Interactions & Behavior

### Pipeline Timeline
- **Tab switch (Sellers/Buyers):** instant, no transition. Stage column headers update.
- **Search:** filters rows live (case-insensitive substring match on name + address).
- **Sort:** options are `Most recent activity`, `Days in stage (desc)`, `Stage progression`, `Alphabetical`.
- **Row click:** opens right drawer with client detail. Drawer is its own URL (`/clients/[id]`) — back button closes it.
- **Stage-cell click:** opens inline popover anchored to the cell. Popover is NOT a separate route. Form: textarea (note), checkbox (`Advance to next stage`), Save button.
- **Drawer Esc / overlay click:** closes drawer, returns to pipeline URL.
- **Status dot temperature** (🔥/🌤/🧊): derived from `days_since_last_contact` — `< 3 days = hot`, `3–7 = warming`, `> 7 = cold`. Update live.
- **Timeline bar fill animation:** when a client advances a stage, animate the bar fill 400ms ease-out and pulse the new stage marker once.

### Today List
- **Quick-action button click:** logs the activity, optimistically updates the row, fades it out 300ms if all three actions complete.

---

## State Management

Recommended: **TanStack Query** for server state, **Zustand** for UI state (active tab, drawer open/closed, popover anchor).

**Data model (minimum):**
```ts
type Client = {
  id: string;
  type: 'seller' | 'buyer';
  name: string;
  address: string;
  price_cents: number;
  current_stage: number;            // index into stages[type]
  stage_history: Array<{
    stage: number;
    entered_at: string;
    exited_at: string | null;
    note: string | null;
  }>;
  last_contact_at: string;
  next_action: string | null;
  next_action_due: string | null;
  notes: Note[];
};
```

---

## Design Tokens

### Colors (CRM dark surface — NOT brand)
```
--bg-0:        oklch(0.16 0.012 60)    /* deepest surface */
--bg-1:        oklch(0.20 0.012 60)    /* row, drawer */
--bg-2:        oklch(0.24 0.014 60)    /* hover, popover */
--ink-0:       oklch(0.96 0.005 80)    /* primary text */
--ink-1:       oklch(0.78 0.008 80)    /* secondary */
--ink-2:       oklch(0.58 0.010 80)    /* muted, mono */
--line:        oklch(1 0 0 / 0.06)
--accent:      oklch(0.78 0.16 55)     /* warm coral — current stage marker */
--hot:         oklch(0.72 0.18 35)     /* 🔥 */
--warm:        oklch(0.82 0.14 75)     /* 🌤 */
--cold:        oklch(0.68 0.08 230)    /* 🧊 */
--ok:          oklch(0.72 0.14 155)    /* completed checkmark */
```

### Typography (CRM)
- **UI:** Inter, weights 400/500/600/700
- **Mono / numerics / addresses:** JetBrains Mono, weights 400/500
- **App mark only:** Instrument Serif, italic, weight 400
- **Type scale:** 11 / 12 / 13 / 14 / 16 / 18 / 22 / 28 px
- **Line-heights:** body 1.5, ui 1.4, mono 1.3

### Spacing
4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 px

### Border radius
- Cells / chips: 6px
- Cards / drawer: 12px
- Buttons: 8px (rectangular) or 999px (pill, primary CTA)

### Shadows
- Drawer: `0 24px 60px oklch(0 0 0 / 0.45)`
- Popover: `0 12px 32px oklch(0 0 0 / 0.35)`

### Brand tokens (Unicorn Guild, for marketing surfaces only)
See `Unicorn Guild Design System.html` for full palette and type. Key colors: Cream `#F6F0E6`, Clay `#C95E3E`, Moss `#4B6B3E`, Sky `#7FA6B8`, Espresso `#1F1713`. Type: Fraunces (serif), Figtree (sans), Caveat (handwritten).

---

## Assets

- **No bundled icons** — use `lucide-react` (matches the simple line style used in the prototypes).
- **Avatars** — initials on a gradient background; no photos in the CRM by default.
- **Fonts** — all from Google Fonts (Inter, JetBrains Mono, Instrument Serif, Fraunces, Figtree, Caveat).

---

## Files

- `Rhapsode Pipeline.html` — primary pipeline view, real client data structure
- `Rhapsode Pipeline - Demo.html` — same view with scrubbed/fake data (use this for screenshots, demos, public sharing)
- `Rhapsode Today Before.html` — pre-redesign daily call list, included for migration reference
- `Unicorn Guild Design System.html` — brand system for customer-facing surfaces (NOT the CRM)

---

## Recommended next steps for the developer

1. Stand up Next.js + Tailwind + shadcn/ui.
2. Define the design tokens above in `tailwind.config.ts` (custom colors, font families, spacing).
3. Build the Pipeline page with TanStack Table — fixed first column, sticky header, custom row renderer for the timeline track.
4. Wire the drawer with Radix `Dialog` (or shadcn `Sheet`) + a route segment for `/clients/[id]`.
5. Wire the cell popover with Radix `Popover`.
6. Stub the data layer against a fake client list, then swap in real persistence (Supabase recommended for a solo operator — auth + Postgres + storage in one).
