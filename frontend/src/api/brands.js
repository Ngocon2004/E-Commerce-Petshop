import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Brands API
export const brandsAPI = {
  // Get all brands
  getBrands: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BRANDS.BASE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Search brands
  searchBrands: async searchTerm => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BRANDS.SEARCH, {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get brand by ID
  getBrandById: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BRANDS.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

};
