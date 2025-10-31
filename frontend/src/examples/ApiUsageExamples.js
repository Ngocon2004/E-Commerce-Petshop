// API Usage Examples
// This file demonstrates how to use the API client and custom hooks

import React, { useState, useEffect } from 'react';
import {
  authAPI,
  productsAPI,
  categoriesAPI,
  brandsAPI,
  cartAPI,
  ordersAPI,
  reviewsAPI,
} from '../api';
import {
  useAuth,
  useProducts,
  useProduct,
  useCart,
  useUserOrders,
  useProductReviews,
} from '../custom-hooks';
import { formatErrorMessage, formatCurrency } from '../utils/apiHelpers';
import ProductCard from '../components/ProductCard';

// Example 1: Using API directly
export const DirectApiExample = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getProducts({
        page: 1,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'DESC',
      });
      setProducts(response.data.products);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products (Direct API)</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.product_name}</h3>
          <p>Price: {formatCurrency(product.product_buy_price)}</p>
        </div>
      ))}
    </div>
  );
};

// Example 2: Using custom hooks with new components
export const CustomHooksExample = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { products, loading, error } = useProducts({
    page: 1,
    limit: 5,
  });
  const { cartItems, removeFromCart } = useCart();

  const handleLogin = async () => {
    try {
      await login({
        user_email: 'user@example.com',
        user_password: 'password123',
      });
    } catch (err) {
      console.error('Login failed:', formatErrorMessage(err));
    }
  };

  return (
    <div>
      <h2>Custom Hooks Example</h2>

      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.user_name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <h3>Products</h3>
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>Error: {formatErrorMessage(error)}</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <h3>Cart ({cartItems.length} items)</h3>
      {cartItems.map(item => (
        <div
          key={item.id}
          className="d-flex justify-content-between align-items-center"
        >
          <span>
            {item.product_name} x {item.quantity}
          </span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

// Example 3: Product detail with reviews
export const ProductDetailExample = ({ productId }) => {
  const { product, loading, error } = useProduct(productId);
  const { reviews, loading: reviewsLoading } = useProductReviews(productId);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        product_id: product.id,
        variant_id: product.variants?.[0]?.id || 1,
        quantity: 1,
      });
    } catch (err) {
      console.error('Add to cart failed:', formatErrorMessage(err));
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {formatErrorMessage(error)}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h2>{product.product_name}</h2>
      <p>{product.product_description}</p>
      <p>Price: {formatCurrency(product.product_buy_price)}</p>
      <p>Rating: {product.product_avg_rating}/5</p>

      <button onClick={handleAddToCart}>Add to Cart</button>

      <h3>Reviews</h3>
      {reviewsLoading ? (
        <div>Loading reviews...</div>
      ) : (
        reviews.map(review => (
          <div key={review.id}>
            <p>
              <strong>{review.user_name}</strong> - {review.rating}/5
            </p>
            <p>{review.review_text}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Example 4: User orders
export const UserOrdersExample = () => {
  const { orders, loading, error } = useUserOrders({ page: 1, limit: 10 });
  const { cancelOrder } = useOrders();

  const handleCancelOrder = async orderId => {
    try {
      await cancelOrder(orderId);
      // Refresh orders or update state
    } catch (err) {
      console.error('Cancel order failed:', formatErrorMessage(err));
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {formatErrorMessage(error)}</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.order_status}</p>
          <p>Total: {formatCurrency(order.order_total_cost)}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>

          {order.order_status === 'pending' && (
            <button onClick={() => handleCancelOrder(order.id)}>
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Example 5: Search functionality
export const SearchExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await productsAPI.searchProducts({
        q: searchTerm,
        page: 1,
        limit: 10,
      });
      setSearchResults(response.data.products);
    } catch (err) {
      console.error('Search failed:', formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Products</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div>
        {searchResults.map(product => (
          <div key={product.id}>
            <h4>{product.product_name}</h4>
            <p>Price: {formatCurrency(product.product_buy_price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 6: Admin functionality
export const AdminExample = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts({
        page: 1,
        limit: 20,
      });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Fetch products failed:', formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async productData => {
    try {
      const response = await productsAPI.createProduct(productData);
      console.log('Product created:', response.data.product);
      // Refresh products list
      fetchAllProducts();
    } catch (err) {
      console.error('Create product failed:', formatErrorMessage(err));
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const response = await productsAPI.updateProduct(id, productData);
      console.log('Product updated:', response.data.product);
      // Refresh products list
      fetchAllProducts();
    } catch (err) {
      console.error('Update product failed:', formatErrorMessage(err));
    }
  };

  const handleDeleteProduct = async id => {
    try {
      await productsAPI.deleteProduct(id);
      console.log('Product deleted');
      // Refresh products list
      fetchAllProducts();
    } catch (err) {
      console.error('Delete product failed:', formatErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div>
      <h2>Admin - Products Management</h2>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div>
          {products.map(product => (
            <div key={product.id}>
              <h4>{product.product_name}</h4>
              <p>Price: {formatCurrency(product.product_buy_price)}</p>
              <button
                onClick={() =>
                  handleUpdateProduct(product.id, {
                    product_name: 'Updated Name',
                  })
                }
              >
                Update
              </button>
              <button onClick={() => handleDeleteProduct(product.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  DirectApiExample,
  CustomHooksExample,
  ProductDetailExample,
  UserOrdersExample,
  SearchExample,
  AdminExample,
};
