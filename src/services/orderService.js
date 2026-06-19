import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.get(`/orders?userId=${orderData.userId}`);
      const userOrders = response.data;
      const orderNumber = userOrders.length + 1;

      return api.post("/orders", {
        ...orderData,
        orderNumber,
        orderDate: new Date().toISOString(),
        status: "pending",
      });
    } catch (error) {
      console.error("Error generating order number:", error);
      throw error;
    }
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
