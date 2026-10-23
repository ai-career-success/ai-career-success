const { authService, ValidationError, ConflictError } = require("../services/auth.service");

class AuthController {
  /**
   * Handle user registration.
   * POST /api/auth/register and POST /auth/register
   */
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json({
        message: "User registered successfully",
        userId: result.userId,
        user: result.user,
      });
    } catch (err) {
      if (err instanceof ValidationError || err.name === "ValidationError") {
        return res.status(err.statusCode || 400).json({ error: err.message });
      }

      if (err instanceof ConflictError || err.name === "ConflictError" || err.statusCode === 409) {
        return res.status(409).json({ error: err.message });
      }

      // Safe error handling without logging sensitive body contents
      console.error("Registration error:", err.message);
      return res.status(500).json({ error: "Registration failed" });
    }
  }
}

module.exports = new AuthController();
