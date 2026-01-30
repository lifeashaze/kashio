import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ExpenseInputDemo } from "./expense-input-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pb-16 pt-16 sm:pb-20 sm:pt-20 md:pb-32 md:pt-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="hidden xs:inline">AI-Powered Expense Tracking</span>
            <span className="xs:hidden">AI Expense Tracking</span>
          </div>

          <h1 className="mt-6 sm:mt-8 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight text-foreground">
            Stop{" "}
            <span className="bg-gradient-to-br from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              filling forms
            </span>
            .
            <br />
            Start typing.
          </h1>

          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground px-2">
            Kashio understands natural language. Type expenses like you're texting—messy, casual, human. We'll handle the parsing, categorization, and organization.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 sm:h-12 bg-primary px-6 sm:px-8 text-sm sm:text-base font-medium shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
              asChild
            >
              <Link href="/signup">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-11 sm:h-12 border-border bg-background/50 px-6 sm:px-8 text-sm sm:text-base backdrop-blur-sm"
            >
              Watch demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="whitespace-nowrap">No credit card</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="whitespace-nowrap">Free forever</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="whitespace-nowrap">Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mx-auto mt-12 sm:mt-16 md:mt-20 flex justify-center px-2">
          <ExpenseInputDemo />
        </div>
      </div>

      {/* Background gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/30 via-chart-1/20 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-chart-2/20 to-transparent blur-[100px]" />
    </section>
  );
}
