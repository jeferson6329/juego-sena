import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { gameHelpers } from '../lib/supabase'
import {
  PREGUNTAS, RETOS_PSEUDOCODIGO, TOTAL_PUNTOS_POSIBLES, TEMAS,
} from '../data/gameData'
import GameEngine from '../components/game/GameEngine'
import {
  Trophy, Gamepad2, RotateCcw, Star, Target,
  CheckCircle2, XCircle, BarChart2,
} from 'lucide-react'

// ─── Utilidades ──────────────────────────────────────────────────────────────

function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function construirSecuencia() {
  // Intercala preguntas y retos de forma mezclada pero con retos distribuidos
  const pregs = mezclar(PREGUNTAS)
  const retos = mezclar(RETOS_PSEUDOCODIGO)
  const secuencia = []
  let ri = 0
  pregs.forEach((p, i) => {
    secuencia.push({ ...p, _tipo: 'pregunta' })
    // Insertar un reto cada ~4 preguntas
    if ((i + 1) % 4 === 0 && ri < retos.length) {
      secuencia.push({ ...retos[ri], _tipo: 'reto' })
      ri++
    }
  })
  // Agregar retos sobrantes al final
  while (ri < retos.length) {
    secuencia.push({ ...retos[ri], _tipo: 'reto' })
    ri++
  }
  return secuencia
}

// ─── Pantalla de Intro ────────────────────────────────────────────────────────

function PantallaIntro({ onIniciar, sesionExistente, onContinuar, loading }) {
  const totalPreg = PREGUNTAS.length
  const totalRetos = RETOS_PSEUDOCODIGO.length
  const totalPts = TOTAL_PUNTOS_POSIBLES

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card border-sena-green/30 bg-gradient-to-br from-sena-green/10 to-transparent text-center py-8">
        <div className="text-5xl mb-4">🎮</div>
        <h1 className="text-3xl font-black text-white mb-2">Juego Educativo SENA</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Pon a prueba tus conocimientos sobre Fundamentos del Back-end y Arquitectura de Software.
        </p>
      </div>

      {/* Estadísticas del juego */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '❓', label: 'Preguntas', val: totalPreg },
          { icon: '🔧', label: 'Retos de pseudocódigo', val: totalRetos },
          { icon: '⭐', label: 'Puntos posibles', val: totalPts },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-black text-white">{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Temas */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Temas evaluados
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(TEMAS).map(t => (
            <span key={t} className="badge badge-green text-xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Tipos de actividad */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Tipos de actividad
        </h2>
        <ul className="space-y-1.5 text-sm text-gray-300">
          {[
            '✅ Selección múltiple',
            '✅ Verdadero o falso',
            '✅ Relacionar conceptos',
            '✅ Ordenar pasos',
            '✅ Identificar errores en código',
            '✅ Identificar la salida de un algoritmo',
            '✅ Clasificar componentes MVC',
            '✅ Identificar principios SOLID',
            '🔧 Constructor de pseudocódigo',
          ].map(t => <li key={t}>{t}</li>)}
        </ul>
      </div>

      {/* Reglas */}
      <div className="card border-yellow-500/20">
        <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-3">
          ⚠️ Reglas del juego
        </h2>
        <ul className="space-y-1.5 text-sm text-gray-300">
          <li>• Cada pregunta tiene un único intento. No podrás volver atrás.</li>
          <li>• Los puntos se acumulan solo por respuestas correctas.</li>
          <li>• El organizador puede aplicar bonus o descuentos.</li>
          <li>• Inicia sesión para guardar tu progreso en la base de datos.</li>
        </ul>
      </div>

      {/* Acciones */}
      {sesionExistente ? (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onContinuar}
            disabled={loading}
            className="btn-primary flex-1 justify-center py-3 text-base"
          >
            {loading ? 'Cargando…' : '▶ Continuar partida'}
          </button>
          <button
            onClick={onIniciar}
            disabled={loading}
            className="btn-secondary flex-1 justify-center py-3 text-base"
          >
            <RotateCcw size={16} /> Nueva partida
          </button>
        </div>
      ) : (
        <button
          onClick={onIniciar}
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {loading ? 'Iniciando…' : '🚀 Comenzar juego'}
        </button>
      )}
    </div>
  )
}

// ─── Pantalla de Resultados ───────────────────────────────────────────────────

function PantallaResultados({ respuestas, secuencia, onReiniciar, onVerEstadisticas }) {
  const total = secuencia.length
  const aciertos = Object.values(respuestas).filter(r => r.isCorrect).length
  const ptsObtenidos = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const pct = total > 0 ? Math.round((aciertos / total) * 100) : 0

  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪'
  const msg = pct >= 80
    ? '¡Excelente dominio! Eres un desarrollador SENA de alto nivel.'
    : pct >= 60
    ? 'Buen desempeño. Repasa los temas que fallaste para mejorar.'
    : pct >= 40
    ? 'Hay margen de mejora. Revisa el material de las guías.'
    : 'Te recomendamos estudiar el material antes de volver a intentarlo.'

  // Estadísticas por tema
  const porTema = {}
  secuencia.forEach(item => {
    const tema = item.tema || 'Sin tema'
    if (!porTema[tema]) porTema[tema] = { total: 0, aciertos: 0 }
    porTema[tema].total++
    const resp = respuestas[item.id]
    if (resp?.isCorrect) porTema[tema].aciertos++
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="card text-center border-gray-700 py-8">
        <div className="text-6xl mb-3 animate-bounce-light">{emoji}</div>
        <h1 className="text-2xl font-black text-white mb-1">¡Juego completado!</h1>
        <p className="text-gray-400 text-sm">{msg}</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Target size={18} />, label: 'Aciertos', val: `${aciertos}/${total}`, color: 'text-sena-green' },
          { icon: <XCircle size={18} />, label: 'Errores', val: total - aciertos, color: 'text-red-400' },
          { icon: <Star size={18} />, label: 'Puntos', val: ptsObtenidos, color: 'text-yellow-400' },
          { icon: <BarChart2 size={18} />, label: 'Porcentaje', val: `${pct}%`, color: pct >= 60 ? 'text-sena-green' : 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="card">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
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
          Puntos obtenidos: {ptsObtenidos} / {TOTAL_PUNTOS_POSIBLES} posibles
        </p>
      </div>

      {/* Rendimiento por tema */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <BarChart2 size={14} /> Rendimiento por tema
        </h2>
        <div className="space-y-2.5">
          {Object.entries(porTema).map(([tema, st]) => {
            const p = Math.round((st.aciertos / st.total) * 100)
            const color = p >= 60 ? 'bg-sena-green' : p >= 40 ? 'bg-yellow-400' : 'bg-red-400'
            const nivel = p >= 60 ? 'Buen dominio' : p >= 40 ? 'Requiere práctica' : 'Necesita refuerzo'
            return (
              <div key={tema}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300 truncate max-w-[60%]">{tema}</span>
                  <span className={`font-semibold ${p >= 60 ? 'text-sena-green' : p >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {st.aciertos}/{st.total} — {nivel}
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

      {/* Revisión de respuestas */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Revisión de respuestas
        </h2>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {secuencia.map((item, i) => {
            const r = respuestas[item.id]
            const correcto = r?.isCorrect
            return (
              <div key={item.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${
                  correcto ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                {correcto
                  ? <CheckCircle2 size={13} className="text-sena-green shrink-0 mt-0.5" />
                  : <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 truncate">{item.enunciado || item.titulo}</p>
                  <p className="text-gray-600">{item.tema} · {correcto ? `+${r.pts} pts` : '0 pts'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={onReiniciar} className="btn-secondary flex-1 justify-center">
          <RotateCcw size={15} /> Nueva partida
        </button>
        <button onClick={onVerEstadisticas} className="btn-ghost flex-1 justify-center">
          <BarChart2 size={15} /> Ver estadísticas de todos
        </button>
      </div>
    </div>
  )
}

// ─── Pantalla: debe iniciar sesión ────────────────────────────────────────────

function PantallaSinSesion() {
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto text-center space-y-5 py-16 animate-fade-in">
      <div className="text-5xl">🔒</div>
      <h2 className="text-xl font-bold text-white">Inicia sesión para jugar</h2>
      <p className="text-gray-400 text-sm">
        Necesitas una cuenta para participar en el juego, guardar tu progreso y aparecer en el ranking.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate('/login')} className="btn-primary">
          Iniciar sesión
        </button>
        <button onClick={() => navigate('/register')} className="btn-secondary">
          Registrarse
        </button>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function JuegoPage() {
  const { user, profile, isOrganizador, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [fase, setFase] = useState('intro')       // intro | jugando | resultados
  const [secuencia, setSecuencia] = useState([])  // items mezclados
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState({}) // { itemId: { isCorrect, pts, respuesta } }
  const [loading, setLoading] = useState(false)
  const [sesionExistente, setSesionExistente] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Verificar si hay sesión guardada al montar
  useEffect(() => {
    if (!user) return
    gameHelpers.getSession(user.id).then(({ data }) => {
      if (data) setSesionExistente(data)
    })
  }, [user])

  // Iniciar nuevo juego
  const iniciar = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      // Borrar sesión anterior si existe
      if (sesionExistente) {
        await gameHelpers.resetSession(user.id)
        setSesionExistente(null)
        refreshProfile()
      }
      const seq = construirSecuencia()
      setSecuencia(seq)
      setIndice(0)
      setRespuestas({})
      // Crear nueva sesión en BD
      await gameHelpers.getOrCreateSession(
        user.id,
        PREGUNTAS.length,
        RETOS_PSEUDOCODIGO.length
      )
      setFase('jugando')
    } finally {
      setLoading(false)
    }
  }, [user, sesionExistente, refreshProfile])

  // Continuar partida existente (simplificado: reconstruye secuencia y salta respondidas)
  const continuar = useCallback(async () => {
    if (!user || !sesionExistente) return
    setLoading(true)
    try {
      const { data: answersData } = await gameHelpers.getMyAnswers(user.id)
      const respondidas = {}
      if (answersData) {
        answersData.forEach(a => {
          respondidas[a.item_id] = {
            isCorrect: a.is_correct,
            pts: a.pts_obtenidos,
            respuesta: a.respuesta_dada,
          }
        })
      }
      const seq = construirSecuencia()
      setSecuencia(seq)
      setRespuestas(respondidas)
      // Encontrar primer ítem sin responder
      const primerSinResponder = seq.findIndex(item => !respondidas[item.id])
      setIndice(primerSinResponder >= 0 ? primerSinResponder : seq.length - 1)
      setFase(primerSinResponder < 0 ? 'resultados' : 'jugando')
    } finally {
      setLoading(false)
    }
  }, [user, sesionExistente])

  // Manejar respuesta del jugador
  const handleAnswer = useCallback(async (resultado) => {
    const item = secuencia[indice]
    if (!item) return

    const nuevaRespuesta = {
      isCorrect: resultado.isCorrect,
      pts: resultado.pts,
      respuesta: resultado.respuesta,
    }

    setRespuestas(prev => ({ ...prev, [item.id]: nuevaRespuesta }))

    // Guardar en Supabase (no bloquea la UI)
    if (user) {
      setGuardando(true)
      try {
        await gameHelpers.saveGameAnswer(user.id, {
          itemId:    item.id,
          itemType:  item._tipo || 'pregunta',
          tema:      item.tema || '',
          guia:      item.guia || '',
          isCorrect: resultado.isCorrect,
          pts:       resultado.pts,
          respuesta: resultado.respuesta,
        })
        if (resultado.isCorrect) refreshProfile()
      } catch (e) {
        console.warn('Error guardando respuesta:', e)
      } finally {
        setGuardando(false)
      }
    }
  }, [secuencia, indice, user, refreshProfile])

  // Avanzar al siguiente ítem
  const handleNext = useCallback(async () => {
    const siguiente = indice + 1
    if (siguiente >= secuencia.length) {
      // Juego terminado
      if (user) {
        await gameHelpers.completeSession(user.id)
      }
      setFase('resultados')
    } else {
      setIndice(siguiente)
      if (user) {
        await gameHelpers.updateCurrentIndex(user.id, siguiente)
      }
    }
  }, [indice, secuencia.length, user])

  // ── Renderizado ─────────────────────────────────────────────────────────

  if (!user) return (
    <div>
      <PantallaSinSesion />
    </div>
  )

  // Organizadores no juegan, los redirigimos
  if (isOrganizador) return (
    <div className="max-w-md mx-auto text-center space-y-5 py-16 animate-fade-in">
      <div className="text-5xl">👨‍🏫</div>
      <h2 className="text-xl font-bold text-white">Eres organizador</h2>
      <p className="text-gray-400 text-sm">
        Los organizadores no participan en el juego. Accede al panel de organizador para ver estadísticas y gestionar jugadores.
      </p>
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

  if (fase === 'intro') return (
    <PantallaIntro
      onIniciar={iniciar}
      sesionExistente={sesionExistente}
      onContinuar={continuar}
      loading={loading}
    />
  )

  if (fase === 'resultados') return (
    <PantallaResultados
      respuestas={respuestas}
      secuencia={secuencia}
      onReiniciar={iniciar}
      onVerEstadisticas={() => navigate('/organizador/estadisticas')}
    />
  )

  // Fase jugando
  const itemActual = secuencia[indice]
  const respuestaActual = respuestas[itemActual?.id] || null
  const ptsAcumulados = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra superior del juego */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {indice + 1} / {secuencia.length}
          </span>
          {guardando && (
            <span className="text-xs text-gray-600 animate-pulse">Guardando…</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-sm font-semibold">⭐ {ptsAcumulados} pts</span>
          <button
            onClick={() => setFase('intro')}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            ✕ Salir
          </button>
        </div>
      </div>

      {/* Motor del juego */}
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
