import type { Metadata } from "next";
import Link from "next/link";
import { Webhook } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { IntegrationDemo } from "@/components/landing/integration-demo";
import { OfferwallPreview } from "@/components/landing/offerwall-preview";
import { Reveal } from "@/components/landing/reveal";
import { RevenueCalculator } from "@/components/revenue-calculator";

export const metadata: Metadata = {
  title: "Rebolabs - Offerwall Monetization for App and Web Publishers",
  description:
    "Integrate rewarded offerwalls, validate postbacks, track project analytics, and receive monthly Net 30 payouts.",
  alternates: { canonical: "https://rebolabs.ai" },
};

const faqs = [
  ["Do publishers pay to use Rebolabs?", "No. Rebolabs is free for publishers. We earn from completed, approved rewards and share that revenue with you."],
  ["How do I add Rebolabs to my app or website?", "Create a project in the dashboard, drop your App ID into the iframe, SDK, or WebView integration, then pass a stable user ID. That is it."],
  ["How do rewards get credited?", "We send signed postbacks with transaction IDs so your server can verify each event, block duplicates, and credit the user exactly once."],
  ["When are payouts sent?", "Approved balances are paid every month on Net 30 terms once your payment details are set up."],
  ["What should I track after launch?", "Keep an eye on reward completions, revenue, postback errors, and payout status. It all lives in your dashboard."],
];

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rebolabs.ai";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Rebolabs",
      url: APP_URL,
      logo: `${APP_URL}/logo.svg`,
      description: "Offerwall monetization platform for app and web publishers with real-time analytics, signed postbacks, and monthly Net 30 payouts.",
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${APP_URL}/contact` },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "Rebolabs",
      publisher: { "@id": `${APP_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "Rebolabs Offerwall",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free for publishers. Revenue share on completed rewards." },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        <Hero />
        <SurfaceMarquee />
        <Features />
        <HowItWorks />
        <Statement />
        <OfferwallPreview />
        <IntegrationDemo />
        <CalculatorSection />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

const SURFACES = ["Web iframe", "JavaScript SDK", "React Native", "Android WebView", "iOS WKWebView", "REST API"];

function SurfaceMarquee() {
  return (
    <section className="border-y border-border bg-[var(--surface-2)] py-8" aria-label="Integration surfaces">

      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee-track items-center gap-14 pr-14">
          {[...SURFACES, ...SURFACES].map((surface, i) => (
            <span key={`${surface}-${i}`} className="mono flex items-center gap-14 whitespace-nowrap text-[13px] font-medium tracking-tight text-muted-foreground">
              {surface}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#12805c]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="paper-section section-y">
      <div className="rebo-container text-center">
        <Reveal>
          <span aria-hidden="true" className="mx-auto mb-8 flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#12805c]" />
            <span className="h-2 w-2 rounded-full bg-[#7ed4a6]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-dark)]" />
          </span>
          <p className="display mx-auto max-w-[820px] text-4xl text-foreground sm:text-[52px]">
            No fees. No subscriptions. We only earn when your users <span className="hl">complete rewards.</span>
          </p>
          <p className="mx-auto mt-6 max-w-[480px] text-base text-muted-foreground">
            You bring the audience. We bring the offers. Then we split the revenue, and you keep the bigger share.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section id="calculator" className="paper-alt section-y">
      <div className="rebo-container">
        <Reveal>
          <div className="mx-auto mb-14 max-w-[620px] text-center">
            <div className="section-label">Calculator</div>
            <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">
              See what <span className="hl">you could earn.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-base leading-relaxed text-muted-foreground">
              Drag the sliders, pick your traffic mix, and watch your monthly estimate update in real time.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <RevenueCalculator />
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="paper-section section-y">
      <div className="rebo-container grid grid-cols-1 gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <div className="section-label">FAQ</div>
            <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">Questions, answered.</h2>
            <p className="mt-5 max-w-[340px] text-base text-muted-foreground">
              Anything else? <Link href="/contact" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-70">Talk to support</Link>.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground sm:text-lg">
                  {question}
                  <span className="text-xl text-muted-foreground transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="px-3 pb-20 pt-14 sm:px-5 sm:pt-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1280px]">
         

          <div className="ink-hero overflow-hidden rounded-[28px] px-6 pb-16 pt-16 text-center sm:px-12 sm:pb-20 sm:pt-20">
            <div className="relative z-[1] mx-auto max-w-[640px]">
              <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5">
                {["Net 30", "70% share", "Signed postbacks"].map((chip) => (
                  <span key={chip} className="mono rounded-full border border-[#33403a] bg-[#1d2620] px-2.5 py-1 text-[10px] text-[#9db0a5]">
                    {chip}
                  </span>
                ))}
              </div>
              <h2 className="display text-5xl text-[#f2f7f4] sm:text-[60px]">
                Ready to start <span className="font-medium text-[#86a095]">earning?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[440px] text-base text-[#9db0a5]">
                Create your account, grab your App ID, and launch your first offerwall in minutes.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn-light">
                  Create account
                </Link>
                <Link href="/contact" className="btn-ghost-dark">
                  Talk to support
                </Link>
              </div>
            </div>
          </div>

          {/* Revenue snapshot, breaking the bottom edge, centered */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-9 z-[2] hidden justify-center lg:flex">
            <div className="float-card flex items-center gap-6 rounded-full px-7 py-3.5">
              <Stat value="70%" label="revenue share" />
              <span className="h-8 w-px bg-border" />
              <Stat value="Net 30" label="payout terms" />
              <span className="h-8 w-px bg-border" />
              <Stat value="100+" label="publishers" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
      <span className="mono text-sm font-semibold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
