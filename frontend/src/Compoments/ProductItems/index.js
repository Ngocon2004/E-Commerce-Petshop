import { TfiFullscreen } from 'react-icons/tfi';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { FaRegHeart } from 'react-icons/fa';
import { useContext } from 'react';
import React from 'react';
import { Mycontext } from '../../App';
import { useNavigate } from 'react-router-dom';

const ProductItems = props => {
  const { product, itemView } = props;

  const context = useContext(Mycontext);
  const navigate = useNavigate();
  const viewProductDetails = product => {
    context.setisOpenProductModal(true);
    context.setProduct(product);
  };

  // Get product image from API data
  const getProductImage = () => {
    if (product?.images && product.images.length > 0) {
      return product.images[0].value; // First image from API
    }
    return 'https://via.placeholder.com/300x300?text=No+Image'; // Fallback image
  };

  // Get product price info from variants
  const getProductPriceInfo = () => {
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      return {
        originalPrice: variant.price || product.product_buy_price,
        discountAmount: variant.discount_amount || 0,
        finalPrice:
          variant.final_price || variant.price - (variant.discount_amount || 0),
        discountPercentage: variant.discount_percentage || 0,
        hasDiscount: variant.discount_amount > 0,
      };
    }
    return {
      originalPrice: product?.product_buy_price || 0,
      discountAmount: 0,
      finalPrice: product?.product_buy_price || 0,
      discountPercentage: 0,
      hasDiscount: false,
    };
  };

  // Check if product is in stock
  const isInStock = () => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.some(
        variant => variant.in_stock && variant.is_available
      );
    }
    return true; // Assume in stock if no variants
  };

  const priceInfo = getProductPriceInfo();

  return (
    <>
      <div
        className={`${product?.id || ''} productItem ${itemView || 'four'}`}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <div className="imgWrapper" onClick={() => viewProductDetails(product)}>
          <img
            alt={product?.product_name || 'Product'}
            src={getProductImage()}
            className="w-100"
            onError={e => {
              e.target.src =
                'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>

        <div className="info p-2">
          <h6
            className="product-name-link"
            style={{
              fontSize: '14px',
              fontWeight: '600',
              height: '45px',
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
            }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product?.product_name || 'Tên sản phẩm'}
          </h6>

          {/* Stock status */}
          <span
            className={`d-block mb-2 ${isInStock() ? 'text-success' : 'text-danger'}`}
            style={{ fontSize: '12px', fontWeight: '600' }}
          >
            {isInStock() ? 'Còn hàng' : 'Hết hàng'}
          </span>

          {/* Brand */}
          {product?.brand_name && (
            <span
              className="text-muted d-block mb-1"
              style={{ fontSize: '11px' }}
            >
              {product.brand_name}
            </span>
          )}

          {/* Rating */}
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={Number(product?.product_avg_rating) || 0}
            readOnly
            size="small"
            precision={0.5}
          />

          {/* Price */}
          <div className="priceRow">
            {priceInfo.hasDiscount && (
              <span className="oldPrice">
                {priceInfo.originalPrice.toLocaleString()}đ
              </span>
            )}
            <span
              className={`netPrice ${priceInfo.hasDiscount ? 'text-danger' : 'text-dark'}`}
            >
              {priceInfo.finalPrice.toLocaleString()}đ
            </span>
          </div>

          {/* Sold quantity */}
          {product?.product_sold_quantity > 0 && (
            <span className="text-muted d-block" style={{ fontSize: '11px' }}>
              Đã bán: {product.product_sold_quantity}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {priceInfo.hasDiscount && (
          <span className="badge badge-primary">
            -{priceInfo.discountPercentage}%
          </span>
        )}

        {/* Action buttons */}
        <div className="actions">
          <Button onClick={() => viewProductDetails(product)}>
            <TfiFullscreen />
          </Button>
          <Button>
            <FaRegHeart />
          </Button>
        </div>
      </div>
    </>
  );
};
export default ProductItems;
