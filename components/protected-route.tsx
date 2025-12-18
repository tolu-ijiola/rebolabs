'use client'

import { useAuth } from './auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ children, requireAuth = true, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Store the intended destination before redirecting
        const { setIntendedDestination } = useAuth()
        setIntendedDestination(pathname)
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // If user is logged in and shouldn't be on this page, redirect to dashboard
        router.push('/dashboard')
      }
    }
  }, [user, loading, requireAuth, redirectTo, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  if (!requireAuth && user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
