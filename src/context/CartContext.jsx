import React, { createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "../redux/CartSlice.jsx";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const addToCart = (product) => {
    const cartItem = {
      ...product,
      cartItemId:
        product.cartItemId ||
        `${product.id}_${product.selectedSize || "default"}_${product.selectedColor || "default"}_${Date.now()}`,
    };
    dispatch(addToCartAction(cartItem));
  };

  const removeFromCart = (cartItemId) => {
    dispatch(removeFromCartAction(cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    dispatch(updateQuantityAction({ cartItemId, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
