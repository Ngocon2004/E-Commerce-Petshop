import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormSelect,
  SaveButton,
  CancelButton,
} from './index';

const ProductVariants = ({
  productId,
  variants = [],
  onAddVariant,
  onUpdateVariant,
  onDeleteVariant,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    variant_name: '',
    variant_slug: '',
    price: '',
    discount_amount: '',
    is_available: true,
    in_stock: '',
  });

  const handleAdd = () => {
    setEditingVariant(null);
    setFormData({
      variant_name: '',
      variant_slug: '',
      price: '',
      discount_amount: '',
      is_available: true,
      in_stock: '',
    });
    setShowModal(true);
  };

  const handleEdit = variant => {
    setEditingVariant(variant);
    setFormData({
      variant_name: variant.variant_name || '',
      variant_slug: variant.variant_slug || '',
      price: variant.price || '',
      discount_amount: variant.discount_amount || '',
      is_available: variant.is_available !== false,
      in_stock: variant.in_stock || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.variant_name || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate discount amount (0-100%)
    const discountAmount = parseFloat(formData.discount_amount);
    if (
      formData.discount_amount &&
      (isNaN(discountAmount) || discountAmount < 0 || discountAmount > 100)
    ) {
      alert('Phần trăm giảm giá phải từ 0 đến 100%');
      return;
    }

    try {
      if (editingVariant) {
        // If productId is 'new', it means we're in form mode
        if (productId === 'new') {
          onUpdateVariant(editingVariant.id, formData);
        } else {
          await onUpdateVariant(editingVariant.id, formData);
        }
      } else {
        // If productId is 'new', it means we're in form mode
        if (productId === 'new') {
          onAddVariant(formData);
        } else {
          await onAddVariant(productId, formData);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const generateSlug = name => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleVariantNameChange = e => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      variant_name: name,
      variant_slug: editingVariant ? prev.variant_slug : generateSlug(name),
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Biến thể sản phẩm</h6>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
        >
          <FiPlus className="me-1" />
          Thêm biến thể
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="alert alert-info">
          Chưa có biến thể nào. Hãy thêm biến thể cho sản phẩm.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Tên biến thể</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {variants.map(variant => (
                <tr key={variant.id}>
                  <td>
                    <div>
                      <strong>{variant.variant_name}</strong>
                      <br />
                      <small className="text-muted">
                        {variant.variant_slug}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      {Number(variant.price).toLocaleString()}đ
                    </span>
                  </td>
                  <td>
                    {variant.discount_amount > 0 ? (
                      <span className="text-danger">
                        -{Number(variant.discount_amount)}%
                      </span>
                    ) : (
                      <span className="text-muted">Không</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${variant.in_stock > 0 ? 'bg-success' : 'bg-danger'}`}
                    >
                      {variant.in_stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${variant.is_available ? 'bg-success' : 'bg-secondary'}`}
                    >
                      {variant.is_available ? 'Có sẵn' : 'Không có sẵn'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(variant)}
                        title="Chỉnh sửa"
                      >
                        <FiEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (
                            window.confirm('Bạn có chắc muốn xóa biến thể này?')
                          ) {
                            onDeleteVariant(variant.id);
                          }
                        }}
                        title="Xóa"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingVariant ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
        size="lg"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>
              {editingVariant ? 'Cập nhật' : 'Tạo mới'}
            </SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <FormGroup label="Tên biến thể" required>
                <FormInput
                  value={formData.variant_name}
                  onChange={handleVariantNameChange}
                  placeholder="Ví dụ: Size M, Màu đỏ"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Slug" required>
                <FormInput
                  value={formData.variant_slug}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      variant_slug: e.target.value,
                    })
                  }
                  placeholder="size-m-mau-do"
                  disabled={!editingVariant}
                />
                {!editingVariant && (
                  <small className="text-muted">
                    Slug sẽ được tự động tạo từ tên biến thể
                  </small>
                )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Giá" required>
                <FormInput
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Giảm giá (%)">
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.discount_amount}
                  onChange={e => {
                    const value = e.target.value;
                    // Prevent input > 100
                    if (value && parseFloat(value) > 100) {
                      return;
                    }
                    setFormData({
                      ...formData,
                      discount_amount: value,
                    });
                  }}
                  placeholder="0"
                />
                <small className="text-muted">
                  Nhập phần trăm giảm giá (0-100%)
                </small>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Số lượng tồn kho">
                <FormInput
                  type="number"
                  value={formData.in_stock}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      in_stock: e.target.value,
                    })
                  }
                  placeholder="0"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Trạng thái">
                <FormSelect
                  value={formData.is_available}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      is_available: e.target.value === 'true',
                    })
                  }
                  options={[
                    { value: true, label: 'Có sẵn' },
                    { value: false, label: 'Không có sẵn' },
                  ]}
                />
              </FormGroup>
            </div>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default ProductVariants;
