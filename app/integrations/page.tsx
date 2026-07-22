import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Code2, Globe2, KeyRound, ShieldCheck, Smartphone, Webhook } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/landing/reveal";
import { IntegrationCodePanel } from "@/components/integration-code-panel";
import { PlatformTabs } from "@/components/integrations/platform-tabs";
import { HashTabs } from "@/components/integrations/hash-tabs";

export const metadata: Metadata = {
  title: "Rebolabs Integration Guide",
  description: "Everything you need to embed the Rebolabs offerwall in an iframe or WebView, and how to verify signed postbacks on your own server.",
  alternates: { canonical: "https://rebolabs.ai/integrations" },
};

const onThisPage = [
  ["#ways-in", "Ways to integrate"],
  ["#iframe", "Web iframe"],
  ["#mobile", "Mobile WebView"],
  ["#postback", "Postbacks & signing"],
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-wash pt-14">
          <div className="rebo-container grid grid-cols-1 items-center gap-14 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div className="max-w-[560px]">
                <div className="section-label">Integrations</div>
                <h1 className="display mt-4 text-5xl text-foreground sm:text-[64px]">
                  Wire it up <span className="hl">once,</span> earn everywhere.
                </h1>
                <p className="mt-6 max-w-[480px] text-base leading-relaxed text-muted-foreground">
                  Load the wall in an iframe or a mobile WebView with your App ID and a user ID. We verify every reward, credit the balance, and can notify your own server too.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="btn-ink">
                    Create account
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="btn-paper">
                    Get help
                  </Link>
                </div>

                <nav aria-label="On this page" className="mt-11 hidden flex-wrap items-center gap-x-6 gap-y-2 sm:flex">
                  {onThisPage.map(([href, label]) => (
                    <a key={href} href={href} className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <IntegrationCodePanel />
            </Reveal>
          </div>
        </section>

        {/* Three ways in */}
        <section id="ways-in" className="paper-section section-y">
          <div className="rebo-container">
            <Reveal>
              <div className="max-w-xl">
                <div className="section-label">Three ways in</div>
                <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">
                  Pick the surface <span className="font-medium text-muted-foreground">you already have.</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { icon: Globe2, title: "Web iframe", body: "One HTML tag. Works with plain HTML, React, Vue, anything that renders a page.", href: "#iframe" },
                { icon: Smartphone, title: "Mobile WebView", body: "Load the same signed URL inside React Native, Android, or iOS. No extra dependencies.", href: "#mobile" },
                { icon: Webhook, title: "Signed postbacks", body: "We verify every completion and can forward a signed copy to your own server.", href: "#postback" },
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 100}>
                  <a href={card.href} className="bento-card group block h-full p-8">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                      <card.icon className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground opacity-70 transition-opacity group-hover:opacity-100">
                      See the code
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Three steps */}
        <section className="paper-alt section-y">
          <div className="rebo-container grid grid-cols-1 gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="section-label">How it fits together</div>
                <h2 className="display mt-4 max-w-[380px] text-5xl text-foreground sm:text-[56px]">
                  Three pieces, <span className="hl">one flow.</span>
                </h2>
                <p className="mt-5 max-w-[380px] text-base leading-relaxed text-muted-foreground">
                  Your App ID, the wall, and your postback endpoint all work together without any extra plumbing.
                </p>
              </div>
            </Reveal>

            <div>
              {[
                { chip: "01", chipClass: "bg-[#e8eeeb] text-[#121814]", icon: KeyRound, title: "Get your App ID", body: "Create a project in the dashboard. Each one gets its own App ID and Server Key." },
                { chip: "02", chipClass: "bg-[#141b17] text-white", icon: Code2, title: "Load the wall", body: "Point an iframe or WebView at wall.rebolabs.ai with your App ID and a stable user ID." },
                { chip: "03", chipClass: "border border-[var(--border-dark)] bg-card text-foreground", icon: ShieldCheck, title: "Verify and credit", body: "We credit the Rebolabs balance automatically. If you want your own currency updated too, verify the signed postback we send your server." },
              ].map((step, i) => (
                <Reveal key={step.chip} delay={i * 120}>
                  <div className={`py-9 ${i > 0 ? "border-t border-border" : "pt-0 lg:pt-2"}`}>
                    <div className="flex items-start gap-5">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${step.chipClass}`}>
                        <step.icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <div className="mono mb-1 text-[11px] text-[var(--subtle)]">STEP {step.chip}</div>
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                        <p className="mt-2 max-w-[440px] text-base leading-relaxed text-muted-foreground">{step.body}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Iframe */}
        <section id="iframe" className="paper-section section-y scroll-mt-20">
          <div className="rebo-container grid grid-cols-1 items-start gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <div>
                <div className="section-label">Web iframe</div>
                <h2 className="display mt-4 text-5xl text-foreground sm:text-[52px]">
                  Embed it <span className="font-medium text-muted-foreground">in one tag.</span>
                </h2>
                <p className="mt-5 max-w-[440px] text-base leading-relaxed text-muted-foreground">
                  Point an iframe at the wall with your App ID and a user ID. Branding, currency, and layout all come from your project settings automatically.
                </p>

                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[110px_1fr] gap-3 bg-[var(--surface-2)] p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>Param</span>
                    <span>Description</span>
                  </div>
                  {[
                    ["app_id", "Your project's App ID, from the dashboard. Required."],
                    ["user_id", "A stable, unique ID for the signed-in user on your platform. Required."],
                  ].map(([key, desc], idx) => (
                    <div key={key} className={`grid grid-cols-[110px_1fr] gap-3 p-4 ${idx > 0 ? "border-t border-border" : ""}`}>
                      <code className="mono text-sm font-semibold text-foreground">{key}</code>
                      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-5">
                <div className="ink-panel overflow-hidden rounded-2xl shadow-[0_24px_64px_rgba(8,12,10,.25)]">
                  <div className="flex items-center gap-2 border-b border-[#263029] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="mono ml-3 text-[11px] text-[#6f8177]">index.html</span>
                  </div>
                  <pre className="mono overflow-x-auto p-6 text-sm leading-relaxed text-[#d7e2db]">{`<iframe
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  width="100%"
  height="800"
  frameborder="0"
  style="border:0;border-radius:8px"
  allow="payment; fullscreen"
></iframe>`}</pre>
                </div>

                <div className="ink-panel overflow-hidden rounded-2xl">
                  <div className="flex items-center gap-2 border-b border-[#263029] px-4 py-3">
                    <span className="mono text-[11px] text-[#6f8177]">responsive.html</span>
                  </div>
                  <pre className="mono overflow-x-auto p-6 text-[13px] leading-relaxed text-[#d7e2db]">{`<div style="position:relative;width:100%;padding-bottom:75%;height:0">
  <iframe
    src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
    style="position:absolute;inset:0;width:100%;height:100%"
    frameborder="0"
    allow="payment; fullscreen"
  ></iframe>
</div>`}</pre>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mobile / WebView */}
        <section id="mobile" className="paper-alt section-y scroll-mt-20">
          <div className="rebo-container grid grid-cols-1 items-start gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <div>
                <div className="section-label">Mobile WebView</div>
                <h2 className="display mt-4 text-5xl text-foreground sm:text-[52px]">
                  Same URL, <span className="font-medium text-muted-foreground">native shell.</span>
                </h2>
                <p className="mt-5 max-w-[440px] text-base leading-relaxed text-muted-foreground">
                  The wall is just a signed URL, so any platform that can render a WebView can host it.
                </p>
                <div className="mt-8 space-y-3.5">
                  {[
                    "Keep JavaScript and DOM storage enabled",
                    "Let the WebView handle its own navigation and back button",
                    "Use a stable user ID, not a session token that changes on login",
                    "HTTPS only — no special network exceptions needed",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                        <Check className="h-3 w-3 text-foreground" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <PlatformTabs />
            </Reveal>
          </div>
        </section>

        {/* Postback + hashing */}
        <section id="postback" className="paper-section section-y scroll-mt-20">
          <div className="rebo-container">
            <Reveal>
              <div className="max-w-xl">
                <div className="section-label">Postbacks & signing</div>
                <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">
                  Every reward, <span className="hl">verified.</span>
                </h2>
                <p className="mt-5 max-w-[520px] text-base leading-relaxed text-muted-foreground">
                  We credit the Rebolabs balance the moment a reward is verified, whether or not you set anything up here. If you also want to update your own in-app currency, set a callback URL in your project&apos;s Integrations tab and we&apos;ll forward a signed copy of every event to it.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { title: "Reward Callback URL", body: "Called on COMPLETE and SCREENOUT, so you always know a session finished, credited or not." },
                { title: "Reconciliation Callback URL", body: "Called on RECONCILIATION, when an earlier reward is adjusted after the fact — a refund or chargeback." },
                { title: "Server Key", body: "Signs every callback we send you. Find it next to your callback URLs in the Integrations tab." },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <div className="bento-card h-full p-7">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Example callback + params */}
            <Reveal delay={100}>
              <div className="mt-14">
                <p className="text-sm font-semibold text-foreground">Example request your server receives</p>
                <div className="mono mt-3 overflow-x-auto rounded-xl border border-border bg-[var(--surface-2)] p-4 text-[13px] leading-relaxed text-foreground">
                  GET /reward-callback?uid=YOUR_APP_ID--user_42&val=2.50&raw=2.00&tx=tx_9f27a1&type=COMPLETE&rat=4&loi=8&hash=3f1a9c…
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-[100px_1fr_140px] gap-3 bg-[var(--surface-2)] p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Param</span>
                  <span>Description</span>
                  <span>Included on</span>
                </div>
                {[
                  ["uid", "Your user's ID, formatted as YOUR_APP_ID--user_id. Split on the double hyphen to get back the ID you passed in.", "Every event"],
                  ["tx", "Unique transaction ID. Store it — a retried postback should never credit twice.", "Every event"],
                  ["type", "COMPLETE, SCREENOUT, or RECONCILIATION.", "Every event"],
                  ["val", "Reward amount in your app's currency. Zero on a screenout.", "COMPLETE, RECONCILIATION"],
                  ["raw", "Raw USD value before your currency conversion.", "COMPLETE, RECONCILIATION"],
                  ["reason", "Why the user didn't qualify.", "SCREENOUT only"],
                  ["ref", "The original transaction ID being adjusted.", "RECONCILIATION only"],
                  ["rat, loi, cat, country", "Survey rating, length, category, and user country.", "COMPLETE only"],
                ].map(([key, desc, when], idx) => (
                  <div key={key} className={`grid grid-cols-[100px_1fr_140px] gap-3 p-4 ${idx > 0 ? "border-t border-border" : ""}`}>
                    <code className="mono text-[13px] font-semibold text-foreground">{key}</code>
                    <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    <span className="mono text-xs text-[var(--subtle)]">{when}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Hashing explainer */}
            <div className="mt-20 grid grid-cols-1 items-start gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
              <Reveal>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">How the signature works</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    We take the full callback URL with every parameter set, sign it with your Server Key using HMAC-SHA1, and append the result as <code className="mono rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[13px] text-foreground">hash</code>. To verify it, rebuild the same URL from what you received, strip the <code className="mono rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[13px] text-foreground">hash</code> param, sign it yourself, and compare.
                  </p>
                  <div className="mt-8 space-y-3.5">
                    {[
                      "Always verify the signature before crediting anything",
                      "Compare hashes with a constant-time check, never ===",
                      "Store the tx ID and ignore duplicates — postbacks can be retried",
                      "Keep your Server Key in an environment variable, never in client code",
                      "Only credit on type === COMPLETE",
                    ].map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                          <Check className="h-3 w-3 text-foreground" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <HashTabs />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="paper-alt section-y-sm">
          <div className="rebo-container text-center">
            <Reveal>
              <p className="display mx-auto max-w-[640px] text-3xl text-foreground sm:text-[40px]">
                Got a stack we didn&apos;t cover? <span className="hl">We&apos;ll help you wire it up.</span>
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn-ink">Create account</Link>
                <Link href="/contact" className="btn-paper">Talk to support</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
