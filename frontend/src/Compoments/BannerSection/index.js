import React, { useState, useEffect } from 'react';
import { bannersAPI } from '../../api';
import { toast } from 'react-toastify';

const BannerSection = ({ position, title, className = '' }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await bannersAPI.getBannersByPosition(position, 2);
        setBanners(response.data.banners);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err);
        toast.error('Không thể tải banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [position]);

  if (loading) {
    return (
      <div className={`banner-section ${className}`}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '200px' }}
        >
          <div className="spinner-border text-primary" role="status">
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
    <div className="row w-100">
      {banners.map(banner => (
        <div key={banner.id} className="col-6 mb-3">
          <div style={{ width: '100%' }}>
            {banner.banner_link ? (
              <a
                href={banner.banner_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '100%' }}
              >
                <img
                  src={banner.banner_image}
                  alt={banner.banner_title}
                  className="img-fluid rounded shadow-sm"
                  style={{
                    height: '150px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onError={e => {
                    e.target.src =
                      'https://via.placeholder.com/400x150?text=Banner+Image';
                  }}
                />
              </a>
            ) : (
              <img
                src={banner.banner_image}
                alt={banner.banner_title}
                className="img-fluid rounded shadow-sm"
                style={{
                  height: '150px',
                  objectFit: 'cover',
                  width: '100%',
                }}
                onError={e => {
                  e.target.src =
                    'https://via.placeholder.com/400x150?text=Banner+Image';
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSection;
