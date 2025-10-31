const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const {
  verifyToken,
  requireAdmin,
  optionalAuth,
} = require('../middleware/auth');
const { validateId, validatePagination } = require('../middleware/validation');

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *         description: Filter by promotion type
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of promotions per page
 *     responses:
 *       200:
 *         description: Promotions retrieved successfully
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
 *                         promotions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Promotion'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 */
router.get(
  '/',
  optionalAuth,
  validatePagination,
  promotionController.getPromotions
);

/**
 * @swagger
 * /api/promotions/active:
 *   get:
 *     summary: Get active promotions
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of promotions to return
 *     responses:
 *       200:
 *         description: Active promotions retrieved successfully
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
 *                         promotions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Promotion'
 */
router.get('/active', optionalAuth, promotionController.getActivePromotions);

/**
 * @swagger
 * /api/promotions/code/{code}:
 *   get:
 *     summary: Get promotion by code
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion code
 *     responses:
 *       200:
 *         description: Promotion retrieved successfully
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/code/:code', optionalAuth, promotionController.getPromotionByCode);

/**
 * @swagger
 * /api/promotions/validate/{code}:
 *   get:
 *     summary: Validate promotion code
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion code
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *           format: decimal
 *         description: Order amount for validation
 *     responses:
 *       200:
 *         description: Promotion code is valid
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Promotion code validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Promotion code not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/validate/:code',
  optionalAuth,
  promotionController.validatePromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion retrieved successfully
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  optionalAuth,
  validateId,
  promotionController.getPromotionById
);

// Admin routes
/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create new promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotion_title
 *               - promotion_slug
 *               - promotion_type
 *               - promotion_value
 *               - promotion_start_date
 *               - promotion_end_date
 *             properties:
 *               promotion_title:
 *                 type: string
 *                 maxLength: 255
 *                 example: Summer Sale 20% Off
 *               promotion_slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 example: summer-sale-20-off
 *               promotion_description:
 *                 type: string
 *                 example: Special summer promotion with 20% discount
 *               promotion_image:
 *                 type: string
 *                 example: https://example.com/images/promotion.jpg
 *               promotion_type:
 *                 type: string
 *                 enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *                 example: percentage
 *               promotion_value:
 *                 type: number
 *                 format: decimal
 *                 example: 20.00
 *               promotion_min_amount:
 *                 type: number
 *                 format: decimal
 *                 example: 100.00
 *               promotion_max_discount:
 *                 type: number
 *                 format: decimal
 *                 example: 50.00
 *               promotion_code:
 *                 type: string
 *                 maxLength: 50
 *                 example: SUMMER20
 *               promotion_usage_limit:
 *                 type: integer
 *                 example: 100
 *               promotion_start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               promotion_end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       201:
 *         description: Promotion created successfully
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.post(
  '/',
  verifyToken,
  requireAdmin,
  promotionController.createPromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotion_title:
 *                 type: string
 *                 maxLength: 255
 *                 example: Summer Sale 20% Off
 *               promotion_slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 example: summer-sale-20-off
 *               promotion_description:
 *                 type: string
 *                 example: Special summer promotion with 20% discount
 *               promotion_image:
 *                 type: string
 *                 example: https://example.com/images/promotion.jpg
 *               promotion_type:
 *                 type: string
 *                 enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *                 example: percentage
 *               promotion_value:
 *                 type: number
 *                 format: decimal
 *                 example: 20.00
 *               promotion_min_amount:
 *                 type: number
 *                 format: decimal
 *                 example: 100.00
 *               promotion_max_discount:
 *                 type: number
 *                 format: decimal
 *                 example: 50.00
 *               promotion_code:
 *                 type: string
 *                 maxLength: 50
 *                 example: SUMMER20
 *               promotion_usage_limit:
 *                 type: integer
 *                 example: 100
 *               promotion_start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               promotion_end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Promotion updated successfully
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  validateId,
  promotionController.updatePromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
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
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  validateId,
  promotionController.deletePromotion
);

/**
 * @swagger
 * /api/promotions/{id}/toggle:
 *   put:
 *     summary: Toggle promotion status (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion status updated successfully
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
 *                         promotion:
 *                           $ref: '#/components/schemas/Promotion'
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
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id/toggle',
  verifyToken,
  requireAdmin,
  validateId,
  promotionController.togglePromotionStatus
);

module.exports = router;
