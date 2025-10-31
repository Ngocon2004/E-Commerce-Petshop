import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

// Hook để kiểm tra authentication cho các action cần đăng nhập
export const useAuthGuard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Kiểm tra xem user có đăng nhập không, nếu không thì redirect đến trang login
  const requireAuth = (action = 'thực hiện hành động này') => {
    if (!isAuthenticated) {
      // Lưu URL hiện tại để redirect lại sau khi đăng nhập
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);

      // Redirect đến trang login
      navigate('/signin');

      // Hiển thị thông báo
      alert(`Bạn cần đăng nhập để ${action}`);
      return false;
    }
    return true;
  };

  // Kiểm tra xem user có phải admin không
  const requireAdmin = (action = 'thực hiện hành động này') => {
    if (!requireAuth(action)) {
      return false;
    }

    if (!user?.user_active || user?.user_role !== 'admin') {
      alert('Bạn không có quyền truy cập tính năng này');
      return false;
    }
    return true;
  };

  // Kiểm tra xem có thể thêm vào giỏ hàng không (cần đăng nhập)
  const canAddToCart = () => {
    return requireAuth('thêm sản phẩm vào giỏ hàng');
  };

  // Kiểm tra xem có thể tạo đơn hàng không (cần đăng nhập)
  const canCreateOrder = () => {
    return requireAuth('tạo đơn hàng');
  };

  // Kiểm tra xem có thể đánh giá không (cần đăng nhập)
  const canReview = () => {
    return requireAuth('đánh giá sản phẩm');
  };

  // Kiểm tra xem có thể xem profile không (cần đăng nhập)
  const canViewProfile = () => {
    return requireAuth('xem thông tin cá nhân');
  };

  return {
    requireAuth,
    requireAdmin,
    canAddToCart,
    canCreateOrder,
    canReview,
    canViewProfile,
    isAuthenticated,
    user,
  };
};
