import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { DevToolsProtection } from "@/components/DevToolsProtection";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Premium E-Commerce | Curated Collection",
    template: "%s | Premium E-Commerce",
  },
  description: "A premium e-commerce experience with carefully curated products. Discover thoughtfully selected pieces that define modern elegance.",
  keywords: ["e-commerce", "premium", "fashion", "curated", "nextjs", "typescript"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Premium E-Commerce",
    title: "Premium E-Commerce | Curated Collection",
    description: "A premium e-commerce experience with carefully curated products",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premium E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium E-Commerce | Curated Collection",
    description: "A premium e-commerce experience with carefully curated products",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <ToastProvider>
          <RecentlyViewedProvider>
            <WishlistProvider>
              <CartProvider>
                <ConditionalNavbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CartDrawer />
                <DevToolsProtection />
              </CartProvider>
            </WishlistProvider>
          </RecentlyViewedProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

