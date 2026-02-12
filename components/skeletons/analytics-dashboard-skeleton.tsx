import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AnalyticsDashboardSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 pb-16 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Analytics</h1>
            <Skeleton className="h-3 w-32 mt-1 hidden sm:block" />
          </div>
        </div>

        {/* Date Selector Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <Skeleton className="h-8 w-full sm:w-[180px]" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/70 bg-card shadow-sm p-3 sm:p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-7 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Spending Chart */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/50 px-4 py-2.5">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4">
              <Skeleton className="h-[200px] sm:h-[240px] w-full" />
            </div>
          </div>

          {/* Spending vs Budget */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/50 px-4 py-2.5">
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="p-4">
              <Skeleton className="h-[200px] sm:h-[240px] w-full" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/50 px-4 py-2.5">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
