const { query } = require("../config/db");

class UserRepository {
  /**
   * Find a user by email (case-insensitive).
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const result = await query(
      `SELECT id, first_name, last_name, email, role, is_active, is_verified, created_at, updated_at
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [normalizedEmail]
    );
    return result.rows[0] || null;
  }

  /**
   * Find a user by ID.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;
    const result = await query(
      `SELECT id, first_name, last_name, email, role, is_active, is_verified, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new user record.
   * Parameterized SQL only. Never returns password_hash.
   * @param {object} params
   * @param {string} params.firstName
   * @param {string} params.lastName
   * @param {string} params.email
   * @param {string} params.passwordHash
   * @param {string} [params.role='user']
   * @returns {Promise<{id: string, userId: string, first_name: string, last_name: string, email: string, role: string}>}
   */
  async createUser({ firstName, lastName, email, passwordHash, role = "user" }) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, role, is_active, created_at`,
      [firstName, lastName, normalizedEmail, passwordHash, role]
    );
    const row = result.rows[0];
    return {
      userId: row.id,
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      role: row.role,
      is_active: row.is_active,
      created_at: row.created_at,
    };
  }
}

module.exports = new UserRepository();
