"use client";

import { HomeHeader, HomeInput, HomeStats } from "@/components/home";

export function HomeContent({ user }: { user: { name: string; email: string } }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-start gap-6 px-6 pb-16 pt-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <HomeHeader user={user} />
        <HomeInput />
      </div>
      <div className="w-full pt-6">
        <HomeStats />
      </div>
    </main>
  );
}
