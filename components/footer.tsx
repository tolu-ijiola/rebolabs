import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Revenue calculator", href: "/#calculator" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Publishers",
    links: [
      { label: "Create account", href: "/signup" },
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Contact support", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
      { label: "Cookie policy", href: "/cookie-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="rebo-container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <BrandLogo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Offerwall monetization for apps and websites. Live analytics, signed postbacks, and payouts every month.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Net 30 payouts", "Signed postbacks", "70% rev share"].map((badge) => (
                <span key={badge} className="mono rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <div className="section-label mb-4">{column.title}</div>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--subtle)]">
            © {new Date().getFullYear()} Rebolabs. All rights reserved.
          </p>
          <p className="text-xs text-[var(--subtle)]">
            Built for publishers monetizing web and mobile audiences worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
