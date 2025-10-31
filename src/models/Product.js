const { query, getClient } = require('../../config/database');
const { formatPriceForAPI } = require('../utils/formatPrice');

// Helper function to format product data
const formatProductData = product => {
  if (!product) {
    return product;
  }

  // Format product buy price
  if (product.product_buy_price !== undefined) {
    product.product_buy_price = formatPriceForAPI(product.product_buy_price);
  }

  // Format variants
  if (product.variants && Array.isArray(product.variants)) {
    product.variants = product.variants.map(variant => {
      const price = formatPriceForAPI(variant.price);
      const discountPercentage = variant.discount_amount || 0;
      const finalPrice =
        discountPercentage > 0
          ? Math.round(price * (1 - discountPercentage / 100))
          : price;

      return {
        ...variant,
        price: price,
        discount_amount: discountPercentage, // Keep as percentage
        final_price: finalPrice,
        discount_percentage: discountPercentage, // Same as discount_amount
      };
    });
  }

  return product;
};

class Product {
  // Create a new product
  static async create(productData) {
    const {
      brand_id,
      category_id,
      product_name,
      product_slug,
      product_short_description,
      product_description,
      product_buy_price,
      images = [],
      variants = [],
    } = productData;

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Insert product
      const productResult = await client.query(
        `INSERT INTO products (brand_id, category_id, product_name, product_slug, product_short_description, 
         product_description, product_buy_price, product_sold_quantity, product_avg_rating, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0.00, NOW(), NOW())
         RETURNING *`,
        [
          brand_id || null,
          category_id || null,
          product_name,
          product_slug,
          product_short_description || null,
          product_description || null,
          product_buy_price,
        ]
      );

      const product = productResult.rows[0];

      // Insert images
      if (images && images.length > 0) {
        for (const image of images) {
          await client.query(
            'INSERT INTO product_imgs (product_id, name, value, created_at) VALUES ($1, $2, $3, NOW())',
            [product.id, image.name, image.value]
          );
        }
      }

      // Insert variants
      if (variants && variants.length > 0) {
        for (const variant of variants) {
          await client.query(
            `INSERT INTO product_variants (product_id, variant_name, variant_slug, price, discount_amount, 
             is_available, in_stock, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
            [
              product.id,
              variant.variant_name,
              variant.variant_slug,
              variant.price,
              variant.discount_amount || 0,
              variant.is_available !== false,
              variant.in_stock || 0,
            ]
          );
        }
      }

      await client.query('COMMIT');
      return product;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get product by ID with related data
  static async findById(id) {
    const result = await query(
      `SELECT p.*, b.name as brand_name, c.category_name, c.category_type,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value,
                  'created_at', pi.created_at
                ) ORDER BY pi.created_at ASC
              ) FROM product_imgs pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(
                json_build_object(
                  'id', pv.id,
                  'variant_name', pv.variant_name,
                  'variant_slug', pv.variant_slug,
                  'price', pv.price,
                  'discount_amount', pv.discount_amount,
                  'final_price', CASE 
                    WHEN pv.discount_amount > 0 THEN ROUND(pv.price * (1 - pv.discount_amount / 100))
                    ELSE pv.price
                  END,
                  'discount_percentage', COALESCE(pv.discount_amount, 0),
                  'is_available', pv.is_available,
                  'in_stock', pv.in_stock,
                  'created_at', pv.created_at,
                  'variant_images', (
                    SELECT json_agg(
                      json_build_object(
                        'id', vi.id,
                        'name', vi.name,
                        'value', vi.value
                      )
                    ) FROM variant_imgs vi WHERE vi.variant_id = pv.id
                  )
                ) ORDER BY pv.created_at ASC
              ) FROM product_variants pv WHERE pv.product_id = p.id) as variants
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    return formatProductData(result.rows[0]);
  }

  // Get all products with filtering, search, and pagination
  static async getAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category_slug,
      brand_id,
      min_price,
      max_price,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (search) {
      conditions.push(
        `(p.product_name ILIKE $${paramCount} OR p.product_short_description ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (category_slug) {
      conditions.push(`c.category_slug = $${paramCount}`);
      values.push(category_slug);
      paramCount++;
    }

    if (brand_id) {
      conditions.push(`p.brand_id = $${paramCount}`);
      values.push(brand_id);
      paramCount++;
    }

    if (min_price) {
      conditions.push(`p.product_buy_price >= $${paramCount}`);
      values.push(min_price);
      paramCount++;
    }

    if (max_price) {
      conditions.push(`p.product_buy_price <= $${paramCount}`);
      values.push(max_price);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    const validSortFields = [
      'created_at',
      'product_name',
      'product_buy_price',
      'product_avg_rating',
      'product_sold_quantity',
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await query(
      `SELECT p.*, b.name as brand_name, c.category_name,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value,
                  'created_at', pi.created_at
                ) ORDER BY pi.created_at ASC
              ) FROM product_imgs pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(
                json_build_object(
                  'id', pv.id,
                  'variant_name', pv.variant_name,
                  'variant_slug', pv.variant_slug,
                  'price', pv.price,
                  'discount_amount', pv.discount_amount,
                  'final_price', CASE 
                    WHEN pv.discount_amount > 0 THEN ROUND(pv.price * (1 - pv.discount_amount / 100))
                    ELSE pv.price
                  END,
                  'discount_percentage', COALESCE(pv.discount_amount, 0),
                  'is_available', pv.is_available,
                  'in_stock', pv.in_stock,
                  'created_at', pv.created_at
                ) ORDER BY pv.created_at ASC
              ) FROM product_variants pv WHERE pv.product_id = p.id) as variants,
              (SELECT json_agg(
                json_build_object(
                  'id', vi.id,
                  'name', vi.name,
                  'value', vi.value
                )
              ) FROM variant_imgs vi 
              JOIN product_variants pv ON vi.variant_id = pv.id 
              WHERE pv.product_id = p.id) as variant_images
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.${sortField} ${sortDirection}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      products: result.rows.map(formatProductData),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update product
  static async update(id, updateData) {
    const { images = [], variants = [], ...productFields } = updateData;

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Update product basic info
      if (Object.keys(productFields).length > 0) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(productFields).forEach(key => {
          if (productFields[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(productFields[key]);
            paramCount++;
          }
        });

        if (fields.length > 0) {
          fields.push('updated_at = NOW()');
          values.push(id);

          await client.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount}`,
            values
          );
        }
      }

      // Handle images update
      if (images !== undefined) {
        // Delete existing images
        await client.query('DELETE FROM product_imgs WHERE product_id = $1', [
          id,
        ]);

        // Insert new images
        if (images.length > 0) {
          for (const image of images) {
            await client.query(
              'INSERT INTO product_imgs (product_id, name, value, created_at) VALUES ($1, $2, $3, NOW())',
              [id, image.name, image.value]
            );
          }
        }
      }

      // Handle variants update
      if (variants !== undefined) {
        // Delete existing variants
        await client.query(
          'DELETE FROM product_variants WHERE product_id = $1',
          [id]
        );

        // Insert new variants
        if (variants.length > 0) {
          for (const variant of variants) {
            await client.query(
              `INSERT INTO product_variants (product_id, variant_name, variant_slug, price, discount_amount, 
               is_available, in_stock, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
              [
                id,
                variant.variant_name,
                variant.variant_slug,
                variant.price,
                variant.discount_amount || 0,
                variant.is_available !== false,
                variant.in_stock || 0,
              ]
            );
          }
        }
      }

      await client.query('COMMIT');

      // Return updated product with related data
      return await Product.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete product
  static async delete(id) {
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Get product variants
  static async getVariants(productId) {
    const result = await query(
      `SELECT pv.*, 
              (SELECT json_agg(
                json_build_object(
                  'id', vi.id,
                  'name', vi.name,
                  'value', vi.value
                )
              ) FROM variant_imgs vi WHERE vi.variant_id = pv.id) as images
       FROM product_variants pv
       WHERE pv.product_id = $1
       ORDER BY pv.created_at`,
      [productId]
    );

    return result.rows;
  }

  // Get product reviews
  static async getReviews(productId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT r.*, rui.user_name, rui.user_avatar
       FROM reviews r
       LEFT JOIN review_user_info rui ON r.user_id = rui.user_id
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

  // Update product rating
  static async updateRating(productId) {
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

  // Get best selling products
  static async getBestSelling(limit = 10) {
    const result = await query(
      `SELECT p.*, b.name as brand_name, c.category_name,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value,
                  'created_at', pi.created_at
                ) ORDER BY pi.created_at ASC
              ) FROM product_imgs pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(
                json_build_object(
                  'id', pv.id,
                  'variant_name', pv.variant_name,
                  'variant_slug', pv.variant_slug,
                  'price', pv.price,
                  'discount_amount', pv.discount_amount,
                  'final_price', CASE 
                    WHEN pv.discount_amount > 0 THEN ROUND(pv.price * (1 - pv.discount_amount / 100))
                    ELSE pv.price
                  END,
                  'discount_percentage', COALESCE(pv.discount_amount, 0),
                  'is_available', pv.is_available,
                  'in_stock', pv.in_stock,
                  'created_at', pv.created_at
                ) ORDER BY pv.created_at ASC
              ) FROM product_variants pv WHERE pv.product_id = p.id) as variants
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.product_sold_quantity DESC, p.product_avg_rating DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(formatProductData);
  }

  // Get featured products (high rating)
  static async getFeatured(limit = 10) {
    const result = await query(
      `SELECT p.*, b.name as brand_name, c.category_name,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value,
                  'created_at', pi.created_at
                ) ORDER BY pi.created_at ASC
              ) FROM product_imgs pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(
                json_build_object(
                  'id', pv.id,
                  'variant_name', pv.variant_name,
                  'variant_slug', pv.variant_slug,
                  'price', pv.price,
                  'discount_amount', pv.discount_amount,
                  'final_price', CASE 
                    WHEN pv.discount_amount > 0 THEN ROUND(pv.price * (1 - pv.discount_amount / 100))
                    ELSE pv.price
                  END,
                  'discount_percentage', COALESCE(pv.discount_amount, 0),
                  'is_available', pv.is_available,
                  'in_stock', pv.in_stock,
                  'created_at', pv.created_at
                ) ORDER BY pv.created_at ASC
              ) FROM product_variants pv WHERE pv.product_id = p.id) as variants
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.product_avg_rating >= 4.0
       ORDER BY p.product_avg_rating DESC, p.product_sold_quantity DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(formatProductData);
  }

  // Get product statistics
  static async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN product_avg_rating >= 4.0 THEN 1 END) as featured_products,
        AVG(product_avg_rating) as average_rating,
        SUM(product_sold_quantity) as total_sold
      FROM products
    `);

    const row = result.rows[0];
    return {
      total_products: parseInt(row.total_products) || 0,
      featured_products: parseInt(row.featured_products) || 0,
      average_rating: parseFloat(row.average_rating) || 0,
      total_sold: parseInt(row.total_sold) || 0,
    };
  }

  // Get top selling products
  static async getTopSelling(limit = 5) {
    const result = await query(
      `SELECT p.*, b.name as brand_name, c.category_name,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value,
                  'created_at', pi.created_at
                ) ORDER BY pi.created_at ASC
              ) FROM product_imgs pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(
                json_build_object(
                  'id', pv.id,
                  'variant_name', pv.variant_name,
                  'variant_slug', pv.variant_slug,
                  'price', pv.price,
                  'discount_amount', pv.discount_amount,
                  'final_price', CASE 
                    WHEN pv.discount_amount > 0 THEN ROUND(pv.price * (1 - pv.discount_amount / 100))
                    ELSE pv.price
                  END,
                  'discount_percentage', COALESCE(pv.discount_amount, 0),
                  'is_available', pv.is_available,
                  'in_stock', pv.in_stock,
                  'created_at', pv.created_at
                ) ORDER BY pv.created_at ASC
              ) FROM product_variants pv WHERE pv.product_id = p.id) as variants
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.product_sold_quantity DESC, p.product_avg_rating DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(formatProductData);
  }
}

module.exports = Product;
