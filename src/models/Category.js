const { query } = require('../../config/database');

class Category {
  // Create a new category
  static async create(categoryData) {
    const { category_name, category_slug, category_type, category_img } =
      categoryData;

    const result = await query(
      `INSERT INTO categories (category_name, category_slug, category_type, category_img, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [category_name, category_slug, category_type, category_img]
    );

    return result.rows[0];
  }

  // Get all categories
  static async getAll() {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       ORDER BY c.category_name`
    );

    return result.rows;
  }

  // Get category by ID
  static async findById(id) {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       WHERE c.id = $1`,
      [id]
    );

    return result.rows[0];
  }

  // Get category by slug
  static async findBySlug(slug) {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       WHERE c.category_slug = $1`,
      [slug]
    );

    return result.rows[0];
  }

  // Update category
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
      `UPDATE categories SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Delete category
  static async delete(id) {
    // Check if category has products
    const productCount = await query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [id]
    );

    if (parseInt(productCount.rows[0].count) > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows[0];
  }

  // Get categories by type
  static async getByType(type) {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       WHERE c.category_type = $1
       ORDER BY c.category_name`,
      [type]
    );

    return result.rows;
  }

  // Search categories
  static async search(searchTerm) {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       WHERE c.category_name ILIKE $1 OR c.category_type ILIKE $1
       ORDER BY c.category_name`,
      [`%${searchTerm}%`]
    );

    return result.rows;
  }

  // Get category with products
  static async getWithProducts(id, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const categoryResult = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
       FROM categories c
       WHERE c.id = $1`,
      [id]
    );

    if (categoryResult.rows.length === 0) {
      return null;
    }

    const productsResult = await query(
      `SELECT p.*, b.name as brand_name
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.category_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [id]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      category: categoryResult.rows[0],
      products: productsResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = Category;
