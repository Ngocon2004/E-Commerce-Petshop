import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import { bannersAPI } from '../../../api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy banners cho vị trí top
        const response = await bannersAPI.getBannersByPosition('top', 5);
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
  }, []);

  // Custom arrow components with slider control
  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Tắt arrows mặc định
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  if (loading) {
    return (
      <div className="container mt-1">
        <div className="homeBannerSection">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '300px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div className="container mt-1">
        <div className="homeBannerSection">
          <div className="alert alert-warning text-center">
            <h5>Không có banner nào để hiển thị</h5>
            <p className="mb-0">Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-1">
      <div className="homeBannerSection" style={{ position: 'relative' }}>
        {/* Custom Navigation Arrows */}
        <button
          onClick={goToPrev}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(0, 0, 0, 0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(0, 0, 0, 0.7)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(0, 0, 0, 0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(0, 0, 0, 0.7)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <FaChevronRight />
        </button>

        <Slider ref={sliderRef} {...settings}>
          {banners.map(banner => (
            <div key={banner.id} className="item">
              {banner.banner_link ? (
                <a
                  href={banner.banner_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={banner.banner_image}
                    alt={banner.banner_title}
                    className="w-100"
                    style={{
                      height: '300px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    onError={e => {
                      e.target.src =
                        'https://via.placeholder.com/800x300?text=Banner+Image';
                    }}
                  />
                </a>
              ) : (
                <img
                  src={banner.banner_image}
                  alt={banner.banner_title}
                  className="w-100"
                  style={{
                    height: '300px',
                    objectFit: 'cover',
                  }}
                  onError={e => {
                    e.target.src =
                      'https://via.placeholder.com/800x300?text=Banner+Image';
                  }}
                />
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default HomeBanner;
