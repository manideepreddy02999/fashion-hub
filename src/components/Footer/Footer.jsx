import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-text">
            Fashion<span>Hub</span>
          </div>
          <p>
            Your ultimate destination for trendy fashion. Discover curated
            collections for Men, Women, and Kids with the latest styles at
            amazing prices.
          </p>
          <div className="footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a onClick={() => navigate("/")}>Home</a></li>
            <li><a onClick={() => navigate("/products")}>All Categories</a></li>
            <li><a onClick={() => navigate("/men")}>Men</a></li>
            <li><a onClick={() => navigate("/women")}>Women</a></li>
            <li><a onClick={() => navigate("/kids")}>Kids</a></li>
            <li><a onClick={() => navigate("/cart")}>Cart</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a onClick={() => navigate("/profile")}>My Account</a></li>
            <li><a onClick={() => navigate("/orders")}>Track Order</a></li>
            <li><a onClick={() => navigate("/wishlist")}>Wishlist</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section footer-newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to get updates on new arrivals and exclusive offers.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-contact">
            <p><HiOutlinePhone /> +91 98765 43210</p>
            <p><HiOutlineMail /> support@fashionhub.com</p>
            <p><HiOutlineLocationMarker /> Mumbai, India</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Fashion Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
