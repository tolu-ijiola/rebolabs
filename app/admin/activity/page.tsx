'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  User,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  details: string
  metadata: any
  created_at: string
  users?: {
    email: string
    full_name: string
  }
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, searchTerm, actionFilter, userFilter, dateFilter])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          users (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1000)

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter)
    }

    // User filter
    if (userFilter !== 'all') {
      if (userFilter === 'system') {
        filtered = filtered.filter(activity => activity.user_id === null)
      } else {
        filtered = filtered.filter(activity => activity.user_id === userFilter)
      }
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      let cutoffDate: Date

      switch (dateFilter) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          cutoffDate = new Date(0)
      }

      filtered = filtered.filter(activity => 
        new Date(activity.created_at) >= cutoffDate
      )
    }

    setFilteredActivities(filtered)
  }

  const getActionBadge = (action: string) => {
    const actionConfig = {
      'user_created': { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50' },
      'user_banned': { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50' },
      'user_unbanned': { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50' },
      'app_approved': { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50' },
      'app_rejected': { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50' },
      'payout_created': { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50' },
      'payout_status_updated': { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50' },
      'monthly_payment_cron_completed': { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/50' },
      'system_status_updated': { color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/50' }
    }
    
    const config = actionConfig[action as keyof typeof actionConfig] || { 
      color: 'text-gray-600', 
      bg: 'bg-gray-50 dark:bg-gray-950/50' 
    }
    
    return (
      <Badge className={`${config.bg} ${config.color} border-0`}>
        {action.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getUniqueActions = () => {
    const actions = [...new Set(activities.map(a => a.action))].sort()
    return actions
  }

  const getUniqueUsers = () => {
    const users = activities
      .filter(a => a.user_id && a.users)
      .map(a => ({ id: a.user_id!, name: a.users!.full_name || a.users!.email }))
      .filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
    
    return users
  }

  const getStats = () => {
    const totalActivities = activities.length
    const todayActivities = activities.filter(a => {
      const today = new Date()
      const activityDate = new Date(a.created_at)
      return activityDate.toDateString() === today.toDateString()
    }).length
    const systemActivities = activities.filter(a => a.user_id === null).length
    const userActivities = activities.filter(a => a.user_id !== null).length

    return {
      totalActivities,
      todayActivities,
      systemActivities,
      userActivities
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor system and user activities</p>
        </div>
        <Button onClick={fetchActivities} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalActivities}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">{stats.todayActivities}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Actions</p>
                <p className="text-2xl font-bold text-foreground">{stats.userActivities}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Actions</p>
                <p className="text-2xl font-bold text-foreground">{stats.systemActivities}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {getUniqueActions().map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="user">User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  {getUniqueUsers().map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setActionFilter('all')
                  setUserFilter('all')
                  setDateFilter('all')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Activities Found</h3>
              <p className="text-muted-foreground">No activities match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.user_id ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getActionBadge(activity.action)}
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(activity.created_at), 'PPp')}
                      </span>
                    </div>
                    
                    <p className="text-foreground font-medium mb-1">
                      {activity.details}
                    </p>
                    
                    {activity.users && (
                      <p className="text-sm text-muted-foreground">
                        User: {activity.users.full_name || activity.users.email}
                      </p>
                    )}
                    
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          View Details
                        </summary>
                        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
