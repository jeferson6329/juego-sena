import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { crearSesion, cerrarSesion, verificarSesion } from '../lib/supabaseVivo'
import {
  Server, Layers, Zap, ArrowRight, BookOpen,
  Star, CheckCircle2, Target, Gamepad2,
  BarChart2, Users, Crown, Radio, Copy,
  QrCode, X, ExternalLink,
} from 'lucide-react'

// ─── Clave localStorage para sesión activa del admin ─────────────────────────
const KEY_SESION_ADMIN = 'sena_admin_sesion'

// ─── Tarjeta de guía ─────────────────────────────────────────────────────────
function GuideCard({ to, icon: Icon, color, title, subtitle, guideId }) {
  const { getGuideProgress } = useProgress()
  const prog = getGuideProgress(guideId)
  return (
    <Link to={to} className="card-hover group block">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <ArrowRight size={16} className="text-gray-600 group-hover:text-sena-green group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{subtitle}</p>
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{prog.done}/{prog.total} secciones</span>
          <span>{prog.pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${prog.pct}%` }} />
        </div>
      </div>
    </Link>
  )
}

// ─── QR simple (usando api.qrserver.com — sin dependencia) ───────────────────
function QRCode({ url, size = 180 }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=1f2937&color=39A900&format=png`
  return (
    <img src={src} alt="QR del juego" className="rounded-xl border border-gray-700"
      width={size} height={size} />
  )
}

// ─── Panel del juego en vivo ──────────────────────────────────────────────────
function PanelVivoAdmin({ sesion, enlace, onCerrar }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = () => {
    navigator.clipboard.writeText(enlace)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="card border-sena-green/40 bg-sena-green/5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sena-green animate-pulse" />
          <p className="text-sena-green font-bold text-sm">Sesión en vivo activa</p>
        </div>
        <button onClick={onCerrar}
          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-all">
          <X size={12} /> Terminar sesión
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* Código y enlace */}
        <div className="space-y-3">
          {/* Código grande */}
          <div className="text-center p-4 bg-gray-900 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Código de sesión</p>
            <p className="text-5xl font-black text-white tracking-widest font-mono">{sesion}</p>
            <p className="text-xs text-gray-600 mt-1">Los jugadores lo ingresan en /juego</p>
          </div>

          {/* Enlace directo */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Enlace directo</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg text-sena-green truncate">
                {enlace}
              </code>
              <button onClick={copiar}
                className={`shrink-0 p-2 rounded-lg border transition-all ${copiado ? 'border-sena-green bg-sena-green/20 text-sena-green' : 'border-gray-700 bg-gray-800 text-gray-400 hover:text-white'}`}>
                <Copy size={14} />
              </button>
            </div>
            {copiado && <p className="text-xs text-sena-green">¡Enlace copiado!</p>}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 flex-wrap">
            <a href={enlace} target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-xs py-1.5 flex-1 justify-center">
              <ExternalLink size={12} /> Abrir juego
            </a>
            <Link to="/vivo" className="btn-primary text-xs py-1.5 flex-1 justify-center">
              <Radio size={12} /> Ver en vivo
            </Link>
          </div>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Escanear con el celular</p>
          <QRCode url={enlace} size={160} />
          <p className="text-xs text-gray-600 text-center">
            Comparte este QR o el código <span className="text-white font-mono font-bold">{sesion}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { getGuideProgress, completed } = useProgress()
  const g1 = getGuideProgress('guia1')
  const g3 = getGuideProgress('guia3')

  const [sesionActiva, setSesionActiva] = useState(() => localStorage.getItem(KEY_SESION_ADMIN))
  const [creando, setCreando]           = useState(false)

  const enlaceJuego = sesionActiva
    ? `${window.location.origin}/juego?codigo=${sesionActiva}`
    : ''

  // Verificar si la sesión guardada sigue activa en Supabase
  useEffect(() => {
    if (!sesionActiva) return
    verificarSesion(sesionActiva).then(({ valida }) => {
      if (!valida) {
        localStorage.removeItem(KEY_SESION_ADMIN)
        setSesionActiva(null)
      }
    })
  }, [])

  const [errorSesion, setErrorSesion] = useState(null)

  const handleIniciarJuego = async () => {
    setCreando(true)
    setErrorSesion(null)
    const { codigo, error } = await crearSesion()
    setCreando(false)
    if (error) {
      // Mostrar el error real de Supabase para diagnosticar
      const msg = error?.message || error?.code || JSON.stringify(error)
      setErrorSesion(`Error Supabase: ${msg}`)
      console.error('Error crearSesion:', error)
      return
    }
    localStorage.setItem(KEY_SESION_ADMIN, codigo)
    setSesionActiva(codigo)
    navigate('/vivo')
  }

  const handleCerrarSesion = async () => {
    if (!confirm(`¿Terminar la sesión ${sesionActiva}? Se eliminará el progreso de todos los jugadores.`)) return
    await cerrarSesion(sesionActiva)
    localStorage.removeItem(KEY_SESION_ADMIN)
    setSesionActiva(null)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-sena-green/10 border border-gray-800 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sena-green/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Plataforma Educativa SENA
          </h1>
          <p className="text-gray-400 max-w-xl mb-6">
            <strong className="text-white">Construcción del Software</strong> — Análisis y Desarrollo de Software.
            Guías interactivas, editor en vivo y juego educativo en tiempo real.
          </p>
          <div className="flex flex-wrap gap-3">
            {sesionActiva ? (
              <Link to="/vivo" className="btn-primary">
                <Radio size={16} /> Ver juego en vivo
              </Link>
            ) : (
              <button onClick={handleIniciarJuego} disabled={creando} className="btn-primary">
                <Gamepad2 size={16} />
                {creando ? 'Creando sesión…' : 'Iniciar juego en vivo'}
              </button>
            )}
            <Link to="/playground" className="btn-secondary">
              <Zap size={16} /> Editor de código
            </Link>
          </div>
          {errorSesion && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-xs font-mono">{errorSesion}</p>
              <p className="text-gray-500 text-xs mt-1">
                Asegúrate de haber ejecutado el SQL en Supabase (supabase-schema.sql).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Panel de sesión activa */}
      {sesionActiva && (
        <PanelVivoAdmin
          sesion={sesionActiva}
          enlace={enlaceJuego}
          onCerrar={handleCerrarSesion}
        />
      )}

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, value: completed.length,     label: 'Secciones hechas',  color: 'bg-sena-green/80' },
          { icon: Target,       value: `${g1.pct}%`,         label: 'Progreso Guía 1',   color: 'bg-blue-500/80' },
          { icon: Target,       value: `${g3.pct}%`,         label: 'Progreso Guía 3',   color: 'bg-purple-500/80' },
          { icon: Star,         value: g1.done + g3.done,    label: 'Total completadas', color: 'bg-yellow-500/80' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Guías */}
      <div>
        <h2 className="section-title">Guías de aprendizaje</h2>
        <p className="section-subtitle">Contenido del programa Análisis y Desarrollo de Software.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <GuideCard to="/guia1" icon={Server} color="bg-blue-600"
            title="Guía 1 – Fundamentos del Back-end"
            subtitle="HTTP, servidores, lenguajes web, algoritmos y lógica de programación."
            guideId="guia1" />
          <GuideCard to="/guia3" icon={Layers} color="bg-purple-600"
            title="Guía 3 – Arquitectura y Patrones"
            subtitle="MVC, capas, microservicios, principios SOLID y patrones de diseño."
            guideId="guia3" />
        </div>
      </div>

      {/* Herramientas */}
      <div>
        <h2 className="section-title">Herramientas</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/playground" className="card-hover group flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-sena-green/20 flex items-center justify-center">
              <Zap size={18} className="text-sena-green" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Editor de código</h3>
              <p className="text-gray-400 text-sm">Editor con vista previa en vivo. HTML, CSS y JavaScript.</p>
            </div>
          </Link>
          <Link to="/organizador/ranking" className="card-hover group flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Crown size={18} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Resultados</h3>
              <p className="text-gray-400 text-sm">Ranking, estadísticas y gestión de jugadores.</p>
            </div>
          </Link>
          {sesionActiva ? (
            <Link to="/vivo" className="card-hover group flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-sena-green/20 flex items-center justify-center">
                <Radio size={18} className="text-sena-green animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">En vivo — {sesionActiva}</h3>
                <p className="text-gray-400 text-sm">Ver jugadores activos en tiempo real.</p>
              </div>
            </Link>
          ) : (
            <button onClick={handleIniciarJuego} disabled={creando} className="card-hover group flex flex-col gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Gamepad2 size={18} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Juego en vivo</h3>
                <p className="text-gray-400 text-sm">Genera un código y los jugadores se unen al instante.</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Sobre el programa */}
      <div className="card border-sena-green/20">
        <h2 className="font-bold text-white mb-2">Sobre este programa</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Competencia <strong className="text-white">Construcción del Software</strong> del programa{' '}
          <strong className="text-white">Análisis y Desarrollo de Software</strong> (código 228118) del SENA.
        </p>
      </div>
    </div>
  )
}
