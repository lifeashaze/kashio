import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-32">
      <div className="flex flex-col items-center text-center">

        {/* Main headline */}
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
          Track expenses with{" "}
          <span className="bg-gradient-to-r from-chart-1 via-primary to-chart-2 bg-clip-text text-transparent">
            natural language
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Stop wrestling with spreadsheets and clunky apps. With Kashio, managing money is as simple as sending a text—just describe what you spent and let the magic happen.
        </p>

        {/* Example input */}
        <div className="mt-10 w-full max-w-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-2 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="flex-1 text-left text-muted-foreground">
              &ldquo;Groceries at Whole Foods $87.50&rdquo;
            </span>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90">
            <Link
              href="/signup"
              className="flex items-center"
              tabIndex={-1}
            >
              Start tracking free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 border-border bg-transparent px-8 text-base text-foreground hover:bg-muted">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}

