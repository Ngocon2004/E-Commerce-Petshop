import { useState, useEffect } from 'react';
import { reviewsAPI } from '../api';

// Custom hook for product reviews
export const useProductReviews = (productId, params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewsAPI.getProductReviews(productId, params);
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, JSON.stringify(params)]);

  return { reviews, loading, error, pagination };
};

// Custom hook for user reviews
export const useUserReviews = (params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewsAPI.getUserReviews(params);
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [JSON.stringify(params)]);

  return { reviews, loading, error, pagination };
};

// Custom hook for creating review
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReview = async reviewData => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.createReview(reviewData);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createReview, loading, error };
};

// Custom hook for updating review
export const useUpdateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateReview = async (id, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.updateReview(id, reviewData);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateReview, loading, error };
};

// Custom hook for deleting review
export const useDeleteReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteReview = async id => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.deleteReview(id);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteReview, loading, error };
};

// Custom hook for recent reviews
export const useRecentReviews = (limit = 10) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewsAPI.getRecentReviews(limit);
        setReviews(response.data.reviews);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReviews();
  }, [limit]);

  return { reviews, loading, error };
};

// Custom hook for review statistics
export const useReviewStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewsAPI.getReviewStatistics();
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
