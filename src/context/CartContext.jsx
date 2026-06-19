import React, { createContext, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "./AuthContext";
import { STORAGE_KEYS } from "../utils/constants";
import productService from "../services/productService";
import {
  setCartItems as setCartItemsAction,
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "../redux/CartSlice.jsx";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const getStorageKey = () => {
    return user ? `${STORAGE_KEYS.CART}_${user.id}` : STORAGE_KEYS.CART;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      const parsedItems = saved ? JSON.parse(saved) : [];
      dispatch(setCartItemsAction(parsedItems));

      if (parsedItems.length > 0) {
        productService.getProducts()
          .then((res) => {
            const allProducts = res.data;
            const updatedItems = parsedItems.map((item) => {
              const freshItem = allProducts.find((p) => p.id === item.id);
              if (freshItem) {
                return { 
                  ...freshItem, 
                  cartItemId: item.cartItemId, 
                  quantity: item.quantity, 
                  selectedSize: item.selectedSize, 
                  selectedColor: item.selectedColor 
                };
              }
              return item;
            });
            dispatch(setCartItemsAction(updatedItems));
            localStorage.setItem(getStorageKey(), JSON.stringify(updatedItems));
          })
          .catch((err) => console.error("Error refreshing cart:", err));
      }
    } catch {
      dispatch(setCartItemsAction([]));
    }
  }, [user, dispatch]);

  const addToCart = (product) => {
    const cartItem = {
      ...product,
      cartItemId:
        product.cartItemId ||
        `${product.id}_${product.selectedSize || "default"}_${product.selectedColor || "default"}_${Date.now()}`,
    };
    dispatch(addToCartAction({ item: cartItem, storageKey: getStorageKey() }));
  };

  const removeFromCart = (cartItemId) => {
    dispatch(removeFromCartAction({ cartItemId, storageKey: getStorageKey() }));
  };

  const updateQuantity = (cartItemId, quantity) => {
    dispatch(updateQuantityAction({ cartItemId, quantity, storageKey: getStorageKey() }));
  };

  const clearCart = () => {
    dispatch(clearCartAction({ storageKey: getStorageKey() }));
  };

  const checkoutItems = cartItems.filter(item => item.inStock !== false);

  const cartCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = checkoutItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        checkoutItems,
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

