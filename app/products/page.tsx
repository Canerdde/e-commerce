"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts, getAllCategories, Product } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PriceSlider } from "@/components/PriceSlider";
import { formatPrice } from "@/lib/utils";
import { Filter, X, ArrowUpDown } from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const products = getProducts();
  const categories = ["All", ...getAllCategories()];
  const allColors = Array.from(
    new Set(products.flatMap((p) => p.colors.map((c) => c.name)))
  );

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const productColors = product.colors.map((c) => c.name);
        if (!selectedColors.some((color) => productColors.includes(color))) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy !== "default") {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [selectedCategory, priceRange, selectedColors, searchQuery, sortBy, products]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 2000]);
    setSelectedColors([]);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2000 ||
    selectedColors.length > 0;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <Breadcrumb items={[{ label: "Products" }]} />

        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">Products</h1>
              <p className="text-sm text-foreground-muted tracking-wide uppercase">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-background-secondary border border-foreground/10 focus:outline-none focus:border-accent transition-colors duration-200 text-sm cursor-pointer"
                >
                  <option value="default">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
              </div>
            </div>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-foreground-muted mb-4">
              <span>Search results for: &quot;{searchQuery}&quot;</span>
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"
              }`}
          >
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <div className="space-y-10 pb-4">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-background z-10 pb-4">
                  <h2 className="text-xs font-medium tracking-wider uppercase text-foreground-muted">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-accent hover:text-accent-hover transition-colors duration-200 tracking-wider uppercase"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-xs font-medium mb-5 text-foreground-muted tracking-wider uppercase">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left text-sm transition-colors duration-200 py-2 ${selectedCategory === category
                          ? "text-accent font-medium"
                          : "text-foreground-muted hover:text-foreground"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="text-xs font-medium mb-5 text-foreground-muted tracking-wider uppercase">
                    Price
                  </h3>
                  <PriceSlider
                    min={0}
                    max={2000}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="text-xs font-medium mb-5 text-foreground-muted tracking-wider uppercase">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => {
                      const product = products.find((p) =>
                        p.colors.some((c) => c.name === color)
                      );
                      const colorHex =
                        product?.colors.find((c) => c.name === color)?.hex || "#000000";
                      const isSelected = selectedColors.includes(color);

                      return (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`relative w-10 h-10 rounded-sm border-2 transition-all ${isSelected
                            ? "border-accent scale-110"
                            : "border-foreground/20 hover:border-foreground/40"
                            }`}
                          style={{ backgroundColor: colorHex }}
                          title={color}
                          aria-label={`Filter by ${color}`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <X className="w-4 h-4 text-background drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-5 py-3 border border-foreground/10 hover:bg-background-secondary transition-colors duration-200 text-sm tracking-wide"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 px-2 py-0.5 bg-accent text-background text-xs">
                    {[
                      selectedCategory !== "All" ? 1 : 0,
                      priceRange[0] !== 0 || priceRange[1] !== 2000 ? 1 : 0,
                      selectedColors.length,
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-foreground-muted mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} layout="asymmetric" showQuickView={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
