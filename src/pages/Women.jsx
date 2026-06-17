import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import productService from "../services/productService";
import "./CategoryPage.css";

const Women = () => {
  const [womenData, setWomenData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getProductsByCategory("women")
      .then((response) => { setWomenData(response.data); })
      .catch((error) => { console.error("Error fetching women data:", error); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="category-page page">
      <div className="category-hero" style={{ background: "linear-gradient(135deg, #e84393, #fd79a8)" }}>
        <h1>Women's Collection</h1>
        <p>Elegant styles for the modern woman</p>
      </div>
      <div className="container">
        <div className="category-results"><p>{womenData.length} products found</p></div>
        <div className="products-grid">
          {womenData.map((item) => (<ProductCard key={item.id} product={item} />))}
        </div>
        {womenData.length === 0 && (<div className="products-empty"><h3>No products available</h3></div>)}
      </div>
    </div>
  );
};

export default Women;
