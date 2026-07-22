"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const snippets = {
  node: `import crypto from 'crypto';

function isValidCallback(fullUrl: string, serverKey: string): boolean {
  const url = new URL(fullUrl);
  const receivedHash = url.searchParams.get('hash');
  if (!receivedHash) return false;

  url.searchParams.delete('hash');
  const expected = crypto
    .createHmac('sha1', serverKey)
    .update(url.toString())
    .digest('hex');

  const a = Buffer.from(receivedHash);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Express handler for your Reward Callback URL
app.get('/reward-callback', (req, res) => {
  const fullUrl = \`\${req.protocol}://\${req.get('host')}\${req.originalUrl}\`;

  if (!isValidCallback(fullUrl, process.env.REBO_SERVER_KEY!)) {
    return res.status(401).send('INVALID_HASH');
  }

  const { uid, tx, type, val } = req.query;
  const [appId, userId] = String(uid).split('--');

  if (await alreadyProcessed(tx as string)) {
    return res.status(200).send('OK'); // already credited, ignore
  }

  if (type === 'COMPLETE') {
    await creditUser(userId, Number(val));
  }

  await recordTransaction(tx as string);
  res.status(200).send('OK');
});`,
  php: `<?php
function isValidCallback(string $fullUrl, string $serverKey): bool {
    $parts = explode('&hash=', $fullUrl);
    if (count($parts) !== 2) return false;

    $expected = hash_hmac('sha1', $parts[0], $serverKey);
    return hash_equals($expected, $parts[1]);
}

$fullUrl   = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$serverKey = $_ENV['REBO_SERVER_KEY'];

if (!isValidCallback($fullUrl, $serverKey)) {
    http_response_code(401);
    exit('INVALID_HASH');
}

[$appId, $userId] = explode('--', $_GET['uid'], 2);
$tx   = $_GET['tx'];
$type = $_GET['type'];
$val  = (float) ($_GET['val'] ?? 0);

if (alreadyProcessed($tx)) {
    exit('OK'); // already credited, ignore
}

if ($type === 'COMPLETE') {
    creditUser($userId, $val);
}

recordTransaction($tx);
echo 'OK';`,
};

type SnippetKey = keyof typeof snippets;

export function HashTabs() {
  const [active, setActive] = useState<SnippetKey>("node");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(snippets[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="ink-panel overflow-hidden rounded-2xl shadow-[0_24px_64px_rgba(8,12,10,.25)]">
      <div className="flex items-center gap-2 border-b border-[#263029] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-4 flex gap-1">
          {(["node", "php"] as SnippetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`mono rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                active === key ? "bg-[#263029] text-[#f2f7f4]" : "text-[#6f8177] hover:text-[#9db0a5]"
              }`}
            >
              {key === "node" ? "Node.js" : "PHP"}
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
      <pre className="mono min-h-[420px] overflow-x-auto p-6 text-[13px] leading-relaxed text-[#d7e2db]">{snippets[active]}</pre>
    </div>
  );
}
