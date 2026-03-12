import { redirect } from "next/navigation";
import { HomeNav } from "@/components/home/home-nav";
import { ChatInterface } from "@/components/chat/chat-interface";
import { getSession } from "@/lib/api/auth";

export default async function ChatPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative flex h-screen flex-col bg-background">
      <HomeNav name={session.user.name} email={session.user.email} />
      <ChatInterface userName={session.user.name} />
    </div>
  );
}
