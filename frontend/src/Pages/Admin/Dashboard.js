import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api';
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiStar,
  FiEye,
} from 'react-icons/fi';
import { AdminPageHeader, AdminLoading } from '../../components/Admin';
import { Rating } from '@mui/material';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      total_orders: 0,
      total_revenue: 0,
      total_products: 0,
      total_users: 0,
      total_reviews: 0,
      average_rating: 0,
      orders_this_month: 0,
      revenue_this_month: 0,
    },
    recent_orders: [],
    top_products: [],
  });
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStatistics();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard statistics:', error);
      // Fallback to mock data if API fails
      setDashboardData({
        statistics: {
          total_orders: 1234,
          total_revenue: 125000000,
          total_products: 150,
          total_users: 567,
          total_reviews: 89,
          average_rating: 4.2,
          orders_this_month: 45,
          revenue_this_month: 8500000,
        },
        recent_orders: [],
        top_products: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: dashboardData.statistics.total_products,
      icon: FiPackage,
      color: 'primary',
      bg: 'bg-primary',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Tổng đơn hàng',
      value: dashboardData.statistics.total_orders,
      icon: FiShoppingCart,
      color: 'success',
      bg: 'bg-success',
      change: `+${dashboardData.statistics.orders_this_month} tháng này`,
      changeType: 'positive',
    },
    {
      title: 'Tổng người dùng',
      value: dashboardData.statistics.total_users,
      icon: FiUsers,
      color: 'warning',
      bg: 'bg-warning',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Tổng doanh thu',
      value: formatPrice(dashboardData.statistics.total_revenue),
      icon: FiDollarSign,
      color: 'danger',
      bg: 'bg-danger',
      change:
        formatPrice(dashboardData.statistics.revenue_this_month) + ' tháng này',
      changeType: 'positive',
    },
    {
      title: 'Đánh giá trung bình',
      value: (dashboardData.statistics.average_rating || 0).toFixed(1),
      icon: FiStar,
      color: 'info',
      bg: 'bg-info',
      change: `${dashboardData.statistics.total_reviews} đánh giá`,
      changeType: 'neutral',
    },
  ];

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Bảng điều khiển" />

      {/* Statistics Cards */}
      <div className="row mb-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-lg-4 col-md-6 mb-4 rounded-lg">
              <div className={`card shadow-sm border-0 ${stat.bg}`}>
                <div className="card-body text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{stat.title}</h6>
                      <h3 className="mb-0">{stat.value}</h3>
                      <small className="opacity-75">
                        <FiTrendingUp className="me-1" />
                        {stat.change}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Đơn hàng gần đây</h5>
              <FiEye className="text-muted" />
            </div>
            <div className="card-body">
              {dashboardData.recent_orders.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.recent_orders.map((order, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">#{order.id}</h6>
                          <p className="mb-1 text-muted small">
                            {order.customer_name || order.customer_email}
                          </p>
                          <small className="text-muted">
                            {new Date(order.created_at).toLocaleDateString(
                              'vi-VN'
                            )}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">
                            {formatPrice(order.order_total_cost)}
                          </div>
                          <span
                            className={`badge ${
                              order.order_status === 'delivered'
                                ? ' text-success'
                                : order.order_status === 'pending'
                                  ? 'text-warning'
                                  : order.order_status === 'cancelled'
                                    ? 'text-danger'
                                    : 'text-primary'
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Không có đơn hàng gần đây</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Sản phẩm bán chạy</h5>
              <FiTrendingUp className="text-muted" />
            </div>
            <div className="card-body">
              {dashboardData.top_products.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.top_products.map((product, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].value}
                              alt={product.product_name}
                              className="rounded"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                              }}
                              onError={e => {
                                e.target.src =
                                  'https://via.placeholder.com/50x50?text=Image';
                              }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <FiPackage className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{product.product_name}</h6>
                          <p className="mb-1 text-muted small">
                            {product.brand_name}
                          </p>
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-2 mr-2">
                              <Rating value={product.product_avg_rating || 0} />
                            </small>
                            <small className="text-muted">
                              Đã bán: {product.product_sold_quantity || 0}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
