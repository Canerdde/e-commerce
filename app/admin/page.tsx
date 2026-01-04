"use client";

import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Package, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { products } = useAdmin();
  const { items: cartItems } = useCart();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => {
    const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return sum + price;
  }, 0);
  
  const lowStockProducts = products.filter((product) => {
    if (!product.stock) return false;
    return Object.values(product.stock).some((sizeStock) =>
      Object.values(sizeStock).some((qty) => qty > 0 && qty <= 5)
    );
  });

  const outOfStockProducts = products.filter((product) => {
    if (!product.stock) return !product.inStock;
    return !Object.values(product.stock).some((sizeStock) =>
      Object.values(sizeStock).some((qty) => qty > 0)
    );
  });

  const discountedProducts = products.filter((p) => p.discount && p.discount > 0);
  const totalDiscountValue = products.reduce((sum, p) => {
    if (p.discount) {
      return sum + (p.price * p.discount) / 100;
    }
    return sum;
  }, 0);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      href: "/admin/products",
      color: "text-accent",
    },
    {
      label: "Total Inventory Value",
      value: formatPrice(totalValue),
      icon: DollarSign,
      href: "/admin/stock",
      color: "text-foreground",
    },
    {
      label: "Active Discounts",
      value: discountedProducts.length,
      icon: TrendingUp,
      href: "/admin/pricing",
      color: "text-accent",
    },
    {
      label: "Low Stock Items",
      value: lowStockProducts.length,
      icon: AlertCircle,
      href: "/admin/stock",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">Dashboard</h1>
        <p className="text-sm text-foreground-muted tracking-wide uppercase">
          Overview of your store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-background-secondary p-6 hover:bg-background transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-foreground-muted tracking-wider uppercase">
                  {stat.label}
                </span>
              </div>
              <div className={`text-2xl font-light ${stat.color} group-hover:translate-x-1 transition-transform`}>
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="mb-12 space-y-4">
          {outOfStockProducts.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-medium tracking-wider uppercase">
                  Out of Stock ({outOfStockProducts.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {outOfStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products?edit=${product.id}`}
                    className="text-xs px-3 py-1 bg-background hover:bg-background-secondary transition-colors"
                  >
                    {product.name}
                  </Link>
                ))}
                {outOfStockProducts.length > 5 && (
                  <span className="text-xs text-foreground-muted px-3 py-1">
                    +{outOfStockProducts.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {lowStockProducts.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-medium tracking-wider uppercase">
                  Low Stock ({lowStockProducts.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products?edit=${product.id}`}
                    className="text-xs px-3 py-1 bg-background hover:bg-background-secondary transition-colors"
                  >
                    {product.name}
                  </Link>
                ))}
                {lowStockProducts.length > 5 && (
                  <span className="text-xs text-foreground-muted px-3 py-1">
                    +{lowStockProducts.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-secondary p-6">
          <h3 className="text-sm font-medium mb-4 tracking-wider uppercase text-foreground-muted">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/products?new=true"
              className="block px-4 py-3 bg-accent text-background hover:bg-accent-hover transition-colors text-sm text-center"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/pricing"
              className="block px-4 py-3 border border-foreground/10 hover:bg-background transition-colors text-sm text-center"
            >
              Manage Discounts
            </Link>
            <Link
              href="/admin/stock"
              className="block px-4 py-3 border border-foreground/10 hover:bg-background transition-colors text-sm text-center"
            >
              Update Stock
            </Link>
          </div>
        </div>

        <div className="bg-background-secondary p-6">
          <h3 className="text-sm font-medium mb-4 tracking-wider uppercase text-foreground-muted">
            Store Statistics
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Active Cart Items</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Products with Discount</span>
              <span className="font-medium">{discountedProducts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Total Discount Value</span>
              <span className="font-medium text-accent">{formatPrice(totalDiscountValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Featured Products</span>
              <span className="font-medium">
                {products.filter((p) => p.featured).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

