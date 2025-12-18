'use client'

import { Zap, Shield, Globe, BarChart3, Smartphone, Code2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: "Instant Integration",
    description: "Drop our SDK into your app and start showing surveys in less than 5 minutes.",
    className: "md:col-span-2 lg:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and fraud detection to protect your revenue streams.",
    className: "md:col-span-1 lg:col-span-1",
    gradient: "from-primary/20 to-amber-600/20 text-primary"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Monetize users from 180+ countries with localized survey inventory.",
    className: "md:col-span-1 lg:col-span-1",
    gradient: "from-green-500/20 to-emerald-500/20 text-green-600"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track every impression, click, and conversion as it happens in our live dashboard.",
    className: "md:col-span-2 lg:col-span-2",
    gradient: "from-orange-500/20 to-red-500/20 text-orange-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Responsive design that looks perfect on any device, from phones to desktops.",
    className: "md:col-span-1 lg:col-span-1",
    gradient: "from-rose-500/20 to-pink-500/20 text-rose-600"
  },
]

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need to <span className="text-primary">scale revenue</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Built for developers, by developers. We provide the tools you need to monetize effectively without compromising user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${feature.className}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.gradient.split(' ')[0]}`}></div>
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
