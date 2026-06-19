import React, { useState, useEffect } from "react";
import orderService from "../services/orderService";
import Loader from "../components/Loader/Loader";
import { formatPrice, formatDate } from "../utils/formatPrice";
import { ORDER_STATUSES } from "../utils/constants";
import { FiPackage } from "react-icons/fi";
import "./Orders.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAllOrders()
      .then((res) => {
        // Sort orders by date descending (newest first)
        const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      })
      .catch((err) => console.error("Error fetching all orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="orders-page page">
        <div className="container">
          <div className="orders-empty">
            <FiPackage className="orders-empty-icon" />
            <h2>No orders yet</h2>
            <p>Customers haven't placed any orders.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page">
      <div className="container">
        <h1>All Orders (Admin)</h1>
        <div className="orders-list">
          {orders.map((order) => {
            const status = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
            const customerName = order.shippingAddress?.fullName || "Unknown Customer";
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderNumber || order.id}</h3>
                    <p className="order-date" style={{ color: "var(--color-charcoal)", marginTop: "4px" }}>
                      {formatDate(order.orderDate)} • <strong>Customer: {customerName}</strong>
                    </p>
                  </div>
                  <span className="order-status" style={{ background: status.color + "20", color: status.color }}>
                    {status.label}
                  </span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatPrice(item.productPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span>Total</span>
                  <span className="order-total">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
