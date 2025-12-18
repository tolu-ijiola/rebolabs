'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Shield,
  MoreHorizontal,
  Loader2,
  Eye,
  Ban,
  CheckCircle
} from 'lucide-react'
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

export default function UsersPage() {
  const { supabase } = useSupabase()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string, reason: string) => {
    if (!currentUser) return
    
    setActionLoading(userId)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          status: 'banned',
          ban_reason: reason,
          banned_at: new Date().toISOString(),
          banned_by: currentUser.id
        })
        .eq('id', userId)

      if (error) throw error

      // Log the action
      await ActivityLogger.logUserAction(currentUser.id, 'User banned', {
        banned_user_id: userId,
        reason
      })

      await fetchUsers()
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
      const { error } = await supabase
        .from('users')
        .update({
          status: 'active',
          ban_reason: null,
          banned_at: null,
          banned_by: null
        })
        .eq('id', userId)

      if (error) throw error

      // Log the action
      await ActivityLogger.logUserAction(currentUser.id, 'User unbanned', {
        unbanned_user_id: userId
      })

      await fetchUsers()
    } catch (error) {
      console.error('Error unbanning user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
      case 'banned':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Banned</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Admin</Badge>
      : <Badge variant="outline">User</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{user.full_name || 'No name'}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                        {user.last_sign_in_at && (
                          <span> • Last active {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        )}
                      </p>
                      {user.ban_reason && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Banned: {user.ban_reason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/users/${user.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </a>
                    </Button>
                    
                    {user.status === 'banned' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnbanUser(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Unban
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          const reason = prompt('Enter ban reason:')
                          if (reason) handleBanUser(user.id, reason)
                        }}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Ban className="w-4 h-4 mr-1" />
                        )}
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}