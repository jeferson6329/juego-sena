import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { statsHelpers } from '../../lib/supabase'
import { PREGUNTAS, RETOS_PSEUDOCODIGO, TEMAS } from '../../data/gameData'
import {
  BarChart2, Users, CheckCircle2, XCircle, RefreshCw,
  AlertTriangle, TrendingDown, TrendingUp, BookOpen, Lock,
} from 'lucide-react'

// ─── Umbral de refuerzo ───────────────────────────────────────────────────────
const UMBRAL_REFUERZO  = 60 // % de errores → necesita refuerzo
const UMBRAL_PRACTICA  = 40 // % de errores → requiere práctica

function nivelDominio(pctError) {
  if (pctError >= UMBRAL_REFUERZO) return { label: 'Necesita refuerzo', color: 'text-red-400', bg: 'bg-red-500' }
  if (pctError >= UMBRAL_PRACTICA) return { label: 'Requiere práctica', color: 'text-yellow-400', bg: 'bg-yellow-500' }
  return { label: 'Buen dominio', color: 'text-sena-green', bg: 'bg-sena-green' }
}

// ─── Barrita de porcentaje ────────────────────────────────────────────────────
function MiniBar({ pct, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
    </div>
  )
}

// ─── Tarjeta de recomendación ─────────────────────────────────────────────────
function Recomendacion({ tema, pctError, pctAciertos, preguntasMasFalladas }) {
  const nivel = nivelDominio(pctError)
  return (
    <div className={`p-4 rounded-xl border ${
      pctError >= UMBRAL_REFUERZO
        ? 'border-red-500/30 bg-red-500/5'
        : pctError >= UMBRAL_PRACTICA
          ? 'border-yellow-500/30 bg-yellow-500/5'
          : 'border-sena-green/30 bg-sena-green/5'
    }`}>
      <div className="flex items-start gap-2 mb-2">
        {pctError >= UMBRAL_REFUERZO
          ? <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          : pctError >= UMBRAL_PRACTICA
            ? <TrendingDown size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            : <TrendingUp size={16} className="text-sena-green shrink-0 mt-0.5" />
        }
        <div>
          <p className={`font-semibold text-sm ${nivel.color}`}>{tema}</p>
          <p className={`text-xs ${nivel.color}`}>{nivel.label} — {pctError}% de errores</p>
        </div>
      </div>
      {pctError >= UMBRAL_PRACTICA && preguntasMasFalladas.length > 0 && (
        <p className="text-gray-400 text-xs leading-relaxed">
          Los participantes presentan dificultades en <strong className="text-gray-300">{tema}</strong>{' '}
          porque la mayoría tuvo problemas con: {preguntasMasFalladas.slice(0, 2).map(p =>
            `"${(p.enunciado || p.titulo || '').slice(0, 60)}…"`
          ).join(' y ')}.
          Se recomienda reforzar este tema con el material de las guías.
        </p>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function EstadisticasPage() {
  const { isOrganizador, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vistaActiva, setVistaActiva] = useState('general') // general | preguntas | temas

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      const [resAnswers, resSessions] = await Promise.all([
        statsHelpers.getAllGameAnswers(),
        statsHelpers.getAllSessions(),
      ])
      setAnswers(resAnswers.data || [])
      setSessions(resSessions.data || [])
    } catch (e) {
      setError('Error al cargar estadísticas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isOrganizador) cargar()
  }, [authLoading, isOrganizador])

  // ── Calcular estadísticas ─────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalJugadores = sessions.length
    const completados = sessions.filter(s => s.status === 'completado').length
    const enProgreso = sessions.filter(s => s.status === 'en_progreso').length
    const pctFinalizacion = totalJugadores > 0 ? Math.round((completados / totalJugadores) * 100) : 0

    const totalAciertos = answers.filter(a => a.is_correct).length
    const totalErrores  = answers.length - totalAciertos
    const promedioAciertos = answers.length > 0 ? Math.round((totalAciertos / answers.length) * 100) : 0

    const ptsPromedio = sessions.length > 0
      ? Math.round(sessions.reduce((s, j) => s + ((j.pts_preguntas || 0) + (j.pts_retos || 0)), 0) / sessions.length)
      : 0

    // Por ítem (pregunta/reto)
    const porItem = {}
    answers.forEach(a => {
      if (!porItem[a.item_id]) {
        porItem[a.item_id] = { total: 0, aciertos: 0, errores: 0, tema: a.tema, guia: a.guia, tipo: a.item_type }
      }
      porItem[a.item_id].total++
      if (a.is_correct) porItem[a.item_id].aciertos++
      else porItem[a.item_id].errores++
    })

    // Por tema
    const porTema = {}
    answers.forEach(a => {
      const t = a.tema || 'Sin tema'
      if (!porTema[t]) porTema[t] = { total: 0, aciertos: 0, errores: 0 }
      porTema[t].total++
      if (a.is_correct) porTema[t].aciertos++
      else porTema[t].errores++
    })

    // Ítem más fallado y más acertado
    const items = Object.entries(porItem).map(([id, st]) => ({
      id, ...st,
      pctError: st.total > 0 ? Math.round((st.errores / st.total) * 100) : 0,
      pctAcierto: st.total > 0 ? Math.round((st.aciertos / st.total) * 100) : 0,
    }))
    items.sort((a, b) => b.pctError - a.pctError)
    const masFallado = items[0] || null
    const masAcertado = [...items].sort((a, b) => b.pctAcierto - a.pctAcierto)[0] || null

    // Tema con menor rendimiento
    const temasStats = Object.entries(porTema).map(([tema, st]) => ({
      tema, ...st,
      pctError: st.total > 0 ? Math.round((st.errores / st.total) * 100) : 0,
      pctAcierto: st.total > 0 ? Math.round((st.aciertos / st.total) * 100) : 0,
    })).sort((a, b) => b.pctError - a.pctError)

    // Enriquecer items con texto de pregunta/reto
    const todosItems = [...PREGUNTAS, ...RETOS_PSEUDOCODIGO]
    const itemMap = Object.fromEntries(todosItems.map(p => [p.id, p]))

    return {
      totalJugadores, completados, enProgreso, pctFinalizacion,
      totalAciertos, totalErrores, promedioAciertos, ptsPromedio,
      porItem: items.map(i => ({ ...i, itemData: itemMap[i.id] })),
      temasStats,
      masFallado: masFallado ? { ...masFallado, itemData: itemMap[masFallado.id] } : null,
      masAcertado: masAcertado ? { ...masAcertado, itemData: itemMap[masAcertado.id] } : null,
    }
  }, [answers, sessions])

  // ── Acceso denegado ───────────────────────────────────────────────────────

  if (authLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>
  )

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">Las estadísticas solo están disponibles para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver al inicio</button>
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <BarChart2 size={22} className="text-blue-400" /> Estadísticas generales
          </h1>
          <p className="section-subtitle">Resultados del juego educativo — solo organizadores</p>
        </div>
        <button onClick={cargar} className="btn-secondary text-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Calculando estadísticas…</div>
      ) : (
        <>
          {/* KPIs globales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total jugadores', val: stats.totalJugadores, icon: <Users size={16} />, color: 'text-blue-400' },
              { label: 'Completaron', val: `${stats.completados} (${stats.pctFinalizacion}%)`, icon: <CheckCircle2 size={16} />, color: 'text-sena-green' },
              { label: 'Promedio aciertos', val: `${stats.promedioAciertos}%`, icon: <TrendingUp size={16} />, color: 'text-yellow-400' },
              { label: 'Promedio de puntos', val: stats.ptsPromedio, icon: <BarChart2 size={16} />, color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="card text-center">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Destacados */}
          {(stats.masFallado || stats.masAcertado) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {stats.masFallado?.itemData && (
                <div className="card border-red-500/20">
                  <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <XCircle size={12} /> Pregunta más fallada
                  </p>
                  <p className="text-sm text-gray-300 mb-1 leading-snug">
                    {(stats.masFallado.itemData.enunciado || stats.masFallado.itemData.titulo || '').slice(0, 100)}…
                  </p>
                  <p className="text-xs text-red-400">{stats.masFallado.pctError}% de errores ({stats.masFallado.errores}/{stats.masFallado.total})</p>
                </div>
              )}
              {stats.masAcertado?.itemData && (
                <div className="card border-sena-green/20">
                  <p className="text-xs text-sena-green font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Pregunta con más aciertos
                  </p>
                  <p className="text-sm text-gray-300 mb-1 leading-snug">
                    {(stats.masAcertado.itemData.enunciado || stats.masAcertado.itemData.titulo || '').slice(0, 100)}…
                  </p>
                  <p className="text-xs text-sena-green">{stats.masAcertado.pctAcierto}% de aciertos ({stats.masAcertado.aciertos}/{stats.masAcertado.total})</p>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-800">
            {[
              { key: 'general', label: 'Por tema' },
              { key: 'preguntas', label: 'Por pregunta' },
              { key: 'refuerzo', label: 'Refuerzo académico' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setVistaActiva(t.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  vistaActiva === t.key
                    ? 'border-b-2 border-sena-green text-sena-green'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Vista: por tema */}
          {vistaActiva === 'general' && (
            <div className="card space-y-4">
              {stats.temasStats.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Sin datos todavía.</p>
              ) : (
                stats.temasStats.map(t => {
                  const nivel = nivelDominio(t.pctError)
                  return (
                    <div key={t.tema}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300 font-medium">{t.tema}</span>
                        <span className={`text-xs font-semibold ${nivel.color}`}>
                          {nivel.label} — {t.aciertos}/{t.total}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Aciertos {t.pctAcierto}%</p>
                          <MiniBar pct={t.pctAcierto} color="bg-sena-green" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Errores {t.pctError}%</p>
                          <MiniBar pct={t.pctError} color="bg-red-500" />
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Vista: por pregunta */}
          {vistaActiva === 'preguntas' && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="pb-2 pr-3 text-xs text-gray-500 font-semibold uppercase">Pregunta / Reto</th>
                    <th className="pb-2 pr-3 text-xs text-gray-500 font-semibold uppercase text-center">Resp.</th>
                    <th className="pb-2 pr-3 text-xs text-gray-500 font-semibold uppercase text-center">✓</th>
                    <th className="pb-2 pr-3 text-xs text-gray-500 font-semibold uppercase text-center">✗</th>
                    <th className="pb-2 text-xs text-gray-500 font-semibold uppercase text-center">% Acierto</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.porItem.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-500">Sin datos todavía.</td></tr>
                  ) : (
                    stats.porItem.map(item => (
                      <tr key={item.id} className="border-b border-gray-800/40 hover:bg-gray-800/20">
                        <td className="py-2.5 pr-3 max-w-xs">
                          <p className="text-gray-300 text-xs truncate">
                            {item.itemData
                              ? (item.itemData.enunciado || item.itemData.titulo || item.id).slice(0, 80)
                              : item.id
                            }
                          </p>
                          <p className="text-gray-600 text-xs">{item.tema}</p>
                        </td>
                        <td className="py-2.5 pr-3 text-center text-gray-400 text-xs">{item.total}</td>
                        <td className="py-2.5 pr-3 text-center text-sena-green text-xs font-medium">{item.aciertos}</td>
                        <td className="py-2.5 pr-3 text-center text-red-400 text-xs font-medium">{item.errores}</td>
                        <td className="py-2.5 text-center">
                          <span className={`text-xs font-bold ${item.pctAcierto >= 60 ? 'text-sena-green' : item.pctAcierto >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {item.pctAcierto}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Vista: refuerzo académico */}
          {vistaActiva === 'refuerzo' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-xs">
                <strong>Criterios de refuerzo:</strong>
                {' '}&gt;60% errores → Necesita refuerzo |
                {' '}40-60% errores → Requiere práctica |
                {' '}&lt;40% errores → Buen dominio
              </div>

              {stats.temasStats.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Sin datos suficientes para generar recomendaciones.</p>
              ) : (
                stats.temasStats.map(t => {
                  // Preguntas más falladas de este tema
                  const pregsFalladas = stats.porItem
                    .filter(i => i.tema === t.tema && i.pctError > 40)
                    .sort((a, b) => b.pctError - a.pctError)
                    .map(i => i.itemData)
                    .filter(Boolean)

                  return (
                    <Recomendacion
                      key={t.tema}
                      tema={t.tema}
                      pctError={t.pctError}
                      pctAciertos={t.pctAcierto}
                      preguntasMasFalladas={pregsFalladas}
                    />
                  )
                })
              )}

              {/* Resumen general */}
              {stats.temasStats.length > 0 && (
                <div className="card border-gray-700 mt-2">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <BookOpen size={14} /> Resumen de temas críticos
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-400">
                    {stats.temasStats.filter(t => t.pctError >= UMBRAL_PRACTICA).map(t => (
                      <li key={t.tema} className="flex items-center gap-2">
                        <span className={nivelDominio(t.pctError).color}>●</span>
                        <span>{t.tema}</span>
                        <span className="text-gray-600">— {t.pctError}% errores</span>
                      </li>
                    ))}
                    {stats.temasStats.filter(t => t.pctError >= UMBRAL_PRACTICA).length === 0 && (
                      <li className="text-sena-green">✓ Todos los temas presentan buen dominio.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
