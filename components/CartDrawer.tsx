"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotalPrice } = useCart();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background-secondary border-l border-foreground/5 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-8 border-b border-foreground/5">
              <h2 className="text-xl font-light tracking-wide uppercase">Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-background transition-colors duration-200"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <p className="text-sm text-foreground-muted tracking-wide">Your cart is empty</p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="text-xs text-accent hover:text-accent-hover transition-colors duration-200 tracking-wider uppercase"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="relative w-24 h-32 flex-shrink-0 bg-background overflow-hidden"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium tracking-wide hover:text-accent transition-colors duration-200"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-foreground-muted mt-2 tracking-wide">
                            {item.size} • {item.color}
                          </p>
                          <p className="text-sm font-medium mt-3 tracking-wide">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                          <div className="flex items-center gap-0 border border-foreground/10">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                              className="p-2.5 hover:bg-background transition-colors duration-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-4 py-2.5 min-w-[3rem] text-center text-sm tracking-wide">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                              className="p-2.5 hover:bg-background transition-colors duration-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.size, item.color)
                            }
                            className="p-2.5 hover:bg-background transition-colors duration-200 text-foreground-muted hover:text-foreground"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-foreground/5 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted tracking-wider uppercase">Total</span>
                  <span className="text-lg font-light tracking-wide">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-accent text-background text-center py-5 text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

