import { HomeHeader, HomeInput, HomeNav, HomeStats } from "@/components/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-start gap-6 px-6 pb-16 pt-16">
        <div className="flex w-full max-w-3xl flex-col items-center gap-6">
          <HomeHeader />
          <HomeInput />
        </div>
        <div className="w-full pt-6">
          <HomeStats />
        </div>
      </main>
    </div>
  );
}
