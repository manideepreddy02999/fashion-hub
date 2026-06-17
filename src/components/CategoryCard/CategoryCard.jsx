import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = category.slug === "shoes" || category.slug === "accessories"
      ? `/products?category=${category.slug}`
      : `/${category.slug}`;
    navigate(path);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <img src={category.image} alt={category.name} />
      <div className="category-card-overlay">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
