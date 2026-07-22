"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { BrandLogo } from "@/components/brand-logo";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError || "An error occurred");
    } else {
      router.refresh();
      router.push(redirectTo);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <nav className="rebo-container flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <BrandLogo />
        </Link>
        <p className="text-sm text-muted-foreground">
          Need access?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:text-muted-foreground">
            Create account
          </Link>
        </p>
      </nav>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[430px]">
            <h1 className="display text-5xl text-foreground sm:text-[58px]">Welcome back.</h1>
            <p className="mt-3 text-base text-muted-foreground">Sign in to your ReboLabs dashboard.</p>

            {error && (
              <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="rebo-card mt-8 space-y-5 p-6">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-foreground">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-foreground"
                  placeholder="you@company.com"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-foreground">Password</span>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 pr-11 text-sm text-foreground outline-none transition focus:border-foreground"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                <Link href="/forgot-password" className="mt-2 block text-right text-xs font-medium text-muted-foreground hover:text-foreground">
                  Forgot password?
                </Link>
              </label>
              <button type="submit" disabled={isLoading} className="btn-ink w-full disabled:opacity-60">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
              <div className="relative py-1 text-center text-xs text-[var(--subtle)]">
                <span className="bg-card px-3">or continue with</span>
                <div className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn-paper h-11 px-3">Google</button>
                <button type="button" className="btn-paper h-11 px-3">GitHub</button>
              </div>
            </form>
          </div>
        </section>

        <ValuePanel />
      </div>
    </main>
  );
}

function ValuePanel() {
  return (
    <aside className="hidden border-l border-[#263029] bg-[#17201b] p-12 text-[#f2f7f4] lg:flex lg:items-center">
      <div className="mx-auto max-w-[460px]">
        <p className="display text-[42px] leading-tight">
          Manage projects, verify rewards, and keep payout operations in one dashboard.
        </p>
        <p className="mt-5 text-sm text-[#6f8177]">Built for publishers integrating rewarded experiences.</p>
        <div className="my-10 h-px bg-white/10" />
        <div className="grid grid-cols-3 gap-6">
          {[
            ["100+", "Publishers live"],
            ["$10k+", "Paid out to date"],
            ["Net 30", "Payout terms"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="mono text-2xl text-[#f2f7f4]">{value}</div>
              <div className="mt-1 text-xs text-[#6f8177]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
