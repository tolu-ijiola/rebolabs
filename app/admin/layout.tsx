'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/header'
import { AdminRoute } from '@/components/admin-route'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AdminRoute>
      <div className="min-h-screen bg-secondary">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`fixed left-0 top-0 z-50 h-full transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <AdminSidebar />
        </div>

        <div className="flex min-h-screen flex-col md:pl-64">
          <AdminHeader onMenuClick={() => setIsSidebarOpen((value) => !value)} />
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}
