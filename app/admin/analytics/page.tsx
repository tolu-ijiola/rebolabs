'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Chart } from '@/components/ui/chart'
import { useSupabase } from '@/components/supabase-context'
import { Users, DollarSign, Activity, TrendingUp, RefreshCw, Loader2 } from 'lucide-react'

interface DailyRevenue {
  date: string
  revenue: number
  completions: number
}

interface Stats {
  totalRevenue: number
  totalCompletions: number
  totalUsers: number
  activeProjectsCount: number
  revenueThisMonth: number
  completionsThisMonth: number
}

export default function AnalyticsPage() {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<Stats | null>(null)
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

      const [analyticsRes, usersRes, projectsRes] = await Promise.all([
        supabase
          .from('analytics')
          .select('full_date, revenue_usd, history_type')
          .gte('full_date', thirtyDaysAgoStr)
          .eq('history_type', 'reward')
          .order('full_date', { ascending: true }),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'active')
      ])

      const analyticsData = analyticsRes.data || []

      // Group by date
      const byDate: Record<string, { revenue: number; completions: number }> = {}
      analyticsData.forEach((row: any) => {
        const d = row.full_date
        if (!byDate[d]) byDate[d] = { revenue: 0, completions: 0 }
        byDate[d].revenue += row.revenue_usd || 0
        byDate[d].completions += 1
      })

      const daily = Object.entries(byDate).map(([date, v]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(v.revenue.toFixed(2)),
        completions: v.completions
      }))

      const totalRevenue = analyticsData.reduce((s: number, r: any) => s + (r.revenue_usd || 0), 0)
      const revenueThisMonth = analyticsData
        .filter((r: any) => r.full_date >= thisMonthStart)
        .reduce((s: number, r: any) => s + (r.revenue_usd || 0), 0)
      const completionsThisMonth = analyticsData
        .filter((r: any) => r.full_date >= thisMonthStart).length

      setDailyRevenue(daily)
      setStats({
        totalRevenue,
        totalCompletions: analyticsData.length,
        totalUsers: usersRes.count || 0,
        activeProjectsCount: projectsRes.count || 0,
        revenueThisMonth,
        completionsThisMonth
      })
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnalytics() }, [])

  const summaryCards = stats ? [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, sub: `$${stats.revenueThisMonth.toFixed(2)} this month`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Reward Events', value: stats.totalCompletions.toLocaleString(), sub: `${stats.completionsThisMonth} this month`, icon: Activity, color: 'text-blue-500' },
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: 'Registered accounts', icon: Users, color: 'text-purple-500' },
    { title: 'Active Projects', value: stats.activeProjectsCount.toLocaleString(), sub: 'Approved & running', icon: TrendingUp, color: 'text-orange-500' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Analytics</h1>
          <p className="text-muted-foreground">Real-time platform performance — last 30 days</p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading analytics" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${card.color}`}>
                      <card.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {dailyRevenue.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={dailyRevenue.map(d => ({ name: d.date, Revenue: d.revenue }))}
                    type="line"
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Completions (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={dailyRevenue.map(d => ({ name: d.date, Completions: d.completions }))}
                    type="bar"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {dailyRevenue.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-foreground mb-2">No analytics data yet</h3>
                <p className="text-muted-foreground">Analytics will appear here once users start completing reward events.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
