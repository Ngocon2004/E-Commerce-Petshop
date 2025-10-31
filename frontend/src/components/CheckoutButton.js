import React, { useState } from 'react';
import { useCart } from '../custom-hooks/useCart';
import { useAuthGuard } from '../custom-hooks/useAuthGuard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutButton = ({
  className = '',
  children = 'Đặt hàng',
  redirectTo = '/cart',
}) => {
  const { cartItems, isEmpty } = useCart();
  const { canCreateOrder } = useAuthGuard();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (isEmpty) {
      toast.warning('Giỏ hàng trống!');
      return;
    }

    try {
      setIsProcessing(true);

      // Kiểm tra xem user có đăng nhập không
      if (!canCreateOrder()) {
        return;
      }

      // Redirect đến trang checkout hoặc cart
      navigate(redirectTo);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      className={`btn btn-success ${className}`}
      onClick={handleCheckout}
      disabled={isEmpty || isProcessing}
    >
      {isProcessing ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Đang xử lý...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default CheckoutButton;
