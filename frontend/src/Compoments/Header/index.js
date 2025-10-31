import Logo from '../../assets/image/logo.png';
import Button from '@mui/material/Button';
import { FiUser, FiLogOut, FiHeart, FiShoppingBag } from 'react-icons/fi';
import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import CountryDropDown from './CountryDropDown';
import { useContext, useEffect, useState } from 'react';
import { Mycontext } from '../../App';
import { useAuth } from '../../custom-hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../LoginModal';
import { cartAPI } from '../../api';

const Header = () => {
  const context = useContext(Mycontext);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [carts, setCarts] = useState(null);
  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await cartAPI.getCart();
      console.log(response?.data);
      if (response?.data?.items?.length > 0) {
        setCarts(response?.data);
      } else {
        setCarts(null);
      }
    };
    fetchCartItems();
  }, []);

  const handleProfileClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      handleClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleOrders = () => {
    navigate('/orders');
    handleClose();
  };

  const handleWishlist = () => {
    navigate('/wishlist');
    handleClose();
  };

  const handleCart = () => {
    navigate('/cart');
    handleClose();
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_name) {
      return user.user_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };
  console.log(carts);
  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg-blue">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Cửa Hàng <b>PetShop</b> Bán Đồ Dùng Cho Thú Cưng
            </p>
          </div>
        </div>

        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWapper d-flex align-items-center col-sm-1">
                <a href="/">
                  <img src={Logo} alt="Logo" style={{ height: 50 }} />
                </a>
              </div>

              <div className="col-sm-10 d-flex align-items-center part2">
                {context.countryList.length !== 0 && <CountryDropDown />}

                <SearchBox />

                <div className="part3 d-flex align-items-center ml-auto">
                  {isAuthenticated ? (
                    <>
                      {/* Cart Button */}
                      <Button
                        className="circle mr-3 position-relative"
                        onClick={handleCart}
                        sx={{
                          minWidth: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.2)',
                          },
                        }}
                      >
                        <FiShoppingBag />
                        <span
                          className="position-absolute"
                          style={{
                            top: '-8px',
                            right: '-8px',
                            background: '#ff4757',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          {carts?.summary?.total_items}
                        </span>
                      </Button>

                      {/* User Profile Button */}
                      <Button
                        onClick={handleProfileClick}
                        className="d-flex align-items-center"
                        sx={{
                          textTransform: 'none',
                          color: '#333',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            marginRight: 1,
                            background:
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {getUserInitials()}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user?.name || 'User'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {user?.email}
                          </Typography>
                        </Box>
                      </Button>

                      {/* Profile Menu */}
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            width: 250,
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          },
                        }}
                      >
                        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {user?.name || 'User'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {user?.email}
                          </Typography>
                        </Box>

                        {/* <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                          <FiUser
                            style={{ marginRight: 12, fontSize: '18px' }}
                          />
                          Thông tin cá nhân
                        </MenuItem> */}

                        <MenuItem onClick={handleOrders} sx={{ py: 1.5 }}>
                          <FiShoppingBag
                            style={{ marginRight: 12, fontSize: '18px' }}
                          />
                          Đơn hàng của tôi
                        </MenuItem>

                        {/* <MenuItem onClick={handleWishlist} sx={{ py: 1.5 }}>
                          <FiHeart
                            style={{ marginRight: 12, fontSize: '18px' }}
                          />
                          Danh sách yêu thích
                        </MenuItem> */}

                        <Divider />

                        <MenuItem
                          onClick={handleLogout}
                          sx={{ py: 1.5, color: '#ff4757' }}
                        >
                          <FiLogOut
                            style={{ marginRight: 12, fontSize: '18px' }}
                          />
                          Đăng xuất
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Button
                      className="btn-blue btn-lg btn-big"
                      onClick={handleLogin}
                      sx={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                      }}
                    >
                      Đăng nhập
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        <Navigation />
      </div>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          window.location.reload();
        }}
      />
    </>
  );
};

export default Header;
