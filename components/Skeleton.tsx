export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-background-secondary mb-6" />
      <div className="space-y-2">
        <div className="h-5 bg-background-secondary w-3/4" />
        <div className="h-4 bg-background-secondary w-full" />
        <div className="h-4 bg-background-secondary w-2/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-background-secondary" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-background-secondary" />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-12 bg-background-secondary w-3/4" />
            <div className="h-8 bg-background-secondary w-1/4" />
            <div className="h-24 bg-background-secondary" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-background-secondary w-1/4" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-16 bg-background-secondary" />
              ))}
            </div>
          </div>
          <div className="h-12 bg-background-secondary" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

