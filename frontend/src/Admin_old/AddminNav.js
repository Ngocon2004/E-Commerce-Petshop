import React from 'react';
import { useAuth } from '../custom-hooks/useAuth';

import '../styles/admin-nav.css';

import { NavLink, useNavigate } from 'react-router-dom';

const admin__nav = [
  {
    display: 'Bảng điều khiển',
    path: '/dashboard',
  },
  {
    display: 'Thêm sản phẩm',
    path: '/dashboard/add-product',
  },
  {
    display: 'Tất cả sản phẩm',
    path: '/dashboard/all-products',
  },
  {
    display: 'Sản phẩm được đặt',
    path: '/dashboard/orders',
  },
  {
    display: 'Người dùng',
    path: '/dashboard/users',
  },
];

const AdminNav = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const gotoHome = () => {
    navigate('/');
  };
  return (
    <>
      <header className="admin__header">
        <div className="container">
          <div className="admin__nav-wrapper-top">
            <div className="logo">
              <h2 onClick={gotoHome}>PetShop</h2>
            </div>
            <div className="search__box">
              <input type="text" placeholder="Tìm kiếm..." />
              <span className="white">
                <i class="ri-search-line"></i>
              </span>
            </div>
            <div className="admin__nav-top-right">
              <span>
                <i class="ri-notification-2-line"></i>
              </span>
              <span>
                <i class="ri-settings-3-line"></i>
              </span>
              <img src={currentUser && currentUser.photoURL} alt="" />
            </div>
          </div>
        </div>
      </header>
      <section className="admin__menu p-0">
        <div className="container">
          <div className="row">
            <div className="admin__navigation">
              <ul className="admin__menu-list">
                {admin__nav.map((item, index) => (
                  <li className="admin__menu-item" key={index}>
                    <NavLink
                      to={item.path}
                      className={navClass =>
                        navClass.isActive ? 'active__admin-menu' : ''
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminNav;
