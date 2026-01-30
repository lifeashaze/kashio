"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function CTA() {
  const [session, setSession] = useState<{ user: { name: string; email: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (mounted) {
          setSession(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 md:p-16">
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Get started today
            </div>

            <h2 className="mt-4 sm:mt-6 font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Ready to start tracking?
            </h2>

            <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground px-2">
              Start organizing your expenses in seconds.
            </p>

            {!isLoading && (
              <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center px-2">
                {session ? (
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-11 sm:h-12 bg-primary px-6 sm:px-8 text-sm sm:text-base font-medium shadow-lg shadow-primary/30"
                    asChild
                  >
                    <Link href="/home" className="cursor-pointer">
                      Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-11 sm:h-12 bg-primary px-6 sm:px-8 text-sm sm:text-base font-medium shadow-lg shadow-primary/30"
                      asChild
                    >
                      <Link href="/signup" className="cursor-pointer">
                        Get started free <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
                      asChild
                    >
                      <Link href="/login" className="cursor-pointer">Sign in</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Decorative gradients */}
          <div className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-chart-1/20 blur-[100px]" />
        </div>
      </div>
    </section>
  );
}
