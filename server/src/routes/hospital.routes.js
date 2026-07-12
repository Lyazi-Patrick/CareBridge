import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as users from "../repositories/users.js";
import * as cases from "../repositories/cases.js";

const router = Router();

router.use(requireAuth, requireRole("HOSPITAL"));

router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const hospital = users.getHospitalByUserId(req.user.id);
    if (!hospital) return res.status(404).json({ error: "No hospital profile for this user." });

    const hospitalCases = cases.getCasesByHospital(hospital.id);

    const activeCases = hospitalCases.filter((c) => c.status !== "CLOSED");
    const fundedCases = hospitalCases.filter((c) => c.raised >= c.goal);
    const pendingVerification = hospitalCases.filter((c) => c.status === "PENDING_VERIFICATION");
    const totalSupport = hospitalCases.reduce((sum, c) => sum + c.raised, 0);
    const totalDonors = hospitalCases.reduce((sum, c) => sum + c.donors, 0);

    const insight = pendingVerification.length
      ? `You have ${pendingVerification.length} case${pendingVerification.length === 1 ? "" : "s"} awaiting verification. Reviewing ${pendingVerification.length === 1 ? "it" : "them"} promptly keeps your average time-to-funding competitive — hospitals that verify within 48 hours see meaningfully faster donor engagement.`
      : `All ${hospitalCases.length} case${hospitalCases.length === 1 ? "" : "s"} are verified and live. Across ${totalDonors} donor gift${totalDonors === 1 ? "" : "s"}, you've brought in $${Math.round(totalSupport).toLocaleString()} in total support.`;

    res.json({
      hospital: { name: hospital.name, subtitle: hospital.subtitle, adminName: req.user.name },
      insight,
      metrics: [
        { label: "Active Cases", value: String(activeCases.length), icon: "clinical_notes", trend: "Live", trendTone: "secondary" },
        { label: "Fully Funded", value: String(fundedCases.length), icon: "check_circle", trend: `${hospitalCases.length ? Math.round((fundedCases.length / hospitalCases.length) * 100) : 0}% Success`, trendTone: "secondary" },
        { label: "Total Support", value: `$${Math.round(totalSupport).toLocaleString()}`, icon: "payments", trend: "Lifetime", trendTone: "muted" },
        { label: "Pending Verification", value: String(pendingVerification.length), icon: "pending_actions", trend: pendingVerification.length ? "Action Req." : "All Clear", trendTone: pendingVerification.length ? "error" : "secondary" },
      ],
      requests: hospitalCases.slice(0, 10).map((c) => ({
        id: c.id,
        patient: c.patientName,
        initials: c.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        caseType: c.shortTitle,
        doctor: c.doctorName || "Unassigned",
        tags: [
          c.raised >= c.goal
            ? { label: "Funding Complete", tone: "secondary" }
            : { label: `Funding Needed (${Math.round((c.raised / c.goal) * 100)}%)`, tone: "error" },
          { label: c.verified ? "Verified" : "Pending Review", tone: c.verified ? "neutral" : "error" },
        ],
      })),
    });
  })
);

export default router;
