'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart } from '@/components/ui/chart'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  AppWindow,
  RefreshCw,
  Plus,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'

export default function DashboardPage() {
  const { user } = useAuth()
  const { projects, stats, loading, errors, refreshAll } = useDashboard()

  const handleRetry = () => {
    refreshAll()
  }

  // Show skeleton while loading
  if (loading.projects || loading.stats) {
    return <DashboardSkeleton />
  }

  // Show error state if there are errors
  if (errors.projects || errors.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">
            {errors.projects || errors.stats}
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
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

  // Show skeleton if no data yet
  if (!stats && !projects) {
    return <DashboardSkeleton />
  }

  const metrics = stats?.stats?.slice(0, 3).map((stat, index) => {
    const icons = [DollarSign, Users, TrendingUp]
    const iconColors = ['text-green-500', 'text-blue-500', 'text-purple-500']
    const bgColors = ['bg-green-500/10', 'bg-blue-500/10', 'bg-purple-500/10']
    
    const isPositive = stat.trend === 'up' && !stat.change.startsWith('-')
    const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    const ChangeIcon = isPositive ? TrendingUp : TrendingDown
    
    return {
      title: stat.title,
      value: stat.value,
      icon: icons[index] || DollarSign,
      iconColor: iconColors[index] || 'text-green-500',
      bgColor: bgColors[index] || 'bg-green-500/10',
      change: stat.change,
      changeColor,
      ChangeIcon,
      trend: stat.trend
    }
  }) || [
    { title: 'Total Revenue', value: '$0', icon: DollarSign, iconColor: 'text-green-500', bgColor: 'bg-green-500/10', change: '+0%', changeColor: 'text-muted-foreground', ChangeIcon: TrendingUp, trend: 'up' },
    { title: 'Active Projects', value: '0', icon: Users, iconColor: 'text-blue-500', bgColor: 'bg-blue-500/10', change: '+0%', changeColor: 'text-muted-foreground', ChangeIcon: TrendingUp, trend: 'up' },
    { title: 'Total Rewards', value: '0', icon: TrendingUp, iconColor: 'text-purple-500', bgColor: 'bg-purple-500/10', change: '+0%', changeColor: 'text-muted-foreground', ChangeIcon: TrendingUp, trend: 'up' },
  ]

  // Transform data to match Chart component interface
  const revenueData = (stats?.monthlyRevenueData || []).map(item => ({
    name: item.month,
    value: item.revenue
  }))
  
  const userGrowthData = (stats?.userGrowthData || []).map(item => ({
    name: item.month,
    value: item.users
  }))
  
  const monetizationSources = stats?.revenueByProduct || []

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Welcome back to your monetization dashboard</p>
        <h1 className="text-3xl font-bold text-foreground">
          Good {getGreeting()}! {user?.user_metadata?.full_name || 'User'},
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your revenue streams today</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric, index) => {
          return (
            <Card key={metric.title} className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">{metric.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-3">{metric.value}</p>
                    <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                      <span>{metric.change}</span>
                      <span className="text-muted-foreground/70">vs last period</span>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-muted/50 border border-border">
                      <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/70" />
                    </div>
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
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Revenue Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold text-foreground">
                ${revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total revenue this month</p>
            </div>
            {revenueData.length > 0 && revenueData.some(item => item.value > 0) ? (
            <Chart data={revenueData} type="line" height={250} />
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <LineChart className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No revenue data yet</p>
                <p className="text-xs text-muted-foreground/80">Create a project to start earning</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Surveys Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold text-foreground">
                {userGrowthData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total surveys completed</p>
            </div>
            {userGrowthData.length > 0 && userGrowthData.some(item => item.value > 0) ? (
            <Chart data={userGrowthData} type="bar" height={250} />
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No survey data yet</p>
                <p className="text-xs text-muted-foreground/80">Surveys will appear here once completed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {monetizationSources.length > 0 && monetizationSources.some(source => source.value > 0) ? (
              <Chart data={monetizationSources} type="pie" height={200} />
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="p-4 rounded-full bg-muted/50">
                    <PieChart className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium">No revenue breakdown</p>
                  <p className="text-xs text-muted-foreground/80">Revenue data will appear here</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Revenue Breakdown</h3>
              <div className="space-y-3">
                {monetizationSources.length > 0 && monetizationSources.some(source => source.value > 0) ? (
                  monetizationSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">{source.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{source.value}%</span>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 rounded-full bg-muted/50 inline-flex mb-3">
                      <Activity className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No revenue data available</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Start earning to see breakdown</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="space-y-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Name</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">App ID</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-medium text-foreground">{project.name}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                              <AppWindow className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">{project.type || 'Web'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-foreground">{project.app_id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative inline-block group">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              project.status === 'active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                              project.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                              'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {project.status === 'active' ? 'Active' : 
                               project.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                            {project.status === 'pending' && (
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-xl border border-border whitespace-nowrap">
                                  We're reviewing your project and will approve it as soon as possible
                                  <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-4 rounded-full bg-muted/50">
                            <AppWindow className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground mb-1">No projects yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Create your first project to start monetizing</p>
                            <Button 
                              onClick={() => window.location.href = '/dashboard/projects'} 
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Project
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="bg-card border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{project.app_id}</p>
                        </div>
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ml-2 ${
                          project.status === 'active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                          project.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {project.status === 'active' ? 'Active' : 
                           project.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-border">
                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                          <AppWindow className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{project.type || 'Web'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 rounded-full bg-muted/50">
                      <AppWindow className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">No projects yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Create your first project to start monetizing</p>
                      <Button 
                        onClick={() => window.location.href = '/dashboard/projects'} 
                        size="sm"
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}
