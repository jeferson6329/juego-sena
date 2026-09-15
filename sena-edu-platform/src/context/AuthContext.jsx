// AuthContext simplificado — sin login, sin roles
// Solo guarda el nombre del jugador en localStorage para el juego
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const KEY = 'sena_jugador_nombre'

export function AuthProvider({ children }) {
  const [nombre, setNombre] = useState(() => localStorage.getItem(KEY) || null)

  const entrar = (n) => {
    const trimmed = n.trim()
    if (!trimmed) return false
    localStorage.setItem(KEY, trimmed)
    setNombre(trimmed)
    return true
  }

  const salir = () => {
    localStorage.removeItem(KEY)
    setNombre(null)
  }

  // Aliases de compatibilidad con código existente
  const value = {
    nombre,
    entrar,
    salir,
    // Aliases
    user:            nombre ? { id: nombre, email: nombre } : null,
    profile:         nombre ? { full_name: nombre, role: 'jugador', points: 0 } : null,
    loading:         false,
    isAuthenticated: !!nombre,
    isOrganizador:   false,
    isInstructor:    false,
    isJugador:       true,
    refreshProfile:  () => {},
    signOut:         salir,
    agregarPuntos:   () => {},
    puntos:          0,
    rol:             'jugador',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
