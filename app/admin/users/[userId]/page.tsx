'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Search,
  ArrowLeft,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Smartphone,
  Globe
} from 'lucide-react'
import { format } from 'date-fns'

interface UserDetails {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
  created_at: string
  updated_at: string
  is_banned: boolean
  ban_reason?: string
  banned_at?: string
}

interface Project {
  id: string
  app_id: string
  name: string
  status: string
  revenue: number
  created_at: string
}

interface SurveySession {
  id: string
  app_id: string
  user_id: string
  status: string
  payout_usd: number
  payout_app_currency: number
  est_minutes: number
  started_at: string
  completed_at?: string
  provider: string
}

interface Payout {
  id: string
  amount: number
  status: string
  month: number
  year: number
  admin_notes?: string
  created_at: string
  processed_at?: string
}

interface UserStats {
  totalEarnings: number
  totalSurveys: number
  completedSurveys: number
  pendingPayouts: number
  totalPayouts: number
  averageEarnings: number
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const { supabase } = useSupabase()

  const [user, setUser] = useState<UserDetails | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [surveySessions, setSurveySessions] = useState<SurveySession[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [banReason, setBanReason] = useState('')
  const [showBanModal, setShowBanModal] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      setUser(userData)

      // Fetch user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError
      setProjects(projectsData || [])

      // Fetch survey sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('survey_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })

      if (sessionsError) throw sessionsError
      setSurveySessions(sessionsData || [])

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (payoutsError) throw payoutsError
      setPayouts(payoutsData || [])

      // Calculate user stats
      const stats = calculateUserStats(sessionsData || [], payoutsData || [])
      setUserStats(stats)

    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateUserStats = (sessions: SurveySession[], payouts: Payout[]): UserStats => {
    const totalEarnings = sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.payout_usd, 0)

    const totalSurveys = sessions.length
    const completedSurveys = sessions.filter(s => s.status === 'completed').length
    const pendingPayouts = payouts.filter(p => p.status === 'pending').length
    const totalPayouts = payouts.filter(p => p.status === 'paid').length
    const averageEarnings = completedSurveys > 0 ? totalEarnings / completedSurveys : 0

    return {
      totalEarnings,
      totalSurveys,
      completedSurveys,
      pendingPayouts,
      totalPayouts,
      averageEarnings
    }
  }

  const handleBanUser = async () => {
    if (!user || !banReason.trim()) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_banned: true,
          ban_reason: banReason,
          banned_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setUser(prev => prev ? { ...prev, is_banned: true, ban_reason: banReason, banned_at: new Date().toISOString() } : null)
      setShowBanModal(false)
      setBanReason('')
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleUnbanUser = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_banned: false,
          ban_reason: null,
          banned_at: null
        })
        .eq('id', userId)

      if (error) throw error

      setUser(prev => prev ? { ...prev, is_banned: false, ban_reason: undefined, banned_at: undefined } : null)
    } catch (error) {
      console.error('Error unbanning user:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
      disqualified: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
      started: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: AlertCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredSessions = surveySessions.filter(session => {
    const matchesSearch = session.app_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = selectedProject === 'all' || session.app_id === selectedProject
    return matchesSearch && matchesProject
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">User Not Found</h1>
          <p className="text-muted-foreground">The requested user could not be found.</p>
          <Button onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/admin/users')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Details</h1>
              <p className="text-muted-foreground">Manage user account and view detailed statistics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.is_banned ? (
              <Button onClick={handleUnbanUser} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Unban User
              </Button>
            ) : (
              <Button onClick={() => setShowBanModal(true)} variant="destructive">
                <Ban className="w-4 h-4 mr-2" />
                Ban User
              </Button>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>User Information</span>
              {user.is_banned && (
                <Badge variant="destructive">Banned</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg font-semibold">{user.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'}>
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">{format(new Date(user.created_at), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            {user.is_banned && user.ban_reason && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">Ban Reason:</p>
                <p className="text-red-700 dark:text-red-300">{user.ban_reason}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Banned on: {format(new Date(user.banned_at!), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">${userStats.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Surveys Completed</p>
                    <p className="text-2xl font-bold">{userStats.completedSurveys}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                    <p className="text-2xl font-bold">{userStats.pendingPayouts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                    <p className="text-2xl font-bold">{userStats.totalPayouts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="surveys">Survey History</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>User Projects</span>
                </CardTitle>
                <CardDescription>
                  All projects created by this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No projects found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : project.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">App ID: {project.app_id}</p>
                          <p className="text-sm text-muted-foreground">Revenue: ${project.revenue.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="text-sm font-medium">{format(new Date(project.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Survey History</span>
                </CardTitle>
                <CardDescription>
                  All survey sessions for this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by app ID or provider..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.app_id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No survey sessions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">Survey #{session.id.slice(-8)}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>${session.payout_usd.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{session.est_minutes} min</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(session.started_at), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="capitalize">{session.provider}</span>
                            </div>
                          </div>
                        </div>
                        {session.status === 'completed' && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">+${session.payout_app_currency.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Earned</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Payout History</span>
                </CardTitle>
                <CardDescription>
                  All payouts for this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payouts found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payouts.map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              Payout for {new Date(payout.year, payout.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <Badge className={payout.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}>
                              {payout.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Amount: ${payout.amount.toFixed(2)}</p>
                          {payout.admin_notes && (
                            <p className="text-sm text-muted-foreground">Notes: {payout.admin_notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="text-sm font-medium">{format(new Date(payout.created_at), 'MMM dd, yyyy')}</p>
                          {payout.processed_at && (
                            <>
                              <p className="text-sm text-muted-foreground mt-2">Processed</p>
                              <p className="text-sm font-medium">{format(new Date(payout.processed_at), 'MMM dd, yyyy')}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ban Modal */}
        {showBanModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Ban User</h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to ban this user? This action can be reversed later.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Ban Reason</label>
                  <Input
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter reason for banning..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowBanModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleBanUser}
                    disabled={!banReason.trim()}
                  >
                    Ban User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}