import api from "./api";

const productService = {
  getProducts: () => {
    return api.get("/products");
  },

  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  getProductsByCategory: (category) => {
    return api.get(`/products?category=${category}`);
  },

  searchProducts: (query) => {
    return api.get(`/products?q=${query}`);
  },

  getFeaturedProducts: () => {
    return api.get("/products?isFeatured=true");
  },

  getTrendingProducts: () => {
    return api.get("/products?isTrending=true");
  },

  getNewArrivals: () => {
    return api.get("/products?isNewArrival=true");
  },

  addProduct: (productData) => {
    return api.post("/products", productData);
  },

  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  getCategories: () => {
    return api.get("/categories");
  },

  getBanners: () => {
    return api.get("/banners");
  },
};

export default productService;
