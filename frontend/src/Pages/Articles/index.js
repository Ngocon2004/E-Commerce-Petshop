import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import ArticleCard from '../../Compoments/ArticleCard';
import { articlesAPI } from '../../api';
import { IoMdSearch } from 'react-icons/io';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  // Refs to track component state
  const isFirstMount = useRef(true);
  const abortControllerRef = useRef(null);

  const fetchArticles = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Only show full loading on first mount, use isSearching for subsequent calls
      if (isFirstMount.current) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        author: authorFilter,
      };

      const response = await articlesAPI.getArticles(params);

      setArticles(response.data.articles);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.message === 'canceled') {
        return;
      }
      console.error('Error fetching articles:', err);
      setError(err);
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
      setIsSearching(false);
      isFirstMount.current = false;
    }
  }, [pagination.page, pagination.limit, searchTerm, authorFilter]);

  // Single effect with debouncing for search/filter, immediate for pagination
  useEffect(() => {
    // For pagination changes, fetch immediately
    if (!isFirstMount.current && pagination.page !== 1) {
      fetchArticles();
      return;
    }

    // For search/filter changes or initial load, use debouncing
    const timeoutId = setTimeout(
      () => {
        fetchArticles();
      },
      isFirstMount.current ? 0 : 1000
    ); // No delay on first mount, 500ms delay for searches

    return () => {
      clearTimeout(timeoutId);
      // Cancel pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, authorFilter, pagination.page, pagination.limit]);

  const handleSearch = e => {
    e.preventDefault();
    // Reset to page 1 when searching
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleSearchChange = value => {
    setSearchTerm(value);
    // Reset to page 1 when search term changes
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleAuthorChange = value => {
    setAuthorFilter(value);
    // Reset to page 1 when filter changes
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handlePageChange = page => {
    setPagination(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="articles-page">
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">📰 Bài Viết & Tin Tức</h2>

            {/* Search and Filter */}
            <div className="row mb-4">
              <div className="col-md-8">
                <form
                  onSubmit={handleSearch}
                  className="d-flex"
                  style={{ border: '1px solid #000', borderRadius: '5px' }}
                >
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ border: 'none', borderRadius: '5px' }}
                    disabled={isSearching}
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{ border: 'none', borderRadius: '5px' }}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Đang tìm...</span>
                      </div>
                    ) : (
                      <IoMdSearch />
                    )}
                  </button>
                </form>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lọc theo tác giả..."
                  value={authorFilter}
                  onChange={e => handleAuthorChange(e.target.value)}
                  disabled={isSearching}
                />
              </div>
            </div>

            {error ? (
              <div className="alert alert-danger text-center">
                <h5>Không thể tải danh sách bài viết</h5>
                <p className="mb-0">Vui lòng thử lại sau</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="alert alert-info text-center">
                <h5>Không có bài viết nào</h5>
                <p className="mb-0">Hãy quay lại sau để xem các bài viết mới</p>
              </div>
            ) : (
              <>
                <div className="row">
                  {articles.map(article => (
                    <div key={article.id} className="col-lg-4 col-md-6 mb-4">
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <nav aria-label="Articles pagination" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          Trước
                        </button>
                      </li>

                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map(page => (
                        <li
                          key={page}
                          className={`page-item ${pagination.page === page ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        >
                          Sau
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
