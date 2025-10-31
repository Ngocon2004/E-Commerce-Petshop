import React, { useState, useEffect } from 'react';
import { bannersAPI } from '../../api';
import { toast } from 'react-toastify';

const SidebarBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await bannersAPI.getBannersByPosition('sidebar', 2);
        setBanners(response.data.banners);
      } catch (err) {
        console.error('Error fetching sidebar banners:', err);
        setError(err);
        // Không hiển thị toast error cho sidebar banners
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="sidebar-banners">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100px' }}
        >
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null; // Không hiển thị gì nếu không có banners
  }

  return (
    <div className="sidebar-banners">
      {banners.map(banner => (
        <div key={banner.id} className="banner-item mb-3">
          {banner.banner_link ? (
            <a
              href={banner.banner_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={banner.banner_image}
                alt={banner.banner_title}
                className="img-fluid rounded shadow-sm"
                style={{
                  height: '120px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  width: '100%',
                }}
                onError={e => {
                  e.target.src =
                    'https://via.placeholder.com/300x120?text=Banner+Image';
                }}
              />
            </a>
          ) : (
            <img
              src={banner.banner_image}
              alt={banner.banner_title}
              className="img-fluid rounded shadow-sm"
              style={{
                height: '120px',
                objectFit: 'cover',
                width: '100%',
              }}
              onError={e => {
                e.target.src =
                  'https://via.placeholder.com/300x120?text=Banner+Image';
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarBanners;
