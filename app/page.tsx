import {
  Background,
  Navigation,
  Hero,
  HowItWorks,
  BentoFeatures,
  CTA,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Background />
      <Navigation />
      <Hero />
      <HowItWorks />
      <BentoFeatures />
      <CTA />
      <Footer />
    </div>
  );
}
