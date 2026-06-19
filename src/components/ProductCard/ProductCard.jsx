import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { formatPrice, calculateDiscount } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = calculateDiscount(product.originalPrice, product.productPrice);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "Free Size",
      selectedColor: product.colors?.[0] || "Default",
      quantity: 1,
    });
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <FaStar key={i} className="star-filled" />
        ) : (
          <FaRegStar key={i} className="star-empty" />
        )
      );
    }
    return stars;
  };

  return (
    <div className={`product-card ${!product.inStock ? "out-of-stock" : ""}`} onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-card-image">
        <img src={product.productImageUrl} alt={product.productName} />

        {product.isNewArrival && (
          <span className="product-card-badge badge-new">New</span>
        )}
        {product.isTrending && !product.isNewArrival && (
          <span className="product-card-badge badge-trending">Trending</span>
        )}
        {discount > 0 && !product.isNewArrival && !product.isTrending && (
          <span className="product-card-badge badge-discount">{discount}% Off</span>
        )}

        <button
          className={`product-card-wishlist ${inWishlist ? "active" : ""}`}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>

        <div className="product-card-actions">
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={!product.inStock}>
            <FaShoppingCart /> {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name">{product.productName}</h3>
        <div className="product-card-price">
          <span className="current-price">{formatPrice(product.productPrice)}</span>
          {product.originalPrice > product.productPrice && (
            <>
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
              <span className="discount">({discount}% off)</span>
            </>
          )}
        </div>
        <div className="product-card-rating">
          <div className="rating-stars">{renderStars(product.rating)}</div>
          <span className="rating-count">({product.reviewCount})</span>
          {!product.inStock && <span className="out-of-stock-text">Out of Stock</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
