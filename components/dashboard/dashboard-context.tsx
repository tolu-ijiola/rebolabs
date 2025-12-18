'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/components/auth-context'
import { Project, Payment, Analytics } from '@/lib/database.types'
import { projectService, paymentService, analyticsService, dashboardStatsService } from '@/lib/services/supabase-service'

interface DashboardStats {
  stats: Array<{
    title: string
    value: string
    change: string
    trend: 'up' | 'down'
  }>
  monthlyRevenueData: Array<{ month: string; revenue: number }>
  userGrowthData: Array<{ month: string; users: number }>
  revenueByProduct: Array<{ name: string; value: number }>
}

interface DashboardContextType {
  // Data
  projects: Project[]
  stats: DashboardStats | null
  payments: Payment[]
  analytics: Analytics[]
  
  // Loading states
  loading: {
    projects: boolean
    stats: boolean
    payments: boolean
    analytics: boolean
  }
  
  // Error states
  errors: {
    projects: string | null
    stats: string | null
    payments: string | null
    analytics: string | null
  }
  
  // Actions
  refreshProjects: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshPayments: () => Promise<void>
  refreshAnalytics: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Project actions
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project | null>
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  // State
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  
  // Loading states
  const [loading, setLoading] = useState({
    projects: false,
    stats: false,
    payments: false,
    analytics: false
  })
  
  // Error states
  const [errors, setErrors] = useState({
    projects: null,
    stats: null,
    payments: null,
    analytics: null
  })

  // Track if data has been fetched to prevent infinite loops
  const hasFetched = useRef(false)

  // Helper function to update loading state
  const setLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  // Helper function to update error state
  const setErrorState = (key: keyof typeof errors, value: string | null) => {
    setErrors(prev => ({ ...prev, [key]: value }))
  }

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!user) return
    
    setLoadingState('projects', true)
    setErrorState('projects', null)
    
    try {
      const data = await projectService.getProjects(user.id)
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setErrorState('projects', error instanceof Error ? error.message : 'Failed to fetch projects')
    } finally {
      setLoadingState('projects', false)
    }
  }, [user])

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    if (!user) return
    
    setLoadingState('payments', true)
    setErrorState('payments', null)
    
    try {
      const data = await paymentService.getPayments(user.id)
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setErrorState('payments', error instanceof Error ? error.message : 'Failed to fetch payments')
    } finally {
      setLoadingState('payments', false)
    }
  }, [user])

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!user) return
    
    setLoadingState('analytics', true)
    setErrorState('analytics', null)
    
    try {
      const data = await analyticsService.getAnalyticsByUserId(user.id)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setErrorState('analytics', error instanceof Error ? error.message : 'Failed to fetch analytics')
    } finally {
      setLoadingState('analytics', false)
    }
  }, [user])

  // Calculate and fetch dashboard stats
  const fetchStats = useCallback(async () => {
    if (!user) return
    
    setLoadingState('stats', true)
    setErrorState('stats', null)
    
    try {
      const calculatedStats = await dashboardStatsService.getDashboardStats(user.id, projects)
      setStats(calculatedStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setErrorState('stats', error instanceof Error ? error.message : 'Failed to fetch stats')
    } finally {
      setLoadingState('stats', false)
    }
  }, [user, projects])

  // Refresh functions
  const refreshProjects = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  const refreshPayments = useCallback(async () => {
    await fetchPayments()
  }, [fetchPayments])

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics()
  }, [fetchAnalytics])

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchProjects(),
      fetchPayments(),
      fetchAnalytics()
    ])
  }, [fetchProjects, fetchPayments, fetchAnalytics])

  // Project actions
  const createProject = useCallback(async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> => {
    if (!user) return null
    
    try {
      const newProject = await projectService.createProject({
        ...project,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
      // Update local state directly instead of refetching
      setProjects(prev => [newProject, ...prev])
      
      // Recalculate stats with new project
      const newStats = await dashboardStatsService.getDashboardStats(user.id, [newProject, ...projects])
      setStats(newStats)
      
      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }, [user, projects])

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      const updatedProject = await projectService.updateProject(id, updates)
      
      // Update local state directly
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      
      // Recalculate stats
      const newProjects = projects.map(p => p.id === id ? updatedProject : p)
      const newStats = await dashboardStatsService.getDashboardStats(user?.id || '', newProjects)
      setStats(newStats)
      
      return updatedProject
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }, [projects, user])

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      await projectService.deleteProject(id)
      
      // Update local state directly
      setProjects(prev => prev.filter(p => p.id !== id))
      
      // Recalculate stats
      const newProjects = projects.filter(p => p.id !== id)
      const newStats = await dashboardStatsService.getDashboardStats(user?.id || '', newProjects)
      setStats(newStats)
      
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }, [projects, user])

  // Initial data fetch - only once when user changes
  useEffect(() => {
    if (user && !hasFetched.current) {
      hasFetched.current = true
      refreshAll()
    }
  }, [user]) // Only depend on user

  // Refresh stats when projects change (but only after initial fetch)
  useEffect(() => {
    if (user && hasFetched.current && projects.length > 0) {
      fetchStats()
    }
  }, [user, projects.length, hasFetched.current]) // Only depend on projects.length

  const value: DashboardContextType = {
    projects,
    stats,
    payments,
    analytics,
    loading,
    errors,
    refreshProjects,
    refreshStats,
    refreshPayments,
    refreshAnalytics,
    refreshAll,
    createProject,
    updateProject,
    deleteProject
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
