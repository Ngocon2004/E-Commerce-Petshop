import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import {
  AdminPageHeader,
  AdminTable,
  AdminPagination,
  AdminLoading,
  ActionButtons,
  AdminModal,
} from '../../components/Admin';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [review, setReview] = useState(null);
  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllReviews({ page, limit: 10 });
      if (response?.data) {
        setReviews(response.data.reviews || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      return;
    }

    try {
      await adminAPI.deleteReview(id);
      toast.success('Đã xóa đánh giá');
      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Không thể xóa đánh giá');
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Đánh giá" />

      <AdminTable
        headers={[
          'Người dùng',
          'Sản phẩm',
          'Đánh giá',
          'Nội dung',
          'Ngày tạo',
          'Thao tác',
        ]}
        data={reviews}
        emptyMessage="Không có đánh giá nào"
      >
        {reviews.map(review => (
          <tr key={review.id}>
            <td>
              <div>
                <strong className="text-dark">
                  {review.user_name || 'Người dùng'}
                </strong>
              </div>
            </td>
            <td>
              <div>
                <strong className="text-dark">{review.product_name}</strong>
                {review.variant_name && (
                  <>
                    <br />
                    <Chip
                      label={review.variant_name}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  </>
                )}
              </div>
            </td>
            <td>
              <Rating value={review.rating} readOnly size="small" />
              <br />
              <small className="text-muted">{review.rating}/5 sao</small>
            </td>
            <td>
              <div style={{ maxWidth: '300px' }}>
                <p className="mb-0 text-truncate" title={review.review_text}>
                  {review.review_text}
                </p>
              </div>
            </td>
            <td>
              <small className="text-muted">
                {new Date(review.created_at).toLocaleString('vi-VN')}
              </small>
            </td>
            <td>
              <ActionButtons
                onView={() => {
                  setShowViewModal(true);
                  setReview(review);
                }}
                onDelete={() => handleDelete(review.id)}
                showView={true}
                showEdit={false}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Xem đánh giá"
      >
        <>
          <div></div>
          <h5>Người dùng</h5>
          <p>{review?.user_name}</p>

          <div>
            <h5>Sản phẩm</h5>
            <p>{review?.product_name}</p>
            <Chip
              label={review?.variant_name}
              size="small"
              variant="outlined"
              color="info"
            />
          </div>
          <div>
            <h5>Đánh giá {review?.rating}/5 sao</h5>
            <Rating value={review?.rating} readOnly size="small" />
            <br />
          </div>
          <div>
            <h5>Nội dung</h5>
            <p>{review?.review_text}</p>
          </div>
          <div>
            <h5>Ngày tạo</h5>
            <p>{new Date(review?.created_at).toLocaleString('vi-VN')}</p>
          </div>
        </>
      </AdminModal>
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminReviews;
