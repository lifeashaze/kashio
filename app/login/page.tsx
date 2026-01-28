"use client";

import { AuthForm } from "@/components/auth/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden bg-gradient-to-br from-primary/20 via-chart-1/10 to-background p-12">
                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/" className="font-heading text-2xl font-bold text-foreground">
                        kashio
                    </Link>
                    <ThemeToggle />
                </div>
                <div className="relative z-10 space-y-4">
                    <h2 className="font-heading text-4xl font-bold text-foreground">
                        Track expenses in
                        <br />
                        natural language
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Stop filling forms. Just type what you spent.
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
                    <div className="w-full max-w-sm">
                        <AuthForm mode="login" />
                    </div>
                </div>
            </div>
        </div>
    )
}
