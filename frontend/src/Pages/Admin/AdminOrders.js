import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { FiUser, FiMapPin, FiCheck, FiX, FiEye } from 'react-icons/fi';
import Chip from '@mui/material/Chip';
import {
  AdminModal,
  AdminPageHeader,
  AdminSearch,
  AdminTable,
  AdminPagination,
  AdminLoading,
  ActionButtons,
} from '../../components/Admin';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search: searchTerm };
      const response = await adminAPI.getAllOrders(params);
      if (response?.data) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusBadge = status => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: 'warning' },
      confirmed: { label: 'Đã xác nhận', color: 'info' },
      processing: { label: 'Đang xử lý', color: 'primary' },
      shipped: { label: 'Đang giao hàng', color: 'primary' },
      delivered: { label: 'Hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'danger' },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      color: 'secondary',
    };

    return (
      <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
    );
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Đã cập nhật trạng thái đơn hàng');
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleViewOrder = async order => {
    try {
      const response = await adminAPI.getOrderDetails(order.id);
      setSelectedOrder(response.data.order);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Đơn hàng" />

      <AdminSearch
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm đơn hàng..."
      />

      <AdminTable
        headers={[
          'Mã đơn',
          'Khách hàng',
          'Tổng tiền',
          'Trạng thái',
          'Ngày đặt',
          'Thao tác',
        ]}
        data={orders}
        emptyMessage="Không có đơn hàng nào"
      >
        {orders.map(order => (
          <tr key={order.id}>
            <td>
              <span className="badge ">#{order.id}</span>
            </td>
            <td>
              <div>
                <strong className="text-dark">
                  {order.user_name || 'N/A'}
                </strong>
                <br />
                <small className="text-muted">{order.user_email}</small>
              </div>
            </td>
            <td>
              <span className="fw-bold text-success">
                {Number(order?.order_total_cost).toLocaleString()}đ
              </span>
            </td>
            <td>{getStatusBadge(order.order_status)}</td>
            <td>
              <small className="text-muted">
                {new Date(order.created_at).toLocaleDateString('vi-VN')}
              </small>
            </td>
            <td>
              <div className="d-flex gap-2">
                <ActionButtons
                  onView={() => handleViewOrder(order)}
                  showView={true}
                  showEdit={false}
                  showDelete={false}
                />
                {order.order_status === 'pending' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-success mr-2"
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      title="Xác nhận"
                    >
                      <FiCheck />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      title="Hủy đơn"
                    >
                      <FiX />
                    </button>
                  </>
                )}
                {order.order_status === 'confirmed' && (
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => handleUpdateStatus(order.id, 'processing')}
                    title="Xử lý đơn hàng"
                  >
                    <FiEye /> Xử lý
                  </button>
                )}
                {order.order_status === 'processing' && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                    title="Giao hàng"
                  >
                    <FiEye /> Giao hàng
                  </button>
                )}
                {order.order_status === 'shipped' && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    title="Hoàn thành"
                  >
                    <FiCheck /> Hoàn thành
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AdminModal
        show={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="xl"
        footer={
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowOrderModal(false)}
            >
              Đóng
            </button>
          </div>
        }
      >
        {selectedOrder && (
          <div className="row">
            {/* Customer Information */}
            <div className="col-md-6 mb-4">
              <h6 className="mb-3">
                <FiUser className="me-2" />
                Thông tin khách hàng
              </h6>
              <div className="card">
                <div className="card-body">
                  <p>
                    <strong>Tên:</strong> {selectedOrder.user_name || 'N/A'}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user_email || 'N/A'}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{' '}
                    {selectedOrder.user_phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="col-md-6 mb-4">
              <h6 className="mb-3">
                <FiMapPin className="me-2" />
                Thông tin đơn hàng
              </h6>
              <div className="card">
                <div className="card-body">
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    {getStatusBadge(selectedOrder.order_status)}
                  </p>
                  <p>
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{' '}
                    {selectedOrder.payment_method || 'N/A'}
                  </p>
                  <p>
                    <strong>Phương thức giao hàng:</strong>{' '}
                    {selectedOrder.shipping_method || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="col-12 mb-4">
              <h6 className="mb-3">
                <FiMapPin className="me-2" />
                Địa chỉ giao hàng
              </h6>
              <div className="card">
                <div className="card-body">
                  <p>{selectedOrder.order_address || 'N/A'}</p>
                  {selectedOrder.order_note && (
                    <p>
                      <strong>Ghi chú:</strong> {selectedOrder.order_note}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="col-12 mb-4">
              <h6 className="mb-3">Sản phẩm trong đơn hàng</h6>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.order_details?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item.product_image && (
                                  <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      marginRight: '10px',
                                    }}
                                  />
                                )}
                                <div>
                                  <strong>{item.product_name}</strong>
                                  {item.variant_name && (
                                    <div className="text-muted small">
                                      {item.variant_name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unit_price?.toLocaleString()}đ</td>
                            <td>{item?.total_price?.toLocaleString()}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Tổng kết đơn hàng</h6>
                    </div>
                    <div className="col-md-6 text-end">
                      <p>
                        <strong>Tổng tiền hàng:</strong>{' '}
                        {Number(
                          selectedOrder?.order_total_cost
                        ).toLocaleString()}
                        đ
                      </p>
                      <p>
                        <strong>Phí vận chuyển:</strong> {0}đ
                      </p>
                      <p>
                        <strong>Phí thanh toán:</strong> {0}đ
                      </p>
                      <hr />
                      <h5>
                        <strong>
                          Tổng cộng:{' '}
                          {Number(
                            selectedOrder?.order_total_cost || 0
                          ).toLocaleString()}
                          đ
                        </strong>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminOrders;
