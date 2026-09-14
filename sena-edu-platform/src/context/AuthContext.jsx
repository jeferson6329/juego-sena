import { createContext, useContext, useState, useEffect } from 'react'

// ─── Clave de acceso para organizadores ──────────────────────────────────────
// Cambia este valor si quieres una clave diferente
const ORGANIZADOR_CLAVE = 'sena2024'

const STORAGE_KEY_NOMBRE    = 'sena_jugador_nombre'
const STORAGE_KEY_ROL       = 'sena_jugador_rol'
const STORAGE_KEY_PUNTOS    = 'sena_jugador_puntos'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [nombre, setNombre]       = useState(() => localStorage.getItem(STORAGE_KEY_NOMBRE) || null)
  const [rol, setRol]             = useState(() => localStorage.getItem(STORAGE_KEY_ROL) || null)
  const [puntos, setPuntos]       = useState(() => parseInt(localStorage.getItem(STORAGE_KEY_PUNTOS) || '0'))
  const [error, setError]         = useState(null)

  // Sincronizar puntos al localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PUNTOS, String(puntos))
  }, [puntos])

  // ── Entrar como jugador ───────────────────────────────────────────────────
  const entrarComoJugador = (nombreIngresado) => {
    const n = nombreIngresado.trim()
    if (!n) { setError('Escribe tu nombre para continuar.'); return false }
    setNombre(n)
    setRol('jugador')
    setError(null)
    localStorage.setItem(STORAGE_KEY_NOMBRE, n)
    localStorage.setItem(STORAGE_KEY_ROL, 'jugador')
    return true
  }

  // ── Entrar como organizador ───────────────────────────────────────────────
  const entrarComoOrganizador = (clave) => {
    if (clave !== ORGANIZADOR_CLAVE) {
      setError('Clave incorrecta.')
      return false
    }
    setNombre('Organizador')
    setRol('organizador')
    setError(null)
    localStorage.setItem(STORAGE_KEY_NOMBRE, 'Organizador')
    localStorage.setItem(STORAGE_KEY_ROL, 'organizador')
    return true
  }

  // ── Salir ─────────────────────────────────────────────────────────────────
  const salir = () => {
    setNombre(null)
    setRol(null)
    setError(null)
    localStorage.removeItem(STORAGE_KEY_NOMBRE)
    localStorage.removeItem(STORAGE_KEY_ROL)
  }

  // ── Sumar puntos localmente ───────────────────────────────────────────────
  const agregarPuntos = (cantidad) => {
    setPuntos(prev => prev + cantidad)
  }

  // ── Alias de compatibilidad con código existente ──────────────────────────
  // Muchos componentes usan user, profile, isAuthenticated — los mantenemos
  const user    = nombre ? { id: nombre, email: nombre } : null
  const profile = nombre ? { full_name: nombre, role: rol, points: puntos } : null

  const value = {
    // Nuevos
    nombre,
    rol,
    puntos,
    entrarComoJugador,
    entrarComoOrganizador,
    salir,
    agregarPuntos,
    error,
    setError,
    // Alias de compatibilidad
    user,
    profile,
    loading: false,
    isAuthenticated: !!nombre,
    isOrganizador: rol === 'organizador',
    isInstructor:  rol === 'organizador',   // alias legado
    isJugador:     rol === 'jugador',
    // Stubs de métodos que ya no hacen nada (compatibilidad)
    signUp:         async () => ({ data: null, error: null }),
    signIn:         async () => ({ data: null, error: null }),
    signOut:        salir,
    refreshProfile: () => {},
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
