'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  Activity, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  UserCheck,
  UserX,
  Database,
  Server,
  Smartphone,
  Clock,
  Loader2
} from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { SystemStatusService } from '@/lib/services/system-status'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  totalProjects: number
  activeProjects: number
  pendingProjects: number
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  systemStatus: 'online' | 'offline' | 'maintenance'
}

interface RecentActivity {
  id: string
  action: string
  user_email?: string
  resource_type: string
  created_at: string
}

export default function AdminDashboardPage() {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const { data: users } = await supabase
          .from('users')
          .select('id, status, created_at')

        // Fetch project stats
        const { data: projects } = await supabase
          .from('projects')
          .select('id, status, created_at')

        // Fetch revenue stats
        const { data: revenue } = await supabase
          .from('survey_sessions')
          .select('revenue, created_at')
          .eq('status', 'completed')

        // Fetch pending payments
        const { data: payments } = await supabase
          .from('payment_approvals')
          .select('id, status')
          .eq('status', 'pending')

        // Fetch system status
        const systemStatus = await SystemStatusService.getCurrentStatus()

        // Fetch recent activities
        const { data: activities } = await supabase
          .from('activity_logs')
          .select(`
            id,
            action,
            resource_type,
            created_at,
            users!activity_logs_user_id_fkey(email)
          `)
          .order('created_at', { ascending: false })
          .limit(10)

        // Calculate stats
        const totalUsers = users?.length || 0
        const activeUsers = users?.filter(u => u.status === 'active').length || 0
        const bannedUsers = users?.filter(u => u.status === 'banned').length || 0
        
        const totalProjects = projects?.length || 0
        const activeProjects = projects?.filter(p => p.status === 'active').length || 0
        const pendingProjects = projects?.filter(p => p.status === 'pending').length || 0

        const totalRevenue = revenue?.reduce((sum, r) => sum + (r.revenue || 0), 0) || 0
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue = revenue?.filter(r => {
          const date = new Date(r.created_at)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        }).reduce((sum, r) => sum + (r.revenue || 0), 0) || 0

        const pendingPayments = payments?.length || 0

        setStats({
          totalUsers,
          activeUsers,
          bannedUsers,
          totalProjects,
          activeProjects,
          pendingProjects,
          totalRevenue,
          monthlyRevenue,
          pendingPayments,
          systemStatus: systemStatus?.status || 'offline'
        })

        setRecentActivities(activities?.map(a => ({
          id: a.id,
          action: a.action,
          user_email: Array.isArray(a.users) ? a.users[0]?.email : a.users?.email,
          resource_type: a.resource_type,
          created_at: a.created_at
        })) || [])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const systemStats = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers.toString() || '0', 
      icon: Users, 
      color: 'text-blue-500',
      subtitle: `${stats?.activeUsers || 0} active`
    },
    { 
      title: 'Total Apps', 
      value: stats?.totalProjects.toString() || '0', 
      icon: Smartphone, 
      color: 'text-green-500',
      subtitle: `${stats?.activeProjects || 0} active`
    },
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, 
      icon: DollarSign, 
      color: 'text-emerald-500',
      subtitle: `$${(stats?.monthlyRevenue || 0).toFixed(2)} this month`
    },
    { 
      title: 'Pending Payments', 
      value: stats?.pendingPayments.toString() || '0', 
      icon: Clock, 
      color: 'text-orange-500',
      subtitle: 'Awaiting approval'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor system performance and manage users</p>
      </div>

      {/* System Status Alert */}
      <div className={`border rounded-lg p-4 ${
        stats?.systemStatus === 'online' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : stats?.systemStatus === 'maintenance'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {stats?.systemStatus === 'online' ? (
              <Database className="h-5 w-5 text-green-400" />
            ) : stats?.systemStatus === 'maintenance' ? (
              <Clock className="h-5 w-5 text-yellow-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              stats?.systemStatus === 'online' 
                ? 'text-green-800 dark:text-green-200'
                : stats?.systemStatus === 'maintenance'
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              System {stats?.systemStatus === 'online' ? 'Online' : stats?.systemStatus === 'maintenance' ? 'Under Maintenance' : 'Offline'}
            </h3>
            <p className={`text-sm ${
              stats?.systemStatus === 'online' 
                ? 'text-green-700 dark:text-green-300'
                : stats?.systemStatus === 'maintenance'
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {stats?.systemStatus === 'online' 
                ? 'All systems are operational.'
                : stats?.systemStatus === 'maintenance'
                ? 'System is under maintenance. Some features may be unavailable.'
                : 'System is currently offline. Please check back later.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user_email && `by ${activity.user_email}`}
                        <span className="mx-1">•</span>
                        {activity.resource_type}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}