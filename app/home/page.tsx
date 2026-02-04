import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeNav, HomeContent } from "@/components/home";

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
      <HomeContent user={session.user} />
    </div>
  );
}
