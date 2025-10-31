import React, { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Sync searchTerm with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (!searchParam) {
      setSearchTerm('');
    }
  }, [location.search]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to listing page with search query
      navigate(`/listing?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="headerSearch ml-3 mr-3">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px 0 0 4px',
          borderRight: 'none',
          outline: 'none',
          flex: 1,
          minWidth: '200px',
        }}
      />
      <Button
        type="submit"
        style={{
          border: '1px solid #ddd',
          borderRadius: '0 4px 4px 0',
          borderLeft: 'none',
          backgroundColor: '#f8f9fa',
          color: '#333',
          padding: '8px 12px',
          minWidth: 'auto',
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = '#e9ecef';
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = '#f8f9fa';
        }}
      >
        <IoMdSearch />
      </Button>
    </form>
  );
};
export default SearchBox;
