'use client'

import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Heart, Users, Video, TrendingUp, ArrowRight, Play, Menu } from 'lucide-react'
import Link from 'next/link'

export default function LiveShoppingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">*</span>
            </div>
            <span className="text-sm text-muted-foreground">hello@reel.ai</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Customer Stories
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Resources
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-lg">
              Book A Demo
            </Button>
            <Button size="sm" className="rounded-lg">
              Get Started
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  AI-Powered Conversion Boost Product{' '}
                  <span className="text-primary">4x</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  From concept to conversion - manage thousands of successful influencers ads seamlessly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button size="default" className="rounded-lg">
                    Download Free App
                  </Button>
                  <Button variant="outline" size="default" className="rounded-lg">
                    Get Started Free
                  </Button>
                </div>
              </div>

              {/* Right Column - Phone Mockup */}
              <div className="relative">
                <div className="relative mx-auto max-w-xs">
                  {/* Phone Frame */}
                  <div className="relative bg-card border-8 border-foreground rounded-[2.5rem] p-3 shadow-xl">
                    <div className="bg-background rounded-[2rem] overflow-hidden aspect-[9/19]">
                      <div className="h-full bg-gradient-to-b from-primary/10 to-background p-4 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center">
                              <Users className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                              <span className="text-xs font-semibold text-foreground">Wade Warren</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Live</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute -left-6 top-1/4 bg-card border border-border rounded-lg p-2.5 shadow-lg animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">2:01</div>
                        <div className="text-xs text-muted-foreground">Timer</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-6 top-1/2 bg-card border border-border rounded-lg p-2.5 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">8 items</div>
                        <div className="text-xs text-muted-foreground">Sold this week</div>
                        <div className="text-xs font-bold text-primary mt-0.5">$12</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-3 bottom-1/4 bg-card border border-border rounded-lg p-2.5 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">1.5k</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Bar */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-3 shadow-lg w-56">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Engagement</span>
                        <span className="text-xs font-bold text-primary">40%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-primary rounded-full h-1.5" style={{ width: '40%' }}></div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loved by Brands */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-semibold text-muted-foreground mb-6 uppercase tracking-wide">Loved by brands</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-60">
              {['HEIRESS', 'TOZO', 'HELL BABES', 'cocokind', 'Oxyfresh', 'DOT&KEY', 'Skupbag', 'Bellefit', 'AMAZING LACE'].map((brand, i) => (
                <div key={i} className="text-xs font-semibold text-foreground/60">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Shopping Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  SELL LIKE A PRO
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  Take your live shopping events to the level.
                </h2>
                
                {/* Stats Card */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Hosts</p>
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs font-semibold text-foreground">+4</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">
                      + Add host
                    </Button>
                  </div>
                  
                  {/* Product Card */}
                  <div className="bg-secondary rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">Nike Flex Experience</h3>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-primary mt-1">Rs. 4,995.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-lg font-bold text-foreground">1.5M</p>
                      <p className="text-xs text-muted-foreground">Orders placed</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">137M</p>
                      <p className="text-xs text-muted-foreground">Video views</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  Step 1
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  Invite multiple hosts
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Go live with multiple hosts from around the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Interface Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - App Preview */}
              <div className="relative">
                <div className="bg-card border-4 border-foreground rounded-xl p-4 shadow-xl max-w-xs mx-auto">
                  <div className="bg-background rounded-lg overflow-hidden">
                    {/* App Header */}
                    <div className="bg-foreground text-background px-3 py-2 flex items-center justify-between rounded-t-lg">
                      <span className="text-xs font-semibold">Reelup Live APP</span>
                      <span className="text-xs">5:41 PM</span>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Nike Runner series</span>
                      </div>
                      
                      {/* Product Card */}
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">Nike Flex Runner 3</h3>
                            <p className="text-xs font-bold text-primary">$16.65 USD</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>24K views</span>
                          <span>•</span>
                          <span>2X Engagement</span>
                        </div>
                      </div>

                      {/* Social Platforms */}
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Going Live on</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                            <Video className="w-4 h-4 text-pink-600" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  Step 3
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  Go live everywhere at once.
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Loaded with an array of captivating widgets designed to showcase interactive shopping videos on your store, including video carousels, Instagram-style stories, pop-ups, video grids, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Benchmarks */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Stats */}
              <div className="space-y-6">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground mb-6">
                    ReelUp ranks No.1 app on the Shopify app store.
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">6 million</p>
                      <p className="text-sm text-muted-foreground">Projected global nursing shortage by 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">31%</p>
                      <p className="text-sm text-muted-foreground">Decrease in life expectancy after a fall</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">29 million</p>
                      <p className="text-sm text-muted-foreground">Falls per year (Aged 65 years)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Image Placeholder */}
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Rankings */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Ranked #1 social media
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Loaded with an array of captivating widgets designed to showcase.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              {/* Social Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-3">
                    <Video className="w-8 h-8 text-pink-600" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">89%</p>
                  <p className="text-xs text-muted-foreground">Instagram</p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-foreground" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">72%</p>
                  <p className="text-xs text-muted-foreground">TikTok</p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">79%</p>
                  <p className="text-xs text-muted-foreground">Facebook</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  OUR BLOGS
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  The latest from our blog.
                </h2>
              </div>
              
              {/* Blog Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'The Future of Live Shopping',
                    date: 'March 15, 2024',
                    readTime: '5 min read',
                    image: 'bg-gradient-to-br from-primary/20 to-accent/20'
                  },
                  {
                    title: 'THE WILD OF FAITH',
                    date: 'March 10, 2024',
                    readTime: '7 min read',
                    image: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                  },
                  {
                    title: 'Building Community Through Commerce',
                    date: 'March 5, 2024',
                    readTime: '4 min read',
                    image: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
                  }
                ].map((post, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className={`aspect-video ${post.image} flex items-center justify-center`}>
                      <Video className="w-12 h-12 text-primary/40" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-foreground">{post.title}</h3>
                      <Link href="#" className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                        Read Story <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Ready to boost your conversions?
            </h2>
            <p className="text-sm md:text-base text-white/90">
              Join thousands of brands already using our platform to drive sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="default" className="bg-white text-primary hover:bg-white/90 rounded-lg">
                Get Started Free
              </Button>
              <Button variant="outline" size="default" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-lg">
                Book A Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            <p>© 2024 Reel.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}







