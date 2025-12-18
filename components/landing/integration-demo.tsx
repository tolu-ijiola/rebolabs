'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function IntegrationDemo() {
  const [copied, setCopied] = useState(false)

  const codeSnippet = `<iframe 
  src="https://wall.rebolabs.ai/?app_id=YOUR_APP_ID&user_id=USER_ID"
  style="width: 100%; height: 800px; border: none;"
  title="ReboLabs Offerwall"
></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Integration so simple, <br />
              it feels like <span className="text-primary">magic</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              No complex SDKs or heavy libraries. Just a single line of code to unlock a world of revenue. Compatible with React, Vue, Angular, or plain HTML.
            </p>
            
            <div className="space-y-4">
              {[
                "Works with any tech stack",
                "Responsive and mobile-ready",
                "Automatic localization",
                "Zero maintenance required"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Code Window */}
            <div className="rounded-xl overflow-hidden bg-[#2c1810] shadow-2xl border border-primary/20 transform transition-transform hover:scale-[1.02] duration-500">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-white/40 font-mono">integration.html</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-white/40 hover:text-white"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>

              {/* Code Content */}
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-white/90">
                  <code className="text-amber-400">&lt;iframe</code>
                  <br />
                  <span className="text-orange-300 pl-4">src</span>
                  <span className="text-white">=</span>
                  <span className="text-green-400">"https://wall.rebolabs.ai/..."</span>
                  <br />
                  <span className="text-orange-300 pl-4">style</span>
                  <span className="text-white">=</span>
                  <span className="text-green-400">"width: 100%; height: 800px..."</span>
                  <br />
                  <span className="text-orange-300 pl-4">title</span>
                  <span className="text-white">=</span>
                  <span className="text-green-400">"ReboLabs Offerwall"</span>
                  <br />
                  <code className="text-amber-400">&gt;&lt;/iframe&gt;</code>
                </pre>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
