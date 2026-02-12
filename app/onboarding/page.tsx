"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home where the onboarding modal will appear
    router.push("/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );
}
