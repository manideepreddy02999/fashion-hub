import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./CartSlice.jsx";

const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
});

export default store;
