import { useState, useEffect } from 'react';
import { productsAPI } from '../api';

// Custom hook for products
export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getProducts(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, pagination };
};

// Custom hook for single product
export const useProduct = id => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getProductById(id);
        setProduct(response.data.product);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// Custom hook for product search
export const useProductSearch = searchParams => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const search = async params => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.searchProducts(params);
      setSearchResults(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, pagination, search };
};

// Custom hook for best selling products
export const useBestSelling = (limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getBestSelling(limit);
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, [limit]);

  return { products, loading, error };
};

// Custom hook for featured products
export const useFeatured = (limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getFeatured(limit);
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading, error };
};
