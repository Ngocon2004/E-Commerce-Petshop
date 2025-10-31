const { query } = require('../../config/database');

class Review {
  // Create a new review
  static async create(reviewData) {
    const { product_id, product_variant_id, user_id, rating, review_text } =
      reviewData;

    // Check if user has already reviewed this product
    const existingReview = await query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [product_id, user_id]
    );

    if (existingReview.rows.length > 0) {
      throw new Error('You have already reviewed this product');
    }

    // Check if user has purchased this product
    const purchaseCheck = await query(
      `SELECT 1 FROM order_details od
       JOIN orders o ON od.order_id = o.id
       WHERE od.product_id = $1 AND o.customer_id = $2 AND o.order_status = 'delivered'
       LIMIT 1`,
      [product_id, user_id]
    );

    if (purchaseCheck.rows.length === 0) {
      throw new Error('You must purchase this product before reviewing');
    }

    const result = await query(
      `INSERT INTO reviews (product_id, product_variant_id, user_id, rating, review_text, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [product_id, product_variant_id, user_id, rating, review_text]
    );

    // Update product average rating
    await this.updateProductRating(product_id);

    return result.rows[0];
  }

  // Get reviews by product ID
  static async getByProductId(productId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT r.*, 
              rui.user_name, rui.user_avatar,
              pv.variant_name
       FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
       LEFT JOIN product_variants pv ON r.product_variant_id = pv.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [productId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM reviews WHERE product_id = $1',
      [productId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get rating statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_reviews,
         AVG(rating) as average_rating,
         COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
         COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM reviews WHERE product_id = $1`,
      [productId]
    );

    return {
      reviews: result.rows,
      statistics: statsResult.rows[0],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get review by ID
  static async findById(id) {
    const result = await query(
      `SELECT r.*, 
              rui.user_name, rui.user_avatar,
              pv.variant_name,
              p.product_name
       FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
       LEFT JOIN product_variants pv ON r.product_variant_id = pv.id
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.id = $1`,
      [id]
    );

    return result.rows[0];
  }

  // Update review
  static async update(id, userId, updateData) {
    const { rating, review_text } = updateData;

    const result = await query(
      `UPDATE reviews 
       SET rating = $1, review_text = $2, updated_at = NOW() 
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [rating, review_text, id, userId]
    );

    if (result.rows.length === 0) {
      throw new Error(
        'Review not found or you are not authorized to update it'
      );
    }

    // Update product average rating
    const review = result.rows[0];
    await this.updateProductRating(review.product_id);

    return review;
  }

  // Delete review
  static async delete(id, userId, isAdmin = false) {
    let result;

    if (isAdmin) {
      result = await query(
        'DELETE FROM reviews WHERE id = $1 RETURNING product_id',
        [id]
      );
    } else {
      result = await query(
        'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING product_id',
        [id, userId]
      );
    }

    if (result.rows.length === 0) {
      throw new Error(
        'Review not found or you are not authorized to delete it'
      );
    }

    // Update product average rating
    await this.updateProductRating(result.rows[0].product_id);

    return { id };
  }

  // Get user's reviews
  static async getByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT r.*, 
              p.product_name, p.product_slug,
              pv.variant_name
       FROM reviews r
       LEFT JOIN products p ON r.product_id = p.id
       LEFT JOIN product_variants pv ON r.product_variant_id = pv.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM reviews WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      reviews: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get all reviews (admin)
  static async getAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      product_id,
      rating,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (product_id) {
      conditions.push(`r.product_id = $${paramCount}`);
      values.push(product_id);
      paramCount++;
    }

    if (rating) {
      conditions.push(`r.rating = $${paramCount}`);
      values.push(rating);
      paramCount++;
    }

    if (search) {
      conditions.push(
        `(rui.user_name ILIKE $${paramCount} OR r.review_text ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT r.*, 
              rui.user_name, rui.user_avatar,
              p.product_name, p.product_slug,
              pv.variant_name
       FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
       LEFT JOIN products p ON r.product_id = p.id
       LEFT JOIN product_variants pv ON r.product_variant_id = pv.id
       ${whereClause}
       ORDER BY r.${sort_by} ${sort_order}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      reviews: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update product average rating
  static async updateProductRating(productId) {
    const result = await query(
      `UPDATE products 
       SET product_avg_rating = (
         SELECT COALESCE(AVG(rating), 0) 
         FROM reviews 
         WHERE product_id = $1
       )
       WHERE id = $1
       RETURNING product_avg_rating`,
      [productId]
    );

    return result.rows[0];
  }

  // Get recent reviews
  static async getRecent(limit = 10) {
    const result = await query(
      `SELECT r.*, 
              rui.user_name, rui.user_avatar,
              p.product_name, p.product_slug,
              pv.variant_name
       FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
       LEFT JOIN products p ON r.product_id = p.id
       LEFT JOIN product_variants pv ON r.product_variant_id = pv.id
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  // Get review statistics
  static async getStatistics() {
    const result = await query(
      `SELECT 
         COUNT(*) as total_reviews,
         AVG(rating) as average_rating,
         COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
         COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM reviews`
    );

    return result.rows[0];
  }
}

module.exports = Review;
