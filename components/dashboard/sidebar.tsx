'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLayout } from '@/components/layout-context'
import { useAuth } from '@/components/auth-context'
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Documentation', href: '/dashboard/documentation', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
  isOpen?: boolean
}

export function Sidebar({ onClose, isOpen = true }: SidebarProps) {
  const pathname = usePathname()
  const { preferences, toggleSidebar } = useLayout()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed left-0 top-0 h-full bg-[#17201b] text-[#f2f7f4] border-r border-[#263029] flex flex-col z-50 shadow-sm",
        "transition-all duration-500 ease-in-out",
        preferences.sidebarCollapsed ? "w-16" : "w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "absolute top-20 -right-3 z-50 h-7 w-7 rounded-full bg-[#1d2620] border-2 border-[#33403a] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#f2f7f4] hover:border-[#f2f7f4] hover:text-[#17201b]",
            "hidden lg:flex items-center justify-center group"
          )}
          title={preferences.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {preferences.sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#f2f7f4] group-hover:text-[#17201b] transition-colors" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[#f2f7f4] group-hover:text-[#17201b] transition-colors" />
            )}
        </Button>

        {/* Logo */}
        <div className={cn(
          "h-16 border-b border-[#263029] transition-all duration-500 ease-in-out flex items-center",
          preferences.sidebarCollapsed ? "px-4" : "px-6"
        )}>
          <div className="flex items-center justify-between w-full">
            <Link href="/dashboard" className="flex items-center group">
              {preferences.sidebarCollapsed ? (
                <BrandLogo className="text-[#f2f7f4] [&>span:last-child]:hidden" />
              ) : (
                <div className="flex items-center gap-2 transition-opacity duration-300">
                  <BrandLogo className="text-[#f2f7f4]" />
                </div>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/10 rounded-lg transition-colors h-8 w-8 text-[#f2f7f4]"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 space-y-1.5 transition-all duration-500 ease-in-out overflow-y-auto overflow-x-visible",
          preferences.sidebarCollapsed ? "p-2" : "p-4"
        )}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                    preferences.sidebarCollapsed ? 'px-3 py-3 justify-center' : 'space-x-3 px-4 py-3',
                    isActive
                      ? 'bg-[#f2f7f4] text-[#17201b] shadow-sm'
                      : 'text-[#9db0a5] hover:text-[#f2f7f4] hover:bg-white/5'
                  )}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!preferences.sidebarCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>

                {/* Tooltip (collapsed) */}
                {preferences.sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-[#1d2620] text-[#f2f7f4] text-xs font-medium rounded-md whitespace-nowrap z-[9999] shadow-xl border border-[#33403a] pointer-events-none opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-b border-border rotate-45"></div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-[#263029] transition-all duration-500 ease-in-out",
          preferences.sidebarCollapsed ? "p-2" : "p-4"
        )}>
          <div className={cn(
            "space-y-2 transition-all duration-500 ease-in-out",
            preferences.sidebarCollapsed ? "py-2" : "py-3"
          )}>
            <Link
              href="/dashboard/help"
              className={cn(
                "flex items-center text-sm font-medium text-[#9db0a5] hover:text-[#f2f7f4] hover:bg-white/5 rounded-xl transition-all duration-200 relative group overflow-visible",
                preferences.sidebarCollapsed ? "px-3 py-3 justify-center" : "space-x-3 px-4 py-3"
              )}
              onClick={onClose}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {!preferences.sidebarCollapsed && (
                <span className="font-medium">Help & Support</span>
              )}

              {/* Tooltip (collapsed) */}
              {preferences.sidebarCollapsed && (
                <span className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg whitespace-nowrap z-[100] shadow-lg border border-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Help & Support
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-b border-border rotate-45"></span>
                </span>
              )}
            </Link>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className={cn(
              "w-full border-[#33403a] bg-transparent text-[#d7e2db] hover:bg-[#f2f7f4] hover:text-[#17201b] hover:border-[#f2f7f4] rounded-lg transition-all duration-200 font-medium relative group overflow-visible",
              preferences.sidebarCollapsed ? "justify-center px-3 py-3" : "justify-center py-3"
            )}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!preferences.sidebarCollapsed && (
              <span className="ml-2">Sign out</span>
            )}

            {/* Tooltip (collapsed) */}
            {preferences.sidebarCollapsed && (
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg whitespace-nowrap z-[100] shadow-lg border border-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Sign out
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-b border-border rotate-45"></span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
