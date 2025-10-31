import { API_ENDPOINTS } from '../constants/api';
import apiClient from './config';

// Reviews API
export const reviewsAPI = {
  // Get recent reviews
  getRecentReviews: async (limit = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.RECENT, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get review statistics
  getReviewStatistics: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.STATISTICS);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get reviews by rating
  getReviewsByRating: async (rating, params = {}) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.REVIEWS.BY_RATING(rating),
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Get reviews by product ID
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId),
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return { data: { reviews: [], statistics: null, pagination: { pages: 0 } } };
    }
  },

  // Get review by ID
  getReviewById: async id => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Create new review
  createReview: async reviewData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.REVIEWS.BASE,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error; // Re-throw to handle in component
    }
  },

  // Get user's reviews
  getUserReviews: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS, {
        params,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Update review
  updateReview: async (id, reviewData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.REVIEWS.BY_ID(id),
        reviewData
      );
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Delete review
  deleteReview: async id => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
      return response.data;
    } catch (error) {
      return false;
    }
  },

};
