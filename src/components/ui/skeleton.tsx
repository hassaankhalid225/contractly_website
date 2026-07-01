import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

/** A card-shaped skeleton matching the contract/stat card footprint. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-3u", className)}>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
      <Skeleton className="mt-4 h-3 w-1/2" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card p-3u">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-2 h-7 w-24" />
    </div>
  );
}
