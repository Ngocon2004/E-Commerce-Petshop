import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormSelect,
  FormImagePreview,
  AdminPageHeader,
  AdminGrid,
  AdminLoading,
  AddButton,
  ActionButtons,
  SaveButton,
  CancelButton,
} from '../../components/Admin';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_slug: '',
    category_type: '',
    category_img: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories();
      if (response?.data) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      return;
    }

    try {
      await adminAPI.deleteCategory(id);
      toast.success('Đã xóa danh mục');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Không thể xóa danh mục');
    }
  };

  const handleEdit = category => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name || '',
      category_slug: category.category_slug || '',
      category_type: category.category_type || '',
      category_img: category.category_img || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (
        !formData.category_name ||
        !formData.category_slug ||
        !formData.category_type ||
        !formData.category_img
      ) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (editingCategory) {
        await adminAPI.updateCategory(editingCategory.id, formData);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await adminAPI.createCategory(formData);
        toast.success('Tạo danh mục thành công!');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({
        category_name: '',
        category_slug: '',
        category_type: '',
        category_img: '',
      });
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      category_name: '',
      category_slug: '',
      category_type: '',
      category_img: '',
    });
  };

  if (loading) {
    return <AdminLoading />;
  }

  const categoryTypeOptions = [
    { value: 'food', label: 'Thức ăn' },
    { value: 'toys', label: 'Đồ chơi' },
    { value: 'accessories', label: 'Phụ kiện' },
    { value: 'health', label: 'Sức khỏe' },
    { value: 'grooming', label: 'Chăm sóc' },
    { value: 'housing', label: 'Chỗ ở' },
  ];

  return (
    <div>
      <AdminPageHeader title="Danh mục">
        <AddButton
          onClick={() => {
            setEditingCategory(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Thêm danh mục
        </AddButton>
      </AdminPageHeader>

      <AdminGrid cols={3}>
        {categories.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <p className="mb-0">Không có danh mục nào</p>
            </div>
          </div>
        ) : (
          categories.map(category => (
            <div key={category.id} className="card shadow-sm h-100 border-0">
              {category.category_img && (
                <img
                  src={category.category_img}
                  className="card-img-top"
                  alt={category.category_name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-dark">
                  {category.category_name}
                </h5>
                <p className="text-muted mb-3">
                  {categoryTypeOptions.find(
                    opt => opt.value === category.category_type
                  )?.label || category.category_type}
                </p>
                <div className="mt-auto">
                  <ActionButtons
                    onEdit={() => handleEdit(category)}
                    onDelete={() => handleDelete(category.id)}
                    showView={false}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </AdminGrid>

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        size="lg"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>
              {editingCategory ? 'Cập nhật' : 'Tạo mới'}
            </SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <FormGroup label="Tên danh mục" required>
                <FormInput
                  value={formData.category_name}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category_name: e.target.value,
                    })
                  }
                  placeholder="Nhập tên danh mục"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Slug" required>
                <FormInput
                  value={formData.category_slug}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category_slug: e.target.value,
                    })
                  }
                  placeholder="category-slug"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Loại danh mục" required>
                <FormSelect
                  value={formData.category_type}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category_type: e.target.value,
                    })
                  }
                  options={categoryTypeOptions}
                  placeholder="Chọn loại danh mục"
                  disabled={editingCategory}
                  className="form-control"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="URL hình ảnh">
                <FormInput
                  type="url"
                  value={formData.category_img}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category_img: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormImagePreview src={formData.category_img} alt="Preview" />
            </div>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default AdminCategories;
