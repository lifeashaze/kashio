"use client";

import { useMemo, useState, useEffect } from "react";
import { useExpenses } from "@/lib/hooks/use-expenses";
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
  ReferenceLine,
} from "recharts";
import type { ExpenseCategory } from "@/lib/constants/categories";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Category colors matching the expense row badges - work in both light and dark mode
const CATEGORY_COLORS: Record<ExpenseCategory, { light: string; dark: string }> = {
  food: { light: "#d97706", dark: "#fbbf24" },        // amber-600 / amber-400
  transport: { light: "#0284c7", dark: "#38bdf8" },   // sky-600 / sky-400
  entertainment: { light: "#7c3aed", dark: "#a78bfa" }, // violet-600 / violet-400
  shopping: { light: "#ea580c", dark: "#fb923c" },    // orange-600 / orange-400
  bills: { light: "#475569", dark: "#94a3b8" },       // slate-600 / slate-400
  health: { light: "#e11d48", dark: "#fb7185" },      // rose-600 / rose-400
  groceries: { light: "#059669", dark: "#34d399" },   // emerald-600 / emerald-400
  travel: { light: "#0891b2", dark: "#22d3ee" },      // cyan-600 / cyan-400
  education: { light: "#2563eb", dark: "#60a5fa" },   // blue-600 / blue-400
  other: { light: "#52525b", dark: "#a1a1aa" },       // zinc-600 / zinc-400
};

const MONTHLY_BUDGET = 2000;

interface CategoryData {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

interface DailyData {
  date: string;
  amount: number;
  cumulative: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="mt-1 font-mono text-[13px] font-bold text-foreground">
            ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
}

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: PieLabelProps) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percentage < 5) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-mono text-[11px] font-bold drop-shadow-md"
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  );
}

// Generate list of available months from expenses
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
        year: parseInt(year),
        month: parseInt(month),
        label: new Date(parseInt(year), parseInt(month)).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      };
    });
}

export function ExpenseAnalytics() {
  const { data: expenses = [] } = useExpenses();
  const [isDark, setIsDark] = useState(false);

  // Check theme on mount and listen for changes
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

  // Default to current month
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const analytics = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);

    // Filter selected month expenses
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

    const top5Categories = categoryData.slice(0, 5);

    // Daily spending data
    const dailyMap = new Map<string, number>();
    monthlyExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + Number(expense.amount));
    });

    // Generate all days of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyData: DailyData[] = [];
    let cumulative = 0;

    const now = new Date();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    const maxDay = isCurrentMonth ? now.getDate() : daysInMonth;

    for (let day = 1; day <= maxDay; day++) {
      const dateStr = `${month + 1}/${day}`;
      const amount = dailyMap.get(dateStr) || 0;
      cumulative += amount;

      dailyData.push({
        date: dateStr,
        amount,
        cumulative,
      });
    }

    return {
      categoryData,
      top5Categories,
      dailyData,
      totalSpent,
    };
  }, [expenses, selectedMonth, isDark]);

  if (analytics.totalSpent === 0) {
    return null;
  }

  const selectedMonthLabel = availableMonths.find((m) => m.key === selectedMonth)?.label || "Select Month";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        {/* Header with Month Selector */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
            Spending Analytics
          </h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 rounded-md border-border/60 bg-muted/20 px-2 text-[11px] font-semibold hover:bg-muted/40"
              >
                {selectedMonthLabel}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableMonths.map((monthOption) => (
                <DropdownMenuItem
                  key={monthOption.key}
                  onClick={() => setSelectedMonth(monthOption.key)}
                  className="text-[12px] font-medium"
                >
                  {monthOption.label}
                  {monthOption.key === selectedMonth && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Category Distribution - Donut Chart */}
          <div className="border-b border-border/40 p-4 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center gap-2">
              <PieChartIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Category Breakdown
              </h3>
            </div>

            <div className="flex items-center justify-between gap-6">
              {/* Chart */}
              <div className="flex-shrink-0">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="amount"
                      labelLine={false}
                      label={(props) => (
                        <CustomPieLabel {...props} percentage={props.percentage} />
                      )}
                      animationDuration={800}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2">
                {analytics.categoryData.slice(0, 5).map((item) => (
                  <div key={item.category} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-sm flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-[11px] font-medium text-foreground">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                    </div>
                    <span className="flex-shrink-0 font-mono text-[11px] font-bold tabular-nums text-muted-foreground">
                      ${item.amount.toFixed(0)}
                    </span>
                  </div>
                ))}
                {analytics.categoryData.length > 5 && (
                  <p className="pt-1 text-[10px] text-muted-foreground">
                    +{analytics.categoryData.length - 5} more
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Daily Spending Trend - Area Chart */}
          <div className="border-b border-border/40 p-4 lg:border-b-0">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Cumulative Spending
              </h3>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={analytics.dailyData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
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
                <ReferenceLine
                  y={MONTHLY_BUDGET}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorSpending)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories - Horizontal Bar Chart */}
          <div className="p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Top 5 Categories
              </h3>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={analytics.top5Categories}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
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
                  width={80}
                  tickFormatter={(value) => CATEGORY_LABELS[value as ExpenseCategory]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} animationDuration={800}>
                  {analytics.top5Categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
