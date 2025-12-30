import { AuthForm } from "@/components/auth/auth-form"


export default function SignupPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_20%_20%,rgba(16,185,129,0.2),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_80%,rgba(20,184,166,0.15),transparent_50%)]" />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        <p className="text-white text-2xl font-bold">kashio</p>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <AuthForm mode="signup" />
                    </div>
                </div>
            </div>
        </div>
    )
}
