'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Chart } from '@/components/ui/chart'
import { useSupabase } from '@/components/supabase-context'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

interface MonthlyRevenue {
  label: string
  Revenue: number
  Reconciliation: number
}

interface ProjectRevenue {
  app_id: string
  name: string
  revenue: number
  completions: number
  reconciliations: number
}

interface ReportStats {
  totalRevenue: number
  totalReconciliation: number
  netRevenue: number
  totalCompletions: number
  totalReconciliations: number
  avgRevenuePerCompletion: number
}

export default function AdminReportsPage() {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([])
  const [projects, setProjects] = useState<ProjectRevenue[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0]

      const { data: analytics } = await supabase
        .from('analytics')
        .select('app_id, revenue_usd, history_type, month, year')
        .gte('full_date', sixMonthsAgoStr)
        .order('year', { ascending: true })
        .order('month', { ascending: true })

      const { data: projectList } = await supabase
        .from('projects')
        .select('app_id, name')
        .eq('status', 'active')

      const projectMap: Record<string, string> = {}
      projectList?.forEach(p => { projectMap[p.app_id] = p.name })

      const rows = analytics || []

      // Monthly breakdown
      const monthlyMap: Record<string, { revenue: number; reconciliation: number }> = {}
      rows.forEach(r => {
        const key = `${r.year}-${String(r.month).padStart(2, '0')}`
        if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, reconciliation: 0 }
        if (r.history_type === 'reward') monthlyMap[key].revenue += r.revenue_usd || 0
        if (r.history_type === 'reconciliation') monthlyMap[key].reconciliation += Math.abs(r.revenue_usd || 0)
      })

      const monthlyData: MonthlyRevenue[] = Object.entries(monthlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => {
          const [year, month] = key.split('-')
          const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            month: 'short', year: '2-digit'
          })
          return {
            label,
            Revenue: parseFloat(v.revenue.toFixed(2)),
            Reconciliation: parseFloat(v.reconciliation.toFixed(2)),
          }
        })

      // Per-project breakdown
      const projectRevenueMap: Record<string, ProjectRevenue> = {}
      rows.forEach(r => {
        if (!r.app_id) return
        if (!projectRevenueMap[r.app_id]) {
          projectRevenueMap[r.app_id] = {
            app_id: r.app_id,
            name: projectMap[r.app_id] || r.app_id,
            revenue: 0,
            completions: 0,
            reconciliations: 0,
          }
        }
        if (r.history_type === 'reward') {
          projectRevenueMap[r.app_id].revenue += r.revenue_usd || 0
          projectRevenueMap[r.app_id].completions += 1
        }
        if (r.history_type === 'reconciliation') {
          projectRevenueMap[r.app_id].reconciliations += 1
        }
      })

      const projectData = Object.values(projectRevenueMap)
        .sort((a, b) => b.revenue - a.revenue)

      const totalRevenue = rows
        .filter(r => r.history_type === 'reward')
        .reduce((s, r) => s + (r.revenue_usd || 0), 0)
      const totalReconciliation = rows
        .filter(r => r.history_type === 'reconciliation')
        .reduce((s, r) => s + Math.abs(r.revenue_usd || 0), 0)
      const totalCompletions = rows.filter(r => r.history_type === 'reward').length
      const totalReconciliations = rows.filter(r => r.history_type === 'reconciliation').length

      setMonthly(monthlyData)
      setProjects(projectData)
      setStats({
        totalRevenue,
        totalReconciliation,
        netRevenue: totalRevenue - totalReconciliation,
        totalCompletions,
        totalReconciliations,
        avgRevenuePerCompletion: totalCompletions > 0 ? totalRevenue / totalCompletions : 0,
      })
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const statCards = stats
    ? [
        {
          title: 'Gross Revenue',
          value: `$${stats.totalRevenue.toFixed(2)}`,
          sub: 'All completions (6 months)',
          icon: DollarSign,
          color: 'text-green-500',
        },
        {
          title: 'Reconciliations',
          value: `$${stats.totalReconciliation.toFixed(2)}`,
          sub: `${stats.totalReconciliations} adjustments`,
          icon: TrendingDown,
          color: 'text-red-500',
        },
        {
          title: 'Net Revenue',
          value: `$${stats.netRevenue.toFixed(2)}`,
          sub: 'Gross minus reconciliations',
          icon: TrendingUp,
          color: 'text-blue-500',
        },
        {
          title: 'Avg per Completion',
          value: `$${stats.avgRevenuePerCompletion.toFixed(4)}`,
          sub: `${stats.totalCompletions.toLocaleString()} total completions`,
          icon: BarChart3,
          color: 'text-purple-500',
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Revenue Reports</h1>
          <p className="text-muted-foreground">Platform earnings breakdown — last 6 months</p>
        </div>
        <Button variant="outline" onClick={fetchReports} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(card => (
              <Card key={card.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${card.color}`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {monthly.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue vs Reconciliations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={monthly.map(m => ({ name: m.label, Revenue: m.Revenue, Reconciliation: m.Reconciliation }))}
                    type="bar"
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Net Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={monthly.map(m => ({
                      name: m.label,
                      Net: parseFloat((m.Revenue - m.Reconciliation).toFixed(2)),
                    }))}
                    type="line"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Project</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No project data available yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Completions</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Reconciliations</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Gross Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => {
                        const reconRate = p.completions > 0
                          ? ((p.reconciliations / p.completions) * 100).toFixed(1)
                          : '0.0'
                        const rate = parseFloat(reconRate)
                        return (
                          <tr key={p.app_id} className="border-b border-border last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{p.app_id}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-foreground">{p.completions.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-red-500">{p.reconciliations.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-green-500">
                              ${p.revenue.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              {rate < 5 ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {reconRate}% recon
                                </Badge>
                              ) : rate < 15 ? (
                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {reconRate}% recon
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  {reconRate}% recon
                                </Badge>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
