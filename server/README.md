# CareBridge API

Express + SQLite (via `better-sqlite3`) backend for CareBridge. Replaces all
the frontend's `src/data/mock*.js` files — the frontend now reads and writes
real data through this API.

## Why SQLite + raw SQL instead of Prisma?

Prisma was the original plan, but its migration engine needs to download a
platform binary from `binaries.prisma.sh`, which was blocked in the sandbox
this was built in. `better-sqlite3` has no such external dependency (its
prebuilt binary comes from GitHub releases) and needs no separate DB server
to install — just `npm install` and go. If you outgrow SQLite later, the
`db/schema.sql` + `src/repositories/*.js` layer is straightforward to port to
Postgres/Prisma; the route handlers don't need to change.

## Setup

```bash
cd server
npm install
cp .env.example .env        # fill in GEMINI_API_KEY if you want real AI responses
npm run db:migrate          # creates db/dev.db from db/schema.sql
npm run db:seed             # populates demo hospitals, cases, patient, donor
npm run dev                 # starts the API on http://localhost:4000
```

`npm run db:reset` does migrate + seed in one step (drops the existing DB
first) — handy if the data gets messy while you're testing.

## Demo accounts

All seeded accounts use the password `password123`:

| Role     | Email                                    | Notes                          |
|----------|-------------------------------------------|---------------------------------|
| Hospital | citygeneralhospital@carebridge.dev        | Owns 2 of the 6 seeded cases    |
| Patient  | patient@carebridge.dev                    | Linked to Elara's active case   |
| Donor    | donor@carebridge.dev                      | Has 3 seeded donations          |

Three other hospitals exist too (`mayoclinic@…`, `spauldingrehab@…`,
`berlinmedical@…`) if you want to test multi-hospital scenarios.

## API surface

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/cases` (query: `search`, `category`, `urgency`), `GET /api/cases/:id`
- `GET /api/cases/categories`
- `GET /api/cases/:id/ai-summary` — Gemini-generated donor summary (falls back to canned copy if `GEMINI_API_KEY` isn't set)
- `POST /api/cases` — hospital creates a case (auth: HOSPITAL)
- `POST /api/cases/ai-assist` — Gemini rewrite of a raw case description (auth: HOSPITAL)
- `GET /api/hospital/dashboard` (auth: HOSPITAL)
- `GET /api/patient/dashboard` (auth: PATIENT)
- `GET /api/donor/dashboard` (auth: DONOR)
- `POST /api/donations` (auth: DONOR)
- `GET /api/stats` — public, real aggregated platform numbers for the landing page

## Notes / known gaps

- **No file uploads yet.** The `documents` table exists and is seeded with
  sample rows, but there's no upload endpoint — Create Assistance Request's
  file step says so honestly rather than faking it.
- **Gemini calls are server-side only** now — the key lives in `server/.env`,
  never shipped to the browser (this was a flagged issue in the frontend-only
  build; fixed here).
- **JWT_SECRET** in `.env.example` is a placeholder — generate a real random
  string for anything beyond local dev.
- SQLite is fine for a demo/hackathon; for concurrent production traffic
  you'll want to move to Postgres (the repository-pattern code makes this a
  contained change, not a rewrite).
