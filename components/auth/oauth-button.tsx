"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type OAuthButtonProps = {
  provider: "github" | "google";
  labelPrefix: string;
  icon: ReactNode;
  isLoading: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function OAuthButton({
  provider,
  labelPrefix,
  icon,
  isLoading,
  disabled,
  onClick,
}: OAuthButtonProps) {
  const providerLabel = provider === "github" ? "GitHub" : "Google";

  return (
    <Button
      variant="outline"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <>
          {icon}
          {labelPrefix} {providerLabel}
        </>
      )}
    </Button>
  );
}
