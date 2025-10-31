-- Seed data for Pet Shop API
-- This script inserts sample data for testing and development

-- Insert sample brands
INSERT INTO brands (name, description) VALUES
('Royal Canin', 'Thương hiệu thức ăn thú cưng cao cấp chuyên về dinh dưỡng theo giống'),
('Hill''s Science Diet', 'Dinh dưỡng thú cưng được bác sĩ thú y khuyên dùng'),
('Purina Pro Plan', 'Thức ăn thú cưng chất lượng cao cho mọi giai đoạn cuộc đời'),
('Whiskas', 'Thương hiệu thức ăn mèo phổ biến'),
('Pedigree', 'Thương hiệu thức ăn chó đáng tin cậy'),
('Iams', 'Dinh dưỡng thú cưng cao cấp'),
('Blue Buffalo', 'Thương hiệu thức ăn thú cưng tự nhiên'),
('Wellness', 'Thương hiệu thức ăn thú cưng toàn diện'),
('NEKKO', 'Thương hiệu pate mèo cao cấp'),
('Aatas', 'Thương hiệu cát vệ sinh mèo chất lượng'),
('Sonice PIDAN', 'Thương hiệu đồ chơi và phụ kiện mèo'),
('ARM & HAMMER', 'Thương hiệu sản phẩm chăm sóc thú cưng');

-- Insert sample categories
INSERT INTO categories (category_name, category_slug, category_type, category_img) VALUES
('Thức Ăn Chó', 'thuc-an-cho', 'food', 'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433'),
('Thức Ăn Mèo', 'thuc-an-meo', 'food', 'https://paddy.vn/cdn/shop/files/gel-bo-sung-canxi-cho-cho-bossen_785x.png?v=1714123314'),
('Đồ Chơi Chó', 'do-choi-cho', 'toys', 'https://paddy.vn/cdn/shop/files/banh-thuong-meo-natural-core-nhieu-vi-40g_785x.png?v=1717582887'),
('Đồ Chơi Mèo', 'do-choi-meo', 'toys', 'https://paddy.vn/cdn/shop/files/pate-cho-cho-moi-lua-tuoi-ganador-thit-ga-120g_2_785x.jpg?v=1734336449'),
('Phụ Kiện Chó', 'phu-kien-cho', 'accessories', 'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433'),
('Phụ Kiện Mèo', 'phu-kien-meo', 'accessories', 'https://paddy.vn/cdn/shop/files/thuc-an-cho-meo-teb-city_1_-min_1880x.jpg?v=1730791993'),
('Sức Khỏe & Chăm Sóc', 'suc-khoe-cham-soc', 'health', 'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433'),
('Cát Vệ Sinh', 'cat-ve-sinh', 'care', 'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433'),
('Đồ Ăn Vặt Mèo', 'do-an-vat-meo', 'treats', 'https://paddy.vn/cdn/shop/files/Pate-lapaw_785x.webp?v=1757567290'),
('Trị Ve Bọ Chét', 'tri-ve-bo-chet', 'health', 'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433');

-- Insert sample products
INSERT INTO products (brand_id, category_id, product_name, product_slug, product_short_description, product_description, product_buy_price) VALUES
(1, 2, 'Thức ăn mèo Royal Canin HAIR & SKIN Care - Dưỡng da và lông', 'royal-canin-hair-skin-care', 'Dưỡng da và lông cho mèo', 'Thức ăn chuyên biệt giúp dưỡng da và lông mèo khỏe mạnh, bóng mượt với công thức đặc biệt.', 637000),
(1, 2, 'Thức ăn mèo Royal Canin Urinary S/O Feline - Hỗ trợ trị sỏi bàng quang', 'royal-canin-urinary-so-feline', 'Hỗ trợ trị sỏi bàng quang', 'Thức ăn chuyên biệt giúp hỗ trợ điều trị và phòng ngừa sỏi bàng quang ở mèo.', 514000),
(1, 2, 'Thức ăn mèo Royal Canin KITTEN', 'royal-canin-kitten', 'Thức ăn cho mèo con', 'Thức ăn dinh dưỡng đặc biệt dành cho mèo con với công thức tối ưu cho sự phát triển.', 2331000),
(1, 2, 'Thức ăn mèo Royal Canin FIT32', 'royal-canin-fit32', 'Thức ăn giữ dáng cho mèo', 'Thức ăn giúp mèo duy trì cân nặng lý tưởng và sức khỏe tốt.', 516000),
(1, 2, 'Thức ăn mèo Royal Canin HAIRBALL Care - Trị búi lông', 'royal-canin-hairball-care', 'Trị búi lông cho mèo', 'Thức ăn chuyên biệt giúp giảm búi lông và hỗ trợ tiêu hóa cho mèo.', 637000),
(9, 2, 'Pate mèo NEKKO KITTEN Tuna - Cá ngừ', 'nekko-kitten-tuna', 'Pate cho mèo con vị cá ngừ', 'Pate mềm thơm ngon dành cho mèo con với hương vị cá ngừ tự nhiên.', 244020),
(4, 2, 'Pate WHISKAS Ocean Fish Flavour - Vị Cá biển', 'whiskas-ocean-fish', 'Pate mèo vị cá biển', 'Pate mèo thơm ngon với hương vị cá biển tự nhiên, giàu dinh dưỡng.', 288120),
(9, 2, 'Pate mèo NEKKO GRAVY Tuna & Shrimp - Cá ngừ và Tôm', 'nekko-gravy-tuna-shrimp', 'Pate mèo vị cá ngừ và tôm', 'Pate mèo cao cấp với hương vị cá ngừ và tôm thơm ngon.', 244020),
(9, 2, 'Pate mèo NEKKO GRAVY Tuna & Sea Bream - Cá ngừ và Cá tráp', 'nekko-gravy-tuna-seabream', 'Pate mèo vị cá ngừ và cá tráp', 'Pate mèo đặc biệt với hương vị cá ngừ và cá tráp tự nhiên.', 244020),
(10, 8, 'Cát vệ sinh mèo Aatas Bentonite Cat Liter', 'aatas-bentonite-cat-litter', 'Cát vệ sinh mèo chất lượng cao', 'Cát vệ sinh mèo bentonite chất lượng cao, khử mùi hiệu quả và dễ dàng vệ sinh.', 159000),
(11, 4, 'Bàn cào móng hình hộp Sonice PIDAN Cat Scratcher Board', 'pidan-cat-scratcher-board', 'Bàn cào móng cho mèo', 'Bàn cào móng hình hộp giúp mèo thỏa mãn bản năng cào móng và giải trí.', 293020),
(12, 8, 'Bột khử mùi Cat Litter ARM & HAMMER Deodorizer Powder', 'arm-hammer-deodorizer-powder', 'Bột khử mùi cát vệ sinh', 'Bột khử mùi cát vệ sinh mèo hiệu quả, giúp không gian luôn thơm tho.', 172900);

-- Insert sample product variants
-- discount_amount:% giảm giá
INSERT INTO product_variants (product_id, variant_name, variant_slug, price, discount_amount, is_available, in_stock) VALUES
(1, '2KG - Dưỡng da và lông', '2kg-hair-skin-care', 637000, 0, true, 25),
(2, '1.5KG - Hỗ trợ trị sỏi bàng quang', '1-5kg-urinary-so', 514000, 0, true, 30),
(3, '10KG - Cho mèo con', '10kg-kitten', 2331000, 0, true, 15),
(4, '2KG - Giữ dáng', '2kg-fit32', 516000, 0, true, 20),
(5, '2KG - Trị búi lông', '2kg-hairball-care', 637000, 0, true, 18),
(6, 'Hộp 12 Gói 70g - Cá ngừ', '12-goi-70g-tuna', 244020, 10, true, 50),
(7, 'Combo 6 Lon 400G - Vị Cá biển', '6-lon-400g-ocean-fish', 288120, 10, true, 40),
(8, 'Hộp 12 Gói 70g - Cá ngừ và Tôm', '12-goi-70g-tuna-shrimp', 244020, 10, true, 45),
(9, 'Hộp 12 Gói 70g - Cá ngừ và Cá tráp', '12-goi-70g-tuna-seabream', 244020, 5, true, 35),
(10, '10L - Cát vệ sinh', '10l-bentonite-litter', 159000, 0, true, 60),
(11, 'Hộp 19x13x2cm - Bàn cào móng', '19x13x2cm-scratcher', 293020, 8, true, 25),
(12, '510g - Bột khử mùi', '510g-deodorizer', 172900, 10, true, 40);

-- Insert sample product images
INSERT INTO product_imgs (product_id, name, value) VALUES
(1, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-meo-wanpy_940x.png?v=1694499969'),
(1, 'ingredients', 'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'),
(2, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-cho-meo-catchy-400g-2-1691993677891_785x.webp?v=1697452572'),
(2, 'nutrition_facts', 'https://paddy.vn/cdn/shop/files/thuc-an-cho-meo-teb-city_1_-min_1880x.jpg?v=1730791993'),
(3, 'main_image', 'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'),
(3, 'flavor_varieties', 'https://paddy.vn/cdn/shop/files/7ff858c75ced9bfd827ef20fea3ce392_940x.jpg?v=1690720867'),
(4, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-meo-con-nekko-kitten-creamy-70g_785x.png?v=1704521887'),
(4, 'taste_test', 'https://paddy.vn/cdn/shop/files/1_c24f3963-90ac-41e4-9f00-7b2ac74a22d7_785x.png?v=1690721007'),
(5, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-meo-kit-cat-gravy-lon-70g_785x.png?v=1716537451'),
(5, 'durability_test', 'https://paddy.vn/cdn/shop/files/pate-meo-purina-proplan-bo-sung-dinh-duong-goi-85g_3_785x.png?v=1704523126'),
(6, 'main_image', 'https://paddy.vn/cdn/shop/files/162_940x.jpg?v=1692495622'),
(6, 'flavors', 'https://paddy.vn/cdn/shop/files/Pate-meo-5Plus-Ca-Ngu-70g-Vi-ngau-nhien_870x.jpg?v=1690717672'),
(7, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-meo-kit-cat-petite-pouch-goi-70g_785x.webp?v=1715591549'),
(7, 'sizes', 'https://paddy.vn/cdn/shop/files/pate-meo-truong-thanh-nutri-plan-health-lon-160g_785x.png?v=1704522499'),
(8, 'main_image', 'https://paddy.vn/cdn/shop/files/snack-cho-cho-thit-say-cung-natural-core_785x.jpg?v=1755071589'),
(8, 'features', 'https://paddy.vn/cdn/shop/files/co-meo-hon-hop-thit-ca-say-kho-cho-cho-meo-11-loai_965c66d2-18e0-4f6c-8385-9f9a91a32842_785x.png?v=1704698050'),
(9, 'main_image', 'https://paddy.vn/cdn/shop/files/pate-meo-monge-bwild-goi-85g_785x.png?v=1692496125'),
(9, 'ingredients', 'https://paddy.vn/cdn/shop/files/thuc-an-cho-meo-teb-city_1_-min_1880x.jpg?v=1730791993'),
(10, 'main_image', 'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'),
(10, 'usage', 'https://paddy.vn/cdn/shop/files/pate-cho-cho-moi-lua-tuoi-ganador-thit-ga-120g_2_785x.jpg?v=1734336449'),
(11, 'main_image', 'https://paddy.vn/cdn/shop/files/banh-thuong-meo-natural-core-nhieu-vi-40g_785x.png?v=1717582887'),
(11, 'features', 'https://paddy.vn/cdn/shop/files/sup-thuong-cho-meo-nap-van-sunny-buddy_785x.webp?v=1704522777'),
(12, 'main_image', 'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'),
(12, 'benefits', 'https://paddy.vn/cdn/shop/files/gel-bo-sung-canxi-cho-cho-bossen_785x.png?v=1714123314');

-- Insert sample admin user
INSERT INTO users (user_email, user_password, user_name, user_gender, user_birth, user_active, user_role) VALUES
('admin@petshop.com', '$2a$12$eqMwF/03u6yxVG/R37webOvb2.PaT21WB6oJsPqp70.fH057ag6r2', 'Admin User', 'other', '1990-01-01', true, 'admin'); -- Pw: Admin@123

-- Insert sample customer users
INSERT INTO users (user_email, user_password, user_name, user_gender, user_birth, user_active, user_role) VALUES
('customer1@petshop.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8Kz8Kz8K', 'John Doe', 'male', '1985-05-15', true, 'user'),
('customer2@petshop.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8Kz8Kz8K', 'Jane Smith', 'female', '1992-08-22', true, 'user');

-- Insert sample review user info
INSERT INTO review_user_info (user_id, user_name, user_avatar) VALUES
(2, 'John Doe', 'https://cdn-icons-png.freepik.com/512/12965/12965382.png'),
(3, 'Jane Smith', 'https://cdn-icons-png.freepik.com/512/12965/12965382.png');

-- Insert sample reviews
INSERT INTO reviews (product_id, product_variant_id, user_id, rating, review_text) VALUES
(1, 1, 2, 5, 'Thức ăn tuyệt vời! Mèo nhà mình rất thích và lông mượt hơn nhiều. Rất đáng mua!'),
(1, 1, 3, 4, 'Chất lượng tốt, hơi đắt một chút nhưng mèo thích ăn.'),
(2, 2, 2, 5, 'Được bác sĩ thú y khuyên dùng và hiệu quả thật. Dinh dưỡng tốt cho mèo.'),
(3, 3, 3, 4, 'Mèo con nhà mình rất thích thức ăn này. Thành phần chất lượng tốt.'),
(4, 4, 2, 3, 'Thức ăn ổn, nhưng mèo nhà mình kén ăn. Sẽ thử vị khác.'),
(5, 5, 3, 5, 'Thức ăn trị búi lông hiệu quả! Mèo nhà mình ít bị búi lông hơn.'),
(6, 6, 2, 4, 'Pate mèo con rất thích. Hương vị cá ngừ tự nhiên.'),
(7, 7, 3, 5, 'Pate Whiskas ngon, mèo thích ăn. Đóng gói tiện lợi.'),
(8, 8, 2, 4, 'Pate NEKKO chất lượng tốt, mèo thích hương vị cá ngừ và tôm.'),
(9, 9, 3, 5, 'Pate vị cá ngừ và cá tráp rất ngon, mèo thích ăn.'),
(10, 10, 2, 4, 'Cát vệ sinh chất lượng tốt, khử mùi hiệu quả.'),
(11, 11, 3, 5, 'Bàn cào móng rất hữu ích, mèo thích cào và không cào đồ đạc nữa.'),
(12, 12, 2, 4, 'Bột khử mùi hiệu quả, giúp nhà luôn thơm tho.');

-- Update product average ratings
UPDATE products SET product_avg_rating = (
    SELECT COALESCE(AVG(rating), 0) 
    FROM reviews 
    WHERE reviews.product_id = products.id
);

-- Insert sample notifications
INSERT INTO notifications (notification_name, notification_type, notification_slug) VALUES
('Welcome to Pet Shop!', 'welcome', 'welcome-to-pet-shop'),
('New Product Alert', 'product', 'new-product-alert'),
('Order Confirmation', 'order', 'order-confirmation'),
('Shipping Update', 'shipping', 'shipping-update'),
('Special Offer', 'promotion', 'special-offer');

-- Insert sample articles
INSERT INTO articles (user_id, article_title, article_short_description, article_img, article_content) VALUES
(1, 'Cách Chọn Thức Ăn Phù Hợp Cho Chó', 'Hướng dẫn toàn diện để chọn dinh dưỡng tốt nhất cho chó của bạn', 'https://file.hstatic.net/
200000264739/file/banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'Việc chọn thức ăn phù hợp cho chó rất quan trọng đối với sức khỏe và sự phát triển của thú cưng. Trong hướng dẫn toàn diện này, chúng tôi sẽ đề cập đến mọi thứ bạn cần biết về dinh dưỡng cho chó, từ việc hiểu nhãn thành phần đến chọn công thức phù hợp với độ tuổi, kích thước và mức độ hoạt động của chó...'),
(1, 'Mẹo Chăm Sóc Lông Mèo Cho Người Mới Bắt Đầu', 'Kỹ thuật chăm sóc cơ bản mà mọi người nuôi mèo nên biết', 'https://file.hstatic.net/
200000264739/file/banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'Chăm sóc lông đúng cách rất cần thiết để duy trì sức khỏe và vẻ ngoài của mèo. Hướng dẫn thân thiện cho người mới bắt đầu này bao gồm các kỹ thuật chăm sóc cơ bản, dụng cụ cần thiết và cách tạo trải nghiệm tích cực cho cả bạn và mèo...'),
(1, 'Hiểu Về Hành Vi Thú Cưng', 'Giải mã các hành vi phổ biến của thú cưng và ý nghĩa của chúng', 'https://file.hstatic.net/
200000264739/file/banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'Hiểu về hành vi của thú cưng là chìa khóa để xây dựng mối quan hệ gắn bó và đảm bảo sức khỏe của chúng. Bài viết này khám phá các hành vi phổ biến của thú cưng, ý nghĩa của chúng và cách phản ứng phù hợp để giúp thú cưng cảm thấy an toàn và được yêu thương...'),
(1, 'Hướng Dẫn Chọn Cát Vệ Sinh Cho Mèo', 'Cách chọn loại cát vệ sinh phù hợp nhất cho mèo của bạn', 'https://file.hstatic.net/
200000264739/file/banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'Chọn cát vệ sinh phù hợp là một trong những yếu tố quan trọng nhất khi nuôi mèo. Bài viết này sẽ hướng dẫn bạn cách chọn loại cát vệ sinh tốt nhất, từ cát bentonite đến cát silica, và những lưu ý quan trọng để đảm bảo sức khỏe cho mèo...'),
(1, 'Dinh Dưỡng Cho Mèo Con', 'Những điều cần biết về dinh dưỡng cho mèo con từ 0-12 tháng tuổi', 'https://file.hstatic.net/
200000264739/file/banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'Mèo con có nhu cầu dinh dưỡng đặc biệt khác với mèo trưởng thành. Bài viết này sẽ giúp bạn hiểu rõ về nhu cầu dinh dưỡng của mèo con, cách chọn thức ăn phù hợp và lịch cho ăn hợp lý để mèo con phát triển khỏe mạnh...');

-- Insert article info
INSERT INTO article_info (article_id, author, published_date) VALUES
(1, 'Bác sĩ Nguyễn Minh Tuấn', '2024-01-15'),
(2, 'Chuyên gia Nguyễn Thị Lan', '2024-01-20'),
(3, 'Bác sĩ Trần Văn Hùng', '2024-01-25'),
(4, 'Chuyên gia Phạm Thị Mai', '2024-02-01'),
(5, 'Bác sĩ Lê Thị Hoa', '2024-02-05');

-- Insert sample banners
INSERT INTO banners (banner_title, banner_slug, banner_description, banner_image, banner_link, banner_position, banner_order, banner_active, banner_start_date, banner_end_date) VALUES

('Sản Phẩm Mới', 'san-pham-moi-banner', 'Khám phá những sản phẩm thú cưng và phụ kiện mới nhất', 'https://file.hstatic.net/200000264739/file/kc-website-banner-ol-231.3_62a4f9865a1645d8ae2bdb2f37607908.jpg', '/listing?sort=created_at&order=DESC', 'top', 2, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Bộ Sưu Tập Đồ Chơi Mèo 2', 'bo-suu-tap-do-choi-meo-2', 'Đồ chơi vui nhộn và tương tác cho những người bạn mèo của bạn', 'https://paddy.vn/cdn/shop/files/banner_web_1880_x_720_px_d0cd69bd-82c2-4d89-ba1f-8fd08f172cc9.png?v=1759654397&width=1880', '/listing?category=do-choi-meo', 'top', 2, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Thức Ăn Chó Cao Cấp 1', 'thuc-an-cho-cao-cap-banner-1', 'Dinh dưỡng chất lượng cao cho những chú chó yêu quý của bạn', 'https://paddy.vn/cdn/shop/files/paddy-natural-core_1880_x_720_px.png?v=1748848766&width=1880', '/listing?category=thuc-an-cho', 'top', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Khuyến Mãi Mùa Hè 2024', 'khuyen-mai-mua-he-2024', 'Giảm giá lên đến 50% cho tất cả sản phẩm thú cưng mùa hè này!', 'https://thumbs.dreamstime.com/b/animal-pet-toy-store-interior-cartoon-background-supermarket-indoor-cat-dog-care-accessory-to-buy-domestic-canine-cage-282320011.jpg?w=1400', '/listing?category=summer-sale', 'top', 1, true, '2024-06-01 00:00:00', '2028-08-31 23:59:59'),

('Thức Ăn Chó Cao Cấp', 'thuc-an-cho-cao-cap-banner', 'Dinh dưỡng chất lượng cao cho những chú chó yêu quý của bạn', 'https://paddy.vn/cdn/shop/files/paddy-natural-core_1880_x_720_px.png?v=1748848766&width=1880', '/listing?category=thuc-an-cho', 'middle', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Bộ Sưu Tập Đồ Chơi Mèo', 'bo-suu-tap-do-choi-meo', 'Đồ chơi vui nhộn và tương tác cho những người bạn mèo của bạn', 'https://paddy.vn/cdn/shop/files/banner_web_1880_x_720_px_d0cd69bd-82c2-4d89-ba1f-8fd08f172cc9.png?v=1759654397&width=1880', '/listing?category=do-choi-meo', 'middle', 2, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Miễn Phí Vận Chuyển', 'mien-phi-van-chuyen', 'Miễn phí vận chuyển cho đơn hàng trên 599K', 'https://thumbs.dreamstime.com/b/animal-pet-toy-store-interior-cartoon-background-supermarket-indoor-cat-dog-care-accessory-to-buy-domestic-canine-cage-282320011.jpg?w=1400', '/listing?category=thuc-an-cho', 'bottom', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Thức Ăn Mèo Royal Canin', 'thuc-an-meo-royal-canin', 'Dinh dưỡng chuyên biệt cho mèo từ Royal Canin', 'https://paddy.vn/cdn/shop/files/banner_web_1880_x_720_px.png?v=1757578414&width=1880', '/listing?brand=royal-canin', 'sidebar', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Miễn Phí Vận Chuyển 1', 'mien-phi-van-chuyen-1', 'Miễn phí vận chuyển cho đơn hàng trên 599K', 'https://file.hstatic.net/200000264739/file/kc-website-banner-ol-231.3_62a4f9865a1645d8ae2bdb2f37607908.jpg', '/listing?category=thuc-an-cho', 'bottom', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Thức Ăn Mèo Royal Canin 1', 'thuc-an-meo-royal-canin-1', 'Dinh dưỡng chuyên biệt cho mèo từ Royal Canin', 'https://file.hstatic.net/200000264739/file/kc-website-banner-ol-231.3_62a4f9865a1645d8ae2bdb2f37607908.jpg', '/listing?brand=royal-canin', 'sidebar', 1, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59'),
('Pate Mèo NEKKO', 'pate-meo-nekko', 'Pate mèo cao cấp với hương vị tự nhiên', 'https://thumbs.dreamstime.com/b/animal-pet-toy-store-interior-cartoon-background-supermarket-indoor-cat-dog-care-accessory-to-buy-domestic-canine-cage-282320011.jpg?w=1400', '/listing?brand=nekko', 'sidebar', 2, true, '2024-01-01 00:00:00', '2028-12-31 23:59:59');

-- Insert sample promotions
INSERT INTO promotions (promotion_title, promotion_slug, promotion_description, promotion_image, promotion_type, promotion_value, promotion_min_amount, promotion_max_discount, promotion_code, promotion_usage_limit, promotion_used_count, promotion_start_date, promotion_end_date, promotion_active) VALUES
('Khuyến Mãi Mùa Hè 20%', 'khuyen-mai-mua-he-20', 'Giảm 20% cho tất cả sản phẩm thú cưng mùa hè này', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'percentage', 20.00, 100000, 50000, 'SUMMER20', 100, 25, '2024-06-01 00:00:00', '2024-08-31 23:59:59', true),
('Giảm Giá Khách Hàng Mới', 'giam-gia-khach-hang-moi', 'Giảm giá chào mừng cho khách hàng mới', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'percentage', 15, 50000, 25000, 'WELCOME15', 50, 12, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('Miễn Phí Vận Chuyển Cuối Tuần', 'mien-phi-van-chuyen-cuoi-tuan', 'Miễn phí vận chuyển cho tất cả đơn hàng cuối tuần này', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'free_shipping', 0, 0, NULL, 'FREESHIP', 200, 45, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('Mua 2 Tặng 1', 'mua-2-tang-1', 'Mua 2 sản phẩm và được tặng 1 sản phẩm miễn phí', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'buy_x_get_y', 0, 100000, NULL, 'BUY2GET1', 75, 18, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('Khuyến Mãi Thức Ăn Cao Cấp', 'khuyen-mai-thuc-an-cao-cap', 'Giảm giá đặc biệt cho các thương hiệu thức ăn thú cưng cao cấp', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'fixed', 10000, 75000, NULL, 'PREMIUM10', 150, 32, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('Khuyến Mãi Lễ Tết', 'khuyen-mai-le-tet', 'Khuyến mãi đặc biệt lễ tết cho những người yêu thú cưng', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'percentage', 25, 150000, 75000, 'HOLIDAY25', 50, 8, '2024-12-01 00:00:00', '2024-12-31 23:59:59', false),
('Giảm Giá Pate Mèo', 'giam-gia-pate-meo', 'Giảm giá đặc biệt cho các sản phẩm pate mèo NEKKO', 'https://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'percentage', 10, 200000, 30000, 'NEKKO10', 100, 15, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('Khuyến Mãi Royal Canin', 'khuyen-mai-royal-canin', 'Giảm giá cho các sản phẩm Royal Canin', 'hhttps://file.hstatic.net/200000264739/file/
banner-desktop-kitcat_83a1d61bf9ce4bdc8cda190905d10948.jpg', 'fixed', 50000, 500000, NULL, 'ROYAL50', 50, 8, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true);
