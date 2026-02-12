"use client";

import { useState, useMemo } from "react";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useUserPreferences } from "@/lib/hooks/use-user-preferences";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { SpendingChart } from "./spending-chart";
import { CategoryBreakdown } from "./category-breakdown";
import { SpendingStats } from "./spending-stats";
import { SpendingVsBudget } from "./spending-vs-budget";

type DateRangeType = "month" | "year" | "custom";

export function AnalyticsDashboard() {
  const { data: expenses = [] } = useExpenses();
  const { data: prefs } = useUserPreferences();
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("month");
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();

  const CURRENCY = prefs?.currency || "USD";

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      if (dateRangeType === "month") {
        return (
          expenseDate.getMonth() === selectedMonth &&
          expenseDate.getFullYear() === selectedYear
        );
      } else if (dateRangeType === "year") {
        return expenseDate.getFullYear() === selectedYear;
      } else if (dateRangeType === "custom" && customDateFrom && customDateTo) {
        return expenseDate >= customDateFrom && expenseDate <= customDateTo;
      }

      return false;
    });
  }, [expenses, dateRangeType, selectedMonth, selectedYear, customDateFrom, customDateTo]);

  const analytics = useMemo(() => {
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const avgTransaction = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;
    const largestTransaction = filteredExpenses.length > 0
      ? Math.max(...filteredExpenses.map(e => Number(e.amount)))
      : 0;
    const smallestTransaction = filteredExpenses.length > 0
      ? Math.min(...filteredExpenses.map(e => Number(e.amount)))
      : 0;

    let daysInRange = 1;
    if (dateRangeType === "month") {
      daysInRange = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    } else if (dateRangeType === "year") {
      const isLeapYear = selectedYear % 4 === 0 && (selectedYear % 100 !== 0 || selectedYear % 400 === 0);
      daysInRange = isLeapYear ? 366 : 365;
    } else if (customDateFrom && customDateTo) {
      daysInRange = Math.ceil((customDateTo.getTime() - customDateFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    const avgPerDay = totalSpent / daysInRange;

    // Days with spending
    const daysWithSpending = new Set(
      filteredExpenses.map(e => new Date(e.date).toDateString())
    ).size;

    // Median transaction
    const sortedAmounts = [...filteredExpenses.map(e => Number(e.amount))].sort((a, b) => a - b);
    const median = sortedAmounts.length > 0
      ? sortedAmounts.length % 2 === 0
        ? (sortedAmounts[sortedAmounts.length / 2 - 1] + sortedAmounts[sortedAmounts.length / 2]) / 2
        : sortedAmounts[Math.floor(sortedAmounts.length / 2)]
      : 0;

    // Most expensive category
    const categoryTotals = new Map();
    filteredExpenses.forEach(expense => {
      const cat = expense.category;
      categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + Number(expense.amount));
    });
    const topCategory = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // Transactions per day average
    const transactionsPerDay = daysWithSpending > 0 ? filteredExpenses.length / daysWithSpending : 0;

    return {
      totalSpent,
      transactionCount: filteredExpenses.length,
      avgTransaction,
      largestTransaction,
      smallestTransaction,
      avgPerDay,
      daysWithSpending,
      daysInRange,
      median,
      topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
      transactionsPerDay,
    };
  }, [filteredExpenses, dateRangeType, selectedMonth, selectedYear, customDateFrom, customDateTo]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(2024, i).toLocaleDateString("en-US", { month: "long" }),
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: now.getFullYear() - i,
    label: (now.getFullYear() - i).toString(),
  }));

  const getDateRangeLabel = () => {
    if (dateRangeType === "month") {
      return `${monthOptions[selectedMonth].label} ${selectedYear}`;
    } else if (dateRangeType === "year") {
      return selectedYear.toString();
    } else if (customDateFrom && customDateTo) {
      return `${format(customDateFrom, "MMM d")} - ${format(customDateTo, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 pb-16 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Analytics</h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block">{getDateRangeLabel()}</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <Tabs value={dateRangeType} onValueChange={(v) => setDateRangeType(v as DateRangeType)}>
            <TabsList className="h-8 w-full sm:w-auto">
              <TabsTrigger value="month" className="text-[11px] flex-1 sm:flex-none">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-[11px] flex-1 sm:flex-none">Year</TabsTrigger>
              <TabsTrigger value="custom" className="text-[11px] flex-1 sm:flex-none">Custom</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {dateRangeType === "month" && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] flex-1 sm:flex-none">
                      {monthOptions[selectedMonth].label}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="grid grid-cols-3 gap-1">
                      {monthOptions.map((month) => (
                        <Button
                          key={month.value}
                          variant={selectedMonth === month.value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedMonth(month.value)}
                          className="h-7 text-[11px]"
                        >
                          {month.label.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] w-16">
                      {selectedYear}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2" align="end">
                    <div className="flex flex-col gap-1">
                      {yearOptions.map((year) => (
                        <Button
                          key={year.value}
                          variant={selectedYear === year.value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedYear(year.value)}
                          className="h-7 text-[11px]"
                        >
                          {year.label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}

            {dateRangeType === "year" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-[11px] w-full sm:w-auto">
                    <CalendarIcon className="mr-1.5 h-3 w-3" />
                    {selectedYear}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-2" align="end">
                  <div className="flex flex-col gap-1">
                    {yearOptions.map((year) => (
                      <Button
                        key={year.value}
                        variant={selectedYear === year.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedYear(year.value)}
                        className="h-8 text-xs"
                      >
                        {year.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {dateRangeType === "custom" && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] flex-1 sm:flex-none">
                      <CalendarIcon className="mr-1.5 h-3 w-3" />
                      {customDateFrom ? format(customDateFrom, "MMM d") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={customDateFrom} onSelect={setCustomDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] flex-1 sm:flex-none">
                      <CalendarIcon className="mr-1.5 h-3 w-3" />
                      {customDateTo ? format(customDateTo, "MMM d") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={customDateTo} onSelect={setCustomDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </div>

        {/* Mobile date range label */}
        <p className="text-[11px] text-muted-foreground sm:hidden -mt-2">{getDateRangeLabel()}</p>
      </div>

      {/* Stats */}
      <SpendingStats analytics={analytics} formatCurrency={formatCurrency} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SpendingChart
            expenses={filteredExpenses}
            dateRangeType={dateRangeType}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            customDateFrom={customDateFrom}
            customDateTo={customDateTo}
          />
          {dateRangeType === "month" && (
            <SpendingVsBudget
              expenses={filteredExpenses}
              dateRangeType={dateRangeType}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </div>
        <CategoryBreakdown expenses={filteredExpenses} formatCurrency={formatCurrency} />
      </div>
    </main>
  );
}
