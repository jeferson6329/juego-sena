import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { leaderboardHelpers } from '../lib/supabase'
import { Trophy, Medal, Star, RefreshCw, Crown } from 'lucide-react'

// Datos de demo para cuando Supabase no está configurado
const DEMO_DATA = [
  { id: '1', full_name: 'Ana García',     points: 420, role: 'aprendiz',   avatar_url: null },
  { id: '2', full_name: 'Carlos Mendoza', points: 385, role: 'aprendiz',   avatar_url: null },
  { id: '3', full_name: 'Laura Torres',   points: 310, role: 'aprendiz',   avatar_url: null },
  { id: '4', full_name: 'Juan Rodríguez', points: 275, role: 'instructor', avatar_url: null },
  { id: '5', full_name: 'María López',    points: 250, role: 'aprendiz',   avatar_url: null },
  { id: '6', full_name: 'Diego Herrera',  points: 190, role: 'aprendiz',   avatar_url: null },
  { id: '7', full_name: 'Sofía Ramírez',  points: 155, role: 'aprendiz',   avatar_url: null },
  { id: '8', full_name: 'Andrés Vargas',  points: 120, role: 'aprendiz',   avatar_url: null },
  { id: '9', full_name: 'Valentina Cruz', points:  85, role: 'aprendiz',   avatar_url: null },
  { id: '10', full_name: 'Felipe Ríos',   points:  40, role: 'aprendiz',   avatar_url: null },
]

const POSITION_STYLES = {
  1: { bg: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-400', icon: <Crown size={16} className="text-yellow-400" /> },
  2: { bg: 'bg-gray-400/20 border-gray-400/40',     text: 'text-gray-300',   icon: <Medal size={16} className="text-gray-300" /> },
  3: { bg: 'bg-orange-500/20 border-orange-500/40', text: 'text-orange-400', icon: <Medal size={16} className="text-orange-400" /> },
}

function PodiumCard({ user: u, position }) {
  const heights = { 1: 'h-36', 2: 'h-28', 3: 'h-24' }
  const order   = { 1: 'order-2', 2: 'order-1', 3: 'order-3' }
  const colors  = {
    1: 'bg-yellow-500/20 border-yellow-500/40',
    2: 'bg-gray-500/20 border-gray-500/40',
    3: 'bg-orange-500/20 border-orange-500/40',
  }
  const textColors = { 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-orange-400' }
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className={`flex flex-col items-center ${order[position]} gap-2`}>
      <span className="text-2xl">{medals[position]}</span>
      <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-white font-bold text-lg uppercase">
        {u.full_name[0]}
      </div>
      <p className="text-white text-xs font-semibold text-center max-w-[80px] truncate">{u.full_name.split(' ')[0]}</p>
      <p className={`text-sm font-bold ${textColors[position]}`}>⭐ {u.points}</p>
      <div className={`w-20 rounded-t-xl border ${colors[position]} ${heights[position]} flex items-end justify-center pb-2`}>
        <span className={`text-2xl font-black ${textColors[position]}`}>{position}</span>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const { user, profile } = useAuth()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo]   = useState(false)

  const load = async () => {
    setLoading(true)
    const { data: rows, error } = await leaderboardHelpers.getTop(20)
    if (error || !rows || rows.length === 0) {
      setData(DEMO_DATA)
      setIsDemo(true)
    } else {
      setData(rows)
      setIsDemo(false)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const myRank = user ? data.findIndex(r => r.id === user.id) + 1 : 0
  const top3 = data.slice(0, 3)
  const rest = data.slice(3)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={24} className="text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Ranking</h1>
          </div>
          <p className="text-gray-400 text-sm">Tabla de posiciones. Gana puntos completando secciones y cuestionarios.</p>
        </div>
        <button onClick={load} disabled={loading}
          className="btn-ghost text-sm py-1.5 px-3 shrink-0">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {isDemo && (
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-xs">
          ℹ️ Mostrando datos de demostración. Configura Supabase para ver el ranking real.
        </div>
      )}

      {/* Mi posición */}
      {user && myRank > 0 && (
        <div className="card border-sena-green/30 bg-sena-green/5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-sena-green/20 flex items-center justify-center text-sena-green font-bold text-sm shrink-0">
            #{myRank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">Tu posición</p>
            <p className="text-gray-400 text-xs">{profile?.full_name || user.email}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-yellow-400 font-bold">⭐ {profile?.points ?? 0}</p>
            <p className="text-xs text-gray-500">puntos</p>
          </div>
        </div>
      )}

      {/* Podio top 3 */}
      {!loading && top3.length >= 3 && (
        <div className="card border-gray-700">
          <h2 className="text-center text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Podio — Top 3</h2>
          <div className="flex items-end justify-center gap-4">
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3
              return <PodiumCard key={u.id} user={u} position={pos} />
            })}
          </div>
        </div>
      )}

      {/* Tabla completa */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-sena-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card border-gray-800 p-0 overflow-hidden">
          <div className="px-4 py-3 bg-gray-800 grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-7">Aprendiz</span>
            <span className="col-span-4 text-right">Puntos</span>
          </div>

          <div className="divide-y divide-gray-800/50">
            {data.map((row, i) => {
              const pos = i + 1
              const style = POSITION_STYLES[pos]
              const isMe = user && row.id === user.id

              return (
                <div key={row.id}
                  className={`grid grid-cols-12 items-center px-4 py-3 transition-colors
                    ${isMe ? 'bg-sena-green/10' : 'hover:bg-gray-800/40'}
                    ${style ? `border-l-2 ${style.bg.includes('yellow') ? 'border-l-yellow-500' : style.bg.includes('gray-4') ? 'border-l-gray-400' : 'border-l-orange-500'}` : 'border-l-2 border-l-transparent'}`}
                >
                  {/* Posición */}
                  <div className="col-span-1 flex items-center">
                    {style
                      ? style.icon
                      : <span className="text-gray-500 text-sm font-mono">{pos}</span>
                    }
                  </div>

                  {/* Usuario */}
                  <div className="col-span-7 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold uppercase shrink-0
                      ${isMe ? 'bg-sena-green/30 text-sena-green border border-sena-green/40' : 'bg-gray-700 text-gray-300'}`}>
                      {row.full_name?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isMe ? 'text-sena-green' : 'text-white'}`}>
                        {row.full_name || 'Anónimo'}
                        {isMe && <span className="text-xs text-gray-500 ml-1">(tú)</span>}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{row.role || 'aprendiz'}</p>
                    </div>
                  </div>

                  {/* Puntos */}
                  <div className="col-span-4 text-right">
                    <span className={`font-bold text-sm ${style ? style.text : 'text-gray-300'}`}>
                      ⭐ {row.points ?? 0}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {data.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Trophy size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aún no hay datos en el ranking.</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 text-center">
        Los puntos se actualizan en tiempo real al completar secciones y cuestionarios.
      </p>
    </div>
  )
}
