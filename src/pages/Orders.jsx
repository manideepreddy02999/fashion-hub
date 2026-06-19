import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import orderService from "../services/orderService";
import Loader from "../components/Loader/Loader";
import { formatPrice, formatDate } from "../utils/formatPrice";
import { ORDER_STATUSES } from "../utils/constants";
import { FiPackage } from "react-icons/fi";
import "./Orders.css";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderService.getOrders(user.id)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="orders-page page">
        <div className="container">
          <div className="orders-empty">
            <FiPackage className="orders-empty-icon" />
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page">
      <div className="container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => {
            const status = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderNumber || order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
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

export default Orders;
