'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { useDashboard } from './dashboard-context'

interface NewProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated?: () => void
}

export function NewProjectModal({ open, onOpenChange, onProjectCreated }: NewProjectModalProps) {
  const { user } = useAuth()
  const { createProject } = useDashboard()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    type: '',
    currency_name: 'USD',
    currency_value: 100,
    show_value: true
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const app_id = `app_${formData.name.toLowerCase().replace(/ /g, '_')}_${Math.random().toString(36).substr(2, 9)}`
      
      // Generate secret keys
      const secret_key = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const server_key = `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      const projectData = {
        ...formData,
        app_id,
        user_id: user.id,
        status: 'pending' as const,
        demo: true,
        revenue: 0,
        custom_logo: null,
        primary_color: null,
        secret_key,
        server_key,
        reward_callback: null,
        reconciliation_callback: null
      }
      
      const newProject = await createProject(projectData)
      
      if (newProject) {
        setFormData({
          name: '',
          link: '',
          type: '',
          currency_name: 'USD',
          currency_value: 100,
          show_value: true
        })
        onOpenChange(false)
        onProjectCreated?.()
        // Navigate to the project details page
        router.push(`/dashboard/projects/${newProject.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      link: '',
      type: '',
      currency_name: 'USD',
      currency_value: 100,
      show_value: true
    })
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link">Project Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://your-project.com"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, type: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web App</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency_name">Currency Name</Label>
              <Input
              id="currency_name"
              value={formData.currency_name}
              onChange={(e) => setFormData(prev => ({ ...prev, currency_name: e.target.value }))}
              placeholder="Cents"
              required
              disabled={isSubmitting}
            />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="currency_value">Currency Value</Label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                    <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-xl border border-border max-w-[200px]">
                      <p className="font-medium mb-1">Currency Conversion Rate</p>
                      <p className="text-muted-foreground">
                        How much $1 USD equals in your currency.
                        <br />
                        Example: 100 means $1 = 100 cents
                      </p>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-popover border-r border-b border-border rotate-45 -mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              <Input
                id="currency_value"
                type="number"
                value={formData.currency_value}
                onChange={(e) => setFormData(prev => ({ ...prev, currency_value: parseFloat(e.target.value) || 0 }))}
                placeholder="100"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.show_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, show_value: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                    formData.show_value 
                      ? 'bg-primary border-primary' 
                      : 'bg-background border-border'
                  }`}>
                    {formData.show_value && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-foreground/70">Show currency value to users</span>
                
              </label>
            </div>
          
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

