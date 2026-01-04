"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const pathname = usePathname();
  const { openCart, getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const totalItems = getTotalItems();
  const wishlistCount = wishlistItems.length;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-foreground/5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="text-xl font-medium tracking-[0.1em] uppercase">
            CURATED
          </Link>

          <div className="hidden md:flex items-center gap-16 flex-1 justify-center max-w-2xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-medium tracking-wider uppercase transition-colors duration-200",
                  pathname === item.href 
                    ? "text-foreground" 
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="relative p-2 transition-opacity duration-200 hover:opacity-60"
              aria-label="View wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-accent text-accent" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-background bg-accent rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 transition-opacity duration-200 hover:opacity-60"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-background bg-accent rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

