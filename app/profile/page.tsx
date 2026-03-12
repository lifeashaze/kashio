import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { HomeNav } from "@/components/home/home-nav";
import { ProfileContent } from "@/components/profile/profile-content";
import { getSession } from "@/lib/api/auth";
import { userPreferenceKeys, telegramIntegrationQueryKey } from "@/lib/query-keys";
import { getUserPreferencesForUser } from "@/lib/services/user-preferences";
import { getTelegramIntegrationStatus } from "@/lib/telegram/status";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userPreferenceKeys.all,
      queryFn: () => getUserPreferencesForUser(session.user.id),
    }),
    queryClient.prefetchQuery({
      queryKey: telegramIntegrationQueryKey,
      queryFn: () => getTelegramIntegrationStatus(session.user.id),
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeNav name={session.user.name} email={session.user.email} />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-16 pt-8">
          <ProfileContent name={session.user.name} email={session.user.email} />
        </main>
      </HydrationBoundary>
    </div>
  );
}
