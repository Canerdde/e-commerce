export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount?: number; // Discount percentage (0-100)
  images: string[];
  category: string;
  sizes: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  featured: boolean;
  inStock: boolean;
  stock?: {
    [size: string]: {
      [color: string]: number;
    };
  };
  details?: {
    material?: string;
    care?: string;
    origin?: string;
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Minimalist Leather Jacket",
    slug: "minimalist-leather-jacket",
    description: "Crafted from premium Italian leather with a minimalist design. This timeless piece features clean lines and exceptional craftsmanship, designed to age beautifully over time.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=1600&fit=crop",
    ],
    category: "Outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#8B4513" },
    ],
    featured: true,
    inStock: true,
    stock: {
      XS: { Black: 3, Brown: 2 },
      S: { Black: 5, Brown: 4 },
      M: { Black: 8, Brown: 6 },
      L: { Black: 6, Brown: 5 },
      XL: { Black: 4, Brown: 3 },
    },
    details: {
      material: "100% Italian Leather",
      care: "Dry clean only",
      origin: "Made in Italy",
    },
  },
  {
    id: "2",
    name: "Essential Cotton Tee",
    slug: "essential-cotton-tee",
    description: "The perfect everyday essential. Made from organic cotton with a relaxed fit and subtle details that elevate the basics.",
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1600&fit=crop",
    ],
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1A1A2E" },
    ],
    featured: true,
    inStock: true,
    stock: {
      XS: { White: 12, Black: 15, Navy: 8 },
      S: { White: 20, Black: 18, Navy: 12 },
      M: { White: 25, Black: 22, Navy: 15 },
      L: { White: 18, Black: 20, Navy: 10 },
      XL: { White: 10, Black: 12, Navy: 7 },
      XXL: { White: 5, Black: 6, Navy: 3 },
    },
    details: {
      material: "100% Organic Cotton",
      care: "Machine wash cold, tumble dry low",
      origin: "Made in Portugal",
    },
  },
  {
    id: "3",
    name: "Tailored Wool Trousers",
    slug: "tailored-wool-trousers",
    description: "Precision-tailored from premium wool blend. These trousers offer a modern silhouette with exceptional comfort and versatility.",
    price: 349,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=1600&fit=crop",
    ],
    category: "Bottoms",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Charcoal", hex: "#36454F" },
      { name: "Navy", hex: "#1A1A2E" },
    ],
    featured: true,
    inStock: true,
    stock: {
      "28": { Charcoal: 4, Navy: 3 },
      "30": { Charcoal: 6, Navy: 5 },
      "32": { Charcoal: 8, Navy: 7 },
      "34": { Charcoal: 5, Navy: 4 },
      "36": { Charcoal: 3, Navy: 2 },
      "38": { Charcoal: 2, Navy: 1 },
    },
    details: {
      material: "70% Wool, 30% Polyester",
      care: "Dry clean only",
      origin: "Made in UK",
    },
  },
  {
    id: "4",
    name: "Cashmere Scarf",
    slug: "cashmere-scarf",
    description: "Luxuriously soft cashmere scarf in a generous size. Hand-finished with attention to every detail for ultimate comfort and elegance.",
    price: 279,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=1600&fit=crop",
    ],
    category: "Accessories",
    sizes: ["One Size"],
    colors: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Grey", hex: "#808080" },
      { name: "Black", hex: "#000000" },
    ],
    featured: false,
    inStock: true,
    stock: {
      "One Size": { Camel: 15, Grey: 12, Black: 18 },
    },
    details: {
      material: "100% Cashmere",
      care: "Hand wash cold, lay flat to dry",
      origin: "Made in Scotland",
    },
  },
  {
    id: "5",
    name: "Minimalist Sneakers",
    slug: "minimalist-sneakers",
    description: "Clean, contemporary sneakers designed for everyday wear. Premium materials meet minimalist aesthetics for timeless style.",
    price: 199,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1600&fit=crop",
    ],
    category: "Footwear",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    featured: false,
    inStock: true,
    stock: {
      "38": { White: 8, Black: 10 },
      "39": { White: 12, Black: 15 },
      "40": { White: 15, Black: 18 },
      "41": { White: 18, Black: 20 },
      "42": { White: 20, Black: 22 },
      "43": { White: 15, Black: 18 },
      "44": { White: 10, Black: 12 },
      "45": { White: 5, Black: 8 },
    },
    details: {
      material: "Leather upper, rubber sole",
      care: "Wipe clean with damp cloth",
      origin: "Made in Italy",
    },
  },
  {
    id: "6",
    name: "Wool Overcoat",
    slug: "wool-overcoat",
    description: "A statement overcoat in premium wool. Classic design with modern proportions, perfect for transitional seasons.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fc4c3f0db4?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fc4c3f0db4?w=1200&h=1600&fit=crop",
    ],
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#1A1A2E" },
      { name: "Camel", hex: "#C19A6B" },
    ],
    featured: true,
    inStock: true,
    stock: {
      S: { Navy: 4, Camel: 3 },
      M: { Navy: 6, Camel: 5 },
      L: { Navy: 5, Camel: 4 },
      XL: { Navy: 3, Camel: 2 },
    },
    details: {
      material: "100% Wool",
      care: "Dry clean only",
      origin: "Made in UK",
    },
  },
  {
    id: "7",
    name: "Silk Shirt",
    slug: "silk-shirt",
    description: "Elegant silk shirt with a relaxed fit. The luxurious fabric drapes beautifully and feels exceptional against the skin.",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop",
    ],
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Black", hex: "#000000" },
    ],
    featured: false,
    inStock: true,
    stock: {
      XS: { Ivory: 5, Black: 6 },
      S: { Ivory: 8, Black: 10 },
      M: { Ivory: 10, Black: 12 },
      L: { Ivory: 7, Black: 9 },
      XL: { Ivory: 4, Black: 5 },
    },
    details: {
      material: "100% Silk",
      care: "Dry clean only",
      origin: "Made in Italy",
    },
  },
  {
    id: "8",
    name: "Denim Jeans",
    slug: "denim-jeans",
    description: "Premium selvedge denim jeans with a modern fit. Crafted from Japanese denim and designed to develop character over time.",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&h=1600&fit=crop",
    ],
    category: "Bottoms",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Indigo", hex: "#4B0082" },
      { name: "Black", hex: "#000000" },
    ],
    featured: false,
    inStock: true,
    stock: {
      "28": { Indigo: 6, Black: 5 },
      "30": { Indigo: 8, Black: 7 },
      "32": { Indigo: 10, Black: 9 },
      "34": { Indigo: 7, Black: 6 },
      "36": { Indigo: 4, Black: 3 },
    },
    details: {
      material: "100% Japanese Selvedge Denim",
      care: "Machine wash cold, hang dry",
      origin: "Made in Japan",
    },
  },
];

// Get products from localStorage (admin updates) or use default products
export function getProducts(): Product[] {
  if (typeof window !== "undefined") {
    const savedProducts = localStorage.getItem("admin_products");
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (error) {
        console.error("Failed to load products from localStorage", error);
      }
    }
  }
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((product) => product.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return getProducts().filter((product) => product.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getProducts().map((product) => product.category)));
}

export function getRelatedProducts(currentProduct: Product, limit: number = 4): Product[] {
  return getProducts()
    .filter(
      (product) =>
        product.id !== currentProduct.id && product.category === currentProduct.category
    )
    .slice(0, limit);
}
