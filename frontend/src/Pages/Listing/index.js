import Sidebar from '../../Compoments/Sidebar';
import Button from '@mui/material/Button';
import { IoMdMenu } from 'react-icons/io';
import { IoGrid } from 'react-icons/io5';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa6';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState, useEffect, useCallback } from 'react';
import ProductItems from '../../Compoments/ProductItems';
import Pagination from '@mui/material/Pagination';
import { productsAPI } from '../../api';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for products and filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_slug: searchParams.get('category') || null,
    brand_id: searchParams.get('brand')
      ? parseInt(searchParams.get('brand'))
      : null,
    min_price: searchParams.get('min_price')
      ? parseFloat(searchParams.get('min_price'))
      : null,
    max_price: searchParams.get('max_price')
      ? parseFloat(searchParams.get('max_price'))
      : null,
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'DESC',
  });

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState('four');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const openDropdown = Boolean(anchorEl);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: itemsPerPage,
        ...filters,
      };

      const response = await productsAPI.getProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, itemsPerPage, filters]);

  // Update URL params when filters change
  const updateURLParams = newFilters => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (
        newFilters[key] !== null &&
        newFilters[key] !== '' &&
        newFilters[key] !== undefined
      ) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    updateURLParams(newFilters);
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle items per page change
  const handleItemsPerPageChange = items => {
    setItemsPerPage(items);
    setPagination(prev => ({ ...prev, page: 1, limit: items }));
    setAnchorEl(null);
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    handleFilterChange('sort_by', sortBy);
    handleFilterChange('sort_order', sortOrder);
  };

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle URL params on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== filters.category_slug) {
      setFilters(prev => ({
        ...prev,
        category_slug: categoryFromUrl,
      }));
    }
  }, [searchParams, filters.category_slug]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className="product-listing-page">
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
          <div className="content_right">
            <img
              alt="banner"
              src="https://file.hstatic.net/200000264739/file/kc-website-banner-ol-231.2_0c619bed68cb498f9edbf54905c6f9d5.jpg"
              className="cursor w-100 mb-3"
            />

            {/* Search and Sort Bar */}
            <div className="showBy mt-3 mb-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                {/* Search Input */}
                <div className="me-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                    style={{ width: '300px' }}
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="me-3 h-100 ml-2">
                  <select
                    className="form-select "
                    style={{
                      height: '35px',
                      borderRadius: '5px',
                      border: ' #1px solid #ced4da',
                    }}
                    value={`${filters.sort_by}_${filters.sort_order}`}
                    onChange={e => {
                      const [sortBy, sortOrder] = e.target.value.split('_');
                      handleSortChange(sortBy, sortOrder);
                    }}
                  >
                    {/* <option value="created_at_DESC">Mới nhất</option>
                    <option value="created_at_ASC">Cũ nhất</option>
                    <option value="product_name_ASC">Tên A-Z</option>
                    <option value="product_name_DESC">Tên Z-A</option> */}
                    <option value="product_buy_price_ASC">
                      Giá thấp đến cao
                    </option>
                    <option value="product_buy_price_DESC">
                      Giá cao đến thấp
                    </option>
                    {/* <option value="product_avg_rating_DESC">
                      Đánh giá cao nhất
                    </option>
                    <option value="product_sold_quantity_DESC">
                      Bán chạy nhất
                    </option> */}
                  </select>
                </div>
              </div>

              <div className="d-flex align-items-center">
                {/* View Options */}
                <div className="d-flex align-items-center btnWrapper me-3">
                  <Button
                    className={productView === 'one' && 'act'}
                    onClick={() => setProductView('one')}
                  >
                    <IoMdMenu />
                  </Button>
                  <Button
                    className={productView === 'three' && 'act'}
                    onClick={() => setProductView('three')}
                  >
                    <IoGrid />
                  </Button>
                  <Button
                    className={productView === 'four' && 'act'}
                    onClick={() => setProductView('four')}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>

                {/* Items per page */}
                <div className="showByFilter">
                  <Button onClick={handleClick}>
                    Hiện {itemsPerPage} sản phẩm <FaAngleDown />
                  </Button>
                  <Menu
                    className="w-100 showPerPageDrown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    slotProps={{
                      list: {
                        'aria-labelledby': 'basic-button',
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleItemsPerPageChange(12)}>
                      12
                    </MenuItem>
                    <MenuItem onClick={() => handleItemsPerPageChange(24)}>
                      24
                    </MenuItem>
                    <MenuItem onClick={() => handleItemsPerPageChange(36)}>
                      36
                    </MenuItem>
                    <MenuItem onClick={() => handleItemsPerPageChange(48)}>
                      48
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-3">
              <p className="text-muted">
                Hiển thị {products.length} trong {pagination.total} sản phẩm
                {filters.search && ` cho "${filters.search}"`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '300px' }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger text-center">
                <p>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
                <button className="btn btn-primary" onClick={fetchProducts}>
                  Thử lại
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                <div className={`productListing ${productView}`}>
                  {products.map(product => (
                    <ProductItems
                      key={product.id}
                      product={product}
                      itemView={productView}
                    />
                  ))}
                </div>

                {/* No Products */}
                {products.length === 0 && (
                  <div className="text-center py-5">
                    <h4>Không tìm thấy sản phẩm nào</h4>
                    <p className="text-muted">
                      Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
