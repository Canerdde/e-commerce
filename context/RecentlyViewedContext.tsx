"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, products } from "@/lib/products";

interface RecentlyViewedContextType {
  items: Product[];
  addItem: (product: Product) => void;
  clearItems: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      try {
        const productIds: string[] = JSON.parse(saved);
        // Fetch products by IDs
        const savedProducts = products.filter((product) => productIds.includes(product.id));
        setItems(savedProducts);
      } catch (error) {
        console.error("Failed to load recently viewed", error);
      }
    }
  }, []);

  useEffect(() => {
    const productIds = items.map((item) => item.id);
    localStorage.setItem("recentlyViewed", JSON.stringify(productIds));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      // Remove if already exists
      const filtered = prevItems.filter((item) => item.id !== product.id);
      // Add to beginning and limit to 8
      return [product, ...filtered].slice(0, 8);
    });
  };

  const clearItems = () => {
    setItems([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem, clearItems }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}

