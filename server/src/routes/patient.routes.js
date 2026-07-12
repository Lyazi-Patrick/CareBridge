import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as users from "../repositories/users.js";
import * as cases from "../repositories/cases.js";
import db from "../../db/connection.js";
import { generateCaseSummary } from "../services/aiService.js";

const router = Router();

router.use(requireAuth, requireRole("PATIENT"));

router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const patient = users.getPatientByUserId(req.user.id);
    if (!patient) return res.status(404).json({ error: "No patient profile for this user." });

    const activeCase = cases.getActiveCaseByPatient(patient.id);
    if (!activeCase) {
      return res.json({ patient: { name: req.user.name, avatarUrl: req.user.avatar_url }, activeCase: null });
    }

    const documents = db
      .prepare(`SELECT * FROM documents WHERE case_id = ? ORDER BY created_at DESC`)
      .all(activeCase.id)
      .map((d) => ({ name: d.name, meta: d.meta, icon: d.icon }));

    const messages = db
      .prepare(`SELECT * FROM donor_messages WHERE case_id = ? ORDER BY created_at DESC LIMIT 10`)
      .all(activeCase.id)
      .map((m) => ({
        name: m.sender_name,
        initials: m.sender_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        message: m.message,
        timeAgo: timeAgoFrom(m.created_at),
      }));

    const aiInsight = await generateCaseSummary(activeCase);

    res.json({
      patient: {
        name: req.user.name,
        avatarUrl: req.user.avatar_url,
        raised: activeCase.raised,
        goal: activeCase.goal,
        donors: activeCase.donors,
        daysLeft: activeCase.daysLeft,
        avgGift: activeCase.donors ? Math.round(activeCase.raised / activeCase.donors) : 0,
        status: activeCase.status === "FUNDED" ? "Funded" : "Active",
      },
      roadmap: activeCase.timeline,
      documents,
      donorMessages: messages,
      aiInsight,
    });
  })
);

function timeAgoFrom(createdAt) {
  const ms = Date.now() - new Date(createdAt + "Z").getTime();
  const hours = Math.floor(ms / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default router;
