import React from 'react';
import { FaCalendar, FaNewspaper, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article, className = '' }) => {
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`article-card ${className} h-100`}>
      <div className="card h-100 shadow-sm">
        {article.article_img && (
          <div className="position-relative">
            <img
              src={article.article_img}
              alt={article.article_title}
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
              onError={e => {
                e.target.src =
                  'https://via.placeholder.com/400x200?text=Article+Image';
              }}
            />
            {/* <div className="position-absolute top-0 end-0 m-2">
              <span className="badge bg-primary">
                <FaNewspaper />
              </span>
            </div> */}
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{article.article_title}</h5>
          <p className="card-text text-muted flex-grow-1">
            {truncateText(
              article.article_short_description || article.article_content
            )}
          </p>

          <div className="mt-auto">
            {article.author && (
              <div className="d-flex align-items-center mb-2">
                <small className="text-muted">
                  <FaUser /> {article.author}
                </small>
              </div>
            )}

            {article.published_date && (
              <div className="d-flex align-items-center mb-2">
                <small className="text-muted">
                  <FaCalendar /> {formatDate(article.published_date)}
                  {formatDate(article.published_date)}
                </small>
              </div>
            )}

            <Link
              to={`/articles/${article.id}`}
              className="btn btn-outline-primary btn-sm w-100"
            >
              Đọc thêm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
