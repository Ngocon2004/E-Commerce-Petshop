import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Search categories
  searchCategories: async searchTerm => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.SEARCH, {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get category by ID
  getCategoryById: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get category by slug
  getCategoryBySlug: async slug => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get categories by type
  getCategoriesByType: async type => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CATEGORIES.BY_TYPE(type)
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get category with products
  getCategoryWithProducts: async (id, params = {}) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CATEGORIES.PRODUCTS(id),
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

};
