# CareBridge ❤️

CareBridge is a medical assistance platform connecting verified hospitals with donors who want to help patients who cannot afford treatment.

## Vision

No patient should lose access to healthcare because of financial limitations.

## Features

- Hospital verified assistance requests
- Donor dashboard
- Patient funding tracking
- AI-powered medical request summaries (server-side Gemini integration)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS v4, React Router
- **Backend**: Express + SQLite (`better-sqlite3`), JWT auth
- **AI**: Google Gemini (called server-side only — see `server/README.md`)

## Running locally

This is two apps: the Vite frontend (this folder) and the Express API in `server/`. Run both.

**1. Backend** (see `server/README.md` for full detail):
```bash
cd server
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev          # http://localhost:4000
```

**2. Frontend** (in a separate terminal, from the project root):
```bash
npm install
npm run dev           # http://localhost:5173, proxies /api to the backend
```

Then log in with one of the seeded demo accounts (see `server/README.md`) or register a new account for any role.

## Project structure

```
src/            React frontend (pages, components, services, router)
server/         Express API + SQLite database
CHANGELOG.md    Phase-by-phase development history
```
