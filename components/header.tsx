"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "./auth-context";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

const navLinks = [
  { label: "Features", href: "/#features", dot: "#12805c" },
  { label: "How it works", href: "/#how-it-works", dot: "#2fae7d" },
  { label: "Integrations", href: "/integrations", dot: "#7ed4a6" },
  { label: "Contact", href: "/contact", dot: "#0b3f2d" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        className={cn(
          "mx-auto flex h-18 max-w-[1080px] items-center rounded-full border border-border bg-background/85 px-6 backdrop-blur-xl transition-shadow",
          scrolled && "shadow-[0_8px_30px_rgba(23,32,27,.08)]"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <BrandLogo className="text-[15px]" markClassName="h-[22px] w-[22px]" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: link.dot }}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-1 lg:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="px-3 text-[13px] font-medium text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex h-9 items-center rounded-full bg-[var(--brand)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-strong)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 text-[13px] font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-full bg-[var(--brand)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--brand-strong)]"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 h-screen w-screen bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-screen w-[320px] max-w-[88vw] border-l border-border bg-background p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-5 ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 border-b border-border py-3 text-base text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: link.dot }} />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="btn-ink w-full">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="btn-paper w-full">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-ink w-full">
                    Create account
                  </Link>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-paper w-full">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
