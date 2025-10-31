const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('user_password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('user_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('user_gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('user_birth')
    .optional()
    .isISO8601()
    .withMessage('Birth date must be a valid date'),
  handleValidationErrors,
];

// Admin create user validation rules
const validateAdminCreateUser = [
  body('user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('user_password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('user_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('user_gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('user_birth')
    .optional()
    .isISO8601()
    .withMessage('Birth date must be a valid date'),
  body('user_role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be user or admin'),
  body('user_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean'),
  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body('user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('user_password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Product validation
const validateProduct = [
  body('product_name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be between 2 and 255 characters'),
  body('product_slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      'Product slug must contain only lowercase letters, numbers, and hyphens'
    ),
  body('product_short_description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Short description must not exceed 500 characters'),
  body('product_description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('brand_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Brand ID must be a positive integer'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('product_buy_price')
    .isFloat({ min: 0 })
    .toFloat()
    .customSanitizer(value => Math.round(value)) // Convert to integer
    .withMessage('Buy price must be a positive number'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Image name must be between 1 and 255 characters'),
  body('images.*.value')
    .optional()
    .isURL()
    .withMessage('Image value must be a valid URL'),
  body('variants')
    .optional()
    .isArray()
    .withMessage('Variants must be an array'),
  body('variants.*.variant_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Variant name must be between 1 and 255 characters'),
  body('variants.*.variant_slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      'Variant slug must contain only lowercase letters, numbers, and hyphens'
    ),
  body('variants.*.price')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .customSanitizer(value => Math.round(value)) // Convert to integer
    .withMessage('Variant price must be a positive number'),
  body('variants.*.discount_amount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .toFloat()
    .customSanitizer(value => Math.round(value)) // Convert to integer (percentage)
    .withMessage('Discount amount must be a percentage between 0 and 100'),
  body('variants.*.in_stock')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Stock must be a non-negative integer'),
  body('variants.*.is_available')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean'),
  handleValidationErrors,
];

// Category validation
const validateCategory = [
  body('category_name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Category name must be between 2 and 255 characters'),
  body('category_type')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category type must be between 2 and 100 characters'),
  handleValidationErrors,
];

// Cart validation
const validateCartItem = [
  body('product_id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('variant_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Variant ID must be a positive integer'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  handleValidationErrors,
];

// Order validation
const validateOrder = [
  body('order_address')
    .isObject()
    .withMessage('Order address must be an object'),
  body('order_address.province')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'Province is required and must be between 1 and 100 characters'
    ),
  body('order_address.district')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'District is required and must be between 1 and 100 characters'
    ),
  body('order_address.ward')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Ward is required and must be between 1 and 100 characters'),
  body('order_address.detail')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(
      'Address detail is required and must be between 1 and 255 characters'
    ),
  body('order_address.user_phone')
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('order_address.user_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('User name must be between 1 and 100 characters'),
  body('order_note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Order note must not exceed 500 characters'),
  body('payment_method')
    .optional()
    .isIn(['cod', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'credit_card'])
    .withMessage('Invalid payment method'),
  body('shipping_method')
    .optional()
    .isIn(['standard', 'express', 'same_day', 'pickup'])
    .withMessage('Invalid shipping method'),
  handleValidationErrors,
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review_text')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review text must be between 10 and 1000 characters'),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

// Item ID parameter validation for cart routes
const validateItemId = [
  param('itemId')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUser,
  validateAdminCreateUser,
  validateLogin,
  validateProduct,
  validateCategory,
  validateCartItem,
  validateOrder,
  validateReview,
  validatePagination,
  validateId,
  validateItemId,
};
