import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, authHelpers, profileHelpers } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Carga el perfil del usuario desde la tabla profiles
  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await profileHelpers.getProfile(userId)
    if (!error && data) setProfile(data)
  }, [])

  // Escucha cambios de sesión de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [loadProfile])

  // ── Acciones ─────────────────────────────────────────────────────────────

  const signUp = async (email, password, fullName, role = 'jugador') => {
    setError(null)
    const { data, error } = await authHelpers.signUp({ email, password, fullName, role })
    if (error) setError(error.message)
    return { data, error }
  }

  const signIn = async (email, password) => {
    setError(null)
    const { data, error } = await authHelpers.signIn({ email, password })
    if (error) setError(error.message)
    return { data, error }
  }

  const signOut = async () => {
    await authHelpers.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = () => {
    if (user) loadProfile(user.id)
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAuthenticated: !!user,
    // Rol organizador (antes isInstructor)
    isOrganizador: profile?.role === 'organizador' || profile?.role === 'admin',
    // Mantener isInstructor como alias de compatibilidad
    isInstructor:  profile?.role === 'organizador' || profile?.role === 'admin',
    // Rol jugador
    isJugador: profile?.role === 'jugador',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
