import React, { useState } from 'react';
import {
  Dialog,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../custom-hooks/useAuth';
import { toast } from 'react-toastify';

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
    user_name: '',
    user_gender: 'male',
    user_birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({
          user_email: formData.user_email,
          user_password: formData.user_password,
        });
        toast.success('Đăng nhập thành công!');
        onLoginSuccess?.();
        onClose();
      } else {
        await register(formData);
        toast.success('Đăng ký thành công!');
        onLoginSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      gender: 'male',
      birth: '',
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
        },
      }}
    >
      <div className="position-relative">
        {/* Background Pattern */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="position-absolute"
          style={{
            top: '16px',
            right: '16px',
            zIndex: 1,
            minWidth: 'auto',
            padding: '8px',
            color: 'white',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        >
          <IoMdClose style={{ fontSize: '20px' }} />
        </Button>

        <div className="row g-0">
          {/* Left Side - Branding */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-5">
            <div className="text-center">
              <div className="mb-4" style={{ fontSize: '4rem' }}>
                🐾
              </div>
              <Typography
                variant="h4"
                className="mb-3"
                style={{ fontWeight: 'bold' }}
              >
                PetShop
              </Typography>
              <Typography variant="h6" style={{ opacity: 0.9 }}>
                {isLogin
                  ? 'Chào mừng bạn quay trở lại!'
                  : 'Tham gia cùng chúng tôi!'}
              </Typography>
              <Typography
                variant="body2"
                style={{ opacity: 0.8, marginTop: '16px' }}
              >
                {isLogin
                  ? 'Đăng nhập để tiếp tục mua sắm'
                  : 'Tạo tài khoản để trải nghiệm tốt nhất'}
              </Typography>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-md-6">
            <div
              className="p-5 h-100"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#333',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-center mb-4">
                <Typography
                  variant="h4"
                  className="mb-2"
                  style={{ fontWeight: 'bold', color: '#333' }}
                >
                  {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                </Typography>
                <Typography variant="body2" style={{ color: '#666' }}>
                  {isLogin
                    ? 'Đăng nhập vào tài khoản của bạn'
                    : 'Tạo tài khoản mới'}
                </Typography>
              </div>

              {error && (
                <Alert
                  severity="error"
                  className="mb-3"
                  style={{ borderRadius: '8px' }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {!isLogin && (
                    <TextField
                      label="Họ và tên"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}

                  <TextField
                    label="Email"
                    name="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />

                  <TextField
                    label="Mật khẩu"
                    name="user_password"
                    type="password"
                    value={formData.user_password}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />

                  {!isLogin && (
                    <div className="row">
                      <div className="col-md-6">
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Giới tính</InputLabel>
                          <Select
                            name="user_gender"
                            value={formData.user_gender}
                            onChange={handleInputChange}
                            label="Giới tính"
                            sx={{ borderRadius: '8px' }}
                          >
                            <MenuItem value="male">Nam</MenuItem>
                            <MenuItem value="female">Nữ</MenuItem>
                            <MenuItem value="other">Khác</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-md-6">
                        <TextField
                          label="Ngày sinh"
                          name="user_birth"
                          type="date"
                          value={formData.user_birth}
                          onChange={handleInputChange}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderRadius: '8px',
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    {loading
                      ? 'Đang xử lý...'
                      : isLogin
                        ? 'Đăng Nhập'
                        : 'Đăng Ký'}
                  </Button>

                  <div className="text-center my-3">
                    <Typography variant="body2" style={{ color: '#666' }}>
                      {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                      <Button
                        onClick={toggleMode}
                        variant="text"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'bold',
                          color: '#667eea',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                      </Button>
                    </Typography>
                  </div>

                  {/* <div className="text-center">
                    <Typography
                      variant="body2"
                      style={{ color: '#666', marginBottom: '12px' }}
                    >
                      Hoặc đăng nhập với
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<FcGoogle />}
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#ddd',
                        color: '#333',
                        '&:hover': {
                          borderColor: '#667eea',
                          background: 'rgba(102, 126, 234, 0.05)',
                        },
                      }}
                    >
                      Đăng nhập với Google
                    </Button>
                  </div> */}
                </Box>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default LoginModal;
