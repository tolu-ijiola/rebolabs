'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Globe, 
  DollarSign, 
  Key, 
  Link as LinkIcon,
  Palette,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Settings,
  TrendingUp,
  Zap,
  Copy
} from 'lucide-react'
import { projectService } from '@/lib/services/supabase-service'
import { Project } from '@/lib/database.types'
import { useAuth } from '@/components/auth-context'
import { toast } from 'sonner'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const projectId = params.project_id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Project>>({})

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await projectService.getProject(projectId)
        if (data) {
          setProject(data)
          setEditData({
            name: data.name,
            link: data.link,
            type: data.type,
            currency_name: data.currency_name,
            currency_value: data.currency_value,
            show_value: data.show_value,
            custom_logo: data.custom_logo,
            primary_color: data.primary_color,
            reward_callback: data.reward_callback,
            reconciliation_callback: data.reconciliation_callback,
            demo: data.demo
          })
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleSave = async () => {
    if (!project || !user) return

    try {
      setSaving(true)
      const updatedProject = await projectService.updateProject(projectId, editData)
      if (updatedProject) {
        setProject(updatedProject)
        setIsEditing(false)
        // Show success message or toast
      }
    } catch (err) {
      console.error('Error updating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (project) {
      setEditData({
        name: project.name,
        link: project.link,
        type: project.type,
        currency_name: project.currency_name,
        currency_value: project.currency_value,
        show_value: project.show_value,
        custom_logo: project.custom_logo,
        primary_color: project.primary_color,
        reward_callback: project.reward_callback,
        reconciliation_callback: project.reconciliation_callback,
        demo: project.demo
      })
    }
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-full bg-red-500/10 inline-flex mb-2">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Error Loading Project</h2>
            <p className="text-sm text-muted-foreground">{error || 'Project not found'}</p>
          </div>
          <Button onClick={() => router.back()} size="sm" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Check if user owns this project
  const isOwner = user?.id === project.user_id

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
            className="shrink-0 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Project ID: <span className="font-mono text-xs">{project.app_id}</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative group">
            <Badge variant="outline" className={`${getStatusColor(project.status)} border text-sm px-3 py-1.5`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <span className="capitalize font-medium">{project.status}</span>
              </div>
            </Badge>
            {project.status === 'pending' && (
              <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-xl border border-border whitespace-nowrap">
                  We're reviewing your project and will approve it as soon as possible
                  <div className="absolute left-4 top-0 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${project.revenue.toFixed(2)}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border shrink-0">
                <DollarSign className="w-4 h-4 text-foreground/70" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Project Type</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground capitalize">
                  {project.type || 'Web App'}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border shrink-0">
                <Globe className="w-4 h-4 text-foreground/70" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Currency</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  {project.currency_name}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border shrink-0">
                <Zap className="w-4 h-4 text-foreground/70" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Demo Mode</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  {project.demo ? 'Testing' : 'Live'}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border shrink-0">
                <TrendingUp className="w-4 h-4 text-foreground/70" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium data-[state=active]:bg-card">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm font-medium data-[state=active]:bg-card">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="monetization" className="text-xs sm:text-sm font-medium data-[state=active]:bg-card">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Monetization</span>
            <span className="sm:hidden">Money</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs sm:text-sm font-medium data-[state=active]:bg-card">
            <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Integrations</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Basic Information</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Project Name</Label>
                    {isEditing ? (
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Project name"
                        className="h-10"
                      />
                    ) : (
                      <p className="text-foreground font-medium text-lg">{project.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Project URL</Label>
                    {isEditing ? (
                      <Input
                        value={editData.link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="https://your-project.com"
                        className="h-10"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-foreground font-medium text-lg truncate flex-1">{project.link}</p>
                        <Button variant="ghost" size="sm" asChild className="shrink-0">
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Project Type</Label>
                    {isEditing ? (
                      <Select
                        value={editData.type || ''}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web App</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-foreground font-medium text-lg capitalize">
                        {project.type || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                      <p className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()} at {new Date(project.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                      <p className="text-sm text-muted-foreground">
                      {new Date(project.updated_at).toLocaleDateString()} at {new Date(project.updated_at).toLocaleTimeString()}
                    </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Technical Details */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Technical Details</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">App ID</Label>
                    <p className="text-sm font-mono bg-muted p-3 rounded-lg break-all">
                      {project.app_id}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Publisher User ID</Label>
                    <p className="text-sm font-mono bg-muted p-3 rounded-lg break-all">
                      {project.user_id}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant="outline" className={`${getStatusColor(project.status)} border text-sm px-3 py-1.5`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <span className="capitalize font-medium">{project.status}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Demo Mode</Label>
                    {isEditing ? (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {editData.demo ? 'Testing Mode' : 'Live Mode'}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {editData.demo 
                              ? 'Project is in testing mode for development' 
                              : 'Project is live and generating real revenue'
                            }
                          </p>
                        </div>
                        <Switch
                          checked={editData.demo || false}
                          onCheckedChange={(checked) => setEditData(prev => ({ ...prev, demo: checked }))}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Switch checked={project.demo} disabled />
                        <span className="text-sm text-muted-foreground">
                          {project.demo ? 'Testing Mode' : 'Live Mode'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Settings */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Visual Settings</CardTitle>
              </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Custom Logo URL</Label>
                    {isEditing ? (
                      <Input
                        value={editData.custom_logo || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, custom_logo: e.target.value }))}
                        placeholder="https://your-logo.com/logo.png"
                        className="h-10"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-lg">
                      <p className="text-foreground font-medium">
                        {project.custom_logo || 'No custom logo set'}
                      </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Primary Color</Label>
                    {isEditing ? (
                      <div className="flex items-center space-x-3">
                      <Input
                        value={editData.primary_color || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, primary_color: e.target.value }))}
                        placeholder="#3B82F6"
                          className="h-10 flex-1"
                        />
                        <Input
                        type="color"
                          value={editData.primary_color || '#3B82F6'}
                          onChange={(e) => setEditData(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="w-12 h-10 p-1 rounded border"
                      />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-10 rounded-lg border-2 border-border"
                          style={{ backgroundColor: project.primary_color || '#3B82F6' }}
                        />
                        <p className="text-foreground font-medium">
                          {project.primary_color || 'Default blue (#3B82F6)'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            {/* Display Settings */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Display Settings</CardTitle>
              </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Show Currency Value to Users</Label>
                    {isEditing ? (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">
                          Display the currency value to users in surveys
                        </span>
                        <Switch
                          checked={editData.show_value || false}
                          onCheckedChange={(checked) => setEditData(prev => ({ ...prev, show_value: checked }))}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">
                          Display the currency value to users in surveys
                        </span>
                        <Switch checked={project.show_value} disabled />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      When enabled, users will see the actual currency value they're earning
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Currency Settings */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Currency Settings</CardTitle>
              </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Currency Name</Label>
                    {isEditing ? (
                      <Input
                        value={editData.currency_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, currency_name: e.target.value }))}
                        placeholder="USD"
                        className="h-10"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-lg">
                      <p className="text-foreground font-medium">{project.currency_name}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Your app's currency (e.g., USD, EUR, or custom in-app currency like "Gems", "Coins")
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Currency Value Ratio</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.currency_value || 0}
                        onChange={(e) => setEditData(prev => ({ ...prev, currency_value: parseFloat(e.target.value) || 0 }))}
                        placeholder="100"
                        min="0"
                        step="0.01"
                        className="h-10"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-lg">
                      <p className="text-foreground font-medium">{project.currency_value}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      This represents how much your app currency is worth (e.g., 100 = $1.00)
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Revenue Tracking */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Revenue Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Current Revenue</Label>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      ${project.revenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total earnings from this project
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Revenue Status</Label>
                  <Badge 
                    variant="outline" 
                    className={`capitalize px-3 py-1.5 border ${
                      project.demo 
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' 
                        : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                    }`}
                  >
                    {project.demo ? 'Testing Mode' : 'Live Mode'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {project.demo 
                      ? 'Project is running in testing mode for development' 
                      : 'Project is live and generating real revenue'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Iframe Integration */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base sm:text-lg font-semibold">Iframe Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Iframe Code</Label>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code className="text-foreground whitespace-pre-wrap font-mono">{`<iframe 
  src="https://wall.rebolabs.ai/?app_id=${project.app_id}&user_id={user_id}"
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="payment; fullscreen"
></iframe>`}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const iframeCode = `<iframe 
  src="https://wall.rebolabs.ai/?app_id=${project.app_id}&user_id={user_id}"
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="payment; fullscreen"
></iframe>`
                      navigator.clipboard.writeText(iframeCode)
                      toast.success('Iframe code copied to clipboard')
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Replace {'{user_id}'} with your actual user ID when implementing
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Direct Link</Label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-muted p-3 rounded-lg flex-1 break-all">
                    https://wall.rebolabs.ai/?app_id={project.app_id}&user_id={'{user_id}'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      const link = `https://wall.rebolabs.ai/?app_id=${project.app_id}&user_id={user_id}`
                      navigator.clipboard.writeText(link)
                      toast.success('Link copied to clipboard')
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Replace {'{user_id}'} with your actual user ID
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">API Keys</CardTitle>
              </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Secret Key</Label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-mono bg-muted p-3 rounded-lg flex-1 break-all">
                        {project.secret_key}
                      </p>
                      <Button variant="outline" size="sm" className="shrink-0" onClick={() => {
                          if (project.secret_key) {
                            navigator.clipboard.writeText(project.secret_key)
                            toast.success('Secret key copied to clipboard')
                          }
                        }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this key for client-side integrations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Server Key</Label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-mono bg-muted p-3 rounded-lg flex-1 break-all">
                        {project.server_key}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => {
                          if (project.server_key) {
                            navigator.clipboard.writeText(project.server_key)
                            toast.success('Server key copied to clipboard')
                          }
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this key for server-side operations
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Callback URLs */}
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg font-semibold">Callback URLs</CardTitle>
              </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Reward Callback URL</Label>
                    {isEditing ? (
                      <Input
                        value={editData.reward_callback || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, reward_callback: e.target.value }))}
                        placeholder="https://your-app.com/reward-callback"
                        className="h-10"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-foreground font-medium break-all">
                        {project.reward_callback || 'No callback URL set'}
                      </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      URL to notify when users complete surveys
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Reconciliation Callback URL</Label>
                    {isEditing ? (
                      <Input
                        value={editData.reconciliation_callback || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, reconciliation_callback: e.target.value }))}
                        placeholder="https://your-app.com/reconciliation-callback"
                        className="h-10"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-foreground font-medium break-all">
                        {project.reconciliation_callback || 'No callback URL set'}
                      </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      URL to notify for payment reconciliations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
      </Tabs>
    </div>
  )
}
