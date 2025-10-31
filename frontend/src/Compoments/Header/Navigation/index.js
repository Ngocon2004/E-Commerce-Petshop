import Button from '@mui/material/Button';
import { FaAngleDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categoriesAPI } from '../../../api';

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to check if a nav item is active
  const isActive = path => {
    if (path === '/') {
      return location.pathname === '/';
    }

    // Special handling for product pages
    if (path === '/listing' || path === '/product') {
      return (
        location.pathname.startsWith('/listing') ||
        location.pathname.startsWith('/product')
      );
    }

    // Special handling for article pages
    if (path === '/articles') {
      return location.pathname.startsWith('/articles');
    }

    return location.pathname.startsWith(path);
  };

  // Function to get active class
  const getActiveClass = path => {
    return isActive(path) ? 'active' : '';
  };

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto">
              <li className="list-inline-item">
                <Link to="/" className={getActiveClass('/')}>
                  <Button className={getActiveClass('/')}>Trang Chủ</Button>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/listing" className={getActiveClass('/listing')}>
                  <Button className={getActiveClass('/listing')}>
                    Sản Phẩm
                  </Button>
                  <FaAngleDown />
                </Link>

                <div className="subMenu shadow">
                  {categories.map(category => {
                    const isCategoryActive =
                      location.pathname === '/listing' &&
                      location.search.includes(
                        `category=${category.category_slug}`
                      );
                    return (
                      <Link
                        to={`/listing?category=${category.category_slug}`}
                        key={category.id}
                        className={isCategoryActive ? 'active' : ''}
                      >
                        <Button className={isCategoryActive ? 'active' : ''}>
                          {category.category_name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </li>

              <li className="list-inline-item">
                <Link to="/articles" className={getActiveClass('/articles')}>
                  <Button className={getActiveClass('/articles')}>
                    Bài viết
                  </Button>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/about" className={getActiveClass('/about')}>
                  <Button className={getActiveClass('/about')}>
                    Giới thiệu
                  </Button>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/contact" className={getActiveClass('/contact')}>
                  <Button className={getActiveClass('/contact')}>
                    Liên hệ
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
