'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Mail, 
  Plus, 
  Ticket, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  User,
  Shield,
  ChevronRight,
  Calendar,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface Ticket {
  id: string
  subject: string
  status: 'Open' | 'In Progress' | 'Resolved'
  priority: 'Low' | 'Medium' | 'High'
  created_at: string
  updated_at: string
  user_id: string
  description: string
}

interface Message {
  id: string
  ticket_id: string
  user_id: string
  content: string
  created_at: string
  is_admin: boolean
}

const priorityConfig = {
  High: { 
    color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
    label: 'High'
  },
  Medium: { 
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    label: 'Medium'
  },
  Low: { 
    color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
    label: 'Low'
  }
}

const statusConfig = {
  Open: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50',
    icon: AlertCircle,
    label: 'Open'
  },
  'In Progress': { 
    color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/50',
    icon: Clock,
    label: 'In Progress'
  },
  Resolved: { 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
    icon: CheckCircle,
    label: 'Resolved'
  }
}

export default function HelpPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    description: ''
  })

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user])

  const fetchTickets = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    }
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setIsSubmitting(true)
    
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          subject: ticketForm.subject,
          priority: ticketForm.priority,
          description: ticketForm.description,
          user_id: user.id,
          status: 'Open'
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          content: ticketForm.description,
          is_admin: false
        })

      if (messageError) throw messageError

      toast.success('Support ticket created successfully')
      setTicketForm({ subject: '', priority: 'Medium', description: '' })
      setIsTicketModalOpen(false)
      fetchTickets()
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!user || !selectedTicket || !newMessage.trim()) return
    
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          content: newMessage.trim(),
          is_admin: false
        })

      if (error) throw error

      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id)

      setNewMessage('')
      fetchMessages(selectedTicket.id)
      fetchTickets()
      toast.success('Message sent')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewDetails = async (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsTicketDetailsOpen(true)
    await fetchMessages(ticket.id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Support Center</h1>
          <p className="text-muted-foreground mt-1.5">Manage your support tickets and get help</p>
        </div>
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background hover:bg-foreground/90 h-10 px-4">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create Support Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTicketSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  className="h-10"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select
                  value={ticketForm.priority}
                  onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                    setTicketForm(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - General questions</SelectItem>
                    <SelectItem value="Medium">Medium - Feature requests</SelectItem>
                    <SelectItem value="High">High - Critical issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your issue..."
                  rows={6}
                  className="resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="h-10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-foreground text-background hover:bg-foreground/90 h-10" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Contact */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Direct Email Support</h3>
                <p className="text-sm text-muted-foreground mt-0.5">For urgent matters, contact us directly</p>
              </div>
            </div>
            <a 
              href="mailto:support@rebolabs.com" 
              className="text-sm font-medium text-foreground hover:underline"
            >
              support@rebolabs.com
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Your Tickets</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {tickets.length === 0 
                  ? 'No support tickets yet' 
                  : `${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}`
                }
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status]
                const priority = priorityConfig[ticket.priority]
                const StatusIcon = status.icon
                
                return (
                  <div
                    key={ticket.id}
                    className="group relative flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
                    onClick={() => handleViewDetails(ticket)}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      ticket.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
                      ticket.status === 'In Progress' ? 'bg-orange-50 dark:bg-orange-950/20' :
                      'bg-blue-50 dark:bg-blue-950/20'
                    )}>
                      <StatusIcon className={cn(
                        "w-5 h-5",
                        ticket.status === 'Resolved' ? 'text-emerald-600 dark:text-emerald-400' :
                        ticket.status === 'In Progress' ? 'text-orange-600 dark:text-orange-400' :
                        'text-blue-600 dark:text-blue-400'
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ticket.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium border", priority.color)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {priority.label}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium border", status.color)}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(ticket.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1.5">No tickets yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Create a support ticket to get help with any questions or issues
              </p>
              <Button 
                onClick={() => setIsTicketModalOpen(true)} 
                className="bg-foreground text-background hover:bg-foreground/90 h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Details Modal */}
      <Dialog open={isTicketDetailsOpen} onOpenChange={setIsTicketDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          {selectedTicket && (() => {
            const StatusIcon = statusConfig[selectedTicket.status].icon
            return (
              <>
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-lg font-semibold mb-3 pr-8">
                        {selectedTicket.subject}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium border", priorityConfig[selectedTicket.priority].color)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {selectedTicket.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium border", statusConfig[selectedTicket.status].color)}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {selectedTicket.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created {formatDate(selectedTicket.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start gap-3",
                          message.is_admin ? "justify-start" : "justify-end"
                        )}
                      >
                        {message.is_admin && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div className={cn(
                          "max-w-[75%] rounded-lg px-4 py-3",
                          message.is_admin 
                            ? 'bg-card border border-border' 
                            : 'bg-foreground text-background'
                        )}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={cn(
                            "text-xs mt-2",
                            message.is_admin ? 'text-muted-foreground' : 'text-background/70'
                          )}>
                            {formatDate(message.created_at)} at {formatTime(message.created_at)}
                          </p>
                        </div>
                        {!message.is_admin && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="border-t p-4 bg-card">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={2}
                      className="flex-1 resize-none min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isSubmitting || !newMessage.trim()}
                      className="bg-foreground text-background hover:bg-foreground/90 h-[60px] px-4"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
