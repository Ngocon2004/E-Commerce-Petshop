import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { useRef } from 'react';

const ProductZoom = ({ product }) => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  var settings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    fade: false,
  };

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
  };

  const goto = index => {
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };

  return (
    <>
      <div className="productZoom">
        <div className="productZoom position-relative">
          {product?.variants[0]?.discount_percentage > 0 && (
            <div className="badge badge-primary">
              {product?.variants[0]?.discount_percentage}%
            </div>
          )}
          <Slider {...settings2} className="zoomSliderBig" ref={zoomSliderBig}>
            {product?.images?.map(image => (
              <div className="item" key={image.id}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={image.value}
                  key={image.id}
                  style={{ minWidth: '100%', minHeight: '250px' }}
                />
              </div>
            ))}
            {/* <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={
                  'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-3.jpg?v=17249216855'
                }
              />
            </div>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={
                  'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
                }
              />
            </div>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={
                  'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
                }
              />
            </div>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src={
                  'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
                }
              />
            </div> */}
          </Slider>
        </div>

        <Slider {...settings} className="zoomSlider mt-3" ref={zoomSlider}>
          {product?.images?.map((image, index) => (
            <div className="item" key={image.id}>
              <img
                alt="product"
                src={image.value}
                className="w-100"
                onClick={() => goto(index)}
              />
            </div>
          ))}
          {/* <div className="item">
            <img
              alt="product"
              src={
                'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
              }
              className="w-100"
              onClick={() => goto(0)}
            />
          </div>

          <div className="item">
            <img
              alt="product"
              src={
                'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-3.jpg?v=17249216855'
              }
              className="w-100"
              onClick={() => goto(1)}
            />
          </div>

          <div className="item">
            <img
              alt="product"
              src={
                'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
              }
              className="w-100"
              onClick={() => goto(2)}
            />
          </div>

          <div className="item">
            <img
              alt="product"
              src={
                'https://paddy.vn/cdn/shop/products/hat-royal-canin-poodle-adult-cho-cho-poodle-truong-thanh-paddy-2.jpg?v=1724921685'
              }
              className="w-100"
              onClick={() => goto(3)}
            />
          </div> */}
        </Slider>
      </div>
    </>
  );
};
export default ProductZoom;
