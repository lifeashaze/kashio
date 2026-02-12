"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Expense } from "@/lib/schema";

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

interface DayOfWeekChartProps {
  expenses: Expense[];
}

export function DayOfWeekChart({ expenses }: DayOfWeekChartProps) {
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

  const dayData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const totals = new Array(7).fill(0);

    expenses.forEach((expense) => {
      const day = new Date(expense.date).getDay();
      totals[day] += Number(expense.amount);
    });

    return days.map((day, index) => ({
      day,
      amount: totals[index],
      color: index === 0 || index === 6 ? (isDark ? "#fbbf24" : "#b45309") : (isDark ? "#7dd3fc" : "#0369a1"),
    }));
  }, [expenses, isDark]);

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-foreground">By Day of Week</h3>
        <p className="text-xs text-muted-foreground">When you spend the most</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dayData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} animationDuration={800}>
            {dayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
