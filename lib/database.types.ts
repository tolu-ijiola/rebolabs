export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          app_id: string
          name: string
          link: string
          type: string | null
          status: 'pending' | 'active' | 'rejected'
          user_id: string
          revenue: number
          demo: boolean
          currency_name: string
          currency_value: number
          show_value: boolean
          custom_logo: string | null
          primary_color: string | null
          secret_key: string
          server_key: string
          reward_callback: string | null
          reconciliation_callback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          app_id: string
          name: string
          link: string
          type?: string | null
          status?: 'pending' | 'active' | 'rejected'
          user_id: string
          revenue?: number
          demo?: boolean
          currency_name: string
          currency_value?: number
          show_value?: boolean
          custom_logo?: string | null
          primary_color?: string | null
          secret_key?: string
          server_key?: string
          reward_callback?: string | null
          reconciliation_callback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          app_id?: string
          name?: string
          link?: string
          type?: string | null
          status?: 'pending' | 'active' | 'rejected'
          user_id?: string
          revenue?: number
          demo?: boolean
          currency_name?: string
          currency_value?: number
          show_value?: boolean
          custom_logo?: string | null
          primary_color?: string | null
          secret_key?: string
          server_key?: string
          reward_callback?: string | null
          reconciliation_callback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          transaction_id: string
          user_id: string
          gross_amount: number
          payout: number
          reconciliation_amount: number
          status: 'pending' | 'paid' | 'failed'
          payment_method: string
          transaction_id: string | null
          revenue_months: string[]
          reconciliation_months: string[]
          invoiced_at: string | null
          created_at: string
        }
        Insert: {
          transaction_id?: string
          user_id: string
          gross_amount: number
          payout: number
          reconciliation_amount: number
          status?: 'pending' | 'paid' | 'failed'
          payment_method: string
          transaction_id?: string | null
          revenue_months?: string[]
          reconciliation_months?: string[]
          invoiced_at?: string | null
          created_at?: string
        }
        Update: {
          transaction_id?: string
          user_id?: string
          gross_amount?: number
          payout?: number
          reconciliation_amount?: number
          status?: 'pending' | 'paid' | 'failed'
          payment_method?: string
          transaction_id?: string | null
          revenue_months?: string[]
          reconciliation_months?: string[]
          invoiced_at?: string | null
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          app_id: string
          publisher_id: string
          user_id: string
          revenue_usd: number
          revenue_app_currency: number
          month: number
          year: number
          day: number
          full_date: string
          history_type: 'reward' | 'reconciliation'
          created_at: string
        }
        Insert: {
          id?: string
          app_id: string
          publisher_id: string
          user_id: string
          revenue_usd: number
          revenue_app_currency: number
          month: number
          year: number
          day: number
          full_date: string
          history_type: 'reward' | 'reconciliation'
          created_at?: string
        }
        Update: {
          id?: string
          app_id?: string
          publisher_id?: string
          user_id?: string
          revenue_usd?: number
          revenue_app_currency?: number
          month?: number
          year?: number
          day?: number
          full_date?: string
          history_type?: 'reward' | 'reconciliation'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Analytics = Database['public']['Tables']['analytics']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type AnalyticsInsert = Database['public']['Tables']['analytics']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']
export type AnalyticsUpdate = Database['public']['Tables']['analytics']['Update']
