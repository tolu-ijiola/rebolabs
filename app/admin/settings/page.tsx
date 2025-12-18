'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Database,
  Mail,
  Shield,
  Bell,
  DollarSign
} from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'

interface SystemSettings {
  id: string
  key: string
  value: string
  description: string
  category: string
  updated_at: string
}

export default function AdminSettingsPage() {
  const { supabase } = useSupabase()
  const [settings, setSettings] = useState<SystemSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error
      setSettings(data || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage('Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = async (key: string, value: string) => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)

      if (error) throw error

      setSettings(prev => prev.map(setting => 
        setting.key === key ? { ...setting, value, updated_at: new Date().toISOString() } : setting
      ))

      setMessage('Setting updated successfully!')
    } catch (error) {
      console.error('Error updating setting:', error)
      setMessage('Error updating setting')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={fetchSettings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>General</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.find(s => s.key === 'site_name')?.value || 'ReboLabs'}
                onChange={(e) => handleSettingChange('site_name', e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label>Maintenance Mode</Label>
              <Switch
                checked={settings.find(s => s.key === 'maintenance_mode')?.value === 'true'}
                onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked.toString())}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Switch
                checked={settings.find(s => s.key === 'two_factor_enabled')?.value === 'true'}
                onCheckedChange={(checked) => handleSettingChange('two_factor_enabled', checked.toString())}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (seconds)</Label>
              <Input
                type="number"
                value={settings.find(s => s.key === 'session_timeout')?.value || '3600'}
                onChange={(e) => handleSettingChange('session_timeout', e.target.value)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Payout Amount</Label>
              <Input
                type="number"
                value={settings.find(s => s.key === 'min_payout_amount')?.value || '100'}
                onChange={(e) => handleSettingChange('min_payout_amount', e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label>Auto Approve Apps</Label>
              <Switch
                checked={settings.find(s => s.key === 'auto_approve_apps')?.value === 'true'}
                onCheckedChange={(checked) => handleSettingChange('auto_approve_apps', checked.toString())}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enable Notifications</Label>
              <Switch
                checked={settings.find(s => s.key === 'notifications_enabled')?.value === 'true'}
                onCheckedChange={(checked) => handleSettingChange('notifications_enabled', checked.toString())}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <Switch
                checked={settings.find(s => s.key === 'email_notifications')?.value === 'true'}
                onCheckedChange={(checked) => handleSettingChange('email_notifications', checked.toString())}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}