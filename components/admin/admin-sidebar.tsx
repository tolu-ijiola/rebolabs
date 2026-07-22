'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth-context'
import { BrandLogo } from '@/components/brand-logo'
import {
  LayoutDashboard,
  Users,
  Smartphone,
  DollarSign,
  Settings,
  Server,
  FileText,
  Mail,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Apps', href: '/admin/apps', icon: Smartphone },
  { name: 'Payments', href: '/admin/payments', icon: DollarSign },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Activity logs', href: '/admin/logs', icon: FileText },
  { name: 'System status', href: '/admin/system', icon: Server },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#263029] bg-[#17201b] text-[#f2f7f4]">
      <div className="flex h-16 items-center justify-between border-b border-[#263029] px-6">
        <Link href="/admin" className="flex items-center">
          <BrandLogo className="text-[#f2f7f4]" />
        </Link>
        <span className="mono rounded-full border border-[#33403a] px-2 py-0.5 text-[10px] text-[#9db0a5]">Admin</span>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive ? 'bg-[#f2f7f4] text-[#17201b] shadow-sm' : 'text-[#9db0a5] hover:bg-white/5 hover:text-[#f2f7f4]'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#263029] p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9db0a5] transition-all duration-200 hover:bg-white/5 hover:text-[#f2f7f4]"
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Publisher dashboard
        </Link>
        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#33403a] py-3 text-sm font-medium text-[#d7e2db] transition-all duration-200 hover:border-[#f2f7f4] hover:bg-[#f2f7f4] hover:text-[#17201b]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
