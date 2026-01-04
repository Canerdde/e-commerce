"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products as initialProducts } from "@/lib/products";

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, size: string, color: string, quantity: number) => void;
  updatePrice: (id: string, price: number) => void;
  updateDiscount: (id: string, discount: number) => void;
  bulkUpdateStock: (id: string, stock: Product["stock"]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage or use initial products
  useEffect(() => {
    const savedProducts = localStorage.getItem("admin_products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        // Merge with initial products to ensure new fields are present
        const merged = parsed.map((p: Product) => {
          const initial = initialProducts.find((ip) => ip.id === p.id);
          return { ...initial, ...p };
        });
        // Add any new products from initial that aren't in saved
        const newProducts = initialProducts.filter(
          (ip) => !parsed.some((p: Product) => p.id === ip.id)
        );
        setProducts([...merged, ...newProducts]);
      } catch (error) {
        console.error("Failed to load products from localStorage", error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem("admin_products", JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("admin_products", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, "-"),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const updateStock = (id: string, size: string, color: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const newStock = { ...product.stock };
        if (!newStock[size]) newStock[size] = {};
        newStock[size][color] = quantity;
        return {
          ...product,
          stock: newStock,
          inStock: Object.values(newStock).some((sizeStock) =>
            Object.values(sizeStock).some((qty) => qty > 0)
          ),
        };
      })
    );
  };

  const updatePrice = (id: string, price: number) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, price } : product))
    );
  };

  const updateDiscount = (id: string, discount: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, discount: Math.max(0, Math.min(100, discount)) } : product
      )
    );
  };

  const bulkUpdateStock = (id: string, stock: Product["stock"]) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const hasStock = stock
          ? Object.values(stock).some((sizeStock) =>
              Object.values(sizeStock).some((qty) => qty > 0)
            )
          : false;
        return { ...product, stock, inStock: hasStock };
      })
    );
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updatePrice,
        updateDiscount,
        bulkUpdateStock,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

