import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuth } from '../../custom-hooks/useAuth';
import { ordersAPI } from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getUserOrders();
        setOrders(response?.data?.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Không thể tải danh sách đơn hàng');
        toast.error('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

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

  const handleCancelOrder = async orderId => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const response = await ordersAPI.cancelOrder(orderId);
      if (response && response.success) {
        toast.success('Đã hủy đơn hàng');
        // Refresh orders list
        const updatedResponse = await ordersAPI.getUserOrders();
        setOrders(updatedResponse?.data?.orders || []);
      } else {
        toast.error('Không thể hủy đơn hàng');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  const handleViewOrder = orderId => {
    navigate(`/orders/${orderId}`);
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="section ordersPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Đơn hàng của bạn</h2>
            <p className="mb-4">Bạn cần đăng nhập để xem đơn hàng</p>
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
      <section className="section ordersPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Đang tải đơn hàng...</h2>
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
      <section className="section ordersPage">
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

  // Show empty orders
  if (orders.length === 0) {
    return (
      <section className="section ordersPage">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="hd mb-4">Chưa có đơn hàng nào</h2>
            <p className="mb-4">Bạn chưa có đơn hàng nào</p>
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

  return (
    <section className="section ordersPage">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="hd mb-0">Đơn hàng của bạn</h2>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            startIcon={<FiRefreshCw />}
          >
            Làm mới
          </Button>
        </div>

        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Đơn hàng #{order?.id}</h6>
                  <span
                    className={`badge badge-${getStatusColor(order?.order_status)}`}
                  >
                    {getStatusIcon(order?.order_status)}{' '}
                    {getStatusText(order?.order_status)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="mb-2">
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="mb-2">
                    <strong>Tổng tiền:</strong>
                    <span className="text-danger font-weight-bold ml-1">
                      {order.order_total_cost?.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Phương thức thanh toán:</strong>{' '}
                    {order.payment_method === 'cod'
                      ? 'Thanh toán khi nhận hàng'
                      : order.payment_method}
                  </div>

                  <div className="mb-2">
                    <strong>Địa chỉ:</strong>
                    <small className="d-block text-muted">
                      {order?.detail}, {order?.ward}, {order?.district},{' '}
                      {order?.province}
                    </small>
                  </div>

                  {order?.order_note && (
                    <div className="mb-2">
                      <strong>Ghi chú:</strong>
                      <small className="d-block text-muted">
                        {order?.order_note}
                      </small>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewOrder(order.id)}
                      startIcon={<FiEye />}
                    >
                      Chi tiết
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Orders;
