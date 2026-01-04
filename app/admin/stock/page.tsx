"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/lib/products";
import { Search, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminStockPage() {
  const { products, updateStock, bulkUpdateStock } = useAdmin();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStock, setEditingStock] = useState<{
    productId: string;
    stock: Product["stock"];
  } | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStock = (product: Product) => {
    setEditingStock({
      productId: product.id,
      stock: product.stock ? JSON.parse(JSON.stringify(product.stock)) : {},
    });
  };

  const handleSaveStock = () => {
    if (!editingStock) return;
    bulkUpdateStock(editingStock.productId, editingStock.stock);
    showToast("Stock updated successfully", "success");
    setEditingStock(null);
  };

  const updateStockValue = (size: string, color: string, value: number) => {
    if (!editingStock) return;
    const newStock = { ...editingStock.stock };
    if (!newStock[size]) newStock[size] = {};
    newStock[size][color] = Math.max(0, value);
    setEditingStock({ ...editingStock, stock: newStock });
  };

  const getTotalStock = (product: Product) => {
    if (!product.stock) return 0;
    return Object.values(product.stock).reduce(
      (total, sizeStock) =>
        total + Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0),
      0
    );
  };

  const getLowStockCount = (product: Product) => {
    if (!product.stock) return 0;
    return Object.values(product.stock).reduce(
      (total, sizeStock) =>
        total +
        Object.values(sizeStock).filter((qty) => qty > 0 && qty <= 5).length,
      0
    );
  };

  if (editingStock) {
    const product = products.find((p) => p.id === editingStock.productId);
    if (!product) return null;

    const allSizes = product.sizes || [];
    const allColors = product.colors || [];

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">
            Update Stock: {product.name}
          </h1>
        </div>

        <div className="bg-background-secondary p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-3 px-4 text-xs font-medium tracking-wider uppercase text-foreground-muted">
                    Size / Color
                  </th>
                  {allColors.map((color) => (
                    <th
                      key={color.name}
                      className="text-center py-3 px-4 text-xs font-medium tracking-wider uppercase text-foreground-muted"
                    >
                      {color.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSizes.map((size) => (
                  <tr key={size} className="border-b border-foreground/10">
                    <td className="py-3 px-4 font-medium">{size}</td>
                    {allColors.map((color) => {
                      const currentValue =
                        editingStock.stock[size]?.[color.name] || 0;
                      return (
                        <td key={color.name} className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={currentValue}
                            onChange={(e) =>
                              updateStockValue(size, color.name, Number(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors text-center"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-foreground/10">
            <button
              onClick={handleSaveStock}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-background hover:bg-accent-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Stock
            </button>
            <button
              onClick={() => setEditingStock(null)}
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
        <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">Stock Management</h1>
        <p className="text-sm text-foreground-muted tracking-wide uppercase">
          Manage inventory levels
        </p>
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
          const totalStock = getTotalStock(product);
          const lowStockCount = getLowStockCount(product);
          const isLowStock = lowStockCount > 0;
          const isOutOfStock = totalStock === 0;

          return (
            <div
              key={product.id}
              className={`bg-background-secondary p-6 ${
                isOutOfStock
                  ? "border-l-4 border-red-500"
                  : isLowStock
                    ? "border-l-4 border-yellow-500"
                    : "border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-foreground-muted">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light mb-1">{totalStock}</div>
                  <div className="text-xs text-foreground-muted tracking-wider uppercase">
                    Total Stock
                  </div>
                </div>
              </div>

              {product.stock && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {Object.entries(product.stock).map(([size, sizeStock]) => (
                      <div key={size} className="bg-background p-2">
                        <div className="font-medium mb-1">{size}</div>
                        {Object.entries(sizeStock).map(([color, qty]) => (
                          <div
                            key={color}
                            className={`flex justify-between ${
                              qty === 0
                                ? "text-red-500"
                                : qty <= 5
                                  ? "text-yellow-500"
                                  : "text-foreground-muted"
                            }`}
                          >
                            <span>{color}:</span>
                            <span className="font-medium">{qty}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleEditStock(product)}
                className="px-4 py-2 bg-accent text-background hover:bg-accent-hover transition-colors text-sm"
              >
                Update Stock
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

