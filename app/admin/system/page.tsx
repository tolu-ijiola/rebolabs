'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Server, 
  Database, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Edit,
  Save,
  X,
  Activity,
  Users,
  Smartphone,
  DollarSign
} from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { SystemStatusService } from '@/lib/services/system-status'
import { format } from 'date-fns'


interface SystemStatus {
  id: string
  service: string
  status: 'online' | 'offline' | 'degraded'
  last_check: string
  response_time?: number
  error_message?: string
  uptime_percentage?: number
  notes?: string
}

interface SystemStats {
  totalUsers: number
  totalApps: number
  totalPayouts: number
  totalRevenue: number
  activeUsers: number
  pendingPayouts: number
}

export default function SystemPage() {
  const { supabase } = useSupabase()
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<SystemStatus | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    notes: ''
  })

  useEffect(() => {
    fetchSystemData()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      setLoading(true)
      
      // Fetch system status
      const statusData = await SystemStatusService.getSystemStatus()
      setSystemStatus(statusData)

      // Fetch system stats
      const [usersResult, appsResult, payoutsResult, analyticsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('payouts').select('id, total_payout', { count: 'exact' }),
        supabase.from('analytics').select('revenue_usd')
      ])

      const totalUsers = usersResult.count || 0
      const totalApps = appsResult.count || 0
      const totalPayouts = payoutsResult.count || 0
      const totalRevenue = analyticsResult.data?.reduce((sum, item) => sum + (item.revenue_usd || 0), 0) || 0

      // Get active users (users with activity in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { count: activeUsers } = await supabase
        .from('analytics')
        .select('publisher_id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get pending payouts
      const { count: pendingPayouts } = await supabase
        .from('payouts')
        .select('id', { count: 'exact' })
        .eq('status', 'Pending')

      setSystemStats({
        totalUsers,
        totalApps,
        totalPayouts,
        totalRevenue,
        activeUsers: activeUsers || 0,
        pendingPayouts: pendingPayouts || 0
      })

    } catch (error) {
      console.error('Error fetching system data:', error)
      setMessage('Error loading system data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (statusId: string, newStatus: string, notes?: string) => {
    try {
      setSaving(true)
      
      await SystemStatusService.updateSystemStatus(statusId, {
        status: newStatus as 'online' | 'offline' | 'degraded',
        notes: notes || '',
        last_check: new Date().toISOString()
      })

      setMessage('System status updated successfully!')
      await fetchSystemData()
      setIsEditOpen(false)
    } catch (error) {
      console.error('Error updating system status:', error)
      setMessage('Error updating system status')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleEditStatus = (status: SystemStatus) => {
    setEditingStatus(status)
    setEditForm({
      status: status.status,
      notes: status.notes || ''
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingStatus) return
    await handleStatusUpdate(editingStatus.id, editForm.status, editForm.notes)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'online': { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50', icon: CheckCircle },
      'offline': { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50', icon: AlertTriangle },
      'degraded': { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/50', icon: Clock }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline
    const Icon = config.icon
    
    return (
      <Badge className={`${config.bg} ${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getOverallStatus = () => {
    if (systemStatus.length === 0) return 'unknown'
    
    const hasOffline = systemStatus.some(s => s.status === 'offline')
    const hasDegraded = systemStatus.some(s => s.status === 'degraded')
    
    if (hasOffline) return 'offline'
    if (hasDegraded) return 'degraded'
    return 'online'
  }

  const overallStatus = getOverallStatus()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Status</h1>
          <p className="text-muted-foreground">Monitor system health and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(overallStatus)}
          <Button onClick={fetchSystemData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.includes('successfully')
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message.includes('successfully') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* System Stats */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Apps</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.totalApps}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${systemStats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.activeUsers}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Service Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {systemStatus.length === 0 ? (
            <div className="text-center py-8">
              <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Services</h3>
              <p className="text-muted-foreground">No system services are currently being monitored.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {systemStatus.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {status.service === 'Database' ? (
                        <Database className="w-6 h-6 text-primary" />
                      ) : status.service === 'API' ? (
                        <Globe className="w-6 h-6 text-primary" />
                      ) : (
                        <Server className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{status.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last check: {format(new Date(status.last_check), 'PPp')}
                        {status.response_time && ` • ${status.response_time}ms`}
                        {status.uptime_percentage && ` • ${status.uptime_percentage}% uptime`}
                      </p>
                      {status.error_message && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {status.error_message}
                        </p>
                      )}
                      {status.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {status.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStatus(status)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Status Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit System Status</DialogTitle>
          </DialogHeader>
          {editingStatus && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  value={editingStatus.service}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="online">Online</option>
                  <option value="degraded">Degraded</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this service status..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}