'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Globe, Smartphone, Code, Shield, Copy, Check } from 'lucide-react'

const integrationMethods = [
  {
    id: 'iframe',
    title: 'Iframe Integration',
    description: 'Quick and simple - just embed a link in an iframe tag. Perfect for web applications.',
    icon: Globe,
    difficulty: 'Easy',
    time: '5 minutes'
  },
  {
    id: 'react-native',
    title: 'React Native Integration',
    description: 'Use WebView to display surveys in your React Native mobile apps. Works on iOS and Android.',
    icon: Smartphone,
    difficulty: 'Medium',
    time: '10 minutes'
  },
  {
    id: 'android',
    title: 'Android Integration',
    description: 'Native Android WebView implementation. Available in both Java and Kotlin.',
    icon: Code,
    difficulty: 'Medium',
    time: '15 minutes'
  }
]

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState('')
  const iframeRef = useRef<HTMLDivElement>(null)
  const reactNativeRef = useRef<HTMLDivElement>(null)
  const androidRef = useRef<HTMLDivElement>(null)
  const postbackRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const refs = {
      iframe: iframeRef,
      'react-native': reactNativeRef,
      android: androidRef,
      postback: postbackRef
    }
    
    const ref = refs[sectionId as keyof typeof refs]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const filteredMethods = integrationMethods.filter(method =>
    method.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    method.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integration Documentation</h1>
          <p className="text-muted-foreground">Choose your integration method and follow the implementation guide</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search integration methods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-lg border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Integration Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredMethods.map((method) => (
          <Card 
            key={method.id} 
            className="bg-card border-border hover:shadow-xl transition-all cursor-pointer hover:border-primary/50 hover:scale-[1.02] group"
            onClick={() => scrollToSection(method.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-200">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <Badge variant="secondary" className="text-xs font-medium">{method.difficulty}</Badge>
                  <Badge variant="outline" className="text-xs font-medium">{method.time}</Badge>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{method.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{method.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Iframe Integration */}
      <div ref={iframeRef} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl text-foreground">Iframe Integration</CardTitle>
            </div>
            <p className="text-muted-foreground">Easily embed surveys in your website using iframe</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">1. Basic Implementation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Simply embed the survey link in an iframe tag:
              </p>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`<iframe 
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="payment; fullscreen"
></iframe>`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<iframe 
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="payment; fullscreen"
></iframe>`, 'iframe-basic')}
                >
                  {copiedCode === 'iframe-basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">2. Responsive Implementation</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe 
    src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="payment; fullscreen"
  ></iframe>
</div>`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe 
    src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="payment; fullscreen"
  ></iframe>
</div>`, 'iframe-responsive')}
                >
                  {copiedCode === 'iframe-responsive' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">3. Parameters</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <code className="text-sm">app_id</code>
                  <span className="text-sm text-muted-foreground">Your app ID (required)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <code className="text-sm">user_id</code>
                  <span className="text-sm text-muted-foreground">Unique user identifier (required)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <code className="text-sm">theme</code>
                  <span className="text-sm text-muted-foreground">light, dark, or auto (optional)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* React Native Integration */}
      <div ref={reactNativeRef} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl text-foreground">React Native Integration</CardTitle>
            </div>
            <p className="text-muted-foreground">Integrate surveys in your React Native application using WebView</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">1. Installation</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground">npm install react-native-webview</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('npm install react-native-webview', 'rn-install')}
                >
                  {copiedCode === 'rn-install' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">2. Basic Implementation</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`import React from 'react';
import { WebView } from 'react-native-webview';

export default function SurveyScreen() {
  const surveyUrl = 'https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID';
  
  return (
    <WebView
      source={{ uri: surveyUrl }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  );
}`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`import React from 'react';
import { WebView } from 'react-native-webview';

export default function SurveyScreen() {
  const surveyUrl = 'https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID';
  
  return (
    <WebView
      source={{ uri: surveyUrl }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  );
}`, 'rn-basic')}
                >
                  {copiedCode === 'rn-basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">3. With Navigation Events</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

export default function SurveyScreen() {
  const surveyUrl = 'https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID';
  const [loading, setLoading] = React.useState(true);
  
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: surveyUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      {loading && (
        <ActivityIndicator
          style={{ position: 'absolute', top: '50%', left: '50%' }}
          size="large"
        />
      )}
    </View>
  );
}`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

export default function SurveyScreen() {
  const surveyUrl = 'https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID';
  const [loading, setLoading] = React.useState(true);
  
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: surveyUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      {loading && (
        <ActivityIndicator
          style={{ position: 'absolute', top: '50%', left: '50%' }}
          size="large"
        />
      )}
    </View>
  );
}`, 'rn-advanced')}
                >
                  {copiedCode === 'rn-advanced' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Android SDK Integration */}
      <div ref={androidRef} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl text-foreground">Android Integration</CardTitle>
            </div>
            <p className="text-muted-foreground">Native Android integration using WebView</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">1. Add Internet Permission</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`<!-- In AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<!-- In AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />`, 'android-permission')}
                >
                  {copiedCode === 'android-permission' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">2. Java Implementation</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`// In your Activity
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        String surveyUrl = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID";
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl(surveyUrl);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// In your Activity
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        String surveyUrl = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID";
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl(surveyUrl);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`, 'android-java')}
                >
                  {copiedCode === 'android-java' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">3. Kotlin Implementation</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`// In your Activity
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        webView = findViewById(R.id.webview)
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        
        val surveyUrl = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
        webView.webViewClient = WebViewClient()
        webView.loadUrl(surveyUrl)
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// In your Activity
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        webView = findViewById(R.id.webview)
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        
        val surveyUrl = "https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
        webView.webViewClient = WebViewClient()
        webView.loadUrl(surveyUrl)
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`, 'android-kotlin')}
                >
                  {copiedCode === 'android-kotlin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">4. Layout XML</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`<!-- In your layout XML (activity_main.xml) -->
<WebView
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<!-- In your layout XML (activity_main.xml) -->
<WebView
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`, 'android-layout')}
                >
                  {copiedCode === 'android-layout' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Postback Security */}
      <div ref={postbackRef} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl text-foreground">Postback Security</CardTitle>
            </div>
            <p className="text-muted-foreground">Secure your callbacks with hash validation</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">How Postbacks Work</h4>
              <p className="text-muted-foreground mb-4">
                When a user completes a survey, we send a POST request to your callback URL with survey data and a security hash.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold text-foreground mb-2">Callback URL Example:</h5>
                <code className="text-sm text-foreground break-all">
                  https://yourdomain.com/api/callback?uid=user123&val=2.50&raw=2.00&tx=tx_abc123&type=COMPLETE&hash=abc123def456
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">Callback Parameters</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">uid</code>
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">val</code>
                  <span className="text-sm text-muted-foreground">Reward in app currency</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">raw</code>
                  <span className="text-sm text-muted-foreground">Raw payment in USD</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">tx</code>
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">type</code>
                  <span className="text-sm text-muted-foreground">COMPLETE, SCREENOUT, etc.</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
                  <code className="text-sm font-semibold">hash</code>
                  <span className="text-sm text-muted-foreground">SHA1 HMAC for validation</span>
                  <span className="text-sm text-muted-foreground">Required</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">Hash Validation (Node.js)</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`const crypto = require('crypto');

function validateCallbackHash(url, secretKey) {
  // Split URL at hash parameter
  const splitUrl = url.split('&hash=');
  if (splitUrl.length !== 2) {
    return false;
  }
  
  // Create HMAC with secret key
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.write(splitUrl[0]); // URL without hash
  hmac.end();
  
  // Compare hashes
  const expectedHash = hmac.read().toString('hex');
  return splitUrl[1] === expectedHash;
}

// Usage in your callback handler
app.post('/api/callback', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const secretKey = process.env.CALLBACK_SECRET;
  
  if (!validateCallbackHash(fullUrl, secretKey)) {
    return res.status(401).json({ error: 'Invalid hash' });
  }
  
  // Process callback...
  res.json({ success: true });
});`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`const crypto = require('crypto');

function validateCallbackHash(url, secretKey) {
  // Split URL at hash parameter
  const splitUrl = url.split('&hash=');
  if (splitUrl.length !== 2) {
    return false;
  }
  
  // Create HMAC with secret key
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.write(splitUrl[0]); // URL without hash
  hmac.end();
  
  // Compare hashes
  const expectedHash = hmac.read().toString('hex');
  return splitUrl[1] === expectedHash;
}

// Usage in your callback handler
app.post('/api/callback', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const secretKey = process.env.CALLBACK_SECRET;
  
  if (!validateCallbackHash(fullUrl, secretKey)) {
    return res.status(401).json({ error: 'Invalid hash' });
  }
  
  // Process callback...
  res.json({ success: true });
});`, 'hash-validation')}
                >
                  {copiedCode === 'hash-validation' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">Hash Validation (PHP)</h4>
              <div className="bg-muted p-4 rounded-lg relative">
                <code className="text-sm text-foreground whitespace-pre-wrap">
{`<?php
function validateCallbackHash($url, $secretKey) {
    // Split URL at hash parameter
    $parts = explode('&hash=', $url);
    if (count($parts) !== 2) {
        return false;
    }
    
    // Create HMAC with secret key
    $expectedHash = hash_hmac('sha1', $parts[0], $secretKey);
    
    // Compare hashes
    return $parts[1] === $expectedHash;
}

// Usage in your callback handler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $secretKey = $_ENV['CALLBACK_SECRET'];
    
    if (!validateCallbackHash($fullUrl, $secretKey)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid hash']);
        exit;
    }
    
    // Process callback...
    echo json_encode(['success' => true]);
}
?>`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<?php
function validateCallbackHash($url, $secretKey) {
    // Split URL at hash parameter
    $parts = explode('&hash=', $url);
    if (count($parts) !== 2) {
        return false;
    }
    
    // Create HMAC with secret key
    $expectedHash = hash_hmac('sha1', $parts[0], $secretKey);
    
    // Compare hashes
    return $parts[1] === $expectedHash;
}

// Usage in your callback handler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $secretKey = $_ENV['CALLBACK_SECRET'];
    
    if (!validateCallbackHash($fullUrl, $secretKey)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid hash']);
        exit;
    }
    
    // Process callback...
    echo json_encode(['success' => true]);
}
?>`, 'hash-validation-php')}
                >
                  {copiedCode === 'hash-validation-php' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Security Warning</h5>
              <p className="text-sm text-yellow-700">
                Always validate the hash to ensure callbacks are from us. Never process callbacks without hash validation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
