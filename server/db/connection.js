import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// DATABASE_PATH lets tests/scripts point at a throwaway file; defaults to
// the real dev database used by the running server.
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "dev.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;
