const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.getAll();

  res.json({
    success: true,
    data: { categories },
  });
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.json({
    success: true,
    data: { category },
  });
});

// Get category by slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findBySlug(slug);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.json({
    success: true,
    data: { category },
  });
});

// Get category with products
const getCategoryWithProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await Category.getWithProducts(
    id,
    parseInt(page),
    parseInt(limit)
  );
  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.json({
    success: true,
    data: result,
  });
});

// Create new category (admin only)
const createCategory = asyncHandler(async (req, res) => {
  const { category_name, category_slug, category_type, category_img } =
    req.body;

  const category = await Category.create({
    category_name,
    category_slug,
    category_type,
    category_img,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

// Update category (admin only)
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const category = await Category.update(id, updateData);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

// Delete category (admin only)
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.delete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    if (
      error.message.includes('Cannot delete category with existing products')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products',
      });
    }
    throw error;
  }
});

// Get categories by type
const getCategoriesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  const categories = await Category.getByType(type);

  res.json({
    success: true,
    data: { categories },
  });
});

// Search categories
const searchCategories = asyncHandler(async (req, res) => {
  const { q: searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: 'Search term is required',
    });
  }

  const categories = await Category.search(searchTerm);

  res.json({
    success: true,
    data: { categories },
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryWithProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByType,
  searchCategories,
};
