'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet,
  FileText,
} from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { useAuth } from '@/components/auth-context'
import { format } from 'date-fns'
import { PaymentMethodsCard } from '@/components/dashboard/payment-methods-card'

interface Payment {
  transaction_id: string
  user_id: string
  gross_amount: number
  payout: number
  reconciliation_amount: number
  status: 'pending' | 'paid' | 'failed'
  payment_method: string
  revenue_months: string[] | null
  reconciliation_months: string[] | null
  invoiced_at: string | null
  created_at: string
}

const statusConfig = {
  paid: {
    label: 'Paid',
    icon: CheckCircle,
    badge: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  },
  failed: {
    label: 'Failed',
    icon: AlertCircle,
    badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
  },
}

function StatusBadge({ status }: { status: Payment['status'] }) {
  const cfg = statusConfig[status] ?? statusConfig.pending
  const Icon = cfg.icon
  return (
    <Badge className={`${cfg.badge} border flex items-center gap-1 font-medium`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  )
}

export default function PaymentsPage() {
  const { supabase } = useSupabase()
  const { user } = useAuth()

  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [selected, setSelected] = useState<Payment | null>(null)

  const fetchPayments = async () => {
    if (!user) return
    setLoading(true)
    setLoadError(false)

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setLoadError(true)
    } else {
      setPayments((data ?? []) as Payment[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Summary stats
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.payout, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.payout, 0)
  const totalGross = payments.reduce((s, p) => s + p.gross_amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">Your payout history and payment status</p>
      </div>

      <PaymentMethodsCard />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading payments...</p>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div className="text-center">
            <p className="font-semibold text-foreground">Failed to load payments</p>
            <p className="text-sm text-muted-foreground mt-1">Check your connection and try again.</p>
          </div>
          <Button onClick={fetchPayments} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      ) : (
      <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid Out</p>
              <p className="text-2xl font-bold text-foreground">${totalPaid.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-bold text-foreground">${totalPending.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gross Revenue</p>
              <p className="text-2xl font-bold text-foreground">${totalGross.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 rounded-full bg-muted/50 inline-flex mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No payments yet</h3>
              <p className="text-sm text-muted-foreground">
                Your payment history will appear here once the first payout is processed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment Method</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Gross</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Reconciliation</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Payout</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.transaction_id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors last:border-0"
                    >
                      <td className="py-4 px-4 text-foreground">
                        {payment.invoiced_at
                          ? format(new Date(payment.invoiced_at), 'MMM d, yyyy')
                          : format(new Date(payment.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-4 text-foreground">{payment.payment_method}</td>
                      <td className="py-4 px-4 text-right text-foreground font-mono">
                        ${payment.gross_amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground font-mono">
                        -${payment.reconciliation_amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-foreground font-mono">
                        ${payment.payout.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelected(payment)}
                          className="gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </>
      )}

      {/* Details Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5">
              {/* Status banner */}
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                selected.status === 'paid'
                  ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50'
                  : selected.status === 'failed'
                  ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50'
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
              }`}>
                <StatusBadge status={selected.status} />
                <span className="text-sm text-muted-foreground">
                  {selected.status === 'paid' && 'Payment has been sent to your account.'}
                  {selected.status === 'pending' && 'Payment is being processed. Typically takes 3–5 business days.'}
                  {selected.status === 'failed' && 'Payment failed. Please contact support.'}
                </span>
              </div>

              {/* Amounts */}
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Gross Revenue</span>
                  <span className="text-sm font-mono font-medium text-foreground">${selected.gross_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Reconciliation Deduction</span>
                  <span className="text-sm font-mono text-muted-foreground">−${selected.reconciliation_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-semibold text-foreground">Net Payout</span>
                  <span className="text-sm font-mono font-bold text-foreground">${selected.payout.toFixed(2)}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="text-foreground font-medium">{selected.payment_method}</span>
                </div>
                {selected.invoiced_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoiced At</span>
                    <span className="text-foreground">{format(new Date(selected.invoiced_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{format(new Date(selected.created_at), 'MMM d, yyyy')}</span>
                </div>
                {selected.revenue_months && selected.revenue_months.length > 0 && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground shrink-0">Revenue Months</span>
                    <span className="text-foreground text-right">{selected.revenue_months.join(', ')}</span>
                  </div>
                )}
                {selected.reconciliation_months && selected.reconciliation_months.length > 0 && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground shrink-0">Reconciliation Months</span>
                    <span className="text-foreground text-right">{selected.reconciliation_months.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="text-foreground font-mono text-xs break-all text-right max-w-[60%]">{selected.transaction_id}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
