import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import productService from "../services/productService";
import "./CategoryPage.css";

const Men = () => {
  const [mensData, setMensData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productService
      .getProductsByCategory("men")
      .then((response) => { setMensData(response.data); })
      .catch((error) => { console.error("Error fetching mens data:", error); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="category-page page">
      <div className="category-hero" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
        <h1>Men's Collection</h1>
        <p>Discover premium menswear for every occasion</p>
      </div>
      <div className="container">
        <div className="category-results">
          <p>{mensData.length} products found</p>
        </div>
        <div className="products-grid">
          {mensData.map((item) => (<ProductCard key={item.id} product={item} />))}
        </div>
        {mensData.length === 0 && (
          <div className="products-empty"><h3>No products available</h3><p>Check back soon for new arrivals!</p></div>
        )}
      </div>
    </div>
  );
};

export default Men;
