import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'
import {
  Home, Server, Layers, Trophy, User, Zap, Gamepad2,
  ChevronRight, CheckCircle2, Circle, Users, BarChart2, Crown,
} from 'lucide-react'

// ─── Navegación para JUGADORES ────────────────────────────────────────────────
const NAV_JUGADOR = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/juego', icon: Gamepad2, label: '🎮 Juego educativo', highlight: true },
  {
    label: 'Guía 1 – Back-end', icon: Server, to: '/guia1',
    children: [
      { to: '/guia1/intro',         label: 'Introducción al Back-end', sid: 'intro-backend' },
      { to: '/guia1/http',          label: 'HTTP y protocolos',        sid: 'http-protocolo' },
      { to: '/guia1/servidores',    label: 'Servidores de aplicación', sid: 'servidores' },
      { to: '/guia1/lenguajes',     label: 'Lenguajes web',            sid: 'lenguajes-web' },
      { to: '/guia1/algoritmos',    label: 'Algoritmos básicos',       sid: 'algoritmos-intro' },
      { to: '/guia1/quiz',          label: '🧠 Cuestionario Guía 1',  sid: null },
    ],
  },
  {
    label: 'Guía 3 – Arquitectura', icon: Layers, to: '/guia3',
    children: [
      { to: '/guia3/intro',          label: 'Intro Arquitectura',       sid: 'intro-arquitectura' },
      { to: '/guia3/mvc',            label: 'Patrón MVC',               sid: 'patron-mvc' },
      { to: '/guia3/capas',          label: 'Arquitectura por capas',   sid: 'arquitectura-capas' },
      { to: '/guia3/microservicios', label: 'Microservicios',           sid: 'microservicios' },
      { to: '/guia3/solid',          label: 'Principios SOLID',         sid: 'principios-solid' },
      { to: '/guia3/patrones',       label: 'Patrones de diseño',       sid: 'patrones-diseno' },
      { to: '/guia3/quiz',           label: '🧠 Cuestionario Guía 3',  sid: null },
    ],
  },
  { to: '/playground', icon: Zap,  label: 'Editor de código' },
  { to: '/perfil',     icon: User, label: 'Mi perfil' },
]

// ─── Navegación para ORGANIZADORES ───────────────────────────────────────────
const NAV_ORGANIZADOR = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/organizador/ranking',      icon: Crown,    label: 'Ranking',          highlight: true },
  { to: '/organizador/estadisticas', icon: BarChart2, label: 'Estadísticas' },
  { to: '/organizador/jugadores',    icon: Users,    label: 'Gestión jugadores' },
  { to: '/playground', icon: Zap,  label: 'Editor de código' },
  { to: '/perfil',     icon: User, label: 'Mi perfil' },
]

// ─── Sub-enlace de sección ────────────────────────────────────────────────────
function SectionLink({ to, label, sid, guideId, onClick }) {
  const { isSectionComplete } = useProgress()
  const done = sid ? isSectionComplete(guideId, sid) : false

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-xs transition-all duration-150 ${
          isActive
            ? 'bg-sena-green/15 text-sena-green font-medium'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`
      }
    >
      {done
        ? <CheckCircle2 size={12} className="text-sena-green shrink-0" />
        : <Circle size={12} className="text-gray-700 shrink-0" />
      }
      {label}
    </NavLink>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { isOrganizador } = useAuth()
  const { getGuideProgress } = useProgress()

  const g1 = getGuideProgress('guia1')
  const g3 = getGuideProgress('guia3')

  const nav = isOrganizador ? NAV_ORGANIZADOR : NAV_JUGADOR

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-14 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-40
          overflow-y-auto transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <nav className="p-3 space-y-1">
          {/* Badge de rol */}
          {isOrganizador && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                <Crown size={12} /> Panel Organizador
              </p>
            </div>
          )}

          {nav.map((item) => {
            // Ítem sin hijos
            if (!item.children) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    item.highlight
                      ? isActive
                        ? 'nav-link bg-sena-green/20 text-sena-green border border-sena-green/30'
                        : 'nav-link text-sena-green border border-sena-green/20 hover:bg-sena-green/10'
                      : isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }
                  onClick={onClose}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              )
            }

            // Ítem con hijos (guías)
            const guideId = item.to.replace('/', '')
            const prog = guideId === 'guia1' ? g1 : g3
            const isExpanded = location.pathname.startsWith(item.to)

            return (
              <div key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${isActive ? 'nav-link-active' : 'nav-link-inactive'} justify-between`
                  }
                  onClick={onClose}
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={16} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">{prog.done}/{prog.total}</span>
                    <ChevronRight
                      size={13}
                      className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </span>
                </NavLink>

                {/* Mini progress bar */}
                <div className="px-3 pb-1">
                  <div className="progress-bar h-1">
                    <div className="progress-fill" style={{ width: `${prog.pct}%` }} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {item.children.map(child => (
                      <SectionLink
                        key={child.to}
                        {...child}
                        guideId={guideId}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 mt-2">
          <p className="text-[10px] text-gray-600 text-center">
            SENA – Análisis y Desarrollo de Software<br />
            Programa 228118
          </p>
        </div>
      </aside>
    </>
  )
}
