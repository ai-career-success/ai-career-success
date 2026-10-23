const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth.controller");
const userRepository = require("../repositories/user.repository");

const router = express.Router();

function requireJwtSecrets(res) {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    res.status(500).json({
      error: "JWT_SECRET and JWT_REFRESH_SECRET must be set before auth will work",
    });
    return false;
  }
  return true;
}

function signTokens(user) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

// User registration handled via layered controller -> service -> repository
router.post("/register", (req, res) => authController.register(req, res));

// User login
router.post("/login", async (req, res) => {
  if (!requireJwtSecrets(res)) return;

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await userRepository.updateLastLogin(user.id);
    delete user.password_hash;
    return res.json({ user, ...signTokens(user) });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
