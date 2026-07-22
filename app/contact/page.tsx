import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/landing/reveal";

export const metadata: Metadata = {
  title: "Contact Rebolabs Support",
  description: "Contact Rebolabs for publisher support, integration help, payout questions, partnerships, and postback troubleshooting.",
  alternates: { canonical: "https://rebolabs.ai/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="hero-wash pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[560px] px-4 text-center sm:px-0">
          <Reveal>
            <div className="section-label">Contact</div>
            <h1 className="display mx-auto mt-4 max-w-[440px] text-5xl text-foreground sm:text-[52px]">
              Talk to <span className="hl">the team.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[380px] text-base leading-relaxed text-muted-foreground">
              Questions about integration, payouts, or your account? Send us a note.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 text-left">
            <ContactForm />
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-sm text-muted-foreground">
              Prefer email?{" "}
              <a href="mailto:support@rebolabs.com" className="font-semibold text-foreground hover:opacity-70">
                support@rebolabs.com
              </a>{" "}
              — most replies land within one business day.
            </p>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
