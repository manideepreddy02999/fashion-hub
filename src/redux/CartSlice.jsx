import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../utils/constants";

const saveCartToStorage = (key, cartItems) => {
  if (key) {
    localStorage.setItem(key, JSON.stringify(cartItems));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },

  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },

    addToCart: (state, action) => {
      const { item, storageKey } = action.payload;
      const existingItem = state.cartItems.find(
        (i) =>
          i.id === item.id &&
          i.selectedSize === item.selectedSize &&
          i.selectedColor === item.selectedColor
      );
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
      saveCartToStorage(storageKey, state.cartItems);
    },

    removeFromCart: (state, action) => {
      const { cartItemId, storageKey } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== cartItemId
      );
      saveCartToStorage(storageKey, state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity, storageKey } = action.payload;
      const item = state.cartItems.find((i) => i.cartItemId === cartItemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartToStorage(storageKey, state.cartItems);
    },

    clearCart: (state, action) => {
      const { storageKey } = action.payload;
      state.cartItems = [];
      saveCartToStorage(storageKey, state.cartItems);
    },
  },
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
