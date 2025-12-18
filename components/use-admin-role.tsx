'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { useSupabase } from './supabase-context'

export function useAdminRole() {
  const { supabase } = useSupabase()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoading) return
      
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error checking admin role:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(data?.role === 'admin')
        }
      } catch (error) {
        console.error('Error checking admin role:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminRole()
  }, [user, authLoading])

  return { isAdmin, loading: loading || authLoading }
}
