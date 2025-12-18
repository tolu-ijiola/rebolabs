'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Plus,
  Bitcoin,
  Banknote,
  Wallet,
  Edit,
  Trash2,
  Star,
  StarOff,
  MoreVertical
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaymentMethod {
  id: string
  type: 'crypto' | 'wire'
  name: string
  details: string
  is_default: boolean
  created_at: string
}

interface Payout {
  id: string
  month: string
  total_revenue: number
  reconciliation: number
  total_payout: number
  status: 'Paid' | 'Pending' | 'Failed'
  paid_date?: string
  payment_method_id: string
  payment_method_name: string
  account_details: string
}

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [isPayoutDetailsOpen, setIsPayoutDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [paymentForm, setPaymentForm] = useState({
    method: '',
    name: '',
    cryptoWallet: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    notes: ''
  })

  // Load payment methods and payouts
  useEffect(() => {
    loadPaymentMethods()
    loadPayouts()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPaymentMethods(data || [])
    } catch (error) {
      console.error('Error loading payment methods:', error)
    }
  }

  const loadPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          payment_methods (
            name,
            details
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const formattedPayouts = data?.map(payout => ({
        ...payout,
        payment_method_name: payout.payment_methods?.name || 'Unknown',
        account_details: payout.payment_methods?.details || 'N/A'
      })) || []
      
      setPayouts(formattedPayouts)
    } catch (error) {
      console.error('Error loading payouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const methodData = {
        type: paymentForm.method,
        name: paymentForm.name,
        details: paymentForm.method === 'crypto' 
          ? paymentForm.cryptoWallet 
          : `${paymentForm.bankName} - ${paymentForm.accountNumber}`,
        is_default: paymentMethods.length === 0, // First method is default
        notes: paymentForm.notes
      }

      if (isEditMode && editingMethod) {
        const { error } = await supabase
          .from('payment_methods')
          .update(methodData)
          .eq('id', editingMethod.id)
        
        if (error) throw error
        setMessage('Payment method updated successfully!')
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert([methodData])
        
        if (error) throw error
        setMessage('Payment method added successfully!')
      }

      await loadPaymentMethods()
      resetForm()
    } catch (error) {
      console.error('Error saving payment method:', error)
      setMessage('Error saving payment method. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    setIsEditMode(true)
    setPaymentForm({
      method: method.type,
      name: method.name,
      cryptoWallet: method.type === 'crypto' ? method.details : '',
      bankName: method.type === 'wire' ? method.details.split(' - ')[0] : '',
      accountNumber: method.type === 'wire' ? method.details.split(' - ')[1] : '',
      routingNumber: '',
      accountHolderName: '',
      notes: ''
    })
    setIsPaymentMethodOpen(true)
  }

  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', methodId)
      
      if (error) throw error
      
      await loadPaymentMethods()
      setMessage('Payment method deleted successfully!')
    } catch (error) {
      console.error('Error deleting payment method:', error)
      setMessage('Error deleting payment method. Please try again.')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSetDefault = async (methodId: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .neq('id', methodId)
      
      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', methodId)
      
      if (error) throw error
      
      await loadPaymentMethods()
      setMessage('Default payment method updated!')
    } catch (error) {
      console.error('Error setting default payment method:', error)
      setMessage('Error updating default payment method. Please try again.')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const resetForm = () => {
    setPaymentForm({
      method: '',
      name: '',
      cryptoWallet: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountHolderName: '',
      notes: ''
    })
    setIsEditMode(false)
    setEditingMethod(null)
    setIsPaymentMethodOpen(false)
  }

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout)
    setIsPayoutDetailsOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Paid': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50' },
      'Pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/50' },
      'Failed': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    const Icon = config.icon
    
    return (
      <Badge className={`${config.bg} ${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-muted rounded w-40 animate-pulse"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Payments & Payouts</h1>
          <p className="text-muted-foreground">Manage your payment methods and view payout history</p>
        </div>
        <Dialog open={isPaymentMethodOpen} onOpenChange={setIsPaymentMethodOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Payment Method' : 'Add Payment Method'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePaymentMethodSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Payment Method Name</Label>
                  <Input
                    id="name"
                    value={paymentForm.name}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., My Bitcoin Wallet, Chase Bank Account"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="method">Payment Type</Label>
                  <Select
                    value={paymentForm.method}
                    onValueChange={(value) => setPaymentForm(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">
                        <div className="flex items-center space-x-2">
                          <Bitcoin className="w-4 h-4" />
                          <span>Crypto (Bitcoin)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="wire">
                        <div className="flex items-center space-x-2">
                          <Banknote className="w-4 h-4" />
                          <span>Wire Transfer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentForm.method === 'crypto' && (
                  <div>
                    <Label htmlFor="cryptoWallet">Bitcoin Wallet Address</Label>
                    <Input
                      id="cryptoWallet"
                      value={paymentForm.cryptoWallet}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cryptoWallet: e.target.value }))}
                      placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your Bitcoin wallet address for receiving payouts
                    </p>
                  </div>
                )}

                {paymentForm.method === 'wire' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, bankName: e.target.value }))}
                        placeholder="Chase Bank"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        value={paymentForm.accountHolderName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={paymentForm.accountNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="1234567890"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={paymentForm.routingNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, routingNumber: e.target.value }))}
                        placeholder="021000021"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information about this payment method..."
                    className="w-full"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Payment Method' : 'Add Payment Method'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.includes('successfully') || message.includes('updated')
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message.includes('successfully') || message.includes('updated') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Payment Methods */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Payment Methods</h3>
              <p className="text-muted-foreground mb-4">Add a payment method to receive payouts</p>
              <Button onClick={() => setIsPaymentMethodOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {method.type === 'crypto' ? (
                        <Bitcoin className="w-6 h-6 text-primary" />
                      ) : (
                        <Banknote className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{method.name}</h3>
                        {method.is_default && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.type === 'crypto' ? 'Bitcoin Wallet' : 'Wire Transfer'} • {method.details}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <StarOff className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMethod(method)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMethod(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Payouts List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Monthly Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Payouts Yet</h3>
              <p className="text-muted-foreground">Your payout history will appear here once you start earning</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{payout.month}</h3>
                      <p className="text-sm text-muted-foreground">
                        {payout.payment_method_name} • {payout.account_details}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Payout</p>
                      <p className="text-lg font-semibold text-foreground">
                        ${payout.total_payout.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(payout.status)}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(payout)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Modal */}
      <Dialog open={isPayoutDetailsOpen} onOpenChange={setIsPayoutDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Payout Details - {selectedPayout?.month}
            </DialogTitle>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-0">
                      Revenue
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    ${selectedPayout.total_revenue.toFixed(2)}
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-0">
                      Deductions
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Reconciliation</h3>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    ${selectedPayout.reconciliation.toFixed(2)}
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-0">
                      Final
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Total Payout</h3>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    ${selectedPayout.total_payout.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Payout Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Payout ID</Label>
                      <p className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded mt-1">
                        {selectedPayout.id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPayout.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {selectedPayout.status === 'Paid' ? 'Paid Date' : 'Expected Date'}
                      </Label>
                      <p className="text-foreground font-medium mt-1">
                        {selectedPayout.paid_date ? new Date(selectedPayout.paid_date).toLocaleDateString() : 'Processing...'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Method</Label>
                      <p className="text-foreground font-medium">{selectedPayout.payment_method_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Account Details</Label>
                      <p className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded mt-1 break-all">
                        {selectedPayout.account_details}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status-specific messages */}
              {selectedPayout.status === 'Pending' && (
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Payout Processing
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Your payout is currently being processed and will be completed within 3-5 business days. 
                        You'll receive a confirmation email once the payment is sent.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayout.status === 'Paid' && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Payout Completed
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your payout has been successfully processed and sent to your payment method. 
                        Please check your account for the funds.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayout.status === 'Failed' && (
                <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                        Payout Failed
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        There was an issue processing your payout. Please contact support or update your payment method.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
