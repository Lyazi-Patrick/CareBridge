import db from "../../db/connection.js";
import { makeId } from "../utils/id.js";
import { recordDonation } from "./cases.js";

export function createDonation({ caseId, donorId, amount }) {
  const id = makeId("gift");
  db.prepare(
    `INSERT INTO donations (id, case_id, donor_id, amount) VALUES (?, ?, ?, ?)`
  ).run(id, caseId, donorId, amount);
  recordDonation(caseId, amount);
  return db.prepare(`SELECT * FROM donations WHERE id = ?`).get(id);
}

export function listByDonor(donorId) {
  return db
    .prepare(
      `SELECT donations.*, cases.title AS case_title, cases.id AS case_id, cases.status AS case_status
       FROM donations
       JOIN cases ON cases.id = donations.case_id
       WHERE donations.donor_id = ?
       ORDER BY donations.created_at DESC`
    )
    .all(donorId)
    .map((row) => ({
      caseId: row.case_id,
      caseTitle: row.case_title,
      amount: row.amount,
      date: new Date(row.created_at + "Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: row.case_status === "FUNDED" ? "Funded" : "Active",
    }));
}

export function getDonorStats(donorId) {
  const totals = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(DISTINCT case_id) AS cases
       FROM donations WHERE donor_id = ?`
    )
    .get(donorId);

  return {
    totalGiven: totals.total,
    casesSupported: totals.cases,
    // Simple demo heuristic: more cases + more given -> higher score, capped at 99.
    impactScore: Math.min(99, 60 + totals.cases * 4 + Math.floor(totals.total / 200)),
  };
}
