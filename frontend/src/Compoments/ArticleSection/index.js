import React, { useState, useEffect } from 'react';
import { articlesAPI } from '../../api';
import { toast } from 'react-toastify';
import ArticleCard from '../ArticleCard';
import { Link } from 'react-router-dom';

const ArticleSection = ({
  title = ' Bài Viết Mới Nhất',
  limit = 4,
  showViewAll = true,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [limit]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await articlesAPI.getRecentArticles(limit);
      setArticles(response.data.articles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err);
      // Không hiển thị toast error cho section này
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="article-section">
        <div className="container my-4">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '200px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return null; // Không hiển thị gì nếu không có bài viết
  }

  return (
    <div className="article-section">
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">{title}</h3>
              {showViewAll && (
                <Link to="/articles" className="btn btn-outline-primary">
                  Xem tất cả
                </Link>
              )}
            </div>

            <div className="row">
              {articles.map(article => (
                <div key={article.id} className="col-lg-3 col-md-6 mb-4">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSection;
