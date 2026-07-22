'use client'

import { useAuth } from './auth-context'
import { useAdminRole } from './use-admin-role'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface AdminRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AdminRoute({ children, redirectTo = '/dashboard' }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: roleLoading } = useAdminRole()
  const router = useRouter()
  const loading = authLoading || roleLoading

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push(redirectTo)
    }
  }, [user, loading, isAdmin, redirectTo, router])

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You must be logged in to access this page.</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access Required</h1>
          <p className="text-muted-foreground">
            You need administrator privileges to access this page. 
            Contact your system administrator if you believe this is an error.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
