import { ProductGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="animate-pulse space-y-8 mb-12">
          <div className="h-12 bg-background-secondary rounded w-1/3" />
          <div className="h-6 bg-background-secondary rounded w-1/4" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}

