import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeNav } from "@/components/home";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/api/clear-session");
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav user={session.user} />
      <AnalyticsDashboard />
    </div>
  );
}
