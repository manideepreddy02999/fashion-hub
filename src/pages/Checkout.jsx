import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import orderService from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from "../utils/constants";
import "./Checkout.css";

const Checkout = () => {
  const { checkoutItems: cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const tax = Math.round(cartTotal * TAX_RATE);
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const orderTotal = cartTotal + tax + shipping;

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        totalAmount: orderTotal,
        tax,
        shippingAddress: shippingInfo,
        paymentMethod,
      };
      await orderService.createOrder(orderData);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page page">
        <div className="container">
          <div className="order-success animate-scaleIn">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. You will receive a confirmation shortly.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate("/orders")}>View Orders</button>
              <button className="btn btn-outline" onClick={() => navigate("/products")}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`checkout-step ${step >= 1 ? "active" : ""}`}><span>1</span> Shipping</div>
          <div className={`checkout-step ${step >= 2 ? "active" : ""}`}><span>2</span> Payment</div>
          <div className={`checkout-step ${step >= 3 ? "active" : ""}`}><span>3</span> Confirm</div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-area">
            {step === 1 && (
              <div className="checkout-section">
                <h3>Shipping Information</h3>
                <div className="form-grid">
                  <div className="input-group"><label>Full Name</label><input name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required /></div>
                  <div className="input-group"><label>Phone</label><input name="phone" value={shippingInfo.phone} onChange={handleShippingChange} required /></div>
                  <div className="input-group full-width"><label>Address</label><input name="address" value={shippingInfo.address} onChange={handleShippingChange} required /></div>
                  <div className="input-group"><label>City</label><input name="city" value={shippingInfo.city} onChange={handleShippingChange} required /></div>
                  <div className="input-group"><label>State</label><input name="state" value={shippingInfo.state} onChange={handleShippingChange} required /></div>
                  <div className="input-group"><label>Pincode</label><input name="pincode" value={shippingInfo.pincode} onChange={handleShippingChange} required /></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <div><strong>Cash on Delivery</strong><p>Pay when your order arrives</p></div>
                  </label>
                  <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    <div><strong>Credit / Debit Card</strong><p>Pay securely online</p></div>
                  </label>
                  <label className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                    <div><strong>UPI Payment</strong><p>Google Pay, PhonePe, Paytm</p></div>
                  </label>
                </div>
                <div className="checkout-nav-btns">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section">
                <h3>Review Your Order</h3>
                <div className="review-section">
                  <h4>Shipping to:</h4>
                  <p>{shippingInfo.fullName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                  <p>Phone: {shippingInfo.phone}</p>
                </div>
                <div className="review-section">
                  <h4>Payment: {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Card Payment" : "UPI Payment"}</h4>
                </div>
                <div className="review-items">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="review-item">
                      <img src={item.productImageUrl} alt={item.productName} />
                      <div>
                        <p className="review-item-name">{item.productName}</p>
                        <p className="review-item-detail">Qty: {item.quantity} | {item.selectedSize} | {item.selectedColor}</p>
                      </div>
                      <span>{formatPrice(item.productPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-nav-btns">
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="summary-row"><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(orderTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
