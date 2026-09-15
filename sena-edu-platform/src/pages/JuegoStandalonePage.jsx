// Página standalone del juego — accesible via /juego sin layout de guías
// El jugador solo necesita su nombre para empezar

import { useState, useCallback, useEffect } from 'react'
import { guardarResultado } from '../lib/supabaseJuego'
import {
  PREGUNTAS, RETOS_PSEUDOCODIGO, TOTAL_PUNTOS_POSIBLES, TEMAS,
} from '../data/gameData'
import GameEngine from '../components/game/GameEngine'
import {
  Gamepad2, RotateCcw, Star, Target,
  CheckCircle2, XCircle, BarChart2, ChevronRight,
} from 'lucide-react'

const KEY_NOMBRE     = 'sena_jugador_nombre'
const KEY_RESPUESTAS = 'sena_juego_respuestas'
const KEY_SECUENCIA  = 'sena_juego_secuencia_ids'

// ─── Utilidades ───────────────────────────────────────────────────────────────
function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function construirSecuencia() {
  const pregs = mezclar(PREGUNTAS)
  const retos = mezclar(RETOS_PSEUDOCODIGO)
  const seq   = []
  let ri = 0
  pregs.forEach((p, i) => {
    seq.push({ ...p, _tipo: 'pregunta' })
    if ((i + 1) % 4 === 0 && ri < retos.length) {
      seq.push({ ...retos[ri], _tipo: 'reto' }); ri++
    }
  })
  while (ri < retos.length) { seq.push({ ...retos[ri], _tipo: 'reto' }); ri++ }
  return seq
}

function reconstruirSecuencia(ids) {
  const todos = [
    ...PREGUNTAS.map(p => ({ ...p, _tipo: 'pregunta' })),
    ...RETOS_PSEUDOCODIGO.map(r => ({ ...r, _tipo: 'reto' })),
  ]
  const map = Object.fromEntries(todos.map(i => [i.id, i]))
  return ids.map(id => map[id]).filter(Boolean)
}

// ─── Pantalla: ingresar nombre ────────────────────────────────────────────────
function PantallaNombre({ onEntrar }) {
  const [nombre, setNombre] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nombre.trim()) onEntrar(nombre.trim())
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-sena-green rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-sena-green/30">
            S
          </div>
          <h1 className="text-3xl font-black text-white">Juego Educativo SENA</h1>
          <p className="text-gray-400 text-sm mt-2">
            Fundamentos del Back-end · Arquitectura de Software
          </p>
        </div>

        {/* Stats rápidas */}
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

        {/* Formulario */}
        <div className="card border-sena-green/20">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 size={20} className="text-sena-green" />
            <h2 className="text-lg font-bold text-white">¿Cómo te llamas?</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Escribe tu nombre…"
              className="input text-base"
              maxLength={40}
              autoFocus
            />
            <button
              type="submit"
              disabled={!nombre.trim()}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
            >
              Comenzar a jugar <ChevronRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-700">
          SENA · Análisis y Desarrollo de Software · Programa 228118
        </p>
      </div>
    </div>
  )
}

// ─── Pantalla: resultados ─────────────────────────────────────────────────────
function PantallaResultados({ nombre, respuestas, secuencia, onReiniciar }) {
  const total    = secuencia.length
  const aciertos = Object.values(respuestas).filter(r => r.isCorrect).length
  const pts      = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const pct      = total > 0 ? Math.round((aciertos / total) * 100) : 0

  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪'
  const msg   = pct >= 80 ? '¡Excelente dominio del tema!'
              : pct >= 60 ? 'Buen desempeño. Repasa los temas que fallaste.'
              : pct >= 40 ? 'Hay margen de mejora. Revisa el material.'
              : 'Te recomendamos estudiar el material antes de reintentar.'

  const porTema = {}
  secuencia.forEach(item => {
    const t = item.tema || 'Sin tema'
    if (!porTema[t]) porTema[t] = { total: 0, aciertos: 0 }
    porTema[t].total++
    if (respuestas[item.id]?.isCorrect) porTema[t].aciertos++
  })

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in py-8">
        {/* Header */}
        <div className="card text-center border-gray-700 py-8">
          <div className="text-6xl mb-3 animate-bounce-light">{emoji}</div>
          <h1 className="text-2xl font-black text-white mb-1">¡Juego completado, {nombre}!</h1>
          <p className="text-gray-400 text-sm">{msg}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Target size={18} />,    label: 'Aciertos',   val: `${aciertos}/${total}`, color: 'text-sena-green' },
            { icon: <XCircle size={18} />,   label: 'Errores',    val: total - aciertos,       color: 'text-red-400' },
            { icon: <Star size={18} />,      label: 'Puntos',     val: pts,                    color: 'text-yellow-400' },
            { icon: <BarChart2 size={18} />, label: 'Porcentaje', val: `${pct}%`,
              color: pct >= 60 ? 'text-sena-green' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Barra */}
        <div className="card">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Porcentaje de aciertos</span>
            <span className={pct >= 60 ? 'text-sena-green' : 'text-red-400'}>{pct}%</span>
          </div>
          <div className="progress-bar h-3">
            <div
              className={`progress-fill ${pct >= 80 ? 'bg-sena-green' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {pts} / {TOTAL_PUNTOS_POSIBLES} puntos posibles
          </p>
        </div>

        {/* Rendimiento por tema */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <BarChart2 size={14} /> Por tema
          </h2>
          <div className="space-y-2.5">
            {Object.entries(porTema).map(([tema, st]) => {
              const p     = Math.round((st.aciertos / st.total) * 100)
              const color = p >= 60 ? 'bg-sena-green' : p >= 40 ? 'bg-yellow-400' : 'bg-red-400'
              const label = p >= 60 ? 'Buen dominio' : p >= 40 ? 'Requiere práctica' : 'Necesita refuerzo'
              return (
                <div key={tema}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 truncate max-w-[60%]">{tema}</span>
                    <span className={`font-semibold ${p >= 60 ? 'text-sena-green' : p >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {st.aciertos}/{st.total} — {label}
                    </span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div className={`progress-fill ${color}`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revisión */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Revisión</h2>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {secuencia.map(item => {
              const ok = respuestas[item.id]?.isCorrect
              return (
                <div key={item.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${ok ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'}`}
                >
                  {ok
                    ? <CheckCircle2 size={12} className="text-sena-green shrink-0 mt-0.5" />
                    : <XCircle     size={12} className="text-red-400 shrink-0 mt-0.5" />
                  }
                  <p className="text-gray-300 truncate">{item.enunciado || item.titulo}</p>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={onReiniciar} className="btn-primary w-full justify-center py-3">
          <RotateCcw size={15} /> Jugar de nuevo
        </button>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function JuegoStandalonePage() {
  const [nombre,     setNombre]     = useState(() => localStorage.getItem(KEY_NOMBRE) || null)
  const [fase,       setFase]       = useState('intro')   // intro | jugando | resultados
  const [secuencia,  setSecuencia]  = useState([])
  const [indice,     setIndice]     = useState(0)
  const [respuestas, setRespuestas] = useState({})

  // Persistir nombre
  const handleEntrar = (n) => {
    localStorage.setItem(KEY_NOMBRE, n)
    setNombre(n)
  }

  // Iniciar juego
  const iniciar = useCallback(() => {
    const seq = construirSecuencia()
    localStorage.setItem(KEY_SECUENCIA, JSON.stringify(seq.map(i => i.id)))
    localStorage.setItem(KEY_RESPUESTAS, '{}')
    setSecuencia(seq)
    setIndice(0)
    setRespuestas({})
    setFase('jugando')
  }, [])

  // Reiniciar
  const reiniciar = useCallback(() => {
    localStorage.removeItem(KEY_SECUENCIA)
    localStorage.removeItem(KEY_RESPUESTAS)
    setSecuencia([])
    setRespuestas({})
    setIndice(0)
    setFase('intro')
  }, [])

  // Responder
  const handleAnswer = useCallback(async (resultado) => {
    const item = secuencia[indice]
    if (!item || respuestas[item.id]) return

    const nuevaResp = { isCorrect: resultado.isCorrect, pts: resultado.pts }
    const nuevasResp = { ...respuestas, [item.id]: nuevaResp }

    setRespuestas(nuevasResp)
    localStorage.setItem(KEY_RESPUESTAS, JSON.stringify(nuevasResp))

    // Guardar en Supabase en tiempo real
    if (nombre) {
      guardarResultado(nombre, nuevasResp, 'en_progreso').catch(() => {})
    }
  }, [secuencia, indice, respuestas, nombre])

  // Avanzar
  const handleNext = useCallback(async () => {
    const siguiente = indice + 1
    if (siguiente >= secuencia.length) {
      // Guardar como completado
      if (nombre) {
        await guardarResultado(nombre, respuestas, 'completado')
      }
      localStorage.removeItem(KEY_SECUENCIA)
      localStorage.removeItem(KEY_RESPUESTAS)
      setFase('resultados')
    } else {
      setIndice(siguiente)
    }
  }, [indice, secuencia.length, nombre, respuestas])

  // ── Sin nombre → pantalla de entrada ────────────────────────────────────────
  if (!nombre) return <PantallaNombre onEntrar={handleEntrar} />

  // ── Resultados ───────────────────────────────────────────────────────────────
  if (fase === 'resultados') return (
    <PantallaResultados
      nombre={nombre}
      respuestas={respuestas}
      secuencia={secuencia}
      onReiniciar={reiniciar}
    />
  )

  // ── Intro ────────────────────────────────────────────────────────────────────
  if (fase === 'intro') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-5 animate-fade-in">
        <div className="card border-sena-green/30 bg-gradient-to-br from-sena-green/10 to-transparent text-center py-8">
          <div className="text-5xl mb-3">🎮</div>
          <h1 className="text-2xl font-black text-white mb-1">¡Hola, {nombre}!</h1>
          <p className="text-gray-400 text-sm">¿Listo para el desafío?</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { emoji: '❓', val: PREGUNTAS.length,          label: 'Preguntas' },
            { emoji: '🔧', val: RETOS_PSEUDOCODIGO.length, label: 'Retos' },
            { emoji: '⭐', val: TOTAL_PUNTOS_POSIBLES,     label: 'Pts máx.' },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className="text-xl mb-0.5">{s.emoji}</div>
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card border-yellow-500/20 text-sm text-gray-300 space-y-1">
          <p className="text-yellow-400 font-semibold text-xs uppercase mb-2">⚠️ Reglas</p>
          <p>• Cada pregunta tiene un solo intento.</p>
          <p>• Solo respuestas correctas suman puntos.</p>
          <p>• Tu resultado queda registrado.</p>
        </div>

        <button onClick={iniciar} className="btn-primary w-full justify-center py-3 text-base">
          🚀 Comenzar juego
        </button>

        <button
          onClick={() => { localStorage.removeItem(KEY_NOMBRE); setNombre(null) }}
          className="w-full text-xs text-gray-600 hover:text-gray-400 transition-colors py-1"
        >
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
      {/* Header mínimo */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-sena-green rounded flex items-center justify-center text-white text-xs font-black">S</span>
            <span className="text-gray-500 text-xs">{nombre}</span>
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
