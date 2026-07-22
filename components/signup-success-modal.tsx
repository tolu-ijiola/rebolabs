'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface SignupSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function SignupSuccessModal({ open, onOpenChange, email }: SignupSuccessModalProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendStatus('idle')
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        setResendStatus('error')
        setResendMessage(error.message || 'Failed to resend email')
      } else {
        setResendStatus('success')
        setResendMessage('Verification email sent successfully!')
      }
    } catch (error) {
      setResendStatus('error')
      setResendMessage('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Welcome to ReboLabs! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Account Created Successfully!
            </h3>
            <p className="text-muted-foreground">
              We've sent you a verification email to <strong>{email}</strong>
            </p>
          </div>

          {/* Resend Status */}
          {resendStatus !== 'idle' && (
            <div className={`p-3 rounded-md text-sm ${
              resendStatus === 'success' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                {resendStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{resendMessage}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline" 
              className="w-full"
            >
              {isResending ? (
                'Resending...'
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
            
            <Link href="/login" className="block">
              <Button className="w-full">
                Go to Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-primary hover:underline font-medium"
            >
              resend it
            </button>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
