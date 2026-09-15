// Panel del organizador en tiempo real — /vivo
// Muestra jugadores activos, progreso en vivo, bonus/descuentos

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  obtenerJugadoresVivos, suscribirJugadores, desuscribir,
  aplicarAjusteVivo, cerrarSesion,
} from '../lib/supabaseVivo'
import {
  Radio, RefreshCw, Users, Trophy, CheckCircle2, XCircle,
  Plus, Minus, ChevronDown, ChevronUp, X, Copy, QrCode,
  Home, Star,
} from 'lucide-react'

const KEY_SESION = 'sena_admin_sesion'
const OPCIONES_BONUS     = [5, 10, 20, 50]
const OPCIONES_DESCUENTO = [5, 10, 20]

// ─── Barra de progreso inline ─────────────────────────────────────────────────
function MiniProgress({ actual, total, estado }) {
  const pct   = total > 0 ? Math.round((actual / total) * 100) : 0
  const color = estado === 'terminado' ? 'bg-sena-green' : 'bg-yellow-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-800">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-500 shrink-0 w-12 text-right">{actual}/{total}</span>
    </div>
  )
}

// ─── Modal de ajuste ──────────────────────────────────────────────────────────
function ModalAjuste({ jugador, tipo, codigoSesion, onDone, onCancelar }) {
  const [cantidad,  setCantidad]  = useState(tipo === 'bonus' ? 10 : 5)
  const [perso,     setPerso]     = useState('')
  const [usarPerso, setUsarPerso] = useState(false)
  const [motivo,    setMotivo]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  const opciones  = tipo === 'bonus' ? OPCIONES_BONUS : OPCIONES_DESCUENTO
  const cantFinal = usarPerso ? (parseInt(perso) || 0) : cantidad
  const esBono    = tipo === 'bonus'
  const ptsBefore = jugador.puntaje_final || 0
  const ptsAfter  = esBono ? ptsBefore + cantFinal : Math.max(0, ptsBefore - cantFinal)

  const handleOk = async () => {
    if (!motivo.trim()) { setError('El motivo es obligatorio.'); return }
    if (cantFinal <= 0) { setError('Cantidad debe ser > 0.'); return }
    setLoading(true)
    const { error: err } = await aplicarAjusteVivo(codigoSesion, jugador.nombre, cantFinal, tipo, motivo)
    setLoading(false)
    if (err) { setError('Error al guardar.'); return }
    onDone()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold text-white mb-1">{esBono ? '➕ Bonus' : '➖ Descuento'}</h2>
        <p className="text-gray-400 text-sm mb-4">
          {jugador.nombre} · Puntos: <span className="text-yellow-400 font-bold">{ptsBefore}</span>
        </p>

        <div className="mb-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {opciones.map(op => (
              <button key={op} onClick={() => { setCantidad(op); setUsarPerso(false) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${!usarPerso && cantidad === op ? (esBono ? 'bg-sena-green/20 border-sena-green text-sena-green' : 'bg-red-500/20 border-red-500 text-red-400') : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {esBono ? '+' : '-'}{op}
              </button>
            ))}
            <button onClick={() => setUsarPerso(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${usarPerso ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
              Otro
            </button>
          </div>
          {usarPerso && (
            <input type="number" min="1" max="500" value={perso}
              onChange={e => setPerso(e.target.value)} placeholder="Cantidad" className="input text-sm" />
          )}
        </div>

        <div className="mb-4">
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
            placeholder="Motivo obligatorio…" rows={2} className="input text-sm resize-none" />
        </div>

        <div className={`p-2.5 rounded-lg border mb-4 text-sm ${esBono ? 'border-sena-green/20 bg-sena-green/5' : 'border-red-500/20 bg-red-500/5'}`}>
          {ptsBefore} → <span className={`font-black ${esBono ? 'text-sena-green' : 'text-red-400'}`}>{ptsAfter}</span> pts
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <div className="flex gap-2">
          <button onClick={onCancelar} className="btn-secondary flex-1 justify-center" disabled={loading}>Cancelar</button>
          <button onClick={handleOk} disabled={loading || !motivo.trim() || cantFinal <= 0}
            className={`flex-1 justify-center ${esBono ? 'btn-primary' : 'btn-secondary border-red-500/30 text-red-400 hover:bg-red-500/10'} disabled:opacity-50`}>
            {loading ? '…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tarjeta de jugador ───────────────────────────────────────────────────────
function TarjetaJugador({ j, codigoSesion, onAjuste }) {
  const [exp, setExp] = useState(false)
  const ajustes = Array.isArray(j.ajustes) ? j.ajustes : []
  const pct     = j.pct_aciertos || 0

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${j.estado === 'terminado' ? 'border-sena-green/30' : 'border-gray-700'}`}>
      <div className="flex items-center gap-3 p-3">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0 ${j.estado === 'terminado' ? 'bg-sena-green/20 border border-sena-green/40 text-sena-green' : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400'}`}>
          {j.nombre?.[0] || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white font-medium text-sm truncate">{j.nombre}</p>
            {j.estado === 'terminado'
              ? <span className="badge badge-green text-[10px]">Terminó</span>
              : <span className="flex items-center gap-0.5 text-[10px] text-yellow-400"><Radio size={9} className="animate-pulse" /> Jugando</span>
            }
          </div>
          <MiniProgress actual={j.pregunta_actual || 0} total={j.total_preguntas || 0} estado={j.estado} />
        </div>

        {/* Stats compact */}
        <div className="hidden sm:flex items-center gap-3 text-xs shrink-0">
          <span className="text-sena-green font-medium">{j.aciertos || 0}✓</span>
          <span className="text-red-400 font-medium">{j.errores || 0}✗</span>
          <span className="text-yellow-400 font-bold">⭐{j.puntaje_final || 0}</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => onAjuste(j, 'bonus')} className="p-1.5 rounded-lg bg-sena-green/10 border border-sena-green/20 hover:bg-sena-green/20 text-sena-green" title="Bonus"><Plus size={13} /></button>
          <button onClick={() => onAjuste(j, 'descuento')} className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400" title="Descuento"><Minus size={13} /></button>
          <button onClick={() => setExp(v => !v)} className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400">
            {exp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {exp && (
        <div className="border-t border-gray-800 p-3 bg-gray-900/50 space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: '✓ Aciertos',  val: j.aciertos || 0,    color: 'text-sena-green' },
              { label: '✗ Errores',   val: j.errores  || 0,    color: 'text-red-400' },
              { label: '% Aciertos',  val: `${pct}%`,          color: pct >= 60 ? 'text-sena-green' : pct >= 40 ? 'text-yellow-400' : 'text-red-400' },
              { label: '⭐ Final',    val: j.puntaje_final||0, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-800 rounded-lg p-2">
                <p className={`font-black text-base ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {ajustes.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] text-gray-600 uppercase font-semibold">Ajustes</p>
              {ajustes.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-1.5 bg-gray-800 rounded">
                  {a.tipo === 'bonus'
                    ? <CheckCircle2 size={11} className="text-sena-green shrink-0" />
                    : <XCircle     size={11} className="text-red-400 shrink-0" />}
                  <span className={`font-bold w-8 ${a.tipo === 'bonus' ? 'text-sena-green' : 'text-red-400'}`}>
                    {a.tipo === 'bonus' ? `+${a.cantidad}` : `${a.cantidad}`}
                  </span>
                  <span className="flex-1 text-gray-400 truncate">{a.motivo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function VivoPage() {
  const navigate      = useNavigate()
  const codigoSesion  = localStorage.getItem(KEY_SESION)
  const [jugadores,  setJugadores]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(null)  // { jugador, tipo }
  const [copiado,    setCopiado]    = useState(false)
  const channelRef   = useRef(null)

  const enlace = codigoSesion
    ? `${window.location.origin}/juego?codigo=${codigoSesion}`
    : ''

  const cargar = useCallback(async () => {
    if (!codigoSesion) return
    const { data } = await obtenerJugadoresVivos(codigoSesion)
    setJugadores(data)
    setLoading(false)
  }, [codigoSesion])

  // Suscripción Realtime
  useEffect(() => {
    if (!codigoSesion) return
    cargar()
    channelRef.current = suscribirJugadores(codigoSesion, cargar)
    return () => desuscribir(channelRef.current)
  }, [codigoSesion, cargar])

  const handleCerrar = async () => {
    if (!confirm(`¿Terminar la sesión ${codigoSesion}? Se eliminará el progreso de todos los jugadores.`)) return
    await cerrarSesion(codigoSesion)
    localStorage.removeItem(KEY_SESION)
    navigate('/')
  }

  const copiar = () => {
    navigator.clipboard.writeText(enlace)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleAjusteDone = () => { setModal(null); cargar() }

  // Sin sesión activa
  if (!codigoSesion) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fade-in">
      <div className="text-5xl">📡</div>
      <h2 className="text-xl font-bold text-white">No hay sesión activa</h2>
      <p className="text-gray-400 text-sm">Inicia una sesión en vivo desde la página de inicio.</p>
      <Link to="/" className="btn-primary justify-center inline-flex"><Home size={15} /> Ir al inicio</Link>
    </div>
  )

  // Stats
  const jugando   = jugadores.filter(j => j.estado === 'jugando').length
  const terminados = jugadores.filter(j => j.estado === 'terminado').length
  const promPts   = jugadores.length
    ? Math.round(jugadores.reduce((s, j) => s + (j.puntaje_final || 0), 0) / jugadores.length)
    : 0

  // Ordenar: terminados arriba por puntaje, luego jugando por progreso
  const ordenados = [...jugadores].sort((a, b) => {
    if (a.estado === 'terminado' && b.estado !== 'terminado') return -1
    if (b.estado === 'terminado' && a.estado !== 'terminado') return 1
    return (b.puntaje_final || 0) - (a.puntaje_final || 0)
  })

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Radio size={20} className="text-sena-green animate-pulse" />
            Juego en vivo
            <span className="badge badge-green font-mono text-sm">{codigoSesion}</span>
          </h1>
          <p className="section-subtitle">Se actualiza automáticamente en tiempo real</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={cargar} className="btn-secondary text-sm">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
          <button onClick={handleCerrar} className="btn-secondary text-sm border-red-500/30 text-red-400 hover:bg-red-500/10">
            <X size={13} /> Terminar sesión
          </button>
        </div>
      </div>

      {/* Enlace y QR compacto */}
      <div className="card border-sena-green/20 bg-sena-green/5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Comparte este enlace con los jugadores</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg text-sena-green truncate">
                {enlace}
              </code>
              <button onClick={copiar}
                className={`shrink-0 p-2 rounded-lg border transition-all ${copiado ? 'border-sena-green bg-sena-green/20 text-sena-green' : 'border-gray-700 bg-gray-800 text-gray-400 hover:text-white'}`}>
                <Copy size={13} />
              </button>
            </div>
            {copiado && <p className="text-xs text-sena-green mt-1">¡Copiado!</p>}
          </div>
          <div className="shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(enlace)}&bgcolor=1f2937&color=39A900`}
              alt="QR" className="rounded-lg border border-gray-700 w-20 h-20"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={16} />,        label: 'Conectados',  val: jugadores.length,  color: 'text-blue-400' },
          { icon: <Radio size={16} />,         label: 'Jugando',     val: jugando,           color: 'text-yellow-400' },
          { icon: <CheckCircle2 size={16} />,  label: 'Terminaron',  val: terminados,        color: 'text-sena-green' },
          { icon: <Star size={16} />,          label: 'Prom. pts',   val: promPts,           color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de jugadores */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Conectando…</div>
      ) : ordenados.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-2">Ningún jugador conectado todavía.</p>
          <p className="text-gray-600 text-xs">Comparte el enlace o código <span className="font-mono text-white">{codigoSesion}</span> con los participantes.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ordenados.map(j => (
            <TarjetaJugador
              key={j.id}
              j={j}
              codigoSesion={codigoSesion}
              onAjuste={(jug, tipo) => setModal({ jugador: jug, tipo })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ModalAjuste
          jugador={modal.jugador}
          tipo={modal.tipo}
          codigoSesion={codigoSesion}
          onDone={handleAjusteDone}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  )
}
