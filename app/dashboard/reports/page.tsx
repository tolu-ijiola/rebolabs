'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Chart } from '@/components/ui/chart'
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Zap, Loader2, AlertCircle, RefreshCw, BarChart3, LineChart, PieChart, Activity } from 'lucide-react'
import { DateRangePicker } from '@/components/date-range-picker'
import type { DateRange } from 'react-day-picker'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { useAuth } from '@/components/auth-context'
import { subDays } from 'date-fns'
import { createClient } from '@supabase/supabase-js'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })
  const [filteredStats, setFilteredStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const { projects, loading, errors } = useDashboard()
  const { user } = useAuth()

  // Initial load only once when component mounts
  useEffect(() => {
    if (!hasLoaded && user && projects && projects.length > 0 && dateRange?.from && dateRange?.to) {
      fetchFilteredStats()
      setHasLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, projects, hasLoaded])

  const fetchFilteredStats = async () => {
    if (!user || !projects || projects.length === 0) {
      setFilteredStats(null)
      return
    }

    if (!dateRange?.from || !dateRange?.to) {
      setFilteredStats(null)
      return
    }

    setLoadingStats(true)
    setStatsError(null)

    try {
      const projectAppIds = projects.map(p => p.app_id)
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const fromDate = dateRange.from.toISOString().split('T')[0]
        const toDate = dateRange.to.toISOString().split('T')[0]

        const { data: analyticsData, error } = await supabase
          .from('analytics')
          .select('*')
          .in('app_id', projectAppIds)
          .gte('full_date', fromDate)
          .lte('full_date', toDate)
          .order('full_date', { ascending: false })

        if (error) throw error

        const flatAnalytics = analyticsData || []
        const totalRevenue = flatAnalytics.reduce((sum: number, item: any) => sum + (item.revenue_usd || 0), 0)
        const totalRewards = flatAnalytics.filter((item: any) => item.history_type === 'reward').length
        const totalReconciliations = flatAnalytics.filter((item: any) => item.history_type === 'reconciliation').length
        const activeProjects = projects.filter(p => p.status === 'active').length

        // Calculate monthly revenue data for the selected range
        const monthsInRange: { [key: string]: number } = {}
        flatAnalytics
          .filter((item: any) => item.history_type === 'reward')
          .forEach((item: any) => {
            const monthKey = `${item.year}-${String(item.month).padStart(2, '0')}`
            monthsInRange[monthKey] = (monthsInRange[monthKey] || 0) + (item.revenue_usd || 0)
          })

        const monthlyRevenueData = Object.entries(monthsInRange)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([monthKey, revenue]) => {
            const [year, month] = monthKey.split('-')
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' })
            return { month: monthName, revenue: revenue as number }
          })

        // Calculate user growth data
        const usersByMonth: { [key: string]: Set<string> } = {}
        flatAnalytics
          .filter((item: any) => item.history_type === 'reward')
          .forEach((item: any) => {
            const monthKey = `${item.year}-${String(item.month).padStart(2, '0')}`
            if (!usersByMonth[monthKey]) {
              usersByMonth[monthKey] = new Set()
            }
            if (item.user_id) {
              usersByMonth[monthKey].add(item.user_id)
            }
          })

        const userGrowthData = Object.entries(usersByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([monthKey, users]) => {
            const [year, month] = monthKey.split('-')
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' })
            return { month: monthName, users: users.size }
          })

        // Calculate revenue by history type
        const revenueByHistoryType = flatAnalytics.reduce((acc: any, item: any) => {
          const type = item.history_type === 'reward' ? 'Rewards' : 'Reconciliation'
          acc[type] = (acc[type] || 0) + (item.revenue_usd || 0)
          return acc
        }, {})

        const revenueByProduct = Object.entries(revenueByHistoryType).map(([name, value]) => ({
          name,
          value: Math.round(value as number)
        }))

        setFilteredStats({
          stats: [
            { 
              title: 'Total Revenue', 
              value: `$${totalRevenue.toLocaleString()}`, 
              change: '+0%', 
              trend: 'up' 
            },
            { 
              title: 'Active Projects', 
              value: activeProjects.toString(), 
              change: '+0%', 
              trend: 'up' 
            },
            { 
              title: 'Total Rewards', 
              value: totalRewards.toString(), 
              change: '+0%', 
              trend: 'up' 
            },
            { 
              title: 'Total Reconciliations', 
              value: totalReconciliations.toString(), 
              change: '+0%', 
              trend: 'up' 
            }
          ],
          monthlyRevenueData,
          userGrowthData,
          revenueByProduct
      })
    } catch (error) {
      console.error('Error fetching filtered stats:', error)
      setStatsError(error instanceof Error ? error.message : 'Failed to fetch stats')
    } finally {
      setLoadingStats(false)
    }
  }

  const stats = filteredStats
  const isLoading = loading.stats || loadingStats
  const hasError = errors.stats || statsError

  const handleRetry = () => {
    setStatsError(null)
    fetchFilteredStats()
  }

  const handleApplyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      fetchFilteredStats()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-full bg-red-500/10 inline-flex mb-2">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Error Loading Analytics</h2>
          <p className="text-sm text-muted-foreground">{errors.stats || statsError}</p>
          <div className="space-y-2">
            <Button onClick={handleRetry} size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <p className="text-xs text-muted-foreground">
              If the problem persists, check your internet connection or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>
            <p className="text-muted-foreground">Track your projects performance and insights</p>
          </div>
          <div className="flex-shrink-0">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-muted/50 inline-flex mb-2">
              <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No Analytics Data</h2>
            <p className="text-sm text-muted-foreground">Start creating projects to see your analytics here</p>
          </div>
        </div>
      </div>
    )
  }

  const { monthlyRevenueData, userGrowthData, revenueByProduct } = stats

  const iconMap = {
    'Total Revenue': DollarSign,
    'Active Projects': Users,
    'Total Rewards': Target,
    'Total Reconciliations': Zap,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Track your projects performance and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
          <Button
            onClick={handleApplyFilter}
            disabled={loadingStats || !dateRange?.from || !dateRange?.to}
            className="w-full sm:w-auto rounded-2xl"
          >
            {loadingStats ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Apply Filter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.stats.map((stat: any) => {
          const isPositive = stat.trend === 'up' && !stat.change.startsWith('-')
          const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          const ChangeIcon = isPositive ? TrendingUp : TrendingDown
          
          return (
            <Card key={stat.title} className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-2">{stat.value}</p>
                    <div className={`text-xs sm:text-sm ${changeColor} flex items-center gap-1`}>
                      <ChangeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-muted/50 border border-border shrink-0">
                    {iconMap[stat.title as keyof typeof iconMap] && 
                      React.createElement(iconMap[stat.title as keyof typeof iconMap], {
                        className: "w-4 h-4 sm:w-5 sm:h-5 text-foreground/70"
                      })
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base sm:text-lg font-semibold">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenueData.length > 0 && monthlyRevenueData.some((item: any) => item.revenue > 0) ? (
              <Chart 
                data={monthlyRevenueData.map((item: any) => ({ name: item.month, value: item.revenue }))} 
                type="line" 
                height={300} 
              />
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <LineChart className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No revenue data available</p>
                <p className="text-xs text-muted-foreground/80">Start earning to see your monthly revenue chart</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base sm:text-lg font-semibold">Surveys Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {userGrowthData.length > 0 && userGrowthData.some((item: any) => item.users > 0) ? (
              <Chart 
                data={userGrowthData.map((item: any) => ({ name: item.month, value: item.users }))} 
                type="bar" 
                height={300} 
              />
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No survey data available</p>
                <p className="text-xs text-muted-foreground/80">Start getting users to see your growth chart</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Sources */}
      <Card className="bg-card border-border hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-base sm:text-lg font-semibold">Revenue by Product Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {revenueByProduct.length > 0 ? (
                <Chart data={revenueByProduct} type="pie" height={250} />
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="p-4 rounded-full bg-muted/50">
                    <PieChart className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium">No revenue data available</p>
                  <p className="text-xs text-muted-foreground/80">Start earning to see your revenue breakdown</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Revenue Breakdown</h3>
              {revenueByProduct.length > 0 ? (
                <div className="space-y-3">
                  {revenueByProduct.map((product: any) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm text-foreground">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">${product.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="p-3 rounded-full bg-muted/50 inline-flex mb-3">
                    <Activity className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium">No revenue breakdown available</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">Create projects and start earning to see detailed analytics</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
