import apiClient from './config';

// Articles API for web/frontend (read-only operations)
export const articlesAPI = {
  // Get all articles
  getArticles: async (params = {}) => {
    try {
      const response = await apiClient.get('/articles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Get article by ID
  getArticleById: async id => {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Get recent articles
  getRecentArticles: async (limit = 6) => {
    try {
      const response = await apiClient.get('/articles/recent', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      throw error;
    }
  },

  // Get featured articles
  getFeaturedArticles: async (limit = 4) => {
    try {
      const response = await apiClient.get('/articles/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  },
};
