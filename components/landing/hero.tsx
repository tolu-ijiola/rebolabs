'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Play } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1s' }}></div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-secondary/50 backdrop-blur-sm border border-border px-4 py-1.5 rounded-full text-sm font-medium animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-muted-foreground">Trusted by 500+ Developers</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Monetize Your App with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600 animate-shimmer bg-[length:200%_auto]">
              Premium Surveys
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Turn your active users into sustainable revenue. Integrate our high-paying survey wall in minutes, not days. No hidden fees, just pure profit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-primary to-amber-600 border-0 text-white">
                Start Earning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-secondary/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                View Demo
                <Play className="ml-2 w-4 h-4 fill-current" />
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative mt-12 w-full max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="relative rounded-xl border border-border bg-card shadow-xl overflow-hidden group">
              {/* Browser Bar */}
              <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
                <div className="flex-1 bg-background rounded px-3 py-1 mx-4">
                  <span className="text-xs text-muted-foreground">dashboard.rebolabs.ai</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-background">
                {/* Header */}
                <div className="mb-6">
                  <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                  <div className="h-6 w-48 bg-foreground/10 rounded"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Revenue', value: '$12,450', color: 'bg-green-500/10' },
                    { label: 'Active Surveys', value: '1,240', color: 'bg-primary/10' },
                    { label: 'Avg. eCPM', value: '$125.40', color: 'bg-blue-500/10' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-3 w-20 bg-muted rounded"></div>
                        <div className={`w-8 h-8 rounded ${stat.color}`}></div>
                      </div>
                      <div className="h-6 w-24 bg-foreground/10 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="h-4 w-28 bg-muted rounded mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted"></div>
                          <div className="flex-1">
                            <div className="h-3 w-32 bg-muted rounded mb-1"></div>
                            <div className="h-2 w-24 bg-muted/50 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="h-4 w-28 bg-muted rounded mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="h-3 w-24 bg-muted rounded"></div>
                          <div className="h-3 w-16 bg-primary/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -left-4 top-1/4 bg-card backdrop-blur-md p-3 rounded-lg border border-border shadow-lg animate-float hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/10 rounded">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Avg. eCPM</p>
                    <p className="text-sm font-bold text-foreground">$125.40</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card backdrop-blur-md p-3 rounded-lg border border-border shadow-lg animate-float hidden md:block" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded">
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Live Users</p>
                    <p className="text-sm font-bold text-foreground">1,240+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
