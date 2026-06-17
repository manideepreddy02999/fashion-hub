import React from "react";
import { CATEGORIES, BRANDS } from "../../utils/constants";
import { FiFilter } from "react-icons/fi";
import "./FilterSidebar.css";

const FilterSidebar = ({ filters, onFilterChange, isOpen, onToggle }) => {
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? "" : category,
    });
  };

  const handleBrandChange = (brand) => {
    const brands = filters.brands || [];
    const updated = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    onFilterChange({ ...filters, brands: updated });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value ? Number(value) : "" });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "",
      brands: [],
      priceMin: "",
      priceMax: "",
      search: filters.search || "",
      sortBy: filters.sortBy || "newest",
    });
  };

  return (
    <>
      <button className="filter-mobile-toggle" onClick={onToggle}>
        <FiFilter /> Filters
      </button>
      <div className={`filter-mobile-overlay ${isOpen ? "open" : ""}`} onClick={onToggle}></div>
      <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="filter-clear" onClick={clearFilters}>Clear All</button>
        </div>

        <div className="filter-group">
          <h4>Category</h4>
          {CATEGORIES.map((cat) => (
            <div className="filter-option" key={cat.value}>
              <input
                type="checkbox"
                id={`cat-${cat.value}`}
                checked={filters.category === cat.value}
                onChange={() => handleCategoryChange(cat.value)}
              />
              <label htmlFor={`cat-${cat.value}`}>{cat.label}</label>
            </div>
          ))}
        </div>

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="filter-price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ""}
              onChange={(e) => handlePriceChange("priceMin", e.target.value)}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ""}
              onChange={(e) => handlePriceChange("priceMax", e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <h4>Brand</h4>
          {BRANDS.slice(0, 8).map((brand) => (
            <div className="filter-option" key={brand}>
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={(filters.brands || []).includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <label htmlFor={`brand-${brand}`}>{brand}</label>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
