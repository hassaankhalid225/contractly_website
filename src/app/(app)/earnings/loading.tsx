import { Skeleton, SkeletonStat } from "@/components/ui/skeleton";

export default function EarningsLoading() {
  return (
    <div className="animate-fade-in">
      <Skeleton className="h-8 w-40" />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="card mt-6 p-3u">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-3 h-[220px] w-full" />
      </div>
    </div>
  );
}
