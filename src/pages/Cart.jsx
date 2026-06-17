import React from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem/CartItem";
import useCart from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from "../utils/constants";
import { FiShoppingCart } from "react-icons/fi";
import "./Cart.css";

const Cart = () => {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();
  const navigate = useNavigate();

  const tax = Math.round(cartTotal * TAX_RATE);
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const orderTotal = cartTotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingCart className="cart-empty-icon" />
            <h2>Your bag is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page">
      <div className="container">
        <h1 className="cart-title">Shopping Bag ({cartCount} items)</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
            <button className="btn btn-ghost cart-clear" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST 18%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-note">Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
