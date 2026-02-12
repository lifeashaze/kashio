"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Expense } from "@/lib/schema";
import type { ExpenseCategory } from "@/lib/constants/categories";
import { CATEGORY_LABELS } from "@/lib/constants/categories";

const CATEGORY_COLORS: Record<ExpenseCategory, { light: string; dark: string }> = {
  food: { light: "#b45309", dark: "#fbbf24" },
  transport: { light: "#0369a1", dark: "#7dd3fc" },
  entertainment: { light: "#6d28d9", dark: "#c4b5fd" },
  shopping: { light: "#c2410c", dark: "#fdba74" },
  bills: { light: "#334155", dark: "#cbd5e1" },
  health: { light: "#be123c", dark: "#fda4af" },
  groceries: { light: "#047857", dark: "#6ee7b7" },
  travel: { light: "#0e7490", dark: "#67e8f9" },
  education: { light: "#1d4ed8", dark: "#93c5fd" },
  other: { light: "#3f3f46", dark: "#d4d4d8" },
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/80 bg-card px-3 py-2 shadow-lg">
        <p className="font-mono text-sm font-bold text-foreground">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

interface TopCategoriesProps {
  expenses: Expense[];
  formatCurrency: (amount: number) => string;
}

export function TopCategories({ expenses, formatCurrency }: TopCategoriesProps) {
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

  const topCategories = useMemo(() => {
    const categoryMap = new Map<ExpenseCategory, number>();
    expenses.forEach((expense) => {
      const category = expense.category as ExpenseCategory;
      categoryMap.set(category, (categoryMap.get(category) || 0) + Number(expense.amount));
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        color: isDark ? CATEGORY_COLORS[category].dark : CATEGORY_COLORS[category].light,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [expenses, isDark]);

  if (topCategories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-foreground">Top Categories</h3>
        <p className="text-xs text-muted-foreground">Spending by category</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={topCategories}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 5, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            width={85}
            tickFormatter={(value) => CATEGORY_LABELS[value as ExpenseCategory]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} animationDuration={800}>
            {topCategories.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
