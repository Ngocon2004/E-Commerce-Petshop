const { query } = require('../../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { user_email, user_password, user_name, user_gender, user_birth } =
      userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    const result = await query(
      `INSERT INTO users (user_email, user_password, user_name, user_gender, user_birth, user_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, user_email, user_name, user_gender, user_birth, user_active, created_at`,
      [user_email, hashedPassword, user_name, user_gender, user_birth, true]
    );

    return result.rows[0];
  }
  // Create a new admin user
  static async createAdmin(userData) {
    const {
      user_email,
      user_password,
      user_name,
      user_gender,
      user_birth,
      user_role = 'admin',
      user_active = true,
    } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    const result = await query(
      `INSERT INTO users (user_email, user_password, user_name, user_gender, user_birth, user_active, user_role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, user_email, user_name, user_gender, user_birth, user_active, user_role, created_at`,
      [
        user_email,
        hashedPassword,
        user_name,
        user_gender,
        user_birth,
        user_active,
        user_role,
      ]
    );

    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, user_email, user_name, user_gender, user_birth, user_active, user_role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Update user
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, user_email, user_name, user_gender, user_birth, user_active, user_role, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  // Delete user (soft delete by setting user_active to false)
  static async delete(id) {
    const result = await query(
      'UPDATE users SET user_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users with pagination
  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, user_email, user_name, user_gender, user_birth, user_active, user_role, created_at, updated_at
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Search users
  static async search(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, user_email, user_name, user_gender, user_birth, user_active, user_role, created_at, updated_at
       FROM users 
       WHERE user_name ILIKE $1 OR user_email ILIKE $1
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM users WHERE user_name ILIKE $1 OR user_email ILIKE $1',
      [`%${searchTerm}%`]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get user statistics
  static async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN user_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN user_role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_users_this_month
      FROM users
    `);

    const row = result.rows[0];
    return {
      total_users: parseInt(row.total_users) || 0,
      active_users: parseInt(row.active_users) || 0,
      admin_users: parseInt(row.admin_users) || 0,
      new_users_this_month: parseInt(row.new_users_this_month) || 0,
    };
  }
}

module.exports = User;
