'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DollarSign, Clock, CheckCircle, XCircle,
  Search, Eye, Edit, Calendar, User,
  ChevronLeft, ChevronRight, Loader2
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
  user: { email: string; full_name: string }
  payment_method?: { type: string; name: string; details: string }
}

interface Stats {
  pending: number
  approved: number
  paid: number
  failed: number
}

const PAGE_SIZE = 20

export default function AdminPaymentsPage() {
  const { supabase } = useSupabase()
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, paid: 0, failed: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchStats = useCallback(async () => {
    const statuses = ['pending', 'approved', 'paid', 'failed']
    const counts: Stats = { pending: 0, approved: 0, paid: 0, failed: 0 }
    await Promise.all(
      statuses.map(async (s) => {
        const { count } = await supabase
          .from('payouts')
          .select('id', { count: 'exact', head: true })
          .eq('status', s)
        counts[s as keyof Stats] = count || 0
      })
    )
    setStats(counts)
  }, [supabase])

  const fetchPayouts = useCallback(async (currentPage: number, search: string, status: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('payouts')
        .select(`*, user:users(email, full_name), payment_method:payment_methods(type, name, details)`, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query
      if (error) throw error
      setPayouts(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching payouts:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const delay = setTimeout(() => { setPage(0); fetchPayouts(0, searchTerm, statusFilter) }, 300)
    return () => clearTimeout(delay)
  }, [searchTerm, statusFilter, fetchPayouts])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPayouts(page, searchTerm, statusFilter) }, [page])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleApproval = async () => {
    if (!selectedPayout || !approvalStatus) return
    setUpdating(true)
    try {
      const updateData: Record<string, unknown> = {
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
      setShowApprovalModal(false)
      setSelectedPayout(null)
      setApprovalNotes('')
      setApprovalStatus('')
      await fetchStats()
      await fetchPayouts(page, searchTerm, statusFilter)
    } catch (err) {
      console.error('Error updating payout:', err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; Icon: React.ElementType }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', Icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', Icon: CheckCircle },
      paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', Icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', Icon: XCircle },
    }
    const { color, Icon } = map[status] || map.pending
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" aria-hidden="true" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground">Review and approve user payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { label: 'Pending', key: 'pending', Icon: Clock, color: 'text-yellow-600' },
          { label: 'Approved', key: 'approved', Icon: CheckCircle, color: 'text-blue-600' },
          { label: 'Paid', key: 'paid', Icon: CheckCircle, color: 'text-green-600' },
          { label: 'Failed', key: 'failed', Icon: XCircle, color: 'text-red-600' },
        ] as const).map(({ label, key, Icon, color }) => (
          <Card key={key}>
            <CardContent className="p-4 flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{stats[key]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                placeholder="Search by user email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search payouts"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48" aria-label="Filter by status">
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

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" aria-hidden="true" />
              <span>Payout Requests ({totalCount})</span>
            </span>
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">Page {page + 1} of {totalPages}</span>
            )}
          </CardTitle>
          <CardDescription>Review and manage user payout requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">No payouts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {new Date(payout.year, payout.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Payout
                      </h3>
                      {getStatusBadge(payout.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span>{payout.user?.full_name || payout.user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" aria-hidden="true" />
                        <span>${payout.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>{format(new Date(payout.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedPayout(payout); setShowDetailsModal(true) }}
                      aria-label={`View payout for ${payout.user?.full_name || payout.user?.email}`}
                    >
                      <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
                      View
                    </Button>
                    {(payout.status === 'pending' || payout.status === 'approved') && (
                      <Button
                        size="sm"
                        onClick={() => { setSelectedPayout(payout); setShowApprovalModal(true) }}
                        aria-label={`Review payout for ${payout.user?.full_name || payout.user?.email}`}
                      >
                        <Edit className="w-4 h-4 mr-1" aria-hidden="true" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous page">
                    <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page * PAGE_SIZE + 1}&ndash;{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} aria-label="Next page">
                    Next <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Payout details">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Payout Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="break-words font-semibold">{selectedPayout.user?.full_name || selectedPayout.user?.email}</p>
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
                      {selectedPayout.payment_method.type === 'crypto' ? 'Crypto Wallet' : 'Wire Transfer'}
                    </p>
                    <p className="text-sm font-mono text-muted-foreground">{selectedPayout.payment_method.details}</p>
                  </div>
                </div>
              )}
              {selectedPayout.admin_notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admin Notes</p>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedPayout.admin_notes}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Review payout">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Review Payout</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User</p>
                <p className="font-semibold">{selectedPayout.user?.full_name || selectedPayout.user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">${selectedPayout.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="approval-status">Action</label>
                <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                  <SelectTrigger id="approval-status" className="mt-1">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="paid">Mark as Paid</SelectItem>
                    <SelectItem value="failed">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="approval-notes">Notes (Optional)</label>
                <Textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes about this payout..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => { setShowApprovalModal(false); setApprovalStatus(''); setApprovalNotes('') }}>
                Cancel
              </Button>
              <Button
                onClick={handleApproval}
                disabled={!approvalStatus || updating}
                className={approvalStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : approvalStatus === 'failed' ? 'Reject' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
