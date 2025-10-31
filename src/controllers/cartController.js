const Cart = require('../models/Cart');
const { asyncHandler } = require('../middleware/errorHandler');

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { product_id, variant_id, quantity } = req.body;
  const userId = req.user.id;

  // Check availability
  const availability = await Cart.checkAvailability(
    product_id,
    variant_id,
    quantity
  );
  if (!availability.available) {
    return res.status(400).json({
      success: false,
      message: availability.message,
    });
  }

  const cartItem = await Cart.addItem(userId, {
    product_id,
    variant_id,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: 'Item added to cart successfully',
    data: { cart_item: cartItem },
  });
});

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await Cart.getByUserId(userId);
  const cartSummary = await Cart.getCartSummary(userId);

  res.json({
    success: true,
    data: {
      items: cartItems,
      summary: cartSummary,
    },
  });
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  if (quantity < 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity cannot be negative',
    });
  }

  const cartItem = await Cart.updateQuantity(itemId, userId, quantity);
  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found',
    });
  }

  res.json({
    success: true,
    message: 'Cart item updated successfully',
    data: { cart_item: cartItem },
  });
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const cartItem = await Cart.removeItem(itemId, userId);
  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found',
    });
  }

  res.json({
    success: true,
    message: 'Item removed from cart successfully',
  });
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await Cart.clearCart(userId);

  res.json({
    success: true,
    message: 'Cart cleared successfully',
  });
});

// Get cart item by ID
const getCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const cartItem = await Cart.getItemById(itemId, userId);
  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found',
    });
  }

  res.json({
    success: true,
    data: { cart_item: cartItem },
  });
});

// Validate cart items
const validateCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const validationResults = await Cart.validateCartItems(userId);

  const hasErrors = validationResults.some(result => !result.available);

  res.json({
    success: true,
    data: {
      valid: !hasErrors,
      validation_results: validationResults,
    },
  });
});

// Get cart summary
const getCartSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const summary = await Cart.getCartSummary(userId);

  res.json({
    success: true,
    data: { summary },
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItem,
  validateCart,
  getCartSummary,
};
