"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Search, Save, Percent } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminPricingPage() {
  const { products, updatePrice, updateDiscount } = useAdmin();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPrice, setEditingPrice] = useState<{
    productId: string;
    price: number;
    discount: number;
  } | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPrice = (product: Product) => {
    setEditingPrice({
      productId: product.id,
      price: product.price,
      discount: product.discount || 0,
    });
  };

  const handleSavePrice = () => {
    if (!editingPrice) return;
    updatePrice(editingPrice.productId, editingPrice.price);
    updateDiscount(editingPrice.productId, editingPrice.discount);
    showToast("Price updated successfully", "success");
    setEditingPrice(null);
  };

  const discountedProducts = products.filter((p) => p.discount && p.discount > 0);
  const totalDiscountValue = products.reduce((sum, p) => {
    if (p.discount) {
      return sum + (p.price * p.discount) / 100;
    }
    return sum;
  }, 0);

  if (editingPrice) {
    const product = products.find((p) => p.id === editingPrice.productId);
    if (!product) return null;

    const finalPrice = editingPrice.discount
      ? editingPrice.price * (1 - editingPrice.discount / 100)
      : editingPrice.price;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">
            Update Pricing: {product.name}
          </h1>
        </div>

        <div className="bg-background-secondary p-8 space-y-6">
          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Base Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editingPrice.price}
              onChange={(e) =>
                setEditingPrice({ ...editingPrice, price: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Discount (%)
            </label>
            <div className="relative">
              <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="number"
                min="0"
                max="100"
                value={editingPrice.discount}
                onChange={(e) =>
                  setEditingPrice({
                    ...editingPrice,
                    discount: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors pr-12"
              />
            </div>
            {editingPrice.discount > 0 && (
              <p className="mt-2 text-sm text-foreground-muted">
                Discount amount: {formatPrice((editingPrice.price * editingPrice.discount) / 100)}
              </p>
            )}
          </div>

          <div className="bg-background p-6 border border-foreground/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">Final Price</span>
              <span className="text-2xl font-light">
                {formatPrice(finalPrice)}
              </span>
            </div>
            {editingPrice.discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-muted line-through">
                  {formatPrice(editingPrice.price)}
                </span>
                <span className="text-xs text-accent">
                  Save {formatPrice(editingPrice.price - finalPrice)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSavePrice}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-background hover:bg-accent-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Price
            </button>
            <button
              onClick={() => setEditingPrice(null)}
              className="px-6 py-3 border border-foreground/10 hover:bg-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">
          Pricing & Discounts
        </h1>
        <p className="text-sm text-foreground-muted tracking-wide uppercase">
          Manage product pricing and discounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            Products with Discount
          </div>
          <div className="text-2xl font-light">{discountedProducts.length}</div>
        </div>
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            Total Discount Value
          </div>
          <div className="text-2xl font-light text-accent">{formatPrice(totalDiscountValue)}</div>
        </div>
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            Average Discount
          </div>
          <div className="text-2xl font-light">
            {discountedProducts.length > 0
              ? `${(
                  discountedProducts.reduce((sum, p) => sum + (p.discount || 0), 0) /
                  discountedProducts.length
                ).toFixed(1)}%`
              : "0%"}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const finalPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;

          return (
            <div
              key={product.id}
              className="bg-background-secondary p-6 flex items-center justify-between hover:bg-background transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-foreground-muted mb-3">{product.category}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <span
                      className={
                        product.discount ? "line-through text-foreground-muted text-sm" : "text-xl font-light"
                      }
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.discount && (
                      <>
                        <span className="text-xl font-light text-accent ml-2">
                          {formatPrice(finalPrice)}
                        </span>
                        <span className="text-sm text-accent ml-2">
                          (-{product.discount}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleEditPrice(product)}
                className="px-4 py-2 bg-accent text-background hover:bg-accent-hover transition-colors text-sm"
              >
                Edit Price
              </button>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-muted">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

