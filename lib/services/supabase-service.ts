import { supabase } from '../supabase'
import { Project, Payment, Analytics, ProjectInsert, PaymentInsert, AnalyticsInsert } from '../database.types'

// Projects Service
export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getProjectByAppId(appId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('app_id', appId)
      .single()

    if (error) throw error
    return data
  },

  async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Payments Service
export const paymentService = {
  async getPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getPayment(transactionId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single()

    if (error) throw error
    return data
  },

  async createPayment(payment: PaymentInsert): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePayment(transactionId: string, updates: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('transaction_id', transactionId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Analytics Service
export const analyticsService = {
  async getAllAnalytics(): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('full_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAnalyticsByAppId(appId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('app_id', appId)
      .order('full_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAnalyticsByUserId(userId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .order('full_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAnalyticsByPublisher(publisherId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('publisher_id', publisherId)
      .order('full_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createAnalytics(analytics: AnalyticsInsert): Promise<Analytics> {
    const { data, error } = await supabase
      .from('analytics')
      .insert(analytics)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getMonthlyRevenueByApp(appId: string, year: number): Promise<{ month: string; revenue: number }[]> {
    if (!appId) return []
    
    const { data, error } = await supabase
      .from('analytics')
      .select('month, revenue_usd')
      .eq('app_id', appId)
      .eq('year', year)
      .eq('history_type', 'reward')
      .order('month', { ascending: true })

    if (error) throw error

    // Group by month and sum revenue
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0 }))
    
    data?.forEach(item => {
      monthlyData[item.month - 1].revenue += item.revenue_usd
    })

    return monthlyData.map(item => ({
      month: new Date(2024, item.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item.revenue
    }))
  },

  async getUserGrowthByApp(appId: string, year: number): Promise<{ month: string; users: number }[]> {
    if (!appId) return []
    
    const { data, error } = await supabase
      .from('analytics')
      .select('month, user_id')
      .eq('app_id', appId)
      .eq('year', year)
      .eq('history_type', 'reward')

    if (error) throw error

    // Group by month and count unique users
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, users: new Set<string>() }))
    
    data?.forEach(item => {
      monthlyData[item.month - 1].users.add(item.user_id)
    })

    return monthlyData.map(item => ({
      month: new Date(2024, item.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      users: item.users.size
    }))
  },

  async getRevenueByHistoryType(appId: string): Promise<{ name: string; value: number }[]> {
    if (!appId) return []
    
    const { data, error } = await supabase
      .from('analytics')
      .select('history_type, revenue_usd')
      .eq('app_id', appId)
      .gte('full_date', new Date(new Date().getFullYear(), 0, 1).toISOString())

    if (error) throw error

    // Group by history type and sum revenue
    const grouped = (data || []).reduce((acc, item) => {
      acc[item.history_type] = (acc[item.history_type] || 0) + item.revenue_usd
      return acc
    }, {} as Record<string, number>)

    // If no data, return empty array instead of default values
    if (Object.keys(grouped).length === 0) {
      return []
    }

    return Object.entries(grouped).map(([name, value]) => ({ 
      name: name === 'reward' ? 'Rewards' : 'Reconciliation', 
      value: Math.round(value) 
    }))
  }
}

// Dashboard Stats Service
export const dashboardStatsService = {
  async getDashboardStats(userId: string, projects: Project[]): Promise<{
    stats: Array<{ title: string; value: string; change: string; trend: 'up' | 'down' }>
    monthlyRevenueData: Array<{ month: string; revenue: number }>
    userGrowthData: Array<{ month: string; users: number }>
    revenueByProduct: Array<{ name: string; value: number }>
  }> {
    try {
      // Get all analytics for user's projects
      const projectAppIds = projects.map(p => p.app_id)
      
      if (projectAppIds.length === 0) {
        return {
          stats: [
            { title: 'Total Revenue', value: '$0', change: '+0%', trend: 'up' },
            { title: 'Active Projects', value: '0', change: '+0%', trend: 'up' },
            { title: 'Total Rewards', value: '0', change: '+0%', trend: 'up' },
            { title: 'Total Reconciliations', value: '0', change: '+0%', trend: 'up' }
          ],
          monthlyRevenueData: [],
          userGrowthData: [],
          revenueByProduct: []
        }
      }

      // Get analytics for all projects
      const { data: analyticsData, error } = await supabase
        .from('analytics')
        .select('*')
        .in('app_id', projectAppIds)
        .order('full_date', { ascending: false })

      if (error) throw error

      const flatAnalytics = analyticsData || []
      const totalRevenue = flatAnalytics.reduce((sum, item) => sum + (item.revenue_usd || 0), 0)
      const totalRewards = flatAnalytics.filter(item => item.history_type === 'reward').length
      const totalReconciliations = flatAnalytics.filter(item => item.history_type === 'reconciliation').length
      const activeProjects = projects.filter(p => p.status === 'active').length

      // Calculate monthly revenue data
      const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const monthRevenue = flatAnalytics
          .filter(item => item.month === month && item.history_type === 'reward')
          .reduce((sum, item) => sum + (item.revenue_usd || 0), 0)
        
        return {
          month: new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'short' }),
          revenue: monthRevenue
        }
      })

      // Calculate user growth data
      const userGrowthData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const monthUsers = new Set(
          flatAnalytics
            .filter(item => item.month === month && item.history_type === 'reward')
            .map(item => item.user_id)
        )
        
        return {
          month: new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'short' }),
          users: monthUsers.size
        }
      })

      // Calculate revenue by history type
      const revenueByHistoryType = flatAnalytics.reduce((acc, item) => {
        const type = item.history_type === 'reward' ? 'Rewards' : 'Reconciliation'
        acc[type] = (acc[type] || 0) + (item.revenue_usd || 0)
        return acc
      }, {} as Record<string, number>)

      const revenueByProduct = Object.entries(revenueByHistoryType).map(([name, value]) => ({
        name,
        value: Math.round(value)
      }))

      return {
        stats: [
          { 
            title: 'Total Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            change: totalRevenue > 0 ? '+20.1%' : '+0%', 
            trend: 'up' 
          },
          { 
            title: 'Active Projects', 
            value: activeProjects.toString(), 
            change: activeProjects > 0 ? '+180.1%' : '+0%', 
            trend: 'up' 
          },
          { 
            title: 'Total Rewards', 
            value: totalRewards.toString(), 
            change: totalRewards > 0 ? '+19%' : '+0%', 
            trend: 'up' 
          },
          { 
            title: 'Total Reconciliations', 
            value: totalReconciliations.toString(), 
            change: totalReconciliations > 0 ? '-2.1%' : '+0%', 
            trend: 'down' 
          }
        ],
        monthlyRevenueData,
        userGrowthData,
        revenueByProduct
      }
    } catch (error) {
      console.error('Error calculating dashboard stats:', error)
      return {
        stats: [
          { title: 'Total Revenue', value: '$0', change: '+0%', trend: 'up' },
          { title: 'Active Projects', value: '0', change: '+0%', trend: 'up' },
          { title: 'Total Rewards', value: '0', change: '+0%', trend: 'up' },
          { title: 'Total Reconciliations', value: '0', change: '+0%', trend: 'up' }
        ],
        monthlyRevenueData: [],
        userGrowthData: [],
        revenueByProduct: []
      }
    }
  }
}
