import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api';
import { toast } from 'react-toastify';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    promotion_title: '',
    promotion_slug: '',
    promotion_description: '',
    promotion_image: '',
    promotion_type: 'percentage',
    promotion_value: 0,
    promotion_min_amount: 0,
    promotion_max_discount: null,
    promotion_code: '',
    promotion_usage_limit: null,
    promotion_start_date: '',
    promotion_end_date: '',
    promotion_active: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPromotions({ limit: 50 });
      setPromotions(response.data.promotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingPromotion) {
        await adminAPI.updatePromotion(editingPromotion.id, formData);
        toast.success('Cập nhật khuyến mãi thành công!');
      } else {
        await adminAPI.createPromotion(formData);
        toast.success('Tạo khuyến mãi thành công!');
      }
      setShowModal(false);
      setEditingPromotion(null);
      resetForm();
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      promotion_title: '',
      promotion_slug: '',
      promotion_description: '',
      promotion_image: '',
      promotion_type: 'percentage',
      promotion_value: 0,
      promotion_min_amount: 0,
      promotion_max_discount: null,
      promotion_code: '',
      promotion_usage_limit: null,
      promotion_start_date: '',
      promotion_end_date: '',
      promotion_active: true,
    });
  };

  const handleEdit = promotion => {
    setEditingPromotion(promotion);
    setFormData({
      promotion_title: promotion.promotion_title,
      promotion_slug: promotion.promotion_slug,
      promotion_description: promotion.promotion_description,
      promotion_image: promotion.promotion_image,
      promotion_type: promotion.promotion_type,
      promotion_value: promotion.promotion_value,
      promotion_min_amount: promotion.promotion_min_amount,
      promotion_max_discount: promotion.promotion_max_discount,
      promotion_code: promotion.promotion_code,
      promotion_usage_limit: promotion.promotion_usage_limit,
      promotion_start_date: promotion.promotion_start_date
        ? new Date(promotion.promotion_start_date).toISOString().slice(0, 16)
        : '',
      promotion_end_date: promotion.promotion_end_date
        ? new Date(promotion.promotion_end_date).toISOString().slice(0, 16)
        : '',
      promotion_active: promotion.promotion_active,
    });
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        await adminAPI.deletePromotion(id);
        toast.success('Xóa khuyến mãi thành công!');
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Không thể xóa khuyến mãi');
      }
    }
  };

  const handleToggleStatus = async id => {
    try {
      await adminAPI.togglePromotionStatus(id);
      toast.success('Cập nhật trạng thái khuyến mãi thành công!');
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast.error('Không thể cập nhật trạng thái khuyến mãi');
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '300px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="promotion-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý Khuyến Mãi</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingPromotion(null);
            resetForm();
            setShowModal(true);
          }}
        >
          + Thêm Khuyến Mãi
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên khuyến mãi</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Mã</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promotion => (
              <tr key={promotion.id}>
                <td>
                  {promotion.promotion_image ? (
                    <img
                      src={promotion.promotion_image}
                      alt={promotion.promotion_title}
                      style={{
                        width: '60px',
                        height: '40px',
                        objectFit: 'cover',
                      }}
                      onError={e => {
                        e.target.src =
                          'https://via.placeholder.com/60x40?text=Image';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '60px',
                        height: '40px',
                        backgroundColor: '#f8f9fa',
                      }}
                    ></div>
                  )}
                </td>
                <td>{promotion.promotion_title}</td>
                <td>
                  <span
                    className={`badge ${
                      promotion.promotion_type === 'percentage'
                        ? 'bg-danger'
                        : promotion.promotion_type === 'fixed'
                          ? 'bg-success'
                          : promotion.promotion_type === 'free_shipping'
                            ? 'bg-info'
                            : 'bg-warning'
                    }`}
                  >
                    {promotion.promotion_type}
                  </span>
                </td>
                <td>
                  {promotion.promotion_type === 'percentage'
                    ? `${promotion.promotion_value}%`
                    : promotion.promotion_type === 'fixed'
                      ? `${promotion.promotion_value.toLocaleString('vi-VN')}đ`
                      : promotion.promotion_type === 'free_shipping'
                        ? 'Miễn phí vận chuyển'
                        : 'Đặc biệt'}
                </td>
                <td>
                  {promotion.promotion_code ? (
                    <code>{promotion.promotion_code}</code>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${promotion.promotion_active ? 'bg-success' : 'bg-secondary'}`}
                  >
                    {promotion.promotion_active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(promotion)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleToggleStatus(promotion.id)}
                    >
                      {promotion.promotion_active ? 'Tạm dừng' : 'Kích hoạt'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPromotion
                    ? 'Chỉnh sửa Khuyến Mãi'
                    : 'Thêm Khuyến Mãi mới'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên khuyến mãi *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.promotion_title}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Slug *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.promotion_slug}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_slug: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Mô tả</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.promotion_description}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">URL hình ảnh</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.promotion_image}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_image: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Loại khuyến mãi *</label>
                      <select
                        className="form-select"
                        value={formData.promotion_type}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_type: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="percentage">Phần trăm</option>
                        <option value="fixed">Số tiền cố định</option>
                        <option value="free_shipping">
                          Miễn phí vận chuyển
                        </option>
                        <option value="buy_x_get_y">Mua X tặng Y</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Giá trị *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.promotion_value}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_value: parseFloat(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Đơn tối thiểu</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.promotion_min_amount}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_min_amount: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Giảm tối đa</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.promotion_max_discount}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_max_discount: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Mã khuyến mãi</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.promotion_code}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Giới hạn sử dụng</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.promotion_usage_limit}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_usage_limit: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày bắt đầu *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.promotion_start_date}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_start_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày kết thúc *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.promotion_end_date}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_end_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Trạng thái</label>
                      <select
                        className="form-select"
                        value={formData.promotion_active}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            promotion_active: e.target.value === 'true',
                          })
                        }
                      >
                        <option value={true}>Hoạt động</option>
                        <option value={false}>Tạm dừng</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default PromotionManagement;
