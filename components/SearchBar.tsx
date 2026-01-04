"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { getProducts, Product } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length > 0) {
      const products = getProducts();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-background-secondary border border-foreground/10 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-foreground/10 shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="flex gap-4 p-4 hover:bg-background transition-colors duration-200 border-b border-foreground/5 last:border-0"
            >
              <div className="relative w-16 h-20 flex-shrink-0 bg-background-secondary">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium mb-1 truncate">{product.name}</h4>
                <p className="text-xs text-foreground-muted mb-2 line-clamp-1">
                  {product.description}
                </p>
                <p className="text-sm font-medium">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-foreground/10 p-4 text-center text-sm text-foreground-muted">
          No products found
        </div>
      )}
    </div>
  );
}

