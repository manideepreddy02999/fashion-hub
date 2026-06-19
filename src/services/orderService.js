import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    try {
      const categoryStr = orderData.items && orderData.items[0] && orderData.items[0].category 
        ? String(orderData.items[0].category).toUpperCase().substring(0, 4) 
        : "GENE";
      
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const orderNumber = `${categoryStr}${randomNum}`;
      
      const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      return api.post("/orders", {
        ...orderData,
        id,
        orderNumber,
        orderDate: new Date().toISOString(),
        status: "pending",
      });
    } catch (error) {
      console.error("Error creating order:", error);
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
