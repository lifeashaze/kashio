"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const errorMessages: Record<string, string> = {
  INVALID_TOKEN: "That link is invalid or has already been used.",
  invalid_token: "That verification link is invalid.",
  token_expired: "That verification link has expired. Sign in to get a fresh one.",
  user_not_found: "We could not find that account anymore.",
};

export function AuthStatusToast() {
  const searchParams = useSearchParams();
  const lastToastKey = useRef<string | null>(null);

  useEffect(() => {
    const verification = searchParams.get("verification");
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");
    const error = searchParams.get("error");
    const toastKey = [verification, verified, reset, error]
      .filter(Boolean)
      .join(":");

    if (!toastKey || toastKey === lastToastKey.current) {
      return;
    }

    lastToastKey.current = toastKey;

    if (verification === "sent") {
      toast.success("Check your inbox for the verification email.");
      return;
    }

    if (verified === "1") {
      toast.success("Email verified. You can sign in now.");
      return;
    }

    if (reset === "success") {
      toast.success("Password updated. Sign in with your new password.");
      return;
    }

    if (error && errorMessages[error]) {
      toast.error(errorMessages[error]);
    }
  }, [searchParams]);

  return null;
}
