"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { WishlistButton } from "./WishlistButton";
import { Check } from "lucide-react";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]?.name || "");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    showToast(`${product.name} added to cart`);
    openCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="relative max-w-4xl w-full bg-background-secondary border border-foreground/10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-background hover:bg-background-secondary transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-background overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-light tracking-[-0.02em] mb-2">
                          {product.name}
                        </h2>
                        <p className="text-xl font-light tracking-wide">{formatPrice(product.price)}</p>
                      </div>
                      <WishlistButton product={product} variant="icon-only" />
                    </div>
                    <p className="text-sm text-foreground-muted leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border transition-all duration-200 text-sm font-medium tracking-wide ${
                            selectedSize === size
                              ? "border-accent bg-accent text-background"
                              : "border-foreground/10 hover:border-foreground/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative w-10 h-10 border-2 transition-all duration-200 ${
                            selectedColor === color.name
                              ? "border-accent"
                              : "border-foreground/10 hover:border-foreground/20"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColor === color.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-3 h-3 text-background drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="px-6 py-3 border border-foreground/10 text-xs font-medium tracking-wider uppercase hover:bg-background transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

