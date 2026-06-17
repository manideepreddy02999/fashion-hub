export const filterByCategory = (products, category) => {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
};

export const filterByBrand = (products, brands) => {
  if (!brands || brands.length === 0) return products;
  return products.filter((p) => brands.includes(p.brand));
};

export const filterByPriceRange = (products, min, max) => {
  return products.filter((p) => {
    if (min && p.productPrice < min) return false;
    if (max && p.productPrice > max) return false;
    return true;
  });
};

export const filterByColor = (products, colors) => {
  if (!colors || colors.length === 0) return products;
  return products.filter((p) =>
    p.colors && p.colors.some((c) => colors.includes(c))
  );
};

export const filterBySize = (products, sizes) => {
  if (!sizes || sizes.length === 0) return products;
  return products.filter((p) =>
    p.sizes && p.sizes.some((s) => sizes.includes(s))
  );
};

export const filterBySearch = (products, query) => {
  if (!query || query.trim() === "") return products;
  const lowerQuery = query.toLowerCase().trim();
  return products.filter(
    (p) =>
      p.productName.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery))
  );
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.productPrice - b.productPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.productPrice - a.productPrice);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};

export const applyFilters = (products, filters) => {
  let result = [...products];

  if (filters.category) {
    result = filterByCategory(result, filters.category);
  }
  if (filters.brands && filters.brands.length > 0) {
    result = filterByBrand(result, filters.brands);
  }
  if (filters.priceMin || filters.priceMax) {
    result = filterByPriceRange(result, filters.priceMin, filters.priceMax);
  }
  if (filters.colors && filters.colors.length > 0) {
    result = filterByColor(result, filters.colors);
  }
  if (filters.sizes && filters.sizes.length > 0) {
    result = filterBySize(result, filters.sizes);
  }
  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }
  if (filters.sortBy) {
    result = sortProducts(result, filters.sortBy);
  }

  return result;
};
