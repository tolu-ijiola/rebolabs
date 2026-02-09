'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-foreground/10 dark:text-foreground/5">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Illustration/Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link 
              href="/dashboard" 
              className="text-primary hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/dashboard/projects" 
              className="text-primary hover:underline"
            >
              Projects
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/dashboard/documentation" 
              className="text-primary hover:underline"
            >
              Documentation
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/contact" 
              className="text-primary hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}









