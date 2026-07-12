import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "dev.db");

if (process.argv.includes("--reset")) {
  for (const suffix of ["", "-wal", "-shm"]) {
    const f = dbFile + suffix;
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  console.log("Dropped existing dev.db (--reset).");
}

// Import after handling --reset so the connection singleton opens a fresh file.
const { default: db } = await import("./connection.js");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
db.exec(schema);

console.log("Schema applied to", dbFile);
