"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Enter the email address for your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          redirectTo: new URL("/reset-password", window.location.origin).toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to request a password reset.");
      }

      toast.success("If that account exists, we sent a password reset email.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to request a password reset.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/20 via-chart-1/10 to-background p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-foreground">
            kashio
          </Link>
          <ThemeToggle />
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Reset your password
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;ll email you a secure link to choose a new one.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_20%_20%,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_80%,hsl(var(--chart-1)/0.15),transparent_50%)]" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Link href="/" className="font-heading text-2xl font-bold text-foreground">
            kashio
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-3xl font-bold tracking-tight">
                  Forgot password
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter the email you use for Kashio.
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 bg-primary font-medium shadow-lg shadow-primary/30"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Email reset link"
                  )}
                </Button>
              </Field>

              <p className="text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
