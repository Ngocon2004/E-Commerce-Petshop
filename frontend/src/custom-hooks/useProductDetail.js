import { useState, useEffect } from 'react';
import { productsAPI } from '../api/products';

export const useProductDetail = productId => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    total_reviews: 0,
    average_rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await productsAPI.getProductById(productId);

        if (productResponse && productResponse.success) {
          setProduct(productResponse.data.product);
          setReviews(productResponse.data.reviews || []);
          setReviewStats(
            productResponse.data.review_stats || {
              total_reviews: 0,
              average_rating: 0,
            }
          );
        } else {
          setError('Không thể tải thông tin sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const refreshProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const productResponse = await productsAPI.getProductById(productId);

      if (productResponse && productResponse.success) {
        setProduct(productResponse.data.product);
        setReviews(productResponse.data.reviews || []);
        setReviewStats(
          productResponse.data.review_stats || {
            total_reviews: 0,
            average_rating: 0,
          }
        );
      }
    } catch (err) {
      console.error('Error refreshing product:', err);
      setError('Có lỗi xảy ra khi tải lại thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    reviews,
    reviewStats,
    loading,
    error,
    refreshProduct,
  };
};
