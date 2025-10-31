import React from 'react';
import { useAuth } from '../custom-hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AuthRequiredMessage = ({
  message = 'Bạn cần đăng nhập để sử dụng tính năng này',
  showLoginButton = true,
  showRegisterButton = true,
  className = 'alert alert-info',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Nếu đã đăng nhập thì không hiển thị
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className={className}>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="mb-1">Đăng nhập để tiếp tục</h6>
          <p className="mb-0">{message}</p>
        </div>
        <div className="ms-3">
          {showLoginButton && (
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          )}
          {showRegisterButton && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleRegister}
            >
              Đăng ký
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredMessage;
