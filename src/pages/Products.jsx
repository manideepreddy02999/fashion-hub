import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import FilterSidebar from "../components/FilterSidebar/FilterSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import Loader from "../components/Loader/Loader";
import productService from "../services/productService";
import { applyFilters } from "../utils/filters";
import { SORT_OPTIONS } from "../utils/constants";
import "./Products.css";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brands: [],
    priceMin: "",
    priceMax: "",
    search: searchParams.get("search") || "",
    sortBy: "newest",
  });

  useEffect(() => {
    productService
      .getProducts()
      .then((res) => {
        setAllProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    if (cat || search) {
      setFilters((prev) => ({
        ...prev,
        category: cat || prev.category,
        search: search || prev.search,
      }));
    }
  }, [searchParams]);

  const filteredProducts = applyFilters(allProducts, filters);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (loading) return <Loader />;

  return (
    <div className="products-page page">
      <div className="container">
        <div className="products-header">
          <h1>All Categories</h1>
          <p>{filteredProducts.length} products found</p>
        </div>

        <div className="products-toolbar">
          <div className="products-search-wrap">
            <SearchBar placeholder="Search products..." />
          </div>
          <div className="products-sort">
            <label>Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-layout">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
          />

          <div className="products-content">
            {paginatedProducts.length > 0 ? (
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
