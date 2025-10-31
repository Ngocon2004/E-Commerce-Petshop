const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorHandler');

// Create new review
const createReview = asyncHandler(async (req, res) => {
  const { product_id, product_variant_id, rating, review_text } = req.body;
  const user_id = req.user.id;

  const review = await Review.create({
    product_id,
    product_variant_id,
    user_id,
    rating,
    review_text,
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review },
  });
});

// Get reviews by product ID
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await Review.getByProductId(
    productId,
    parseInt(page),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: result,
  });
});

// Get review by ID
const getReviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  res.json({
    success: true,
    data: { review },
  });
});

// Update review
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review_text } = req.body;
  const user_id = req.user.id;

  const review = await Review.update(id, user_id, {
    rating,
    review_text,
  });

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: { review },
  });
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const review = await Review.delete(id, user_id);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// Get user's reviews
const getUserReviews = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const result = await Review.getByUserId(
    user_id,
    parseInt(page),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: result,
  });
});

// Get all reviews (admin only)
const getAllReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    product_id,
    rating,
    search,
    sort_by = 'created_at',
    sort_order = 'DESC',
  } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    product_id: product_id ? parseInt(product_id) : undefined,
    rating: rating ? parseInt(rating) : undefined,
    search,
    sort_by,
    sort_order,
  };

  const result = await Review.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// Delete review (admin only)
const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.delete(id, null, true);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// Get recent reviews
const getRecentReviews = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const reviews = await Review.getRecent(parseInt(limit));

  res.json({
    success: true,
    data: { reviews },
  });
});

// Get review statistics
const getReviewStatistics = asyncHandler(async (req, res) => {
  const statistics = await Review.getStatistics();

  res.json({
    success: true,
    data: { statistics },
  });
});

// Get reviews by rating
const getReviewsByRating = asyncHandler(async (req, res) => {
  const { rating } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (![1, 2, 3, 4, 5].includes(parseInt(rating))) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5',
    });
  }

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    rating: parseInt(rating),
  };

  const result = await Review.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

module.exports = {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserReviews,
  getAllReviews,
  deleteReviewAdmin,
  getRecentReviews,
  getReviewStatistics,
  getReviewsByRating,
};
