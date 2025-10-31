import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Banners API
export const bannersAPI = {
  // Get all banners
  getBanners: async (params = {}) => {
    try {
      const response = await apiClient.get('/banners', { params });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get banner by ID
  getBannerById: async id => {
    try {
      const response = await apiClient.get(`/banners/${id}`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get banners by position
  getBannersByPosition: async (position, limit = 5) => {
    try {
      const response = await apiClient.get(`/banners/position/${position}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Create banner
  createBanner: async bannerData => {
    try {
      const response = await apiClient.post('/banners', bannerData);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const response = await apiClient.put(`/banners/${id}`, bannerData);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Delete banner
  deleteBanner: async id => {
    try {
      const response = await apiClient.delete(`/banners/${id}`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Toggle banner status
  toggleBannerStatus: async id => {
    try {
      const response = await apiClient.put(`/banners/${id}/toggle`);
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
