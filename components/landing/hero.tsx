import Link from "next/link";
import { ArrowUpRight, Clock, Star, User, Wallet, Webhook } from "lucide-react";
import { Reveal } from "./reveal";

const STATS = [
  { value: "70%", label: "of the revenue goes straight to you" },
  { value: "Net 30", label: "payouts that arrive every month" },
  { value: "100+", label: "publishers already earning with us" },
  { value: "Web + app", label: "one integration covers every platform" },
];

const MINI_SURVEYS = [
  { title: "Consumer habits", rating: 4, minutes: 8, payout: "240 Coins" },
  { title: "Entertainment & streaming", rating: 5, minutes: 12, payout: "410 Coins" },
  { title: "Health & lifestyle", rating: 4, minutes: 6, payout: "185 Coins" },
];

export function Hero() {
  return (
    <section className="hero-wash overflow-hidden pt-14">
      <div className="rebo-container pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          {/* Copy */}
          <div className="max-w-[640px]">
            <Reveal>
              <Link
                href="/integrations"
                className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[var(--border-dark)] hover:text-foreground"
              >
                <span className="rounded-full bg-[#d6f2e0] px-1.5 py-px text-[10px] font-semibold text-[#0b3f2d]">New</span>
                Net 30 payouts, every single month
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display mt-7 text-[44px] text-foreground sm:text-[64px] lg:text-[74px]">
                Offerwall monetization <span className="hl">made easy.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                Drop a rewarded offerwall into your app or website and earn from every completed offer. One integration, live analytics, and money in your account every month.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup" className="btn-ink w-full sm:w-auto">
                  Create account
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/integrations" className="btn-paper w-full sm:w-auto">
                  View integration
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--subtle)]">
                Free for publishers. We only earn when you do.
              </p>
            </Reveal>
          </div>

          {/* Floating product cluster */}
          <Reveal delay={200} className="relative hidden lg:block">
            <div className="relative mx-auto w-[320px]">
              {/* Soft glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-14 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(126,212,166,.32),transparent)] blur-2xl"
              />

              {/* Mini offerwall card */}
              <div className="animate-float-slow rebo-shadow-xl overflow-hidden rounded-[24px] border border-[var(--border-dark)] bg-card">
                <div className="flex h-12 items-center justify-between border-b border-border px-4">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                    <svg className="h-4 w-4" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                      <rect x="1" y="1" width="24" height="24" rx="5" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 19V7h7a5 5 0 0 1 0 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 13l5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Cashly
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="mono inline-flex items-center gap-1 rounded-full border border-border bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-medium text-foreground">
                      <Wallet className="h-3 w-3 text-muted-foreground" />
                      1,240
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground">
                      <User className="h-3 w-3" />
                    </span>
                  </span>
                </div>
                <div className="space-y-2.5 p-4">
                  {MINI_SURVEYS.map((survey) => (
                    <div key={survey.title} className="flex items-center justify-between rounded-xl border border-border bg-[var(--surface-2)] p-3">
                      <div>
                        <div className="text-[11px] font-semibold leading-snug text-foreground">{survey.title}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="flex items-center gap-px" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-2.5 w-2.5"
                                fill={survey.rating >= star ? "#c9a84c" : "none"}
                                stroke={survey.rating >= star ? "#c9a84c" : "#b7c8bf"}
                              />
                            ))}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            {survey.minutes}m
                          </span>
                        </div>
                      </div>
                      <span className="mono text-[11px] font-semibold text-success">{survey.payout}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating postback card */}
              <div className="float-card animate-float absolute -left-24 bottom-14 w-[196px] p-3.5 text-left [animation-delay:1.2s]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <Webhook className="h-4 w-4 text-success" />
                  </span>
                  <div>
                    <div className="text-[11px] font-medium text-foreground">Postback delivered</div>
                    <div className="mono text-[10px] text-success">200 OK · signed</div>
                  </div>
                </div>
              </div>

              {/* Floating payout card */}
              <div className="float-card animate-float absolute -right-20 top-8 w-[190px] p-4 text-left [animation-delay:.6s]">
                <div className="text-[11px] text-muted-foreground">Pending payout</div>
                <div className="mono mt-1 text-xl font-semibold text-foreground">$3,208.14</div>
                <span className="mono mt-2 inline-block rounded-full border border-success/25 bg-success/5 px-2 py-0.5 text-[10px] text-success">
                  Net 30 · on schedule
                </span>
              </div>

              {/* Accent dots */}
              <span aria-hidden="true" className="absolute -left-12 top-6 h-3 w-3 rounded-full bg-[#12805c]" />
              <span aria-hidden="true" className="absolute -right-8 bottom-2 h-2 w-2 rounded-full bg-[#7ed4a6]" />
            </div>
          </Reveal>
        </div>

        {/* Rule-topped stats */}
        <Reveal delay={120}>
          <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 lg:mt-28 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.value} className="border-t border-[var(--border-dark)] pt-5">
                <div className="mono text-2xl font-semibold text-foreground sm:text-3xl">{stat.value}</div>
                <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
