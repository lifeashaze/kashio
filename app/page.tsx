import type { Metadata } from "next";
import {
  Nav,
  Hero,
  ProductShowcase,
  HowItWorks,
  CTA,
  Footer,
} from "@/components/landing";
import { SessionProvider } from "@/lib/session-context";

export const metadata: Metadata = {
  title: "kashio - Natural language expense tracking",
  description: "Stop filling forms. Just type what you spent and kashio handles the rest. AI-powered expense tracking that speaks your language.",
  openGraph: {
    title: "kashio - Natural language expense tracking",
    description: "Stop filling forms. Just type what you spent and kashio handles the rest.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <SessionProvider>
      <div className="relative min-h-screen bg-background">
        <Nav />
        <main id="main-content">
          <Hero />
          <ProductShowcase />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
