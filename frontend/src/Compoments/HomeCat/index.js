import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { categoriesAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

const HomeCat = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const [itemBg, setItemBg] = useState([
    '#fffceb',
    '#ecffec',
    '#feefea',
    '#fff3eb',
    '#fff3ff',
    '#f2fce4',
    '#feefea',
    '#fffceb',
    '#feefea',
    '#ecffec',
    '#feefea',
    '#fff3eb',
    '#fff3ff',
    '#f2fce4',
    '#feefea',
  ]);

  return (
    <section className="homeCat container mt-1 mb-5">
      <div className="container">
        <h3 className="hd text-center mb-0">Danh mục sản phẩm</h3>

        <Swiper
          className="homeCat-swiper mt-4"
          slidesPerView={5}
          spaceBetween={0}
          navigation={true}
          slidesPerGroup={1}
          modules={[Navigation]}
        >
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <Button
                  className="catItem"
                  style={{ width: '200px', minHeight: '250px' }}
                  onClick={() => {
                    navigate(`/listing?category=${category.category_slug}`);
                  }}
                >
                  <div
                    className="item text-center w-100 h-100 "
                    style={{ background: itemBg[index] }}
                  >
                    <img
                      src={
                        category.category_img ||
                        'https://paddy.vn/cdn/shop/files/Pate_MEo_Con_2_940x.jpg?v=1695354433'
                      }
                      alt={category.category_name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <h5
                      className="text-center text-wrap"
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.2',
                        maxHeight: '48px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: '-webkit-box',
                        '-webkit-line-clamp': 2,
                        '-webkit-box-orient': 'vertical',
                        boxOrient: 'vertical',
                        lineClamp: 2,
                      }}
                    >
                      {category.category_name}
                    </h5>
                  </div>
                </Button>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </section>
  );
};
export default HomeCat;
