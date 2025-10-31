// API Constants

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
  },

  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    BEST_SELLING: '/products/best-selling',
    FEATURED: '/products/featured',
    BY_ID: id => `/products/${id}`,
    VARIANTS: id => `/products/${id}/variants`,
    REVIEWS: id => `/products/${id}/reviews`,
  },

  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    SEARCH: '/categories/search',
    BY_TYPE: type => `/categories/type/${type}`,
    BY_ID: id => `/categories/${id}`,
    BY_SLUG: slug => `/categories/slug/${slug}`,
    PRODUCTS: id => `/categories/${id}/products`,
  },

  // Brand endpoints
  BRANDS: {
    BASE: '/brands',
    SEARCH: '/brands/search',
    BY_ID: id => `/brands/${id}`,
  },

  // Cart endpoints
  CART: {
    BASE: '/cart',
    SUMMARY: '/cart/summary',
    VALIDATE: '/cart/validate',
    ADD: '/cart/add',
    BY_ITEM_ID: itemId => `/cart/${itemId}`,
  },

  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    BY_ID: id => `/orders/${id}`,
    CANCEL: id => `/orders/${id}/cancel`,
    STATISTICS: '/orders/statistics',
    BY_STATUS: status => `/orders/status/${status}`,
    DETAILS: id => `/orders/${id}/details`,
    UPDATE_STATUS: id => `/orders/${id}/status`,
  },

  // Review endpoints
  REVIEWS: {
    BASE: '/reviews',
    RECENT: '/reviews/recent',
    STATISTICS: '/reviews/statistics',
    BY_RATING: rating => `/reviews/rating/${rating}`,
    BY_PRODUCT: productId => `/reviews/product/${productId}`,
    BY_ID: id => `/reviews/${id}`,
    MY_REVIEWS: '/reviews/my-reviews',
    ADMIN_DELETE: id => `/reviews/${id}/admin`,
  },

  // Banner endpoints
  BANNERS: {
    BASE: '/banners',
    BY_ID: id => `/banners/${id}`,
    BY_POSITION: position => `/banners/position/${position}`,
    TOGGLE: id => `/banners/${id}/toggle`,
  },

  // Promotion endpoints
  PROMOTIONS: {
    BASE: '/promotions',
    BY_ID: id => `/promotions/${id}`,
    BY_CODE: code => `/promotions/code/${code}`,
    ACTIVE: '/promotions/active',
    VALIDATE: code => `/promotions/validate/${code}`,
    TOGGLE: id => `/promotions/${id}/toggle`,
  },

  // Article endpoints
  ARTICLES: {
    BASE: '/articles',
    BY_ID: id => `/articles/${id}`,
    RECENT: '/articles/recent',
    FEATURED: '/articles/featured',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Order Status Labels (Vietnamese)
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPED]: 'Đã gửi hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy',
};

// User Gender
export const USER_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// User Gender Labels (Vietnamese)
export const USER_GENDER_LABELS = {
  [USER_GENDER.MALE]: 'Nam',
  [USER_GENDER.FEMALE]: 'Nữ',
  [USER_GENDER.OTHER]: 'Khác',
};

// Rating Scale
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
};

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

// Sort Options
export const SORT_OPTIONS = {
  PRODUCTS: {
    CREATED_AT: 'created_at',
    NAME: 'product_name',
    PRICE: 'product_buy_price',
    RATING: 'product_avg_rating',
    SOLD_QUANTITY: 'product_sold_quantity',
  },
  ORDERS: {
    CREATED_AT: 'created_at',
    TOTAL_COST: 'order_total_cost',
    STATUS: 'order_status',
  },
  REVIEWS: {
    CREATED_AT: 'created_at',
    RATING: 'rating',
    PRODUCT_ID: 'product_id',
  },
};

// Sort Order
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

// Sort Order Labels
export const SORT_ORDER_LABELS = {
  [SORT_ORDER.ASC]: 'Tăng dần',
  [SORT_ORDER.DESC]: 'Giảm dần',
};

// Category Types
export const CATEGORY_TYPES = {
  FOOD: 'food',
  TOYS: 'toys',
  ACCESSORIES: 'accessories',
  HEALTH: 'health',
  GROOMING: 'grooming',
};

// Category Type Labels (Vietnamese)
export const CATEGORY_TYPE_LABELS = {
  [CATEGORY_TYPES.FOOD]: 'Thức ăn',
  [CATEGORY_TYPES.TOYS]: 'Đồ chơi',
  [CATEGORY_TYPES.ACCESSORIES]: 'Phụ kiện',
  [CATEGORY_TYPES.HEALTH]: 'Sức khỏe',
  [CATEGORY_TYPES.GROOMING]: 'Chăm sóc',
};

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công',
    REGISTER: 'Đăng ký thành công',
    LOGOUT: 'Đăng xuất thành công',
    UPDATE_PROFILE: 'Cập nhật thông tin thành công',
    CHANGE_PASSWORD: 'Đổi mật khẩu thành công',
    ADD_TO_CART: 'Thêm vào giỏ hàng thành công',
    REMOVE_FROM_CART: 'Xóa khỏi giỏ hàng thành công',
    UPDATE_CART: 'Cập nhật giỏ hàng thành công',
    CLEAR_CART: 'Xóa giỏ hàng thành công',
    CREATE_ORDER: 'Tạo đơn hàng thành công',
    CANCEL_ORDER: 'Hủy đơn hàng thành công',
    CREATE_REVIEW: 'Tạo đánh giá thành công',
    UPDATE_REVIEW: 'Cập nhật đánh giá thành công',
    DELETE_REVIEW: 'Xóa đánh giá thành công',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    USER_EXISTS: 'Người dùng đã tồn tại',
    UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện hành động này',
    FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    SERVER_ERROR: 'Lỗi máy chủ',
  },
};
