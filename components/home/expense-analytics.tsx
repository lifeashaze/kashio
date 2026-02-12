"use client";

import { useMemo, useState, useEffect } from "react";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useUserPreferences } from "@/lib/hooks/use-user-preferences";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ExpenseCategory } from "@/lib/constants/categories";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { TrendingUp, Calendar, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Category colors optimized for accessibility in both light and dark mode
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

interface CategoryData {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

interface DailyData {
  date: string;
  amount: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/98 px-4 py-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="font-mono text-lg font-bold text-foreground">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

function getAvailableMonths(expenses: Array<{ date: string | Date }>) {
  const monthSet = new Set<string>();
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
    monthSet.add(monthKey);
  });

  return Array.from(monthSet)
    .sort()
    .reverse()
    .map((key) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: new Date(parseInt(year), parseInt(month)).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      };
    });
}

export function ExpenseAnalytics() {
  const { data: expenses = [] } = useExpenses();
  const { data: prefs } = useUserPreferences();
  const [isDark, setIsDark] = useState(false);

  const CURRENCY = prefs?.currency || "USD";

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

  const availableMonths = useMemo(() => getAvailableMonths(expenses), [expenses]);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const analytics = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === month &&
        expenseDate.getFullYear() === year
      );
    });

    // Category breakdown
    const categoryMap = new Map<ExpenseCategory, number>();
    monthlyExpenses.forEach((expense) => {
      const category = expense.category as ExpenseCategory;
      categoryMap.set(category, (categoryMap.get(category) || 0) + Number(expense.amount));
    });

    const totalSpent = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

    const categoryData: CategoryData[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
        color: isDark ? CATEGORY_COLORS[category].dark : CATEGORY_COLORS[category].light,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Daily spending data
    const dailyMap = new Map<string, number>();
    monthlyExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + Number(expense.amount));
    });

    const now = new Date();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const maxDay = isCurrentMonth ? now.getDate() : daysInMonth;

    const dailyData: DailyData[] = [];
    for (let day = 1; day <= maxDay; day++) {
      const dateStr = `${month + 1}/${day}`;
      const amount = dailyMap.get(dateStr) || 0;
      dailyData.push({ date: dateStr, amount });
    }

    return {
      categoryData,
      dailyData,
      totalSpent,
      transactionCount: monthlyExpenses.length,
    };
  }, [expenses, selectedMonth, isDark]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (analytics.totalSpent === 0) {
    return null;
  }

  const selectedMonthLabel = availableMonths.find((m) => m.key === selectedMonth)?.label || "Select Month";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Header Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">
              Spending Analytics
            </h2>
            <p className="text-sm text-muted-foreground">
              {analytics.transactionCount} transactions · {formatCurrency(analytics.totalSpent)} total
            </p>
          </div>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[200px] h-10 border-border/60 bg-background/50 backdrop-blur-sm">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((monthOption) => (
                <SelectItem key={monthOption.key} value={monthOption.key}>
                  {monthOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Daily Spending Trend */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Daily Spending</h3>
              <p className="text-xs text-muted-foreground">Per day breakdown</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analytics.dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#colorSpending)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">By Category</h3>
              <p className="text-xs text-muted-foreground">{analytics.categoryData.length} categories</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            {/* Donut Chart */}
            <div className="flex-shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                    animationDuration={1000}
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {analytics.categoryData.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0 ring-2 ring-background"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-xs font-medium text-foreground">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.percentage.toFixed(0)}%
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
              {analytics.categoryData.length > 6 && (
                <p className="pt-1 text-xs text-muted-foreground">
                  +{analytics.categoryData.length - 6} more
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories Bar Chart */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
            <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Top Categories</h3>
            <p className="text-xs text-muted-foreground">Highest spending areas</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={analytics.categoryData.slice(0, 5)}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={100}
              tickFormatter={(value) => CATEGORY_LABELS[value as ExpenseCategory]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[0, 8, 8, 0]} animationDuration={1000}>
              {analytics.categoryData.slice(0, 5).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
