# Pet Shop API

A comprehensive RESTful API for an e-commerce pet shop built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Product Management**: CRUD operations, filtering, search, pagination
- **Category Management**: Product categorization and organization
- **Brand Management**: Brand information and product association
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Order creation, tracking, and status updates
- **Review System**: Product reviews and ratings
- **Admin Features**: Administrative controls for all resources

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **Code Quality**: ESLint, Prettier
- **Documentation**: Swagger/OpenAPI 3.0

## Project Structure

```
petshop/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── brandController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── brands.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── reviews.js
│   └── server.js
├── config/
│   └── database.js
├── database/
│   ├── migrations/
│   │   └── 001_create_tables.sql
│   ├── seed.sql
│   └── setup.js
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd petshop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=petshop
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Create PostgreSQL database
   createdb petshop

   # Run database setup
   node database/setup.js
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Products

- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/search` - Search products
- `GET /api/products/best-selling` - Get best selling products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/variants` - Get product variants
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/search` - Search categories
- `GET /api/categories/type/:type` - Get categories by type
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/products` - Get category products
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Brands

- `GET /api/brands` - Get all brands
- `GET /api/brands/search` - Search brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create brand (admin)
- `PUT /api/brands/:id` - Update brand (admin)
- `DELETE /api/brands/:id` - Delete brand (admin)

### Cart

- `GET /api/cart` - Get user's cart
- `GET /api/cart/summary` - Get cart summary
- `GET /api/cart/validate` - Validate cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/statistics` - Get order statistics (admin)
- `GET /api/orders/status/:status` - Get orders by status (admin)
- `GET /api/orders/:id/details` - Get order details (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Reviews

- `GET /api/reviews/recent` - Get recent reviews
- `GET /api/reviews/statistics` - Get review statistics
- `GET /api/reviews/rating/:rating` - Get reviews by rating
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review
- `GET /api/reviews/my-reviews` - Get user's reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews` - Get all reviews (admin)
- `DELETE /api/reviews/:id/admin` - Delete review (admin)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## Database Schema

The database includes the following main tables:

- `users` - User accounts and authentication
- `brands` - Product brands
- `categories` - Product categories
- `products` - Product information
- `product_variants` - Product variations (size, color, etc.)
- `product_imgs` - Product images
- `carts` - Shopping cart items
- `orders` - Order information
- `order_details` - Order line items
- `reviews` - Product reviews and ratings

## Development

### Running in Development Mode

```bash
npm run dev
```

### Database Migrations

```bash
node database/setup.js
```

### Code Quality

```bash
# Run ESLint to check for code issues
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### API Documentation

The API documentation is available at:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **JSON Schema**: `http://localhost:3000/api/docs/swagger.json`

### Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure CORS for your domain
5. Set up SSL/TLS
6. Configure rate limiting appropriately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

```
brew services start postgresql@15
brew services list
brew services stop postgresql@15
```

Lệnh,Mục đích,Ví dụ & Kết quả
\l ,Liệt kê tất cả các databases trên server.
\c [tên_db],Chuyển đổi sang database khác.,
\c my_store (Kết nối tới database my_store)
\dt,Liệt kê tất cả các tables trong database hiện tại.,"Hiển thị danh sách các bảng như users, products, orders."
\d [tên_bảng],Mô tả cấu trúc chi tiết của một bảng.,"\d products (Hiển thị các cột, kiểu dữ liệu, index, khóa ngoại)"
\dn,Liệt kê các schemas (không gian tên) trong database.,Thường hiển thị public.
\du,Liệt kê tất cả các roles/users (người dùng).,"Hiển thị: postgres, tanthuan."
\q,Thoát khỏi chương trình psql.,Thoát khỏi giao diện dòng lệnh PostgreSQL.

```

Sever.js => routes (Trung tâm  điều phối api đi đến các nơi và xử lý midleware) => controllers (Xử lý logic nghiệp vụ) => models (Tương tác với database)


```
