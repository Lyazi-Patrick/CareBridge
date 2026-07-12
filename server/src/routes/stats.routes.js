import { Router } from "express";
import db from "../../db/connection.js";

const router = Router();

router.get("/", (req, res) => {
  const totals = db
    .prepare(`SELECT COALESCE(SUM(raised), 0) AS totalFunded, COUNT(*) AS caseCount FROM cases`)
    .get();
  const hospitalCount = db.prepare(`SELECT COUNT(*) AS n FROM hospitals`).get().n;
  const verifiedCount = db
    .prepare(`SELECT COUNT(*) AS n FROM cases WHERE status != 'PENDING_VERIFICATION'`)
    .get().n;

  const verificationRate = totals.caseCount
    ? ((verifiedCount / totals.caseCount) * 100).toFixed(1)
    : "0.0";

  res.json({
    totalFunded: `$${Math.round(totals.totalFunded).toLocaleString()}`,
    livesTouched: String(totals.caseCount),
    partnerHospitals: String(hospitalCount),
    verificationRate: `${verificationRate}%`,
  });
});

export default router;
