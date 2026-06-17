import api from "./api";
import { STORAGE_KEYS } from "../utils/constants";

const authService = {
  login: (email, password) => {
    return api
      .get("/users", { params: { email } })
      .then((response) => {
        const user = response.data.find((u) => u.email === email);
        if (user && user.password === password) {
          const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
            phone: user.phone || "",
            address: user.address || "",
            token: token,
          };
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
          return { success: true, user: userData };
        } else {
          return { success: false, message: "Invalid email or password" };
        }
      });
  },

  register: (userData) => {
    return api
      .get("/users", { params: { email: userData.email } })
      .then((response) => {
        if (response.data.length > 0) {
          return { success: false, message: "Email already exists" };
        }
        return api
          .post("/users", {
            ...userData,
            role: "user",
          })
          .then((res) => {
            return { success: true, user: res.data };
          });
      });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === "admin";
  },
};

export default authService;
