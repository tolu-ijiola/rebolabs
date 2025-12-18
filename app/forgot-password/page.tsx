'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Mail, ArrowLeft, CheckCircle, Shield, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in-left">
          {/* Header */}
          <div className="text-center">
          <Link href={'/'} className="flex justify-center items-center">
          <Image src="/logo.svg" alt="ReboLabs" className="w-40" width={160} height={40} />
        </Link>
            
            {!isSubmitted ? (
              <>
                <h1 className="text-3xl mt-4 font-bold text-foreground mb-2">
                  Forgot Password?
                </h1>
                <p className="text-foreground/70">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mt-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Check Your Email
                </h1>
                <p className="text-foreground/70">
                  We've sent a password reset link to your email address.
                </p>
              </>
            )}
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover-lift"
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              {/* Additional Info */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Didn't receive the email?</p>
                    <p>Check your spam folder or try again with a different email address.</p>
                  </div>
                </div>
              </div>

              {/* Resend Button */}
              <Button 
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
              >
                Resend Email
              </Button>
            </div>
          )}

          {/* Links */}
          <div className="space-y-4 text-center">
            <Link 
              href="/login"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
            
            <div className="text-foreground/60">
              Don't have an account?{' '}
              <Link 
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-amber-50 from-amber-900/20 via-orange-900/20 to-primary/10 relative justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/20 via-orange-800/20 to-primary/10"></div>
        
        {/* Central Content */}
        <div className="relative z-10 flex items-center justify-center h-full  p-12">
          <div className='animate-fade-in-right w-4/5 rounded-lg flex items-center justify-center'>
            <Image src="/auth.png" alt="ReboLabs" className="w-full h-full" width={1000} height={1000} />
          </div>
        </div>
      </div>

      {/* Mobile Theme Toggle */}
      <div className="fixed top-4 right-4 lg:hidden">
        <ThemeToggle />
      </div>
    </div>
  )
}
