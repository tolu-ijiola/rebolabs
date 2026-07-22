import { ArrowUpRight, BarChart3, CheckCircle2, Globe2, Terminal, WalletCards, Webhook } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./reveal";

const POSTBACK_EVENTS = [
  { event: "Reward completed", tx: "tx_9f27a1", status: "Verified" },
  { event: "Postback delivered", tx: "tx_9f26b4", status: "200 OK" },
];

const MARKETS = ["US / CA / UK", "Western Europe", "Global mixed traffic"];

export function Features() {
  return (
    <section id="features" className="paper-section section-y">
      <div className="rebo-container">
        {/* Editorial split intro */}
        <Reveal>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
            <div>
              <div className="section-label">Features</div>
              <h2 className="display mt-4 max-w-[560px] text-5xl text-foreground sm:text-[56px]">
                Everything you need to <span className="font-medium text-muted-foreground">scale revenue.</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-base leading-relaxed text-muted-foreground">
                From first setup to payday, Rebolabs keeps your monetization clean, measurable, and easy to build on.
              </p>
              <Link href="/integrations" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:opacity-70">
                Learn more
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Analytics — wide, with chart */}
          <Reveal className="md:col-span-2">
            <div className="bento-card h-full p-8 sm:p-9">
              <CardHeader label="Analytics" icon={BarChart3} />
              <div className="mb-7 rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--subtle)]">Revenue · 30 days</div>
                    <div className="mono mt-1 text-2xl font-semibold text-foreground">$12,384.60</div>
                  </div>
                  <span className="mono rounded-full border border-success/25 px-2 py-0.5 text-[10px] text-success">+18.2%</span>
                </div>
                <svg viewBox="0 0 520 80" className="h-[84px] w-full" preserveAspectRatio="none" aria-hidden="true">
                  {[8, 36, 64].map((y) => (
                    <line key={y} x1="0" y1={y} x2="520" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
                  ))}
                  <path d="M0 62 C55 50 84 58 128 48 S205 20 260 32 338 58 392 40 455 20 520 24" fill="none" stroke="var(--foreground)" strokeWidth="2" />
                  <path d="M0 62 C55 50 84 58 128 48 S205 20 260 32 338 58 392 40 455 20 520 24 L520 80 L0 80 Z" fill="var(--foreground)" opacity=".05" />
                  <circle cx="455" cy="20" r="3" fill="var(--foreground)" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">See every dollar as it happens</h3>
              <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-muted-foreground">
                Watch completions, eCPM, and revenue update live. No waiting on batch reports, ever.
              </p>
              <Tags tags={["Realtime", "No batch delays"]} />
            </div>
          </Reveal>

          {/* SDK — with snippet chip */}
          <Reveal delay={100}>
            <div className="bento-card flex h-full flex-col p-8">
              <CardHeader label="SDK" icon={Terminal} />
              <div className="ink-panel mono mb-7 rounded-xl p-4 text-[12px] leading-relaxed">
                <div className="text-[#6f8177]">{"// one call, any platform"}</div>
                <div className="text-[#d7e2db]">
                  Rebo.<span className="text-[#7ed4a6]">showOfferwall</span>();
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">One integration, and you are live</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Drop in an iframe, WebView, or SDK and start earning. User identity stays signed and synced.
              </p>
              <Tags tags={["iframe", "WebView", "API-ready"]} />
            </div>
          </Reveal>

          {/* Targeting — market pills */}
          <Reveal>
            <div className="bento-card flex h-full flex-col p-8">
              <CardHeader label="Targeting" icon={Globe2} />
              <div className="mb-7 space-y-2">
                {MARKETS.map((market, i) => (
                  <div key={market} className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="text-[12px] font-medium text-foreground">{market}</span>
                    <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#12805c]" : i === 1 ? "bg-[#7ed4a6]" : "bg-[var(--border-dark)]"}`} />
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground">Offers that fit every market</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Offers adapt to each country, platform, and user. Every visit counts, wherever your audience lives.
              </p>
              <Tags tags={["Multi-market", "Context-aware"]} />
            </div>
          </Reveal>

          {/* Postbacks — event rows */}
          <Reveal delay={100}>
            <div className="bento-card flex h-full flex-col p-8">
              <CardHeader label="Postbacks" icon={Webhook} />
              <div className="mb-7 space-y-2">
                {POSTBACK_EVENTS.map((row) => (
                  <div key={row.tx} className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      {row.event}
                    </span>
                    <span className="mono rounded-full border border-success/25 px-2 py-0.5 text-[9px] text-success">{row.status}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground">Every reward checked and verified</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Signed callbacks and transaction IDs make sure users get credited once and fraud gets rejected.
              </p>
              <Tags tags={["Signed callbacks", "Dedup logic"]} />
            </div>
          </Reveal>

          {/* Payouts — status strip */}
          <Reveal delay={200}>
            <div className="bento-card flex h-full flex-col p-8">
              <CardHeader label="Payouts" icon={WalletCards} />
              <div className="mb-7 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
                {[
                  ["Open", "Pending"],
                  ["Ready", "Approved"],
                  ["Net 30", "Paid"],
                ].map(([value, label], i) => (
                  <div key={label} className={`p-3 text-center ${i < 2 ? "border-r border-border" : ""}`}>
                    <div className="mono text-sm font-medium text-foreground">{value}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground">Paid every month, like clockwork</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                See pending, approved, and paid balances at a glance. Your money lands on Net 30 terms, every month.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CardHeader({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="section-label">{label}</div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-5">
      {tags.map((tag) => (
        <span key={tag} className="mono rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
  );
}
