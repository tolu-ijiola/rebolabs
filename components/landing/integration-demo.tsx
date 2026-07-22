"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Reveal } from "./reveal";

const snippets = {
  js: `npm install @rebolabs/sdk

import { Rebo } from '@rebolabs/sdk';

Rebo.init({
  appId: 'your-app-id',
  userId: user.id,
});

Rebo.showOfferwall();`,
  iframe: `<iframe
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  style="width:100%;height:800px;border:0"
/>`,
  rn: `import Rebo from '@rebolabs/react-native';

await Rebo.init({
  appId: 'your-app-id',
  userId: user.id,
});

await Rebo.showOfferwall();`,
};

type SnippetKey = keyof typeof snippets;

export function IntegrationDemo() {
  const [active, setActive] = useState<SnippetKey>("js");
  const [copied, setCopied] = useState(false);

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippets[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="paper-section section-y">
      <div className="rebo-container grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <Reveal>
          <div className="ink-panel overflow-hidden rounded-2xl shadow-[0_24px_64px_rgba(26,25,23,.18)]">
            <div className="flex items-center gap-2 border-b border-[#263029] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <div className="ml-4 flex gap-1">
                {(["js", "iframe", "rn"] as SnippetKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`mono rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                      active === key ? "bg-[#263029] text-[#7ed4a6]" : "text-[#6f8177] hover:text-[#9db0a5]"
                    }`}
                  >
                    {key === "js" ? "JavaScript" : key === "rn" ? "React Native" : "iframe"}
                  </button>
                ))}
              </div>
              <button
                onClick={copySnippet}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#6f8177] transition-colors hover:bg-[#263029] hover:text-[#f2f7f4]"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mono min-h-[340px] overflow-x-auto p-7 text-sm leading-relaxed text-[#d7e2db]">
              {snippets[active]}
            </pre>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <div className="section-label">Integration</div>
            <h2 className="display mt-4 text-5xl text-foreground sm:text-[56px]">
              Live in minutes, <span className="font-medium text-muted-foreground">not weeks.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Keep your stack exactly as it is. We handle offer routing, tracking, webhooks, and reporting. You control placement and rewards.
            </p>
            <div className="mt-8 space-y-3.5">
              {["Signed user identity", "Webhooks for reward fulfillment", "Duplicate transaction protection", "GDPR ready data handling"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                    <Check className="h-3 w-3 text-foreground" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/integrations" className="btn-paper mt-10">
              Read docs
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
