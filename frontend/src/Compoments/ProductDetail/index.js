import ProductZoom from '../ProductZoom';
import Rating from '@mui/material/Rating';
import QuantityBox from '../QuantityBox';
import { useState, useEffect } from 'react';
import { LuHeart } from 'react-icons/lu';
import { IoIosGitCompare } from 'react-icons/io';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import RelatedProduct from './RelatedProduct';
import { IoCartOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../custom-hooks/useProductDetail';
import { CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../custom-hooks/useAuth';
import { cartAPI } from '../../api';
import { toast } from 'react-toastify';
import LoginModal from '../LoginModal';
//import { useContext } from "react";
//import { Mycontext } from "../../App";

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { product, reviews, reviewStats, loading, error } =
    useProductDetail(id);
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const isActive = index => {
    setActiveSize(index);
    if (product && product.variants && product.variants[index]) {
      setSelectedVariant(product.variants[index]);
    }
  };

  // Set default variant when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setActiveSize(0);
    }
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if selected variant is in stock
  const isInStock = () => {
    if (selectedVariant) {
      return selectedVariant.in_stock > 0 && selectedVariant.is_available;
    }
    return true;
  };

  // Handle quantity change
  const handleQuantityChange = newQuantity => {
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    if (!isInStock()) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Add to cart
    try {
      setAddingToCart(true);

      const cartItem = {
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: quantity,
      };

      await cartAPI.addToCart(cartItem);

      toast.success(
        `Đã thêm ${quantity} ${selectedVariant.variant_name} vào giỏ hàng`
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Retry adding to cart after login
    handleAddToCart();
  };

  // Loading state
  if (loading) {
    return (
      <section className="productDetail section">
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '400px' }}
          >
            <CircularProgress />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="productDetail section">
        <div className="container">
          <Alert severity="error">{error}</Alert>
        </div>
      </section>
    );
  }

  // Product not found
  if (!product) {
    return (
      <section className="productDetail section">
        <div className="container">
          <Alert severity="warning">Không tìm thấy sản phẩm</Alert>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="productDetail section">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <ProductZoom product={product} />
            </div>
            <div className="col-md-7">
              <h2 className="hd text-capitalize">{product.product_name}</h2>

              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text-light mr-2"> Thương hiệu: </span>
                    <span>{product.brand_name || 'Chưa cập nhật'}</span>
                  </div>
                </li>

                <li className="list-inline-item ">
                  <div className="d-flex align-items-center mr-4">
                    <Rating
                      className="read-only"
                      value={reviewStats.average_rating || 0}
                      readOnly
                      size="small"
                      precision={0.5}
                    />
                    <span className="ml-2">
                      {' '}
                      ({reviewStats.total_reviews} đánh giá){' '}
                    </span>
                  </div>
                </li>
              </ul>
              <div className="d-flex info mb-4">
                {selectedVariant && selectedVariant?.discount_amount > 0 && (
                  <span className="oldPrice gl mr-3">
                    {selectedVariant?.price?.toLocaleString()}đ
                  </span>
                )}
                <span className="netPrice text-danger gl">
                  {selectedVariant
                    ? selectedVariant?.final_price?.toLocaleString() + 'đ'
                    : product.product_buy_price?.toLocaleString() + 'đ'}
                </span>
                {selectedVariant && selectedVariant?.discount_amount > 0 && (
                  <span className="badge badge-primary ml-2">
                    -{selectedVariant?.discount_amount}%
                  </span>
                )}
              </div>
              <span
                className={`badge mb-3 ${
                  selectedVariant
                    ? selectedVariant?.in_stock > 0 &&
                      selectedVariant?.is_available
                      ? 'badge-success'
                      : 'badge-danger'
                    : 'badge-success'
                }`}
              >
                {selectedVariant
                  ? selectedVariant?.in_stock > 0 &&
                    selectedVariant?.is_available
                    ? 'Còn hàng'
                    : 'Hết hàng'
                  : 'Còn hàng'}
              </span>
              <p>
                {product.product_short_description ||
                  product.product_description}
              </p>
              {product.product_description && (
                <ul className="mr-3 ml-4">
                  <li>
                    Thành phần dinh dưỡng cân đối, giàu protein và vitamin.
                  </li>
                  <li>
                    Công thức đặc biệt giúp hỗ trợ sức khỏe hệ tiêu hóa và tăng
                    cường sức đề kháng.
                  </li>
                  <li>Hạt nhỏ phù hợp với kích thước hàm của chó Poodle.</li>
                  <li>Giúp duy trì vóc dáng cân đối và bộ lông mềm mượt.</li>
                </ul>
              )}
              {product.variants && product.variants.length > 0 && (
                <div className="productSize d-flex align-items-center mt-4">
                  <span className="text-light mr-2">Size/ Cân nặng: </span>
                  <ul className="list list-inline mb-0 pl-4">
                    {product.variants.map((variant, index) => (
                      <li key={variant.id} className="list-inline-item">
                        <button
                          className={`tag ${activeSize === index ? 'active' : ''} ${!variant.is_available ? 'disabled' : ''}`}
                          onClick={() =>
                            variant.is_available && isActive(index)
                          }
                          style={{
                            cursor: variant.is_available
                              ? 'pointer'
                              : 'not-allowed',
                            opacity: variant.is_available ? 1 : 0.5,
                            border: 'none',
                            background: 'transparent',
                            padding: '8px 16px',
                            borderRadius: '4px',
                          }}
                        >
                          {variant.variant_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="d-flex align-items-center mt-4">
                <div className="quantityDrop d-flex align-items-center mr-4">
                  <QuantityBox
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    max={selectedVariant?.in_stock || 999}
                  />
                </div>
                <Button
                  className="btn-blue btn-lg btn-big btn-round"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !isInStock() || addingToCart}
                >
                  <IoCartOutline /> &nbsp;{' '}
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </Button>

                <Tooltip title="Add to Wishlist" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                    <LuHeart />{' '}
                  </Button>
                </Tooltip>
                <Tooltip title="Add to Compare" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                    <IoIosGitCompare />{' '}
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          <br />
          <div className="card mt-5 p-5detailPageTabs">
            <div className="customTabs p-2 ">
              <ul className="list list-inline ">
                <li className="list-inline-item">
                  <button
                    className={`  btn-sm btn-round border-0 ${activeTabs === 0 ? 'btn-blue' : ''}`}
                    onClick={() => setActiveTabs(0)}
                  >
                    Mô tả
                  </button>
                </li>
                <li className="list-inline-item">
                  <button
                    className={`  btn-sm btn-round border-0 ${activeTabs === 1 ? 'btn-blue' : ''}`}
                    onClick={() => setActiveTabs(1)}
                  >
                    Thông tin chi tiết
                  </button>
                </li>
                <li className="list-inline-item">
                  <button
                    className={`  btn-sm btn-round border-0 ${activeTabs === 2 ? 'btn-blue' : ''}`}
                    onClick={() => setActiveTabs(2)}
                  >
                    Đánh giá
                  </button>
                </li>
              </ul>

              <br />

              <div className="tabContent ml-4">
                {activeTabs === 0 && (
                  <div>
                    <p>
                      {product.product_description ||
                        product.product_short_description ||
                        'Chưa có mô tả chi tiết'}
                    </p>
                    {product.product_description && (
                      <ul className="mr-3 ml-4">
                        <li>
                          Thành phần dinh dưỡng cân đối, giàu protein và
                          vitamin.
                        </li>
                        <li>
                          Công thức đặc biệt giúp hỗ trợ sức khỏe hệ tiêu hóa và
                          tăng cường sức đề kháng.
                        </li>
                        <li>
                          Hạt nhỏ phù hợp với kích thước hàm của chó Poodle.
                        </li>
                        <li>
                          Giúp duy trì vóc dáng cân đối và bộ lông mềm mượt.
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <br />
              <div class="table-responsive">
                {activeTabs === 1 && (
                  <table className="table table-bordered">
                    <tbody>
                      <tr className="stand-up ">
                        <th> Thương hiệu</th>
                        <td> {product.brand_name || 'Chưa cập nhật'} </td>
                      </tr>
                      <tr className="stand-up ">
                        <th> Danh mục</th>
                        <td> {product.category_name || 'Chưa cập nhật'} </td>
                      </tr>
                      <tr className="stand-up ">
                        <th> Loại sản phẩm</th>
                        <td> {product.category_type || 'Chưa cập nhật'} </td>
                      </tr>
                      <tr className="stand-up ">
                        <th> Giá gốc</th>
                        <td>
                          {' '}
                          {product.product_buy_price?.toLocaleString()}đ{' '}
                        </td>
                      </tr>
                      {selectedVariant && (
                        <>
                          <tr className="stand-up ">
                            <th> Biến thể</th>
                            <td> {selectedVariant?.variant_name} </td>
                          </tr>
                          <tr className="stand-up ">
                            <th> Giá biến thể</th>
                            <td>
                              {' '}
                              {selectedVariant?.price?.toLocaleString()}đ{' '}
                            </td>
                          </tr>
                          {selectedVariant?.discount_amount > 0 && (
                            <tr className="stand-up ">
                              <th> Giảm giá</th>
                              <td> {selectedVariant?.discount_amount}% </td>
                            </tr>
                          )}
                          <tr className="stand-up ">
                            <th> Tồn kho</th>
                            <td> {selectedVariant?.in_stock} sản phẩm </td>
                          </tr>
                        </>
                      )}
                      <tr className="stand-up ">
                        <th> Đánh giá trung bình</th>
                        <td>
                          {' '}
                          {reviewStats.average_rating
                            ? reviewStats.average_rating
                            : '0.0'}{' '}
                          / 5.0{' '}
                        </td>
                      </tr>
                      <tr className="stand-up ">
                        <th> Số lượng đánh giá</th>
                        <td> {reviewStats.total_reviews} đánh giá </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className="tabContent ml-4">
                {activeTabs === 2 && (
                  <div className="row ">
                    <div className="col-md-8">
                      <h3 className="mb-4">
                        Đánh giá cho {product.product_name}
                      </h3>
                      <br />
                      <div className="reviewScroll">
                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <div
                              key={review.id || index}
                              className="reviewBox mb-4 border-bottom"
                            >
                              <div className="info">
                                <div className="d-flex align-items-center w-100">
                                  <h5>{review.user_name || 'Khách hàng'}</h5>
                                  <Rating
                                    className="read-only ml-5"
                                    value={review.rating || 0}
                                    readOnly
                                    size="small"
                                    precision={0.5}
                                  />
                                </div>
                                <div>
                                  <h6 className="date">
                                    {new Date(
                                      review.created_at
                                    ).toLocaleDateString('vi-VN')}
                                  </h6>
                                  <p className="mt-2">
                                    {review.review_text || 'Không có bình luận'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p>Chưa có đánh giá nào cho sản phẩm này</p>
                          </div>
                        )}
                      </div>
                      <br class="res-hide" />

                      <form class="reviewForm">
                        <h4 className="mb-4"> Thêm đánh giá của bạn</h4>
                        <div class="form-group">
                          <textarea
                            className="form-control shadow"
                            name="review"
                            placeholder="Nhập đánh giá của bạn"
                          ></textarea>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <span className="MuiRating-root MuiRating-sizeMedium css-1i1gfbe">
                                <Rating
                                  className="read-only ml-5"
                                  value={0}
                                  readOnly
                                  size="small"
                                  precision={0.5}
                                />{' '}
                              </span>
                            </div>
                          </div>
                        </div>
                        <br />

                        <div class="form-group">
                          <Button className="btn-blue btn-lg btn-big btn-round">
                            {' '}
                            &nbsp; Gửi đánh giá
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br />

          <RelatedProduct
            title="Sản phẩm tương tự"
            categoryId={product.category_id}
          />
          <br />
          <RelatedProduct title="Sản phẩm bán chạy" />
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};
export default ProductDetail;
