'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Plus, ChevronDown, User, Menu, X, Settings, LogOut, Edit, HelpCircle } from 'lucide-react'
import { NewProjectModal } from './new-project-modal'
import { ThemeToggle } from '../theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '../auth-context'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      {/* Left side - Mobile Menu Button */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-muted/80 rounded-lg transition-colors"
          onClick={() => {
            if (onMenuClick) {
              onMenuClick()
            } else {
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
          }}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden lg:block">
          {/* Empty for desktop */}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* New Project Button */}
        <Button
          onClick={() => setIsNewProjectOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white px-3 sm:px-4 rounded-xl font-medium flex items-center space-x-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 h-9"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/80 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-amber-600 rounded-full flex items-center justify-center shadow-md shadow-primary/25 transition-transform duration-300 hover:scale-105">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-md border-border/50 shadow-xl" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {user?.user_metadata?.full_name || user?.email || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'No email'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
              <Link href="/dashboard/help" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden top-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu Content */}
          <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border/50 lg:hidden z-50 shadow-xl">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/80 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setIsNewProjectOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-start bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white rounded-xl shadow-lg shadow-primary/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                
                <Button variant="outline" className="w-full justify-start rounded-xl hover:bg-muted/80">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                
                <Button variant="outline" className="w-full justify-start rounded-xl hover:bg-muted/80">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Project Modal */}
      <NewProjectModal 
        open={isNewProjectOpen} 
        onOpenChange={setIsNewProjectOpen} 
      />
    </header>
  )
}
