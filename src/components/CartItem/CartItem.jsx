import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.productImageUrl} alt={item.productName} />
      </div>
      <div className="cart-item-details">
        <div className="cart-item-top">
          <div>
            <h3 className="cart-item-name">{item.productName}</h3>
            <p className="cart-item-brand">{item.brand}</p>
            <div className="cart-item-variant">
              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
              {item.selectedColor && <span>Color: {item.selectedColor}</span>}
            </div>
          </div>
          <button
            className="cart-item-remove"
            onClick={() => removeFromCart(item.cartItemId)}
          >
            <FiTrash2 />
          </button>
        </div>
        <div className="cart-item-bottom">
          <div className="cart-item-quantity">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <span className="cart-item-price">
            {formatPrice(item.productPrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
