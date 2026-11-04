const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET is not configured" });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (!payload || typeof payload !== "object" || payload.tokenType !== "access") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Administrator access required" });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };
