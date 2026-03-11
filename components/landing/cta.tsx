"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session-context";

export function CTA() {
  const { session, isLoading } = useSession();

  return (
    <section
      className="relative overflow-hidden border-t border-border/50 px-4 sm:px-6 py-20 sm:py-28"
      aria-label="Get started"
    >
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Start tracking in
          <br />
          <span className="text-primary">under a minute.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Free, open source, and requires nothing but a few words to get started.
        </p>

        {!isLoading && (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {session ? (
              <Button
                size="lg"
                className="h-12 w-full px-9 text-sm font-semibold shadow-lg shadow-primary/20 sm:w-auto"
                asChild
              >
                <Link href="/home">
                  Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="h-12 w-full px-9 text-sm font-semibold shadow-lg shadow-primary/20 sm:w-auto"
                  asChild
                >
                  <Link href="/signup">
                    Create free account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 w-full px-9 text-sm font-medium text-muted-foreground hover:text-foreground sm:w-auto"
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/12 to-transparent blur-[90px]"
        aria-hidden="true"
      />
    </section>
  );
}
