import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { promotionsAPI } from '../../../api';

const PromotionBanner = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await promotionsAPI.getActivePromotions(3);
        setPromotions(response.data.promotions);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        // Không hiển thị error cho promotion banner
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % promotions.length);
      }, 5000); // Thay đổi mỗi 5 giây

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  if (loading || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];

  const getPromotionText = promotion => {
    switch (promotion.promotion_type) {
      case 'percentage':
        return `Giảm ${promotion.promotion_value}%`;
      case 'fixed':
        return `Giảm ${promotion.promotion_value.toLocaleString('vi-VN')}đ`;
      case 'free_shipping':
        return 'Miễn phí vận chuyển';
      case 'buy_x_get_y':
        return 'Mua 2 tặng 1';
      default:
        return 'Khuyến mãi đặc biệt';
    }
  };

  const copyPromotionCode = code => {
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã khuyến mãi!');
  };

  return (
    <div className="promotion-banner bg-primary text-white py-2">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 text-center">
            <div className="d-flex justify-content-center align-items-center">
              <span className="me-3">🎉</span>
              <strong className="me-2">
                {currentPromotion.promotion_title}
              </strong>
              <span className="badge bg-warning text-dark me-2">
                {getPromotionText(currentPromotion)}
              </span>
              {currentPromotion.promotion_code && (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() =>
                    copyPromotionCode(currentPromotion.promotion_code)
                  }
                >
                  📋 {currentPromotion.promotion_code}
                </button>
              )}
              {promotions.length > 1 && (
                <div className="ms-3">
                  {promotions.map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm ${index === currentIndex ? 'btn-light' : 'btn-outline-light'}`}
                      onClick={() => setCurrentIndex(index)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;
