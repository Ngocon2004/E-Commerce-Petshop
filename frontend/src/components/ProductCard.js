import React, { useState } from 'react';
import { useAuth } from '../custom-hooks/useAuth';
import AddToCartButton from './AddToCartButton';
import ReviewButton from './ReviewButton';
import AuthRequiredMessage from './AuthRequiredMessage';
import { formatCurrency } from '../utils/apiHelpers';

const ProductCard = ({
  product,
  showAddToCart = true,
  showReview = true,
  showAuthMessage = true,
  className = 'card',
}) => {
  const { isAuthenticated } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  if (!product) {
    return <div className="card">Sản phẩm không tồn tại</div>;
  }

  return (
    <div className={`${className} h-100`}>
      <div className="card-body">
        {/* Product Image */}
        <div className="text-center mb-3">
          <img
            src={product.product_img || '/images/placeholder.jpg'}
            alt={product.product_name}
            className="img-fluid"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Info */}
        <h5 className="card-title">{product.product_name}</h5>
        <p className="card-text text-muted">
          {product.product_short_description}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="h5 text-primary">
            {formatCurrency(product.product_buy_price)}
          </span>
          {product.product_avg_rating && (
            <div className="mt-1">
              <span className="text-warning">
                {'★'.repeat(Math.floor(product.product_avg_rating))}
                {'☆'.repeat(5 - Math.floor(product.product_avg_rating))}
              </span>
              <span className="ms-2 text-muted">
                ({product.product_avg_rating}/5)
              </span>
            </div>
          )}
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Chọn loại:</label>
            <select
              className="form-select"
              value={selectedVariant?.id || ''}
              onChange={e => {
                const variant = product.variants.find(
                  v => v.id === parseInt(e.target.value)
                );
                setSelectedVariant(variant);
              }}
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.variant_name} -{' '}
                  {formatCurrency(variant.variant_price)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Auth Required Message */}
        {!isAuthenticated && showAuthMessage && (
          <AuthRequiredMessage
            message="Đăng nhập để thêm vào giỏ hàng và đặt hàng"
            className="alert alert-warning"
          />
        )}

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          {showAddToCart && (
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              className="btn-primary"
            />
          )}

          {showReview && (
            <ReviewButton
              productId={product.id}
              className="btn-outline-primary"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
