/**
 * Format price to Vietnamese currency format
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price string
 */
const formatPrice = price => {
  if (!price && price !== 0) {
    return '0₫';
  }

  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if it's a valid number
  if (isNaN(numPrice)) {
    return '0₫';
  }

  // Remove decimal places if they are .00
  if (numPrice % 1 === 0) {
    return `${Math.floor(numPrice).toLocaleString('vi-VN')}₫`;
  }

  // Format with decimal places if needed
  return `${numPrice.toLocaleString('vi-VN')}₫`;
};

/**
 * Format price for API response (return as integer)
 * @param {number|string} price - The price stored as integer in database
 * @returns {number} Price as integer
 */
const formatPriceForAPI = price => {
  if (!price && price !== 0) {
    return 0;
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return 0;
  }

  // Return as integer (no conversion needed)
  // e.g., 13030 -> 13030, 133939 -> 133939
  return Math.floor(numPrice);
};

module.exports = {
  formatPrice,
  formatPriceForAPI,
};
