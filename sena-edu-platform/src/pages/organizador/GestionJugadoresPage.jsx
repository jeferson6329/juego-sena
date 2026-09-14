import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cargarJugadores, aplicarAjuste } from '../../lib/localStats'
import {
  Users, Plus, Minus, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Lock, Trophy, BarChart2,
} from 'lucide-react'

const OPCIONES_BONUS     = [5, 10, 20, 50]
const OPCIONES_DESCUENTO = [5, 10, 20]

// ─── Modal de ajuste ──────────────────────────────────────────────────────────
function ModalAjuste({ jugador, tipo, onConfirmar, onCancelar }) {
  const [cantidad, setCantidad]           = useState(tipo === 'bonus' ? 10 : 5)
  const [cantPersonalizada, setCantPerso] = useState('')
  const [usarPerso, setUsarPerso]         = useState(false)
  const [motivo, setMotivo]               = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)

  const opciones      = tipo === 'bonus' ? OPCIONES_BONUS : OPCIONES_DESCUENTO
  const cantFinal     = usarPerso ? (parseInt(cantPersonalizada) || 0) : cantidad
  const esBono        = tipo === 'bonus'
  const ptsActuales   = jugador.puntaje_final ?? jugador.pts_juego ?? 0
  const ptsResultado  = esBono ? ptsActuales + cantFinal : Math.max(0, ptsActuales - cantFinal)

  const handleConfirmar = async () => {
    if (!motivo.trim()) { setError('El motivo es obligatorio.'); return }
    if (cantFinal <= 0) { setError('La cantidad debe ser mayor a 0.'); return }
    setLoading(true); setError(null)
    await onConfirmar(cantFinal, motivo.trim())
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-white mb-1">{esBono ? '➕ Aplicar bonus' : '➖ Aplicar descuento'}</h2>
        <p className="text-gray-400 text-sm mb-5">
          Jugador: <span className="text-white font-medium">{jugador.nombre}</span>
          {' · '}Puntos actuales: <span className="text-yellow-400 font-semibold">{ptsActuales}</span>
        </p>

        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 block">Cantidad</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {opciones.map(op => (
              <button key={op} onClick={() => { setCantidad(op); setUsarPerso(false) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${!usarPerso && cantidad === op ? (esBono ? 'bg-sena-green/20 border-sena-green text-sena-green' : 'bg-red-500/20 border-red-500 text-red-400') : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                {esBono ? '+' : '-'}{op}
              </button>
            ))}
            <button onClick={() => setUsarPerso(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${usarPerso ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
              Otro…
            </button>
          </div>
          {usarPerso && (
            <input type="number" min="1" max="500" value={cantPersonalizada}
              onChange={e => setCantPerso(e.target.value)} placeholder="Ej: 15" className="input text-sm" />
          )}
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 block">Motivo <span className="text-red-400">*</span></label>
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
            placeholder="Ej: Participación activa, entrega adicional…" rows={2} className="input text-sm resize-none" />
        </div>

        <div className={`p-3 rounded-lg border mb-4 text-sm ${esBono ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <p className="text-gray-300">
            Puntos actuales: <span className="text-yellow-400 font-semibold">{ptsActuales}</span>
            {' '}→ Resultado: <span className={`font-black text-lg ${esBono ? 'text-sena-green' : 'text-red-400'}`}>{ptsResultado}</span>
          </p>
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <div className="flex gap-2">
          <button onClick={onCancelar} className="btn-secondary flex-1 justify-center" disabled={loading}>Cancelar</button>
          <button onClick={handleConfirmar} disabled={loading || !motivo.trim() || cantFinal <= 0}
            className={`flex-1 justify-center ${esBono ? 'btn-primary' : 'btn-secondary border-red-500/30 text-red-400 hover:bg-red-500/10'} disabled:opacity-50`}>
            {loading ? 'Aplicando…' : `Confirmar ${esBono ? 'bonus' : 'descuento'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fila jugador ─────────────────────────────────────────────────────────────
function FilaJugador({ jugador, onBonus, onDescuento }) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-3.5 hover:bg-gray-800/30 transition-colors">
        <div className="w-9 h-9 rounded-full bg-sena-green/20 border border-sena-green/30 flex items-center justify-center text-sena-green font-bold text-sm uppercase shrink-0">
          {jugador.nombre?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-200 font-medium text-sm truncate">{jugador.nombre}</p>
          <p className="text-xs text-gray-500">
            {jugador.aciertos ?? 0} aciertos · {jugador.errores ?? 0} errores
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="text-yellow-400 font-semibold">⭐ {jugador.puntaje_final ?? 0} pts</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onBonus(jugador)} title="Aplicar bonus"
            className="p-1.5 rounded-lg bg-sena-green/10 border border-sena-green/20 hover:bg-sena-green/20 text-sena-green transition-colors">
            <Plus size={14} />
          </button>
          <button onClick={() => onDescuento(jugador)} title="Aplicar descuento"
            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={() => setExpandido(v => !v)} title="Ver detalle"
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors">
            {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-gray-800 p-4 bg-gray-900/50 space-y-4 text-sm">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Aciertos', val: jugador.aciertos ?? 0, color: 'text-sena-green' },
              { label: 'Errores',  val: jugador.errores  ?? 0, color: 'text-red-400' },
              { label: 'Pts base', val: jugador.pts_juego ?? 0, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 bg-gray-800 rounded-lg">
                <p className={`font-black text-lg ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Historial de ajustes */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Historial de ajustes</p>
            {jugador.ajustes && jugador.ajustes.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {jugador.ajustes.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-xs">
                    {a.tipo === 'bonus'
                      ? <CheckCircle2 size={12} className="text-sena-green shrink-0" />
                      : <XCircle     size={12} className="text-red-400 shrink-0" />
                    }
                    <span className={`font-bold w-10 ${a.tipo === 'bonus' ? 'text-sena-green' : 'text-red-400'}`}>
                      {a.tipo === 'bonus' ? `+${a.cantidad}` : `−${Math.abs(a.cantidad)}`}
                    </span>
                    <span className="flex-1 text-gray-400 truncate">{a.motivo}</span>
                    <span className="text-gray-600 shrink-0">{new Date(a.fecha).toLocaleDateString('es-CO')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Sin ajustes registrados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function GestionJugadoresPage() {
  const { isOrganizador, nombre: orgNombre, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [jugadores, setJugadores] = useState([])
  const [busqueda, setBusqueda]   = useState('')
  const [modal, setModal]         = useState(null)

  const cargar = () => setJugadores(cargarJugadores())

  useEffect(() => { if (!authLoading && isOrganizador) cargar() }, [authLoading, isOrganizador])

  const handleAjuste = (cantFinal, motivo) => {
    if (!modal) return
    const { jugador, tipo } = modal
    aplicarAjuste(jugador.nombre, cantFinal, tipo, motivo, orgNombre)
    setModal(null)
    cargar()
  }

  if (authLoading) return <div className="flex items-center justify-center py-20 text-gray-500">Cargando…</div>

  if (!isOrganizador) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <Lock size={40} className="text-gray-600 mx-auto" />
      <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
      <p className="text-gray-400 text-sm">Esta sección solo está disponible para organizadores.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Volver</button>
    </div>
  )

  const filtrados = jugadores.filter(j =>
    (j.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Users size={22} className="text-blue-400" /> Gestión de jugadores
          </h1>
          <p className="section-subtitle">Aplica bonus y descuentos</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={cargar} className="btn-secondary text-sm"><RefreshCw size={14} /> Actualizar</button>
          <button onClick={() => navigate('/organizador/ranking')} className="btn-ghost text-sm"><Trophy size={14} /> Ranking</button>
          <button onClick={() => navigate('/organizador/estadisticas')} className="btn-ghost text-sm"><BarChart2 size={14} /> Estadísticas</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total jugadores', val: jugadores.length, color: 'text-blue-400' },
          { label: 'Con puntos', val: jugadores.filter(j => (j.puntaje_final || 0) > 0).length, color: 'text-sena-green' },
          { label: 'Completaron', val: jugadores.filter(j => j.estado === 'completado').length, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre…" className="input text-sm" />

      {filtrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {busqueda ? 'No se encontraron jugadores.' : 'Ningún jugador ha completado el juego todavía.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map(j => (
            <FilaJugador key={j.nombre} jugador={j}
              onBonus={jug => setModal({ jugador: jug, tipo: 'bonus' })}
              onDescuento={jug => setModal({ jugador: jug, tipo: 'descuento' })} />
          ))}
        </div>
      )}

      {modal && (
        <ModalAjuste jugador={modal.jugador} tipo={modal.tipo}
          onConfirmar={handleAjuste} onCancelar={() => setModal(null)} />
      )}
    </div>
  )
}
