const Promotion = require('../models/Promotion');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all promotions
const getPromotions = asyncHandler(async (req, res) => {
  const { type, active, page = 1, limit = 10, search } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    active: active !== undefined ? active === 'true' : undefined,
    search,
  };

  const result = await Promotion.getAll(filters);

  res.json({
    success: true,
    message: 'Promotions retrieved successfully',
    data: {
      promotions: result.promotions,
      pagination: result.pagination,
    },
  });
});

// Get promotion by ID
const getPromotionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  res.json({
    success: true,
    message: 'Promotion retrieved successfully',
    data: {
      promotion,
    },
  });
});

// Get promotion by code
const getPromotionByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const promotion = await Promotion.findByCode(code);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  res.json({
    success: true,
    message: 'Promotion retrieved successfully',
    data: {
      promotion,
    },
  });
});

// Get active promotions
const getActivePromotions = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const promotions = await Promotion.getActive(parseInt(limit));

  res.json({
    success: true,
    message: 'Active promotions retrieved successfully',
    data: {
      promotions,
    },
  });
});

// Validate promotion code
const validatePromotion = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const promotion = await Promotion.validateCode(code);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired promotion code',
    });
  }

  res.json({
    success: true,
    message: 'Promotion code is valid',
    data: {
      promotion,
    },
  });
});

// Create promotion (Admin only)
const createPromotion = asyncHandler(async (req, res) => {
  const {
    promotion_title,
    promotion_slug,
    promotion_description,
    promotion_image,
    promotion_type,
    promotion_value,
    promotion_min_amount,
    promotion_max_discount,
    promotion_code,
    promotion_usage_limit,
    promotion_start_date,
    promotion_end_date,
    promotion_active,
  } = req.body;

  // Validate promotion data
  if (
    promotion_type === 'percentage' &&
    (promotion_value < 0 || promotion_value > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Percentage value must be between 0 and 100',
    });
  }

  if (promotion_type === 'fixed' && promotion_value < 0) {
    return res.status(400).json({
      success: false,
      message: 'Fixed value must be positive',
    });
  }

  if (new Date(promotion_start_date) >= new Date(promotion_end_date)) {
    return res.status(400).json({
      success: false,
      message: 'Start date must be before end date',
    });
  }

  const promotion = await Promotion.create({
    promotion_title,
    promotion_slug,
    promotion_description,
    promotion_image,
    promotion_type,
    promotion_value,
    promotion_min_amount,
    promotion_max_discount,
    promotion_code,
    promotion_usage_limit,
    promotion_start_date,
    promotion_end_date,
    promotion_active,
  });

  res.status(201).json({
    success: true,
    message: 'Promotion created successfully',
    data: {
      promotion,
    },
  });
});

// Update promotion (Admin only)
const updatePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  // Validate promotion data if provided
  if (
    updateData.promotion_type === 'percentage' &&
    (updateData.promotion_value < 0 || updateData.promotion_value > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Percentage value must be between 0 and 100',
    });
  }

  if (updateData.promotion_type === 'fixed' && updateData.promotion_value < 0) {
    return res.status(400).json({
      success: false,
      message: 'Fixed value must be positive',
    });
  }

  if (updateData.promotion_start_date && updateData.promotion_end_date) {
    if (
      new Date(updateData.promotion_start_date) >=
      new Date(updateData.promotion_end_date)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date',
      });
    }
  }

  const updatedPromotion = await Promotion.update(id, updateData);

  res.json({
    success: true,
    message: 'Promotion updated successfully',
    data: {
      promotion: updatedPromotion,
    },
  });
});

// Delete promotion (Admin only)
const deletePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  await Promotion.delete(id);

  res.json({
    success: true,
    message: 'Promotion deleted successfully',
  });
});

// Toggle promotion status (Admin only)
const togglePromotionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  const updatedPromotion = await Promotion.toggleStatus(id);

  res.json({
    success: true,
    message: 'Promotion status updated successfully',
    data: {
      promotion: updatedPromotion,
    },
  });
});

// Increment promotion usage
const incrementPromotionUsage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Promotion not found',
    });
  }

  // Check if promotion has usage limit
  if (
    promotion.promotion_usage_limit &&
    promotion.promotion_used_count >= promotion.promotion_usage_limit
  ) {
    return res.status(400).json({
      success: false,
      message: 'Promotion usage limit exceeded',
    });
  }

  const updatedPromotion = await Promotion.incrementUsage(id);

  res.json({
    success: true,
    message: 'Promotion usage incremented successfully',
    data: {
      promotion: updatedPromotion,
    },
  });
});

module.exports = {
  getPromotions,
  getPromotionById,
  getPromotionByCode,
  getActivePromotions,
  validatePromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
  incrementPromotionUsage,
};
