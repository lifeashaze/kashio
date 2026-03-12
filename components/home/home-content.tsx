import { HomeHeader } from "@/components/home/home-header";
import { HomeInput } from "@/components/home/home-input";
import { HomeStats } from "@/components/home/home-stats";
import { MonthlyBudgetMetrics } from "@/components/home/monthly-budget-metrics";

type HomeContentProps = {
  userName: string;
};

export function HomeContent({ userName }: HomeContentProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-start gap-4 px-4 pb-10 pt-8 sm:gap-6 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 sm:gap-6">
        <HomeHeader name={userName} />
        <HomeInput />
      </div>
      <div className="w-full space-y-4 pt-2 sm:space-y-6 sm:pt-6">
        <MonthlyBudgetMetrics />
        <HomeStats />
      </div>
    </main>
  );
}
