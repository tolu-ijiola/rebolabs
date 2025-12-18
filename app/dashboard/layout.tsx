'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'
import { LayoutProvider, useLayout } from '@/components/layout-context'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { preferences } = useLayout()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Close mobile sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        onClose={() => setIsMobileSidebarOpen(false)} 
        isOpen={isMobileSidebarOpen}
      />
      <div className={cn(
        "transition-all duration-300",
        preferences.sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        <Header onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className={cn(
          "transition-all duration-300",
          preferences.compactMode ? "py-4 sm:py-6" : "py-6 sm:py-8 lg:py-10"
        )}>
          <div className={cn(
            "transition-all duration-300",
            preferences.compactMode ? "px-3 sm:px-4 lg:px-6" : "px-4 sm:px-6 lg:px-8"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutProvider>
      <DashboardProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </DashboardProvider>
    </LayoutProvider>
  )
}
