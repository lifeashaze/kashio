import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getSocialProviders, getTrustedOrigins } from "@/lib/auth-config";
import {
  sendResetPasswordEmail,
  sendVerificationEmail as deliverVerificationEmail,
} from "@/lib/auth-email";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

export const auth = betterAuth({
  appName: "Kashio",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await deliverVerificationEmail(user.email, url);
    },
  },
  socialProviders: getSocialProviders(),
  trustedOrigins: getTrustedOrigins(),
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/request-password-reset": {
        window: 300,
        max: 3,
      },
      "/send-verification-email": {
        window: 300,
        max: 3,
      },
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 300,
        max: 5,
      },
    },
  },
});
