"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { PasswordField } from "@/components/auth/password-field";
import { ThemeToggle } from "@/components/theme-toggle";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const errorMessage = useMemo(() => {
    if (error === "INVALID_TOKEN") {
      return "That password reset link is invalid or has expired.";
    }

    return null;
  }, [error]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("That password reset link is invalid or has expired.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Failed to reset your password.");
      }

      toast.success("Password updated.");
      router.push("/login?reset=success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reset your password.";

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
            Choose a new password
          </h1>
          <p className="text-lg text-muted-foreground">
            Use a password you haven&apos;t used here before.
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
                  Reset password
                </h2>
                <p className="text-sm text-muted-foreground">
                  {token
                    ? "Enter your new password below."
                    : "Open the latest password reset email to continue."}
                </p>
              </div>

              <PasswordField
                id="password"
                label="New password"
                value={password}
                onChange={setPassword}
                disabled={!token || isSubmitting}
                required
                description="Must be at least 8 characters long."
              />

              <PasswordField
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                disabled={!token || isSubmitting}
                required
              />

              <Field>
                <Button
                  type="submit"
                  disabled={!token || isSubmitting}
                  className="h-11 bg-primary font-medium shadow-lg shadow-primary/30"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Save new password"
                  )}
                </Button>
              </Field>

              <p className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  sign in
                </Link>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
