import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative z-10 mx-auto max-w-2xl px-6 py-24 flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold md:text-5xl text-foreground mb-4">
        Start tracking smarter today
      </h2>
      <p className="max-w-xl text-lg text-muted-foreground mb-8">
        Your finances, finally simple. Get started in seconds and see where your money goes.
      </p>
      <Button size="lg" className="h-12 px-8 text-base">
        Get started free <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </section>
  );
}

