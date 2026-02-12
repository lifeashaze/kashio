"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { Expense } from "@/lib/schema";
import { useUserPreferences } from "@/lib/hooks/use-user-preferences";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    const isDark = document.documentElement.classList.contains("dark");
    return (
      <div className="rounded-lg border border-border/80 bg-card px-3 py-2 shadow-lg">
        <p className="text-[10px] font-medium text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-mono text-sm font-bold" style={{ color: entry.dataKey === 'cumulative' ? (isDark ? '#fb923c' : '#ea580c') : (isDark ? '#9ca3af' : '#6b7280') }}>
            {entry.dataKey === 'cumulative' ? 'Spent' : 'Budget'}: ${entry.value.toFixed(0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface SpendingVsBudgetProps {
  expenses: Expense[];
  dateRangeType: "month" | "year" | "custom";
  selectedMonth: number;
  selectedYear: number;
}

export function SpendingVsBudget({ expenses, dateRangeType, selectedMonth, selectedYear }: SpendingVsBudgetProps) {
  const { data: prefs } = useUserPreferences();
  const monthlyBudget = prefs ? parseFloat(prefs.monthlyBudget) : 2000;

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

  const chartData = useMemo(() => {
    if (dateRangeType !== "month") return [];

    const dailyMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + Number(expense.amount));
    });

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const data = [];
    let cumulative = 0;
    const dailyBudget = monthlyBudget / daysInMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedMonth + 1}/${day}`;
      const amount = dailyMap.get(dateStr) || 0;
      cumulative += amount;

      data.push({
        date: dateStr,
        cumulative,
        budget: dailyBudget * day,
      });
    }

    return data;
  }, [expenses, dateRangeType, selectedMonth, selectedYear, monthlyBudget]);

  if (dateRangeType !== "month" || chartData.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">Spending vs Budget</h3>
        <span className="text-[10px] text-muted-foreground">Cumulative</span>
      </div>
      <div className="p-4">

      <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} opacity={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis
            tick={{ fontSize: 9, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
              return `$${value}`;
            }}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="budget"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke={isDark ? "#fb923c" : "#ea580c"}
            strokeWidth={3}
            dot={false}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
