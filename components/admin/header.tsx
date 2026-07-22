'use client'

import { Bell, User, Menu, LogOut, Activity } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/components/auth-context'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email || 'Admin'
  const displayEmail = user?.email || ''

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/92 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 rounded-full border border-success/25 bg-success/5 px-3 py-1 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs font-medium text-success">System online</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                <User className="h-4 w-4 text-background" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg border-border bg-card shadow-lg" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg transition-colors hover:bg-muted">
              <Link href="/dashboard">
                <Activity className="mr-2 h-4 w-4" />
                <span>Go to dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer rounded-lg text-destructive transition-colors hover:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
