import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyBudgetSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Progress Bar */}
        <Skeleton className="h-1.5 w-full rounded-none" />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 divide-x divide-border/40 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
