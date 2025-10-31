import { useState, useEffect } from 'react';
import { ordersAPI } from '../api';

// Custom hook for user orders
export const useUserOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordersAPI.getUserOrders(params);
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [JSON.stringify(params)]);

  return { orders, loading, error, pagination };
};

// Custom hook for single order
export const useOrder = id => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordersAPI.getOrderById(id);
        setOrder(response.data.order);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
};

// Custom hook for creating order
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async orderData => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.createOrder(orderData);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

// Custom hook for canceling order
export const useCancelOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = async id => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.cancelOrder(id);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading, error };
};

// Admin hooks
export const useAllOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordersAPI.getAllOrders(params);
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [JSON.stringify(params)]);

  return { orders, loading, error, pagination };
};

export const useOrderStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordersAPI.getOrderStatistics();
        setStatistics(response.data.statistics);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
};
