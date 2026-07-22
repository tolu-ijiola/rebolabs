'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Smartphone,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { ActivityLogger } from '@/lib/services/activity-logger'
import { useAuth } from '@/components/auth-context'

interface Project {
  id: string
  app_id: string
  name: string
  link: string
  type: string
  status: 'pending' | 'active' | 'rejected'
  user_id: string
  created_at: string
  updated_at: string
  users: {
    email: string
    full_name: string
  }
}

const PAGE_SIZE = 20

export default function AppsPage() {
  const { supabase } = useSupabase()
  const { user: currentUser } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [activeCount, setActiveCount] = useState(0)

  const fetchProjects = useCallback(async (currentPage: number, search: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('projects')
        .select(`*, users!projects_user_id_fkey(email, full_name)`, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (search.trim()) {
        query = (query as any).or(`name.ilike.%${search}%,app_id.ilike.%${search}%`)
      }

      const { data, error, count } = await query
      if (error) throw error
      setProjects(data || [])
      setTotalCount(count || 0)

      // Get status counts separately (unfiltered)
      const { data: statusData } = await supabase
        .from('projects')
        .select('status')
      const all = statusData || []
      setPendingCount(all.filter((p: any) => p.status === 'pending').length)
      setActiveCount(all.filter((p: any) => p.status === 'active').length)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const delay = setTimeout(() => { setPage(0); fetchProjects(0, searchTerm) }, 300)
    return () => clearTimeout(delay)
  }, [searchTerm, fetchProjects])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProjects(page, searchTerm) }, [page])

  const handleStatusChange = async (projectId: string, status: 'active' | 'rejected', reason?: string) => {
    if (!currentUser) return
    setActionLoading(projectId)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', projectId)
      if (error) throw error
      await ActivityLogger.logProjectAction(currentUser.id, `Project ${status}`, projectId, { status, reason })
      await fetchProjects(page, searchTerm)
    } catch (error) {
      console.error(`Error ${status} project:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
    if (status === 'rejected') return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Rejected</Badge>
    if (status === 'pending') return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>
    return <Badge variant="secondary">{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">App Management</h1>
        <p className="text-muted-foreground">Review and manage submitted applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Apps</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search apps by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              aria-label="Search apps"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" aria-hidden="true" />
              Applications ({totalCount})
            </span>
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">Page {page + 1} of {totalPages}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No applications found</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center" aria-hidden="true">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{project.name}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">App ID: {project.app_id}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3" aria-hidden="true" />
                          <span>{project.users?.email || 'Unknown'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          <span>Submitted {new Date(project.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name}`}>
                        <ExternalLink className="w-4 h-4 mr-1" aria-hidden="true" />
                        Visit
                      </a>
                    </Button>

                    {project.status === 'pending' && (
                      <>
                        <Button
                          variant="default" size="sm"
                          onClick={() => handleStatusChange(project.id, 'active')}
                          disabled={actionLoading === project.id}
                          aria-label={`Approve ${project.name}`}
                        >
                          {actionLoading === project.id
                            ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            : <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />}
                          Approve
                        </Button>
                        <Button
                          variant="destructive" size="sm"
                          onClick={() => {
                            const reason = prompt('Enter rejection reason (optional):')
                            handleStatusChange(project.id, 'rejected', reason || undefined)
                          }}
                          disabled={actionLoading === project.id}
                          aria-label={`Reject ${project.name}`}
                        >
                          {actionLoading === project.id
                            ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            : <XCircle className="w-4 h-4 mr-1" aria-hidden="true" />}
                          Reject
                        </Button>
                      </>
                    )}

                    {project.status !== 'pending' && (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => handleStatusChange(project.id, project.status === 'active' ? 'rejected' : 'active')}
                        disabled={actionLoading === project.id}
                      >
                        {actionLoading === project.id
                          ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          : <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />}
                        {project.status === 'active' ? 'Reject' : 'Approve'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page * PAGE_SIZE + 1}&ndash;{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                  </span>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    aria-label="Next page"
                  >
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
