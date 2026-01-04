"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { WishlistButton } from "./WishlistButton";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-background-secondary mb-6">
          <div
            key={hoveredImageIndex}
            className="absolute inset-0"
          >
            <Image
              src={product.images[hoveredImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium tracking-wide">{formatPrice(product.price)}</span>
              <button
                className="px-5 py-2.5 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200 rounded-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const defaultSize = product.sizes[0];
                  const defaultColor = product.colors[0]?.name || "";
                  if (defaultSize && defaultColor) {
                    addItem(product, defaultSize, defaultColor, 1);
                    showToast(`${product.name} added to cart`);
                    openCart();
                  }
                }}
              >
                Quick Add
              </button>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {product.images.slice(0, 2).map((_, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setHoveredImageIndex(idx)}
                  className={cn(
                    "h-0.5 transition-all duration-200",
                    hoveredImageIndex === idx ? "bg-accent w-8" : "bg-foreground/30 w-8"
                  )}
                />
              ))}
            </div>
          )}

          <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <WishlistButton product={product} variant="icon-only" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-medium tracking-wide">{product.name}</h3>
          <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

