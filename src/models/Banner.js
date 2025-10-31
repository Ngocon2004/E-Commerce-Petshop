const { query } = require('../../config/database');

class Banner {
  // Create a new banner
  static async create(bannerData) {
    const {
      banner_title,
      banner_slug,
      banner_description,
      banner_image,
      banner_link,
      banner_position,
      banner_order,
      banner_active,
      banner_start_date,
      banner_end_date,
    } = bannerData;

    const result = await query(
      `INSERT INTO banners (banner_title, banner_slug, banner_description, banner_image, banner_link, 
       banner_position, banner_order, banner_active, banner_start_date, banner_end_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [
        banner_title,
        banner_slug,
        banner_description,
        banner_image,
        banner_link,
        banner_position,
        banner_order,
        banner_active,
        banner_start_date,
        banner_end_date,
      ]
    );

    return result.rows[0];
  }

  // Get banner by ID
  static async findById(id) {
    const result = await query('SELECT * FROM banners WHERE id = $1', [id]);

    return result.rows[0];
  }

  // Get all banners with filtering and pagination
  static async getAll(filters = {}) {
    const { page = 1, limit = 10, position, active, search = '' } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (search) {
      conditions.push(
        `(banner_title ILIKE $${paramCount} OR banner_description ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (position) {
      conditions.push(`banner_position = $${paramCount}`);
      values.push(position);
      paramCount++;
    }

    if (active !== undefined) {
      conditions.push(`banner_active = $${paramCount}`);
      values.push(active);
      paramCount++;
    }

    // Add date filter for active banners
    const now = new Date();
    conditions.push(
      `(banner_start_date IS NULL OR banner_start_date <= $${paramCount})`
    );
    values.push(now);
    paramCount++;
    conditions.push(
      `(banner_end_date IS NULL OR banner_end_date >= $${paramCount})`
    );
    values.push(now);
    paramCount++;

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT * FROM banners ${whereClause}
       ORDER BY banner_order ASC, created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM banners ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      banners: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get banners by position
  static async getByPosition(position, limit = 5) {
    const now = new Date();

    const result = await query(
      `SELECT * FROM banners 
       WHERE banner_position = $1 
       AND banner_active = true
       AND (banner_start_date IS NULL OR banner_start_date <= $2)
       AND (banner_end_date IS NULL OR banner_end_date >= $2)
       ORDER BY banner_order ASC, created_at DESC
       LIMIT $3`,
      [position, now, limit]
    );

    return result.rows;
  }

  // Update banner
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
      `UPDATE banners SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Delete banner
  static async delete(id) {
    const result = await query(
      'DELETE FROM banners WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Toggle banner status
  static async toggleStatus(id) {
    const result = await query(
      `UPDATE banners 
       SET banner_active = NOT banner_active, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = Banner;
