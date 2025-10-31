const { query } = require('../../config/database');
const { formatPriceForAPI } = require('../utils/formatPrice');

class Cart {
  // Add item to cart
  static async addItem(userId, cartData) {
    const { product_id, variant_id, quantity } = cartData;

    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2 AND variant_id = $3',
      [userId, product_id, variant_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const result = await query(
        'UPDATE carts SET quantity = quantity + $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [quantity, existingItem.rows[0].id]
      );
      return result.rows[0];
    } else {
      // Add new item
      const result = await query(
        `INSERT INTO carts (user_id, product_id, variant_id, quantity, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
        [userId, product_id, variant_id, quantity]
      );
      return result.rows[0];
    }
  }

  // Get user's cart
  static async getByUserId(userId) {
    const result = await query(
      `SELECT c.*, 
              p.product_name, p.product_slug, p.product_short_description,
              pv.variant_name, pv.price, pv.discount_amount, pv.is_available, pv.in_stock,
              b.name as brand_name,
              (SELECT json_agg(
                json_build_object(
                  'id', pi.id,
                  'name', pi.name,
                  'value', pi.value
                )
              ) FROM product_imgs pi WHERE pi.product_id = p.id LIMIT 1) as product_image
       FROM carts c
       LEFT JOIN products p ON c.product_id = p.id
       LEFT JOIN product_variants pv ON c.variant_id = pv.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    return result.rows.map(item => ({
      ...item,
      price: formatPriceForAPI(item.price),
      discount_amount: formatPriceForAPI(item.discount_amount),
    }));
  }

  // Update cart item quantity
  static async updateQuantity(cartItemId, userId, quantity) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return await this.removeItem(cartItemId, userId);
    }

    const result = await query(
      'UPDATE carts SET quantity = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, cartItemId, userId]
    );

    return result.rows[0];
  }

  // Remove item from cart
  static async removeItem(cartItemId, userId) {
    const result = await query(
      'DELETE FROM carts WHERE id = $1 AND user_id = $2 RETURNING id',
      [cartItemId, userId]
    );

    return result.rows[0];
  }

  // Clear user's cart
  static async clearCart(userId) {
    const result = await query(
      'DELETE FROM carts WHERE user_id = $1 RETURNING COUNT(*)',
      [userId]
    );

    return result.rows[0];
  }

  // Get cart item by ID
  static async getItemById(cartItemId, userId) {
    const result = await query(
      `SELECT c.*, 
              p.product_name, p.product_slug,
              pv.variant_name, pv.price, pv.discount_amount, pv.is_available, pv.in_stock
       FROM carts c
       LEFT JOIN products p ON c.product_id = p.id
       LEFT JOIN product_variants pv ON c.variant_id = pv.id
       WHERE c.id = $1 AND c.user_id = $2`,
      [cartItemId, userId]
    );

    return result.rows[0];
  }

  // Get cart summary (total items, total price)
  static async getCartSummary(userId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_items,
         SUM(c.quantity) as total_quantity,
         SUM(
           CASE 
             WHEN pv.discount_amount > 0 
             THEN (pv.price - pv.discount_amount) * c.quantity 
             ELSE pv.price * c.quantity 
           END
         ) as total_price
       FROM carts c
       LEFT JOIN product_variants pv ON c.variant_id = pv.id
       WHERE c.user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }

  // Check if product variant is available
  static async checkAvailability(productId, variantId, quantity) {
    const result = await query(
      'SELECT in_stock, is_available FROM product_variants WHERE id = $1 AND product_id = $2',
      [variantId, productId]
    );

    if (result.rows.length === 0) {
      return { available: false, message: 'Product variant not found' };
    }

    const variant = result.rows[0];
    if (!variant.is_available) {
      return { available: false, message: 'Product variant is not available' };
    }

    if (variant.in_stock < quantity) {
      return {
        available: false,
        message: `Only ${variant.in_stock} items available in stock`,
      };
    }

    return { available: true };
  }

  // Validate cart items before checkout
  static async validateCartItems(userId) {
    const cartItems = await this.getByUserId(userId);
    const validationResults = [];

    for (const item of cartItems) {
      const availability = await this.checkAvailability(
        item.product_id,
        item.variant_id,
        item.quantity
      );

      validationResults.push({
        cart_item_id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        ...availability,
      });
    }

    return validationResults;
  }

  // Move cart items to order (after successful order creation)
  static async moveToOrder(userId, orderId) {
    // Get cart items
    const cartItems = await this.getByUserId(userId);

    if (cartItems.length === 0) {
      return [];
    }

    // Create order details
    const orderDetails = [];
    for (const item of cartItems) {
      const variant = await query(
        'SELECT price, discount_amount FROM product_variants WHERE id = $1',
        [item.variant_id]
      );

      const unitPrice =
        variant.rows[0].price - (variant.rows[0].discount_amount || 0);

      const orderDetail = await query(
        `INSERT INTO order_details (order_id, product_id, variant_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [orderId, item.product_id, item.variant_id, item.quantity, unitPrice]
      );

      orderDetails.push(orderDetail.rows[0]);
    }

    // Clear cart after successful order
    await this.clearCart(userId);

    return orderDetails;
  }
}

module.exports = Cart;
