"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, products } from "@/lib/products";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const productIds: string[] = JSON.parse(savedWishlist);
        // Fetch products by IDs
        const savedProducts = products.filter((product) => productIds.includes(product.id));
        setItems(savedProducts);
      } catch (error) {
        console.error("Failed to load wishlist from localStorage", error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const productIds = items.map((item) => item.id);
    localStorage.setItem("wishlist", JSON.stringify(productIds));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      if (prevItems.some((item) => item.id === product.id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const toggleItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

