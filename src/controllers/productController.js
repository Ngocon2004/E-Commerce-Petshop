const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all products with filtering and pagination
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category_slug,
    brand_id,
    min_price,
    max_price,
    sort_by = 'created_at',
    sort_order = 'DESC',
  } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category_slug,
    brand_id: brand_id ? parseInt(brand_id) : undefined,
    min_price: min_price ? parseFloat(min_price) : undefined,
    max_price: max_price ? parseFloat(max_price) : undefined,
    sort_by,
    sort_order,
  };

  const result = await Product.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Get product variants
  const variants = await Product.getVariants(id);

  // Get product reviews
  const reviews = await Product.getReviews(id, 1, 5);

  res.json({
    success: true,
    data: {
      product,
      reviews: reviews.reviews,
      review_stats: {
        total_reviews: reviews.pagination.total,
        average_rating: product.product_avg_rating,
      },
    },
  });
});

// Create new product (admin only)
const createProduct = asyncHandler(async (req, res) => {
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
  } = req.body;

  // Validate required fields
  if (!product_name || !product_slug || !product_buy_price) {
    return res.status(400).json({
      success: false,
      message: 'Product name, slug, and buy price are required',
    });
  }

  const product = await Product.create({
    brand_id,
    category_id,
    product_name,
    product_slug,
    product_short_description,
    product_description,
    product_buy_price,
    images,
    variants,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

// Update product (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const product = await Product.update(id, updateData);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

// Delete product (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.delete(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// Get product variants
const getProductVariants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const variants = await Product.getVariants(id);

  res.json({
    success: true,
    data: { variants },
  });
});

// Get product reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Product.getReviews(id, parseInt(page), parseInt(limit));

  res.json({
    success: true,
    data: reviews,
  });
});

// Get best selling products
const getBestSelling = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.getBestSelling(parseInt(limit));

  res.json({
    success: true,
    data: { products },
  });
});

// Get featured products
const getFeatured = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.getFeatured(parseInt(limit));

  res.json({
    success: true,
    data: { products },
  });
});

// Search products
const searchProducts = asyncHandler(async (req, res) => {
  const {
    q: searchTerm,
    page = 1,
    limit = 10,
    category_id,
    brand_id,
    min_price,
    max_price,
    sort_by = 'created_at',
    sort_order = 'DESC',
  } = req.query;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: 'Search term is required',
    });
  }

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    search: searchTerm,
    category_id: category_id ? parseInt(category_id) : undefined,
    brand_id: brand_id ? parseInt(brand_id) : undefined,
    min_price: min_price ? parseFloat(min_price) : undefined,
    max_price: max_price ? parseFloat(max_price) : undefined,
    sort_by,
    sort_order,
  };

  const result = await Product.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariants,
  getProductReviews,
  getBestSelling,
  getFeatured,
  searchProducts,
};
