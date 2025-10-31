import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import Chip from '@mui/material/Chip';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  AdminPageHeader,
  AdminSearch,
  AdminTable,
  AdminPagination,
  AdminLoading,
  AddButton,
  ActionButtons,
  SaveButton,
  CancelButton,
} from '../../components/Admin';
import ProductVariants from '../../components/Admin/ProductVariants';
import ProductImages from '../../components/Admin/ProductImages';
import { FiEdit, FiImage, FiInbox, FiPlus, FiUserPlus } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewProduct, setIsViewProduct] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: '',
    category_id: '',
    product_name: '',
    product_slug: '',
    product_short_description: '',
    product_description: '',
    product_buy_price: '',
  });
  const [productImages, setProductImages] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('images');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchTerm,
      };
      const response = await adminAPI.getAllProducts(params);
      if (response?.data) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, [loadProducts]);

  const loadCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      if (response?.data) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await adminAPI.getBrands();
      if (response?.data) {
        setBrands(response.data.brands || []);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await adminAPI.deleteProduct(id);
      toast.success('Đã xóa sản phẩm');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleView = product => {
    setEditingProduct(product);
    setFormData({
      brand_id: product.brand_id || '',
      category_id: product.category_id || '',
      product_name: product.product_name || '',
      product_slug: product.product_slug || '',
      product_short_description: product.product_short_description || '',
      product_description: product.product_description || '',
      product_buy_price: product.product_buy_price || '',
    });
    setProductImages(product.images || []);
    setProductVariants(product.variants || []);
    setShowModal(true);
    setIsViewProduct(true);
  };

  const handleEdit = product => {
    setIsViewProduct(false);
    setEditingProduct(product);
    setFormData({
      brand_id: product.brand_id || '',
      category_id: product.category_id || '',
      product_name: product.product_name || '',
      product_slug: product.product_slug || '',
      product_short_description: product.product_short_description || '',
      product_description: product.product_description || '',
      product_buy_price: product.product_buy_price || '',
    });
    setProductImages(product.images || []);
    setProductVariants(product.variants || []);
    setShowModal(true);
  };

  // Auto-generate slug from product name
  const generateSlug = name => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  const handleProductNameChange = e => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      product_name: name,
      product_slug: editingProduct ? prev.product_slug : generateSlug(name),
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.product_name ||
      !formData.product_slug ||
      !formData.product_buy_price
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate variants discount amounts
    for (const variant of productVariants) {
      const discountAmount = parseFloat(variant.discount_amount);
      if (
        variant.discount_amount &&
        (isNaN(discountAmount) || discountAmount < 0 || discountAmount > 100)
      ) {
        toast.error(
          `Biến thể "${variant.variant_name}" có phần trăm giảm giá không hợp lệ (0-100%)`
        );
        return;
      }
    }

    try {
      const productData = {
        ...formData,
        images: productImages,
        variants: productVariants,
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, productData);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await adminAPI.createProduct(productData);
        toast.success('Tạo sản phẩm thành công!');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      brand_id: '',
      category_id: '',
      product_name: '',
      product_slug: '',
      product_short_description: '',
      product_description: '',
      product_buy_price: '',
    });
    setProductImages([]);
    setProductVariants([]);
    setActiveTab('images');
  };

  const handleManageVariants = product => {
    setSelectedProduct(product);
    setShowVariantsModal(true);
  };

  const handleManageImages = product => {
    setSelectedProduct(product);
    setShowImagesModal(true);
  };

  const handleAddVariant = async (productId, variantData) => {
    try {
      // TODO: Implement variant API call
      toast.success('Thêm biến thể thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error('Không thể thêm biến thể');
    }
  };

  const handleUpdateVariant = async (variantId, variantData) => {
    try {
      // TODO: Implement variant API call
      toast.success('Cập nhật biến thể thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Không thể cập nhật biến thể');
    }
  };

  const handleDeleteVariant = async variantId => {
    if (!window.confirm('Bạn có chắc muốn xóa biến thể này?')) {
      return;
    }
    try {
      // TODO: Implement variant API call
      toast.success('Xóa biến thể thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Không thể xóa biến thể');
    }
  };

  const handleAddImage = async (productId, imageData) => {
    try {
      // TODO: Implement image API call
      toast.success('Thêm hình ảnh thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Không thể thêm hình ảnh');
    }
  };

  const handleDeleteImage = async imageId => {
    try {
      // TODO: Implement image API call
      toast.success('Xóa hình ảnh thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Không thể xóa hình ảnh');
    }
  };

  // Functions for managing images and variants in form
  const handleAddImageToForm = imageData => {
    setProductImages(prev => [...prev, { ...imageData, id: Date.now() }]);
  };

  const handleRemoveImageFromForm = imageId => {
    setProductImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleAddVariantToForm = variantData => {
    setProductVariants(prev => [...prev, { ...variantData, id: Date.now() }]);
  };

  const handleUpdateVariantInForm = (variantId, variantData) => {
    setProductVariants(prev =>
      prev.map(variant =>
        variant.id === variantId ? { ...variant, ...variantData } : variant
      )
    );
  };

  const handleRemoveVariantFromForm = variantId => {
    setProductVariants(prev =>
      prev.filter(variant => variant.id !== variantId)
    );
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Sản phẩm">
        <AddButton
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
            setIsViewProduct(false);
          }}
        >
          Thêm sản phẩm
        </AddButton>
      </AdminPageHeader>

      <AdminSearch
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
      />

      <AdminTable
        headers={[
          'Hình ảnh',
          'Tên sản phẩm',
          'Thương hiệu',
          'Danh mục',
          'Giá',
          'Đã bán',
          'Đánh giá',
          'Thao tác',
        ]}
        data={products}
        emptyMessage="Không có sản phẩm nào"
      >
        {products.map(product => (
          <tr key={product.id}>
            <td>
              {product.images?.[0]?.value && (
                <img
                  src={product.images[0].value}
                  alt={product.product_name}
                  className="img-thumbnail"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </td>
            <td>
              <div>
                <strong className="text-dark">{product.product_name}</strong>
                <br />
                <small className="text-muted">{product.product_slug}</small>
              </div>
            </td>
            <td>
              <span className="badge bg-warning">
                {product.brand_name || 'Chưa có thương hiệu'}
              </span>
            </td>
            <td>
              <span className="badge bg-info">
                {product.category_name || 'Chưa có danh mục'}
              </span>
            </td>
            <td>
              <span className="fw-bold text-success">
                {Number(product.product_buy_price).toLocaleString()}đ
              </span>
            </td>
            <td>
              <Chip
                label={product.product_sold_quantity || 0}
                size="small"
                color="info"
                variant="outlined"
              />
            </td>
            <td>
              <Chip
                label={`${Number(product.product_avg_rating || 0).toFixed(1)} ⭐`}
                size="small"
                color="warning"
                variant="outlined"
              />
            </td>
            <td>
              <div className="d-flex gap-2">
                <ActionButtons
                  onView={() => handleView(product)}
                  onEdit={() => handleEdit(product)}
                  onDelete={() => handleDelete(product.id)}
                  showView={true}
                />
                <button
                  className="btn btn-sm btn-outline-info mr-2"
                  onClick={() => handleManageVariants(product)}
                  title="Quản lý biến thể"
                  style={{ borderRadius: '8px' }}
                >
                  <FiInbox />
                </button>
                <button
                  className="btn btn-sm btn-outline-warning mr-2"
                  onClick={() => handleManageImages(product)}
                  title="Quản lý hình ảnh"
                  style={{ borderRadius: '8px' }}
                >
                  <FiImage />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={
          isViewProduct
            ? 'Xem sản phẩm'
            : editingProduct
              ? 'Chỉnh sửa sản phẩm'
              : 'Thêm sản phẩm mới'
        }
        size="xl"
        footer={
          !isViewProduct && (
            <div className="d-flex justify-content-end">
              <CancelButton onClick={() => setShowModal(false)} />
              <SaveButton onClick={handleSubmit}>
                {editingProduct ? 'Cập nhật' : 'Tạo mới'}
              </SaveButton>
            </div>
          )
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          {/* Product Basic Info */}
          <div className="row">
            <div className="col-md-6">
              <FormGroup label="Tên sản phẩm" required>
                <FormInput
                  value={formData.product_name}
                  onChange={handleProductNameChange}
                  placeholder="Nhập tên sản phẩm"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Slug" required>
                <FormInput
                  value={formData.product_slug}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      product_slug: e.target.value,
                    })
                  }
                  placeholder="product-slug"
                  disabled={!editingProduct || isViewProduct}
                />
                {!editingProduct ||
                  (isViewProduct && (
                    <small className="text-muted">
                      Slug sẽ được tự động tạo từ tên sản phẩm
                    </small>
                  ))}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Thương hiệu" required>
                <FormSelect
                  value={formData.brand_id}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      brand_id: e.target.value,
                    })
                  }
                  options={brands.map(brand => ({
                    value: brand.id,
                    label: brand.name,
                  }))}
                  placeholder="Chọn thương hiệu"
                  className="form-control"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Danh mục" required>
                <FormSelect
                  value={formData.category_id}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                    })
                  }
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.category_name,
                  }))}
                  placeholder="Chọn danh mục"
                  className="form-control"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Giá bán" required>
                <FormInput
                  type="number"
                  step="0.01"
                  value={formData.product_buy_price}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      product_buy_price: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup label="Mô tả ngắn">
                <FormTextarea
                  value={formData.product_short_description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      product_short_description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Mô tả ngắn về sản phẩm"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup label="Mô tả chi tiết">
                <FormTextarea
                  value={formData.product_description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      product_description: e.target.value,
                    })
                  }
                  rows={5}
                  placeholder="Mô tả chi tiết về sản phẩm"
                  disabled={isViewProduct}
                />
              </FormGroup>
            </div>
          </div>

          {/* Images and Variants Section */}
          <div className="mt-4">
            <div className="d-flex border-bottom">
              <button
                type="button"
                className={`custom-tab-button ${
                  activeTab === 'images' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('images')}
              >
                Hình ảnh ({productImages.length})
              </button>
              <button
                type="button"
                className={`custom-tab-button ${
                  activeTab === 'variants' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('variants')}
              >
                Biến thể ({productVariants.length})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'images' && (
                <div className="p-3">
                  <ProductImages
                    productId={editingProduct?.id || 'new'}
                    images={productImages}
                    onAddImage={handleAddImageToForm}
                    onDeleteImage={handleRemoveImageFromForm}
                  />
                </div>
              )}
              {activeTab === 'variants' && (
                <div className="p-3">
                  <ProductVariants
                    productId={editingProduct?.id || 'new'}
                    variants={productVariants}
                    onAddVariant={handleAddVariantToForm}
                    onUpdateVariant={handleUpdateVariantInForm}
                    onDeleteVariant={handleRemoveVariantFromForm}
                  />
                </div>
              )}
            </div>
          </div>
        </AdminForm>
      </AdminModal>

      {/* Variants Management Modal */}
      <AdminModal
        show={showVariantsModal}
        onClose={() => setShowVariantsModal(false)}
        title={`Quản lý biến thể - ${selectedProduct?.product_name}`}
        size="xl"
        footer={
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowVariantsModal(false)}
            >
              Đóng
            </button>
          </div>
        }
      >
        {selectedProduct && (
          <ProductVariants
            productId={selectedProduct.id}
            variants={selectedProduct.variants || []}
            onAddVariant={handleAddVariant}
            onUpdateVariant={handleUpdateVariant}
            onDeleteVariant={handleDeleteVariant}
          />
        )}
      </AdminModal>

      {/* Images Management Modal */}
      <AdminModal
        show={showImagesModal}
        onClose={() => setShowImagesModal(false)}
        title={`Quản lý hình ảnh - ${selectedProduct?.product_name}`}
        size="xl"
        footer={
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowImagesModal(false)}
            >
              Đóng
            </button>
          </div>
        }
      >
        {selectedProduct && (
          <ProductImages
            productId={selectedProduct.id}
            images={selectedProduct.images || []}
            onAddImage={handleAddImage}
            onDeleteImage={handleDeleteImage}
          />
        )}
      </AdminModal>
    </div>
  );
};

export default AdminProducts;
