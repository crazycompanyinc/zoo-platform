export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />;
}
export function SkeletonCard() {
  return <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"><Skeleton className="h-4 w-2/3 mb-3" /><Skeleton className="h-3 w-full mb-2" /><Skeleton className="h-3 w-4/5" /></div>;
}
