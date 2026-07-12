import db from "../../db/connection.js";
import { makeId } from "../utils/id.js";

const URGENCY_DB_TO_API = { CRITICAL: "critical", HIGH: "high", MEDIUM: "medium", LOW: "low" };
const URGENCY_API_TO_DB = { critical: "CRITICAL", high: "HIGH", medium: "MEDIUM", low: "LOW" };

function daysLeftFor(createdAt, windowDays = 30) {
  const created = new Date(createdAt + "Z");
  const elapsedDays = Math.floor((Date.now() - created.getTime()) / 86_400_000);
  return Math.max(0, windowDays - elapsedDays);
}

/** Shapes a raw case row (+ joined hospital name) into the API/frontend shape. */
function serializeCase(row, { timeline = [], updates = [], donorCount = 0 } = {}) {
  return {
    id: row.id,
    slug: row.short_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title: row.title,
    shortTitle: row.short_title,
    patientName: row.patient_name,
    condition: row.condition,
    category: row.category,
    hospital: row.hospital_name,
    urgency: URGENCY_DB_TO_API[row.urgency] ?? "medium",
    aiMatch: !!row.ai_match,
    verified: row.status !== "PENDING_VERIFICATION",
    status: row.status,
    raised: row.raised,
    goal: row.goal,
    donors: donorCount,
    daysLeft: daysLeftFor(row.created_at),
    heroImage: row.hero_image,
    thumbnail: row.thumbnail,
    summary: row.summary,
    story: row.story ? row.story.split("\n\n").filter(Boolean) : [],
    aiSummary: { challenge: row.ai_challenge, solution: row.ai_solution },
    timeline: timeline.map((t) => ({
      phase: t.phase,
      status: t.status,
      title: t.title,
      detail: t.detail,
    })),
    updates: updates.map((u) => ({
      date: new Date(u.created_at + "Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      label: u.label,
      note: u.note,
      icon: u.icon,
      timeAgo: timeAgoFrom(u.created_at),
    })),
  };
}

function timeAgoFrom(createdAt) {
  const ms = Date.now() - new Date(createdAt + "Z").getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const BASE_SELECT = `
  SELECT cases.*, hospitals.name AS hospital_name
  FROM cases
  JOIN hospitals ON hospitals.id = cases.hospital_id
`;

function donorCountFor(caseId) {
  const row = db
    .prepare(`SELECT COUNT(DISTINCT donor_id) AS n FROM donations WHERE case_id = ?`)
    .get(caseId);
  return row?.n ?? 0;
}

export function listCases({ search, category, urgency, status = "ACTIVE" } = {}) {
  const clauses = [];
  const params = {};

  if (status) {
    clauses.push(`cases.status = @status`);
    params.status = status;
  }
  if (category) {
    clauses.push(`cases.category = @category`);
    params.category = category;
  }
  if (urgency) {
    clauses.push(`cases.urgency = @urgency`);
    params.urgency = URGENCY_API_TO_DB[urgency] ?? urgency.toUpperCase();
  }
  if (search) {
    clauses.push(`(cases.title LIKE @search OR cases.condition LIKE @search OR hospitals.name LIKE @search)`);
    params.search = `%${search}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db.prepare(`${BASE_SELECT} ${where} ORDER BY cases.created_at DESC`).all(params);

  return rows.map((row) => serializeCase(row, { donorCount: donorCountFor(row.id) }));
}

export function getCaseById(id) {
  const row = db.prepare(`${BASE_SELECT} WHERE cases.id = ?`).get(id);
  if (!row) return null;

  const timeline = db
    .prepare(`SELECT * FROM case_timeline_steps WHERE case_id = ? ORDER BY step_order ASC`)
    .all(id);
  const updates = db
    .prepare(`SELECT * FROM case_updates WHERE case_id = ? ORDER BY created_at DESC`)
    .all(id);

  return serializeCase(row, { timeline, updates, donorCount: donorCountFor(id) });
}

export function getCasesByHospital(hospitalId) {
  const rows = db
    .prepare(`${BASE_SELECT} WHERE cases.hospital_id = ? ORDER BY cases.created_at DESC`)
    .all(hospitalId);
  return rows.map((row) => serializeCase(row, { donorCount: donorCountFor(row.id) }));
}

export function getActiveCaseByPatient(patientId) {
  const row = db
    .prepare(`${BASE_SELECT} WHERE cases.patient_id = ? ORDER BY cases.created_at DESC LIMIT 1`)
    .get(patientId);
  if (!row) return null;
  const timeline = db
    .prepare(`SELECT * FROM case_timeline_steps WHERE case_id = ? ORDER BY step_order ASC`)
    .all(row.id);
  return serializeCase(row, { timeline, donorCount: donorCountFor(row.id) });
}

/**
 * Creates a new case from the Create Assistance Request form submission.
 * Starts as PENDING_VERIFICATION — matches the mockup's "sent to our
 * medical review board" success message.
 */
export function createCase({
  hospitalId,
  patientName,
  condition,
  description,
  category = "Surgery",
  urgency = "medium",
  goal,
  aiChallenge = null,
  aiSolution = null,
}) {
  const id = makeId("case");
  const title = `${patientName}'s Care Journey`;
  const shortTitle = condition;

  db.prepare(
    `INSERT INTO cases (
       id, hospital_id, patient_name, condition, category, title, short_title,
       summary, story, urgency, status, goal, raised, ai_challenge, ai_solution
     ) VALUES (
       @id, @hospitalId, @patientName, @condition, @category, @title, @shortTitle,
       @summary, @story, @urgency, 'PENDING_VERIFICATION', @goal, 0, @aiChallenge, @aiSolution
     )`
  ).run({
    id,
    hospitalId,
    patientName,
    condition,
    category,
    title,
    shortTitle,
    summary: description.slice(0, 200),
    story: description,
    urgency: URGENCY_API_TO_DB[urgency] ?? "MEDIUM",
    goal,
    aiChallenge,
    aiSolution,
  });

  db.prepare(
    `INSERT INTO case_timeline_steps (id, case_id, step_order, phase, status, title, detail)
     VALUES (?, ?, 1, 'Phase 1: Submission', 'current', 'Under Medical Review', 'Your request has been sent to our medical review board for verification.')`
  ).run(makeId("step"), id);

  return getCaseById(id);
}

export function recordDonation(caseId, amount) {
  db.prepare(`UPDATE cases SET raised = raised + ?, updated_at = datetime('now') WHERE id = ?`).run(
    amount,
    caseId
  );
}

export const CATEGORIES = ["Surgery", "Medication", "Oncology", "Pediatrics"];
