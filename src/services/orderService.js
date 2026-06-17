import api from "./api";

const orderService = {
  createOrder: (orderData) => {
    return api.post("/orders", {
      ...orderData,
      orderDate: new Date().toISOString(),
      status: "pending",
    });
  },

  getOrders: (userId) => {
    return api.get(`/orders?userId=${userId}`);
  },

  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },

  getAllOrders: () => {
    return api.get("/orders");
  },

  updateOrderStatus: (id, status) => {
    return api.patch(`/orders/${id}`, { status });
  },
};

export default orderService;
