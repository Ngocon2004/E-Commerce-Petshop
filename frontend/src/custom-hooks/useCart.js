import { useState, useEffect, useContext, createContext } from 'react';
import { cartAPI } from '../api';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      setCartItems(response.data.items);
      setCartSummary(response.data.summary);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async cartItem => {
    try {
      setLoading(true);
      setError(null);
      await cartAPI.addToCart(cartItem);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart with auth check
  const addToCartWithAuth = async (cartItem, requireAuth) => {
    if (requireAuth && !requireAuth()) {
      return false;
    }

    try {
      await addToCart(cartItem);
      return true;
    } catch (err) {
      throw err;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      await cartAPI.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async itemId => {
    try {
      setLoading(true);
      setError(null);
      await cartAPI.removeFromCart(itemId);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartAPI.clearCart();
      setCartItems([]);
      setCartSummary(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Validate cart
  const validateCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.validateCart();
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get cart summary
  const getCartSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCartSummary();
      setCartSummary(response.data.summary);
      return response.data.summary;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartSummary,
    loading,
    error,
    addToCart,
    addToCartWithAuth,
    updateCartItem,
    removeFromCart,
    clearCart,
    validateCart,
    getCartSummary,
    fetchCart,
    // Computed values
    itemCount: cartItems.length,
    totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    isEmpty: cartItems.length === 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
