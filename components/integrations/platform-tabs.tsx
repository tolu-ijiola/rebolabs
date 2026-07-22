"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const snippets = {
  iframe: `<iframe
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  width="100%"
  height="800"
  frameborder="0"
  style="border:0;border-radius:8px"
  allow="payment; fullscreen"
></iframe>`,
  rn: `import { WebView } from 'react-native-webview';

const APP_ID = 'YOUR_APP_ID';
const USER_ID = currentUser.id;

export function RewardWallScreen() {
  const uri = \`https://wall.rebolabs.ai/?app_id=\${APP_ID}&user_id=\${USER_ID}\`;
  return <WebView source={{ uri }} javaScriptEnabled domStorageEnabled />;
}`,
  android: `val webView = findViewById<WebView>(R.id.rewardWebView)
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.webViewClient = WebViewClient()

val appId = "YOUR_APP_ID"
val userId = currentUser.id
webView.loadUrl("https://wall.rebolabs.ai/?app_id=$appId&user_id=$userId")`,
  ios: `struct RewardWallView: UIViewRepresentable {
    let appId: String
    let userId: String

    func makeUIView(context: Context) -> WKWebView { WKWebView() }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let url = "https://wall.rebolabs.ai/?app_id=\\(appId)&user_id=\\(userId)"
        webView.load(URLRequest(url: URL(string: url)!))
    }
}`,
};

const labels: Record<SnippetKey, string> = {
  iframe: "Web iframe",
  rn: "React Native",
  android: "Android",
  ios: "iOS",
};

type SnippetKey = keyof typeof snippets;

export function PlatformTabs() {
  const [active, setActive] = useState<SnippetKey>("iframe");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(snippets[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="ink-panel overflow-hidden rounded-2xl shadow-[0_24px_64px_rgba(8,12,10,.25)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#263029] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex flex-wrap gap-1 sm:ml-4">
          {(Object.keys(snippets) as SnippetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`mono rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                active === key ? "bg-[#263029] text-[#f2f7f4]" : "text-[#6f8177] hover:text-[#9db0a5]"
              }`}
            >
              {labels[key]}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#6f8177] transition-colors hover:bg-[#263029] hover:text-[#f2f7f4]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mono min-h-[280px] overflow-x-auto p-6 text-sm leading-relaxed text-[#d7e2db]">{snippets[active]}</pre>
    </div>
  );
}
