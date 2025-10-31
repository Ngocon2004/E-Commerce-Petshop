import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.BASE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get cart summary
  getCartSummary: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.SUMMARY);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Validate cart items
  validateCart: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.VALIDATE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Add item to cart
  addToCart: async cartItem => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART.ADD, cartItem);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.CART.BY_ITEM_ID(itemId),
        { quantity: Number(quantity) }
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Remove item from cart
  removeFromCart: async itemId => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.CART.BY_ITEM_ID(itemId)
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART.BASE);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get cart item by ID
  getCartItem: async itemId => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CART.BY_ITEM_ID(itemId)
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },
};
