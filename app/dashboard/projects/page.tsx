'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, Users, Clock, CheckCircle, AlertCircle, Pause, DollarSign, Target, TrendingUp, ExternalLink, Edit, Trash2, Settings } from 'lucide-react'
import { NewProjectModal } from '@/components/dashboard/new-project-modal'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ProjectsPage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const { projects, loading, errors, refreshProjects } = useDashboard()

  const handleProjectCreated = () => {
    setIsNewProjectOpen(false)
    // No need to manually refresh since the context handles it
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Show skeleton while loading
  if (loading.projects) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show error state if there are errors
  if (errors.projects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Error Loading Projects</h2>
          <p className="text-muted-foreground">{errors.projects}</p>
          <Button onClick={() => refreshProjects()} className="w-full">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your monetization projects</p>
        </div>
        <Button 
          onClick={() => setIsNewProjectOpen(true)} 
          size="sm"
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
          <Card key={project.id} className="bg-card border-border hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg font-semibold text-foreground truncate">{project.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate" title={project.link}>{project.link}</p>
                </div>
                  <div className="relative group shrink-0">
                    <Badge className={cn("", getStatusColor(project.status))}>
                      {project.status === 'active' ? 'Active' : 
                       project.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                    {project.status === 'pending' && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                        <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-xl border border-border whitespace-nowrap">
                          We're reviewing your project and will approve it as soon as possible
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Type</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate text-right">{project.type || 'Web'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">App ID</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground font-mono truncate text-right" title={project.app_id}>{project.app_id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Currency</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate text-right">{project.currency_name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Revenue</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate text-right">${project.revenue || 0}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Details
                      </Link>
                  </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Visit
                      </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first project to start monetizing your app or website</p>
            <Button 
              onClick={() => setIsNewProjectOpen(true)} 
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        open={isNewProjectOpen} 
        onOpenChange={setIsNewProjectOpen} 
        onProjectCreated={handleProjectCreated} 
      />
    </div>
  )
}
