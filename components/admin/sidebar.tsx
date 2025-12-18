'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Database,
  Activity,
  FileText,
  CreditCard,
  LogOut,
  DollarSign,
  X,
  UserCheck,
  UserX,
  UserPlus
} from 'lucide-react'
import Image from 'next/image'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'System Analytics', href: '/admin/analytics', icon: Activity },
  { name: 'Content Management', href: '/admin/content', icon: FileText },
  { name: 'Payment Management', href: '/admin/payments', icon: CreditCard },
  { name: 'Database', href: '/admin/database', icon: Database },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

const quickActions = [
  { name: 'Add User', icon: UserPlus, href: '/admin/users/new' },
  { name: 'Approve Users', icon: UserCheck, href: '/admin/users/pending' },
  { name: 'Suspend Users', icon: UserX, href: '/admin/users/suspended' },
]

interface AdminSidebarProps {
  onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // Handle admin logout logic here
    console.log('Admin logging out...')
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo and Close Button for Mobile */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center">
            <Image src="/logo.svg" alt="ReboLabs" className="w-40" width={160} height={40} />
          </Link>
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Administration Panel</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={onClose}
            >
              <action.icon className="w-4 h-4" />
              <span>{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              onClick={onClose}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <ThemeToggle />
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}











