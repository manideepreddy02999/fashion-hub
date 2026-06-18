export const API_URL = import.meta.env.VITE_API_URL;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
};

export const CATEGORIES = [
  { label: "Men", value: "men", slug: "men" },
  { label: "Women", value: "women", slug: "women" },
  { label: "Kids", value: "kids", slug: "kids" },
  { label: "Shoes", value: "shoes", slug: "shoes" },
  { label: "Accessories", value: "accessories", slug: "accessories" },
];

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Popularity", value: "popular" },
];

export const BRANDS = [
  "Fashion Hub Originals",
  "Urban Edge",
  "Royal Leather Co.",
  "Street Style",
  "Coastal Living",
  "Elegance",
  "Chic Studio",
  "Heritage Weaves",
  "Ethnic Vogue",
  "Little Stars",
  "Tiny Fashion",
  "StepUp",
  "TimeKeeper",
  "ShadesMaster",
];

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "#f59e0b" },
  confirmed: { label: "Confirmed", color: "#3b82f6" },
  shipped: { label: "Shipped", color: "#8b5cf6" },
  delivered: { label: "Delivered", color: "#10b981" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

export const TAX_RATE = 0.18;
export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_CHARGE = 99;
