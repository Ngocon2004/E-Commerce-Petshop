import HomeBanner from '../../Compoments/Header/HomeBanner';
import HomeCat from '../../Compoments/HomeCat';
import Promotions from '../../Compoments/Promotions';
import BannerSection from '../../Compoments/BannerSection';
import SidebarBanners from '../../Compoments/SidebarBanners';
import ArticleSection from '../../Compoments/ArticleSection';
import catb from '../../assets/image/catb.png';
import dogb from '../../assets/image/dogb.png';
import Button from '@mui/material/Button';
import { FaArrowRight } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItems from '../../Compoments/ProductItems';
import { IoMailOutline } from 'react-icons/io5';
import { productsAPI } from '../../api';

const Home = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loadingBestSelling, setLoadingBestSelling] = useState(true);
  const [loadingNewProducts, setLoadingNewProducts] = useState(true);
  const [newProducts, setNewProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoadingBestSelling(true);
        setError(null);
        const response = await productsAPI.getBestSelling();
        setBestSellingProducts(response.data.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoadingBestSelling(false);
      }
    };
    const fetchNewProducts = async () => {
      try {
        setLoadingNewProducts(true);
        setError(null);
        const response = await productsAPI.getFeatured();
        setNewProducts(response.data.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoadingNewProducts(false);
      }
    };
    fetchBestSellingProducts();
    fetchNewProducts();
  }, []);
  return (
    <>
      <HomeBanner />
      {/* <Promotions /> */}
      <HomeCat />
      <section className="homeProducts">
        <div className="container">
          <div className="row">
            {/* <div className="col-md-3 sticky">
              <SidebarBanners />
            </div> */}

            <div className="col-md-12 productRow">
              <div className="d-flex align-items-center">
                <div className="info w-75">
                  <h3 className="mb-0 hd"> Sản phẩm bán chạy</h3>
                  <p className="text-light text-sml mb-0">
                    Khám phá những sản phẩm đang hot nhất hiện nay
                  </p>
                </div>
                <Button className="viewAllBnt ml-auto">
                  Xem Thêm <FaArrowRight />
                </Button>
              </div>
              {/** product slider 1 */}
              <div className="product_row w-100 mt-4">
                {loadingBestSelling ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {bestSellingProducts?.length > 0 ? (
                      bestSellingProducts.map(product => (
                        <div
                          className="col-md-3 col-6 "
                          key={product.id}
                          style={{ padding: 10 }}
                        >
                          <ProductItems product={product} />
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12">
                        <p className="text-center">Không có sản phẩm nào</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                  <h3 className="mb-0 hd"> Sản phẩm Mới</h3>
                  <p className="text-light text-sml mb-0">
                    Khám phá những sản phẩm đang hot nhất hiện nay
                  </p>
                </div>
                <Button className="viewAllBnt ml-auto">
                  Xem Thêm <FaArrowRight />
                </Button>
              </div>
              {/* product slider 2 */}
              <div className="product_row w-100 mt-4">
                {loadingNewProducts ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : newProducts?.length > 0 ? (
                  <div className="row">
                    {newProducts?.map(product => (
                      <div
                        className="col-md-3 col-6 "
                        key={product.id}
                        style={{ padding: 10 }}
                      >
                        <ProductItems product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-md-12">
                    <p className="text-center">Không có sản phẩm nào</p>
                  </div>
                )}
              </div>

              <div className="d-flex mt-5 mb-4">
                {/* Bottom Banners */}
                <BannerSection position="bottom" className="my-5" />

                {/* <div className="banner">
                  <Button>
                    <img
                      alt="dog banner"
                      src="https://paddy.vn/cdn/shop/files/dog_banner_1370x.jpg?v=1670135189"
                      className="cursor w-100"
                    />
                  </Button>
                </div>

                <div className="banner">
                  <Button>
                    <img
                      alt="cat banner"
                      src="https://paddy.vn/cdn/shop/files/cat_banner_1370x.jpg?v=1670135516"
                      className="cursor w-100"
                    />
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-5 ">
              <p className="text-white mb-1">
                Đặt đơn hàng đầu tiên giảm ngay 20%
              </p>
              <h3 className="text-white mb-2">Nhận các ưu đãi đặc biệt</h3>
              <p className=" text-white mb-3">
                Đăng ký ngay để không bỏ lỡ các ưu đãi hấp dẫn từ chúng tôi!
              </p>

              <form>
                <IoMailOutline />
                <input type="text" placeholder="Địa chỉ email của bạn" />
                <Button className="subscribeBnt">Đăng Ký</Button>
              </form>
            </div>

            <div className="col-md-6 ">
              <img
                src={
                  'https://fullstack-ecommerce.netlify.app/static/media/newsletter.5931358dd220a40019fc.png'
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
