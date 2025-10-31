const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { asyncHandler } = require('../middleware/errorHandler');

// Create new order
const createOrder = asyncHandler(async (req, res) => {
  const {
    order_address,
    order_shipping_cost = 0,
    order_payment_cost = 0,
    order_note = '',
    payment_method = 'cod',
    shipping_method = 'standard',
  } = req.body;
  const customer_id = req.user.id;

  // Validate cart items before creating order
  const validationResults = await Cart.validateCartItems(customer_id);
  const hasErrors = validationResults.some(result => !result.available);

  if (hasErrors) {
    return res.status(400).json({
      success: false,
      message: 'Some items in your cart are no longer available',
      data: { validation_results: validationResults },
    });
  }

  // Check if cart is empty
  const cartItems = await Cart.getByUserId(customer_id);
  if (cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }

  const order = await Order.create({
    customer_id,
    order_address,
    order_shipping_cost,
    order_payment_cost,
    order_note,
    payment_method,
    shipping_method,
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order },
  });
});

// Get user's orders
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const result = await Order.getByUserId(
    userId,
    parseInt(page),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: result,
  });
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check if user owns this order (unless admin)
  if (order.customer_id !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  res.json({
    success: true,
    data: { order },
  });
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await Order.cancel(id, userId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or cannot be cancelled',
    });
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order },
  });
});

// Get all orders (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sort_by = 'created_at',
    sort_order = 'DESC',
  } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    search,
    sort_by,
    sort_order,
  };

  const result = await Order.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// Update order status (admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const staffId = req.user.id;

  const validStatuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status',
    });
  }

  const order = await Order.updateStatus(id, status, staffId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order },
  });
});

// Get order statistics (admin only)
const getOrderStatistics = asyncHandler(async (req, res) => {
  const statistics = await Order.getStatistics();

  res.json({
    success: true,
    data: { statistics },
  });
});

// Get orders by status
const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
  };

  const result = await Order.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// Get order details (admin only)
const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  res.json({
    success: true,
    data: { order },
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics,
  getOrdersByStatus,
  getOrderDetails,
};
