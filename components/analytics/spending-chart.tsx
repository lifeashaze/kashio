"use client";

import { useMemo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Expense } from "@/lib/schema";

interface SpendingChartProps {
  expenses: Expense[];
  dateRangeType: "month" | "year" | "custom";
  selectedMonth: number;
  selectedYear: number;
  customDateFrom?: Date;
  customDateTo?: Date;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/80 bg-card px-3 py-2 shadow-lg">
        <p className="text-[10px] font-medium text-muted-foreground mb-0.5">{label}</p>
        <p className="font-mono text-sm font-bold text-foreground">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

export function SpendingChart({
  expenses,
  dateRangeType,
  selectedMonth,
  selectedYear,
  customDateFrom,
  customDateTo,
}: SpendingChartProps) {
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
    if (dateRangeType === "month") {
      const dailyMap = new Map<string, number>();
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + Number(expense.amount));
      });

      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const data = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedMonth + 1}/${day}`;
        data.push({
          date: dateStr,
          amount: dailyMap.get(dateStr) || 0,
        });
      }

      return data;
    } else if (dateRangeType === "year") {
      const monthlyMap = new Map<string, number>();
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const monthStr = new Date(date.getFullYear(), date.getMonth()).toLocaleDateString("en-US", {
          month: "short",
        });
        monthlyMap.set(monthStr, (monthlyMap.get(monthStr) || 0) + Number(expense.amount));
      });

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return monthNames.map((month) => ({
        date: month,
        amount: monthlyMap.get(month) || 0,
      }));
    } else if (customDateFrom && customDateTo) {
      const dailyMap = new Map<string, number>();
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + Number(expense.amount));
      });

      const data = [];
      const current = new Date(customDateFrom);
      while (current <= customDateTo) {
        const dateStr = `${current.getMonth() + 1}/${current.getDate()}`;
        data.push({
          date: dateStr,
          amount: dailyMap.get(dateStr) || 0,
        });
        current.setDate(current.getDate() + 1);
      }

      return data;
    }

    return [];
  }, [expenses, dateRangeType, selectedMonth, selectedYear, customDateFrom, customDateTo]);

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">Spending Trend</h3>
        <span className="text-[10px] text-muted-foreground">
          {dateRangeType === "month" ? "Daily" : dateRangeType === "year" ? "Monthly" : "Daily"}
        </span>
      </div>
      <div className="p-4">

      <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#fb923c" : "#ea580c"} stopOpacity={0.5} />
              <stop offset="100%" stopColor={isDark ? "#fb923c" : "#ea580c"} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} opacity={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickLine={false}
            axisLine={false}
            interval={dateRangeType === "month" ? "preserveStartEnd" : undefined}
            minTickGap={dateRangeType === "month" ? 20 : 10}
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
          <Area
            type="monotone"
            dataKey="amount"
            stroke={isDark ? "#fb923c" : "#ea580c"}
            strokeWidth={3}
            fill="url(#colorSpending)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
