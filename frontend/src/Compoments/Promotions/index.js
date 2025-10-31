import React, { useState, useEffect } from 'react';
import { promotionsAPI } from '../../api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/apiHelpers';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy promotions đang hoạt động
        const response = await promotionsAPI.getActivePromotions(6);
        setPromotions(response.data.promotions);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError(err);
        toast.error('Không thể tải khuyến mãi');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const getPromotionBadge = type => {
    const badges = {
      percentage: 'badge bg-danger',
      fixed: 'badge bg-success',
      free_shipping: 'badge bg-info',
      buy_x_get_y: 'badge bg-warning',
    };
    return badges[type] || 'badge bg-secondary';
  };

  const getPromotionText = promotion => {
    switch (promotion.promotion_type) {
      case 'percentage':
        return `Giảm ${promotion.promotion_value}%`;
      case 'fixed':
        return `Giảm ${formatCurrency(promotion.promotion_value)}`;
      case 'free_shipping':
        return 'Miễn phí vận chuyển';
      case 'buy_x_get_y':
        return 'Mua 2 tặng 1';
      default:
        return 'Khuyến mãi';
    }
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '200px' }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || promotions.length === 0) {
    return (
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info text-center">
              <h5>Không có khuyến mãi nào</h5>
              <p className="mb-0">Hãy quay lại sau để xem các ưu đãi mới</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <h3 className="text-center mb-4">🎉 Khuyến Mãi Đặc Biệt</h3>
        </div>
      </div>

      <div className="row">
        {promotions.map(promotion => (
          <div key={promotion.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              {promotion.promotion_image && (
                <div className="position-relative">
                  <img
                    src={promotion.promotion_image}
                    className="card-img-top"
                    alt={promotion.promotion_title}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={e => {
                      e.target.src =
                        'https://via.placeholder.com/400x200?text=Promotion+Image';
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span
                      className={getPromotionBadge(promotion.promotion_type)}
                    >
                      {getPromotionText(promotion)}
                    </span>
                  </div>
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{promotion.promotion_title}</h5>
                <p className="card-text text-muted flex-grow-1">
                  {promotion.promotion_description}
                </p>

                <div className="mt-auto">
                  {promotion.promotion_code && (
                    <div className="mb-2">
                      <small className="text-muted">Mã khuyến mãi:</small>
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control"
                          value={promotion.promotion_code}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              promotion.promotion_code
                            );
                            toast.success('Đã sao chép mã khuyến mãi!');
                          }}
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}

                  {promotion.promotion_min_amount > 0 && (
                    <small className="text-muted d-block">
                      Đơn tối thiểu:{' '}
                      {formatCurrency(promotion.promotion_min_amount)}
                    </small>
                  )}

                  {promotion.promotion_usage_limit && (
                    <small className="text-muted d-block">
                      Còn lại:{' '}
                      {promotion.promotion_usage_limit -
                        promotion.promotion_used_count}{' '}
                      lượt
                    </small>
                  )}

                  <div className="mt-2">
                    <small className="text-muted">
                      Áp dụng đến:{' '}
                      {new Date(
                        promotion.promotion_end_date
                      ).toLocaleDateString('vi-VN')}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
