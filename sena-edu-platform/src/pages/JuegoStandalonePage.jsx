// Página standalone del juego — /juego?codigo=ABC
// Si viene con código de sesión: juego en vivo (Supabase Realtime)
// Si viene sin código: juego local (localStorage)

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  unirseASesion, actualizarJugador, salirDeSesion, verificarSesion,
} from '../lib/supabaseVivo'
import {
  PREGUNTAS, RETOS_PSEUDOCODIGO, TOTAL_PUNTOS_POSIBLES, TEMAS,
} from '../data/gameData'
import GameEngine from '../components/game/GameEngine'
import {
  Gamepad2, RotateCcw, Star,
  CheckCircle2, XCircle, Radio, ChevronRight,
} from 'lucide-react'

const KEY_NOMBRE    = 'sena_jugador_nombre'
const KEY_RESPUESTAS = 'sena_juego_respuestas'
const KEY_SECUENCIA  = 'sena_juego_secuencia_ids'

// ─── Utilidades ───────────────────────────────────────────────────────────────
function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function construirSecuencia() {
  const pregs = mezclar(PREGUNTAS)
  const retos = mezclar(RETOS_PSEUDOCODIGO)
  const seq = []; let ri = 0
  pregs.forEach((p, i) => {
    seq.push({ ...p, _tipo: 'pregunta' })
    if ((i + 1) % 4 === 0 && ri < retos.length) { seq.push({ ...retos[ri], _tipo: 'reto' }); ri++ }
  })
  while (ri < retos.length) { seq.push({ ...retos[ri], _tipo: 'reto' }); ri++ }
  return seq
}

// ─── Pantalla: ingresar nombre ────────────────────────────────────────────────
function PantallaNombre({ codigoSesion, onEntrar, error }) {
  const [nombre, setNombre] = useState('')
  const handleSubmit = (e) => { e.preventDefault(); if (nombre.trim()) onEntrar(nombre.trim()) }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5 animate-fade-in">
        <div className="text-center">
          <div className="w-14 h-14 bg-sena-green rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-sena-green/30">S</div>
          <h1 className="text-2xl font-black text-white">Juego Educativo SENA</h1>
          {codigoSesion && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-sena-green/10 border border-sena-green/30 rounded-full">
              <Radio size={12} className="text-sena-green animate-pulse" />
              <span className="text-sena-green text-xs font-semibold">Sesión en vivo · {codigoSesion}</span>
            </div>
          )}
        </div>

        <div className="card border-sena-green/20">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 size={18} className="text-sena-green" />
            <h2 className="font-bold text-white">¿Cómo te llamas?</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Escribe tu nombre…" className="input text-base" maxLength={40} autoFocus />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={!nombre.trim()} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50">
              Comenzar a jugar <ChevronRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-700">SENA · Análisis y Desarrollo de Software · 228118</p>
      </div>
    </div>
  )
}

// ─── Pantalla: resultados (simplificada para el jugador) ─────────────────────
function PantallaResultados({ nombre, respuestas, secuencia, onReiniciar }) {
  const total    = secuencia.length
  const aciertos = Object.values(respuestas).filter(r => r.isCorrect).length
  const pts      = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const pct      = total > 0 ? Math.round((aciertos / total) * 100) : 0
  const emoji    = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪'
  const msg      = pct >= 80 ? '¡Excelente dominio! Muy buen trabajo.'
    : pct >= 60 ? 'Buen desempeño. Sigue practicando.'
    : pct >= 40 ? 'Vas por buen camino. ¡Sigue adelante!'
    : '¡Gracias por participar! Sigue estudiando.'

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-5 animate-fade-in text-center">
        <div className="card border-gray-700 py-10">
          <div className="text-7xl mb-4 animate-bounce-light">{emoji}</div>
          <h1 className="text-2xl font-black text-white mb-2">¡Terminaste, {nombre}!</h1>
          <p className="text-gray-400 text-sm mb-6">{msg}</p>

          {/* Solo puntos y aciertos — sin estadísticas detalladas */}
          <div className="flex justify-center gap-6">
            <div>
              <p className="text-3xl font-black text-yellow-400">{pts}</p>
              <p className="text-xs text-gray-500">puntos</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div>
              <p className="text-3xl font-black text-sena-green">{aciertos}/{total}</p>
              <p className="text-xs text-gray-500">aciertos</p>
            </div>
          </div>
        </div>

        <button onClick={onReiniciar} className="btn-primary w-full justify-center py-3">
          <RotateCcw size={15} /> Jugar de nuevo
        </button>

        <p className="text-xs text-gray-700">
          Tu resultado ha sido registrado.
        </p>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function JuegoStandalonePage() {
  const [searchParams] = useSearchParams()
  const codigoSesion   = searchParams.get('codigo')?.toUpperCase() || null

  const [nombre,      setNombre]      = useState(null)
  const [errorNombre, setErrorNombre] = useState(null)
  const [fase,        setFase]        = useState('nombre')   // nombre | intro | jugando | resultados
  const [secuencia,   setSecuencia]   = useState([])
  const [indice,      setIndice]      = useState(0)
  const [respuestas,  setRespuestas]  = useState({})
  const guardandoRef = useRef(false)

  // Al salir del juego — limpiar de Supabase
  useEffect(() => {
    if (!codigoSesion || !nombre) return
    const limpiar = () => {
      // Usar sendBeacon para garantizar que se ejecuta al cerrar
      const url  = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/jugadores_vivo`
      const body = JSON.stringify([])
      // Marcar al salir — no podemos usar async en beforeunload, así que lo hacemos sync
      salirDeSesion(codigoSesion, nombre)
    }
    window.addEventListener('beforeunload', limpiar)
    return () => {
      window.removeEventListener('beforeunload', limpiar)
      // También limpiar al desmontar el componente (navegación interna)
      if (nombre && codigoSesion) salirDeSesion(codigoSesion, nombre)
    }
  }, [codigoSesion, nombre])

  // Entrar al juego con nombre
  const handleEntrar = async (n) => {
    setErrorNombre(null)
    if (codigoSesion) {
      // Verificar sesión activa
      const { valida } = await verificarSesion(codigoSesion)
      if (!valida) {
        setErrorNombre('Esta sesión ya no está activa. Pide al organizador un nuevo código.')
        return
      }
    }
    localStorage.setItem(KEY_NOMBRE, n)
    setNombre(n)
    setFase('intro')
  }

  // Iniciar juego
  const iniciar = useCallback(async () => {
    const seq = construirSecuencia()
    setSecuencia(seq)
    setIndice(0)
    setRespuestas({})
    setFase('jugando')
    if (codigoSesion && nombre) {
      await unirseASesion(codigoSesion, nombre, seq.length)
    }
  }, [codigoSesion, nombre])

  // Reiniciar
  const reiniciar = useCallback(() => {
    localStorage.removeItem(KEY_NOMBRE)
    setNombre(null); setSecuencia([]); setRespuestas({}); setIndice(0); setFase('nombre')
  }, [])

  // Responder
  const handleAnswer = useCallback(async (resultado) => {
    const item = secuencia[indice]
    if (!item || respuestas[item.id] || guardandoRef.current) return
    guardandoRef.current = true

    const nuevaResp = { isCorrect: resultado.isCorrect, pts: resultado.pts }
    const nuevasResp = { ...respuestas, [item.id]: nuevaResp }
    setRespuestas(nuevasResp)

    if (codigoSesion && nombre) {
      await actualizarJugador(codigoSesion, nombre, nuevasResp, indice, 'jugando')
    }
    guardandoRef.current = false
  }, [secuencia, indice, respuestas, codigoSesion, nombre])

  // Avanzar
  const handleNext = useCallback(async () => {
    const siguiente = indice + 1
    if (siguiente >= secuencia.length) {
      if (codigoSesion && nombre) {
        await actualizarJugador(codigoSesion, nombre, respuestas, secuencia.length, 'terminado')
      }
      setFase('resultados')
    } else {
      setIndice(siguiente)
      if (codigoSesion && nombre) {
        await actualizarJugador(codigoSesion, nombre, respuestas, siguiente, 'jugando')
      }
    }
  }, [indice, secuencia, respuestas, codigoSesion, nombre])

  // ── Renderizado ──────────────────────────────────────────────────────────────

  if (fase === 'nombre' || !nombre) return (
    <PantallaNombre codigoSesion={codigoSesion} onEntrar={handleEntrar} error={errorNombre} />
  )

  if (fase === 'resultados') return (
    <PantallaResultados nombre={nombre} respuestas={respuestas} secuencia={secuencia} onReiniciar={reiniciar} />
  )

  if (fase === 'intro') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-5 animate-fade-in">
        <div className="card border-sena-green/30 bg-gradient-to-br from-sena-green/10 to-transparent text-center py-8">
          <div className="text-5xl mb-3">🎮</div>
          <h1 className="text-2xl font-black text-white mb-1">¡Hola, {nombre}!</h1>
          {codigoSesion && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sena-green/10 border border-sena-green/30 rounded-full mt-1">
              <Radio size={11} className="text-sena-green animate-pulse" />
              <span className="text-sena-green text-xs">En vivo · {codigoSesion}</span>
            </div>
          )}
          <p className="text-gray-400 text-sm mt-2">¿Listo para el desafío?</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { emoji: '❓', val: PREGUNTAS.length,          label: 'Preguntas' },
            { emoji: '🔧', val: RETOS_PSEUDOCODIGO.length, label: 'Retos' },
            { emoji: '⭐', val: TOTAL_PUNTOS_POSIBLES,     label: 'Pts máx.' },
          ].map(s => (
            <div key={s.label} className="card py-3 text-center">
              <div className="text-xl mb-0.5">{s.emoji}</div>
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card border-yellow-500/20 text-sm text-gray-300 space-y-1">
          <p className="text-yellow-400 font-semibold text-xs uppercase mb-1.5">⚠️ Reglas</p>
          <p>• Cada pregunta tiene un solo intento.</p>
          <p>• Solo respuestas correctas suman puntos.</p>
          {codigoSesion && <p>• Tu progreso es visible para el organizador en tiempo real.</p>}
        </div>

        <button onClick={iniciar} className="btn-primary w-full justify-center py-3 text-base">
          🚀 Comenzar juego
        </button>

        <button onClick={() => { localStorage.removeItem(KEY_NOMBRE); setNombre(null); setFase('nombre') }}
          className="w-full text-xs text-gray-600 hover:text-gray-400 py-1 transition-colors">
          No soy {nombre} — cambiar nombre
        </button>
      </div>
    </div>
  )

  // ── Jugando ───────────────────────────────────────────────────────────────────
  const itemActual      = secuencia[indice]
  const respuestaActual = respuestas[itemActual?.id] || null
  const ptsAcum         = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-sena-green rounded flex items-center justify-center text-white text-xs font-black">S</span>
            <span className="text-gray-400 text-xs font-medium">{nombre}</span>
            {codigoSesion && (
              <span className="flex items-center gap-1 text-[10px] text-sena-green">
                <Radio size={9} className="animate-pulse" /> {codigoSesion}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-sm font-semibold">⭐ {ptsAcum} pts</span>
            <span className="text-xs text-gray-600">{indice + 1}/{secuencia.length}</span>
          </div>
        </div>

        {itemActual && (
          <GameEngine
            item={itemActual}
            index={indice}
            total={secuencia.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            answered={respuestaActual}
          />
        )}
      </div>
    </div>
  )
}
