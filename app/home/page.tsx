import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeHeader, HomeInput, HomeNav, HomeStats } from "@/components/home";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Clear invalid session cookie before redirecting
    redirect("/api/clear-session");
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav user={session.user} />
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-start gap-6 px-6 pb-16 pt-16">
        <div className="flex w-full max-w-3xl flex-col items-center gap-6">
          <HomeHeader user={session.user} />
          <HomeInput />
        </div>
        <div className="w-full pt-6">
          <HomeStats />
        </div>
      </main>
    </div>
  );
}
