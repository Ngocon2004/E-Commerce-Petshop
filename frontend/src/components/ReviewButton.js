import React, { useState } from 'react';
import { useAuthGuard } from '../custom-hooks/useAuthGuard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ReviewButton = ({
  productId,
  className = '',
  children = 'Đánh giá sản phẩm',
  redirectTo = null,
}) => {
  const { canReview } = useAuthGuard();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReview = async () => {
    try {
      setIsProcessing(true);

      // Kiểm tra xem user có đăng nhập không
      if (!canReview()) {
        return;
      }

      // Redirect đến trang đánh giá hoặc mở modal
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        // Có thể mở modal đánh giá ở đây
        toast.info('Tính năng đánh giá sẽ được mở');
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Có lỗi xảy ra khi đánh giá');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      className={`btn btn-outline-primary ${className}`}
      onClick={handleReview}
      disabled={isProcessing}
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

export default ReviewButton;
