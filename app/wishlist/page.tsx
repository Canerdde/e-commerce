"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductGrid } from "@/components/ProductGrid";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="mb-16">
          <h1 className="text-display-2 font-light tracking-[-0.02em] mb-6">Wishlist</h1>
          <p className="text-sm text-foreground-muted tracking-wide uppercase">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-foreground-muted/30 mx-auto mb-6" />
            <p className="text-lg text-foreground-muted mb-4">Your wishlist is empty</p>
            <p className="text-sm text-foreground-muted">
              Start adding items you love to your wishlist
            </p>
          </div>
        ) : (
          <ProductGrid products={items} layout="symmetric" />
        )}
      </div>
    </div>
  );
}

