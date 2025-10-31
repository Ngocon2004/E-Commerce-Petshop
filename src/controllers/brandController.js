const Brand = require('../models/Brand');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all brands
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.getAll();

  res.json({
    success: true,
    data: { brands },
  });
});

// Get brand by ID
const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found',
    });
  }

  res.json({
    success: true,
    data: { brand },
  });
});

// Create new brand (admin only)
const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const brand = await Brand.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: { brand },
  });
});

// Update brand (admin only)
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const brand = await Brand.update(id, updateData);
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found',
    });
  }

  res.json({
    success: true,
    message: 'Brand updated successfully',
    data: { brand },
  });
});

// Delete brand (admin only)
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.delete(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('Cannot delete brand with existing products')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete brand with existing products',
      });
    }
    throw error;
  }
});

// Search brands
const searchBrands = asyncHandler(async (req, res) => {
  const { q: searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: 'Search term is required',
    });
  }

  const brands = await Brand.search(searchTerm);

  res.json({
    success: true,
    data: { brands },
  });
});

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands,
};
