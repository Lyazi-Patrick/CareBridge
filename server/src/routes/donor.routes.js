import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as users from "../repositories/users.js";
import * as donations from "../repositories/donations.js";

const router = Router();

router.use(requireAuth, requireRole("DONOR"));

router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const donor = users.getDonorByUserId(req.user.id);
    if (!donor) return res.status(404).json({ error: "No donor profile for this user." });

    const stats = donations.getDonorStats(donor.id);
    const gifts = donations.listByDonor(donor.id);

    const insight =
      gifts.length > 0
        ? `You've supported ${stats.casesSupported} case${stats.casesSupported === 1 ? "" : "s"} totaling $${stats.totalGiven.toLocaleString()}. Your impact score of ${stats.impactScore} reflects consistent, high-follow-through giving.`
        : "You haven't made any gifts yet — browse verified cases to start making an impact.";

    res.json({
      donor: { name: req.user.name, ...stats },
      gifts,
      impactInsight: insight,
    });
  })
);

export default router;
