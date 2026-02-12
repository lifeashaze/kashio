"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, DollarSign } from "lucide-react";
import { DEFAULT_MONTHLY_BUDGET } from "@/lib/constants/budget";

interface BudgetStepProps {
  monthlyBudget: number;
  currency: string;
  onMonthlyBudgetChange: (value: number) => void;
  onCurrencyChange: (value: string) => void;
}

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
];

export function BudgetStep({
  monthlyBudget,
  currency,
  onMonthlyBudgetChange,
  onCurrencyChange,
}: BudgetStepProps) {
  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);
  const spent = monthlyBudget * 0.42; // Example: 42% spent
  const percentageUsed = 42;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Track your spending against a monthly limit
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlyBudget" className="text-sm font-medium">
            Monthly Budget
          </Label>
          <Input
            id="monthlyBudget"
            type="number"
            min="1"
            step="1"
            value={monthlyBudget || ""}
            onChange={(e) => onMonthlyBudgetChange(parseFloat(e.target.value) || 0)}
            placeholder={DEFAULT_MONTHLY_BUDGET.toString()}
            className="h-11 text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            Currency
          </Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger id="currency" className="h-11">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <span className="font-mono mr-2">{curr.symbol}</span>
                  {curr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {monthlyBudget > 0 && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Preview</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {selectedCurrency?.symbol}{monthlyBudget.toLocaleString()}
                <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">/ month</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{selectedCurrency?.symbol}{spent.toLocaleString(undefined, { maximumFractionDigits: 0 })} spent</span>
              <span>{percentageUsed}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedCurrency?.symbol}{(monthlyBudget - spent).toLocaleString(undefined, { maximumFractionDigits: 0 })} remaining
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Daily Average</p>
              <p className="text-base font-semibold mt-0.5">
                {selectedCurrency?.symbol}{(spent / 15).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days Left</p>
              <p className="text-base font-semibold mt-0.5">15</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
