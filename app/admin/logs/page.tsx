'use client'

import React, { useState, useEffect } from 'react'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { format } from 'date-fns'

interface ActivityLog {
  id: string
  action: string
  details: any
  user_id?: string
  ip_address: string
  created_at: string
  user?: {
    email: string
    full_name: string
  }
}

interface LogStats {
  totalLogs: number
  todayLogs: number
  userActions: number
  systemActions: number
}

export default function AdminLogsPage() {
  const { supabase } = useSupabase()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<LogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)

      // Fetch activity logs with user data
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:users(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(1000) // Limit to last 1000 logs for performance

      if (error) throw error

      setLogs(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (logs: ActivityLog[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = logs.reduce((acc, log) => {
      acc.totalLogs++
      
      const logDate = new Date(log.created_at)
      if (logDate >= today) {
        acc.todayLogs++
      }
      
      if (log.user_id) {
        acc.userActions++
      } else {
        acc.systemActions++
      }
      
      return acc
    }, {
      totalLogs: 0,
      todayLogs: 0,
      userActions: 0,
      systemActions: 0
    })

    setStats(stats)
  }

  const getActionIcon = (action: string) => {
    const actionIcons: { [key: string]: any } = {
      login: CheckCircle,
      logout: XCircle,
      user_created: User,
      user_banned: XCircle,
      user_unbanned: CheckCircle,
      app_approved: CheckCircle,
      app_rejected: XCircle,
      payout_approved: CheckCircle,
      payout_rejected: XCircle,
      monthly_payouts_cron: Activity,
      system_startup: Activity,
      error: AlertCircle
    }

    return actionIcons[action] || Info
  }

  const getActionBadge = (action: string) => {
    const actionColors: { [key: string]: string } = {
      login: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      user_created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      user_banned: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      user_unbanned: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      app_approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      app_rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      payout_approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      payout_rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      monthly_payouts_cron: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      system_startup: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }

    const color = actionColors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    const Icon = getActionIcon(action)

    return (
      <Badge className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    )
  }

  const formatDetails = (details: any) => {
    if (!details) return 'No details'
    
    if (typeof details === 'string') {
      return details
    }
    
    if (typeof details === 'object') {
      return JSON.stringify(details, null, 2)
    }
    
    return String(details)
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesUser = userFilter === 'all' || 
                       (userFilter === 'users' && log.user_id) ||
                       (userFilter === 'system' && !log.user_id)
    
    return matchesSearch && matchesAction && matchesUser
  })

  const uniqueActions = [...new Set(logs.map(log => log.action))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor system and user activities</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">{stats.totalLogs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">{stats.todayLogs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Actions</p>
                    <p className="text-2xl font-bold">{stats.userActions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Actions</p>
                    <p className="text-2xl font-bold">{stats.systemActions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by action, user, or IP address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="users">User Actions</SelectItem>
                  <SelectItem value="system">System Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Activity Logs</span>
            </CardTitle>
            <CardDescription>
              Recent system and user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {React.createElement(getActionIcon(log.action), { className: "w-5 h-5 text-muted-foreground" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getActionBadge(log.action)}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">User</p>
                          <p className="text-foreground">
                            {log.user ? (log.user.full_name || log.user.email) : 'System'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">IP Address</p>
                          <p className="text-foreground font-mono">{log.ip_address}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Log ID</p>
                          <p className="text-foreground font-mono text-xs">{log.id.slice(-8)}</p>
                        </div>
                      </div>

                      {log.details && (
                        <div className="mt-3">
                          <p className="font-medium text-muted-foreground mb-2">Details</p>
                          <div className="bg-muted p-3 rounded-lg">
                            <pre className="text-xs text-foreground whitespace-pre-wrap break-words">
                              {formatDetails(log.details)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
