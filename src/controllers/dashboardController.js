const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Get dashboard statistics (admin only)
const getDashboardStatistics = asyncHandler(async (req, res) => {
  try {
    // Get all statistics in parallel
    const [
      orderStats,
      productStats,
      userStats,
      reviewStats,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      Order.getDashboardStatistics(),
      Product.getStatistics(),
      User.getStatistics(),
      Review.getStatistics(),
      Order.getRecent(5), // Get 5 recent orders
      Product.getTopSelling(5), // Get 5 top selling products
    ]);

    const dashboardData = {
      statistics: {
        total_orders: orderStats.total_orders || 0,
        total_revenue: orderStats.total_revenue || 0,
        total_products: productStats.total_products || 0,
        total_users: userStats.total_users || 0,
        total_reviews: reviewStats.total_reviews || 0,
        average_rating: productStats.average_rating || 0,
        orders_this_month: orderStats.orders_this_month || 0,
        revenue_this_month: orderStats.revenue_this_month || 0,
      },
      recent_orders: recentOrders || [],
      top_products: topProducts || [],
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard statistics',
    });
  }
});

module.exports = {
  getDashboardStatistics,
};
