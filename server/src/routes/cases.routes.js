import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as cases from "../repositories/cases.js";
import * as users from "../repositories/users.js";
import { generateCaseSummary as aiCaseSummary, generateFormAssist as aiFormAssist } from "../services/aiService.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, category, urgency } = req.query;
    res.json({ cases: cases.listCases({ search, category, urgency }) });
  })
);

router.get("/categories", (req, res) => {
  res.json({ categories: cases.CATEGORIES });
});

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const found = cases.getCaseById(req.params.id);
    if (!found) return res.status(404).json({ error: "Case not found." });
    res.json({ case: found });
  })
);

router.get(
  "/:id/ai-summary",
  asyncHandler(async (req, res) => {
    const found = cases.getCaseById(req.params.id);
    if (!found) return res.status(404).json({ error: "Case not found." });
    const summary = await aiCaseSummary(found);
    res.json({ summary });
  })
);

// Hospital creates a new assistance request.
router.post(
  "/",
  requireAuth,
  requireRole("HOSPITAL"),
  asyncHandler(async (req, res) => {
    const hospital = users.getHospitalByUserId(req.user.id);
    if (!hospital) return res.status(404).json({ error: "No hospital profile for this user." });

    const { patientName, condition, description, category, urgency, fundingGoal } = req.body;
    if (!patientName || !condition || !description || !fundingGoal) {
      return res
        .status(400)
        .json({ error: "patientName, condition, description, and fundingGoal are required." });
    }

    const created = cases.createCase({
      hospitalId: hospital.id,
      patientName,
      condition,
      description,
      category,
      urgency,
      goal: Number(fundingGoal),
    });

    res.status(201).json({ case: created });
  })
);

// AI-assisted rewrite while filling out the Create Assistance Request form
// (before the case exists yet, so it's not scoped to a case id).
router.post(
  "/ai-assist",
  requireAuth,
  requireRole("HOSPITAL"),
  asyncHandler(async (req, res) => {
    const { patientName, condition, description } = req.body;
    const text = await aiFormAssist({ patientName, condition, description });
    res.json({ text });
  })
);

export default router;
