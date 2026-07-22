import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const steps = [
  {
    number: "01",
    chip: "Create",
    chipClass: "bg-[#d6f2e0] text-[#0b3f2d]",
    title: "Create a project",
    description: "Sign up, add your app or website, and grab your App ID. Takes about two minutes.",
  },
  {
    number: "02",
    chip: "Launch",
    chipClass: "bg-[#141b17] text-white",
    title: "Launch the offerwall",
    description: "Paste the snippet or SDK call, pass your user ID, and the wall goes live inside your product.",
  },
  {
    number: "03",
    chip: "Get paid",
    chipClass: "border border-[var(--border-dark)] bg-card text-foreground",
    title: "Earn and get paid",
    description: "Watch verified rewards roll in live. Your balance gets paid out every month on Net 30 terms.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="paper-alt section-y">
      <div className="rebo-container grid grid-cols-1 gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <div className="section-label">How it works</div>
            <h2 className="display mt-4 max-w-[420px] text-5xl text-foreground sm:text-[56px]">
              Up and running <span className="hl">before lunch.</span>
            </h2>
            <p className="mt-5 max-w-[400px] text-base leading-relaxed text-muted-foreground">
              Three steps stand between you and your first rewarded revenue. None of them are hard.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-ink">
                Create account
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/integrations" className="btn-paper">
                Learn more
              </Link>
            </div>
          </div>
        </Reveal>

        <div>
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 120}>
              <div className={`py-10 ${i > 0 ? "border-t border-border" : "pt-0 lg:pt-2"}`}>
                <div className="flex items-center gap-4">
                  <span className={`mono inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[.08em] ${step.chipClass}`}>
                    <ArrowRight className="h-3.5 w-3.5" />
                    {step.chip}
                  </span>
                  <span className="mono text-[11px] text-[var(--subtle)]">STEP {step.number}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-[460px] text-base leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
