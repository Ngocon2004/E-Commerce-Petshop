const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const {
  verifyToken,
  requireAdmin,
  optionalAuth,
} = require('../middleware/auth');
const { validateId, validatePagination } = require('../middleware/validation');

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [top, middle, bottom, sidebar]
 *         description: Filter by banner position
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
 *         description: Number of banners per page
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
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
 *                         banners:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Banner'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 */
router.get('/', optionalAuth, validatePagination, bannerController.getBanners);

/**
 * @swagger
 * /api/banners/position/{position}:
 *   get:
 *     summary: Get banners by position
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *           enum: [top, middle, bottom, sidebar]
 *         description: Banner position
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of banners to return
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
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
 *                         banners:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Banner'
 */
router.get(
  '/position/:position',
  optionalAuth,
  bannerController.getBannersByPosition
);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner retrieved successfully
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
 *                         banner:
 *                           $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', optionalAuth, validateId, bannerController.getBannerById);

// Admin routes
/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create new banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - banner_title
 *               - banner_slug
 *               - banner_image
 *               - banner_position
 *             properties:
 *               banner_title:
 *                 type: string
 *                 maxLength: 255
 *                 example: Summer Sale Banner
 *               banner_slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 example: summer-sale-banner
 *               banner_description:
 *                 type: string
 *                 example: Special summer promotion
 *               banner_image:
 *                 type: string
 *                 example: https://example.com/images/banner.jpg
 *               banner_link:
 *                 type: string
 *                 example: /products/summer-sale
 *               banner_position:
 *                 type: string
 *                 enum: [top, middle, bottom, sidebar]
 *                 example: top
 *               banner_order:
 *                 type: integer
 *                 example: 1
 *               banner_start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               banner_end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       201:
 *         description: Banner created successfully
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
 *                         banner:
 *                           $ref: '#/components/schemas/Banner'
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
router.post('/', verifyToken, requireAdmin, bannerController.createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banner_title:
 *                 type: string
 *                 maxLength: 255
 *                 example: Summer Sale Banner
 *               banner_slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 example: summer-sale-banner
 *               banner_description:
 *                 type: string
 *                 example: Special summer promotion
 *               banner_image:
 *                 type: string
 *                 example: https://example.com/images/banner.jpg
 *               banner_link:
 *                 type: string
 *                 example: /products/summer-sale
 *               banner_position:
 *                 type: string
 *                 enum: [top, middle, bottom, sidebar]
 *                 example: top
 *               banner_order:
 *                 type: integer
 *                 example: 1
 *               banner_start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               banner_end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Banner updated successfully
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
 *                         banner:
 *                           $ref: '#/components/schemas/Banner'
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
 *         description: Banner not found
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
  bannerController.updateBanner
);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
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
 *         description: Banner not found
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
  bannerController.deleteBanner
);

/**
 * @swagger
 * /api/banners/{id}/toggle:
 *   put:
 *     summary: Toggle banner status (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner status updated successfully
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
 *                         banner:
 *                           $ref: '#/components/schemas/Banner'
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
 *         description: Banner not found
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
  bannerController.toggleBannerStatus
);

module.exports = router;
