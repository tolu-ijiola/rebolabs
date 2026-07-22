'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  Search,
  Calendar,
  User,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2
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

const PAGE_SIZE = 50

export default function AdminLogsPage() {
  const { supabase } = useSupabase()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchLogs = useCallback(async (currentPage: number, search: string, uFilter: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('activity_logs')
        .select(`*, user:users(email, full_name)`, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (search.trim()) {
        query = (query as any).or(`action.ilike.%${search}%,ip_address.ilike.%${search}%`)
      }
      if (uFilter === 'users') {
        query = query.not('user_id', 'is', null)
      } else if (uFilter === 'system') {
        query = query.is('user_id', null)
      }

      const { data, error, count } = await query
      if (error) throw error
      setLogs(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const delay = setTimeout(() => { setPage(0); fetchLogs(0, searchTerm, userFilter) }, 300)
    return () => clearTimeout(delay)
  }, [searchTerm, userFilter, fetchLogs])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLogs(page, searchTerm, userFilter) }, [page])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const getActionIcon = (action: string) => {
    const map: Record<string, any> = {
      login: CheckCircle, logout: XCircle, user_created: User,
      user_banned: XCircle, user_unbanned: CheckCircle,
      app_approved: CheckCircle, app_rejected: XCircle,
      payout_approved: CheckCircle, payout_rejected: XCircle,
      system_startup: Activity, error: AlertCircle
    }
    return map[action] || Info
  }

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      login: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      user_created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      user_banned: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      user_unbanned: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      app_approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      app_rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }
    const color = colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    const Icon = getActionIcon(action)
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" aria-hidden="true" />
        {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground">Monitor system and user activities</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                placeholder="Search by action or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search logs"
              />
            </div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48" aria-label="Filter by type">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="w-5 h-5" aria-hidden="true" />
              <span>Activity Logs ({totalCount})</span>
            </span>
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">Page {page + 1} of {totalPages}</span>
            )}
          </CardTitle>
          <CardDescription>Recent system and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const Icon = getActionIcon(log.action)
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1" aria-hidden="true">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getActionBadge(log.action)}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>{format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">User</p>
                          <p className="text-foreground">{log.user ? (log.user.full_name || log.user.email) : 'System'}</p>
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
                              {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous page">
                    <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page * PAGE_SIZE + 1}&ndash;{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} aria-label="Next page">
                    Next <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
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
