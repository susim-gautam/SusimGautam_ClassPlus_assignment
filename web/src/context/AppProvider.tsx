import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppSession } from '../types'
import { getToken, setToken } from '../api/client'
import { fetchMe } from '../api/me'
import { updateProfile as apiUpdateProfile } from '../api/me'
import { updatePremium as apiUpdatePremium } from '../api/me'

interface AppContextValue {
  session: AppSession | null
  isProfileComplete: boolean
  bootstrapping: boolean
  refreshSession: () => Promise<void>
  saveProfile: (displayName: string, photoDataUrl: string) => Promise<void>
  setPremiumUnlocked: (value: boolean) => Promise<void>
  logout: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function profileComplete(s: AppSession | null): boolean {
  if (!s) return false
  return Boolean(
    s.profileConfigured && s.displayName.trim() && s.photoDataUrl
  )
}

export type { AppSession }

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null)
  const [bootstrapping, setBootstrapping] = useState(true)

  const refreshSession = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setSession(null)
      return
    }
    try {
      const user = await fetchMe()
      setSession(user)
    } catch {
      setToken(null)
      setSession(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setBootstrapping(true)
      await refreshSession()
      if (!cancelled) setBootstrapping(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshSession])

  const saveProfile = useCallback(async (displayName: string, photoDataUrl: string) => {
    const user = await apiUpdateProfile(displayName, photoDataUrl)
    setSession(user)
  }, [])

  const setPremiumUnlocked = useCallback(async (value: boolean) => {
    const user = await apiUpdatePremium(value)
    setSession(user)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setSession(null)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      isProfileComplete: profileComplete(session),
      bootstrapping,
      refreshSession,
      saveProfile,
      setPremiumUnlocked,
      logout,
    }),
    [session, bootstrapping, refreshSession, saveProfile, setPremiumUnlocked, logout]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
