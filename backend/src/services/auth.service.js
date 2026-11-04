const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_SALT_ROUNDS = 12;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class ConflictError extends Error {
  constructor(message = "Email already registered") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

class AuthenticationError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

class AuthService {
  /**
   * Validate user registration payload.
   * @param {object} data
   */
  validateRegistrationData(data) {
    if (!data || typeof data !== "object") {
      throw new ValidationError("Registration data is required");
    }

    const firstName = (data.first_name || data.firstName || "").toString().trim();
    const lastName = (data.last_name || data.lastName || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const password = typeof data.password === "string" ? data.password : "";
    const confirmPassword = typeof data.confirmPassword === "string" ? data.confirmPassword : "";

    if (!firstName) {
      throw new ValidationError("First name is required");
    }

    if (!lastName) {
      throw new ValidationError("Last name is required");
    }

    if (!email) {
      throw new ValidationError("Email is required");
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("Invalid email format");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    if (password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      throw new ValidationError("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      throw new ValidationError("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new ValidationError("Password must contain at least one number");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
      throw new ValidationError("Password must contain at least one special character");
    }

    if (!confirmPassword) {
      throw new ValidationError("Password confirmation is required");
    }

    if (password !== confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    return {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    };
  }

  /**
   * Validate login payload.
   * @param {object} data
   */
  validateLoginData(data) {
    if (!data || typeof data !== "object") {
      throw new ValidationError("Login data is required");
    }

    const email = (data.email || "").toString().trim();
    const password = typeof data.password === "string" ? data.password : "";

    if (!email) {
      throw new ValidationError("Email is required");
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("Invalid email format");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    return {
      email: email.toLowerCase(),
      password,
    };
  }

  /**
   * Register a new user.
   * @param {object} registrationData
   * @returns {Promise<{userId: string, user: object}>}
   */
  async register(registrationData) {
    const { firstName, lastName, email, password } = this.validateRegistrationData(registrationData);

    // Case-insensitive duplicate check before insertion
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Hash password with bcrypt cost >= 12
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    try {
      const createdUser = await userRepository.createUser({
        firstName,
        lastName,
        email,
        passwordHash,
        role: "user",
      });

      return {
        userId: createdUser.userId,
        user: {
          id: createdUser.id,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          email: createdUser.email,
          role: createdUser.role,
        },
      };
    } catch (err) {
      // Handle unique constraint violations: Prisma P2002 and PostgreSQL 23505
      if (err.code === "P2002" || err.code === "23505") {
        throw new ConflictError("Email already registered");
      }
      throw err;
    }
  }

  /**
   * Authenticate a user and issue access and refresh tokens.
   * @param {object} credentials
   * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
   */
  async login(credentials) {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }

    const { email, password } = this.validateLoginData(credentials);

    const user = await userRepository.findByEmailWithPassword(email);
    if (!user || !user.is_active) {
      throw new AuthenticationError();
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AuthenticationError();
    }

    await userRepository.updateLastLogin(user.id);

    const safeUser = { ...user };
    delete safeUser.password_hash;
    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(
      { ...tokenPayload, tokenType: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { ...tokenPayload, tokenType: "refresh" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    return { user: safeUser, accessToken, refreshToken };
  }
}

module.exports = {
  AuthService,
  authService: new AuthService(),
  ValidationError,
  ConflictError,
  AuthenticationError,
};
