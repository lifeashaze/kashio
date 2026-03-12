import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { getSession } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "kashio - Natural language expense tracking",
  description: "Stop filling forms. Just type what you spent and kashio handles the rest. AI-powered expense tracking that speaks your language.",
  openGraph: {
    title: "kashio - Natural language expense tracking",
    description: "Stop filling forms. Just type what you spent and kashio handles the rest.",
    type: "website",
  },
};

export default async function Page() {
  const session = await getSession();

  return (
    <LandingPage hasSession={Boolean(session)} />
  );
}
