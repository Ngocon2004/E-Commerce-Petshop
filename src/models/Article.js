const { query } = require('../../config/database');

class Article {
  // Create a new article
  static async create(articleData) {
    const {
      user_id,
      article_title,
      article_short_description,
      article_img,
      article_content,
    } = articleData;

    const result = await query(
      `INSERT INTO articles (user_id, article_title, article_short_description, article_img, article_content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [
        user_id,
        article_title,
        article_short_description,
        article_img,
        article_content,
      ]
    );

    return result.rows[0];
  }

  // Get article by ID with author info
  static async findById(id) {
    const result = await query(
      `SELECT a.*, ai.author, ai.published_date
       FROM articles a
       LEFT JOIN article_info ai ON a.id = ai.article_id
       WHERE a.id = $1`,
      [id]
    );

    return result.rows[0];
  }

  // Get all articles with filtering and pagination
  static async getAll(filters = {}) {
    const { page = 1, limit = 10, search = '', author } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (search) {
      conditions.push(
        `(a.article_title ILIKE $${paramCount} OR a.article_short_description ILIKE $${paramCount} OR a.article_content ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (author) {
      conditions.push(`ai.author ILIKE $${paramCount}`);
      values.push(`%${author}%`);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT a.*, ai.author, ai.published_date
       FROM articles a
       LEFT JOIN article_info ai ON a.id = ai.article_id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM articles a
       LEFT JOIN article_info ai ON a.id = ai.article_id
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      articles: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get recent articles
  static async getRecent(limit = 6) {
    const result = await query(
      `SELECT a.*, ai.author, ai.published_date
       FROM articles a
       LEFT JOIN article_info ai ON a.id = ai.article_id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  // Get featured articles (by view count or rating)
  static async getFeatured(limit = 4) {
    const result = await query(
      `SELECT a.*, ai.author, ai.published_date
       FROM articles a
       LEFT JOIN article_info ai ON a.id = ai.article_id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  // Update article
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
      `UPDATE articles SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Delete article
  static async delete(id) {
    const result = await query(
      'DELETE FROM articles WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Create article info
  static async createArticleInfo(articleId, author, publishedDate) {
    const result = await query(
      `INSERT INTO article_info (article_id, author, published_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [articleId, author, publishedDate]
    );

    return result.rows[0];
  }

  // Update article info
  static async updateArticleInfo(articleId, updateData) {
    const { author, published_date } = updateData;
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (author !== undefined) {
      fields.push(`author = $${paramCount}`);
      values.push(author);
      paramCount++;
    }

    if (published_date !== undefined) {
      fields.push(`published_date = $${paramCount}`);
      values.push(published_date);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(articleId);

    const result = await query(
      `UPDATE article_info SET ${fields.join(
        ', '
      )} WHERE article_id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }
}

module.exports = Article;
