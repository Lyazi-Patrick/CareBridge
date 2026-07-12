import { Router } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import * as users from "../repositories/users.js";

const router = Router();

const ROLES = ["DONOR", "PATIENT", "HOSPITAL"];

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "email, password, name, and role are required." });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${ROLES.join(", ")}` });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    if (users.findByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = users.createUser({ email, passwordHash, role, name });

    if (role === "HOSPITAL") users.createHospitalProfile(user.id, name);
    if (role === "PATIENT") users.createPatientProfile(user.id);
    if (role === "DONOR") users.createDonorProfile(user.id);

    const token = signToken(user);
    const { password_hash, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }

    const user = users.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user);
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  })
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
