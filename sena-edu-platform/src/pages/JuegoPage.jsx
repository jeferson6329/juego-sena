import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registrarJugador } from '../lib/localStats'
import {
  PREGUNTAS, RETOS_PSEUDOCODIGO, TOTAL_PUNTOS_POSIBLES, TEMAS,
} from '../data/gameData'
import GameEngine from '../components/game/GameEngine'
import {
  Gamepad2, RotateCcw, Star, Target,
  CheckCircle2, XCircle, BarChart2, Trophy,
} from 'lucide-react'

// ─── Clave localStorage para respuestas del juego ────────────────────────────
const STORAGE_RESPUESTAS = 'sena_juego_respuestas'
const STORAGE_SECUENCIA  = 'sena_juego_secuencia_ids'

function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function construirSecuencia() {
  const pregs  = mezclar(PREGUNTAS)
  const retos  = mezclar(RETOS_PSEUDOCODIGO)
  const seq    = []
  let ri = 0
  pregs.forEach((p, i) => {
    seq.push({ ...p, _tipo: 'pregunta' })
    if ((i + 1) % 4 === 0 && ri < retos.length) {
      seq.push({ ...retos[ri], _tipo: 'reto' })
      ri++
    }
  })
  while (ri < retos.length) { seq.push({ ...retos[ri], _tipo: 'reto' }); ri++ }
  return seq
}

// Reconstruir secuencia guardada (mantiene el orden de una partida anterior)
function reconstruirSecuencia(ids) {
  const todos = [...PREGUNTAS.map(p => ({ ...p, _tipo: 'pregunta' })),
                 ...RETOS_PSEUDOCODIGO.map(r => ({ ...r, _tipo: 'reto' }))]
  const map   = Object.fromEntries(todos.map(i => [i.id, i]))
  return ids.map(id => map[id]).filter(Boolean)
}

// ─── Pantalla de Intro ────────────────────────────────────────────────────────
function PantallaIntro({ nombre, onIniciar, partidaGuardada, onContinuar }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card border-sena-green/30 bg-gradient-to-br from-sena-green/10 to-transparent text-center py-8">
        <div className="text-5xl mb-4">🎮</div>
        <h1 className="text-3xl font-black text-white mb-1">Juego Educativo SENA</h1>
        <p className="text-sena-green font-semibold">¡Hola, {nombre}!</p>
        <p className="text-gray-400 max-w-md mx-auto mt-2 text-sm">
          Pon a prueba tus conocimientos sobre Fundamentos del Back-end y Arquitectura de Software.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '❓', label: 'Preguntas',  val: PREGUNTAS.length },
          { icon: '🔧', label: 'Retos',      val: RETOS_PSEUDOCODIGO.length },
          { icon: '⭐', label: 'Pts máximo', val: TOTAL_PUNTOS_POSIBLES },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-black text-white">{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Temas evaluados</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(TEMAS).map(t => (
            <span key={t} className="badge badge-green text-xs">{t}</span>
          ))}
        </div>
      </div>

      <div className="card border-yellow-500/20">
        <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-2">⚠️ Reglas</h2>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Cada pregunta tiene un solo intento. No puedes volver atrás.</li>
          <li>• Solo las respuestas correctas suman puntos.</li>
          <li>• Tu progreso se guarda en este navegador.</li>
        </ul>
      </div>

      {partidaGuardada ? (
        <div className="flex gap-3">
          <button onClick={onContinuar} className="btn-primary flex-1 justify-center py-3 text-base">
            ▶ Continuar partida
          </button>
          <button onClick={onIniciar} className="btn-secondary flex-1 justify-center py-3">
            <RotateCcw size={15} /> Nueva partida
          </button>
        </div>
      ) : (
        <button onClick={onIniciar} className="btn-primary w-full justify-center py-3 text-base">
          🚀 Comenzar juego
        </button>
      )}
    </div>
  )
}

// ─── Pantalla de Resultados ───────────────────────────────────────────────────
function PantallaResultados({ respuestas, secuencia, onReiniciar, nombre }) {
  const total      = secuencia.length
  const aciertos   = Object.values(respuestas).filter(r => r.isCorrect).length
  const pts        = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const pct        = total > 0 ? Math.round((aciertos / total) * 100) : 0

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
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="card text-center border-gray-700 py-8">
        <div className="text-6xl mb-3 animate-bounce-light">{emoji}</div>
        <h1 className="text-2xl font-black text-white mb-1">¡Juego completado, {nombre}!</h1>
        <p className="text-gray-400 text-sm">{msg}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Target size={18} />,   label: 'Aciertos',   val: `${aciertos}/${total}`, color: 'text-sena-green' },
          { icon: <XCircle size={18} />,  label: 'Errores',    val: total - aciertos,       color: 'text-red-400' },
          { icon: <Star size={18} />,     label: 'Puntos',     val: pts,                    color: 'text-yellow-400' },
          { icon: <BarChart2 size={18} />,label: 'Porcentaje', val: `${pct}%`,              color: pct >= 60 ? 'text-sena-green' : 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra progreso */}
      <div className="card">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Porcentaje de aciertos</span>
          <span className={pct >= 60 ? 'text-sena-green' : 'text-red-400'}>{pct}%</span>
        </div>
        <div className="progress-bar h-3">
          <div className={`progress-fill ${pct >= 80 ? 'bg-sena-green' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
               style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">
          {pts} / {TOTAL_PUNTOS_POSIBLES} puntos posibles
        </p>
      </div>

      {/* Rendimiento por tema */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <BarChart2 size={14} /> Rendimiento por tema
        </h2>
        <div className="space-y-2.5">
          {Object.entries(porTema).map(([tema, st]) => {
            const p     = Math.round((st.aciertos / st.total) * 100)
            const color = p >= 60 ? 'bg-sena-green' : p >= 40 ? 'bg-yellow-400' : 'bg-red-400'
            const label = p >= 60 ? 'Buen dominio' : p >= 40 ? 'Requiere práctica' : 'Necesita refuerzo'
            return (
              <div key={tema}>
                <div className="flex items-center justify-between text-xs mb-1">
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
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Revisión de respuestas</h2>
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          {secuencia.map(item => {
            const r = respuestas[item.id]
            const ok = r?.isCorrect
            return (
              <div key={item.id}
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs ${ok ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'}`}
              >
                {ok ? <CheckCircle2 size={12} className="text-sena-green shrink-0 mt-0.5" />
                    : <XCircle     size={12} className="text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 truncate">{item.enunciado || item.titulo}</p>
                  <p className="text-gray-600">{item.tema} · {ok ? `+${r.pts} pts` : '0 pts'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={onReiniciar} className="btn-primary w-full justify-center py-3">
        <RotateCcw size={15} /> Jugar de nuevo
      </button>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function JuegoPage() {
  const { nombre, isOrganizador, agregarPuntos } = useAuth()
  const navigate = useNavigate()

  // Estado del juego
  const [fase, setFase]           = useState(() => {
    // Si hay partida guardada, ofrecer continuar
    const ids = localStorage.getItem(STORAGE_SECUENCIA)
    return ids ? 'intro' : 'intro'
  })
  const [secuencia, setSecuencia] = useState(() => {
    const ids = localStorage.getItem(STORAGE_SECUENCIA)
    if (ids) {
      try { return reconstruirSecuencia(JSON.parse(ids)) } catch { return [] }
    }
    return []
  })
  const [indice, setIndice]       = useState(0)
  const [respuestas, setRespuestas] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_RESPUESTAS)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })

  const partidaGuardada = secuencia.length > 0 && Object.keys(respuestas).length > 0

  // Organizadores no juegan
  if (isOrganizador) return (
    <div className="max-w-md mx-auto text-center space-y-5 py-16 animate-fade-in">
      <div className="text-5xl">👨‍🏫</div>
      <h2 className="text-xl font-bold text-white">Eres organizador</h2>
      <p className="text-gray-400 text-sm">Los organizadores no participan en el juego.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => navigate('/organizador/ranking')} className="btn-primary">
          <Trophy size={15} /> Ver ranking
        </button>
        <button onClick={() => navigate('/organizador/estadisticas')} className="btn-secondary">
          <BarChart2 size={15} /> Estadísticas
        </button>
      </div>
    </div>
  )

  // Iniciar nueva partida
  const iniciar = useCallback(() => {
    const seq = construirSecuencia()
    const seqIds = seq.map(i => i.id)
    localStorage.setItem(STORAGE_SECUENCIA, JSON.stringify(seqIds))
    localStorage.setItem(STORAGE_RESPUESTAS, '{}')
    setSecuencia(seq)
    setIndice(0)
    setRespuestas({})
    setFase('jugando')
  }, [])

  // Continuar partida guardada
  const continuar = useCallback(() => {
    // Encontrar primer ítem sin responder
    const primerPendiente = secuencia.findIndex(item => !respuestas[item.id])
    if (primerPendiente < 0) {
      setFase('resultados')
    } else {
      setIndice(primerPendiente)
      setFase('jugando')
    }
  }, [secuencia, respuestas])

  // Manejar respuesta
  const handleAnswer = useCallback((resultado) => {
    const item = secuencia[indice]
    if (!item || respuestas[item.id]) return

    const nuevaResp = { isCorrect: resultado.isCorrect, pts: resultado.pts }
    const nuevasRespuestas = { ...respuestas, [item.id]: nuevaResp }

    setRespuestas(nuevasRespuestas)
    localStorage.setItem(STORAGE_RESPUESTAS, JSON.stringify(nuevasRespuestas))

    if (resultado.isCorrect && resultado.pts > 0) {
      agregarPuntos(resultado.pts)
    }

    // Registrar progreso en tiempo real para que el organizador lo vea
    registrarJugador(nombre, nuevasRespuestas, 'en_progreso')
  }, [secuencia, indice, respuestas, agregarPuntos, nombre])

  // Avanzar
  const handleNext = useCallback(() => {
    const siguiente = indice + 1
    if (siguiente >= secuencia.length) {
      localStorage.removeItem(STORAGE_SECUENCIA)
      localStorage.removeItem(STORAGE_RESPUESTAS)
      // Registrar al jugador en el listado local del organizador
      registrarJugador(nombre, respuestas)
      setFase('resultados')
    } else {
      setIndice(siguiente)
    }
  }, [indice, secuencia.length])

  // Reiniciar
  const reiniciar = useCallback(() => {
    localStorage.removeItem(STORAGE_SECUENCIA)
    localStorage.removeItem(STORAGE_RESPUESTAS)
    setSecuencia([])
    setRespuestas({})
    setIndice(0)
    setFase('intro')
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────

  if (fase === 'intro') return (
    <PantallaIntro
      nombre={nombre}
      onIniciar={iniciar}
      partidaGuardada={partidaGuardada}
      onContinuar={continuar}
    />
  )

  if (fase === 'resultados') return (
    <PantallaResultados
      respuestas={respuestas}
      secuencia={secuencia}
      onReiniciar={reiniciar}
      nombre={nombre}
    />
  )

  // Fase jugando
  const itemActual      = secuencia[indice]
  const respuestaActual = respuestas[itemActual?.id] || null
  const ptsAcumulados   = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-xs text-gray-500">{indice + 1} / {secuencia.length}</span>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-sm font-semibold">⭐ {ptsAcumulados} pts</span>
          <button onClick={reiniciar} className="text-xs text-gray-500 hover:text-white transition-colors">
            ✕ Salir
          </button>
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
  )
}
