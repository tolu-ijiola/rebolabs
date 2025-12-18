import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { IntegrationDemo } from '@/components/landing/integration-demo'
import { RevenueCalculator } from '@/components/revenue-calculator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ReboLabs - Monetize Your App or Website with Surveys | Start Earning Today',
  description: 'Turn your users into revenue with ReboLabs. Easily add surveys to your app or website and start earning passive income. Trusted by 100+ developers with 99.9% uptime.',
  keywords: 'monetization, surveys, passive income, app monetization, website monetization, developer tools, revenue generation',
  openGraph: {
    title: 'ReboLabs - Monetize Your App or Website with Surveys',
    description: 'Turn your users into revenue with ReboLabs. Start earning passive income today.',
    type: 'website',
    url: 'https://rebolabs.com',
    siteName: 'ReboLabs',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'ReboLabs Dashboard Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReboLabs - Monetize Your App or Website with Surveys',
    description: 'Turn your users into revenue with ReboLabs. Start earning passive income today.',
    images: ['/hero.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rebolabs.com'
  }
}

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Integration Demo Section */}
        <IntegrationDemo />

        {/* Revenue Calculator Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="calculator-heading">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="calculator-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Calculate Your <span className="text-primary">Potential Earnings</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how much you could earn by adding ReboLabs surveys to your platform. Our calculator helps you estimate monthly and yearly revenue.
              </p>
            </div>
            
            <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl animate-fadeIn">
              <RevenueCalculator />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-700 z-0"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="animate-fadeIn">
              <h2 id="cta-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to Start <span className="text-white/90">Monetizing</span>?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                Join thousands of developers who are already earning passive income with ReboLabs. 
                Start your journey to financial freedom today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
                    Get Started For Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-10 py-6 text-lg font-bold rounded-full border-2 border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40 backdrop-blur-sm transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-white/90">
                {[
                  { icon: Shield, text: "Bank-level Security" },
                  { icon: Clock, text: "5-Minute Setup" },
                  { icon: Star, text: "4.9/5 Rating" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
