const { query } = require('../../config/database');

class Brand {
  // Create a new brand
  static async create(brandData) {
    const { name, description } = brandData;

    const result = await query(
      `INSERT INTO brands (name, description, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [name, description]
    );

    return result.rows[0];
  }

  // Get all brands
  static async getAll() {
    const result = await query(
      `SELECT b.*, 
              (SELECT COUNT(*) FROM products WHERE brand_id = b.id) as product_count
       FROM brands b
       ORDER BY b.name`
    );

    return result.rows;
  }

  // Get brand by ID
  static async findById(id) {
    const result = await query(
      `SELECT b.*, 
              (SELECT COUNT(*) FROM products WHERE brand_id = b.id) as product_count
       FROM brands b
       WHERE b.id = $1`,
      [id]
    );

    return result.rows[0];
  }

  // Update brand
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

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE brands SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Delete brand
  static async delete(id) {
    // Check if brand has products
    const productCount = await query(
      'SELECT COUNT(*) FROM products WHERE brand_id = $1',
      [id]
    );

    if (parseInt(productCount.rows[0].count) > 0) {
      throw new Error('Cannot delete brand with existing products');
    }

    const result = await query(
      'DELETE FROM brands WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows[0];
  }

  // Search brands
  static async search(searchTerm) {
    const result = await query(
      `SELECT b.*, 
              (SELECT COUNT(*) FROM products WHERE brand_id = b.id) as product_count
       FROM brands b
       WHERE b.name ILIKE $1 OR b.description ILIKE $1
       ORDER BY b.name`,
      [`%${searchTerm}%`]
    );

    return result.rows;
  }
}

module.exports = Brand;
