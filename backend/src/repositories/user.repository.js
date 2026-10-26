const { prisma } = require("../config/db");

class UserRepository {
  /**
   * Find a user by email (case-insensitive).
   * Password hash is never returned.
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
    return user || null;
  }

  /**
   * Find a user by ID.
   * Password hash is never returned.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
    return user || null;
  }

  /**
   * Create a new user record.
   * Never returns password_hash.
   * @param {object} params
   * @param {string} params.firstName
   * @param {string} params.lastName
   * @param {string} params.email
   * @param {string} params.passwordHash
   * @param {string} [params.role='user']
   * @returns {Promise<{id: string, userId: string, first_name: string, last_name: string, email: string, role: string, is_active: boolean, created_at: Date}>}
   */
  async createUser({ firstName, lastName, email, passwordHash, role = "user" }) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const created = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: normalizedEmail,
        password_hash: passwordHash,
        role,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });

    return {
      userId: created.id,
      id: created.id,
      first_name: created.first_name,
      last_name: created.last_name,
      email: created.email,
      role: created.role,
      is_active: created.is_active,
      created_at: created.created_at,
    };
  }

  /**
   * Find a user by email with password_hash for authentication/login.
   * Internal auth use only.
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmailWithPassword(email) {
    if (!email) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        password_hash: true,
        is_active: true,
      },
    });
    return user || null;
  }

  /**
   * Update the user's last_login timestamp.
   * @param {string} id
   * @returns {Promise<object>}
   */
  async updateLastLogin(id) {
    if (!id) return null;
    return prisma.user.update({
      where: { id },
      data: {
        last_login: new Date(),
      },
    });
  }
}

module.exports = new UserRepository();
