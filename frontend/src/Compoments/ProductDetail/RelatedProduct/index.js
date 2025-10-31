import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItems from '../../ProductItems';
import Button from '@mui/material/Button';
import { FaArrowRight } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../../api/products';
import { CircularProgress } from '@mui/material';

const RelatedProduct = ({ title, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (title === 'Sản phẩm bán chạy') {
          response = await productsAPI.getBestSelling(10);
        } else if (categoryId) {
          // Get products from same category
          response = await productsAPI.getProducts({
            category_id: categoryId,
            limit: 10,
          });
        } else {
          // Get featured products
          response = await productsAPI.getFeatured(10);
        }

        if (response && response.success) {
          setProducts(response.data.products || response.data);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [title, categoryId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="info w-75">
          <h3 className="mb-0 hd">{title}</h3>
        </div>
      </div>

      <div className="product_row w-100 mt-4">
        {products.length > 0 ? (
          <Swiper
            slidesPerView={5}
            spaceBetween={0}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {products.map(product => (
              <SwiperSlide key={product.id}>
                <ProductItems product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-4">
            <p>Không có sản phẩm liên quan</p>
          </div>
        )}
      </div>

      <div className="section"></div>
    </>
  );
};
export default RelatedProduct;
