import { cn } from "@/lib/utils";

export function BrandLogo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-base font-semibold tracking-[-0.03em] text-foreground", className)}>
      <svg className={cn("h-[26px] w-[26px] shrink-0", markClassName)} viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="24" height="24" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 19V7h7a5 5 0 0 1 0 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 13l5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>Rebolabs</span>
    </span>
  );
}
