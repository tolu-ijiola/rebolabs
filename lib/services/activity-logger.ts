import { createServerClient } from '@/lib/supabase'

export interface ActivityLogData {
  userId?: string
  action: string
  resourceType: 'user' | 'project' | 'payment' | 'system' | 'app'
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export class ActivityLogger {
  static async log(data: ActivityLogData) {
    try {
      const supabase = createServerClient()
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: data.userId || null,
          action: data.action,
          resource_type: data.resourceType,
          resource_id: data.resourceId || null,
          details: data.details || {},
          ip_address: data.ipAddress || null,
          user_agent: data.userAgent || null,
        })

      if (error) {
        console.error('Failed to log activity:', error)
      }
    } catch (error) {
      console.error('Activity logging error:', error)
    }
  }

  // Convenience methods for common actions
  static async logUserAction(userId: string, action: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resourceType: 'user',
      resourceId: userId,
      details,
    })
  }

  static async logProjectAction(userId: string, action: string, projectId: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resourceType: 'project',
      resourceId: projectId,
      details,
    })
  }

  static async logPaymentAction(userId: string, action: string, paymentId: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resourceType: 'payment',
      resourceId: paymentId,
      details,
    })
  }

  static async logSystemAction(userId: string, action: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resourceType: 'system',
      details,
    })
  }

  static async logAppAction(userId: string, action: string, appId: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resourceType: 'app',
      resourceId: appId,
      details,
    })
  }
}
