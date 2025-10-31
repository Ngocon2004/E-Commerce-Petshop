import React, { useState } from 'react';
import {
  Dialog,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

const CheckoutModal = ({ open, onClose, onCheckout, loading }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_phone: '',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    detail: '',
    order_note: '',
    payment_method: 'cod',
    shipping_method: 'standard',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Vui lòng nhập họ tên';
    }

    if (!formData.user_phone.trim()) {
      newErrors.user_phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.user_phone.replace(/\s/g, ''))) {
      newErrors.user_phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.detail.trim()) {
      newErrors.detail = 'Vui lòng nhập địa chỉ chi tiết';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    // Prepare order data
    const orderData = {
      order_address: {
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        detail: formData.detail,
        user_phone: formData.user_phone,
        user_name: formData.user_name,
      },
      order_note: formData.order_note || 'Đơn hàng từ giỏ hàng',
      payment_method: formData.payment_method,
      shipping_method: formData.shipping_method,
    };

    onCheckout(orderData);
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      user_name: '',
      user_phone: '',
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      detail: '',
      order_note: '',
      payment_method: 'cod',
      shipping_method: 'standard',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
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
          onClick={handleClose}
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
          <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center p-5">
            <div className="text-center">
              <div className="mb-4" style={{ fontSize: '4rem' }}>
                🛒
              </div>
              <Typography
                variant="h4"
                className="mb-3"
                style={{ fontWeight: 'bold' }}
              >
                Thanh Toán
              </Typography>
              <Typography variant="h6" style={{ opacity: 0.9 }}>
                Hoàn tất đơn hàng của bạn
              </Typography>
              <Typography
                variant="body2"
                style={{ opacity: 0.8, marginTop: '16px' }}
              >
                Vui lòng nhập thông tin giao hàng để hoàn tất đơn hàng
              </Typography>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-md-8">
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
                  Thông Tin Giao Hàng
                </Typography>
                <Typography variant="body2" style={{ color: '#666' }}>
                  Vui lòng điền đầy đủ thông tin bên dưới
                </Typography>
              </div>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Personal Information */}
                  <div className="row">
                    <div className="col-md-6">
                      <TextField
                        label="Họ và tên *"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        variant="outlined"
                        error={!!errors.user_name}
                        helperText={errors.user_name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <TextField
                        label="Số điện thoại *"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        variant="outlined"
                        error={!!errors.user_phone}
                        helperText={errors.user_phone}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="row">
                    <div className="col-md-4">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Tỉnh/Thành phố</InputLabel>
                        <Select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          label="Tỉnh/Thành phố"
                          sx={{ borderRadius: '8px' }}
                        >
                          <MenuItem value="Hồ Chí Minh">Hồ Chí Minh</MenuItem>
                          <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                          <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                          <MenuItem value="Cần Thơ">Cần Thơ</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-4">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Quận/Huyện</InputLabel>
                        <Select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          label="Quận/Huyện"
                          sx={{ borderRadius: '8px' }}
                        >
                          <MenuItem value="Quận 1">Quận 1</MenuItem>
                          <MenuItem value="Quận 2">Quận 2</MenuItem>
                          <MenuItem value="Quận 3">Quận 3</MenuItem>
                          <MenuItem value="Quận 4">Quận 4</MenuItem>
                          <MenuItem value="Quận 5">Quận 5</MenuItem>
                          <MenuItem value="Quận 6">Quận 6</MenuItem>
                          <MenuItem value="Quận 7">Quận 7</MenuItem>
                          <MenuItem value="Quận 8">Quận 8</MenuItem>
                          <MenuItem value="Quận 9">Quận 9</MenuItem>
                          <MenuItem value="Quận 10">Quận 10</MenuItem>
                          <MenuItem value="Quận 11">Quận 11</MenuItem>
                          <MenuItem value="Quận 12">Quận 12</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-4">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Phường/Xã</InputLabel>
                        <Select
                          name="ward"
                          value={formData.ward}
                          onChange={handleInputChange}
                          label="Phường/Xã"
                          sx={{ borderRadius: '8px' }}
                        >
                          <MenuItem value="Phường Bến Nghé">
                            Phường Bến Nghé
                          </MenuItem>
                          <MenuItem value="Phường Đa Kao">
                            Phường Đa Kao
                          </MenuItem>
                          <MenuItem value="Phường Cầu Kho">
                            Phường Cầu Kho
                          </MenuItem>
                          <MenuItem value="Phường Cầu Ông Lãnh">
                            Phường Cầu Ông Lãnh
                          </MenuItem>
                          <MenuItem value="Phường Nguyễn Thái Bình">
                            Phường Nguyễn Thái Bình
                          </MenuItem>
                          <MenuItem value="Phường Phạm Ngũ Lão">
                            Phường Phạm Ngũ Lão
                          </MenuItem>
                          <MenuItem value="Phường Tân Định">
                            Phường Tân Định
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  {/* Detail Address */}
                  <TextField
                    label="Địa chỉ chi tiết *"
                    name="detail"
                    value={formData.detail}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Số nhà, tên đường, tòa nhà..."
                    error={!!errors.detail}
                    helperText={errors.detail}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />

                  {/* Order Note */}
                  <TextField
                    label="Ghi chú đơn hàng"
                    name="order_note"
                    value={formData.order_note}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />

                  {/* Payment Method */}
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      label="Phương thức thanh toán"
                      sx={{ borderRadius: '8px' }}
                    >
                      <MenuItem value="cod">
                        Thanh toán khi nhận hàng (COD)
                      </MenuItem>
                      <MenuItem value="bank_transfer">
                        Chuyển khoản ngân hàng
                      </MenuItem>
                      <MenuItem value="momo">Ví MoMo</MenuItem>
                      <MenuItem value="zalopay">Ví ZaloPay</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Shipping Method */}
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Phương thức giao hàng</InputLabel>
                    <Select
                      name="shipping_method"
                      value={formData.shipping_method}
                      onChange={handleInputChange}
                      label="Phương thức giao hàng"
                      sx={{ borderRadius: '8px' }}
                    >
                      <MenuItem value="standard">
                        Giao hàng tiêu chuẩn (3-5 ngày)
                      </MenuItem>
                      <MenuItem value="express">
                        Giao hàng nhanh (1-2 ngày)
                      </MenuItem>
                      <MenuItem value="same_day">Giao hàng trong ngày</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Submit Button */}
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
                    {loading ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CheckoutModal;
