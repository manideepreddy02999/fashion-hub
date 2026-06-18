import React, { useState } from "react";
import { FaRegUser, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="logo-text">
          Fashion<span>Hub</span>
        </span>
      </div>

      <ul className="navbar-links">
        <li>
          <a
            className={isActive("/") ? "active-link" : ""}
            onClick={() => navigate("/")}
          >
            Home
          </a>
        </li>
        <li>
          <a
            className={isActive("/men") ? "active-link" : ""}
            onClick={() => navigate("/men")}
          >
            Men
          </a>
        </li>
        <li>
          <a
            className={isActive("/women") ? "active-link" : ""}
            onClick={() => navigate("/women")}
          >
            Women
          </a>
        </li>
        <li>
          <a
            className={isActive("/kids") ? "active-link" : ""}
            onClick={() => navigate("/kids")}
          >
            Kids
          </a>
        </li>
        <li>
          <a
            className={isActive("/products") ? "active-link" : ""}
            onClick={() => navigate("/products")}
          >
            All Categories
          </a>
        </li>
        
      </ul>

      <div className="nav-search-container">
        <FiSearch className="nav-search-icon" />
        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="menu-container">
        {isAdmin && (
          <div className="menu-item" onClick={() => navigate("/admin")}>
            <MdAdminPanelSettings className="icon" />
            <span>Admin</span>
          </div>
        )}

        <div
          className="menu-item"
          onClick={() =>
            navigate(isAuthenticated ? "/profile" : "/login")
          }
        >
          <FaRegUser className="icon" />
          <span>{isAuthenticated && user?.name ? user.name.split(" ")[0] : "Login"}</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/wishlist")}>
          <FaRegHeart className="icon" />
          {wishlistCount > 0 && (
            <span className="wishlist-badge">{wishlistCount}</span>
          )}
          <span>Wishlist</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/cart")}>
          <FaShoppingBag className="icon" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
          <span>Bag</span>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        <button
          className="mobile-nav-close"
          onClick={() => setMobileMenuOpen(false)}
        >
          <FiX />
        </button>
        <ul className="mobile-nav-links">
          <li><a onClick={() => handleNavClick("/")}>Home</a></li>
          <li><a onClick={() => handleNavClick("/men")}>Men</a></li>
          <li><a onClick={() => handleNavClick("/women")}>Women</a></li>
          <li><a onClick={() => handleNavClick("/kids")}>Kids</a></li>
          <li><a onClick={() => handleNavClick("/products")}>All Products</a></li>
          <li><a onClick={() => handleNavClick("/wishlist")}>Wishlist</a></li>
          <li><a onClick={() => handleNavClick("/cart")}>Cart</a></li>
          {isAdmin && (
            <li><a onClick={() => handleNavClick("/admin")}>Admin Dashboard</a></li>
          )}
          <li>
            <a onClick={() => handleNavClick(isAuthenticated ? "/profile" : "/login")}>
              {isAuthenticated ? "Profile" : "Login"}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
