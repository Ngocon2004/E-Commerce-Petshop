import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../../api';
import { toast } from 'react-toastify';
import ArticleCard from '../../Compoments/ArticleCard';
import { FaArrowLeft, FaCalendar, FaPrint, FaUser } from 'react-icons/fa';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await articlesAPI.getArticleById(id);
      setArticle(response.data.article);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err);
      toast.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await articlesAPI.getRecentArticles(4);
      setRelatedArticles(response.data.articles);
    } catch (err) {
      console.error('Error fetching related articles:', err);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '300px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger text-center">
          <h5>Không tìm thấy bài viết</h5>
          <p className="mb-3">Bài viết có thể đã bị xóa hoặc không tồn tại</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/articles')}
          >
            Quay lại danh sách bài viết
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-8">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => navigate('/')}
                  >
                    Trang chủ
                  </button>
                </li>
                <li className="breadcrumb-item">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => navigate('/articles')}
                  >
                    Bài viết
                  </button>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {article.article_title}
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="article-header mb-4">
              <h1 className="article-title">{article.article_title}</h1>

              <div className="article-meta d-flex flex-wrap align-items-center mb-3">
                {article.author && (
                  <div className="me-4 align-items-center d-flex">
                    <FaUser />
                    <span className="text-muted pl-2">{article.author}</span>
                  </div>
                )}
                {article.published_date && (
                  <div className="pl-2 me-4 align-items-center d-flex">
                    <FaCalendar />
                    <span className="text-muted pl-2">
                      {formatDate(article.published_date)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-muted">
                    {formatDate(article.created_at)}
                  </span>
                </div>
              </div>

              {article.article_short_description && (
                <div className="article-excerpt">
                  <p className="lead text-muted">
                    {article.article_short_description}
                  </p>
                </div>
              )}
            </div>

            {/* Article Image */}
            {article.article_img && (
              <div className="article-image mb-4">
                <img
                  src={article.article_img}
                  alt={article.article_title}
                  className="img-fluid rounded shadow-sm"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={e => {
                    e.target.src =
                      'https://via.placeholder.com/800x400?text=Article+Image';
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="article-content">
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: article.article_content.replace(/\n/g, '<br>'),
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="article-footer mt-5 pt-4 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Cập nhật lần cuối: {formatDate(article.updated_at)}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-primary btn-sm me-2 mr-2"
                    onClick={() => window.print()}
                  >
                    <FaPrint />
                    In bài viết
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => window.history.back()}
                  >
                    <FaArrowLeft />
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="related-articles mb-4">
                  <h5 className="mb-3">📰 Bài viết liên quan</h5>
                  <div className="row">
                    {relatedArticles
                      .filter(
                        relatedArticle => relatedArticle.id !== article.id
                      )
                      .slice(0, 3)
                      .map(relatedArticle => (
                        <div key={relatedArticle.id} className="col-12 mb-3">
                          <ArticleCard
                            article={relatedArticle}
                            className="h-100"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="cta-section">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h5 className="card-title">🐾 Yêu thú cưng?</h5>
                    <p className="card-text">
                      Khám phá thêm các sản phẩm chất lượng cho thú cưng của bạn
                    </p>
                    <button
                      className="btn btn-light"
                      onClick={() => navigate('/products')}
                    >
                      Xem sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
