"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const trendData = [
  { day: "Mon", spend: 32 },
  { day: "Tue", spend: 48 },
  { day: "Wed", spend: 41 },
  { day: "Thu", spend: 55 },
  { day: "Fri", spend: 38 },
  { day: "Sat", spend: 62 },
  { day: "Sun", spend: 52 },
];

const categorySplit = [
  { name: "Food & Drink", value: 412.8, color: "var(--chart-1)" },
  { name: "Transport", value: 214.6, color: "var(--chart-2)" },
  { name: "Subscriptions", value: 176.2, color: "var(--chart-3)" },
  { name: "Groceries", value: 146.4, color: "var(--chart-4)" },
  { name: "Other", value: 98.4, color: "var(--chart-5)" },
];

const budgetBars = [
  { label: "Week 1", spent: 320 },
  { label: "Week 2", spent: 410 },
  { label: "Week 3", spent: 280 },
  { label: "Week 4", spent: 238 },
];

const trendConfig = {
  spend: {
    label: "Spend",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const budgetConfig = {
  spent: {
    label: "Spent",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const currency = (value: number | string) => {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(numeric)) return String(value);
  return `$${numeric.toFixed(2)}`;
};

export function HomeStats() {
  const totalBudget = 2000;
  const monthToDate = 1248.32;
  const budgetUsed = Math.min((monthToDate / totalBudget) * 100, 100);

  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-chart-2/10 px-6 py-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Spending trend</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">$1,248.32</p>
              <p className="text-xs text-muted-foreground">Month to date · 42 expenses</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Avg/day</p>
              <p className="text-base font-semibold text-foreground">$38.16</p>
              <p className="text-[11px]">+8% vs last week</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Monthly budget</span>
              <span>${totalBudget.toLocaleString()}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted/50">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-chart-1 to-chart-2"
                style={{ width: `${budgetUsed}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>${(totalBudget - monthToDate).toFixed(2)} remaining</span>
              <span>{budgetUsed.toFixed(0)}% used</span>
            </div>
          </div>
          <div className="mt-6 h-56">
            <ChartContainer config={trendConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent valueFormatter={currency} />}
                    cursor={{ stroke: "var(--chart-1)", strokeOpacity: 0.2 }}
                  />
                  <Area
                    dataKey="spend"
                    type="monotone"
                    stroke="var(--chart-1)"
                    fill="url(#trendFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-chart-3/10 via-background to-primary/5 px-6 py-6">
          <p className="text-xs font-medium text-muted-foreground">Category split</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent valueFormatter={currency} />} />
                <Pie
                  data={categorySplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={46}
                  outerRadius={78}
                  paddingAngle={4}
                >
                  {categorySplit.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="var(--background)" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            {categorySplit.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
                <span className="text-foreground">{currency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-chart-1/10 px-5 py-5 text-left">
          <p className="text-xs font-medium text-muted-foreground">Largest expense</p>
          <p className="mt-2 text-lg font-semibold text-foreground">$214.00</p>
          <p className="text-xs text-muted-foreground">Airbnb · Jan 22</p>
          <div className="mt-4 h-24">
            <ChartContainer config={budgetConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetBars}>
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={currency} />} />
                  <Bar dataKey="spent" radius={[10, 10, 10, 10]} fill="var(--chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-chart-2/10 via-background to-primary/5 px-5 py-5 text-left">
          <p className="text-xs font-medium text-muted-foreground">Budget status</p>
          <p className="mt-2 text-lg font-semibold text-foreground">$2,000</p>
          <p className="text-xs text-muted-foreground">$751.68 remaining</p>
          <div className="mt-4 h-24">
            <ChartContainer config={budgetConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetBars} barSize={14}>
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={currency} />} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={10} />
                  <Bar dataKey="spent" radius={[8, 8, 8, 8]} fill="var(--chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-chart-1/10 via-background to-chart-4/10 px-5 py-5 text-left">
          <p className="text-xs font-medium text-muted-foreground">Next recurring</p>
          <p className="mt-2 text-lg font-semibold text-foreground">Spotify</p>
          <p className="text-xs text-muted-foreground">$11.99 · Feb 2</p>
          <div className="mt-4 h-24">
            <ChartContainer config={trendConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={currency} />} />
                  <Area
                    dataKey="spend"
                    type="monotone"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Next 7 days</span>
            <span>3 recurrences</span>
          </div>
        </div>
      </div>

    </div>
  );
}
