import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { statsHelpers, profileHelpers } from '../../lib/supabase'
import {
  Trophy, Crown, Medal, RefreshCw, BarChart2, Users,
  CheckCircle2, Star, Lock,
} from 'lucide-react'

// ─── Helpers visuales ────────────────────────────────────────────────────────

function PosicionIcon({ pos }) {
  if (pos === 1) return <Crown size={16} className="text-yellow-400" />
  if (pos === 2) return <Medal size={16} className="text-gray-300" />
  if (pos === 3) return <Medal size={16} className="text-amber-600" />
  return <span className="text-gray-500 text-sm font-bold w-4 text-center">{pos}</span>
}

function EstadoBadge({ estado }) {
  if (estado === 'completado') return (
    <span className="badge badge-green text-xs">Completado</span>
  )
  if (estado === 'en_progreso') return (
    <span className="badge badge-yellow text-xs">En progreso</span>
  )
  return <span className="badge text-xs bg-gray-700 text-gray-400">Sin iniciar</span>
}

// ─── Podio ────────────────────────────────────────────────────────────────────

function Podio({ top3 }) {
  const orden = [1, 0, 2] // plata, oro, bronce
  const alturas = ['h-20', 'h-28', 'h-16']
  const colores = ['bg-gray-500/20 border-gray-400/30', 'bg-yellow-500/20 border-yellow-400/40', 'bg-amber-700/20 border-amber-600/30']
  const textColores = ['text-gray-300', 'text-yellow-400', 'text-amber-500']
  const posLabels = ['🥈 2.°', '🥇 1.°', '🥉 3.°']

  return (
    <div className="flex items-end justify-center gap-3 mb-6">
      {orden.map((dataIdx, visualIdx) => {
        const jugador = top3[dataIdx]
        if (!jugador) return <div key={visualIdx} className="w-24" />
        return (
          <div key={visualIdx} className="flex flex-col items-center gap-1.5 w-28">
            <div className="w-10 h-10 rounded-full bg-sena-green/20 border border-sena-green/40 flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
              {jugador.full_name?.[0] || '?'}
            </div>
            <p className="text-xs text-gray-300 text-center font-medium truncate w-full text-center">
              {jugador.full_name || 'Sin nombre'}
            </p>
            <p className={`text-sm font-black ${textColores[visualIdx]}`}>
              {jugador.puntaje_final ?? jugador.puntos_perfil ?? 0} pts
            </p>
            <div className={`${alturas[visualIdx]} w-full rounded-t-lg border ${colores[visualIdx]} flex items-center justify-center`}>
              <span className="text-lg">{posLabels[visualIdx]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function RankingPage() {
  const { isOrganizador, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos') // todos | completados | en_progreso

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await statsHelpers.getRanking()
      if (err) {
        // Fallback: usar perfiles directos
        const { data: perfiles } = await profileHelpers.getAllPlayers()
        if (perfiles) {
          setRanking(perfiles.map((p, i) => ({
            id: p.id,
            full_name: p.full_name,
            puntos_perfil: p.points,
            puntaje_final: p.points,
            aciertos: 0,
            errores: 0,
            bonus: 0,
            descuento: 0,
            estado_juego: null,
            porcentaje_aciertos: 0,
          })))
        }
      } else {
        setRanking(data || [])
      }
    } catch (e) {
      setError('Error al cargar el ranking.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isOrganizador) cargar()
  }, [authLoading, isOrganizador])

  if (authLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>
  )

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">El ranking completo solo está disponible para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver al inicio</button>
    </div>
  )

  const rankingFiltrado = ranking.filter(j => {
    if (filtro === 'completados') return j.estado_juego === 'completado'
    if (filtro === 'en_progreso') return j.estado_juego === 'en_progreso'
    return true
  })

  const top3 = [...ranking].sort((a, b) => (b.puntaje_final ?? 0) - (a.puntaje_final ?? 0)).slice(0, 3)

  const totales = {
    jugadores: ranking.length,
    completados: ranking.filter(j => j.estado_juego === 'completado').length,
    promedioPts: ranking.length
      ? Math.round(ranking.reduce((s, j) => s + (j.puntaje_final ?? 0), 0) / ranking.length)
      : 0,
    promedioAciertos: ranking.length
      ? Math.round(ranking.reduce((s, j) => s + (j.porcentaje_aciertos ?? 0), 0) / ranking.length)
      : 0,
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Trophy size={22} className="text-yellow-400" /> Ranking de jugadores
          </h1>
          <p className="section-subtitle">Panel exclusivo para organizadores</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargar} className="btn-secondary text-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
          <button onClick={() => navigate('/organizador/estadisticas')} className="btn-ghost text-sm">
            <BarChart2 size={14} /> Estadísticas
          </button>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={16} />, label: 'Total jugadores', val: totales.jugadores, color: 'text-blue-400' },
          { icon: <CheckCircle2 size={16} />, label: 'Completaron', val: totales.completados, color: 'text-sena-green' },
          { icon: <Star size={16} />, label: 'Promedio pts', val: totales.promedioPts, color: 'text-yellow-400' },
          { icon: <BarChart2 size={16} />, label: 'Promedio aciertos', val: `${totales.promedioAciertos}%`, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando ranking…</div>
      ) : (
        <>
          {/* Podio top 3 */}
          {top3.length >= 2 && (
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">
                Podio
              </h2>
              <Podio top3={top3} />
            </div>
          )}

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {[
              { val: 'todos', label: 'Todos' },
              { val: 'completados', label: 'Completados' },
              { val: 'en_progreso', label: 'En progreso' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setFiltro(f.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filtro === f.val
                    ? 'bg-sena-green/20 border-sena-green text-sena-green'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabla ranking */}
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">#</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Jugador</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Aciertos</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Errores</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Pts base</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Bonus</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Descuento</th>
                  <th className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">Final</th>
                  <th className="pb-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-center">% Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {rankingFiltrado.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No hay jugadores con este filtro.
                    </td>
                  </tr>
                ) : (
                  rankingFiltrado.map((j, i) => {
                    const ptsBase = (j.pts_preguntas ?? 0) + (j.pts_retos ?? 0)
                    const pctAciertos = j.porcentaje_aciertos ?? 0
                    return (
                      <tr key={j.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 pr-3">
                          <PosicionIcon pos={i + 1} />
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-sena-green/20 border border-sena-green/30 flex items-center justify-center text-sena-green font-bold text-xs uppercase shrink-0">
                              {j.full_name?.[0] || '?'}
                            </div>
                            <div>
                              <p className="text-gray-200 font-medium">{j.full_name || 'Sin nombre'}</p>
                              <EstadoBadge estado={j.estado_juego} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-center text-sena-green font-medium">{j.aciertos ?? 0}</td>
                        <td className="py-3 pr-3 text-center text-red-400 font-medium">{j.errores ?? 0}</td>
                        <td className="py-3 pr-3 text-center text-gray-300">{ptsBase}</td>
                        <td className="py-3 pr-3 text-center text-sena-green">
                          {(j.bonus ?? 0) > 0 ? `+${j.bonus}` : '—'}
                        </td>
                        <td className="py-3 pr-3 text-center text-red-400">
                          {(j.descuento ?? 0) < 0 ? j.descuento : '—'}
                        </td>
                        <td className="py-3 pr-3 text-center font-black text-yellow-400">
                          {j.puntaje_final ?? j.puntos_perfil ?? 0}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`font-semibold ${pctAciertos >= 60 ? 'text-sena-green' : pctAciertos >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {pctAciertos}%
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
