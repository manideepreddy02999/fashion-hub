import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Auth.css";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(formData.email, formData.password);
    if (result.success) {
      alert("Login successful! Welcome back, " + result.user.name);
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-page page">
      <div className="auth-container">
        <div className="auth-card animate-scaleIn">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to your account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <a onClick={() => navigate("/register")}>Register</a></p>
          </div>

          <div className="auth-demo-info">
            <p><strong>Demo User:</strong> rahul@example.com / password123</p>
            <p><strong>Admin:</strong> admin@fashionhub.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
