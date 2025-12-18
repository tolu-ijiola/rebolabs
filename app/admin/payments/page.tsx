'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  User
} from 'lucide-react'
import { format } from 'date-fns'

interface Payout {
  id: string
  user_id: string
  amount: number
  status: string
  month: number
  year: number
  admin_notes?: string
  created_at: string
  processed_at?: string
  payment_method_id?: string
  user: {
    email: string
    full_name: string
  }
  payment_method?: {
    type: string
    name: string
    details: string
  }
}

interface PayoutStats {
  totalPending: number
  totalApproved: number
  totalPaid: number
  totalFailed: number
  totalAmount: number
}

export default function AdminPaymentsPage() {
  const { supabase } = useSupabase()
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [stats, setStats] = useState<PayoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [approvalStatus, setApprovalStatus] = useState<string>('')

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    try {
      setLoading(true)

      // Fetch payouts with user and payment method data
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          user:users(email, full_name),
          payment_method:payment_methods(type, name, details)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPayouts(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching payouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (payouts: Payout[]) => {
    const stats = payouts.reduce((acc, payout) => {
      acc.totalAmount += payout.amount
      
      switch (payout.status) {
        case 'pending':
          acc.totalPending++
          break
        case 'approved':
          acc.totalApproved++
          break
        case 'paid':
          acc.totalPaid++
          break
        case 'failed':
          acc.totalFailed++
          break
      }
      
      return acc
    }, {
      totalPending: 0,
      totalApproved: 0,
      totalPaid: 0,
      totalFailed: 0,
      totalAmount: 0
    })

    setStats(stats)
  }

  const handleApproval = async () => {
    if (!selectedPayout || !approvalStatus) return

    try {
      const updateData: any = {
        status: approvalStatus,
        admin_notes: approvalNotes.trim() || null
      }

      if (approvalStatus === 'paid') {
        updateData.processed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('payouts')
        .update(updateData)
        .eq('id', selectedPayout.id)

      if (error) throw error

      // Refresh data
      await fetchPayouts()
      
      // Close modal and reset
      setShowApprovalModal(false)
      setSelectedPayout(null)
      setApprovalNotes('')
      setApprovalStatus('')
    } catch (error) {
      console.error('Error updating payout:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: CheckCircle },
      paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle }
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

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">Review and approve user payouts</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.totalPending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">{stats.totalApproved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold">{stats.totalPaid}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold">{stats.totalFailed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by user email, name, or payout ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payouts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Payout Requests</span>
            </CardTitle>
            <CardDescription>
              Review and manage user payout requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayouts.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payouts found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {new Date(payout.year, payout.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Payout
                        </h3>
                        {getStatusBadge(payout.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{payout.user.full_name || payout.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${payout.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(payout.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      {payout.payment_method && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Payment Method: {payout.payment_method.type === 'crypto' ? 'Bitcoin' : 'Wire Transfer'} - {payout.payment_method.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPayout(payout)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {payout.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayout(payout)
                            setShowApprovalModal(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Modal */}
        {showDetailsModal && selectedPayout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Payout Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User</p>
                    <p className="font-semibold">{selectedPayout.user.full_name || selectedPayout.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="font-semibold">${selectedPayout.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {getStatusBadge(selectedPayout.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Period</p>
                    <p className="font-semibold">
                      {new Date(selectedPayout.year, selectedPayout.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {selectedPayout.payment_method && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      <p className="font-medium">{selectedPayout.payment_method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPayout.payment_method.type === 'crypto' ? 'Bitcoin Wallet' : 'Wire Transfer'}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedPayout.payment_method.details}</p>
                    </div>
                  </div>
                )}

                {selectedPayout.admin_notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admin Notes</p>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedPayout.admin_notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{format(new Date(selectedPayout.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  {selectedPayout.processed_at && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processed</p>
                      <p className="text-sm">{format(new Date(selectedPayout.processed_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedPayout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Review Payout</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="font-semibold">{selectedPayout.user.full_name || selectedPayout.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">${selectedPayout.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="paid">Mark as Paid</SelectItem>
                      <SelectItem value="failed">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add any notes about this payout..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApproval}
                  disabled={!approvalStatus}
                  className={approvalStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {approvalStatus === 'failed' ? 'Reject' : 'Approve'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}