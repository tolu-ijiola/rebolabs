'use client'

import { useAuth } from './auth-context'
import { useAdminRole } from '@/components/use-admin-role'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Shield, User, Database, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function DebugAdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: roleLoading } = useAdminRole()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Admin Debug Information</h1>
          <p className="text-muted-foreground">
            Check your admin status and user information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Loading:</span>
                <span className={authLoading ? 'text-orange-500' : 'text-green-500'}>
                  {authLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>User ID:</span>
                <span className="text-sm font-mono">
                  {user?.id || 'Not logged in'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email:</span>
                <span className="text-sm">
                  {user?.email || 'Not logged in'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>User Metadata Role:</span>
                <span className="text-sm">
                  {user?.user_metadata?.role || 'Not set'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Role Loading:</span>
                <span className={roleLoading ? 'text-orange-500' : 'text-green-500'}>
                  {roleLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Is Admin:</span>
                <div className="flex items-center">
                  {roleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  ) : isAdmin ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`ml-2 ${isAdmin ? 'text-green-500' : 'text-red-500'}`}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">If you're not showing as admin:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Make sure you're logged in with the correct email: <code className="bg-muted px-1 rounded">toluijiola01@gmail.com</code></li>
                <li>Run the SQL script in Supabase to set your role to admin</li>
                <li>Check that your user exists in the <code className="bg-muted px-1 rounded">public.users</code> table</li>
                <li>Verify the role column shows <code className="bg-muted px-1 rounded">admin</code></li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">SQL to check your status:</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`SELECT id, email, role, created_at 
FROM public.users 
WHERE email = 'toluijiola01@gmail.com';`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
