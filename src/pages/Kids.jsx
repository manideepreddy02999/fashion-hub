import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import productService from "../services/productService";
import "./CategoryPage.css";

const Kids = () => {
  const [kidsData, setKidsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getProductsByCategory("kids")
      .then((response) => { setKidsData(response.data); })
      .catch((error) => { console.error("Error fetching kids data:", error); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="category-page page">
      <div className="category-hero" style={{ background: "linear-gradient(135deg, #00b894, #55efc4)" }}>
        <h1>Kids' Collection</h1>
        <p>Fun and comfortable fashion for little ones</p>
      </div>
      <div className="container">
        <div className="category-results"><p>{kidsData.length} products found</p></div>
        <div className="products-grid">
          {kidsData.map((item) => (<ProductCard key={item.id} product={item} />))}
        </div>
        {kidsData.length === 0 && (<div className="products-empty"><h3>No products available</h3></div>)}
      </div>
    </div>
  );
};

export default Kids;
