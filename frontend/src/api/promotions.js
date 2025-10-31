import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Promotions API
export const promotionsAPI = {
  // Get all promotions
  getPromotions: async (params = {}) => {
    try {
      const response = await apiClient.get('/promotions', { params });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get promotion by ID
  getPromotionById: async id => {
    try {
      const response = await apiClient.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get promotion by code
  getPromotionByCode: async code => {
    try {
      const response = await apiClient.get(`/promotions/code/${code}`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get active promotions
  getActivePromotions: async (limit = 10) => {
    try {
      const response = await apiClient.get('/promotions/active', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Validate promotion code
  validatePromotionCode: async (code, amount) => {
    try {
      const response = await apiClient.get(`/promotions/validate/${code}`, {
        params: { amount },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Create promotion
  createPromotion: async promotionData => {
    try {
      const response = await apiClient.post('/promotions', promotionData);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Update promotion
  updatePromotion: async (id, promotionData) => {
    try {
      const response = await apiClient.put(`/promotions/${id}`, promotionData);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Delete promotion
  deletePromotion: async id => {
    try {
      const response = await apiClient.delete(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Admin: Toggle promotion status
  togglePromotionStatus: async id => {
    try {
      const response = await apiClient.put(`/promotions/${id}/toggle`);
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
