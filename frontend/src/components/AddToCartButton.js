import React, { useState } from 'react';
import { useCart } from '../custom-hooks/useCart';
import { useAuthGuard } from '../custom-hooks/useAuthGuard';
import { toast } from 'react-toastify';

const AddToCartButton = ({
  product,
  variant,
  quantity = 1,
  className = '',
  children = 'Thêm vào giỏ hàng',
  showQuantity = false,
}) => {
  const { addToCartWithAuth, loading } = useCart();
  const { canAddToCart } = useAuthGuard();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) {
      toast.error('Sản phẩm không hợp lệ');
      return;
    }

    try {
      setIsAdding(true);

      const cartItem = {
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity: quantity,
      };

      const success = await addToCartWithAuth(cartItem, canAddToCart);

      if (success) {
        toast.success('Đã thêm vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={handleAddToCart}
      disabled={loading || isAdding}
    >
      {loading || isAdding ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Đang thêm...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AddToCartButton;
