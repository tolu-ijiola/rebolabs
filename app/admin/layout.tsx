'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { AdminRoute } from '@/components/admin-route'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="md:ml-64 flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Mobile Header with Logo and Menu Toggle */}
            <div className="md:hidden mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image src="/logo.svg" alt="ReboLabs" className="w-32" width={128} height={32} />
                <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center space-x-2"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </Button>
            </div>
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}

