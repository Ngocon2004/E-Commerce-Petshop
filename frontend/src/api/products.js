import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Products API
export const productsAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, {
        params,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Search products
  searchProducts: async searchParams => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get product by ID
  getProductById: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get product variants
  getProductVariants: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.VARIANTS(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get product reviews
  getProductReviews: async (id, params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.REVIEWS(id), {
        params,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get best selling products
  getBestSelling: async (limit = 8) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.PRODUCTS.BEST_SELLING,
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get featured products
  getFeatured: async (limit = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
