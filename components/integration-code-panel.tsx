"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const snippets = {
  web: `<iframe
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  width="100%"
  height="800"
  frameborder="0"
  style="border:0;border-radius:8px"
/>`,
  react: `import { Rebo } from '@rebolabs/sdk';

Rebo.init({
  appId: 'YOUR_APP_ID',
  userId: user.id,
});

Rebo.showOfferwall();`,
  native: `const url = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID";

webView.settings.javaScriptEnabled = true;
webView.settings.domStorageEnabled = true;
webView.loadUrl(url);`,
  postback: `const expected = crypto
  .createHmac('sha1', process.env.CALLBACK_SECRET)
  .update(urlWithoutHash)
  .digest('hex');

if (hash !== expected) {
  throw new Error('Invalid callback');
}`,
};

type SnippetKey = keyof typeof snippets;

export function IntegrationCodePanel() {
  const [active, setActive] = useState<SnippetKey>("web");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(snippets[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="ink-panel overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-[#263029] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-4 flex flex-wrap gap-1">
          {(Object.keys(snippets) as SnippetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`mono rounded px-2.5 py-1 text-[11px] capitalize ${active === key ? "bg-[#263029] text-[#7ed4a6]" : "text-[#6f8177]"}`}
            >
              {key}
            </button>
          ))}
        </div>
        <button onClick={copy} className="ml-auto inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[#6f8177] hover:bg-[#263029] hover:text-[#f2f7f4]">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mono min-h-[360px] overflow-x-auto p-6 text-sm leading-relaxed text-[#d7e2db]">{snippets[active]}</pre>
    </div>
  );
}
