"use client";

import { useState, useEffect, Suspense } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, Search, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

function AdminProductsContent() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const isNew = searchParams.get("new") === "true";

    if (editId) {
      const product = products.find((p) => p.id === editId);
      if (product) {
        setEditingProduct(product);
        setIsEditing(true);
        setIsNewProduct(false);
      }
    } else if (isNew) {
      setIsNewProduct(true);
      setIsEditing(true);
      setEditingProduct({
        id: "",
        name: "",
        slug: "",
        description: "",
        price: 0,
        images: [],
        category: "",
        sizes: [],
        colors: [],
        featured: false,
        inStock: true,
      });
    }
  }, [searchParams, products]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      showToast("Product deleted", "success");
    }
  };

  const handleSave = () => {
    if (!editingProduct) return;

    if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (isNewProduct) {
      addProduct(editingProduct);
      showToast("Product added successfully", "success");
    } else {
      updateProduct(editingProduct.id, editingProduct);
      showToast("Product updated successfully", "success");
    }

    setIsEditing(false);
    setIsNewProduct(false);
    setEditingProduct(null);
    router.push("/admin/products");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsNewProduct(false);
    setEditingProduct(null);
    router.push("/admin/products");
  };

  if (isEditing && editingProduct) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">
            {isNewProduct ? "Add New Product" : "Edit Product"}
          </h1>
        </div>

        <div className="bg-background-secondary p-8 space-y-6">
          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Product Name *
            </label>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Description *
            </label>
            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
                Price ($) *
              </label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                }
                className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editingProduct.discount || 0}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    discount: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Category *
            </label>
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g., Tops, Bottoms, Outerwear"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 tracking-wider uppercase text-foreground-muted">
              Image URLs (one per line)
            </label>
            <textarea
              value={editingProduct.images.join("\n")}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  images: e.target.value.split("\n").filter((url) => url.trim()),
                })
              }
              rows={3}
              className="w-full px-4 py-3 bg-background border border-foreground/10 focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="https://example.com/image1.jpg"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProduct.featured}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, featured: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProduct.inStock}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">In Stock</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-background hover:bg-accent-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Product
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-foreground/10 hover:bg-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-2 font-light tracking-[-0.02em] mb-2">Products</h1>
          <p className="text-sm text-foreground-muted tracking-wide uppercase">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/products?new=true")}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-foreground/10 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const finalPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;

          return (
            <div
              key={product.id}
              className="bg-background-secondary p-6 flex items-center gap-6 hover:bg-background transition-colors"
            >
              {product.images[0] && (
                <div className="w-24 h-24 bg-background relative flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-foreground-muted mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={product.discount ? "line-through text-foreground-muted" : ""}>
                    {formatPrice(product.price)}
                  </span>
                  {product.discount && (
                    <>
                      <span className="text-accent font-medium">
                        {formatPrice(finalPrice)} (-{product.discount}%)
                      </span>
                    </>
                  )}
                  <span className="text-foreground-muted">•</span>
                  <span className="text-foreground-muted">{product.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/products?edit=${product.id}`)}
                  className="p-2 hover:bg-background transition-colors"
                  aria-label="Edit product"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 hover:bg-background transition-colors text-red-500"
                  aria-label="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-muted">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
