"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs text-foreground-muted tracking-wide mb-8">
      <Link
        href="/"
        className="hover:text-foreground transition-colors duration-200 flex items-center gap-1"
      >
        <Home className="w-3 h-3" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

