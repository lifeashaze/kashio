import {
  Nav,
  Hero,
  ProductShowcase,
  HowItWorks,
  CTA,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <Nav />
      <Hero />
      <ProductShowcase />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
