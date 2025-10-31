import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import QuantityBox from '../QuantityBox';
import { IoMdClose } from 'react-icons/io';
import { useContext, useState, useEffect } from 'react';
import { Mycontext } from '../../App';
import ProductZoom from '../ProductZoom';
import LoginModal from '../LoginModal';
import { useAuth } from '../../custom-hooks/useAuth';
import { cartAPI, reviewsAPI } from '../../api';
import { toast } from 'react-toastify';
import './ProductModal.css';

const ProductModal = props => {
  const context = useContext(Mycontext);
  const { isAuthenticated } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStatistics, setReviewStatistics] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);

  // Initialize selected variant when product changes
  useEffect(() => {
    if (context.product?.variants && context.product.variants.length > 0) {
      setSelectedVariant(context.product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [context.product]);

  // Load reviews when product changes
  const loadProductReviews = async () => {
    if (!context.product?.id) return;

    try {
      setLoadingReviews(true);
      const response = await reviewsAPI.getProductReviews(context.product.id, {
        page: reviewPage,
        limit: 5,
      });

      // Handle different response formats
      const reviewsData = response?.data || response || {};
      setReviews(reviewsData.reviews || []);
      setReviewStatistics(reviewsData.statistics || null);
      setReviewTotalPages(reviewsData.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
      setReviewStatistics(null);
      setReviewTotalPages(1);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (context.product?.id) {
      loadProductReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.product?.id, reviewPage]);

  // Get product price info
  const getProductPriceInfo = () => {
    if (selectedVariant) {
      const originalPrice = selectedVariant.price;
      const discountPercentage = selectedVariant.discount_amount || 0;
      const finalPrice =
        discountPercentage > 0
          ? Math.round(originalPrice * (1 - discountPercentage / 100))
          : originalPrice;

      return {
        originalPrice: originalPrice,
        discountAmount: discountPercentage, // This is now percentage
        finalPrice: finalPrice,
        discountPercentage: discountPercentage,
        hasDiscount: discountPercentage > 0,
      };
    }
    return {
      originalPrice: context.product?.product_buy_price || 0,
      discountAmount: 0,
      finalPrice: context.product?.product_buy_price || 0,
      discountPercentage: 0,
      hasDiscount: false,
    };
  };

  // Check if selected variant is in stock
  const isInStock = () => {
    if (selectedVariant) {
      return selectedVariant.in_stock && selectedVariant.is_available;
    }
    return true;
  };

  // Handle variant selection
  const handleVariantChange = variant => {
    setSelectedVariant(variant);
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
        product_id: context.product.id,
        variant_id: selectedVariant.id,
        quantity: quantity,
      };

      await cartAPI.addToCart(cartItem);

      toast.success(
        `Đã thêm ${quantity} ${selectedVariant.variant_name} vào giỏ hàng`
      );

      // Close modal after successful add
      context.setisOpenProductModal(false);
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

  // Handle review form submission
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!reviewForm.review_text.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (reviewForm.review_text.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    if (!selectedVariant) {
      toast.error('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    try {
      setSubmittingReview(true);
      const reviewData = {
        product_id: context.product.id,
        product_variant_id: selectedVariant.id,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
      };

      await reviewsAPI.createReview(reviewData);

      toast.success('Đánh giá đã được gửi thành công!');
      setReviewForm({ rating: 5, review_text: '' });
      setShowReviewForm(false);

      // Reload reviews and reset to page 1
      setReviewPage(1);
      await loadProductReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Không thể gửi đánh giá. Vui lòng kiểm tra lại thông tin.';
      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const priceInfo = getProductPriceInfo();

  return (
    <Dialog
      className="productModal"
      open={true}
      onClose={() => context.setisOpenProductModal(false)}
      maxWidth="lg"
      fullWidth
    >
      <div className=" d-flex justify-content-end">
        <Button
          className="close_ btn-close"
          onClick={() => context.setisOpenProductModal(false)}
        >
          <IoMdClose style={{ fontSize: '24px' }} />
        </Button>
      </div>

      <div className="p-4">
        <h4 className="mb-2 font-weight-bold">Thông Tin Sản Phẩm</h4>
        <div className="d-flex align-items-center mb-3">
          <div className="d-flex align-items-center mr-4">
            <span>Thương hiệu:</span>
            <span className="ml-2">
              <b>{context.product?.brand_name}</b>
            </span>
          </div>
          <Rating
            className="read-only"
            value={Number(context.product?.product_avg_rating) || 0}
            readOnly
            size="small"
            precision={0.5}
          />
        </div>
        <hr />

        <div className="productDetailModal row mt-2">
          <div className="col-md-6">
            <ProductZoom product={context.product} />
          </div>

          <div className="col-md-6">
            <div className="info">
              <h5>{context.product?.product_name}</h5>

              {/* Stock status */}
              <span
                className={`d-block mb-2 ${isInStock() ? 'text-success' : 'text-danger'}`}
              >
                {isInStock() ? 'Còn hàng' : 'Hết hàng'}
              </span>

              {/* Variants Selection */}
              {context.product?.variants &&
                context.product.variants.length > 0 && (
                  <div className="mb-3">
                    <h6>Chọn biến thể:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {context.product.variants.map(variant => (
                        <Button
                          key={variant.id}
                          variant={
                            selectedVariant?.id === variant.id
                              ? 'contained'
                              : 'outlined'
                          }
                          color={
                            selectedVariant?.id === variant.id
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => handleVariantChange(variant)}
                          disabled={!variant.is_available || !variant.in_stock}
                          className="mb-2"
                        >
                          {variant.variant_name}
                          {variant.discount_amount > 0 && (
                            <span className="ml-1 text-danger">
                              (-{variant.discount_percentage}%)
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Price Display */}
              <div className="mb-3">
                {priceInfo.hasDiscount && (
                  <span className="oldPrice mr-3">
                    {priceInfo.originalPrice.toLocaleString()}đ
                  </span>
                )}
                <span
                  className={`netPrice ${priceInfo.hasDiscount ? 'text-danger' : 'text-dark'}`}
                >
                  {priceInfo.finalPrice.toLocaleString()}đ
                </span>
                {priceInfo.hasDiscount && (
                  <span className="badge badge-primary ml-2">
                    -{priceInfo.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Product Description */}
              <p className="mt-3 text-muted" style={{ fontSize: '14px' }}>
                {context.product?.product_short_description ||
                  context.product?.product_description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="d-flex align-items-center mt-4">
                <div className="mr-3">
                  <label className="form-label">Số lượng:</label>
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
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </Button>
              </div>

              {/* Variant Details */}
              {selectedVariant && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h6>Thông tin biến thể đã chọn:</h6>
                  <p>
                    <strong>Tên:</strong> {selectedVariant.variant_name}
                  </p>
                  <p>
                    <strong>Giá gốc:</strong>{' '}
                    {selectedVariant.price.toLocaleString()}đ
                  </p>
                  {selectedVariant.discount_amount > 0 && (
                    <>
                      <p>
                        <strong>Giảm giá:</strong>{' '}
                        {selectedVariant.discount_amount}%
                      </p>
                      <p>
                        <strong>Giá cuối:</strong>{' '}
                        {priceInfo.finalPrice.toLocaleString()}đ
                      </p>
                    </>
                  )}
                  <p>
                    <strong>Tồn kho:</strong> {selectedVariant.in_stock} sản
                    phẩm
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    {selectedVariant.is_available ? 'Có sẵn' : 'Không có sẵn'}
                  </p>
                </div>
              )}

              {/* Actions */}
              {/* <div className="d-flex align-items-center mt-4">
                <Button className="btn-round btn-sml mr-3" variant="outlined">
                  <IoIosHeartEmpty />
                  Thêm vào yêu thích
                </Button>
                <Button className="btn-round btn-sml" variant="outlined">
                  <MdOutlineCompareArrows />
                  So sánh
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Đánh giá sản phẩm</h5>
            <Button
              variant="text"
              onClick={() => setShowReviews(!showReviews)}
              size="small"
            >
              {showReviews ? 'Ẩn' : 'Xem tất cả'}
            </Button>
          </div>

          {/* Review Statistics */}
          {reviewStatistics && (
            <Box className="review-stats mb-3 p-3 bg-light rounded">
              <div className="d-flex align-items-center justify-content-between">
                <div className="text-center">
                  <h3 className="mb-0">
                    {Number(reviewStatistics.average_rating || 0).toFixed(1)}
                  </h3>
                  <Rating
                    value={Number(reviewStatistics.average_rating) || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <p className="text-muted mb-0">
                    {reviewStatistics.total_reviews || 0} đánh giá
                  </p>
                </div>
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const percentage =
                      (reviewStatistics[
                        `${rating === 1 ? 'one' : rating === 2 ? 'two' : rating === 3 ? 'three' : rating === 4 ? 'four' : rating === 5 ? 'five' : ''}_star`
                      ] /
                        reviewStatistics.total_reviews) *
                      100;
                    return (
                      <div
                        key={rating}
                        className="d-flex align-items-center mb-1"
                      >
                        <span
                          className="text-muted mr-2"
                          style={{ minWidth: '20px' }}
                        >
                          {rating} ⭐
                        </span>
                        <div
                          className="progress flex-grow-1"
                          style={{ height: '8px', borderRadius: '4px' }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span
                          className="text-muted ml-2"
                          style={{ minWidth: '30px' }}
                        >
                          {rating === 1 && reviewStatistics.one_star}
                          {rating === 2 && reviewStatistics.two_star}
                          {rating === 3 && reviewStatistics.three_star}
                          {rating === 4 && reviewStatistics.four_star}
                          {rating === 5 && reviewStatistics.five_star}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Box>
          )}

          {/* Write Review Button */}
          {isAuthenticated && (
            <Collapse in={!showReviewForm}>
              <div className="mb-3">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowReviewForm(true)}
                  fullWidth
                >
                  Viết đánh giá
                </Button>
              </div>
            </Collapse>
          )}

          {/* Review Form */}
          <Collapse in={showReviewForm}>
            <Box className="review-form mb-4 p-3 border rounded">
              <h6 className="mb-3">Viết đánh giá của bạn</h6>

              {!isAuthenticated ? (
                <Alert severity="info">
                  Vui lòng đăng nhập để viết đánh giá
                </Alert>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Đánh giá của bạn</label>
                    <Rating
                      value={reviewForm.rating}
                      onChange={(event, newValue) => {
                        setReviewForm({ ...reviewForm, rating: newValue });
                      }}
                      size="large"
                    />
                  </div>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Nội dung đánh giá"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    value={reviewForm.review_text}
                    onChange={e =>
                      setReviewForm({
                        ...reviewForm,
                        review_text: e.target.value,
                      })
                    }
                    className="mb-3"
                  />

                  <div className="d-flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="flex-grow-1 mr-2"
                    >
                      {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewForm({ rating: 5, review_text: '' });
                      }}
                      disabled={submittingReview}
                    >
                      Hủy
                    </Button>
                  </div>
                </>
              )}
            </Box>
          </Collapse>

          {/* Reviews List */}
          <Collapse in={showReviews}>
            <div className="reviews-list">
              {loadingReviews ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <Alert severity="info">
                  Chưa có đánh giá nào cho sản phẩm này.
                </Alert>
              ) : (
                <>
                  {reviews.map(review => (
                    <Box
                      key={review.id}
                      className="review-item mb-3 p-3 border rounded"
                    >
                      <div className="d-flex align-items-start mb-2">
                        <Avatar className="mr-3">
                          {review.user_avatar ? (
                            <img
                              src={review.user_avatar}
                              alt={review.user_name}
                            />
                          ) : (
                            review.user_name?.[0]?.toUpperCase() || 'A'
                          )}
                        </Avatar>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0">
                                {review.user_name || 'Người dùng'}
                              </h6>
                              {review.variant_name && (
                                <Chip
                                  label={review.variant_name}
                                  size="small"
                                  variant="outlined"
                                  className="mt-1"
                                />
                              )}
                            </div>
                            <div className="text-right">
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                              <p className="text-muted mb-0 small">
                                {formatDate(review.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mb-0">{review.review_text}</p>
                    </Box>
                  ))}

                  {/* Pagination */}
                  {reviewTotalPages > 1 && (
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <Button
                        variant="outlined"
                        disabled={reviewPage === 1}
                        onClick={() => setReviewPage(reviewPage - 1)}
                      >
                        Trước
                      </Button>
                      <Chip
                        label={`Trang ${reviewPage} / ${reviewTotalPages}`}
                        variant="outlined"
                      />
                      <Button
                        variant="outlined"
                        disabled={reviewPage >= reviewTotalPages}
                        onClick={() => setReviewPage(reviewPage + 1)}
                      >
                        Sau
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Collapse>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </Dialog>
  );
};

export default ProductModal;
