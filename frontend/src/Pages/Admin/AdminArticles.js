import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import {
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormTextarea,
  FormImagePreview,
  AdminPageHeader,
  AdminTable,
  AdminPagination,
  AdminLoading,
  AddButton,
  ActionButtons,
  SaveButton,
  CancelButton,
} from '../../components/Admin';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    article_title: '',
    article_short_description: '',
    article_img: '',
    article_content: '',
    author: '',
  });

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getArticles({ page, limit: 10 });
      if (response?.data) {
        setArticles(response.data.articles || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      return;
    }

    try {
      await adminAPI.deleteArticle(id);
      toast.success('Đã xóa bài viết');
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Không thể xóa bài viết');
    }
  };

  const handleView = article => {
    window.open(`/articles/${article.id}`, '_blank');
  };

  const handleEdit = article => {
    setEditingArticle(article);
    setFormData({
      article_title: article.article_title || '',
      article_short_description: article.article_short_description || '',
      article_img: article.article_img || '',
      article_content: article.article_content || '',
      author: article.author || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await adminAPI.updateArticle(editingArticle.id, formData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        await adminAPI.createArticle(formData);
        toast.success('Tạo bài viết thành công!');
      }
      setShowModal(false);
      setEditingArticle(null);
      setFormData({
        article_title: '',
        article_short_description: '',
        article_img: '',
        article_content: '',
        author: '',
      });
      loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      article_title: '',
      article_short_description: '',
      article_img: '',
      article_content: '',
      author: '',
    });
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Bài viết">
        <AddButton
          onClick={() => {
            setEditingArticle(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Thêm bài viết
        </AddButton>
      </AdminPageHeader>

      <AdminTable
        headers={['Hình ảnh', 'Tiêu đề', 'Tác giả', 'Ngày tạo', 'Thao tác']}
        data={articles}
        emptyMessage="Không có bài viết nào"
      >
        {articles.map(article => (
          <tr key={article.id}>
            <td>
              {article.article_img && (
                <img
                  src={article.article_img}
                  alt={article.article_title}
                  className="img-thumbnail"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </td>
            <td>
              <div>
                <strong className="text-dark">{article.article_title}</strong>
                <br />
                <small className="text-muted">
                  {article.article_short_description?.substring(0, 50)}...
                </small>
              </div>
            </td>
            <td>
              <span className="fw-semibold">{article.author}</span>
            </td>
            <td>
              <small className="text-muted">
                {new Date(article.created_at).toLocaleDateString('vi-VN')}
              </small>
            </td>
            <td>
              <ActionButtons
                onView={() => handleView(article)}
                onEdit={() => handleEdit(article)}
                onDelete={() => handleDelete(article.id)}
                showView={true}
              />
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
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingArticle ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        size="xl"
        footer={
          <div className="d-flex justify-content-end">
            <CancelButton onClick={() => setShowModal(false)} />
            <SaveButton onClick={handleSubmit}>
              {editingArticle ? 'Cập nhật' : 'Tạo mới'}
            </SaveButton>
          </div>
        }
      >
        <AdminForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <FormGroup label="Tiêu đề bài viết" required>
                <FormInput
                  value={formData.article_title}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      article_title: e.target.value,
                    })
                  }
                  placeholder="Nhập tiêu đề bài viết"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="Tác giả">
                <FormInput
                  value={formData.author}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      author: e.target.value,
                    })
                  }
                  placeholder="Tên tác giả"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup label="URL hình ảnh">
                <FormInput
                  type="url"
                  value={formData.article_img}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      article_img: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormImagePreview src={formData.article_img} alt="Preview" />
            </div>
            <div className="col-12">
              <FormGroup label="Mô tả ngắn">
                <FormTextarea
                  value={formData.article_short_description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      article_short_description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Mô tả ngắn về bài viết"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup label="Nội dung bài viết" required>
                <FormTextarea
                  value={formData.article_content}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      article_content: e.target.value,
                    })
                  }
                  rows={10}
                  placeholder="Nội dung chi tiết của bài viết"
                />
              </FormGroup>
            </div>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default AdminArticles;
