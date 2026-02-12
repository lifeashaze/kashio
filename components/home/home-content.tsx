"use client";

import { HomeHeader, HomeInput, HomeStats } from "@/components/home";
import { MonthlyBudgetMetrics } from "@/components/home/monthly-budget-metrics";

export function HomeContent({ user }: { user: { name: string; email: string } }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-start gap-6 px-6 pb-16 pt-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <HomeHeader user={user} />
        <HomeInput />
      </div>
      <div className="w-full space-y-6 pt-6">
        <MonthlyBudgetMetrics />
        <HomeStats />
      </div>
    </main>
  );
}
