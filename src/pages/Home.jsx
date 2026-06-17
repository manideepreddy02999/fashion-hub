import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection/HeroSection";
import ProductCard from "../components/ProductCard/ProductCard";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import Loader from "../components/Loader/Loader";
import productService from "../services/productService";
import "./Home.css";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, categoriesRes, featuredRes, trendingRes, newRes] =
          await Promise.all([
            productService.getBanners(),
            productService.getCategories(),
            productService.getFeaturedProducts(),
            productService.getTrendingProducts(),
            productService.getNewArrivals(),
          ]);
        setBanners(bannersRes.data);
        setCategories(categoriesRes.data);
        setFeatured(featuredRes.data);
        setTrending(trendingRes.data);
        setNewArrivals(newRes.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const promoBanners = banners.filter((b) => b.type === "promo");

  return (
    <div className="home-page">
      <HeroSection banners={banners} />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="divider"></div>
          <p className="section-subtitle">Find your perfect style</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section section-grey">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <div className="divider"></div>
            <p className="section-subtitle">Handpicked for you</p>
            <div className="products-grid">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <button className="btn btn-outline" onClick={() => navigate("/products")}>
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Promo Banners */}
      {promoBanners.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="promo-grid">
              {promoBanners.map((promo) => (
                <div
                  key={promo.id}
                  className="promo-banner"
                  onClick={() => navigate(promo.buttonLink)}
                >
                  <img src={promo.image} alt={promo.title} />
                  <div className="promo-content">
                    <h3>{promo.title}</h3>
                    <p>{promo.subtitle}</p>
                    <button className="btn btn-primary btn-sm">{promo.buttonText}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="section section-grey">
          <div className="container">
            <h2 className="section-title">Trending Now</h2>
            <div className="divider"></div>
            <p className="section-subtitle">What everyone's wearing</p>
            <div className="products-grid">
              {trending.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">New Arrivals</h2>
            <div className="divider"></div>
            <p className="section-subtitle">Fresh from the runway</p>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay in Style</h2>
            <p>Subscribe to get exclusive offers, style tips, and new arrival alerts.</p>
            <form className="newsletter-form-home" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
