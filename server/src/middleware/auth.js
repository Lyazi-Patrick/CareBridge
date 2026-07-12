import { verifyToken } from "../utils/jwt.js";
import { findById } from "../repositories/users.js";

/** Verifies the Bearer token and attaches `req.user` (the DB user row, minus password_hash). */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  try {
    const payload = verifyToken(token);
    const user = findById(payload.sub);
    if (!user) return res.status(401).json({ error: "User no longer exists." });

    const { password_hash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/** Use after requireAuth. Restricts a route to one or more roles. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `This action requires role: ${roles.join(" or ")}.` });
    }
    next();
  };
}
