import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../../api';
import { toast } from 'react-toastify';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  AdminTable,
  AddButton,
  ActionButtons,
  SaveButton,
  CancelButton,
  AdminLoading,
} from '../../../components/Admin';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    banner_title: '',
    banner_slug: '',
    banner_description: '',
    banner_image: '',
    banner_link: '',
    banner_position: 'top',
    banner_order: 0,
    banner_active: true,
    banner_start_date: '',
    banner_end_date: '',
  });

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBanners({ limit: 50 });
      setBanners(response.data.banners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Không thể tải danh sách banners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await adminAPI.updateBanner(editingBanner.id, formData);
        toast.success('Cập nhật banner thành công!');
      } else {
        await adminAPI.createBanner(formData);
        toast.success('Tạo banner thành công!');
      }
      setShowModal(false);
      setEditingBanner(null);
      setFormData({
        banner_title: '',
        banner_slug: '',
        banner_description: '',
        banner_image: '',
        banner_link: '',
        banner_position: 'top',
        banner_order: 0,
        banner_active: true,
        banner_start_date: '',
        banner_end_date: '',
      });
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = banner => {
    setEditingBanner(banner);
    setFormData({
      banner_title: banner.banner_title,
      banner_slug: banner.banner_slug,
      banner_description: banner.banner_description,
      banner_image: banner.banner_image,
      banner_link: banner.banner_link,
      banner_position: banner.banner_position,
      banner_order: banner.banner_order,
      banner_active: banner.banner_active,
      banner_start_date: banner.banner_start_date
        ? new Date(banner.banner_start_date).toISOString().slice(0, 16)
        : '',
      banner_end_date: banner.banner_end_date
        ? new Date(banner.banner_end_date).toISOString().slice(0, 16)
        : '',
    });
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await adminAPI.deleteBanner(id);
        toast.success('Xóa banner thành công!');
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Không thể xóa banner');
      }
    }
  };

  const handleToggleStatus = async id => {
    try {
      await adminAPI.toggleBannerStatus(id);
      toast.success('Cập nhật trạng thái banner thành công!');
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Không thể cập nhật trạng thái banner');
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Danh sách Banners</h4>
        <AddButton
          onClick={() => {
            setEditingBanner(null);
            setFormData({
              banner_title: '',
              banner_slug: '',
              banner_description: '',
              banner_image: '',
              banner_link: '',
              banner_position: 'top',
              banner_order: 0,
              banner_active: true,
              banner_start_date: '',
              banner_end_date: '',
            });
            setShowModal(true);
          }}
        >
          Thêm Banner
        </AddButton>
      </div>

      <AdminTable
        headers={[
          'Hình ảnh',
          'Tiêu đề',
          'Vị trí',
          'Thứ tự',
          'Trạng thái',
          'Thao tác',
        ]}
        data={banners}
        emptyMessage="Không có banner nào"
      >
        {banners.map(banner => (
          <tr key={banner.id}>
            <td>
              <img
                src={banner.banner_image}
                alt={banner.banner_title}
                className="img-thumbnail"
                style={{
                  width: '60px',
                  height: '40px',
                  objectFit: 'cover',
                }}
                onError={e => {
                  e.target.src = 'https://via.placeholder.com/60x40?text=Image';
                }}
              />
            </td>
            <td>
              <div>
                <strong className="text-dark">{banner.banner_title}</strong>
                <br />
                <small className="text-muted">{banner.banner_slug}</small>
              </div>
            </td>
            <td>
              <span
                className={`badge ${
                  banner.banner_position === 'top'
                    ? 'bg-primary'
                    : banner.banner_position === 'middle'
                      ? 'bg-success'
                      : banner.banner_position === 'bottom'
                        ? 'bg-warning'
                        : 'bg-info'
                }`}
              >
                {banner.banner_position}
              </span>
            </td>
            <td>
              <span className="badge bg-secondary">{banner.banner_order}</span>
            </td>
            <td>
              <span
                className={`badge ${banner.banner_active ? 'bg-success' : 'bg-danger text-white'}`}
              >
                {banner.banner_active ? 'Hoạt động' : 'Tạm dừng'}
              </span>
            </td>
            <td>
              <div className="d-flex gap-2">
                <ActionButtons
                  onEdit={() => handleEdit(banner)}
                  onDelete={() => handleDelete(banner.id)}
                  showView={false}
                />
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => handleToggleStatus(banner.id)}
                  title={banner.banner_active ? 'Tạm dừng' : 'Kích hoạt'}
                >
                  {banner.banner_active ? 'Tạm dừng' : 'Kích hoạt'}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
        size="lg"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>
              {editingBanner ? 'Cập nhật' : 'Tạo mới'}
            </SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <FormGroup label="Tiêu đề" required>
                <FormInput
                  value={formData.banner_title}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      banner_title: e.target.value,
                    })
                  }
                  placeholder="Nhập tiêu đề banner"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Slug" required>
                <FormInput
                  value={formData.banner_slug}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      banner_slug: e.target.value,
                    })
                  }
                  placeholder="banner-slug"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup label="Mô tả">
                <FormTextarea
                  value={formData.banner_description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      banner_description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Mô tả banner"
                />
              </FormGroup>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">URL hình ảnh *</label>
              <input
                type="url"
                className="form-control"
                value={formData.banner_image}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_image: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Link banner</label>
              <input
                type="url"
                className="form-control"
                value={formData.banner_link}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_link: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Vị trí *</label>
              <select
                className="form-select form-control"
                value={formData.banner_position}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_position: e.target.value,
                  })
                }
                required
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Thứ tự</label>
              <input
                type="number"
                className="form-control"
                value={formData.banner_order}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_order: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-select form-control"
                value={formData.banner_active}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_active: e.target.value === 'true',
                  })
                }
              >
                <option value={true}>Hoạt động</option>
                <option value={false}>Tạm dừng</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.banner_start_date}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_start_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Ngày kết thúc</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.banner_end_date}
                onChange={e =>
                  setFormData({
                    ...formData,
                    banner_end_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default BannerManagement;
