import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import React, { useState, useEffect } from 'react';
import { categoriesAPI, brandsAPI } from '../../api';
import { toast } from 'react-toastify';

const Sidebar = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Price range state
  const [priceRange, setPriceRange] = useState([
    filters.min_price || 0,
    filters.max_price || 100000,
  ]);
  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, brandsResponse] = await Promise.all([
          categoriesAPI.getCategories(),
          brandsAPI.getBrands(),
        ]);
        setCategories(categoriesResponse.data.categories);
        setBrands(brandsResponse.data.brands);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        toast.error('Không thể tải dữ liệu bộ lọc');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle price range change
  const handlePriceRangeChange = newRange => {
    setPriceRange(newRange);
    onFilterChange('min_price', newRange[0]);
    onFilterChange('max_price', newRange[1]);
  };

  // Handle category filter
  const handleCategoryChange = categorySlug => {
    onFilterChange(
      'category_slug',
      categorySlug === filters.category_slug ? null : categorySlug
    );
  };

  // Handle brand filter
  const handleBrandChange = brandId => {
    onFilterChange('brand_id', brandId === filters.brand_id ? null : brandId);
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange('category_id', null);
    onFilterChange('brand_id', null);
    onFilterChange('min_price', null);
    onFilterChange('max_price', null);
    setPriceRange([0, 100000]);
  };

  if (loading) {
    return (
      <div className="sidebar">
        <div className="sticky">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '200px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sticky">
        {/* Clear Filters */}
        {/* <div className="filterBox mb-3">
          <button
            className="btn btn-outline-primary btn-sm w-100"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </button>
        </div> */}

        {/* Categories Filter */}
        <div className="filterBox">
          <h5>Danh Mục</h5>
          <div className="scroll">
            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <FormControlLabel
                    className="w-100"
                    control={
                      <Checkbox
                        checked={
                          filters.category_slug === category.category_slug
                        }
                        onChange={() =>
                          handleCategoryChange(category.category_slug)
                        }
                      />
                    }
                    label={category.category_name}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filterBox">
          <h5>Lọc Theo Giá</h5>
          <RangeSlider
            value={priceRange}
            onInput={handlePriceRangeChange}
            min={0}
            max={100000}
            step={1000}
          />
          <div className="d-flex pt-2 pb-2 priceRange">
            <span>
              Giá từ{' '}
              <strong className="text-dark">
                {priceRange[0].toLocaleString()}đ
              </strong>
            </span>
            <span className="ml-auto">
              Đến{' '}
              <strong className="text-dark">
                {priceRange[1].toLocaleString()}đ
              </strong>
            </span>
          </div>
        </div>

        {/* Brands Filter */}
        <div className="filterBox">
          <h5>Thương Hiệu</h5>
          <div className="scroll">
            <ul>
              {brands.map(brand => (
                <li key={brand.id}>
                  <FormControlLabel
                    className="w-100"
                    control={
                      <Checkbox
                        checked={filters.brand_id === brand.id}
                        onChange={() => handleBrandChange(brand.id)}
                      />
                    }
                    label={brand.name}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.category_id ||
          filters.brand_id ||
          filters.min_price ||
          filters.max_price) && (
          <div className="filterBox">
            <h5>Bộ Lọc Đang Áp Dụng</h5>
            <div className="scroll">
              {filters.category_id && (
                <div className="badge bg-primary me-1 mb-1">
                  Danh mục:{' '}
                  {
                    categories.find(c => c.id === filters.category_id)
                      ?.category_name
                  }
                </div>
              )}
              {filters.brand_id && (
                <div className="badge bg-success me-1 mb-1">
                  Thương hiệu:{' '}
                  {brands.find(b => b.id === filters.brand_id)?.name}
                </div>
              )}
              {(filters.min_price || filters.max_price) && (
                <div className="badge bg-warning me-1 mb-1">
                  Giá: {filters.min_price?.toLocaleString() || '0'}đ -{' '}
                  {filters.max_price?.toLocaleString() || '∞'}đ
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
