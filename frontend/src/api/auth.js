import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Authentication API
export const authAPI = {
  // Register new user
  register: async userData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Login user
  login: async credentials => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Update user profile
  updateProfile: async profileData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.PROFILE,
        profileData
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Change password
  changePassword: async passwordData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
