'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-foreground mb-2">ReboLabs</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Empowering creators to build sustainable income streams.
            </p>
          </div>

          {/* Contact and Theme */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>hello@rebolabs.com</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 ReboLabs. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-sm">
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
