"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/products";
import { useToast } from "@/context/ToastContext";

interface WishlistButtonProps {
  product: Product;
  variant?: "default" | "icon-only";
  className?: string;
}

export function WishlistButton({ product, variant = "default", className = "" }: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    showToast(
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`
    );
  };

  if (variant === "icon-only") {
    return (
      <button
        onClick={handleClick}
        className={`p-2 transition-colors duration-200 ${
          inWishlist
            ? "text-accent"
            : "text-foreground-muted hover:text-foreground"
        } ${className}`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 border border-foreground/10 hover:border-foreground/20 transition-all duration-200 text-sm tracking-wide ${
        inWishlist ? "text-accent border-accent/30" : ""
      } ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
      {inWishlist ? "Saved" : "Save"}
    </button>
  );
}

