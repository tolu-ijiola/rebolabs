"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

const countryRates = {
  us: { label: "US / CA / UK", rpm: 7.5 },
  eu: { label: "Western Europe", rpm: 5.5 },
  global: { label: "Global mixed traffic", rpm: 3.25 },
};

type CountryRate = keyof typeof countryRates;

export function RevenueCalculator() {
  const [mau, setMau] = useState(25000);
  const [engagement, setEngagement] = useState(12);
  const [completions, setCompletions] = useState(1.4);
  const [country, setCountry] = useState<CountryRate>("global");

  const result = useMemo(() => {
    const engagedUsers = mau * (engagement / 100);
    const monthlyCompletions = engagedUsers * completions;
    const monthly = Math.round(monthlyCompletions * countryRates[country].rpm * 0.7);
    return {
      monthly,
      annual: monthly * 12,
      engagedUsers: Math.round(engagedUsers),
      monthlyCompletions: Math.round(monthlyCompletions),
    };
  }, [mau, engagement, completions, country]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rebo-card p-6 sm:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/25 bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Try it: drag the sliders
          </span>
          <span className="text-xs text-muted-foreground">Your estimate updates instantly</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(countryRates) as CountryRate[]).map((key) => (
            <button
              key={key}
              onClick={() => setCountry(key)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                country === key
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                  : "border-border bg-secondary text-muted-foreground hover:border-[var(--brand)] hover:text-foreground"
              }`}
            >
              {countryRates[key].label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          <Range label="Monthly active users" value={mau} min={1000} max={500000} step={1000} display={mau.toLocaleString()} onChange={setMau} />
          <Range label="Users who open rewards" value={engagement} min={2} max={45} step={1} display={`${engagement}%`} onChange={setEngagement} />
          <Range label="Completed offers per engaged user" value={completions} min={0.2} max={5} step={0.1} display={completions.toFixed(1)} onChange={setCompletions} />
        </div>
      </div>

      <aside className="ink-panel flex flex-col justify-between rounded-xl p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="animate-pulse-soft h-2 w-2 rounded-full bg-[#7ed4a6]" />
            <span className="section-label text-[#6f8177]">Live estimate</span>
          </div>
          <div className="mono mt-6 text-5xl font-semibold leading-none text-[#f2f7f4] [font-variant-numeric:tabular-nums]">
            ${result.monthly.toLocaleString()}
          </div>
          <p className="mt-2 text-sm text-[#6f8177]">what you could earn every month</p>
          <div className="mt-8 space-y-4">
            <Metric label="Per year" value={`$${result.annual.toLocaleString()}`} />
            <Metric label="Engaged users" value={result.engagedUsers.toLocaleString()} />
            <Metric label="Completed offers" value={result.monthlyCompletions.toLocaleString()} />
            <Metric label="Paid out" value="Monthly, Net 30" />
          </div>
        </div>
        <Link href="/signup" className="btn-light mt-8">
          Start earning
        </Link>
      </aside>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="block">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="mono rounded-full border border-[var(--brand)]/25 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-ink)] [font-variant-numeric:tabular-nums]">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="slider h-2 w-full appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--brand) 0%, var(--brand) ${progress}%, var(--border) ${progress}%, var(--border) 100%)`,
        }}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
      <span className="text-sm text-[#6f8177]">{label}</span>
      <span className="mono text-sm text-[#f2f7f4]">{value}</span>
    </div>
  );
}
