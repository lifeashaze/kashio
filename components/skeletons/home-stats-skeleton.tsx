import { Skeleton } from "@/components/ui/skeleton";
import { EXPENSE_TABLE_GRID_COLUMNS } from "@/components/home/stats/helpers";

export function HomeStatsSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>

        {/* Desktop table header */}
        <div className="hidden border-b border-border/40 bg-muted/20 px-4 py-1.5 md:block">
          <div className={`grid ${EXPENSE_TABLE_GRID_COLUMNS} items-center gap-3`}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-14 justify-self-end" />
            <Skeleton className="h-3 w-14 justify-self-end" />
          </div>
        </div>

        {/* Desktop skeleton rows */}
        <div className="hidden divide-y divide-border/40 md:block">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className={`grid ${EXPENSE_TABLE_GRID_COLUMNS} items-center gap-3`}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-16 justify-self-end" />
                <div className="flex gap-1 justify-self-end">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile skeleton cards */}
        <div className="divide-y divide-border/40 md:hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
