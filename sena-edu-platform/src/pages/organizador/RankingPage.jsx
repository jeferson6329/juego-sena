import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRanking } from '../../lib/localStats'
import {
  Trophy, Crown, Medal, RefreshCw, BarChart2,
  Users, CheckCircle2, Star, Lock,
} from 'lucide-react'

function PosicionIcon({ pos }) {
  if (pos === 1) return <Crown size={16} className="text-yellow-400" />
  if (pos === 2) return <Medal size={16} className="text-gray-300" />
  if (pos === 3) return <Medal size={16} className="text-amber-600" />
  return <span className="text-gray-500 text-sm font-bold w-4 text-center">{pos}</span>
}

function Podio({ top3 }) {
  const orden    = [1, 0, 2]
  const alturas  = ['h-20', 'h-28', 'h-16']
  const colores  = ['bg-gray-500/20 border-gray-400/30', 'bg-yellow-500/20 border-yellow-400/40', 'bg-amber-700/20 border-amber-600/30']
  const textos   = ['text-gray-300', 'text-yellow-400', 'text-amber-500']
  const labels   = ['🥈 2.°', '🥇 1.°', '🥉 3.°']

  return (
    <div className="flex items-end justify-center gap-3 mb-6">
      {orden.map((dataIdx, vi) => {
        const j = top3[dataIdx]
        if (!j) return <div key={vi} className="w-28" />
        return (
          <div key={vi} className="flex flex-col items-center gap-1.5 w-28">
            <div className="w-10 h-10 rounded-full bg-sena-green/20 border border-sena-green/40 flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
              {j.nombre?.[0] || '?'}
            </div>
            <p className="text-xs text-gray-300 text-center font-medium truncate w-full">{j.nombre}</p>
            <p className={`text-sm font-black ${textos[vi]}`}>{j.puntaje_final ?? 0} pts</p>
            <div className={`${alturas[vi]} w-full rounded-t-lg border ${colores[vi]} flex items-center justify-center`}>
              <span className="text-lg">{labels[vi]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function RankingPage() {
  const { isOrganizador, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [ranking, setRanking]   = useState([])
  const [filtro, setFiltro]     = useState('todos')

  const cargar = () => setRanking(getRanking())

  useEffect(() => { if (!authLoading && isOrganizador) cargar() }, [authLoading, isOrganizador])

  if (authLoading) return <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">El ranking solo está disponible para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver</button>
    </div>
  )

  const rankingFiltrado = filtro === 'todos' ? ranking
    : ranking.filter(j => j.estado === filtro)

  const top3 = ranking.slice(0, 3)

  const totales = {
    jugadores:       ranking.length,
    completados:     ranking.filter(j => j.estado === 'completado').length,
    promedioPts:     ranking.length ? Math.round(ranking.reduce((s, j) => s + (j.puntaje_final || 0), 0) / ranking.length) : 0,
    promedioAciertos:ranking.length ? Math.round(ranking.reduce((s, j) => s + (j.pct_aciertos  || 0), 0) / ranking.length) : 0,
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Trophy size={22} className="text-yellow-400" /> Ranking de jugadores
          </h1>
          <p className="section-subtitle">Panel exclusivo para organizadores</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargar} className="btn-secondary text-sm"><RefreshCw size={14} /> Actualizar</button>
          <button onClick={() => navigate('/organizador/estadisticas')} className="btn-ghost text-sm"><BarChart2 size={14} /> Estadísticas</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={16} />,       label: 'Total jugadores',  val: totales.jugadores,        color: 'text-blue-400' },
          { icon: <CheckCircle2 size={16} />, label: 'Completaron',      val: totales.completados,      color: 'text-sena-green' },
          { icon: <Star size={16} />,         label: 'Promedio pts',     val: totales.promedioPts,      color: 'text-yellow-400' },
          { icon: <BarChart2 size={16} />,    label: 'Promedio aciertos',val: `${totales.promedioAciertos}%`, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Podio */}
      {top3.length >= 2 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">Podio</h2>
          <Podio top3={top3} />
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[{ val: 'todos', label: 'Todos' }, { val: 'completado', label: 'Completados' }].map(f => (
          <button key={f.val} onClick={() => setFiltro(f.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filtro === f.val ? 'bg-sena-green/20 border-sena-green text-sena-green' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card overflow-x-auto">
        {rankingFiltrado.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {ranking.length === 0
              ? 'Ningún jugador ha completado el juego todavía.'
              : 'No hay jugadores con este filtro.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                {['#', 'Jugador', 'Aciertos', 'Errores', 'Pts base', 'Bonus', 'Descuento', 'Final', '% Aciertos'].map(h => (
                  <th key={h} className="pb-3 pr-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankingFiltrado.map((j, i) => (
                <tr key={j.nombre} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 pr-3"><PosicionIcon pos={i + 1} /></td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sena-green/20 border border-sena-green/30 flex items-center justify-center text-sena-green font-bold text-xs uppercase shrink-0">
                        {j.nombre?.[0] || '?'}
                      </div>
                      <p className="text-gray-200 font-medium">{j.nombre}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-center text-sena-green font-medium">{j.aciertos ?? 0}</td>
                  <td className="py-3 pr-3 text-center text-red-400 font-medium">{j.errores ?? 0}</td>
                  <td className="py-3 pr-3 text-center text-gray-300">{j.pts_juego ?? 0}</td>
                  <td className="py-3 pr-3 text-center text-sena-green">{(j.pts_bonus ?? 0) > 0 ? `+${j.pts_bonus}` : '—'}</td>
                  <td className="py-3 pr-3 text-center text-red-400">{(j.pts_descuento ?? 0) < 0 ? j.pts_descuento : '—'}</td>
                  <td className="py-3 pr-3 text-center font-black text-yellow-400">{j.puntaje_final ?? 0}</td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold text-xs ${(j.pct_aciertos ?? 0) >= 60 ? 'text-sena-green' : (j.pct_aciertos ?? 0) >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {j.pct_aciertos ?? 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
