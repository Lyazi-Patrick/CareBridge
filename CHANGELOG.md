# CareBridge — Changelog

All notable changes to this project are logged here, phase by phase, per the
approved implementation plan.

## Phase 1 — Theme, Routing, Layouts, Reusable UI (2026-07-11)

### Added
- `src/styles/theme.css` — Tailwind v4 `@theme` block porting every token from
  `DESIGN.md` (colors, spacing, radii, Inter type scale) into CSS custom
  properties. Mobile display-scale override included.
- `src/styles/base.css` — shared utility classes consolidated from all 6
  Stitch mockups: `.premium-card`, `.glass-card`, `.premium-blur`,
  `.hero-mesh`, `.ai-indigo-border`, `.timeline-line`, `.custom-scrollbar`.
  Also sets global `:focus-visible` ring and `prefers-reduced-motion` support.
- `src/components/ui/Button.jsx` — variants: `primary`, `container`, `ghost`,
  `secondary`, `danger`, `link`; sizes `sm`/`md`/`lg`; optional icon.
- `src/components/ui/Card.jsx`, `ProgressBar.jsx`, `VerificationBadge.jsx`,
  `UrgencyLabel.jsx` — small reusable primitives matching DESIGN.md specs.
- `src/components/ai/AIInsightPanel.jsx` — canonical AI Indigo–accented
  wrapper for all Gemini-generated content, with `idle/loading/error/ready`
  states built in.
- `src/components/layout/Navbar.jsx`, `Footer.jsx` — public-site header/footer
  (landing, cases, auth pages), responsive with mobile menu.
- `src/components/layout/Sidebar.jsx`, `MobileNav.jsx` — shared dashboard nav
  shell, driven by a `navItems` config so hospital/donor dashboards reuse one
  component instead of forking near-identical sidebars.
- `src/components/layout/PatientTopNav.jsx` — lighter top-nav for the
  patient-facing dashboard (no sidebar, per its mockup).
- `src/layouts/MainLayout.jsx`, `DashboardLayout.jsx`, `PatientLayout.jsx`.
- `src/router/index.jsx` — centralized `createBrowserRouter` config; also
  where `HOSPITAL_NAV_ITEMS` / `DONOR_NAV_ITEMS` are defined so a route and
  its sidebar entry can't drift out of sync.
- Placeholder pages for every route (`PagePlaceholder.jsx`-based) so routing
  and layouts are fully clickable/testable before each page's content phase.
- `src/pages/NotFound.jsx` — 404 route.

### Changed
- `src/index.css` — now imports Inter font, `tailwindcss`, `theme.css`,
  `base.css`, in that order (font import must precede `@import "tailwindcss"`
  per CSS spec — fixed a build warning).
- `src/App.jsx` / `src/main.jsx` — replaced default Vite counter demo with
  `RouterProvider`.
- `.gitignore` — added `.env`, `.env.local`, `.env.*.local` ahead of Phase 7
  Gemini key usage.

### Renamed (typo/consistency fixes, approved)
- `pages/HospitalDashbaord.jsx` → `pages/hospital/HospitalDashboard.jsx`
- `pages/DonorDashBoard.jsx` → `pages/donor/DonorDashboard.jsx`
- `components/Button.jsx` → `components/ui/Button.jsx`
- `components/Navbar.jsx` → `components/layout/Navbar.jsx`
- `components/Footer.jsx` → `components/layout/Footer.jsx`

### Removed
- `src/App.css`, `src/assets/react.svg`, `public/vite.svg` — unused Vite
  boilerplate.

### Dependencies
- None added. Confirmed `react-router-dom`, `lucide-react`, `framer-motion`,
  `recharts`, `tailwindcss` v4 already present and sufficient for this phase.
- Ran `npm install` once to regenerate the platform-specific optional
  binaries (`node_modules` in the uploaded zip was built for a different OS
  than this build environment — this is a one-time local fix, not a
  dependency change).

### Verified
- `vite build` — clean, no warnings.
- `eslint src` — no errors.

### Manual steps for you
- None required to pull this phase in. If you see a
  `Cannot find native binding` error when you build locally, run
  `npm install` once — it's the same platform-binary issue described above,
  specific to whichever machine you're on.

### Notes for future phases
- `recharts` is installed but unused so far — no design mockup shows a chart.
  I'll only reach for it in Phase 5/6 if the hospital/donor dashboards need
  one; otherwise flagging it as a candidate to drop before ship.
- Icon mapping (Material Symbols → lucide-react) landed inline in each
  component as I built it; full table was shared in the Phase 1 plan message.

## Phases 2–7 — Full build-out (2026-07-11)

At your request, all remaining phases were completed in one pass rather than
pausing after each. Summary below; still organized by phase for reference.

### Phase 2 — Landing Page
- `src/pages/Home.jsx` — hero, platform stats bar, "How It Works" (3-step),
  featured cases grid, AI-transparency section, testimonials, final CTA.
  Ported directly from `carebridge_landing_page/code.html`.
- `src/components/cases/CaseCard.jsx` — shared case card used here and in
  Discover Cases (urgency/AI-match badge, progress bar, verified-hospital
  line). One component instead of two near-duplicate cards.
- `src/data/mockCases.js` — the shared case dataset every case-related page
  reads from (6 cases, covering critical/high/medium/AI-match variants).

### Phase 3 — Authentication
- `src/components/auth/AuthShell.jsx` — shared split-screen chrome (form
  left, hero-mesh brand panel right) for Login/Register. No mockup existed
  for these two pages — designed to match `DESIGN.md` tokens exactly.
- `src/pages/Login.jsx`, `Register.jsx` — Register includes a role picker
  (Donor/Patient/Hospital) since the app has three distinct dashboards;
  submission routes to the matching dashboard (no backend yet, per plan).

### Phase 4 — Medical Cases Discovery & Case Details
- `src/pages/cases/DiscoverCases.jsx` — working filters (search, treatment
  type, urgency) over live state, not just static markup like the mockup's
  vanilla-JS version; "Load More" paginates the filtered set.
- `src/components/ai/AIFloatingAssistant.jsx` — the floating chat bubble
  from the discovery mockup, extracted since it's a fixed overlay.
- `src/pages/cases/CaseDetails.jsx` — hero, sticky donate widget, AI Medical
  Insight panel (now actually wired to `aiService.js`, see Phase 7), story,
  treatment timeline, medical updates. Handles unknown `:caseId` with a
  "case not found" state instead of crashing.

### Phase 5 — Hospital Dashboard & Create Assistance Request
- `src/pages/hospital/HospitalDashboard.jsx` — metric bento grid, requests
  table, Bridge Insights panel, facility load bars, network-expansion CTA.
- `src/pages/hospital/CreateAssistanceRequest.jsx` — the 3-step form
  (Info → Financial → Files) is now a real React state machine (not the
  mockup's manual DOM class-toggling), with a working "AI Insight" assist
  button and a submit → success-modal flow.
- `src/data/mockHospital.js` — metrics, requests table rows, insight copy.

### Phase 6 — Patient & Donor Dashboards
- `src/pages/patient/PatientDashboard.jsx` — funding progress, next medical
  step, journey roadmap, donor messages, documents, full-width AI insight.
- `src/pages/donor/DonorDashboard.jsx` — **no Stitch mockup existed for
  this page.** Built from scratch to match `DESIGN.md` and reuse the same
  card/table/AI-panel patterns as the other dashboards (stats row, gift
  history table, impact insight, "discover more cases" CTA) so it doesn't
  feel bolted on. Flagging this explicitly since it wasn't derived from a
  provided design — worth a look to confirm it matches your expectations.
- `src/data/mockPatient.js`, `mockDonor.js`.

### Phase 7 — AI Integration, Animations, Performance
- `src/services/aiService.js` — real Gemini integration, not a stub:
  - `generateCaseSummary()` — donor-facing plain-language case summary,
    used by CaseDetails.
  - `generateFormAssist()` — rewrites a hospital admin's raw case
    description into donor-friendly language, used by the "Assist" button
    in Create Assistance Request.
  - Both call a single `callGemini()` low-level function using
    `VITE_GEMINI_API_KEY` directly from the client (per your Phase 1
    decision). Swapping to a backend proxy later means editing only
    `callGemini()` — every caller's signature stays the same.
  - Both gracefully fall back to mock copy if the key isn't set, so the
    app never breaks in a fresh checkout without `.env`.
  - `.env.example` added documenting the key.
- **Animations** — `framer-motion` (previously installed, unused) now
  does real work: `CaseCard` fades/slides in on scroll (restores the
  mockup's IntersectionObserver reveal behavior, done the React way), and
  the Home hero content staggers in on load.
- **Performance** — route-level code-splitting via `React.lazy` +
  `Suspense` (`src/router/index.jsx`, new `RouteLoading.jsx` fallback).
  Triggered by a real problem: once framer-motion + all 9 pages were
  bundled, the build warned about a >500kB chunk. Splitting brought the
  main bundle to ~296kB with each page as its own small chunk
  (3–14kB apiece).
- Removed the unused `recharts` dependency — no page ended up needing a
  chart; kept the bundle leaner.
- `src/router/navConfig.js` — hospital/donor nav configs moved out of
  `router/index.jsx` into their own file (fixed an ESLint
  `react-refresh/only-export-components` conflict between the lazy
  component refs and the router's non-component default export).

### Verified (final pass)
- `vite build` — clean, no warnings, all chunks under the 500kB threshold.
- `eslint src` — no errors, including the stricter `react-hooks/*` rules
  (fixed a `set-state-in-effect` violation in `CaseDetails.jsx` by deriving
  AI-panel status from render-time state instead of setting it
  synchronously inside the effect).

### Known gaps / things to sanity-check
- **No backend.** Every page reads from `src/data/mock*.js`. Login/Register
  don't persist anything — they just route to the right dashboard shell so
  the flow is demoable end-to-end.
- **Donor Dashboard has no source mockup** (see Phase 6 note above) — worth
  a look before you rely on it for a demo.
- **Gemini calls are unauthenticated client-side** — fine for a hackathon
  demo per your Phase 1 decision, but flagged again here since real API
  keys are now actually wired in, not just planned.
- No automated tests were added (out of scope for the approved plan) —
  only build + lint were used to verify correctness.

## Phase 8 — Full Backend + Removal of Mock Data (2026-07-12)

At your request: a real Express + SQLite backend, and every page now reads
live data through it instead of the `src/data/mock*.js` files (which are
deleted).

### Backend (new `server/` directory)
- **Stack**: Express + `better-sqlite3` (not Prisma — its migration engine
  needed a binary download from `binaries.prisma.sh` that this environment's
  network policy blocked; `better-sqlite3`'s prebuilt binary comes from
  GitHub releases instead and installed cleanly). Raw SQL schema in
  `server/db/schema.sql`, a small repository layer in `server/src/repositories/`.
- **Auth**: JWT (`jsonwebtoken`) + bcrypt password hashing, three roles
  (HOSPITAL/PATIENT/DONOR), `requireAuth`/`requireRole` middleware.
- **Domain tables**: users, hospitals, patients, donors, cases,
  case_timeline_steps, case_updates, documents, donations, donor_messages —
  this is the real version of everything that used to be hardcoded in
  `mockCases.js`, `mockHospital.js`, `mockPatient.js`, `mockDonor.js`.
- **Routes**: auth, cases (list/detail/create/categories), hospital
  dashboard, patient dashboard, donor dashboard, donations, and a new public
  `/api/stats` endpoint (real aggregated numbers for the landing page instead
  of the old hardcoded `PLATFORM_STATS`).
- **AI moved server-side.** `server/src/services/aiService.js` now holds the
  Gemini integration; the key lives in `server/.env` and is never sent to the
  browser. This is the actual fix for the client-side-key risk flagged in
  earlier phases — not just a note this time.
- **Seed script** (`server/db/seed.js`) populates 4 hospitals, 6 cases (same
  patients/conditions as the old mock data, now real DB rows with real
  relations), a demo patient linked to an active case, a demo donor with
  seeded donations, and a couple of extra donors so donor-count aggregates
  don't all read "1". Every seeded account uses password `password123`.
- Verified end-to-end with curl against a running server: register, login
  (all 3 roles), all 3 dashboards, case list/detail/create, donations,
  categories, stats, and error paths (wrong password → 401, no token → 401,
  wrong role → 403, unknown case → 404) all behave correctly.

### Frontend
- **New `src/services/`**: `apiClient.js` (fetch wrapper + token storage),
  `authService.js`, `casesService.js`, `hospitalService.js`,
  `patientService.js`, `donorService.js`, `donationsService.js`,
  `statsService.js`. The old client-side `aiService.js` (direct Gemini calls)
  is deleted — AI now goes through the backend via `casesService`.
- **New `src/context/AuthContext.jsx`** — app-wide auth state (login,
  register, logout, current user), token persisted in `localStorage`.
- **New `src/components/ui/ProtectedRoute.jsx`** — redirects to `/login` if
  unauthenticated, or to the user's own dashboard if they're the wrong role
  for a route (e.g. a donor hitting `/hospital`).
- **New `src/components/cases/DonateModal.jsx`** — the actual "Donate Now"
  flow on Case Details (preset/custom amount, requires a DONOR login, updates
  the case's raised total live after donating).
- **Every data-consuming page rewritten** to fetch from the API instead of
  importing mock objects: `Home`, `DiscoverCases`, `CaseDetails`,
  `HospitalDashboard`, `CreateAssistanceRequest`, `PatientDashboard`,
  `DonorDashboard`. All have loading/error states now (previously mock data
  meant no such state was possible).
- `Login`/`Register` now call the real backend and route by the role the API
  returns, instead of a fake `navigate()` with no backend call.
- `Navbar`, `Sidebar`, `PatientTopNav` now reflect real auth state (show
  "My Dashboard"/"Log Out" when signed in; Sidebar identity card pulls the
  logged-in user's name instead of a hardcoded string).
- `vite.config.js` — added a dev-server proxy (`/api` → `localhost:4000`) so
  the frontend never needs CORS config or a base-URL env var in dev.
- Deleted `src/data/` entirely (`mockCases.js`, `mockHospital.js`,
  `mockPatient.js`, `mockDonor.js`) and the frontend's `.env.example`
  (`VITE_GEMINI_API_KEY` is gone — the key only exists in `server/.env` now).

### Honesty notes (things I chose not to fake)
- **File uploads**: Create Assistance Request's "Files" step now says
  plainly that upload isn't wired up yet, instead of showing fake
  `Diagnosis_Report.pdf`-style chips implying a real upload happened.
- **Hospital dashboard "Bridge Insights"**: previously a hardcoded sentence;
  now computed from the hospital's real case/donation data (verification
  backlog, total support, donor count) rather than fabricated copy.
- **Landing page stats**: previously hardcoded (`$42M+`, `12,400`, etc.);
  now come from `/api/stats`, computed live from the seeded database.
- **Testimonials** on the landing page are the one exception left as static
  content — they're editorial/marketing copy (quotes from named people),
  not modeled application data, so a database table for them would be
  over-engineering relative to their purpose. Flagging this explicitly in
  case you'd rather they came from a real "testimonials" admin-editable
  source later.

### Verified
- Backend: manual curl-based end-to-end test of every route and role,
  including error paths, against a running server with a freshly seeded DB.
- Frontend: `vite build` clean, `eslint src` clean (including fixing two new
  `set-state-in-effect` violations introduced by the async data-fetching
  rewrite, using the same derived-state pattern established in Phase 7).
- Did **not** run a browser-based end-to-end test (no headless browser
  available in this environment) — recommend clicking through the main
  flows yourself (register each role, browse cases, donate, create a case)
  before treating this as fully verified.
