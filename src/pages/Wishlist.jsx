import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 as TrashIcon, FiHeart } from "react-icons/fi";
import ProductCard from "../components/ProductCard/ProductCard";
import useWishlist from "../hooks/useWishlist";
import useCart from "../hooks/useCart";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (refreshWishlist) {
      refreshWishlist();
    }
  }, []);

  const handleMoveToCart = (product) => {
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "Free Size",
      selectedColor: product.colors?.[0] || "Default",
      quantity: 1,
    });
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page page">
        <div className="container">
          <div className="wishlist-empty">
            <FiHeart className="wishlist-empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and review them anytime.</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page">
      <div className="container">
        <h1 className="wishlist-title">My Wishlist ({wishlistItems.length} items)</h1>
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item-wrap">
              <ProductCard product={item} />
              <div className="wishlist-item-actions">
                <button className="btn btn-primary btn-sm btn-block" onClick={() => handleMoveToCart(item)} disabled={!item.inStock}>
                  {item.inStock ? "Move to Cart" : "Out of Stock"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeFromWishlist(item.id)}>
                  <TrashIcon /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
