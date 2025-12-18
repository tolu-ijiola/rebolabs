'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth-context'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      setError(signInError || 'An error occurred')
    } else {
      router.push('/dashboard')
    }
    
    setIsLoading(false)
  }

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-background flex">
        {/* Left Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <Link href={'/'} className="inline-block transition-opacity hover:opacity-80">
                <Image src="/logo.svg" alt="ReboLabs" className="w-32 sm:w-40" width={160} height={40} />
              </Link>
              
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Welcome Back
                </h1>
                <p className="text-base text-muted-foreground">
                  Sign in to your ReboLabs account
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-primary border-primary' 
                        : 'bg-card border-border group-hover:border-primary/50'
                    }`}>
                      {rememberMe && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-foreground/70">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  href="/signup"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </p>
            </div>

          
        </div>
      </div>

        {/* Right Section - Auth Image */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 relative justify-center overflow-hidden border-l border-border">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          {/* Central Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-8 sm:p-12">
            <div className='animate-fadeIn w-full max-w-lg rounded-xl flex items-center justify-center'>
              <Image src="/auth.png" alt="ReboLabs Authentication" className="w-full h-full object-contain drop-shadow-2xl" width={1000} height={1000} />
            </div>
          </div>
        </div>

      {/* Mobile Theme Toggle */}
      <div className="fixed top-4 right-4 lg:hidden">
        <ThemeToggle />
      </div>
      </div>
    </ProtectedRoute>
  )
}
