"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { WishlistButton } from "@/components/WishlistButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ProductGrid } from "@/components/ProductGrid";
import { SocialShare } from "@/components/SocialShare";
import { ArrowLeft, Check, ZoomIn } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.name || ""
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!product) {
    notFound();
  }

  const getStockForSelection = () => {
    if (!product.stock) return null;
    return product.stock[selectedSize]?.[selectedColor] ?? null;
  };

  const stockCount = getStockForSelection();
  const isOutOfStock = stockCount !== null && stockCount === 0;
  const isLowStock = stockCount !== null && stockCount > 0 && stockCount <= 3;

  const handleAddToCart = () => {
    if (isOutOfStock || stockCount === null) {
      showToast("This item is out of stock", "error");
      return;
    }
    if (quantity > stockCount) {
      showToast(`Only ${stockCount} available in stock`, "error");
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    showToast(`${product.name} added to cart`);
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: product.category, href: `/products?category=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-background-secondary overflow-hidden group">
              <div
                key={selectedImageIndex}
                className="absolute inset-0 cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-200"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-3 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
                aria-label="Zoom image"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-background-secondary overflow-hidden border transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-accent"
                        : "border-foreground/5 hover:border-foreground/10"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-display-3 font-light tracking-[-0.02em] leading-tight">
                      {product.name}
                    </h1>
                    <p className="text-3xl font-light tracking-wide mt-2">{formatPrice(product.price)}</p>
                  </div>
                  <WishlistButton product={product} variant="icon-only" />
                </div>
                <p className="text-base text-foreground-muted leading-relaxed font-light max-w-lg">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-medium tracking-wider uppercase text-foreground-muted">
                    Size
                  </label>
                  {product.stock && (
                    <span className="text-xs text-foreground-muted">
                      {(() => {
                        const stockForSize = product.stock[selectedSize];
                        const stockForColor = stockForSize?.[selectedColor];
                        return stockForColor !== undefined
                          ? `${stockForColor} in stock`
                          : "Check availability";
                      })()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const stockForSize = product.stock?.[size];
                    const stockForColor = stockForSize?.[selectedColor];
                    const isAvailable = stockForColor !== undefined && stockForColor > 0;
                    const isOutOfStock = stockForColor === 0;

                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`relative px-6 py-3 border transition-all duration-200 text-sm font-medium tracking-wide ${
                          !isAvailable
                            ? "border-foreground/5 text-foreground-muted cursor-not-allowed opacity-50"
                            : selectedSize === size
                            ? "border-accent bg-accent text-background"
                            : "border-foreground/10 hover:border-foreground/20"
                        }`}
                        title={
                          isOutOfStock
                            ? "Out of stock"
                            : stockForColor !== undefined
                            ? `${stockForColor} in stock`
                            : "Select size"
                        }
                      >
                        {size}
                        {product.stock && stockForColor !== undefined && (
                          <span className="absolute -top-1 -right-1 text-[10px] font-normal">
                            {stockForColor}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-medium mb-4 tracking-wider uppercase text-foreground-muted">
                  Color
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 border-2 transition-all duration-200 ${
                        selectedColor === color.name
                          ? "border-accent"
                          : "border-foreground/10 hover:border-foreground/20"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    >
                      {selectedColor === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-background drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-medium tracking-wider uppercase text-foreground-muted">
                    Quantity
                  </label>
                  {stockCount !== null && stockCount > 0 && (
                    <span className="text-xs text-foreground-muted">
                      Max: {stockCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 flex items-center justify-center text-sm"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-base font-medium min-w-[3rem] text-center tracking-wide">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      const maxQuantity = stockCount !== null ? stockCount : 999;
                      setQuantity(Math.min(maxQuantity, quantity + 1));
                    }}
                    disabled={stockCount !== null && quantity >= stockCount}
                    className="w-12 h-12 border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Warning */}
              {isLowStock && stockCount !== null && (
                <div className="text-xs text-accent tracking-wide">
                  Only {stockCount} left in stock
                </div>
              )}
              {isOutOfStock && (
                <div className="text-xs text-red-500 tracking-wide">
                  Out of stock for this size and color combination
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addedToCart || isOutOfStock || stockCount === null}
                className={`w-full py-5 text-sm font-medium tracking-wider uppercase transition-all duration-200 ${
                  addedToCart
                    ? "bg-green-600 text-background"
                    : isOutOfStock || stockCount === null
                    ? "bg-foreground/10 text-foreground-muted cursor-not-allowed"
                    : "bg-accent text-background hover:bg-accent-hover"
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </span>
                ) : isOutOfStock || stockCount === null ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>

              {/* Social Share */}
              <div className="pt-6 border-t border-foreground/5">
                <SocialShare productName={product.name} productUrl={`/products/${product.slug}`} />
              </div>

              {/* Product Details */}
              <div className="pt-10 border-t border-foreground/5 space-y-4">
                <div className="space-y-3 text-xs text-foreground-muted tracking-wide">
                  <div>
                    <span className="font-medium text-foreground uppercase">Category:</span> {product.category}
                  </div>
                  {product.details && (
                    <>
                      {product.details.material && (
                        <div>
                          <span className="font-medium text-foreground uppercase">Material:</span>{" "}
                          {product.details.material}
                        </div>
                      )}
                      {product.details.care && (
                        <div>
                          <span className="font-medium text-foreground uppercase">Care:</span>{" "}
                          {product.details.care}
                        </div>
                      )}
                      {product.details.origin && (
                        <div>
                          <span className="font-medium text-foreground uppercase">Origin:</span>{" "}
                          {product.details.origin}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Stock Information Table */}
                {product.stock && (
                  <div className="mt-6">
                    <h3 className="text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                      Stock by Size & Color
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-foreground/5">
                            <th className="text-left py-2 px-3 font-medium text-foreground-muted">Size</th>
                            {product.colors.map((color) => (
                              <th
                                key={color.name}
                                className="text-center py-2 px-3 font-medium text-foreground-muted"
                              >
                                {color.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizes.map((size) => (
                            <tr key={size} className="border-b border-foreground/5">
                              <td className="py-2 px-3 font-medium">{size}</td>
                              {product.colors.map((color) => {
                                const stockCount = product.stock?.[size]?.[color.name] ?? 0;
                                return (
                                  <td
                                    key={color.name}
                                    className={`text-center py-2 px-3 ${
                                      stockCount > 0
                                        ? "text-foreground"
                                        : "text-foreground-muted"
                                    }`}
                                  >
                                    {stockCount > 0 ? stockCount : "—"}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox
        images={product.images}
        currentIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
        onPrevious={() =>
          setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
        }
      />

      {/* Related Products */}
      {(() => {
        const relatedProducts = getRelatedProducts(product, 4);
        if (relatedProducts.length === 0) return null;
        return (
          <section className="mt-32 pt-16 border-t border-foreground/5">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <h2 className="text-display-3 font-light tracking-[-0.02em] mb-12">
                You May Also Like
              </h2>
              <ProductGrid products={relatedProducts} layout="symmetric" />
            </div>
          </section>
        );
      })()}
    </div>
  );
}

