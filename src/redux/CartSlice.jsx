import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../utils/constants";

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cartItems) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(),
  },

  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      saveCartToStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== action.payload
      );
      saveCartToStorage(state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.cartItemId === cartItemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      saveCartToStorage(state.cartItems);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
