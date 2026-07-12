import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as users from "../repositories/users.js";
import * as cases from "../repositories/cases.js";
import * as donations from "../repositories/donations.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("DONOR"),
  asyncHandler(async (req, res) => {
    const donor = users.getDonorByUserId(req.user.id);
    if (!donor) return res.status(404).json({ error: "No donor profile for this user." });

    const { caseId, amount } = req.body;
    const numericAmount = Number(amount);

    if (!caseId || !numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: "caseId and a positive amount are required." });
    }

    const targetCase = cases.getCaseById(caseId);
    if (!targetCase) return res.status(404).json({ error: "Case not found." });

    const donation = donations.createDonation({ caseId, donorId: donor.id, amount: numericAmount });
    res.status(201).json({ donation, updatedCase: cases.getCaseById(caseId) });
  })
);

export default router;
