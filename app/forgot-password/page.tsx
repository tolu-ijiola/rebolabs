"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <nav className="rebo-container flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <BrandLogo />
        </Link>
        <p className="text-sm text-muted-foreground">
          Remember it?{" "}
          <Link href="/login" className="font-medium text-foreground hover:text-muted-foreground">
            Sign in
          </Link>
        </p>
      </nav>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
        {/* Form side */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[430px]">
            {!isSubmitted ? (
              <>
                <h1 className="display text-5xl text-foreground sm:text-[58px]">
                  Reset your password.
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  Enter your email and we'll send you a link to get back in.
                </p>

                <form onSubmit={handleSubmit} className="rebo-card mt-8 space-y-5 p-6">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-foreground">
                      Email address
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-foreground"
                      placeholder="you@company.com"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-ink w-full disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending link
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="display text-5xl text-foreground sm:text-[58px]">
                  Check your inbox.
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  We sent a reset link to <span className="font-medium text-foreground">{email}</span>. It expires in 15 minutes.
                </p>

                <div className="rebo-card mt-8 space-y-4 p-6">
                  <p className="text-sm text-muted-foreground">
                    Didn't get it? Check your spam folder, or{" "}
                    <button
                      onClick={() => { setIsSubmitted(false); setEmail(""); }}
                      className="font-medium text-foreground hover:text-muted-foreground transition-colors"
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
              <span className="text-border">·</span>
              <Link href="/signup" className="hover:text-foreground transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </section>

        {/* Dark panel side */}
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
      </div>
    </main>
  );
}
