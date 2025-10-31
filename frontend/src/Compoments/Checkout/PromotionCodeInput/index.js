import React, { useState } from 'react';
import { promotionsAPI } from '../../../api';
import { toast } from 'react-toastify';

const PromotionCodeInput = ({
  onPromotionApplied,
  appliedPromotion,
  onRemovePromotion,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyPromotion = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    try {
      setLoading(true);
      const response = await promotionsAPI.validatePromotion(code.trim());
      const promotion = response.data.promotion;

      // Kiểm tra điều kiện áp dụng
      if (promotion.promotion_min_amount > 0) {
        toast.info(
          `Mã khuyến mãi yêu cầu đơn hàng tối thiểu ${promotion.promotion_min_amount.toLocaleString('vi-VN')}đ`
        );
      }

      if (onPromotionApplied) {
        onPromotionApplied(promotion);
      }

      toast.success('Áp dụng mã khuyến mãi thành công!');
      setCode('');
    } catch (error) {
      console.error('Error applying promotion:', error);
      toast.error(
        error.response?.data?.message || 'Mã khuyến mãi không hợp lệ'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromotion = () => {
    if (onRemovePromotion) {
      onRemovePromotion();
    }
    setCode('');
  };

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

  return (
    <div className="promotion-code-input">
      <h5 className="mb-3">🎁 Mã Khuyến Mãi</h5>

      {!appliedPromotion ? (
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập mã khuyến mãi"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleApplyPromotion()}
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleApplyPromotion}
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </span>
            ) : (
              'Áp dụng'
            )}
          </button>
        </div>
      ) : (
        <div className="alert alert-success">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>✅ {appliedPromotion.promotion_title}</strong>
              <br />
              <small className="text-muted">
                {getPromotionText(appliedPromotion)}
                {appliedPromotion.promotion_min_amount > 0 && (
                  <span className="d-block">
                    Đơn tối thiểu:{' '}
                    {appliedPromotion.promotion_min_amount.toLocaleString(
                      'vi-VN'
                    )}
                    đ
                  </span>
                )}
              </small>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemovePromotion}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionCodeInput;
