import adminApiClient from './configAdmin';

// Admin API - uses adminToken for authentication
export const adminAPI = {
  // Login admin
  login: async credentials => {
    const response = await adminApiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get all users
  getUsers: async params => {
    const response = await adminApiClient.get('/auth/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async id => {
    const response = await adminApiClient.get(`/auth/users/${id}`);
    return response.data;
  },

  // Create user (admin only)
  createUser: async userData => {
    const response = await adminApiClient.post('/auth/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await adminApiClient.put(`/auth/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async id => {
    const response = await adminApiClient.delete(`/auth/users/${id}`);
    return response.data;
  },

  // Get all orders
  getAllOrders: async params => {
    const response = await adminApiClient.get('/orders', { params });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await adminApiClient.put(`/orders/${id}/status`, {
      status,
    });
    return response.data;
  },

  getOrderDetails: async id => {
    const response = await adminApiClient.get(`/orders/${id}/details`);
    return response.data;
  },

  // Products Management
  getAllProducts: async params => {
    const response = await adminApiClient.get('/products', { params });
    return response.data;
  },

  // Delete product
  deleteProduct: async id => {
    const response = await adminApiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async productData => {
    const response = await adminApiClient.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await adminApiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Get all reviews
  getAllReviews: async params => {
    const response = await adminApiClient.get('/reviews', { params });
    return response.data;
  },

  // Delete review (admin)
  deleteReview: async id => {
    const response = await adminApiClient.delete(`/reviews/${id}/admin`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await adminApiClient.get('/categories');
    return response.data;
  },

  // Create category
  createCategory: async categoryData => {
    const response = await adminApiClient.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await adminApiClient.put(
      `/categories/${id}`,
      categoryData
    );
    return response.data;
  },

  // Delete category
  deleteCategory: async id => {
    const response = await adminApiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // Brands Management
  getBrands: async () => {
    const response = await adminApiClient.get('/brands');
    return response.data;
  },

  createBrand: async brandData => {
    const response = await adminApiClient.post('/brands', brandData);
    return response.data;
  },

  updateBrand: async (id, brandData) => {
    const response = await adminApiClient.put(`/brands/${id}`, brandData);
    return response.data;
  },

  deleteBrand: async id => {
    const response = await adminApiClient.delete(`/brands/${id}`);
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await adminApiClient.get('/orders/statistics');
    return response.data;
  },

  // Articles Management
  getArticles: async params => {
    const response = await adminApiClient.get('/articles', { params });
    return response.data;
  },

  createArticle: async articleData => {
    const response = await adminApiClient.post('/articles', articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await adminApiClient.put(`/articles/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async id => {
    const response = await adminApiClient.delete(`/articles/${id}`);
    return response.data;
  },

  getAllProducts: async (params = {}) => {
    try {
      const response = await adminApiClient.get('/products', {
        params,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  // Banners Management
  getBanners: async (params = {}) => {
    const response = await adminApiClient.get('/banners', { params });
    return response.data;
  },

  createBanner: async bannerData => {
    const response = await adminApiClient.post('/banners', bannerData);
    return response.data;
  },

  updateBanner: async (id, bannerData) => {
    const response = await adminApiClient.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  deleteBanner: async id => {
    const response = await adminApiClient.delete(`/banners/${id}`);
    return response.data;
  },

  toggleBannerStatus: async id => {
    const response = await adminApiClient.put(`/banners/${id}/toggle`);
    return response.data;
  },

  // Promotions Management
  getPromotions: async (params = {}) => {
    const response = await adminApiClient.get('/promotions', { params });
    return response.data;
  },

  createPromotion: async promotionData => {
    const response = await adminApiClient.post('/promotions', promotionData);
    return response.data;
  },

  updatePromotion: async (id, promotionData) => {
    const response = await adminApiClient.put(
      `/promotions/${id}`,
      promotionData
    );
    return response.data;
  },

  deletePromotion: async id => {
    const response = await adminApiClient.delete(`/promotions/${id}`);
    return response.data;
  },

  togglePromotionStatus: async id => {
    const response = await adminApiClient.put(`/promotions/${id}/toggle`);
    return response.data;
  },

  // Dashboard
  getDashboardStatistics: async () => {
    const response = await adminApiClient.get('/dashboard/statistics');
    return response.data;
  },
};
