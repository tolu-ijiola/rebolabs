'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/components/supabase-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Mail, Search, ChevronLeft, ChevronRight,
  Loader2, Eye, Check, Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: string
  created_at: string
}

const PAGE_SIZE = 20

export default function AdminMessagesPage() {
  const { supabase } = useSupabase()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchMessages = useCallback(async (currentPage: number, search: string, status: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (status !== 'all') {
        query = query.eq('status', status)
      }
      if (search.trim()) {
        query = (query as any).or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
      }

      const { data, error, count } = await query
      if (error) throw error
      setMessages(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const delay = setTimeout(() => { setPage(0); fetchMessages(0, searchTerm, statusFilter) }, 300)
    return () => clearTimeout(delay)
  }, [searchTerm, statusFilter, fetchMessages])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMessages(page, searchTerm, statusFilter) }, [page])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const markAs = async (id: string, status: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    } catch (err) {
      console.error('Error updating message:', err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      new: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'New' },
      read: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Read' },
      replied: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Replied' },
    }
    const { color, label } = map[status] || map.new
    return <Badge className={`${color} border-0`}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground">Messages submitted through the contact form</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search messages"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44" aria-label="Filter by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>Messages ({totalCount})</span>
            </span>
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">Page {page + 1} of {totalPages}</span>
            )}
          </CardTitle>
          <CardDescription>Contact form submissions from visitors</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${msg.status === 'new' ? 'border-blue-300 dark:border-blue-700' : 'border-border'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusBadge(msg.status)}
                      <span className="font-semibold text-foreground truncate">{msg.name}</span>
                      <span className="text-sm text-muted-foreground truncate hidden sm:block">&lt;{msg.email}&gt;</span>
                    </div>
                    {msg.subject && (
                      <p className="text-sm font-medium text-foreground mb-1">{msg.subject}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelected(msg); if (msg.status === 'new') markAs(msg.id, 'read') }}
                      aria-label={`View message from ${msg.name}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    {msg.status !== 'replied' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAs(msg.id, 'replied')}
                        disabled={updating}
                        aria-label={`Mark message from ${msg.name} as replied`}
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
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

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Message detail">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message from {selected.name}</h3>
              {getStatusBadge(selected.status)}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">From</p>
                  <p className="font-semibold break-words">{selected.name}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <a href={`mailto:${selected.email}`} className="font-semibold text-primary hover:underline break-all">{selected.email}</a>
                </div>
              </div>
              {selected.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="font-semibold">{selected.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Received</p>
                <p className="text-sm flex items-center space-x-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>{format(new Date(selected.created_at), 'MMMM dd, yyyy HH:mm:ss')}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="flex space-x-2">
                {selected.status !== 'replied' && (
                  <Button
                    size="sm"
                    onClick={() => markAs(selected.id, 'replied')}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" aria-hidden="true" />
                    Mark Replied
                  </Button>
                )}
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" aria-hidden="true" />
                    Reply via Email
                  </Button>
                </a>
              </div>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
