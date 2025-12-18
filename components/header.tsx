"use client";

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, User } from 'lucide-react'
import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-700/20 dark:border-amber-900 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.svg" alt="ReboLabs" className="w-32 md:w-40" width={160} height={40} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          
          {/* <Link
            href="#business"
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            Integrations
          </Link> */}
          
        </nav>

        {/* Right side - Auth Buttons, Theme Toggle and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="hidden md:flex">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="hidden md:flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="hidden md:block">
                <Button>
                  Get Started
                </Button>
              </Link>
            </>
          )}
          
          <ThemeToggle />
          
          {/* Mobile Menu Button - Toggles between Menu and X */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/60 hover:text-foreground hover:bg-accent/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Solid backdrop to block content underneath */}
          <div className="md:hidden fixed inset-0 top-[73px] z-[99] bg-background" />
          {/* Menu content */}
          <div className="md:hidden fixed inset-0 top-[73px] z-[100] bg-background">
            <div className="h-[calc(100vh-73px)] w-full overflow-y-auto bg-background">
            <div className="px-4 py-8 space-y-6">
              <nav className="space-y-1">
                <Link
                  href="/projects"
                  className="block py-3 px-4 text-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  href="#business"
                  className="block py-3 px-4 text-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link
                  href="#pricing"
                  className="block py-3 px-4 text-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Integrations
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-3 px-4 text-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </nav>

              {/* Mobile CTA */}
              <div className="pt-6 border-t border-border space-y-3">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
