import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormTextarea,
  AdminPageHeader,
  AdminTable,
  AdminLoading,
  AddButton,
  ActionButtons,
  SaveButton,
  CancelButton,
} from '../../components/Admin';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBrands();
      if (response?.data) {
        setBrands(response.data.brands || []);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
      toast.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      return;
    }

    try {
      await adminAPI.deleteBrand(id);
      toast.success('Đã xóa thương hiệu');
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Không thể xóa thương hiệu');
    }
  };

  const handleEdit = brand => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await adminAPI.updateBrand(editingBrand.id, formData);
        toast.success('Cập nhật thương hiệu thành công!');
      } else {
        await adminAPI.createBrand(formData);
        toast.success('Tạo thương hiệu thành công!');
      }
      setShowModal(false);
      setEditingBrand(null);
      setFormData({
        name: '',
        description: '',
      });
      loadBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Thương hiệu">
        <AddButton
          onClick={() => {
            setEditingBrand(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Thêm thương hiệu
        </AddButton>
      </AdminPageHeader>

      <AdminTable
        headers={['ID', 'Tên thương hiệu', 'Mô tả', 'Ngày tạo', 'Thao tác']}
        data={brands}
        emptyMessage="Không có thương hiệu nào"
      >
        {brands.map(brand => (
          <tr key={brand.id}>
            <td>
              <span className="badge ">#{brand.id}</span>
            </td>
            <td>
              <strong className="text-dark">{brand.name}</strong>
            </td>
            <td>
              <span className="text-muted">
                {brand.description?.substring(0, 100)}
                {brand.description?.length > 100 && '...'}
              </span>
            </td>
            <td>
              <small className="text-muted">
                {new Date(brand.created_at).toLocaleDateString('vi-VN')}
              </small>
            </td>
            <td>
              <ActionButtons
                onEdit={() => handleEdit(brand)}
                onDelete={() => handleDelete(brand.id)}
                showView={false}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        size="lg"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>
              {editingBrand ? 'Cập nhật' : 'Tạo mới'}
            </SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <FormGroup label="Tên thương hiệu" required>
                <FormInput
                  value={formData.name}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Nhập tên thương hiệu"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup label="Mô tả">
                <FormTextarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Mô tả về thương hiệu"
                />
              </FormGroup>
            </div>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default AdminBrands;
