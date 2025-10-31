// Main API export file
export { authAPI } from './auth';
export { productsAPI } from './products';
export { categoriesAPI } from './categories';
export { brandsAPI } from './brands';
export { cartAPI } from './cart';
export { ordersAPI } from './orders';
export { reviewsAPI } from './reviews';
export { bannersAPI } from './banners';
export { promotionsAPI } from './promotions';
export { articlesAPI } from './articles';
export { adminAPI } from './admin';

// Re-export the axios instance for custom requests
export { default as apiClient } from './config';
