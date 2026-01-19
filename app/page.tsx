"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const { items: recentlyViewed } = useRecentlyViewed();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-[92vh] flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-12"
          >
            <h1 className="text-display-1 font-light tracking-[-0.02em] leading-[0.95]">
              Curated Collection
            </h1>
            <p className="text-lg text-foreground-muted max-w-xl mx-auto leading-relaxed font-light">
              Discover thoughtfully selected pieces that define modern elegance
            </p>
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-background text-sm font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200 rounded-none group"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-display-2 font-light tracking-[-0.02em] mb-6">Featured</h2>
            <p className="text-base text-foreground-muted max-w-xl mx-auto leading-relaxed font-light">
              Handpicked selections that embody our vision of timeless design
            </p>
          </div>

          <ProductGrid products={featuredProducts} layout="symmetric" />
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-32 px-6 sm:px-8 lg:px-12 border-t border-foreground/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-display-2 font-light tracking-[-0.02em] mb-6">
                Recently Viewed
              </h2>
              <p className="text-base text-foreground-muted leading-relaxed font-light max-w-xl">
                Continue exploring items you&apos;ve recently viewed
              </p>
            </div>
            <ProductGrid products={recentlyViewed} layout="symmetric" />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 px-6 sm:px-8 lg:px-12 border-t border-foreground/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-display-3 font-light tracking-[-0.02em]">Ready to explore?</h2>
            <p className="text-base text-foreground-muted leading-relaxed font-light">
              Browse our complete collection of premium pieces
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-10 py-4 border border-foreground/10 text-sm font-medium tracking-wider uppercase hover:border-foreground/20 hover:bg-background-secondary transition-all duration-200 rounded-none group"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

