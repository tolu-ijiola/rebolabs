import Link from "next/link";
import { Check, CheckCircle2, Clock, Star, User, Wallet } from "lucide-react";
import { Reveal } from "./reveal";

const SURVEYS = [
  { title: "Consumer habits", rating: 4, minutes: 8, payout: "240 Coins" },
  { title: "Entertainment & streaming", rating: 5, minutes: 12, payout: "410 Coins" },
  { title: "Health & lifestyle", rating: 4, minutes: 6, payout: "185 Coins" },
  { title: "Technology usage", rating: 3, minutes: 15, payout: "520 Coins" },
];

const POINTS = [
  "Your logo, your currency, your colors",
  "Quick qualification checks before every survey",
  "Fraud and duplicate protection built in",
  "Users get credited only after a verified postback",
];

export function OfferwallPreview() {
  return (
    <section className="paper-section section-y overflow-hidden">
      <div className="rebo-container grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <div>
            <div className="section-label">The offerwall</div>
            <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">
              The reward wall <span className="font-medium text-muted-foreground">your users will love.</span>
            </h2>
            <p className="mt-5 max-w-[480px] text-base leading-relaxed text-muted-foreground">
              A clean, white label survey wall that lives inside your app or site. Users finish surveys, you earn, and their balance updates the second a verified postback lands.
            </p>
            <div className="mt-8 space-y-3.5">
              {POINTS.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                    <Check className="h-3 w-3 text-foreground" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" className="btn-ink mt-10">
              Launch your offerwall
            </Link>
          </div>
        </Reveal>

        {/* Dark stage with floating phone */}
        <Reveal delay={120}>
          <div className="ink-hero relative rounded-[28px] px-6 py-12 sm:px-10 sm:py-16">
            <div className="relative z-[1] mx-auto w-full max-w-[340px]">
              <div className="animate-float-slow rebo-shadow-xl overflow-hidden rounded-[28px] border border-[var(--border-dark)] bg-card">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-card px-6 pb-1 pt-3">
                  <span className="mono text-[10px] text-muted-foreground">9:41</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/45" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
                  </span>
                </div>

                {/* Wall nav */}
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

                {/* Tabs */}
                <div className="flex justify-center gap-6 border-b border-border px-4 pt-2 text-xs font-medium">
                  <span className="border-b-2 border-foreground pb-2 text-foreground">Surveys</span>
                  <span className="pb-2 text-muted-foreground">History</span>
                </div>

                {/* Survey cards */}
                <div className="grid grid-cols-2 gap-2.5 p-4 pb-6">
                  {SURVEYS.map((survey) => (
                    <div key={survey.title} className="flex flex-col justify-between rounded-xl border border-border bg-[var(--surface-2)] p-3">
                      <div>
                        <div className="text-[11px] font-semibold leading-snug text-foreground">{survey.title}</div>
                        <div className="mt-1.5 flex items-center gap-1.5">
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
                      <div className="mono mt-3 text-[11px] font-semibold text-success">{survey.payout}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating verified-credit card */}
              <div className="float-card animate-float absolute -left-6 bottom-10 z-10 hidden w-[200px] p-3.5 text-left sm:-left-16 sm:block [animation-delay:1.4s]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </span>
                  <div>
                    <div className="text-[11px] font-medium text-foreground">+240 Coins credited</div>
                    <div className="mono text-[10px] text-success">Verified postback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
