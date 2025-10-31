const Banner = require('../models/Banner');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all banners
const getBanners = asyncHandler(async (req, res) => {
  const { position, active, page = 1, limit = 10, search } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    position,
    active: active !== undefined ? active === 'true' : undefined,
    search,
  };

  const result = await Banner.getAll(filters);

  res.json({
    success: true,
    message: 'Banners retrieved successfully',
    data: {
      banners: result.banners,
      pagination: result.pagination,
    },
  });
});

// Get banner by ID
const getBannerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found',
    });
  }

  res.json({
    success: true,
    message: 'Banner retrieved successfully',
    data: {
      banner,
    },
  });
});

// Get active banners by position
const getBannersByPosition = asyncHandler(async (req, res) => {
  const { position } = req.params;
  const { limit = 5 } = req.query;

  const banners = await Banner.getByPosition(position, parseInt(limit));

  res.json({
    success: true,
    message: 'Banners retrieved successfully',
    data: {
      banners,
    },
  });
});

// Create banner (Admin only)
const createBanner = asyncHandler(async (req, res) => {
  const {
    banner_title,
    banner_slug,
    banner_description,
    banner_image,
    banner_link,
    banner_position,
    banner_order,
    banner_active,
    banner_start_date,
    banner_end_date,
  } = req.body;

  const banner = await Banner.create({
    banner_title,
    banner_slug,
    banner_description,
    banner_image,
    banner_link,
    banner_position,
    banner_order,
    banner_active,
    banner_start_date,
    banner_end_date,
  });

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: {
      banner,
    },
  });
});

// Update banner (Admin only)
const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const banner = await Banner.findById(id);

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found',
    });
  }

  const updatedBanner = await Banner.update(id, updateData);

  res.json({
    success: true,
    message: 'Banner updated successfully',
    data: {
      banner: updatedBanner,
    },
  });
});

// Delete banner (Admin only)
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found',
    });
  }

  await Banner.delete(id);

  res.json({
    success: true,
    message: 'Banner deleted successfully',
  });
});

// Toggle banner status (Admin only)
const toggleBannerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found',
    });
  }

  const updatedBanner = await Banner.toggleStatus(id);

  res.json({
    success: true,
    message: 'Banner status updated successfully',
    data: {
      banner: updatedBanner,
    },
  });
});

module.exports = {
  getBanners,
  getBannerById,
  getBannersByPosition,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
};
