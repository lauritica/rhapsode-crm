@AGENTS.md

# Rhapsode CRM — Project Handover

## What This Is
Rhapsode is a real estate CRM + contract tool built for Laura Rao / The Unicorn Realtors.
- GitHub: lauritica/rhapsode-crm
- Deployed: Netlify (rhapsode-crm.netlify.app)
- Stack: Next.js 14 App Router (full server mode, NOT static export), Netlify DB (Neon Postgres), React, custom CSS (oklch color system)

## Database
- Provider: Netlify DB (Neon Postgres via @neondatabase/serverless)
- Connection: `process.env.DATABASE_URL` (set automatically by Netlify)
- Migrations: `netlify/migrations/0001_create_clients.sql` — runs on deploy, seeds all 16 clients
- Supabase is GONE. `lib/supabase.ts` exports null only. Do not re-introduce it.

## Key Files
- `lib/db.ts` — fetchClients(), patchClient() — calls own API routes
- `app/api/clients/route.ts` — GET all clients
- `app/api/clients/[id]/route.ts` — PATCH individual client (per-field tagged templates for Neon)
- `lib/types.ts` — Client, Stage, SELLER_STAGES, BUYER_STAGES types
- `components/PipelineView.tsx` — root view controller, handles all state
- `components/Sidebar.tsx` — nav: dashboard, pipeline, clients, inbox, calendar, reports, automations
- `components/Drawer.tsx` — client detail panel with edit mode, note mode, advance button

## Nav Routing (in PipelineView.tsx)
- `dashboard` → KPI view + pipeline timeline (default)
- `clients` → DashboardView (today's client list)
- `pipeline`, `inbox`, `calendar`, `reports`, `automations` → Coming Soon placeholder
- **RE Scrivener will be a new nav item**: `scrivener` → ScrivenerView component

## Current State (as of commit 681f083)
All CRM features working locally. Netlify deploy triggered — migration should run on first successful build.

## What's Next: RE Scrivener (Phase 1)

### What RE Scrivener Is
A guided contract completion tool embedded in Rhapsode. Not a PDF filler — a smart form that teaches agents the right values, flags mistakes, and generates client-ready language. Think TurboTax for Ohio real estate contracts.

### Phase 1 Scope
1. **Ohio Residential Purchase Agreement** (buyer side)
2. **Exclusive Right to Represent — Buyer** form

### Field Intelligence
The `RE_Scrivener_Field_Intelligence.md` document is the source of truth for:
- Typical values per field
- Math/calculations (earnest money %, tax proration, concession caps)
- "Tell your buyer/seller" language (verbatim scripts)
- AI flag rules (when to warn the agent)

Upload this file to each new chat session — it is NOT in the repo.

### Design Principles
- Mobile-first
- Beginner/Expert mode toggle (Expert hides the coaching text)
- AI flags shown inline as amber warning chips
- Live math: as agent types price → EM % updates in real time
- Draft-first: save locally, send for e-sign separately
- Signatures: BoldSign API (key not yet configured)
- AI: Claude/Anthropic only (no OpenAI)

### How to Add RE Scrivener
1. Add `scrivener` to Sidebar nav items (between automations and the spacer)
2. Add `view === 'scrivener'` case in PipelineView.tsx routing
3. Create `components/ScrivenerView.tsx` — the form shell
4. Create `components/scrivener/` directory for section components
5. Sections follow Field Intelligence doc order:
   - Price & Earnest Money
   - Seller Concessions
   - Financing Type + 4 Milestones
   - Appraisal Contingency
   - Inspection Election + Auto-Consequence warnings
   - Tax Proration (with live math, long vs short)
   - Possession
   - HOA
   - Title Insurance (4 elections)
   - Deed Vesting
   - Seller Certifications (13 yes/no)
   - Offer Expiration
   - Agency Disclosure

### Style Conventions
- Use existing CSS variables: `var(--bg)`, `var(--bg-2)`, `var(--accent)`, `var(--ink)`, `var(--ink-mute)`
- Accent color: oklch purple system already defined in globals.css
- Inputs match Drawer.tsx edit mode style
- Warning flags: amber background, use ⚠ prefix
- No new CSS frameworks — extend globals.css only
