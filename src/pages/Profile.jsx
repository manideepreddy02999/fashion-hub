import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut } from "react-icons/fi";
import "./Profile.css";

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page page">
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">{user.name?.charAt(0).toUpperCase()}</div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              {isAdmin && <span className="admin-tag">Admin</span>}
            </div>
            <nav className="profile-nav">
              <a className="profile-nav-item active"><FiUser /> Account Details</a>
              <a className="profile-nav-item" onClick={() => navigate("/orders")}><FiPackage /> My Orders</a>
              <a className="profile-nav-item" onClick={() => navigate("/wishlist")}><FiHeart /> Wishlist</a>
              {isAdmin && <a className="profile-nav-item" onClick={() => navigate("/admin")}><FiMapPin /> Admin Panel</a>}
              <a className="profile-nav-item logout" onClick={handleLogout}><FiLogOut /> Logout</a>
            </nav>
          </div>

          <div className="profile-content">
            <h2>Account Details</h2>
            <div className="profile-info-card">
              <div className="info-row"><span className="info-label">Full Name</span><span className="info-value">{user.name}</span></div>
              <div className="info-row"><span className="info-label">Email</span><span className="info-value">{user.email}</span></div>
              <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{user.phone || "Not provided"}</span></div>
              <div className="info-row"><span className="info-label">Address</span><span className="info-value">{user.address || "Not provided"}</span></div>
              <div className="info-row"><span className="info-label">Role</span><span className="info-value" style={{ textTransform: "capitalize" }}>{user.role}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
