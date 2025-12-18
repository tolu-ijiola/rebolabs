'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User, Mail, Bell, Shield, Palette, Save, CheckCircle, AlertCircle, Settings as SettingsIcon, Monitor, Moon, Sun } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLayout } from '@/components/layout-context'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreferences, toggleSidebar, toggleCompactMode } = useLayout()
  const [mounted, setMounted] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    payout_alerts: true
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Load user data on mount
  useEffect(() => {
    loadUserData()
    setMounted(true)
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Load user profile from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userData) {
          // Parse full_name into first and last name
          const nameParts = userData.full_name?.split(' ') || []
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''

          setProfileData({
            firstName,
            lastName,
            email: user.email || '',
            bio: user.user_metadata?.bio || ''
          })
        } else {
          setProfileData({
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            email: user.email || '',
            bio: user.user_metadata?.bio || ''
          })
        }

        // Load user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (preferences) {
          setNotifications({
            email: preferences.email_notifications ?? true,
            payout_alerts: preferences.payout_alerts ?? true
          })
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      console.log('Updating profile for user:', user.id)
      console.log('Profile data:', profileData)

      // Update profile in users table (since profiles table doesn't exist yet)
      const { error: profileError } = await supabase
        .from('users')
        .update({
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        throw profileError
      }

      // Also update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          bio: profileData.bio
        }
      })

      if (authError) {
        console.error('Auth update error:', authError)
        // Don't throw here, profile was updated successfully
      }

      console.log('Profile updated successfully')
      setSaveMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveMessage(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handlePasswordChange = async () => {
    // Validation
    if (!security.currentPassword) {
      setSaveMessage('Please enter your current password')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    if (security.newPassword !== security.confirmPassword) {
      setSaveMessage('New passwords do not match!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    if (security.newPassword.length < 8) {
      setSaveMessage('Password must be at least 8 characters!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    if (security.currentPassword === security.newPassword) {
      setSaveMessage('New password must be different from current password!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    
    setIsSaving(true)
    try {
      // First, verify the current password by getting user email and attempting sign in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) {
        throw new Error('User not authenticated')
      }

      // Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: security.currentPassword
      })

      if (verifyError) {
        setSaveMessage('Current password is incorrect')
        setTimeout(() => setSaveMessage(''), 3000)
        setIsSaving(false)
        return
      }

      // If verification successful, update password
      const { error } = await supabase.auth.updateUser({
        password: security.newPassword
      })

      if (error) throw error

      setSaveMessage('Password changed successfully!')
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error changing password:', error)
      setSaveMessage(error instanceof Error ? error.message : 'Error changing password. Please try again.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key]
    setNotifications(prev => ({ ...prev, [key]: newValue }))
    
    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const dbKey = key === 'email' ? 'email_notifications' : 'payout_alerts'
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            [dbKey]: newValue,
            updated_at: new Date().toISOString()
          })
      }
    } catch (error) {
      console.error('Error updating notification preference:', error)
    }
  }

  const handleAppearanceToggle = async (key: keyof typeof preferences) => {
    const newValue = !preferences[key]
    await updatePreferences({ [key]: newValue })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  if (!mounted || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          saveMessage.includes('successfully') 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {saveMessage.includes('successfully') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1" 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio" 
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="mt-1" 
              placeholder="Tell us about yourself..."
            />
          </div>
          <Button onClick={handleProfileSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex-1">
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">Receive email updates about your account and projects</p>
            </div>
            <Switch 
              checked={notifications.email}
              onCheckedChange={() => handleNotificationToggle('email')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex-1">
              <Label className="text-base font-medium">Payout Alerts</Label>
              <p className="text-sm text-muted-foreground mt-1">Get notified when your payouts are processed</p>
            </div>
            <Switch 
              checked={notifications.payout_alerts}
              onCheckedChange={() => handleNotificationToggle('payout_alerts')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={security.currentPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="mt-1" 
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              value={security.newPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
              className="mt-1" 
              placeholder="Enter your new password (min. 8 characters)"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={security.confirmPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="mt-1" 
              placeholder="Confirm your new password"
              required
            />
          </div>
          <Button onClick={handlePasswordChange} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div>
            <Label className="text-base font-medium">Theme</Label>
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Light</p>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Dark</p>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'system' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Monitor className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">System</p>
              </button>
            </div>
          </div>

          {/* Other Appearance Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Use compact layout for better space usage</p>
              </div>
              <Switch 
                checked={preferences.compactMode}
                onCheckedChange={toggleCompactMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Collapse Sidebar</Label>
                <p className="text-sm text-muted-foreground">Start with sidebar collapsed by default</p>
              </div>
              <Switch 
                checked={preferences.sidebarCollapsed}
                onCheckedChange={toggleSidebar}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
