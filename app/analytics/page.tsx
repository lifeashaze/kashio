import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { HomeNav } from "@/components/home/home-nav";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { getSession } from "@/lib/api/auth";
import { listExpensesForUser } from "@/lib/services/expense-write";
import { getUserPreferencesForUser } from "@/lib/services/user-preferences";
import { expenseKeys, userPreferenceKeys } from "@/lib/query-keys";

export default async function AnalyticsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: expenseKeys.lists(),
      queryFn: () => listExpensesForUser(session.user.id),
    }),
    queryClient.prefetchQuery({
      queryKey: userPreferenceKeys.all,
      queryFn: () => getUserPreferencesForUser(session.user.id),
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeNav name={session.user.name} email={session.user.email} />
        <AnalyticsDashboard />
      </HydrationBoundary>
    </div>
  );
}
