"use client";

import { useMemo, useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Expense } from "@/lib/schema";
import type { ExpenseCategory } from "@/lib/constants/categories";
import { CATEGORY_LABELS } from "@/lib/constants/categories";

const CATEGORY_COLORS: Record<ExpenseCategory, { light: string; dark: string }> = {
  food: { light: "#ea580c", dark: "#fb923c" },
  transport: { light: "#0891b2", dark: "#22d3ee" },
  entertainment: { light: "#7c3aed", dark: "#a78bfa" },
  shopping: { light: "#dc2626", dark: "#f87171" },
  bills: { light: "#475569", dark: "#94a3b8" },
  health: { light: "#db2777", dark: "#f472b6" },
  groceries: { light: "#059669", dark: "#34d399" },
  travel: { light: "#2563eb", dark: "#60a5fa" },
  education: { light: "#7c2d12", dark: "#fdba74" },
  other: { light: "#52525b", dark: "#a1a1aa" },
};

interface CategoryBreakdownProps {
  expenses: Expense[];
  formatCurrency: (amount: number) => string;
}

export function CategoryBreakdown({ expenses, formatCurrency }: CategoryBreakdownProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const categoryData = useMemo(() => {
    const categoryMap = new Map<ExpenseCategory, number>();
    expenses.forEach((expense) => {
      const category = expense.category as ExpenseCategory;
      categoryMap.set(category, (categoryMap.get(category) || 0) + Number(expense.amount));
    });

    const totalSpent = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
        color: isDark ? CATEGORY_COLORS[category].dark : CATEGORY_COLORS[category].light,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, isDark]);

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">By Category</h3>
        <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
          {categoryData.length}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 p-4">
        <ResponsiveContainer width="100%" height={200} className="max-w-[200px]">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="amount"
              animationDuration={800}
              strokeWidth={3}
              stroke="hsl(var(--card))"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="w-full space-y-2">
          {categoryData.slice(0, 6).map((item) => (
            <div key={item.category} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-[11px] font-medium text-foreground">
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold tabular-nums text-foreground flex-shrink-0">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
          {categoryData.length > 6 && (
            <p className="text-[10px] text-muted-foreground pt-1">
              +{categoryData.length - 6} more
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
