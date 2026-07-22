'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Search, Loader2, Eye, Ban, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { ActivityLogger } from '@/lib/services/activity-logger'
import { useAuth } from '@/components/auth-context'

interface User {
  id: string
  email: string
  full_name: string
  status: 'active' | 'banned' | 'suspended'
  role: 'user' | 'admin'
  created_at: string
  last_sign_in_at?: string
  ban_reason?: string
  banned_at?: string
}

const PAGE_SIZE = 20

export default function UsersPage() {
  const { supabase } = useSupabase()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchUsers = useCallback(async (currentPage: number, search: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (search.trim()) {
        query = (query as any).or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
      }

      const { data, error, count } = await query
      if (error) throw error
      setUsers(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const delay = setTimeout(() => { setPage(0); fetchUsers(0, searchTerm) }, 300)
    return () => clearTimeout(delay)
  }, [searchTerm, fetchUsers])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers(page, searchTerm) }, [page])

  const handleBanUser = async (userId: string, reason: string) => {
    if (!currentUser) return
    setActionLoading(userId)
    try {
      const { error } = await supabase.from('users')
        .update({ status: 'banned', ban_reason: reason, banned_at: new Date().toISOString(), banned_by: currentUser.id })
        .eq('id', userId)
      if (error) throw error
      await ActivityLogger.logUserAction(currentUser.id, 'User banned', { banned_user_id: userId, reason })
      await fetchUsers(page, searchTerm)
    } catch (error) {
      console.error('Error banning user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnbanUser = async (userId: string) => {
    if (!currentUser) return
    setActionLoading(userId)
    try {
      const { error } = await supabase.from('users')
        .update({ status: 'active', ban_reason: null, banned_at: null, banned_by: null })
        .eq('id', userId)
      if (error) throw error
      await ActivityLogger.logUserAction(currentUser.id, 'User unbanned', { unbanned_user_id: userId })
      await fetchUsers(page, searchTerm)
    } catch (error) {
      console.error('Error unbanning user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
    if (status === 'banned') return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Banned</Badge>
    if (status === 'suspended') return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Suspended</Badge>
    return <Badge variant="secondary">{status}</Badge>
  }

  const getRoleBadge = (role: string) => role === 'admin'
    ? <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Admin</Badge>
    : <Badge variant="outline">User</Badge>

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              aria-label="Search users"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" aria-hidden="true" />
              Users ({totalCount})
            </span>
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">Page {page + 1} of {totalPages}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center" aria-hidden="true">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <h3 className="font-medium text-foreground">{user.full_name || 'No name'}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                        {user.last_sign_in_at && (
                          <span> &bull; Last active {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        )}
                      </p>
                      {user.ban_reason && (
                        <p className="text-xs text-red-600 dark:text-red-400">Banned: {user.ban_reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/users/${user.id}`} aria-label={`View ${user.email}`}>
                        <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
                        View
                      </a>
                    </Button>
                    {user.status === 'banned' ? (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => handleUnbanUser(user.id)}
                        disabled={actionLoading === user.id}
                        aria-label={`Unban ${user.email}`}
                      >
                        {actionLoading === user.id
                          ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          : <CheckCircle className="w-4 h-4 mr-1" />}
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="destructive" size="sm"
                        onClick={() => { const r = prompt('Enter ban reason:'); if (r) handleBanUser(user.id, r) }}
                        disabled={actionLoading === user.id}
                        aria-label={`Ban ${user.email}`}
                      >
                        {actionLoading === user.id
                          ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          : <Ban className="w-4 h-4 mr-1" />}
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page * PAGE_SIZE + 1}&ndash;{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                  </span>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
