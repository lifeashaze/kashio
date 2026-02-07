"use client";

import { TrendingDown, TrendingUp, Calendar, Wallet } from "lucide-react";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useMemo } from "react";

// This would typically come from user settings/preferences
const MONTHLY_BUDGET = 2000;

function getDaysLeftInMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = lastDay.getDate() - now.getDate();
  return daysLeft;
}

function getMonthName() {
  return new Date().toLocaleDateString("en-US", { month: "long" });
}

export function MonthlyBudgetMetrics() {
  const { data: expenses = [] } = useExpenses();

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const totalSpent = monthlyExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const remaining = MONTHLY_BUDGET - totalSpent;
    const percentageUsed = (totalSpent / MONTHLY_BUDGET) * 100;
    const daysLeft = getDaysLeftInMonth();
    const dailyAverage = totalSpent / (now.getDate());
    const projectedTotal = dailyAverage * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return {
      totalSpent,
      remaining,
      percentageUsed,
      daysLeft,
      dailyAverage,
      projectedTotal,
      isOverBudget: totalSpent > MONTHLY_BUDGET,
    };
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
            {getMonthName()} Budget
          </h2>
          <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
            ${MONTHLY_BUDGET.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-muted/30">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${
              monthlyStats.isOverBudget
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : monthlyStats.percentageUsed > 80
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-500 to-green-500"
            }`}
            style={{
              width: `${Math.min(monthlyStats.percentageUsed, 100)}%`,
            }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 divide-x divide-border/40 sm:grid-cols-4">
          {/* Total Spent */}
          <div className="group relative px-4 py-3 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Spent
                  </p>
                </div>
                <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-foreground sm:text-xl">
                  {formatCurrency(monthlyStats.totalSpent)}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {monthlyStats.percentageUsed.toFixed(1)}% of budget
                </p>
              </div>
            </div>
          </div>

          {/* Remaining */}
          <div className="group relative px-4 py-3 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  {monthlyStats.isOverBudget ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-emerald-500" />
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {monthlyStats.isOverBudget ? "Over" : "Left"}
                  </p>
                </div>
                <p
                  className={`font-mono text-lg font-bold tabular-nums tracking-tight sm:text-xl ${
                    monthlyStats.isOverBudget
                      ? "text-red-600 dark:text-red-400"
                      : "text-foreground"
                  }`}
                >
                  {formatCurrency(Math.abs(monthlyStats.remaining))}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {monthlyStats.isOverBudget ? "over budget" : "remaining"}
                </p>
              </div>
            </div>
          </div>

          {/* Days Left */}
          <div className="group relative px-4 py-3 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Days Left
                  </p>
                </div>
                <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-foreground sm:text-xl">
                  {monthlyStats.daysLeft}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  until {getMonthName()} ends
                </p>
              </div>
            </div>
          </div>

          {/* Daily Average */}
          <div className="group relative px-4 py-3 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-sm bg-gradient-to-br from-blue-500 to-cyan-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Avg/Day
                  </p>
                </div>
                <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-foreground sm:text-xl">
                  {formatCurrency(monthlyStats.dailyAverage)}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  daily spending
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projection Footer (Optional - shows if over budget or trending over) */}
        {(monthlyStats.isOverBudget || monthlyStats.projectedTotal > MONTHLY_BUDGET) && (
          <div className="border-t border-border/40 bg-muted/20 px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-muted-foreground">
                {monthlyStats.isOverBudget ? (
                  "You've exceeded your monthly budget"
                ) : (
                  <>
                    Projected month-end total:{" "}
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(monthlyStats.projectedTotal)}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
