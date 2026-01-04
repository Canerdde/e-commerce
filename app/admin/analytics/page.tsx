"use client";

import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { products } = useAdmin();
  const { items: cartItems } = useCart();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => {
    const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return sum + price;
  }, 0);

  const discountedProducts = products.filter((p) => p.discount && p.discount > 0);
  const totalDiscountValue = products.reduce((sum, p) => {
    if (p.discount) {
      return sum + (p.price * p.discount) / 100;
    }
    return sum;
  }, 0);

  const featuredProducts = products.filter((p) => p.featured).length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const outOfStockProducts = products.filter((p) => !p.inStock).length;

  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-accent",
    },
    {
      label: "Inventory Value",
      value: formatPrice(totalValue),
      icon: DollarSign,
      color: "text-foreground",
    },
    {
      label: "Active Discounts",
      value: discountedProducts.length,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Cart Items",
      value: cartItems.length,
      icon: ShoppingCart,
      color: "text-foreground",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">Analytics</h1>
        <p className="text-sm text-foreground-muted tracking-wide uppercase">
          Store insights and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-background-secondary p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-foreground-muted tracking-wider uppercase">
                  {stat.label}
                </span>
              </div>
              <div className={`text-2xl font-light ${stat.color}`}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Product Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            In Stock
          </div>
          <div className="text-2xl font-light text-green-500">{inStockProducts}</div>
        </div>
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            Out of Stock
          </div>
          <div className="text-2xl font-light text-red-500">{outOfStockProducts}</div>
        </div>
        <div className="bg-background-secondary p-6">
          <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
            Featured
          </div>
          <div className="text-2xl font-light">{featuredProducts}</div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-background-secondary p-6 mb-12">
        <h3 className="text-sm font-medium mb-6 tracking-wider uppercase text-foreground-muted">
          Products by Category
        </h3>
        <div className="space-y-4">
          {topCategories.map(([category, count]) => {
            const percentage = (count / totalProducts) * 100;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
                <div className="h-1 bg-background overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discount Analysis */}
      {discountedProducts.length > 0 && (
        <div className="bg-background-secondary p-6">
          <h3 className="text-sm font-medium mb-6 tracking-wider uppercase text-foreground-muted">
            Discount Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
                Total Discount Value
              </div>
              <div className="text-2xl font-light text-accent">
                {formatPrice(totalDiscountValue)}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
                Average Discount
              </div>
              <div className="text-2xl font-light">
                {(
                  discountedProducts.reduce((sum, p) => sum + (p.discount || 0), 0) /
                  discountedProducts.length
                ).toFixed(1)}
                %
              </div>
            </div>
            <div>
              <div className="text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
                Discount Coverage
              </div>
              <div className="text-2xl font-light">
                {((discountedProducts.length / totalProducts) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

