const { query } = require('../../config/database');

class Promotion {
  // Create a new promotion
  static async create(promotionData) {
    const {
      promotion_title,
      promotion_slug,
      promotion_description,
      promotion_image,
      promotion_type,
      promotion_value,
      promotion_min_amount,
      promotion_max_discount,
      promotion_code,
      promotion_usage_limit,
      promotion_start_date,
      promotion_end_date,
      promotion_active,
    } = promotionData;

    const result = await query(
      `INSERT INTO promotions (promotion_title, promotion_slug, promotion_description, promotion_image, 
       promotion_type, promotion_value, promotion_min_amount, promotion_max_discount, promotion_code, 
       promotion_usage_limit, promotion_used_count, promotion_start_date, promotion_end_date, 
       promotion_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, $11, $12, $13, NOW(), NOW())
       RETURNING *`,
      [
        promotion_title,
        promotion_slug,
        promotion_description,
        promotion_image,
        promotion_type,
        promotion_value,
        promotion_min_amount,
        promotion_max_discount,
        promotion_code,
        promotion_usage_limit,
        promotion_start_date,
        promotion_end_date,
        promotion_active,
      ]
    );

    return result.rows[0];
  }

  // Get promotion by ID
  static async findById(id) {
    const result = await query('SELECT * FROM promotions WHERE id = $1', [id]);

    return result.rows[0];
  }

  // Get promotion by code
  static async findByCode(code) {
    const result = await query(
      'SELECT * FROM promotions WHERE promotion_code = $1',
      [code]
    );

    return result.rows[0];
  }

  // Get all promotions with filtering and pagination
  static async getAll(filters = {}) {
    const { page = 1, limit = 10, active, type, search = '' } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (search) {
      conditions.push(
        `(promotion_title ILIKE $${paramCount} OR promotion_description ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (type) {
      conditions.push(`promotion_type = $${paramCount}`);
      values.push(type);
      paramCount++;
    }

    if (active !== undefined) {
      conditions.push(`promotion_active = $${paramCount}`);
      values.push(active);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT * FROM promotions ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM promotions ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      promotions: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get active promotions
  static async getActive(limit = 10) {
    const now = new Date();

    const result = await query(
      `SELECT * FROM promotions 
       WHERE promotion_active = true
       AND promotion_start_date <= $1
       AND promotion_end_date >= $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [now, limit]
    );

    return result.rows;
  }

  // Validate promotion code
  static async validateCode(code) {
    const now = new Date();

    const result = await query(
      `SELECT * FROM promotions 
       WHERE promotion_code = $1
       AND promotion_active = true
       AND promotion_start_date <= $2
       AND promotion_end_date >= $2
       AND (promotion_usage_limit IS NULL OR promotion_used_count < promotion_usage_limit)`,
      [code, now]
    );

    return result.rows[0];
  }

  // Update promotion
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
      `UPDATE promotions SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Delete promotion
  static async delete(id) {
    const result = await query(
      'DELETE FROM promotions WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Toggle promotion status
  static async toggleStatus(id) {
    const result = await query(
      `UPDATE promotions 
       SET promotion_active = NOT promotion_active, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  // Increment usage count
  static async incrementUsage(id) {
    const result = await query(
      `UPDATE promotions 
       SET promotion_used_count = promotion_used_count + 1, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = Promotion;
