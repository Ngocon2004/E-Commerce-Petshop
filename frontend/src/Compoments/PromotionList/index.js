import React, { useState, useEffect } from 'react';
import { promotionsAPI } from '../../api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/apiHelpers';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, expired
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await promotionsAPI.getPromotions({
          active:
            filter === 'active'
              ? true
              : filter === 'expired'
                ? false
                : undefined,
          search: searchTerm || undefined,
          limit: 12,
        });
        setPromotions(response.data.promotions);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError(err);
        toast.error('Không thể tải danh sách khuyến mãi');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [filter, searchTerm]);

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

  const isExpired = endDate => {
    return new Date(endDate) < new Date();
  };

  const copyPromotionCode = code => {
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã khuyến mãi!');
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '300px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">🎉 Tất Cả Khuyến Mãi</h2>

          {/* Filter and Search */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('active')}
                >
                  Đang áp dụng
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'expired' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('expired')}
                >
                  Đã hết hạn
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm khuyến mãi..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="alert alert-danger text-center">
              <h5>Không thể tải danh sách khuyến mãi</h5>
              <p className="mb-0">Vui lòng thử lại sau</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="alert alert-info text-center">
              <h5>Không có khuyến mãi nào</h5>
              <p className="mb-0">Hãy quay lại sau để xem các ưu đãi mới</p>
            </div>
          ) : (
            <div className="row">
              {promotions.map(promotion => (
                <div key={promotion.id} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className={`card h-100 shadow-sm ${isExpired(promotion.promotion_end_date) ? 'opacity-50' : ''}`}
                  >
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
                            className={getPromotionBadge(
                              promotion.promotion_type
                            )}
                          >
                            {getPromotionText(promotion)}
                          </span>
                        </div>
                        {isExpired(promotion.promotion_end_date) && (
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-secondary">Hết hạn</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        {promotion.promotion_title}
                      </h5>
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
                                onClick={() =>
                                  copyPromotionCode(promotion.promotion_code)
                                }
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionList;
