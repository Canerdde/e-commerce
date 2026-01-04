"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { Eye } from "lucide-react";

interface ProductCardWithQuickViewProps {
  product: Product;
  index?: number;
}

export function ProductCardWithQuickView({ product, index }: ProductCardWithQuickViewProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className="relative group">
        <ProductCard product={product} index={index} />
        <button
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute top-6 right-6 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

