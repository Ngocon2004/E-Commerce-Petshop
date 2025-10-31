import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import QuantityBox from '../../Compoments/QuantityBox';
import { IoMdClose } from 'react-icons/io';
import Button from '@mui/material/Button';
import { IoCartOutline } from 'react-icons/io5';
import { cartAPI, ordersAPI } from '../../api';
import { useAuth } from '../../custom-hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '../../Compoments/CheckoutModal';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await cartAPI.getCart();

        setCarts(response?.data?.items);
        setCartSummary(response?.data?.summary);
      } catch (err) {
        toast.error('Không thể tải giỏ hàng');
      } finally {
        setLoading(false);
        setReload(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, reload]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      console.log('Updating quantity for item:', itemId, 'to:', newQuantity);

      // Ensure itemId is a number
      const numericItemId = parseInt(itemId);
      if (isNaN(numericItemId) || numericItemId <= 0) {
        console.error('Invalid item ID:', itemId);
        toast.error('ID sản phẩm không hợp lệ');
        return;
      }

      console.log('Calling updateCartItem with:', numericItemId, newQuantity);
      await cartAPI.updateCartItem(numericItemId, newQuantity);

      // Refresh cart data
      const response = await cartAPI.getCart();
      setCarts(response?.data?.items);
      toast.success('Cập nhật số lượng thành công');
      setReload(true);
    } catch (err) {
      console.error('Error updating quantity:', err);
      console.error('Error details:', err.response?.data);
      toast.error(err.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async itemId => {
    try {
      // Ensure itemId is a number
      const numericItemId = parseInt(itemId);
      if (isNaN(numericItemId) || numericItemId <= 0) {
        toast.error('ID sản phẩm không hợp lệ');
        return;
      }

      await cartAPI.removeFromCart(numericItemId);
      // Refresh cart data
      const response = await cartAPI.getCart();

      setCarts(response?.data?.items);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      setReload(true);
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleCheckout = () => {
    if (!cartSummary || cartSummary.total_items === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    // Mở modal nhập thông tin
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async orderData => {
    try {
      setCheckingOut(true);

      const response = await ordersAPI.createOrder(orderData);

      if (response && response.success) {
        toast.success('Đặt hàng thành công!');
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await cartAPI.clearCart();
        // Đóng modal
        setShowCheckoutModal(false);
        // Redirect đến trang chi tiết đơn hàng
        navigate(`/orders/${response.data.order.id}`);
      } else {
        toast.error('Không thể tạo đơn hàng');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      toast.error(err.response?.data?.message || 'Không thể tạo đơn hàng');
    } finally {
      setCheckingOut(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="section cartPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Giỏ hàng của bạn</h2>
            <p className="mb-4">Bạn cần đăng nhập để xem giỏ hàng</p>
            <Button
              className="btn-blue btn-lg btn-big btn-round"
              //   onClick={handleLogin}
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
      <section className="section cartPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Đang tải giỏ hàng...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  //   if (error) {
  //     return (
  //       <section className="section cartPage">
  //         <div className="container">
  //           <div className="text-center py-5">
  //             <h2 className="hd mb-4">Có lỗi xảy ra</h2>
  //             <p className="mb-4">{error}</p>
  //             <Button
  //               className="btn-blue btn-lg btn-big btn-round"
  //               onClick={() => window.location.reload()}
  //             >
  //               Thử lại
  //             </Button>
  //           </div>
  //         </div>
  //       </section>
  //     );
  //   }

  // Show empty cart
  if (carts.length === 0) {
    return (
      <section className="section cartPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Giỏ hàng trống</h2>
            <p className="mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link to="/listing">
              <Button className="btn-blue btn-lg btn-big btn-round">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // const shipping = 0; // Free shipping

  return (
    <section className="section cartPage">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="hd mb-2">Giỏ hàng của bạn</h2>
            <p className="mb-0">
              Bạn có <b>{cartSummary?.total_items}</b> sản phẩm trong giỏ hàng.
            </p>
          </div>
          {/* {carts.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (
                  window.confirm(
                    'Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?'
                  )
                ) {
                  handleClearCart();
                }
              }}
              className="btn btn-outline-danger"
            >
              <IoMdClose className="mr-2" />
              Xóa tất cả
            </Button>
          )} */}
        </div>
        <div className="row">
          <div className="col-md-8 pr-0">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th width="45%">Sản phẩm</th>
                    <th width="25%">Giá</th>
                    <th width="20%">Số lượng</th>
                    <th width="10%">Tổng</th>
                    <th width="15%">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map(item => (
                    <tr key={item.id}>
                      <td width="40%">
                        <Link to={`/product/${item?.product_slug}`}>
                          <div className="d-flex align-items-center cartItemWrapper">
                            <div className="imgWrapper mr-3">
                              <img
                                alt={item.product_name}
                                src={
                                  item?.product_image[0]?.value ||
                                  'https://via.placeholder.com/100x100?text=No+Image'
                                }
                                className="w-100"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                            <div className="info">
                              <h6 className="mb-1">{item.product_name}</h6>
                              {item.variant_name && (
                                <p className="text-muted mb-1">
                                  Biến thể: {item.variant_name}
                                </p>
                              )}
                              <Rating
                                name="read-only"
                                value={item.product_rating || 0}
                                readOnly
                                size="small"
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="25%">
                        <span className="text-danger font-weight-bold">
                          {item.price?.toLocaleString()}đ
                        </span>
                      </td>
                      <td width="25%">
                        <QuantityBox
                          quantity={item.quantity}
                          onQuantityChange={newQuantity =>
                            handleQuantityChange(item.id, newQuantity)
                          }
                          max={item.stock || 999}
                        />
                      </td>
                      <td width="20%">
                        <span className="text-danger font-weight-bold">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </span>
                      </td>
                      <td width="15%">
                        <Button
                          onClick={() => {
                            if (
                              window.confirm(
                                'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?'
                              )
                            ) {
                              handleRemoveItem(item.id);
                            }
                          }}
                          className="btn btn-sm btn-outline-danger d-flex align-items-center"
                          title="Xóa sản phẩm khỏi giỏ hàng"
                          style={{ minWidth: '40px', justifyContent: 'center' }}
                        >
                          <IoMdClose />
                          <span className="ml-1 d-none d-sm-inline">Xóa</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow p-3 cartDetails">
              <h4 className="mb-3 hd">Tổng giỏ hàng</h4>

              <div className="d-flex align-items-center mb-3">
                <span className="flex-grow-1">Tạm tính:</span>
                <span className="ml-auto text-red font-weight-bold">
                  {cartSummary?.total_price?.toLocaleString()}đ
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="flex-grow-1">Phí vận chuyển:</span>
                <span className="ml-auto">
                  <b>Miễn phí</b>
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="flex-grow-1">Tổng:</span>
                <span className="ml-auto text-red font-weight-bold">
                  {cartSummary?.total_price?.toLocaleString()}đ
                </span>
              </div>
              <br />

              <Button
                className="btn-blue btn-lg btn-block btn-round"
                onClick={handleCheckout}
                disabled={
                  checkingOut || !cartSummary || cartSummary.total_items === 0
                }
              >
                {checkingOut ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <IoCartOutline /> Thanh toán
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onCheckout={handleCheckoutSubmit}
        loading={checkingOut}
      />
    </section>
  );
};

export default Cart;
