import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useAuth } from '../../custom-hooks/useAuth';
import { ordersAPI, reviewsAPI } from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiUser,
  FiRefreshCw,
  FiStar,
} from 'react-icons/fi';

const OrderDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getOrderById(id);
        setOrder(response?.data?.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Không thể tải chi tiết đơn hàng');
        toast.error('Không thể tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-black" />;
      case 'confirmed':
        return <FiCheckCircle className="text-black" />;
      case 'shipping':
        return <FiTruck className="text-black" />;
      case 'delivered':
        return <FiPackage className="text-black" />;
      case 'cancelled':
        return <FiXCircle className="text-black" />;
      default:
        return <FiClock className="text-black" />;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipping':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const response = await ordersAPI.cancelOrder(id);
      if (response && response.success) {
        toast.success('Đã hủy đơn hàng');
        // Refresh order data
        const updatedResponse = await ordersAPI.getOrderById(id);
        setOrder(updatedResponse?.data?.order);
      } else {
        toast.error('Không thể hủy đơn hàng');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  // Handle open review modal
  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewForm({
      rating: 5,
      review_text: '',
    });
    setReviewModalOpen(true);
  };

  // Handle close review modal
  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedProduct(null);
    setReviewForm({ rating: 5, review_text: '' });
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    if (!reviewForm.review_text.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (reviewForm.review_text.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    if (!selectedProduct || !selectedProduct.product_id) {
      toast.error('Không có sản phẩm được chọn');
      return;
    }

    try {
      setSubmittingReview(true);
      const reviewData = {
        product_id: selectedProduct.product_id,
        product_variant_id: selectedProduct.variant_id || null,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
      };

      await reviewsAPI.createReview(reviewData);
      
      toast.success('Đánh giá đã được gửi thành công!');
      handleCloseReviewModal();
      
      // Refresh order to update UI if needed
      const updatedResponse = await ordersAPI.getOrderById(id);
      setOrder(updatedResponse?.data?.order);
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

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="section orderDetailPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Chi tiết đơn hàng</h2>
            <p className="mb-4">Bạn cần đăng nhập để xem chi tiết đơn hàng</p>
            <Button
              className="btn-blue btn-lg btn-big btn-round"
              onClick={() => navigate('/signin')}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section className="section orderDetailPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Đang tải chi tiết đơn hàng...</h2>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="section orderDetailPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Có lỗi xảy ra</h2>
            <p className="mb-4">{error}</p>
            <Button
              className="btn-blue btn-lg btn-big btn-round"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Show not found
  if (!order) {
    return (
      <section className="section orderDetailPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Không tìm thấy đơn hàng</h2>
            <p className="mb-4">
              Đơn hàng không tồn tại hoặc bạn không có quyền xem
            </p>
            <Link to="/orders">
              <Button className="btn-blue btn-lg btn-big btn-round">
                Quay lại danh sách đơn hàng
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section orderDetailPage">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="outlined"
              onClick={() => navigate('/orders')}
              startIcon={<FiArrowLeft />}
              className="mr-3"
            >
              Quay lại
            </Button>
            <h2 className="hd mb-0">Chi tiết đơn hàng #{order.id}</h2>
          </div>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            startIcon={<FiRefreshCw />}
          >
            Làm mới
          </Button>
        </div>

        <div className="row">
          {/* Order Info */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Thông tin đơn hàng</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Mã đơn hàng:</strong> #{order.id}
                    </div>
                    <div className="mb-3">
                      <strong>Ngày đặt:</strong>{' '}
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </div>
                    <div className="mb-3">
                      <strong>Trạng thái:</strong>
                      <span
                        className={`badge badge-${getStatusColor(order.order_status)} ml-2`}
                      >
                        {getStatusIcon(order.order_status)}{' '}
                        {getStatusText(order.order_status)}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Phương thức thanh toán:</strong>{' '}
                      {order.payment_method === 'cod'
                        ? 'Thanh toán khi nhận hàng'
                        : order.payment_method}
                    </div>
                    <div className="mb-3">
                      <strong>Phương thức giao hàng:</strong>{' '}
                      {order.shipping_method === 'standard'
                        ? 'Giao hàng tiêu chuẩn'
                        : order.shipping_method}
                    </div>
                    {order.order_note && (
                      <div className="mb-3">
                        <strong>Ghi chú:</strong> {order.order_note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Sản phẩm đã đặt</h5>
              </div>
              <div className="card-body">
                {order?.order_details && order?.order_details?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>SL</th>
                          <th>Thành tiền</th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        {order?.order_details?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item?.product_image && (
                                  <img
                                    src={item?.product_image}
                                    alt={item?.product_name}
                                    className="mr-3"
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                )}
                                <div className="d-flex flex-column ">
                                  <div className="font-weight-bold">
                                    {item?.product_name}
                                   
                                  </div>
                                  {item.variant_name && (
                                    <small className="text-muted">
                                      Phân loại: {item.variant_name}
                                    </small>
                                  )}
                                   {order.order_status === 'delivered' && (
                                      <span
                                        className="text-blue  cursor-pointer"
                                        onClick={() => handleOpenReviewModal(item)}
                                        style={{ fontSize: '14px',
                                          textDecoration: 'none',
                                          color: '#007bff',
                                          cursor: 'pointer',
                              
                                         }}
                                      >
                                        <FiStar className="mr-1" />
                                        Viết đánh giá
                                      </span>
                                    )}
                                </div>
                                
                              </div>
                            </td>
                            <td>{item?.unit_price?.toLocaleString()}đ</td>
                            <td>{item.quantity}</td>
                            <td className="font-weight-bold text-danger">
                              {item?.total_price?.toLocaleString()}đ
                            </td>
                           
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Không có sản phẩm nào</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Address */}
          <div className="col-lg-4">
            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Tổng kết đơn hàng</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{order?.order_total_cost?.toLocaleString()}đ</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>{order?.order_shipping_cost?.toLocaleString()}đ</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Giảm giá:</span>
                    <span>
                      -{order?.order_shipping_cost?.toLocaleString()}đ
                    </span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between font-weight-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-danger">
                    {order.order_total_cost?.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}

            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <FiMapPin className="mr-2" />
                  Địa chỉ giao hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>
                    <FiUser className="mr-1" />
                    {order?.user_name}
                  </strong>
                </div>
                <div className="mb-2">
                  <strong>
                    <FiPhone className="mr-1" />
                    {order?.user_phone}
                  </strong>
                </div>
                <div className="text-muted">
                  {order?.detail || '-'}, {order?.ward || '-'},{' '}
                  {order?.district || '-'}, {order?.province}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body">
                <div className="d-grid gap-2 ">
                  {order?.order_status === 'pending' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelOrder}
                      fullWidth
                      className="btn-danger mb-2"
                    >
                      Hủy đơn hàng
                    </Button>
                  )}
                  <Link to="/orders">
                    <Button
                      variant="outlined"
                      fullWidth
                      className="btn-danger mb-2"
                    >
                      Xem tất cả đơn hàng
                    </Button>
                  </Link>
                  <Link to="/listing">
                    <Button variant="contained" fullWidth>
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        <Modal
          open={reviewModalOpen}
          onClose={handleCloseReviewModal}
          aria-labelledby="review-modal-title"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              maxWidth: '90%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <h3 id="review-modal-title" className="mb-3">
              Đánh giá sản phẩm
            </h3>

            {selectedProduct && (
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  {selectedProduct.product_image && (
                    <img
                      src={selectedProduct.product_image}
                      alt={selectedProduct.product_name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                      className="mr-3"
                    />
                  )}
                  <div>
                    <div className="font-weight-bold">
                      {selectedProduct.product_name}
                    </div>
                    {selectedProduct.variant_name && (
                      <small className="text-muted">
                        Phân loại: {selectedProduct.variant_name}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label d-block mb-2">
                Đánh giá của bạn
              </label>
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
                setReviewForm({ ...reviewForm, review_text: e.target.value })
              }
              className="mb-3"
            />

            <Alert severity="info" className="mb-3">
              Vui lòng chia sẻ trải nghiệm thực tế của bạn về sản phẩm
            </Alert>

            <div className="d-flex gap-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-grow-1"
              >
                {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseReviewModal}
                disabled={submittingReview}
                className="ml-2"
              >
                Hủy
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </section>
  );
};

export default OrderDetail;
