// API Helper functions

// Format error message from API response
export const formatErrorMessage = error => {
  if (error?.message) {
    return error.message;
  }

  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors.map(err => err.msg || err.message).join(', ');
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

// Format success message
export const formatSuccessMessage = response => {
  return response?.message || 'Operation completed successfully';
};

// Handle API response
export const handleApiResponse = response => {
  if (response?.success) {
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  }

  return {
    success: false,
    message: response?.message || 'Operation failed',
  };
};

// Create query string from object
export const createQueryString = params => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ''
    ) {
      searchParams.append(key, params[key]);
    }
  });

  return searchParams.toString();
};

// Format pagination info
export const formatPagination = pagination => {
  if (!pagination) return null;

  return {
    currentPage: pagination.current_page || pagination.page || 1,
    totalPages: pagination.total_pages || pagination.pages || 1,
    totalItems: pagination.total_items || pagination.total || 0,
    itemsPerPage: pagination.items_per_page || pagination.limit || 10,
    hasNext: pagination.has_next || false,
    hasPrev: pagination.has_prev || false,
  };
};

// Format product data
export const formatProduct = product => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.product_name,
    slug: product.product_slug,
    shortDescription: product.product_short_description,
    description: product.product_description,
    price: product.product_buy_price,
    soldQuantity: product.product_sold_quantity,
    avgRating: product.product_avg_rating,
    brandName: product.brand_name,
    categoryName: product.category_name,
    variants: product.variants || [],
    images: product.images || [],
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
};

// Format cart item data
export const formatCartItem = item => {
  if (!item) return null;

  return {
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    quantity: item.quantity,
    productName: item.product_name,
    variantName: item.variant_name,
    price: item.price,
    discountAmount: item.discount_amount,
    updatedAt: item.updated_at,
  };
};

// Format order data
export const formatOrder = order => {
  if (!order) return null;

  return {
    id: order.id,
    customerId: order.customer_id,
    totalCost: order.order_total_cost,
    status: order.order_status,
    shippingCost: order.order_shipping_cost,
    paymentCost: order.order_payment_cost,
    address: order.order_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: order.items || [],
  };
};

// Format review data
export const formatReview = review => {
  if (!review) return null;

  return {
    id: review.id,
    productId: review.product_id,
    userId: review.user_id,
    rating: review.rating,
    text: review.review_text,
    userName: review.user_name,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
  };
};

// Format user data
export const formatUser = user => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.user_email,
    name: user.user_name,
    gender: user.user_gender,
    birth: user.user_birth,
    active: user.user_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

// Validate email format
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = password => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return {
    isValid: password.length >= minLength,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    strength:
      password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers
        ? 'strong'
        : password.length >= 6
          ? 'medium'
          : 'weak',
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('vi-VN', {
    ...defaultOptions,
    ...options,
  });
};

// Format date time
export const formatDateTime = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(date).toLocaleDateString('vi-VN', {
    ...defaultOptions,
    ...options,
  });
};
