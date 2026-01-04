"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminProvider } from "@/context/AdminContext";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  TrendingDown,
  BarChart3,
  Menu,
  X,
  Home,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/pricing", label: "Pricing & Discounts", icon: DollarSign },
    { href: "/admin/stock", label: "Stock Management", icon: TrendingDown },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-foreground/10 p-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-light tracking-wider">
            ADMIN
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background-secondary transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-background-secondary border-r border-foreground/10 z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 pt-20 lg:pt-0`}
        >
          <div className="p-6">
            <div className="mb-8">
              <Link
                href="/admin"
                className="text-2xl font-light tracking-wider block mb-2"
                onClick={() => setSidebarOpen(false)}
              >
                ADMIN
              </Link>
              <p className="text-xs text-foreground-muted tracking-wider uppercase">
                Control Panel
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-accent text-background font-medium"
                        : "text-foreground-muted hover:text-foreground hover:bg-background"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-foreground/10">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="w-4 h-4" />
                Back to Store
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="lg:ml-64 pt-20 lg:pt-0">
          <div className="p-6 lg:p-12">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}

