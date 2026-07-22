'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Wallet, Landmark, Plus, Star, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useSupabase } from '@/components/supabase-context'
import { useAuth } from '@/components/auth-context'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: 'crypto' | 'wire_transfer'
  name: string
  details: string
  is_default: boolean
}

const TYPE_LABEL: Record<PaymentMethod['type'], string> = {
  crypto: 'Crypto wallet',
  wire_transfer: 'Wire transfer',
}

const DETAILS_HELP: Record<PaymentMethod['type'], string> = {
  crypto: 'Include the wallet address and network (e.g. TRC20, ERC20).',
  wire_transfer: 'Include bank name, account number, routing/SWIFT code, and account holder name.',
}

const DETAILS_PLACEHOLDER: Record<PaymentMethod['type'], string> = {
  crypto: 'USDT (TRC20): T9y...k1',
  wire_transfer: 'Bank name, account number, routing/SWIFT, account holder name',
}

const emptyForm = { type: 'crypto' as PaymentMethod['type'], name: '', details: '' }

export function PaymentMethodsCard() {
  const { supabase } = useSupabase()
  const { user } = useAuth()

  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchMethods = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('payment_methods')
      .select('id, type, name, details, is_default')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (!error) setMethods((data ?? []) as PaymentMethod[])
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchMethods()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (method: PaymentMethod) => {
    setEditingId(method.id)
    setForm({ type: method.type, name: method.name, details: method.details })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user) return
    if (!form.name.trim() || !form.details.trim()) {
      toast.error('Fill in a label and payout details before saving.')
      return
    }

    setSaving(true)
    const payload = { user_id: user.id, type: form.type, name: form.name.trim(), details: form.details.trim() }

    const { error } = editingId
      ? await supabase.from('payment_methods').update(payload).eq('id', editingId)
      : await supabase.from('payment_methods').insert({ ...payload, is_default: methods.length === 0 })

    setSaving(false)

    if (error) {
      toast.error('Could not save payment method. Please try again.')
      return
    }

    toast.success(editingId ? 'Payment method updated' : 'Payment method added')
    setDialogOpen(false)
    fetchMethods()
  }

  const handleDelete = async (method: PaymentMethod) => {
    if (!window.confirm(`Remove "${method.name}"? This can't be undone.`)) return

    const { error } = await supabase.from('payment_methods').delete().eq('id', method.id)
    if (error) {
      toast.error('Could not remove payment method.')
      return
    }
    toast.success('Payment method removed')
    fetchMethods()
  }

  const handleSetDefault = async (method: PaymentMethod) => {
    const { error } = await supabase.from('payment_methods').update({ is_default: true }).eq('id', method.id)
    if (error) {
      toast.error('Could not update default method.')
      return
    }
    fetchMethods()
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Payment Methods
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Where we send your monthly Net 30 payout.</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          Add method
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : methods.length === 0 ? (
          <div className="text-center py-10">
            <div className="p-3 rounded-full bg-muted/50 inline-flex mb-3">
              <Wallet className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-foreground">No payment method yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add one so we know where to send your payout.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div key={method.id} className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    {method.type === 'crypto' ? <Wallet className="w-4 h-4 text-primary" /> : <Landmark className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{method.name}</p>
                      {method.is_default && <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Default</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{TYPE_LABEL[method.type]}</p>
                    <p className="text-sm font-mono text-muted-foreground mt-1.5 break-all">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!method.is_default && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method)} title="Set as default">
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(method)} title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(method)} title="Remove">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit payment method' : 'Add payment method'}</DialogTitle>
            <DialogDescription>This is where your monthly Net 30 payout gets sent.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(value) => setForm((prev) => ({ ...prev, type: value as PaymentMethod['type'] }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto wallet</SelectItem>
                  <SelectItem value="wire_transfer">Wire transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method-name">Label</Label>
              <Input
                id="method-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={form.type === 'crypto' ? 'e.g. USDT (TRC20)' : 'e.g. Chase Business Checking'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="method-details">Payout details</Label>
              <Textarea
                id="method-details"
                value={form.details}
                onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                placeholder={DETAILS_PLACEHOLDER[form.type]}
                rows={4}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1.5">{DETAILS_HELP[form.type]}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
