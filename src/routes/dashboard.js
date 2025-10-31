const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/dashboard/statistics:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         statistics:
 *                           type: object
 *                           properties:
 *                             total_orders:
 *                               type: integer
 *                               description: Total number of orders
 *                             total_revenue:
 *                               type: integer
 *                               description: Total revenue
 *                             total_products:
 *                               type: integer
 *                               description: Total number of products
 *                             total_users:
 *                               type: integer
 *                               description: Total number of users
 *                             total_reviews:
 *                               type: integer
 *                               description: Total number of reviews
 *                             average_rating:
 *                               type: number
 *                               description: Average product rating
 *                             orders_this_month:
 *                               type: integer
 *                               description: Orders this month
 *                             revenue_this_month:
 *                               type: integer
 *                               description: Revenue this month
 *                         recent_orders:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'
 *                         top_products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/statistics',
  verifyToken,
  requireAdmin,
  dashboardController.getDashboardStatistics
);

module.exports = router;
