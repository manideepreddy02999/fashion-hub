import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import productService from "../../services/productService";
import { formatPrice } from "../../utils/formatPrice";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "Search for products..." }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      productService
        .searchProducts(value.trim())
        .then((res) => {
          setResults(res.data.slice(0, 8));
          setShowResults(true);
        })
        .catch(() => setResults([]));
    }, 300);
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setQuery("");
    }
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <div className="search-bar-input-wrap">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
      </div>
      {showResults && (
        <div className="search-bar-results">
          {results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => handleSelect(product.id)}
              >
                <img src={product.productImageUrl} alt={product.productName} />
                <div className="search-result-info">
                  <h4>{product.productName}</h4>
                  <p>{formatPrice(product.productPrice)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="search-no-results">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
