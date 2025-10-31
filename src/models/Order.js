const { query } = require('../../config/database');
const { formatPriceForAPI } = require('../utils/formatPrice');

// Helper function to format order data
const formatOrderData = order => {
  if (!order) {
    return order;
  }

  // Format price fields
  const formattedOrder = {
    ...order,
    order_total_cost: formatPriceForAPI(order.order_total_cost),
    order_shipping_cost: formatPriceForAPI(order.order_shipping_cost),
    order_payment_cost: formatPriceForAPI(order.order_payment_cost),
  };

  // Format order items if they exist
  if (order.order_details && Array.isArray(order.order_details)) {
    formattedOrder.order_details = order.order_details.map(item => ({
      ...item,
      unit_price: formatPriceForAPI(item.unit_price),
      total_price: formatPriceForAPI(item.unit_price * item.quantity),
    }));
  }

  return formattedOrder;
};

class Order {
  // Create a new order
  static async create(orderData) {
    const {
      customer_id,
      order_address,
      order_shipping_cost = 0,
      order_payment_cost = 0,
      order_note = '',
      payment_method = 'cod',
      shipping_method = 'standard',
    } = orderData;

    // Start transaction
    const client = await require('../../config/database').getClient();

    try {
      await client.query('BEGIN');

      // Create order address
      const addressResult = await client.query(
        `INSERT INTO order_address (province, district, ward, detail, user_phone, user_name)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          order_address.province,
          order_address.district,
          order_address.ward,
          order_address.detail,
          order_address.user_phone,
          order_address.user_name,
        ]
      );

      const addressId = addressResult.rows[0].id;

      // Calculate total cost from cart
      const cartSummary = await client.query(
        `SELECT 
           SUM(
             CASE 
               WHEN pv.discount_amount > 0 
               THEN (pv.price - pv.discount_amount) * c.quantity 
               ELSE pv.price * c.quantity 
             END
           ) as total_cost
         FROM carts c
         LEFT JOIN product_variants pv ON c.variant_id = pv.id
         WHERE c.user_id = $1`,
        [customer_id]
      );

      const orderTotalCost =
        parseFloat(cartSummary.rows[0].total_cost) +
        parseFloat(order_shipping_cost) +
        parseFloat(order_payment_cost);

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (customer_id, order_address_id, order_total_cost, order_status, 
         order_shipping_cost, order_payment_cost, order_note, payment_method, shipping_method, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          customer_id,
          addressId,
          orderTotalCost,
          'pending',
          order_shipping_cost,
          order_payment_cost,
          order_note,
          payment_method,
          shipping_method,
        ]
      );

      const order = orderResult.rows[0];

      // Create order details from cart
      const cartItems = await client.query(
        `SELECT c.*, pv.price, pv.discount_amount
         FROM carts c
         LEFT JOIN product_variants pv ON c.variant_id = pv.id
         WHERE c.user_id = $1`,
        [customer_id]
      );

      for (const item of cartItems.rows) {
        const unitPrice = item.price - (item.discount_amount || 0);

        await client.query(
          `INSERT INTO order_details (order_id, product_id, variant_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [order.id, item.product_id, item.variant_id, item.quantity, unitPrice]
        );

        // Update product sold quantity
        await client.query(
          'UPDATE products SET product_sold_quantity = product_sold_quantity + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        // Update variant stock
        await client.query(
          'UPDATE product_variants SET in_stock = in_stock - $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
      }

      // Clear cart
      await client.query('DELETE FROM carts WHERE user_id = $1', [customer_id]);

      await client.query('COMMIT');

      return await this.findById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get order by ID with details
  static async findById(id) {
    const result = await query(
      `SELECT o.*, 
              oa.province, oa.district, oa.ward, oa.detail, oa.user_phone, oa.user_name,
              u.user_name as customer_name, u.user_email as customer_email
       FROM orders o
       LEFT JOIN order_address oa ON o.order_address_id = oa.id
       LEFT JOIN users u ON o.customer_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const order = result.rows[0];

    // Get order details
    const detailsResult = await query(
      `SELECT od.*, 
              p.product_name, p.product_slug,
              pv.variant_name, pv.price, pv.discount_amount,
              b.name as brand_name,
              (SELECT value FROM product_imgs WHERE product_id = p.id LIMIT 1) as product_image
       FROM order_details od
       LEFT JOIN products p ON od.product_id = p.id
       LEFT JOIN product_variants pv ON od.variant_id = pv.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE od.order_id = $1`,
      [id]
    );

    order.order_details = detailsResult.rows;
    return formatOrderData(order);
  }

  // Get user's orders
  static async getByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT o.*, 
              oa.province, oa.district, oa.ward, oa.detail, oa.user_phone, oa.user_name
       FROM orders o
       LEFT JOIN order_address oa ON o.order_address_id = oa.id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM orders WHERE customer_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      orders: result.rows.map(formatOrderData),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get all orders (admin)
  static async getAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      conditions.push(`o.order_status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (search) {
      conditions.push(
        `(u.user_name ILIKE $${paramCount} OR u.user_email ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT o.*, 
              oa.province, oa.district, oa.ward, oa.detail, oa.user_phone, oa.user_name,
              u.user_name as customer_name, u.user_email as customer_email
       FROM orders o
       LEFT JOIN order_address oa ON o.order_address_id = oa.id
       LEFT JOIN users u ON o.customer_id = u.id
       ${whereClause}
       ORDER BY o.${sort_by} ${sort_order}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM orders o
       LEFT JOIN users u ON o.customer_id = u.id
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      orders: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Cancel order
  static async cancel(id, userId) {
    const client = await require('../../config/database').getClient();

    try {
      await client.query('BEGIN');

      // Get order details
      const orderDetails = await client.query(
        'SELECT * FROM order_details WHERE order_id = $1',
        [id]
      );

      // Restore stock
      for (const detail of orderDetails.rows) {
        await client.query(
          'UPDATE product_variants SET in_stock = in_stock + $1 WHERE id = $2',
          [detail.quantity, detail.variant_id]
        );

        await client.query(
          'UPDATE products SET product_sold_quantity = product_sold_quantity - $1 WHERE id = $2',
          [detail.quantity, detail.product_id]
        );
      }

      // Update order status
      const result = await client.query(
        'UPDATE orders SET order_status = $1, updated_at = NOW() WHERE id = $2 AND customer_id = $3 RETURNING *',
        ['cancelled', id, userId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update order status
  static async updateStatus(orderId, status, staffId = null) {
    const validStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const result = await query(
      `UPDATE orders 
       SET order_status = $1, staff_id = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [status, staffId, orderId]
    );

    if (result.rows.length === 0) {
      throw new Error('Order not found');
    }

    return formatOrderData(result.rows[0]);
  }

  // Get orders by status
  static async getByStatus(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const validStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const result = await query(
      `SELECT o.*, 
              oa.province, oa.district, oa.ward, oa.detail, oa.user_phone, oa.user_name,
              u.user_name as customer_name, u.user_email as customer_email
       FROM orders o
       LEFT JOIN order_address oa ON o.order_address_id = oa.id
       LEFT JOIN users u ON o.customer_id = u.id
       WHERE o.order_status = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM orders WHERE order_status = $1',
      [status]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      orders: result.rows.map(formatOrderData),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get order statistics
  static async getStatistics() {
    const result = await query(`
      SELECT 
        order_status,
        COUNT(*) as count,
        SUM(order_total_cost) as total_revenue
      FROM orders 
      GROUP BY order_status
    `);

    const stats = {};
    result.rows.forEach(row => {
      stats[row.order_status] = {
        count: parseInt(row.count),
        total_revenue: formatPriceForAPI(row.total_revenue),
      };
    });

    return stats;
  }

  // Get dashboard statistics
  static async getDashboardStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(order_total_cost) as total_revenue,
        COUNT(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as orders_this_month,
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN order_total_cost ELSE 0 END) as revenue_this_month
      FROM orders 
      WHERE order_status != 'cancelled'
    `);

    const row = result.rows[0];
    return {
      total_orders: parseInt(row.total_orders) || 0,
      total_revenue: formatPriceForAPI(row.total_revenue) || 0,
      orders_this_month: parseInt(row.orders_this_month) || 0,
      revenue_this_month: formatPriceForAPI(row.revenue_this_month) || 0,
    };
  }

  // Get recent orders
  static async getRecent(limit = 5) {
    const result = await query(
      `
      SELECT 
        o.id,
        o.order_status,
        o.order_total_cost,
        o.created_at,
        u.user_name as customer_name,
        u.user_email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows.map(row => ({
      ...row,
      order_total_cost: formatPriceForAPI(row.order_total_cost),
    }));
  }
}

module.exports = Order;
