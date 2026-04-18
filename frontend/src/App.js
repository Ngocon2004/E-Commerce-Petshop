import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Compoments/Header';
import { createContext, useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Footer from './Compoments/Footer';
import ProductModal from './Compoments/ProductModal';
import Listing from './Pages/Listing';
import ProductDetail from './Compoments/ProductDetail';
import Cart from './Pages/Cart';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Articles from './Pages/Articles';
import ArticleDetail from './Pages/ArticleDetail';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Orders from './Pages/Orders';
import OrderDetail from './Pages/OrderDetail';

// Import new API providers
import { AuthProvider } from './custom-hooks/useAuth';
import { CartProvider } from './custom-hooks/useCart';
import { AdminAuthProvider } from './custom-hooks/useAdminAuth';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin pages
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminGuard from './components/AdminGuard';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminCategories from './Pages/Admin/AdminCategories';
import AdminReviews from './Pages/Admin/AdminReviews';
import AdminArticles from './Pages/Admin/AdminArticles';
import AdminBrands from './Pages/Admin/AdminBrands';
import BannerPromotionManagement from './Pages/Admin/BannerPromotionManagement';

// Old admin pages (backward compatibility)
import Dashboard from './Admin_old/Dashboard';
import AddProducts from './Admin_old/AddProduct';
import AllProducts from './Admin_old/AllProducts';
import Users from './Admin_old/Users';

//import { Route } from 'react-router-dom';

const Mycontext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isOpenProductModal, setisOpenProductModal] = useState(false);
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);

  const [product, setProduct] = useState(null);
  useEffect(() => {
    getCountry('https://countriesnow.space/api/v0.1/countries/');
  }, []);

  const getCountry = async url => {
    await axios.get(url).then(res => {
      setCountryList(res.data.data);
      console.log(res.data.data);
    });
  };

  const values = {
    countryList,
    selectedCountry,
    setSelectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    product,
    setProduct,
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <Mycontext.Provider value={values}>
              {isHeaderFooterShow === true && <Header />}

              <Routes>
                {/* Public routes */}
                <Route path="/" exact={true} element={<Home />} />
                <Route path="/listing" exact={true} element={<Listing />} />
                <Route
                  path="/product/:id"
                  exact={true}
                  element={<ProductDetail />}
                />
                <Route path="/cart" exact={true} element={<Cart />} />
                <Route path="/signin" exact={true} element={<SignIn />} />
                <Route path="/signup" exact={true} element={<SignUp />} />
                <Route path="/articles" exact={true} element={<Articles />} />
                <Route
                  path="/articles/:id"
                  exact={true}
                  element={<ArticleDetail />}
                />
                <Route path="/about" exact={true} element={<About />} />
                <Route path="/contact" exact={true} element={<Contact />} />
                <Route path="/orders" exact={true} element={<Orders />} />
                <Route
                  path="/orders/:id"
                  exact={true}
                  element={<OrderDetail />}
                />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="brands" element={<AdminBrands />} />
                  <Route
                    path="banners-promotions"
                    element={<BannerPromotionManagement />}
                  />
                 <Route path="reviews" element={<AdminReviews />} />
                  <Route path="articles" element={<AdminArticles />} />
                </Route>

                {/* Legacy admin routes (backward compatibility) */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/dashboard/all-products"
                  element={<AllProducts />}
                />
                <Route
                  path="/dashboard/add-product"
                  element={<AddProducts />}
                />
                <Route path="/dashboard/users" element={<Users />} />
              </Routes>
              {isHeaderFooterShow === true && <Footer />}

              {isOpenProductModal === true && <ProductModal />}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </Mycontext.Provider>
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
export { Mycontext };
