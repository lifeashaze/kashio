"use client";

import { DollarSign, ReceiptText, TrendingUp, Calendar } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import type { ExpenseCategory } from "@/lib/constants/categories";

interface SpendingStatsProps {
  analytics: {
    totalSpent: number;
    transactionCount: number;
    avgTransaction: number;
    largestTransaction: number;
    smallestTransaction: number;
    avgPerDay: number;
    daysWithSpending: number;
    daysInRange: number;
    median: number;
    topCategory: { category: string; amount: number } | null;
    transactionsPerDay: number;
  };
  formatCurrency: (amount: number) => string;
}

export function SpendingStats({ analytics, formatCurrency }: SpendingStatsProps) {
  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(analytics.totalSpent),
      icon: DollarSign,
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      label: "Transactions",
      value: analytics.transactionCount.toString(),
      icon: ReceiptText,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Avg/Transaction",
      value: formatCurrency(analytics.avgTransaction),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Avg/Day",
      value: formatCurrency(analytics.avgPerDay),
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400"
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  {stat.label}
                </p>
                <p className="text-base sm:text-lg font-bold tracking-tight tabular-nums text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted/30 ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
