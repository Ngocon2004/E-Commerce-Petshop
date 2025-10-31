import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Orders API for web/frontend (customer operations only)
export const ordersAPI = {
  // Create new order
  createOrder: async orderData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.ORDERS.BASE,
        orderData
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get user's orders
  getUserOrders: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS, {
        params,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get order by ID
  getOrderById: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Cancel order
  cancelOrder: async id => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDERS.CANCEL(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
