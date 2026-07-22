'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search, Globe, Smartphone, Code, Shield, Copy, Check,
  ArrowRight, Key, Zap, DollarSign, ChevronRight, Info,
  Apple, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

const integrationMethods = [
  {
    id: 'iframe',
    title: 'Web (iframe)',
    description: 'Embed the reward offerwall directly in any webpage using a single HTML tag.',
    icon: Globe,
    difficulty: 'Easy',
    time: '5 min',
  },
  {
    id: 'react-native',
    title: 'React Native',
    description: 'Display the reward offerwall inside a WebView for iOS and Android apps.',
    icon: Smartphone,
    difficulty: 'Medium',
    time: '10 min',
  },
  {
    id: 'android',
    title: 'Android Native',
    description: 'Use Android\'s built-in WebView in Java or Kotlin.',
    icon: Code,
    difficulty: 'Medium',
    time: '15 min',
  },
  {
    id: 'ios',
    title: 'iOS Native',
    description: 'Use WKWebView in Swift or SwiftUI to load the reward offerwall.',
    icon: Apple,
    difficulty: 'Medium',
    time: '15 min',
  },
]

function CodeBlock({ code, id, copiedCode, onCopy }: {
  code: string
  id: string
  copiedCode: string
  onCopy: (code: string, id: string) => void
}) {
  return (
    <div className="relative bg-[#1e1e1e] rounded-lg overflow-hidden border border-border/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-xs text-white/40 font-mono">{id}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => onCopy(code, id)}
        >
          {copiedCode === id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="ml-1.5 text-xs">{copiedCode === id ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-[#d4d4d4] font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

function ParamRow({ name, type, required, description }: {
  name: string
  type: string
  required: boolean
  description: string
}) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start py-3 border-b border-border/50 last:border-0">
      <div className="col-span-3">
        <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{name}</code>
      </div>
      <div className="col-span-2">
        <span className="text-xs text-muted-foreground font-mono">{type}</span>
      </div>
      <div className="col-span-2">
        {required ? (
          <Badge className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">Required</Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">Optional</Badge>
        )}
      </div>
      <div className="col-span-5 text-sm text-muted-foreground">{description}</div>
    </div>
  )
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState('')
  const iframeRef = useRef<HTMLDivElement>(null)
  const reactNativeRef = useRef<HTMLDivElement>(null)
  const androidRef = useRef<HTMLDivElement>(null)
  const iosRef = useRef<HTMLDivElement>(null)
  const postbackRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      iframe: iframeRef,
      'react-native': reactNativeRef,
      android: androidRef,
      ios: iosRef,
      postback: postbackRef,
    }
    refs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const filteredMethods = integrationMethods.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-10 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integration Guide</h1>
        <p className="text-muted-foreground mt-1">Everything you need to embed ReboLabs reward offers into your app or website.</p>
      </div>

      {/* How it works */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Key className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">1. Get your App ID</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a project in the{' '}
                  <Link href="/dashboard/projects" className="text-primary hover:underline">Projects</Link>
                  {' '}page. Each project gets a unique App ID used to identify your integration.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Code className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">2. Embed the reward offerwall</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Load <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">wall.rebolabs.ai</code> with your App ID and a unique user ID in a WebView or iframe. Users complete reward offers directly in your app.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">3. Earn & get paid</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Every reward offer completed earns revenue. We send a postback to your server when a user completes one, so you can reward them in real time. Payouts are processed monthly on Net 30 terms.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border flex items-start gap-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">The reward offerwall URL format:</strong>{' '}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=YOUR_USER_ID
              </code>
              <br />
              Replace <code className="font-mono text-xs">YOUR_APP_ID</code> with the ID from your project, and <code className="font-mono text-xs">YOUR_USER_ID</code> with your platform's unique identifier for the logged-in user.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search integration methods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Integration Method Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMethods.map((method) => (
          <Card
            key={method.id}
            className="bg-card border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => scrollToSection(method.id)}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <method.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{method.title}</h3>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">{method.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{method.time}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── IFRAME ─────────────────────────────────────────────── */}
      <div ref={iframeRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Web (iframe) Integration</h2>
        </div>
        <p className="text-muted-foreground">
          The simplest way to embed reward offers. Paste one HTML tag anywhere in your webpage.
          Works with any web framework — plain HTML, React, Vue, etc.
        </p>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Basic embed</p>
              <CodeBlock
                id="index.html"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`<iframe
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="payment; fullscreen"
></iframe>`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Responsive wrapper</p>
              <p className="text-sm text-muted-foreground mb-2">Use this if you want the iframe to fill its container height automatically.</p>
              <CodeBlock
                id="responsive.html"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`<div style="position: relative; width: 100%; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
    style="position: absolute; inset: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="payment; fullscreen"
  ></iframe>
</div>`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">URL Parameters</p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span className="col-span-3">Parameter</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2">Required</span>
                  <span className="col-span-5">Description</span>
                </div>
                <div className="px-4">
                  <ParamRow name="app_id" type="string" required description="Your project's App ID — found on the Projects page." />
                  <ParamRow name="user_id" type="string" required description="A unique, stable identifier for the current user on your platform (e.g. their database ID)." />
                  <ParamRow name="theme" type="string" required={false} description="Visual theme: light, dark, or auto. Defaults to auto (matches system preference)." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── REACT NATIVE ────────────────────────────────────────── */}
      <div ref={reactNativeRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">React Native Integration</h2>
        </div>
        <p className="text-muted-foreground">
          Use <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">react-native-webview</code> to load the reward offerwall as a full-screen view in your app.
        </p>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 1 — Install the WebView package</p>
              <CodeBlock id="terminal" copiedCode={copiedCode} onCopy={copyToClipboard} code="npm install react-native-webview" />
              <p className="text-xs text-muted-foreground mt-2">
                For Expo managed workflow: <code className="font-mono">npx expo install react-native-webview</code>
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 2 — Create a RewardWallScreen</p>
              <CodeBlock
                id="RewardWallScreen.tsx"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import React, { useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

const APP_ID = 'YOUR_APP_ID'
const USER_ID = 'current-user-id' // replace with your auth system's user ID

export default function RewardWallScreen() {
  const [loading, setLoading] = useState(true)
  const uri = \`https://wall.rebolabs.ai/?app_id=\${APP_ID}&user_id=\${USER_ID}\`

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => setLoading(false)}
        onError={(e) => console.warn('Reward offerwall error:', e.nativeEvent)}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 3 — Add to your navigation stack</p>
              <CodeBlock
                id="App.tsx"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RewardWallScreen from './RewardWallScreen'

const Stack = createNativeStackNavigator()

// Inside your navigator:
<Stack.Screen
  name="RewardWall"
  component={RewardWallScreen}
  options={{ title: 'Earn Rewards' }}
/>`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── ANDROID ─────────────────────────────────────────────── */}
      <div ref={androidRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Android Native Integration</h2>
        </div>
        <p className="text-muted-foreground">
          Use Android's built-in <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">WebView</code> widget. No extra dependencies needed.
        </p>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 1 — Add internet permission to AndroidManifest.xml</p>
              <CodeBlock
                id="AndroidManifest.xml"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`<uses-permission android:name="android.permission.INTERNET" />`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 2 — Add WebView to your layout</p>
              <CodeBlock
                id="activity_main.xml"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`<WebView
    android:id="@+id/rewardWebView"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Step 3 — Load the reward offerwall (Kotlin)</p>
              <CodeBlock
                id="MainActivity.kt"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.rewardWebView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient() // keeps navigation inside WebView

        val appId = "YOUR_APP_ID"
        val userId = "current-user-id" // your user's unique ID
        webView.loadUrl("https://wall.rebolabs.ai/?app_id=\$appId&user_id=\$userId")
    }

    override fun onBackPressed() {
        val webView = findViewById<WebView>(R.id.rewardWebView)
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Java version</p>
              <CodeBlock
                id="MainActivity.java"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = findViewById(R.id.rewardWebView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient());

        String url = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID";
        webView.loadUrl(url);
    }

    @Override
    public void onBackPressed() {
        WebView webView = findViewById(R.id.rewardWebView);
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── iOS ─────────────────────────────────────────────────── */}
      <div ref={iosRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <Apple className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">iOS Native Integration</h2>
        </div>
        <p className="text-muted-foreground">
          Use <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">WKWebView</code> — Apple's modern web view (no deprecated UIWebView).
        </p>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">SwiftUI (recommended)</p>
              <CodeBlock
                id="RewardWallView.swift"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import SwiftUI
import WebKit

struct RewardWallView: UIViewRepresentable {
    let appId: String
    let userId: String

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.configuration.preferences.javaScriptEnabled = true
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let urlString = "https://wall.rebolabs.ai/?app_id=\\(appId)&user_id=\\(userId)"
        if let url = URL(string: urlString) {
            webView.load(URLRequest(url: url))
        }
    }
}

// Usage in any SwiftUI view:
struct EarnView: View {
    var body: some View {
        RewardWallView(appId: "YOUR_APP_ID", userId: "current-user-id")
            .navigationTitle("Earn Rewards")
            .ignoresSafeArea()
    }
}`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">UIKit (Swift)</p>
              <CodeBlock
                id="RewardWallViewController.swift"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import UIKit
import WebKit

class RewardWallViewController: UIViewController {

    private let webView = WKWebView()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Earn Rewards"

        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])

        let appId = "YOUR_APP_ID"
        let userId = "current-user-id" // your user's unique ID
        let urlString = "https://wall.rebolabs.ai/?app_id=\\(appId)&user_id=\\(userId)"
        if let url = URL(string: urlString) {
            webView.load(URLRequest(url: url))
        }
    }
}`}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground flex gap-3">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Make sure <strong className="text-foreground">App Transport Security</strong> allows HTTPS connections. Since the reward offerwall uses HTTPS, no special ATS exceptions are needed.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── POSTBACK / SECURITY ─────────────────────────────────── */}
      <div ref={postbackRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Postback & Security</h2>
        </div>
        <p className="text-muted-foreground">
          When a user completes a reward offer, we send a <strong className="text-foreground">GET request</strong> to your callback URL with the reward details and a security hash.
          Validate this hash before crediting the user.
        </p>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Example callback received by your server</p>
              <CodeBlock
                id="callback-example.txt"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code="GET https://yourdomain.com/api/callback?uid=user123&val=2.50&raw=2.00&tx=tx_abc123&type=COMPLETE&hash=abc123def456"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Callback parameters</p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span className="col-span-2">Param</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-6">Description</span>
                </div>
                <div className="px-4">
                  <ParamRow name="uid" type="string" required description="The user_id you passed when loading the reward offerwall — use this to identify who to credit." />
                  <ParamRow name="val" type="number" required description="Reward amount in your app's virtual currency (e.g. coins, points)." />
                  <ParamRow name="raw" type="number" required description="Raw payment amount in USD before any conversion." />
                  <ParamRow name="tx" type="string" required description="Unique transaction ID. Store this to prevent duplicate credits." />
                  <ParamRow name="type" type="string" required description="Completion type: COMPLETE (full), SCREENOUT (disqualified), or QUOTAFULL." />
                  <ParamRow name="hash" type="string" required description="SHA-1 HMAC signature. Always validate this before processing." />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Hash validation — Node.js / TypeScript</p>
              <CodeBlock
                id="callback.ts"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`import crypto from 'crypto'

function isValidCallback(fullUrl: string, secret: string): boolean {
  // URL must contain &hash= exactly once
  const parts = fullUrl.split('&hash=')
  if (parts.length !== 2) return false

  const expected = crypto
    .createHmac('sha1', secret)
    .update(parts[0])
    .digest('hex')

  return parts[1] === expected
}

// Express example
app.get('/api/callback', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl

  if (!isValidCallback(fullUrl, process.env.CALLBACK_SECRET!)) {
    return res.status(401).json({ error: 'Invalid hash' })
  }

  const { uid, val, tx, type } = req.query

  // Prevent duplicate processing
  if (await transactionExists(tx as string)) {
    return res.json({ status: 'already_processed' })
  }

  // Only credit users for completed reward offers
  if (type === 'COMPLETE') {
    await creditUser(uid as string, parseFloat(val as string))
    await recordTransaction(tx as string)
  }

  res.json({ status: 'ok' })
})`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Hash validation — PHP</p>
              <CodeBlock
                id="callback.php"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
                code={`<?php
function isValidCallback(string $fullUrl, string $secret): bool {
    $parts = explode('&hash=', $fullUrl);
    if (count($parts) !== 2) return false;

    $expected = hash_hmac('sha1', $parts[0], $secret);
    return hash_equals($expected, $parts[1]);
}

$fullUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$secret  = $_ENV['CALLBACK_SECRET'];

if (!isValidCallback($fullUrl, $secret)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid hash']);
    exit;
}

$uid  = $_GET['uid'];
$val  = (float) $_GET['val'];
$tx   = $_GET['tx'];
$type = $_GET['type'];

// Only credit on full completion
if ($type === 'COMPLETE') {
    creditUser($uid, $val);
    recordTransaction($tx);
}

echo json_encode(['status' => 'ok']);`}
              />
            </div>

            <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Security checklist</p>
                <ul className="text-amber-800 dark:text-amber-300 space-y-1">
                  <li><ArrowRight className="inline w-3 h-3 mr-1" />Always validate the hash — never skip it.</li>
                  <li><ArrowRight className="inline w-3 h-3 mr-1" />Store the <code className="font-mono text-xs">tx</code> transaction ID and reject duplicates to prevent double-crediting.</li>
                  <li><ArrowRight className="inline w-3 h-3 mr-1" />Keep your <code className="font-mono text-xs">CALLBACK_SECRET</code> in an environment variable — never hardcode it.</li>
                  <li><ArrowRight className="inline w-3 h-3 mr-1" />Only credit users when <code className="font-mono text-xs">type === 'COMPLETE'</code>.</li>
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  )
}
