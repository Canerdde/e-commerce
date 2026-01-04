"use client";

import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductCardWithQuickView } from "./ProductCardWithQuickView";

interface ProductGridProps {
  products: Product[];
  layout?: "symmetric" | "asymmetric";
  showQuickView?: boolean;
}

export function ProductGrid({ products, layout = "symmetric", showQuickView = false }: ProductGridProps) {
  const CardComponent = showQuickView ? ProductCardWithQuickView : ProductCard;
  if (layout === "asymmetric") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
        {products.map((product, index) => {
          // Create asymmetric layout
          const isLarge = index % 7 === 0 || index % 7 === 3;
          const isWide = index % 7 === 5;

          return (
            <div
              key={product.id}
              className={`
                ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
                ${isWide ? "md:col-span-2" : ""}
              `}
            >
              <CardComponent product={product} index={index} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <CardComponent key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

