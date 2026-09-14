import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { profileHelpers, adjustmentHelpers, gameHelpers } from '../../lib/supabase'
import {
  Users, Plus, Minus, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Lock, Trophy, BarChart2,
} from 'lucide-react'

// ─── Opciones de ajuste ───────────────────────────────────────────────────────
const OPCIONES_BONUS     = [5, 10, 20, 50]
const OPCIONES_DESCUENTO = [5, 10, 20]

// ─── Modal de ajuste ──────────────────────────────────────────────────────────

function ModalAjuste({ jugador, tipo, onConfirmar, onCancelar }) {
  const [cantidad, setCantidad] = useState(tipo === 'bonus' ? 10 : 5)
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState('')
  const [motivo, setMotivo] = useState('')
  const [usarPersonalizada, setUsarPersonalizada] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const opciones = tipo === 'bonus' ? OPCIONES_BONUS : OPCIONES_DESCUENTO
  const cantidadFinal = usarPersonalizada
    ? parseInt(cantidadPersonalizada) || 0
    : cantidad

  const handleConfirmar = async () => {
    if (!motivo.trim()) {
      setError('El motivo es obligatorio.')
      return
    }
    if (cantidadFinal <= 0) {
      setError('La cantidad debe ser mayor a 0.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onConfirmar(cantidadFinal, motivo.trim())
    } catch (e) {
      setError('Error al aplicar el ajuste.')
    } finally {
      setLoading(false)
    }
  }

  const esBono = tipo === 'bonus'

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-white mb-1">
          {esBono ? '➕ Aplicar bonus' : '➖ Aplicar descuento'}
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Jugador: <span className="text-white font-medium">{jugador.full_name}</span>
          {' · '}Puntos actuales: <span className="text-yellow-400 font-semibold">{jugador.points}</span>
        </p>

        {/* Selección de cantidad */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 block">
            Cantidad de puntos
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {opciones.map(op => (
              <button
                key={op}
                onClick={() => { setCantidad(op); setUsarPersonalizada(false) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                  !usarPersonalizada && cantidad === op
                    ? esBono
                      ? 'bg-sena-green/20 border-sena-green text-sena-green'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {esBono ? '+' : '-'}{op}
              </button>
            ))}
            <button
              onClick={() => setUsarPersonalizada(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                usarPersonalizada
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              Otro…
            </button>
          </div>
          {usarPersonalizada && (
            <input
              type="number"
              min="1"
              max="500"
              value={cantidadPersonalizada}
              onChange={e => setCantidadPersonalizada(e.target.value)}
              placeholder="Ej: 15"
              className="input text-sm"
            />
          )}
        </div>

        {/* Motivo */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 block">
            Motivo <span className="text-red-400">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Ej: Participación activa en clase, entrega adicional, etc."
            rows={2}
            className="input text-sm resize-none"
          />
        </div>

        {/* Resumen */}
        <div className={`p-3 rounded-lg border mb-4 text-sm ${
          esBono ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'
        }`}>
          <p className="text-gray-300">
            Puntos actuales: <span className="text-yellow-400 font-semibold">{jugador.points}</span>
            {' '}→ Resultado: <span className={`font-black text-lg ${esBono ? 'text-sena-green' : 'text-red-400'}`}>
              {esBono ? jugador.points + cantidadFinal : Math.max(0, jugador.points - cantidadFinal)}
            </span>
          </p>
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <div className="flex gap-2">
          <button onClick={onCancelar} className="btn-secondary flex-1 justify-center" disabled={loading}>
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading || !motivo.trim() || cantidadFinal <= 0}
            className={`flex-1 justify-center ${esBono ? 'btn-primary' : 'btn-secondary border-red-500/30 text-red-400 hover:bg-red-500/10'} disabled:opacity-50`}
          >
            {loading ? 'Aplicando…' : `Confirmar ${esBono ? 'bonus' : 'descuento'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fila de jugador ──────────────────────────────────────────────────────────

function FilaJugador({ jugador, onBonus, onDescuento }) {
  const [expandido, setExpandido] = useState(false)
  const [ajustes, setAjustes] = useState(null)
  const [sesion, setSesion] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const cargarDetalle = async () => {
    if (ajustes !== null) return // ya cargado
    setCargandoDetalle(true)
    const [resAjustes, resSesion] = await Promise.all([
      adjustmentHelpers.getAdjustments(jugador.id),
      gameHelpers.getSession(jugador.id),
    ])
    setAjustes(resAjustes.data || [])
    setSesion(resSesion.data || null)
    setCargandoDetalle(false)
  }

  const toggleExpand = () => {
    if (!expandido) cargarDetalle()
    setExpandido(v => !v)
  }

  const estado = sesion?.status
  const estadoBadge = estado === 'completado'
    ? <span className="badge badge-green text-xs">Completado</span>
    : estado === 'en_progreso'
      ? <span className="badge badge-yellow text-xs">En progreso</span>
      : <span className="badge text-xs bg-gray-700 text-gray-400">Sin iniciar</span>

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      {/* Fila principal */}
      <div className="flex items-center gap-3 p-3.5 hover:bg-gray-800/30 transition-colors">
        <div className="w-9 h-9 rounded-full bg-sena-green/20 border border-sena-green/30 flex items-center justify-center text-sena-green font-bold text-sm uppercase shrink-0">
          {jugador.full_name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-200 font-medium text-sm truncate">{jugador.full_name || 'Sin nombre'}</p>
          <p className="text-xs text-gray-500 truncate">{jugador.email || ''}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          {estadoBadge}
          <span className="text-yellow-400 font-semibold">⭐ {jugador.points} pts</span>
        </div>
        {/* Acciones */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onBonus(jugador)}
            className="p-1.5 rounded-lg bg-sena-green/10 border border-sena-green/20 hover:bg-sena-green/20 text-sena-green transition-colors"
            title="Aplicar bonus"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => onDescuento(jugador)}
            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Aplicar descuento"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={toggleExpand}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors"
            title="Ver detalle"
          >
            {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Detalle expandido */}
      {expandido && (
        <div className="border-t border-gray-800 p-4 bg-gray-900/50 space-y-4 text-sm">
          {cargandoDetalle ? (
            <p className="text-gray-500 text-xs text-center">Cargando…</p>
          ) : (
            <>
              {/* Stats de sesión */}
              {sesion && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Aciertos', val: sesion.aciertos ?? 0, color: 'text-sena-green' },
                    { label: 'Errores', val: sesion.errores ?? 0, color: 'text-red-400' },
                    { label: 'Pts juego', val: (sesion.pts_preguntas ?? 0) + (sesion.pts_retos ?? 0), color: 'text-yellow-400' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 bg-gray-800 rounded-lg">
                      <p className={`font-black text-lg ${s.color}`}>{s.val}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Historial de ajustes */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  Historial de bonus y descuentos
                </p>
                {ajustes && ajustes.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {ajustes.map(a => (
                      <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-xs">
                        {a.tipo === 'bonus'
                          ? <CheckCircle2 size={12} className="text-sena-green shrink-0" />
                          : <XCircle size={12} className="text-red-400 shrink-0" />
                        }
                        <span className={`font-bold w-10 ${a.tipo === 'bonus' ? 'text-sena-green' : 'text-red-400'}`}>
                          {a.tipo === 'bonus' ? `+${a.cantidad}` : `−${Math.abs(a.cantidad)}`}
                        </span>
                        <span className="flex-1 text-gray-400 truncate">{a.motivo}</span>
                        <span className="text-gray-600 shrink-0">
                          {new Date(a.created_at).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">Sin ajustes registrados.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function GestionJugadoresPage() {
  const { isOrganizador, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null) // { jugador, tipo }

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await profileHelpers.getAllPlayers()
      if (err) throw err
      setJugadores(data || [])
    } catch (e) {
      setError('Error al cargar jugadores.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isOrganizador) cargar()
  }, [authLoading, isOrganizador])

  const handleAjuste = async (cantidadInput, motivo) => {
    if (!modal || !user) return
    const { jugador, tipo } = modal
    const cantidadFinal = tipo === 'bonus' ? cantidadInput : -Math.abs(cantidadInput)

    const { error: err } = await adjustmentHelpers.applyAdjustment(
      jugador.id, cantidadFinal, tipo, motivo
    )
    if (err) throw new Error(err.message)

    setModal(null)
    cargar()
  }

  if (authLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>
  )

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">Esta sección solo está disponible para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver al inicio</button>
    </div>
  )

  const jugadoresFiltrados = jugadores.filter(j =>
    (j.full_name || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (j.email || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Users size={22} className="text-blue-400" /> Gestión de jugadores
          </h1>
          <p className="section-subtitle">Aplica bonus y descuentos — solo organizadores</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={cargar} className="btn-secondary text-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
          <button onClick={() => navigate('/organizador/ranking')} className="btn-ghost text-sm">
            <Trophy size={14} /> Ranking
          </button>
          <button onClick={() => navigate('/organizador/estadisticas')} className="btn-ghost text-sm">
            <BarChart2 size={14} /> Estadísticas
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total jugadores', val: jugadores.length, color: 'text-blue-400' },
          { label: 'Con puntos', val: jugadores.filter(j => j.points > 0).length, color: 'text-sena-green' },
          { label: 'Sin puntos', val: jugadores.filter(j => j.points === 0).length, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Buscar */}
      <input
        type="text"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o correo…"
        className="input text-sm"
      />

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando jugadores…</div>
      ) : jugadoresFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {busqueda ? 'No se encontraron jugadores.' : 'No hay jugadores registrados todavía.'}
        </div>
      ) : (
        <div className="space-y-2">
          {jugadoresFiltrados.map(j => (
            <FilaJugador
              key={j.id}
              jugador={j}
              onBonus={jug => setModal({ jugador: jug, tipo: 'bonus' })}
              onDescuento={jug => setModal({ jugador: jug, tipo: 'descuento' })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ModalAjuste
          jugador={modal.jugador}
          tipo={modal.tipo}
          onConfirmar={handleAjuste}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  )
}
