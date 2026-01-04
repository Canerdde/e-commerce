"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribed(true);
      showToast("Successfully subscribed to newsletter");
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      showToast("Please enter a valid email address", "error");
    }
  };

  return (
    <footer className="border-t border-foreground/5 mt-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-medium tracking-tight mb-4">CURATED</h3>
            <p className="text-sm text-foreground-muted leading-relaxed font-light">
              Discover thoughtfully selected pieces that define modern elegance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium tracking-wider uppercase text-foreground-muted mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium tracking-wider uppercase text-foreground-muted mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-medium tracking-wider uppercase text-foreground-muted mb-4">
              Newsletter
            </h4>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-foreground/10 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full py-3 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/5 text-center text-xs text-foreground-muted">
          <p>© {new Date().getFullYear()} CURATED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

