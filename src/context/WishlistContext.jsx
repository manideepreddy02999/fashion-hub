import React, { createContext, useState, useEffect, useContext } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  const getStorageKey = () => {
    return user ? `${STORAGE_KEYS.WISHLIST}_${user.id}` : STORAGE_KEYS.WISHLIST;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      setWishlistItems(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlistItems([]);
    }
  }, [user]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      const next = [...prev, product];
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
      return next;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
