import { ProductDetailSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="animate-pulse mb-12">
          <div className="h-4 bg-background-secondary w-64" />
        </div>
        <ProductDetailSkeleton />
      </div>
    </div>
  );
}

