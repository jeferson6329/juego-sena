import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { obtenerResultados } from '../../lib/supabaseJuego'
import { PREGUNTAS, RETOS_PSEUDOCODIGO } from '../../data/gameData'
import {
  BarChart2, Users, CheckCircle2, XCircle, RefreshCw,
  AlertTriangle, TrendingDown, TrendingUp, BookOpen, Lock,
} from 'lucide-react'

const UMBRAL_REFUERZO = 60
const UMBRAL_PRACTICA = 40

function nivelDominio(pctError) {
  if (pctError >= UMBRAL_REFUERZO) return { label: 'Necesita refuerzo', color: 'text-red-400',    bg: 'bg-red-500' }
  if (pctError >= UMBRAL_PRACTICA) return { label: 'Requiere práctica',  color: 'text-yellow-400', bg: 'bg-yellow-500' }
  return                                  { label: 'Buen dominio',        color: 'text-sena-green', bg: 'bg-sena-green' }
}

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

function Recomendacion({ tema, pctError, preguntasMasFalladas }) {
  const nivel = nivelDominio(pctError)
  return (
    <div className={`p-4 rounded-xl border ${pctError >= UMBRAL_REFUERZO ? 'border-red-500/30 bg-red-500/5' : pctError >= UMBRAL_PRACTICA ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-sena-green/30 bg-sena-green/5'}`}>
      <div className="flex items-start gap-2 mb-2">
        {pctError >= UMBRAL_REFUERZO ? <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          : pctError >= UMBRAL_PRACTICA ? <TrendingDown size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          : <TrendingUp size={16} className="text-sena-green shrink-0 mt-0.5" />}
        <div>
          <p className={`font-semibold text-sm ${nivel.color}`}>{tema}</p>
          <p className={`text-xs ${nivel.color}`}>{nivel.label} — {pctError}% de errores</p>
        </div>
      </div>
      {pctError >= UMBRAL_PRACTICA && preguntasMasFalladas.length > 0 && (
        <p className="text-gray-400 text-xs leading-relaxed">
          Los participantes presentan dificultades en <strong className="text-gray-300">{tema}</strong>{' '}
          — preguntas con más errores: {preguntasMasFalladas.slice(0, 2).map(p =>
            `"${(p.enunciado || p.titulo || '').slice(0, 60)}…"`
          ).join(' y ')}.
        </p>
      )}
    </div>
  )
}

export default function EstadisticasPage() {
  const { isOrganizador, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]         = useState(null)
  const [vistaActiva, setVistaActiva] = useState('general')

  // Mapa id→item para enriquecer respuestas con tema
  const ITEM_MAP = useMemo(() => Object.fromEntries(
    [...PREGUNTAS, ...RETOS_PSEUDOCODIGO].map(i => [i.id, i])
  ), [])

  const cargar = async () => {
    const { data: jugadores } = await obtenerResultados()
    if (!jugadores || jugadores.length === 0) { setStats({ totalJugadores: 0 }); return }

    // Agregar respuestas por ítem y por tema
    const porItem = {}
    jugadores.forEach(j => {
      Object.entries(j.respuestas || {}).forEach(([itemId, resp]) => {
        const item = ITEM_MAP[itemId]
        if (!item) return
        if (!porItem[itemId]) porItem[itemId] = { total: 0, aciertos: 0, errores: 0, tema: item.tema, itemData: item }
        porItem[itemId].total++
        if (resp.isCorrect) porItem[itemId].aciertos++
        else porItem[itemId].errores++
      })
    })

    const itemsArr = Object.values(porItem).map(i => ({
      ...i,
      pctAcierto: i.total > 0 ? Math.round((i.aciertos / i.total) * 100) : 0,
      pctError:   i.total > 0 ? Math.round((i.errores  / i.total) * 100) : 0,
    })).sort((a, b) => b.pctError - a.pctError)

    const porTema = {}
    itemsArr.forEach(i => {
      const t = i.tema || 'Sin tema'
      if (!porTema[t]) porTema[t] = { total: 0, aciertos: 0, errores: 0 }
      porTema[t].total    += i.total
      porTema[t].aciertos += i.aciertos
      porTema[t].errores  += i.errores
    })
    const temasStats = Object.entries(porTema).map(([tema, st]) => ({
      tema, ...st,
      pctAcierto: st.total > 0 ? Math.round((st.aciertos / st.total) * 100) : 0,
      pctError:   st.total > 0 ? Math.round((st.errores  / st.total) * 100) : 0,
    })).sort((a, b) => b.pctError - a.pctError)

    const completados = jugadores.filter(j => j.estado === 'completado')

    setStats({
      totalJugadores:   jugadores.length,
      completados:      completados.length,
      pctFinalizacion:  jugadores.length > 0 ? Math.round((completados.length / jugadores.length) * 100) : 0,
      promedioAciertos: jugadores.length > 0 ? Math.round(jugadores.reduce((s, j) => s + (j.pct_aciertos || 0), 0) / jugadores.length) : 0,
      ptsPromedio:      jugadores.length > 0 ? Math.round(jugadores.reduce((s, j) => s + (j.puntaje_final || 0), 0) / jugadores.length) : 0,
      itemsStats:       itemsArr,
      temasStats,
      masFallado:       itemsArr[0] || null,
      masAcertado:      [...itemsArr].sort((a, b) => b.pctAcierto - a.pctAcierto)[0] || null,
    })
  }

  useEffect(() => { if (!authLoading && isOrganizador) cargar() }, [authLoading, isOrganizador])

  if (authLoading) return <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">Las estadísticas solo están disponibles para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver</button>
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <BarChart2 size={22} className="text-blue-400" /> Estadísticas generales
          </h1>
          <p className="section-subtitle">Resultados del juego educativo</p>
        </div>
        <button onClick={cargar} className="btn-secondary text-sm"><RefreshCw size={14} /> Actualizar</button>
      </div>

      {!stats || stats.totalJugadores === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Ningún jugador ha completado el juego todavía.</p>
          <p className="text-gray-600 text-xs mt-2">Las estadísticas aparecerán aquí cuando los jugadores terminen.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Users size={16} />,       label: 'Total jugadores',  val: stats.totalJugadores,              color: 'text-blue-400' },
              { icon: <CheckCircle2 size={16} />, label: 'Completaron',      val: `${stats.completados} (${stats.pctFinalizacion}%)`, color: 'text-sena-green' },
              { icon: <TrendingUp size={16} />,   label: 'Promedio aciertos',val: `${stats.promedioAciertos}%`,     color: 'text-yellow-400' },
              { icon: <BarChart2 size={16} />,    label: 'Promedio puntos',  val: stats.ptsPromedio,                color: 'text-purple-400' },
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
                  <p className="text-xs text-red-400">{stats.masFallado.pctError}% errores ({stats.masFallado.errores}/{stats.masFallado.total})</p>
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
                  <p className="text-xs text-sena-green">{stats.masAcertado.pctAcierto}% aciertos ({stats.masAcertado.aciertos}/{stats.masAcertado.total})</p>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-800">
            {[{ key: 'general', label: 'Por tema' }, { key: 'preguntas', label: 'Por pregunta' }, { key: 'refuerzo', label: 'Refuerzo académico' }].map(t => (
              <button key={t.key} onClick={() => setVistaActiva(t.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${vistaActiva === t.key ? 'border-b-2 border-sena-green text-sena-green' : 'border-b-2 border-transparent text-gray-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Por tema */}
          {vistaActiva === 'general' && (
            <div className="card space-y-4">
              {stats.temasStats.length === 0
                ? <p className="text-gray-500 text-sm text-center py-4">Sin datos todavía.</p>
                : stats.temasStats.map(t => {
                  const nivel = nivelDominio(t.pctError)
                  return (
                    <div key={t.tema}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300 font-medium">{t.tema}</span>
                        <span className={`text-xs font-semibold ${nivel.color}`}>{nivel.label} — {t.aciertos}/{t.total}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><p className="text-xs text-gray-600 mb-1">Aciertos {t.pctAcierto}%</p><MiniBar pct={t.pctAcierto} color="bg-sena-green" /></div>
                        <div><p className="text-xs text-gray-600 mb-1">Errores {t.pctError}%</p><MiniBar pct={t.pctError} color="bg-red-500" /></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}

          {/* Por pregunta */}
          {vistaActiva === 'preguntas' && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    {['Pregunta / Reto', 'Resp.', '✓', '✗', '% Acierto'].map(h => (
                      <th key={h} className="pb-2 pr-3 text-xs text-gray-500 font-semibold uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.itemsStats.length === 0
                    ? <tr><td colSpan={5} className="py-6 text-center text-gray-500">Sin datos todavía.</td></tr>
                    : stats.itemsStats.map(item => (
                      <tr key={item.id} className="border-b border-gray-800/40 hover:bg-gray-800/20">
                        <td className="py-2.5 pr-3 max-w-xs">
                          <p className="text-gray-300 text-xs truncate">{item.itemData ? (item.itemData.enunciado || item.itemData.titulo || item.id).slice(0, 80) : item.id}</p>
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
                  }
                </tbody>
              </table>
            </div>
          )}

          {/* Refuerzo */}
          {vistaActiva === 'refuerzo' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-xs">
                <strong>Criterios:</strong> &gt;60% errores → Necesita refuerzo · 40-60% → Requiere práctica · &lt;40% → Buen dominio
              </div>
              {stats.temasStats.length === 0
                ? <p className="text-gray-500 text-sm text-center py-8">Sin datos suficientes.</p>
                : stats.temasStats.map(t => {
                  const falladas = stats.itemsStats.filter(i => i.tema === t.tema && i.pctError > 40).map(i => i.itemData).filter(Boolean)
                  return <Recomendacion key={t.tema} tema={t.tema} pctError={t.pctError} preguntasMasFalladas={falladas} />
                })
              }
              <div className="card border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"><BookOpen size={14} /> Temas críticos</h3>
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
            </div>
          )}
        </>
      )}
    </div>
  )
}
