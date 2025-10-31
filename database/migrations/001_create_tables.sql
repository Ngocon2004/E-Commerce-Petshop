-- Create database tables for Pet Shop API
-- This script creates all necessary tables based on the schema provided

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_gender VARCHAR(10) CHECK (user_gender IN ('male', 'female', 'other')),
    user_birth DATE,
    user_active BOOLEAN DEFAULT true,
    user_role VARCHAR(20) DEFAULT 'user' CHECK (user_role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_slug VARCHAR(255) UNIQUE NOT NULL,
    category_type VARCHAR(100) NOT NULL,
    category_img TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_slug VARCHAR(255) UNIQUE NOT NULL,
    product_short_description TEXT,
    product_description TEXT,
    product_sold_quantity INTEGER DEFAULT 0,
    product_avg_rating DECIMAL(3, 2) DEFAULT 0.00,
    product_buy_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    variant_name VARCHAR(255) NOT NULL,
    variant_slug VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT true,
    in_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, variant_slug)
);

-- Create product_imgs table
CREATE TABLE IF NOT EXISTS product_imgs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create variant_imgs table
CREATE TABLE IF NOT EXISTS variant_imgs (
    id SERIAL PRIMARY KEY,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);

-- Create order_address table
CREATE TABLE IF NOT EXISTS order_address (
    id SERIAL PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    order_address_id INTEGER REFERENCES order_address(id) ON DELETE SET NULL,
    order_total_cost DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    order_shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    order_payment_cost DECIMAL(10, 2) DEFAULT 0.00,
    order_note TEXT,
    payment_method VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'credit_card')),
    shipping_method VARCHAR(50) DEFAULT 'standard' CHECK (shipping_method IN ('standard', 'express', 'same_day', 'pickup')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create order_details table
CREATE TABLE IF NOT EXISTS order_details (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Create review_user_info table
CREATE TABLE IF NOT EXISTS review_user_info (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    article_title VARCHAR(255) NOT NULL,
    article_short_description VARCHAR(255),
    article_img TEXT,
    article_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create article_info table
CREATE TABLE IF NOT EXISTS article_info (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    published_date DATE NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    notification_name VARCHAR(255) NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    notification_slug TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notification_users_list table
CREATE TABLE IF NOT EXISTS notification_users_list (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(user_active);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(product_slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_details_order ON order_details(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_user ON articles(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at column
-- Create banners table
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_title VARCHAR(255) NOT NULL,
    banner_slug VARCHAR(255) NOT NULL UNIQUE,
    banner_description TEXT,
    banner_image VARCHAR(500) NOT NULL,
    banner_link VARCHAR(500),
    banner_position VARCHAR(20) NOT NULL DEFAULT 'top' CHECK (banner_position IN ('top', 'middle', 'bottom', 'sidebar')),
    banner_order INTEGER NOT NULL DEFAULT 0,
    banner_active BOOLEAN NOT NULL DEFAULT true,
    banner_start_date TIMESTAMP,
    banner_end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create promotions table
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    promotion_title VARCHAR(255) NOT NULL,
    promotion_slug VARCHAR(255) NOT NULL UNIQUE,
    promotion_description TEXT,
    promotion_image VARCHAR(500),
    promotion_type VARCHAR(20) NOT NULL DEFAULT 'percentage' CHECK (promotion_type IN ('percentage', 'fixed', 'free_shipping', 'buy_x_get_y')),
    promotion_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    promotion_min_amount DECIMAL(10,2) DEFAULT 0,
    promotion_max_discount DECIMAL(10,2),
    promotion_code VARCHAR(50) UNIQUE,
    promotion_usage_limit INTEGER,
    promotion_used_count INTEGER NOT NULL DEFAULT 0,
    promotion_start_date TIMESTAMP NOT NULL,
    promotion_end_date TIMESTAMP NOT NULL,
    promotion_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for banners
CREATE INDEX idx_banners_position ON banners(banner_position);
CREATE INDEX idx_banners_active ON banners(banner_active);
CREATE INDEX idx_banners_dates ON banners(banner_start_date, banner_end_date);
CREATE INDEX idx_banners_order ON banners(banner_order);

-- Create indexes for promotions
CREATE INDEX idx_promotions_type ON promotions(promotion_type);
CREATE INDEX idx_promotions_active ON promotions(promotion_active);
CREATE INDEX idx_promotions_dates ON promotions(promotion_start_date, promotion_end_date);
CREATE INDEX idx_promotions_code ON promotions(promotion_code);

-- Create triggers for updated_at
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
