"use client";

import { useExpenses } from "@/lib/hooks/use-expenses";
import { useUserPreferences } from "@/lib/hooks/use-user-preferences";
import { useMemo } from "react";
import { DEFAULT_MONTHLY_BUDGET } from "@/lib/constants/budget";
import { MonthlyBudgetSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants/categories";

function getMonthName() {
  return new Date().toLocaleDateString("en-US", { month: "long" });
}

function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function MonthlyBudgetMetrics() {
  const { data: expenses = [], isLoading: isLoadingExpenses } = useExpenses();
  const { data: prefs, isLoading: isLoadingPrefs } = useUserPreferences();

  const MONTHLY_BUDGET = prefs ? parseFloat(prefs.monthlyBudget) : DEFAULT_MONTHLY_BUDGET;
  const CURRENCY = prefs?.currency || "USD";
  const isLoading = isLoadingExpenses || isLoadingPrefs;

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const [y, m] = expense.date.split("-").map(Number);
      return y === currentYear && m - 1 === currentMonth;
    });

    const totalSpent = monthlyExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const daysTotal = getDaysInMonth();
    const daysElapsed = now.getDate();
    const daysLeft = daysTotal - daysElapsed;
    const remaining = MONTHLY_BUDGET - totalSpent;
    const percentageUsed = Math.min((totalSpent / MONTHLY_BUDGET) * 100, 100);

    const categoryTotals: Record<string, number> = {};
    for (const expense of monthlyExpenses) {
      if (expense.category === "bills") continue;
      categoryTotals[expense.category] = (categoryTotals[expense.category] ?? 0) + Number(expense.amount);
    }
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] ?? null;

    return {
      totalSpent,
      remaining,
      percentageUsed,
      daysLeft,
      daysElapsed,
      daysTotal,
      topCategory,
      isOverBudget: totalSpent > MONTHLY_BUDGET,
    };
  }, [expenses, MONTHLY_BUDGET]);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return <MonthlyBudgetSkeleton />;
  }

  const barColor = monthlyStats.isOverBudget
    ? "bg-red-500"
    : monthlyStats.percentageUsed > 80
    ? "bg-amber-500"
    : "bg-emerald-500";

  const remainingColor = monthlyStats.isOverBudget
    ? "text-red-600 dark:text-red-400"
    : "text-foreground";

  const topCategoryLabel = monthlyStats.topCategory
    ? (CATEGORY_LABELS[monthlyStats.topCategory[0] as keyof typeof CATEGORY_LABELS] ?? monthlyStats.topCategory[0])
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
            {getMonthName()} Budget
          </h2>
          <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
            {fmt(MONTHLY_BUDGET)}
          </span>
        </div>

        {/* Hero: spent + progress */}
        <div className="px-3 pt-3 pb-2.5 space-y-2 sm:px-4 sm:pt-3.5 sm:pb-3">
          <div className="flex items-end justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Spent this month
              </p>
              <span className="font-mono text-[24px] font-bold tabular-nums tracking-tight text-foreground leading-none">
                {fmt(monthlyStats.totalSpent)}
              </span>
            </div>
            <span
              className={cn(
                "mb-0.5 font-mono text-[12px] font-semibold tabular-nums",
                monthlyStats.isOverBudget ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {monthlyStats.percentageUsed.toFixed(0)}% of budget
            </span>
          </div>

          <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className={cn("absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out", barColor)}
              style={{ width: `${monthlyStats.percentageUsed}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/70">
              {monthlyStats.daysElapsed} of {monthlyStats.daysTotal} days elapsed
            </span>
            <span className="text-[10px] text-muted-foreground/70">
              {monthlyStats.daysLeft} days remaining
            </span>
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border/40">

          {/* Remaining */}
          <div className="px-3 py-3 space-y-1 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 truncate">
              {monthlyStats.isOverBudget ? "Over budget" : "Remaining"}
            </p>
            <p className={cn("font-mono text-[14px] font-bold tabular-nums tracking-tight leading-none sm:text-[15px]", remainingColor)}>
              {fmt(Math.abs(monthlyStats.remaining))}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {monthlyStats.isOverBudget ? "exceeded" : "left to spend"}
            </p>
          </div>

          {/* Days left */}
          <div className="px-3 py-3 space-y-1 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Days Left
            </p>
            <p className="font-mono text-[14px] font-bold tabular-nums tracking-tight leading-none text-foreground sm:text-[15px]">
              {monthlyStats.daysLeft}
            </p>
            <p className="text-[10px] text-muted-foreground">until month ends</p>
          </div>

          {/* Top discretionary category */}
          <div className="px-3 py-3 space-y-1 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 truncate">
              Top Category
            </p>
            <p className="text-[9px] text-muted-foreground/50 font-medium -mt-0.5">excl. bills</p>
            {topCategoryLabel ? (
              <>
                <p className="text-[14px] font-bold tracking-tight leading-none text-foreground truncate sm:text-[15px]">
                  {topCategoryLabel}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {fmt(monthlyStats.topCategory![1])}
                </p>
              </>
            ) : (
              <>
                <p className="text-[14px] font-bold leading-none text-muted-foreground sm:text-[15px]">—</p>
                <p className="text-[10px] text-muted-foreground">no data yet</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
