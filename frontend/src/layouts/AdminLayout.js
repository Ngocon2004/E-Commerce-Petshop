import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../custom-hooks/useAdminAuth';
import { toast } from 'react-toastify';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiFileText,
  FiStar,
  FiImage,
} from 'react-icons/fi';
import { Mycontext } from '../App';
import '../styles/admin.css';
import { useContext } from 'react';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const myContext = useContext(Mycontext);
  const { setisHeaderFooterShow } = myContext;
  setisHeaderFooterShow(false);
  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: FiHome, label: 'Bảng điều khiển', path: '/admin/dashboard' },
    { icon: FiPackage, label: 'Sản phẩm', path: '/admin/products' },
    { icon: FiShoppingCart, label: 'Đơn hàng', path: '/admin/orders' },
    { icon: FiUsers, label: 'Người dùng', path: '/admin/users' },
    { icon: FiGrid, label: 'Danh mục', path: '/admin/categories' },
    { icon: FiTag, label: 'Thương hiệu', path: '/admin/brands' },
    {
      icon: FiImage,
      label: 'Banners',
      path: '/admin/banners-promotions',
    },
    { icon: FiStar, label: 'Đánh giá', path: '/admin/reviews' },
    { icon: FiFileText, label: 'Bài viết', path: '/admin/articles' },
    // { icon: FiSettings, label: 'Cài đặt', path: '/admin/settings' },
  ];

  return (
    <div
      className="admin-layout"
      style={{ display: 'flex', minHeight: '100vh' }}
    >
      {/* Sidebar */}
      <div
        className={`admin-sidebar bg-primary text-white ${
          sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
        style={{
          width: sidebarOpen ? '250px' : '70px',
          transition: 'all 0.3s',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        {/* Logo & Toggle */}
        <div className="p-3 border-bottom border-secondary">
          {sidebarOpen ? (
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">PetShop Admin</h4>
              <FiX
                onClick={() => setSidebarOpen(false)}
                style={{ cursor: 'pointer', fontSize: '20px' }}
              />
            </div>
          ) : (
            <div className="text-center">
              <FiMenu
                onClick={() => setSidebarOpen(true)}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="admin-nav mt-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `admin-nav-item d-flex align-items-center p-3 ${
                    isActive ? 'bg-white text-primary' : ''
                  }`
                }
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  borderLeft: '3px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!sidebarOpen) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon style={{ fontSize: '20px', minWidth: '24px' }} />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <div
            className="admin-nav-item d-flex align-items-center p-3 mt-5 border-top border-secondary"
            onClick={handleLogout}
            style={{
              cursor: 'pointer',
              color: 'white',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FiLogOut style={{ fontSize: '20px', minWidth: '24px' }} />
            {sidebarOpen && <span className="ml-3">Đăng xuất</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="admin-content"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '250px' : '70px',
          transition: 'all 0.3s',
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <div
          className="admin-topbar bg-white p-3 shadow-sm"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Quản trị viên</h5>
              <small className="text-muted">
                Xin chào, {admin?.user_name || 'Admin'}
              </small>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary mr-2"
                onClick={() => navigate('/')}
              >
                Xem trang web
              </button>
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                {admin?.user_name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-page-content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
