"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react"; // Check still used in checkbox
import { ProtectedRoute } from "@/components/protected-route";
import { SignupSuccessModal } from "@/components/signup-success-modal";
import { useAuth } from "@/components/auth-context";
import { BrandLogo } from "@/components/brand-logo";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
  });

  const { signUp } = useAuth();

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the terms and privacy policy");
      return;
    }

    setIsLoading(true);
    setError("");
    const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName);

    if (signUpError) {
      setError(signUpError || "An error occurred");
    } else {
      setSuccessEmail(formData.email);
      setShowSuccessModal(true);
      setFormData({ fullName: "", email: "", password: "", company: "" });
      setAgreeToTerms(false);
    }
    setIsLoading(false);
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <main className="min-h-screen bg-background">
        <nav className="rebo-container flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <BrandLogo />
          </Link>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:text-muted-foreground">
              Sign in
            </Link>
          </p>
        </nav>

        <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
          <section className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-[430px]">
              <h1 className="display text-5xl text-foreground sm:text-[58px]">Create your account.</h1>
              <p className="mt-3 text-base text-muted-foreground">Add projects, generate App IDs, and manage publisher payouts.</p>

              {error && (
                <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="rebo-card mt-8 space-y-5 p-6">
                <Field label="Full name" value={formData.fullName} onChange={(value) => update("fullName", value)} placeholder="Your name" required />
                <Field label="Work email" type="email" value={formData.email} onChange={(value) => update("email", value)} placeholder="you@company.com" required />
                <label className="block">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Password</span>
                    <span className="text-[11px] text-[var(--subtle)]">min. 8 characters</span>
                  </div>
                  <span className="relative block">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(event) => update("password", event.target.value)}
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
                </label>
                <Field label="Company / App name" value={formData.company} onChange={(value) => update("company", value)} placeholder="Your app or company" />

                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" checked={agreeToTerms} onChange={(event) => setAgreeToTerms(event.target.checked)} className="sr-only" />
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${agreeToTerms ? "border-foreground bg-foreground text-background" : "border-border bg-card"}`}>
                    {agreeToTerms && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    I agree to the{" "}
                    <Link href="/terms-of-service" className="font-medium text-foreground">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy-policy" className="font-medium text-foreground">Privacy Policy</Link>.
                  </span>
                </label>

                <button type="submit" disabled={isLoading} className="btn-ink w-full disabled:opacity-60">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account
                    </>
                  ) : (
                    "Create my account"
                  )}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="btn-paper h-11 px-3">Google</button>
                  <button type="button" className="btn-paper h-11 px-3">GitHub</button>
                </div>
              </form>
            </div>
          </section>

          <aside className="hidden border-l border-[#263029] bg-[#17201b] p-12 text-[#f2f7f4] lg:flex lg:items-center">
            <div className="mx-auto max-w-[460px]">
              <p className="display text-[42px] leading-tight">
                Connect your app, verify reward events, and track publisher payouts from one place.
              </p>
              <p className="mt-5 text-sm text-[#6f8177]">For approved app and web publishers.</p>
              <div className="my-10 h-px bg-white/10" />
              <div className="grid grid-cols-3 gap-6">
                {[
                  ["100+", "Publishers live"],
                  ["$10K+", "Paid out to date"],
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

        <SignupSuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} email={successEmail} />
      </main>
    </ProtectedRoute>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-foreground"
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
