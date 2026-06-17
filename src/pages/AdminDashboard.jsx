import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import Loader from "../components/Loader/Loader";
import { formatPrice } from "../utils/formatPrice";
import { CATEGORIES, BRANDS } from "../utils/constants";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    productName: "",
    productPrice: "",
    originalPrice: "",
    productImageUrl: "",
    category: "men",
    subcategory: "",
    brand: BRANDS[0],
    description: "",
    sizes: [],
    colors: [],
    rating: 4.0,
    reviewCount: 0,
    inStock: true,
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    productService
      .getProducts()
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch((err) => { console.error("Error:", err); setLoading(false); });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      ...formData,
      productPrice: Number(formData.productPrice),
      originalPrice: Number(formData.originalPrice) || Number(formData.productPrice),
      rating: Number(formData.rating),
      reviewCount: Number(formData.reviewCount),
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        alert("Product updated successfully!");
      } else {
        await productService.addProduct(productData);
        alert("Product added successfully!");
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Make sure JSON Server is running.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      productPrice: product.productPrice,
      originalPrice: product.originalPrice,
      productImageUrl: product.productImageUrl,
      category: product.category,
      subcategory: product.subcategory || "",
      brand: product.brand,
      description: product.description,
      sizes: product.sizes || [],
      colors: product.colors || [],
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isNewArrival: product.isNewArrival,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      alert("Product deleted!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete product.");
    }
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
    setShowForm(true);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "Free Size", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "4", "5", "6", "7", "8", "9", "10", "11"];
  const allColors = ["White", "Black", "Blue", "Red", "Green", "Navy", "Pink", "Yellow", "Brown", "Grey", "Beige", "Maroon", "Olive", "Teal", "Purple", "Gold"];

  if (loading) return <Loader />;

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}. Manage your products here.</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="admin-category-tabs">
          <button className={`cat-tab ${selectedCategory === "all" ? "active" : ""}`} onClick={() => setSelectedCategory("all")}>
            All ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.value).length;
            return (
              <button key={cat.value} className={`cat-tab ${selectedCategory === cat.value ? "active" : ""}`} onClick={() => setSelectedCategory(cat.value)}>
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="admin-form-overlay" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
            <div className="admin-form-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <button type="button" className="admin-modal-close" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div className="input-group">
                    <label>Product Name *</label>
                    <input name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Classic Cotton Shirt" required />
                  </div>
                  <div className="input-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Price (₹) *</label>
                    <input name="productPrice" type="number" value={formData.productPrice} onChange={handleChange} placeholder="1999" required />
                  </div>
                  <div className="input-group">
                    <label>Original Price (₹)</label>
                    <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder="2999" />
                  </div>
                  <div className="input-group">
                    <label>Brand *</label>
                    <select name="brand" value={formData.brand} onChange={handleChange}>
                      {BRANDS.map((b) => (<option key={b} value={b}>{b}</option>))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Subcategory</label>
                    <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. shirts, dresses" />
                  </div>
                  <div className="input-group full-width">
                    <label>Image URL *</label>
                    <input name="productImageUrl" value={formData.productImageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." required />
                  </div>
                  <div className="input-group full-width">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product description..." rows="3" required style={{ width: "100%", padding: "var(--space-3) var(--space-4)", border: "1px solid var(--color-grey)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-primary)", fontSize: "var(--text-sm)", resize: "vertical" }} />
                  </div>
                </div>

                <div className="admin-form-section">
                  <label>Sizes (select applicable)</label>
                  <div className="admin-chips">
                    {allSizes.map((size) => (
                      <button type="button" key={size} className={`admin-chip ${formData.sizes.includes(size) ? "active" : ""}`} onClick={() => handleSizeToggle(size)}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-form-section">
                  <label>Colors (select applicable)</label>
                  <div className="admin-chips">
                    {allColors.map((color) => (
                      <button type="button" key={color} className={`admin-chip ${formData.colors.includes(color) ? "active" : ""}`} onClick={() => handleColorToggle(color)}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-form-toggles">
                  <label className="toggle-label">
                    <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
                    In Stock
                  </label>
                  <label className="toggle-label">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                    Featured
                  </label>
                  <label className="toggle-label">
                    <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} />
                    Trending
                  </label>
                  <label className="toggle-label">
                    <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} />
                    New Arrival
                  </label>
                </div>

                <div className="admin-form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingProduct(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.productImageUrl} alt={product.productName} className="admin-product-thumb" />
                  </td>
                  <td><span className="admin-product-name">{product.productName}</span></td>
                  <td><span className="admin-category-tag">{product.category}</span></td>
                  <td>{product.brand}</td>
                  <td>{formatPrice(product.productPrice)}</td>
                  <td>
                    <span className={`stock-tag ${product.inStock ? "in-stock" : "out-stock"}`}>
                      {product.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-tags">
                      {product.isFeatured && <span className="mini-tag featured">Featured</span>}
                      {product.isTrending && <span className="mini-tag trending">Trending</span>}
                      {product.isNewArrival && <span className="mini-tag new">New</span>}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(product)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(product.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="admin-empty">
              <FiPackage style={{ fontSize: 48, color: "var(--color-grey)" }} />
              <p>No products in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
