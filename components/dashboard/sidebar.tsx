'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useLayout } from '@/components/layout-context'
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Settings,
  Search,
  Plus,
  ChevronDown,
  HelpCircle,
  Receipt,
  LogOut,
  DollarSign,
  TrendingUp,
  Users,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Documentation', href: '/dashboard/documentation', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const projects = [
  { name: 'Event Planning', color: 'bg-purple-500' },
  { name: 'Breakfast Plan', color: 'bg-green-500' },
]

interface SidebarProps {
  onClose?: () => void
  isOpen?: boolean
}

export function Sidebar({ onClose, isOpen = true }: SidebarProps) {
  const pathname = usePathname()
  const { preferences, toggleSidebar } = useLayout()
  const [isProjectsOpen, setIsProjectsOpen] = useState(true)

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...')
    // You can add your logout logic here
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
        "fixed left-0 top-0 h-full bg-card/80 backdrop-blur-md border-r border-border/50 flex flex-col z-50 shadow-xl",
        "transition-all duration-500 ease-in-out",
        preferences.sidebarCollapsed ? "w-16" : "w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Collapse Toggle Button - Semi-outside */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "absolute top-20 -right-3 z-50 h-7 w-7 rounded-full bg-card/95 backdrop-blur-sm border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-primary hover:border-primary hover:text-primary-foreground",
            "hidden lg:flex items-center justify-center",
            "group"
          )}
          title={preferences.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {preferences.sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-foreground group-hover:text-primary-foreground transition-colors" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-foreground group-hover:text-primary-foreground transition-colors" />
          )}
        </Button>

        {/* Logo and Toggle Button */}
        <div className={cn(
          "h-16 border-b border-border/50 transition-all duration-500 ease-in-out bg-gradient-to-br from-card/90 to-card/50 flex items-center",
          preferences.sidebarCollapsed ? "px-4" : "px-6"
        )}>
          <div className="flex items-center justify-between w-full">
            <Link href="/dashboard" className="flex items-center group">
              {preferences.sidebarCollapsed ? (
                <div className="w-7 h-7 bg-gradient-to-br from-primary/80 to-amber-600/80 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                  <span className="text-primary-foreground font-semibold text-xs">R</span>
                </div>
              ) : (
                <div className="transition-opacity duration-300">
                  <Image src="/logo.svg" alt="ReboLabs" className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300" width={100} height={24} />
                </div>
              )}
            </Link>
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-muted/80 rounded-lg transition-colors h-8 w-8"
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
                  'flex items-center rounded-xl text-sm font-medium transition-all duration-500 ease-in-out',
                  preferences.sidebarCollapsed ? 'px-3 py-3 justify-center' : 'space-x-3 px-4 py-3',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-amber-600 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.01]'
                )}
                onClick={onClose} // Close sidebar on mobile when clicking navigation
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 flex-shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )} />
                {!preferences.sidebarCollapsed && (
                  <span className="font-medium transition-opacity duration-500 ease-in-out">{item.name}</span>
                )}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {preferences.sidebarCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-popover backdrop-blur-md text-popover-foreground text-xs font-medium rounded-md whitespace-nowrap z-[9999] shadow-xl border border-border pointer-events-none opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
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
        "border-t border-border/50 transition-all duration-500 ease-in-out bg-gradient-to-t from-card/90 to-card/50",
        preferences.sidebarCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "space-y-2 transition-all duration-500 ease-in-out",
          preferences.sidebarCollapsed ? "py-2" : "py-3"
        )}>
          <Link
            href="/dashboard/help"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all duration-500 ease-in-out relative group overflow-visible",
              preferences.sidebarCollapsed ? "px-3 py-3 justify-center" : "space-x-3 px-4 py-3"
            )}
            onClick={onClose}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!preferences.sidebarCollapsed && (
              <>
                <span className="font-medium transition-opacity duration-500 ease-in-out">Help & Support</span>
                <span className="ml-auto w-6 h-6 bg-gradient-to-br from-primary to-amber-600 text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-md transition-opacity duration-500 ease-in-out">
                  0
                </span>
              </>
            )}
            {preferences.sidebarCollapsed && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-amber-600 text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold shadow-md z-10">
                0
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {preferences.sidebarCollapsed && (
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-popover backdrop-blur-sm text-popover-foreground text-xs font-medium rounded-lg whitespace-nowrap z-[100] shadow-lg border border-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 rounded-xl transition-all duration-300 font-medium relative group overflow-visible",
            preferences.sidebarCollapsed ? "justify-center px-3 py-3" : "justify-center py-3"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!preferences.sidebarCollapsed && (
            <span className="ml-2 transition-opacity duration-500 ease-in-out">Logout</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {preferences.sidebarCollapsed && (
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-popover backdrop-blur-sm text-popover-foreground text-xs font-medium rounded-lg whitespace-nowrap z-[100] shadow-lg border border-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Logout
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-b border-border rotate-45"></span>
            </span>
          )}
        </Button>
      </div>
    </div>
    </>
  )
}
