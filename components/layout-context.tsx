'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface LayoutPreferences {
  compactMode: boolean
  sidebarCollapsed: boolean
  animations: boolean
}

interface LayoutContextType {
  preferences: LayoutPreferences
  updatePreferences: (prefs: Partial<LayoutPreferences>) => Promise<void>
  toggleSidebar: () => void
  toggleCompactMode: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<LayoutPreferences>({
    compactMode: false,
    sidebarCollapsed: false,
    animations: true
  })
  const [loading, setLoading] = useState(true)

  // Load preferences from database
  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('compact_mode, sidebar_collapsed, animations')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setPreferences({
            compactMode: data.compact_mode ?? false,
            sidebarCollapsed: data.sidebar_collapsed ?? false,
            animations: data.animations ?? true
          })
        }
      }
    } catch (error) {
      console.error('Error loading layout preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPrefs: Partial<LayoutPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updatedPrefs = { ...preferences, ...newPrefs }
      setPreferences(updatedPrefs)

      // Save to database
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          compact_mode: updatedPrefs.compactMode,
          sidebar_collapsed: updatedPrefs.sidebarCollapsed,
          animations: updatedPrefs.animations,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error updating layout preferences:', error)
    }
  }

  const toggleSidebar = () => {
    updatePreferences({ sidebarCollapsed: !preferences.sidebarCollapsed })
  }

  const toggleCompactMode = () => {
    updatePreferences({ compactMode: !preferences.compactMode })
  }

  return (
    <LayoutContext.Provider value={{
      preferences,
      updatePreferences,
      toggleSidebar,
      toggleCompactMode
    }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
