import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import casesRoutes from "./routes/cases.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import donationsRoutes from "./routes/donations.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/cases", casesRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/stats", statsRoutes);

// 404 for unmatched API routes
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CareBridge API listening on http://localhost:${PORT}`);
});
