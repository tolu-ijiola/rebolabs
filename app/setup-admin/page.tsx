'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function SetupAdminPage() {
  const [email, setEmail] = useState('toluijiola01@gmail.com')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSetAdmin = async () => {
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          role: 'admin'
        }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Admin privileges granted successfully!')
      } else {
        const errorData = await response.json()
        setStatus('error')
        setMessage(errorData.error || 'Failed to set admin privileges')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-3xl font-bold text-foreground">Setup Admin Access</h1>
          </div>
          <p className="text-muted-foreground">
            Grant administrator privileges to your email address
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleSetAdmin}
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up admin...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Grant Admin Access
                </>
              )}
            </Button>

            {status === 'success' && (
              <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{message}</span>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Note:</strong> This will grant you full administrator access to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>User management and role assignment</li>
                <li>System analytics and monitoring</li>
                <li>Admin dashboard and settings</li>
                <li>All administrative functions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
