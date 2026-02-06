"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/auth/password-field";
import { OAuthButton } from "@/components/auth/oauth-button";

type AuthMode = "login" | "signup";

type FormSubmissionData = {
  email: string;
  password: string;
  name?: string;
};

interface AuthFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  mode: AuthMode;
  onSubmit?: (data: FormSubmissionData) => void | Promise<void>;
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthForm({
  mode,
  className,
  onSubmit,
  ...props
}: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<
    "submit" | "github" | "google" | null
  >(null);

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isLoading = loadingAction !== null;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const submitText = isLogin ? "Sign In" : "Create Account";
  const oauthText = isLogin ? "Sign in with" : "Sign up with";

  const validateForm = () => {
    if (isSignup && !name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return false;
    }

    if (isSignup && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (isSignup && !passwordsMatch) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const submitWithCredentials = async () => {
    if (isSignup) {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/home");
      return;
    }

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Signed in successfully!");
    router.push("/home");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoadingAction("submit");

    try {
      if (onSubmit) {
        await onSubmit({
          email,
          password,
          ...(isSignup && { name }),
        });
        return;
      }

      await submitWithCredentials();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setLoadingAction(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/home",
      });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setLoadingAction(null);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Get started with kashio"}
          </p>
        </div>

        {isSignup && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
              required
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading}
            required
          />
        </Field>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          disabled={isLoading}
          required
          description={
            isLogin ? (
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot your password?
              </a>
            ) : (
              "Must be at least 8 characters long."
            )
          }
        />

        {isSignup && (
          <PasswordField
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isLoading}
            required
            description={
              <span className="flex items-center gap-1">
                Please confirm your password.
                {passwordsMatch && <Check className="size-3.5 text-green-500" />}
              </span>
            }
          />
        )}

        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 bg-primary font-medium shadow-lg shadow-primary/30"
          >
            {loadingAction === "submit" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              submitText
            )}
          </Button>
        </Field>

        <FieldSeparator>or</FieldSeparator>

        <Field>
          <OAuthButton
            provider="github"
            labelPrefix={oauthText}
            isLoading={loadingAction === "github"}
            disabled={isLoading}
            onClick={() => handleSocialLogin("github")}
            icon={<GitHubIcon />}
          />
        </Field>

        <Field>
          <OAuthButton
            provider="google"
            labelPrefix={oauthText}
            isLoading={loadingAction === "google"}
            disabled={isLoading}
            onClick={() => handleSocialLogin("google")}
            icon={<GoogleIcon />}
          />
          <FieldDescription className="text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <a href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </a>
              </>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
