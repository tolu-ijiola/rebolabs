import { createServerClient } from '@/lib/supabase'
import { ActivityLogger } from './activity-logger'

export interface SystemStatus {
  id: string
  status: 'online' | 'offline' | 'maintenance'
  message: string
  updated_by?: string
  updated_at: string
}

export class SystemStatusService {
  static async getCurrentStatus(): Promise<SystemStatus | null> {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('system_status')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Failed to get system status:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('System status error:', error)
      return null
    }
  }

  static async updateStatus(
    status: 'online' | 'offline' | 'maintenance',
    message: string,
    updatedBy: string
  ): Promise<boolean> {
    try {
      const supabase = createServerClient()
      const { error } = await supabase
        .from('system_status')
        .insert({
          status,
          message,
          updated_by: updatedBy,
        })

      if (error) {
        console.error('Failed to update system status:', error)
        return false
      }

      // Log the system status change
      await ActivityLogger.logSystemAction(updatedBy, `System status changed to ${status}`, {
        status,
        message,
      })

      return true
    } catch (error) {
      console.error('System status update error:', error)
      return false
    }
  }

  static async isSystemOnline(): Promise<boolean> {
    const status = await this.getCurrentStatus()
    return status?.status === 'online'
  }
}
