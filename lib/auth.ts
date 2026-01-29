import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

const isDevelopment = process.env.NODE_ENV === "development";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    trustedOrigins: isDevelopment
        ? ["*"]
        : [process.env.BETTER_AUTH_URL!],
    rateLimit: {
        enabled: true,
        window: 60,
        max: 20,
        storage: "memory",
        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 5,
            },
            "/sign-up/email": {
                window: 300,
                max: 3,
            },
        },
    },
});