import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  SaveButton,
  CancelButton,
} from './index';

const ProductImages = ({
  productId,
  images = [],
  onAddImage,
  onDeleteImage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
  });

  const handleAdd = () => {
    setFormData({
      name: '',
      value: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.value) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.value)) {
      alert('Vui lòng nhập URL hợp lệ (bắt đầu bằng http:// hoặc https://)');
      return;
    }

    try {
      // If productId is 'new', it means we're in form mode
      if (productId === 'new') {
        onAddImage(formData);
      } else {
        await onAddImage(productId, formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleDelete = async imageId => {
    if (!window.confirm('Bạn có chắc muốn xóa hình ảnh này?')) {
      return;
    }
    try {
      // If productId is 'new', it means we're in form mode
      if (productId === 'new') {
        onDeleteImage(imageId);
      } else {
        await onDeleteImage(imageId);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Hình ảnh sản phẩm</h6>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
        >
          <FiPlus className="me-1" />
          Thêm hình ảnh
        </button>
      </div>

      {images.length === 0 ? (
        <div className="alert alert-info">
          Chưa có hình ảnh nào. Hãy thêm hình ảnh cho sản phẩm.
        </div>
      ) : (
        <div className="row">
          {images.map(image => (
            <div key={image.id} className="col-md-3 mb-3">
              <div className="card">
                <img
                  src={image.value}
                  alt={image.name}
                  className="card-img-top"
                  style={{
                    height: '150px',
                    objectFit: 'cover',
                  }}
                  onError={e => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate" title={image.name}>
                    {image.name}
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleDelete(image.id)}
                  >
                    <FiTrash2 className="me-1" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Thêm hình ảnh mới"
        size="md"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>Thêm hình ảnh</SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <FormGroup label="Tên hình ảnh" required>
            <FormInput
              value={formData.name}
              onChange={e =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Ví dụ: Hình chính, Hình phụ 1"
            />
          </FormGroup>
          <FormGroup label="URL hình ảnh" required>
            <FormInput
              type="url"
              value={formData.value}
              onChange={e =>
                setFormData({
                  ...formData,
                  value: e.target.value,
                })
              }
              placeholder="https://example.com/image.jpg"
              pattern="https?://.*"
              title="Vui lòng nhập URL hợp lệ (bắt đầu bằng http:// hoặc https://)"
            />
          </FormGroup>
          {formData.value && (
            <div className="mt-3">
              <label className="form-label">Xem trước:</label>
              <div>
                <img
                  src={formData.value}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default ProductImages;
