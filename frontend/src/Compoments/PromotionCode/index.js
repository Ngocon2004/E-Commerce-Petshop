import React, { useState } from 'react';
import { promotionsAPI } from '../../api';
import { toast } from 'react-toastify';

const PromotionCode = ({ onPromotionApplied }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState(null);

  const handleValidateCode = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    try {
      setLoading(true);
      const response = await promotionsAPI.validatePromotion(code.trim());
      setPromotion(response.data.promotion);
      toast.success('Mã khuyến mãi hợp lệ!');

      if (onPromotionApplied) {
        onPromotionApplied(response.data.promotion);
      }
    } catch (error) {
      console.error('Error validating promotion:', error);
      setPromotion(null);
      toast.error(
        error.response?.data?.message || 'Mã khuyến mãi không hợp lệ'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearPromotion = () => {
    setPromotion(null);
    setCode('');
    if (onPromotionApplied) {
      onPromotionApplied(null);
    }
  };

  return (
    <div className="promotion-code-widget">
      <h5 className="mb-3">🎁 Mã Khuyến Mãi</h5>

      {!promotion ? (
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập mã khuyến mãi"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleValidateCode()}
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleValidateCode}
            disabled={loading}
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
              <strong>✅ {promotion.promotion_title}</strong>
              <br />
              <small className="text-muted">
                {promotion.promotion_type === 'percentage'
                  ? `Giảm ${promotion.promotion_value}%`
                  : promotion.promotion_type === 'fixed'
                    ? `Giảm ${promotion.promotion_value.toLocaleString('vi-VN')}đ`
                    : promotion.promotion_type === 'free_shipping'
                      ? 'Miễn phí vận chuyển'
                      : 'Khuyến mãi đặc biệt'}
              </small>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleClearPromotion}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionCode;
