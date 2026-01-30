import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeNav } from "@/components/home";
import { ProfileContent } from "@/components/profile/profile-content";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/api/clear-session");
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav user={session.user} />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-16 pt-8">
        <ProfileContent user={session.user} />
      </main>
    </div>
  );
}
