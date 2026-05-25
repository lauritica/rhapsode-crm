# Rhapsode — Design System

> The CRM I built for my brokerage. Solo realtor, ADHD brain, bilingual practice, real clients.

**Status:** v1 · April 2026
**Built with:** [[Claude Design]] (prototypes) → [[Claude Code]] (implementation)
**Live files:** see `design_handoff_rhapsode/` in the project repo

---

## What this is

A two-system product:

1. **The CRM (operator surface)** — dark, dense, made for working in for hours. Pipeline Timeline + Today List.
2. **The brand (customer-facing)** — warm, editorial, magical-realism. Lives in marketing, listing presentations, one-pagers. Defined separately in [[Unicorn Guild/Voice]].

The two are intentionally different visual languages. Don't apply the brand palette to the CRM. Don't apply the dark CRM surface to anything a client sees.

---

## The Pipeline Timeline (centerpiece view)

Rows = clients. Columns = pipeline stages. A continuous bar runs across each row, filled solid through the client's current stage, faint beyond. The current stage cell shows a temperature icon (🔥 / 🌤 / 🧊) and days-in-stage.

**Stages — Sellers:** Lead → Qualified → Listing Prep → Listed → Under Contract → Inspection → Closing → Closed
**Stages — Buyers:** Lead → Qualified → Tour → Offer → Under Contract → Inspection → Closing → Closed

**Temperature rules:**
- 🔥 Hot — contacted in last 3 days
- 🌤 Warming — 3–7 days
- 🧊 Cold — over 7 days

---

## Design tokens (CRM)

### Colors — dark working surface
| Token | Value | Use |
|---|---|---|
| `--bg-0` | `oklch(0.16 0.012 60)` | Page background |
| `--bg-1` | `oklch(0.20 0.012 60)` | Rows, drawer |
| `--bg-2` | `oklch(0.24 0.014 60)` | Hover, popover |
| `--ink-0` | `oklch(0.96 0.005 80)` | Primary text |
| `--ink-1` | `oklch(0.78 0.008 80)` | Secondary |
| `--ink-2` | `oklch(0.58 0.010 80)` | Muted, mono |
| `--accent` | `oklch(0.78 0.16 55)` | Current-stage marker |
| `--hot` | `oklch(0.72 0.18 35)` | 🔥 |
| `--warm` | `oklch(0.82 0.14 75)` | 🌤 |
| `--cold` | `oklch(0.68 0.08 230)` | 🧊 |
| `--ok` | `oklch(0.72 0.14 155)` | Completed checkmark |

### Typography
- **UI:** Inter (400/500/600/700)
- **Mono / numerics / addresses:** JetBrains Mono (400/500)
- **App mark only:** Instrument Serif italic
- **Scale:** 11 / 12 / 13 / 14 / 16 / 18 / 22 / 28 px

### Spacing
4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64

---

## Stack (recommended)

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix primitives
- **Table:** TanStack Table (for the pipeline grid)
- **Data:** Supabase (auth + Postgres + storage in one)
- **State:** TanStack Query (server) + Zustand (UI)

---

## Links
- [[Decisions]] — dated log of design + product calls
- [[Roadmap]] — what's next
- [[Screens/Pipeline Timeline]]
- [[Screens/Today List]]
- [[Unicorn Guild/Voice]] — brand voice (separate system)
