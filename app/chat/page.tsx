import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeNav } from "@/components/home";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/api/clear-session");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HomeNav user={session.user} />
      <ChatInterface userName={session.user.name} />
    </div>
  );
}
