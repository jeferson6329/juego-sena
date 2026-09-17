import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Gamepad2, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { PREGUNTAS, RETOS_PSEUDOCODIGO, TEMAS } from '../data/gameData'

export default function EntradaPage() {
  const { entrarComoJugador, entrarComoOrganizador, nombre, isOrganizador, error, setError } = useAuth()
  const navigate = useNavigate()

  const [nombreInput, setNombreInput] = useState('')
  const [clave, setClave]             = useState('')
  const [mostrarOrg, setMostrarOrg]   = useState(false)
  const [showClave, setShowClave]     = useState(false)

  // Si ya hay sesión activa, redirigir
  useEffect(() => {
    if (nombre) {
      if (isOrganizador) {
        navigate('/organizador/ranking', { replace: true })
      } else {
        navigate('/juego', { replace: true })
      }
    }
  }, [nombre, isOrganizador, navigate])

  // No renderizar nada si ya hay sesión (useEffect hará la navegación)
  if (nombre) return null

  const handleJugador = (e) => {
    e.preventDefault()
    setError(null)
    entrarComoJugador(nombreInput)
    // La navegación ocurre vía useEffect cuando `nombre` cambia
  }

  const handleOrganizador = (e) => {
    e.preventDefault()
    setError(null)
    entrarComoOrganizador(clave)
    // La navegación ocurre vía useEffect cuando `nombre` cambia
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5 animate-fade-in">

        {/* Header */}
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-sena-green rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-sena-green/30">
            S
          </div>
          <h1 className="text-3xl font-black text-white">Juego Educativo SENA</h1>
          <p className="text-gray-400 text-sm mt-2">
            Fundamentos del Back-end · Arquitectura de Software
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { emoji: '❓', val: PREGUNTAS.length,          label: 'Preguntas' },
            { emoji: '🔧', val: RETOS_PSEUDOCODIGO.length, label: 'Retos' },
            { emoji: '🏆', val: Object.keys(TEMAS).length, label: 'Temas' },
          ].map(s => (
            <div key={s.label} className="card py-3">
              <div className="text-xl mb-0.5">{s.emoji}</div>
              <p className="text-lg font-black text-white">{s.val}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Formulario jugador */}
        {!mostrarOrg && (
          <div className="card border-sena-green/20">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 size={20} className="text-sena-green" />
              <h2 className="text-lg font-bold text-white">¿Cómo te llamas?</h2>
            </div>

            <form onSubmit={handleJugador} className="space-y-3">
              <input
                type="text"
                value={nombreInput}
                onChange={e => setNombreInput(e.target.value)}
                placeholder="Escribe tu nombre…"
                className="input text-base"
                maxLength={40}
                autoFocus
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!nombreInput.trim()}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
              >
                Comenzar a jugar <ChevronRight size={18} />
              </button>
            </form>

            <button
              onClick={() => { setMostrarOrg(true); setError(null) }}
              className="w-full mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors py-1"
            >
              Acceso organizador →
            </button>
          </div>
        )}

        {/* Formulario organizador */}
        {mostrarOrg && (
          <div className="card border-yellow-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-yellow-400" />
              <h2 className="text-lg font-bold text-white">Acceso organizador</h2>
            </div>

            <form onSubmit={handleOrganizador} className="space-y-3">
              <div className="relative">
                <input
                  type={showClave ? 'text' : 'password'}
                  value={clave}
                  onChange={e => setClave(e.target.value)}
                  placeholder="Clave de organizador"
                  className="input pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowClave(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showClave ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!clave}
                className="btn-primary w-full justify-center py-2.5 disabled:opacity-50"
              >
                Entrar como organizador
              </button>
            </form>

            <button
              onClick={() => { setMostrarOrg(false); setError(null) }}
              className="w-full mt-3 text-xs text-gray-500 hover:text-gray-400 transition-colors py-1"
            >
              ← Volver
            </button>
          </div>
        )}

        <p className="text-center text-[11px] text-gray-700">
          SENA · Análisis y Desarrollo de Software
        </p>
      </div>
    </div>
  )
}
