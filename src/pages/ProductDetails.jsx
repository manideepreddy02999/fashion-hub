import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShoppingCart, FaShare } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import productService from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import { formatPrice, calculateDiscount } from "../utils/formatPrice";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    productService
      .getProductById(id)
      .then((res) => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || "");
        setSelectedColor(res.data.colors?.[0] || "");
        return productService.getProductsByCategory(res.data.category);
      })
      .then((res) => {
        setRelatedProducts(res.data.filter((p) => p.id !== parseInt(id)).slice(0, 4));
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="page container" style={{ padding: "4rem", textAlign: "center" }}><h2>Product not found</h2></div>;

  const discount = calculateDiscount(product.originalPrice, product.productPrice);
  const inWishlist = isInWishlist(product.id);
  const images = [product.productImageUrl, product.productImageUrl, product.productImageUrl];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
    alert("Added to cart!");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating) ? <FaStar key={i} className="star-filled" /> : <FaRegStar key={i} className="star-empty" />);
    }
    return stars;
  };

  return (
    <div className="product-details-page page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Back
        </button>

        <div className="pd-layout">
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img src={images[activeImage]} alt={product.productName} />
              {discount > 0 && <span className="pd-discount-badge">{discount}% OFF</span>}
            </div>
            <div className="pd-thumbnails">
              {images.map((img, i) => (
                <div key={i} className={`pd-thumb ${activeImage === i ? "active" : ""}`} onClick={() => setActiveImage(i)}>
                  <img src={img} alt={`${product.productName} ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pd-info">
            <p className="pd-brand">{product.brand}</p>
            <h1 className="pd-name">{product.productName}</h1>
            <div className="pd-rating">
              <div className="rating-stars">{renderStars(product.rating)}</div>
              <span className="pd-rating-text">{product.rating} ({product.reviewCount} reviews)</span>
              {!product.inStock && <span className="out-of-stock-text" style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: 'var(--space-2)' }}>Out of Stock</span>}
            </div>

            <div className="pd-price">
              <span className="pd-current-price">{formatPrice(product.productPrice)}</span>
              {product.originalPrice > product.productPrice && (
                <>
                  <span className="pd-original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="pd-discount">{discount}% off</span>
                </>
              )}
            </div>
            <p className="pd-tax-info">inclusive of all taxes</p>

            <div className="pd-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-sizes">
                <h3>Select Size</h3>
                <div className="pd-size-options">
                  {product.sizes.map((size) => (
                    <button key={size} className={`pd-size-btn ${selectedSize === size ? "active" : ""}`} onClick={() => setSelectedSize(size)}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="pd-colors">
                <h3>Select Color</h3>
                <div className="pd-color-options">
                  {product.colors.map((color) => (
                    <button key={color} className={`pd-color-btn ${selectedColor === color ? "active" : ""}`} onClick={() => setSelectedColor(color)}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-quantity">
              <h3>Quantity</h3>
              <div className="pd-qty-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button className="btn btn-primary btn-lg pd-add-cart" onClick={handleAddToCart} disabled={!product.inStock}>
                <FaShoppingCart /> {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button className={`btn btn-outline btn-lg pd-wishlist-btn ${inWishlist ? "active" : ""}`} onClick={() => toggleWishlist(product)}>
                {inWishlist ? <FaHeart /> : <FaRegHeart />} {inWishlist ? "Wishlisted" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="pd-related section">
            <h2 className="section-title">Related Products</h2>
            <div className="divider"></div>
            <div className="products-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
