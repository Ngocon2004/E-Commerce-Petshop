const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Shop API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for an e-commerce pet shop',
      contact: {
        name: 'Pet Shop Support',
        email: 'support@petshop.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.petshop.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            user_email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            user_name: {
              type: 'string',
              example: 'John Doe',
            },
            user_gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              example: 'male',
            },
            user_birth: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
            },
            user_active: {
              type: 'boolean',
              example: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            product_name: {
              type: 'string',
              example: 'Royal Canin Adult Dog Food',
            },
            product_slug: {
              type: 'string',
              example: 'royal-canin-adult-dog-food',
            },
            product_short_description: {
              type: 'string',
              example: 'Premium nutrition for adult dogs',
            },
            product_description: {
              type: 'string',
              example: 'Complete and balanced nutrition for adult dogs...',
            },
            product_buy_price: {
              type: 'number',
              format: 'decimal',
              example: 45.99,
            },
            product_sold_quantity: {
              type: 'integer',
              example: 150,
            },
            product_avg_rating: {
              type: 'number',
              format: 'decimal',
              example: 4.5,
            },
            brand_name: {
              type: 'string',
              example: 'Royal Canin',
            },
            category_name: {
              type: 'string',
              example: 'Dog Food',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            category_name: {
              type: 'string',
              example: 'Dog Food',
            },
            category_slug: {
              type: 'string',
              example: 'dog-food',
            },
            category_type: {
              type: 'string',
              example: 'food',
            },
            category_img: {
              type: 'string',
              example: 'https://example.com/images/dog-food.jpg',
            },
            product_count: {
              type: 'integer',
              example: 25,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Royal Canin',
            },
            description: {
              type: 'string',
              example:
                'Premium pet food brand specializing in breed-specific nutrition',
            },
            product_count: {
              type: 'integer',
              example: 15,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            product_id: {
              type: 'integer',
              example: 1,
            },
            variant_id: {
              type: 'integer',
              example: 1,
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            product_name: {
              type: 'string',
              example: 'Royal Canin Adult Dog Food',
            },
            variant_name: {
              type: 'string',
              example: 'Small Bag (5kg)',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 45.99,
            },
            discount_amount: {
              type: 'number',
              format: 'decimal',
              example: 5.0,
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            customer_id: {
              type: 'integer',
              example: 1,
            },
            order_total_cost: {
              type: 'number',
              format: 'decimal',
              example: 95.98,
            },
            order_status: {
              type: 'string',
              enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
              ],
              example: 'pending',
            },
            order_shipping_cost: {
              type: 'number',
              format: 'decimal',
              example: 10.0,
            },
            order_payment_cost: {
              type: 'number',
              format: 'decimal',
              example: 0.0,
            },
            order_note: {
              type: 'string',
              example: 'Giao hàng vào buổi chiều',
            },
            payment_method: {
              type: 'string',
              enum: [
                'cod',
                'bank_transfer',
                'momo',
                'zalopay',
                'vnpay',
                'credit_card',
              ],
              example: 'cod',
            },
            shipping_method: {
              type: 'string',
              enum: ['standard', 'express', 'same_day', 'pickup'],
              example: 'standard',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            product_id: {
              type: 'integer',
              example: 1,
            },
            user_id: {
              type: 'integer',
              example: 1,
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            review_text: {
              type: 'string',
              example:
                'Excellent food! My dog loves it and his coat looks much healthier.',
            },
            user_name: {
              type: 'string',
              example: 'John Doe',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error description',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                  },
                  param: {
                    type: 'string',
                  },
                  location: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            current_page: {
              type: 'integer',
              example: 1,
            },
            total_pages: {
              type: 'integer',
              example: 10,
            },
            total_items: {
              type: 'integer',
              example: 100,
            },
            items_per_page: {
              type: 'integer',
              example: 10,
            },
            has_next: {
              type: 'boolean',
              example: true,
            },
            has_prev: {
              type: 'boolean',
              example: false,
            },
          },
        },
        ProductVariant: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            product_id: {
              type: 'integer',
              example: 1,
            },
            variant_name: {
              type: 'string',
              example: 'Small Bag (5kg)',
            },
            variant_slug: {
              type: 'string',
              example: 'small-bag-5kg',
            },
            variant_price: {
              type: 'number',
              format: 'decimal',
              example: 45.99,
            },
            variant_stock: {
              type: 'integer',
              example: 100,
            },
            variant_weight: {
              type: 'number',
              format: 'decimal',
              example: 5.0,
            },
            variant_img: {
              type: 'string',
              example: 'https://example.com/images/variant.jpg',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            order_id: {
              type: 'integer',
              example: 1,
            },
            product_id: {
              type: 'integer',
              example: 1,
            },
            variant_id: {
              type: 'integer',
              example: 1,
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            unit_price: {
              type: 'number',
              format: 'decimal',
              example: 45.99,
            },
            total_price: {
              type: 'number',
              format: 'decimal',
              example: 91.98,
            },
            product_name: {
              type: 'string',
              example: 'Royal Canin Adult Dog Food',
            },
            variant_name: {
              type: 'string',
              example: 'Small Bag (5kg)',
            },
          },
        },
        CartSummary: {
          type: 'object',
          properties: {
            total_items: {
              type: 'integer',
              example: 5,
            },
            total_quantity: {
              type: 'integer',
              example: 8,
            },
            subtotal: {
              type: 'number',
              format: 'decimal',
              example: 199.95,
            },
            shipping_cost: {
              type: 'number',
              format: 'decimal',
              example: 10.0,
            },
            total_cost: {
              type: 'number',
              format: 'decimal',
              example: 209.95,
            },
          },
        },
        ReviewStatistics: {
          type: 'object',
          properties: {
            total_reviews: {
              type: 'integer',
              example: 150,
            },
            average_rating: {
              type: 'number',
              format: 'decimal',
              example: 4.2,
            },
            rating_distribution: {
              type: 'object',
              properties: {
                1: { type: 'integer', example: 5 },
                2: { type: 'integer', example: 10 },
                3: { type: 'integer', example: 25 },
                4: { type: 'integer', example: 60 },
                5: { type: 'integer', example: 50 },
              },
            },
          },
        },
        OrderStatistics: {
          type: 'object',
          properties: {
            total_orders: {
              type: 'integer',
              example: 500,
            },
            total_revenue: {
              type: 'number',
              format: 'decimal',
              example: 25000.0,
            },
            status_distribution: {
              type: 'object',
              properties: {
                pending: { type: 'integer', example: 10 },
                confirmed: { type: 'integer', example: 15 },
                processing: { type: 'integer', example: 20 },
                shipped: { type: 'integer', example: 30 },
                delivered: { type: 'integer', example: 400 },
                cancelled: { type: 'integer', example: 25 },
              },
            },
          },
        },
      },
      Banner: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          banner_title: {
            type: 'string',
            example: 'Summer Sale Banner',
          },
          banner_slug: {
            type: 'string',
            example: 'summer-sale-banner',
          },
          banner_description: {
            type: 'string',
            example: 'Special summer promotion',
          },
          banner_image: {
            type: 'string',
            example: 'https://example.com/images/banner.jpg',
          },
          banner_link: {
            type: 'string',
            example: '/products/summer-sale',
          },
          banner_position: {
            type: 'string',
            enum: ['top', 'middle', 'bottom', 'sidebar'],
            example: 'top',
          },
          banner_order: {
            type: 'integer',
            example: 1,
          },
          banner_active: {
            type: 'boolean',
            example: true,
          },
          banner_start_date: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00Z',
          },
          banner_end_date: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-31T23:59:59Z',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Promotion: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          promotion_title: {
            type: 'string',
            example: 'Summer Sale 20% Off',
          },
          promotion_slug: {
            type: 'string',
            example: 'summer-sale-20-off',
          },
          promotion_description: {
            type: 'string',
            example: 'Special summer promotion with 20% discount',
          },
          promotion_image: {
            type: 'string',
            example: 'https://example.com/images/promotion.jpg',
          },
          promotion_type: {
            type: 'string',
            enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
            example: 'percentage',
          },
          promotion_value: {
            type: 'number',
            format: 'decimal',
            example: 20.0,
          },
          promotion_min_amount: {
            type: 'number',
            format: 'decimal',
            example: 100.0,
          },
          promotion_max_discount: {
            type: 'number',
            format: 'decimal',
            example: 50.0,
          },
          promotion_code: {
            type: 'string',
            example: 'SUMMER20',
          },
          promotion_usage_limit: {
            type: 'integer',
            example: 100,
          },
          promotion_used_count: {
            type: 'integer',
            example: 25,
          },
          promotion_start_date: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00Z',
          },
          promotion_end_date: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-31T23:59:59Z',
          },
          promotion_active: {
            type: 'boolean',
            example: true,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Article: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          user_id: {
            type: 'integer',
            example: 1,
          },
          article_title: {
            type: 'string',
            example: 'How to Choose the Right Dog Food',
          },
          article_short_description: {
            type: 'string',
            example:
              'A comprehensive guide to selecting the best nutrition for your dog',
          },
          article_img: {
            type: 'string',
            example: 'https://example.com/images/dog-food-guide.jpg',
          },
          article_content: {
            type: 'string',
            example:
              "Choosing the right dog food is crucial for your pet's health and wellbeing...",
          },
          author: {
            type: 'string',
            example: 'Dr. Sarah Johnson',
          },
          published_date: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = specs;
