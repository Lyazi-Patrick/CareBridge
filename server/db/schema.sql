-- CareBridge database schema (SQLite).
-- Chose a plain SQL + better-sqlite3 setup over an ORM with native engine
-- binaries (Prisma's engine download was blocked by this environment's
-- network policy) — this is dependency-light and runs anywhere Node runs.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('DONOR', 'PATIENT', 'HOSPITAL')),
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hospitals (
  id         TEXT PRIMARY KEY,
  user_id    TEXT UNIQUE NOT NULL REFERENCES users(id),
  name       TEXT NOT NULL,
  subtitle   TEXT NOT NULL DEFAULT 'Verified Provider',
  verified   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS patients (
  id         TEXT PRIMARY KEY,
  user_id    TEXT UNIQUE NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donors (
  id         TEXT PRIMARY KEY,
  user_id    TEXT UNIQUE NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cases (
  id           TEXT PRIMARY KEY,
  hospital_id  TEXT NOT NULL REFERENCES hospitals(id),
  patient_id   TEXT REFERENCES patients(id),

  patient_name TEXT NOT NULL,
  condition    TEXT NOT NULL,
  category     TEXT NOT NULL,
  title        TEXT NOT NULL,
  short_title  TEXT NOT NULL,
  summary      TEXT NOT NULL,
  story        TEXT NOT NULL DEFAULT '',
  hero_image   TEXT,
  thumbnail    TEXT,

  urgency      TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (urgency IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  status       TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION'
               CHECK (status IN ('PENDING_VERIFICATION', 'ACTIVE', 'FUNDED', 'CLOSED')),
  ai_match     INTEGER NOT NULL DEFAULT 0,

  goal         REAL NOT NULL,
  raised       REAL NOT NULL DEFAULT 0,

  doctor_name  TEXT,
  ai_challenge TEXT,
  ai_solution  TEXT,

  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cases_status   ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
CREATE INDEX IF NOT EXISTS idx_cases_urgency  ON cases(urgency);

CREATE TABLE IF NOT EXISTS case_timeline_steps (
  id      TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  step_order   INTEGER NOT NULL,
  phase   TEXT NOT NULL,
  status  TEXT NOT NULL, -- 'complete' | 'current' | 'upcoming'
  title   TEXT NOT NULL,
  detail  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS case_updates (
  id         TEXT PRIMARY KEY,
  case_id    TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  note       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT 'info',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
  id         TEXT PRIMARY KEY,
  case_id    TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  meta       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT 'description',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donations (
  id         TEXT PRIMARY KEY,
  case_id    TEXT NOT NULL REFERENCES cases(id),
  donor_id   TEXT NOT NULL REFERENCES donors(id),
  amount     REAL NOT NULL,
  status     TEXT NOT NULL DEFAULT 'Active', -- 'Active' | 'Funded'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donor_messages (
  id          TEXT PRIMARY KEY,
  case_id     TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
