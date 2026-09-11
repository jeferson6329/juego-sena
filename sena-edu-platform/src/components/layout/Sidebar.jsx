import { NavLink, useLocation } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import {
  Home, Server, Layers, Code2, Trophy, User, Zap,
  ChevronRight, CheckCircle2, Circle,
} from 'lucide-react'

const NAV = [
  { to: '/', icon: Home, label: 'Inicio' },
  {
    label: 'Guía 1 – Back-end', icon: Server, to: '/guia1',
    children: [
      { to: '/guia1/intro',        label: 'Introducción al Back-end', sid: 'intro-backend' },
      { to: '/guia1/http',         label: 'HTTP y protocolos',        sid: 'http-protocolo' },
      { to: '/guia1/servidores',   label: 'Servidores de aplicación', sid: 'servidores' },
      { to: '/guia1/lenguajes',    label: 'Lenguajes web',            sid: 'lenguajes-web' },
      { to: '/guia1/algoritmos',   label: 'Algoritmos básicos',       sid: 'algoritmos-intro' },
      { to: '/guia1/quiz',         label: '🧠 Cuestionario Guía 1',   sid: null },
    ],
  },
  {
    label: 'Guía 3 – Arquitectura', icon: Layers, to: '/guia3',
    children: [
      { to: '/guia3/intro',         label: 'Intro Arquitectura',        sid: 'intro-arquitectura' },
      { to: '/guia3/mvc',           label: 'Patrón MVC',                sid: 'patron-mvc' },
      { to: '/guia3/capas',         label: 'Arquitectura por capas',    sid: 'arquitectura-capas' },
      { to: '/guia3/microservicios',label: 'Microservicios',            sid: 'microservicios' },
      { to: '/guia3/solid',         label: 'Principios SOLID',          sid: 'principios-solid' },
      { to: '/guia3/patrones',      label: 'Patrones de diseño',        sid: 'patrones-diseno' },
      { to: '/guia3/quiz',          label: '🧠 Cuestionario Guía 3',   sid: null },
    ],
  },
  { to: '/playground', icon: Zap,    label: 'Editor de código' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranking' },
  { to: '/perfil',      icon: User,   label: 'Mi perfil' },
]

function SectionLink({ to, label, sid, guideId }) {
  const { isSectionComplete } = useProgress()
  const done = sid ? isSectionComplete(guideId, sid) : false

  return (
    <NavLink
      to={to}
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

export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { getGuideProgress } = useProgress()

  const g1 = getGuideProgress('guia1')
  const g3 = getGuideProgress('guia3')

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
          {NAV.map((item) => {
            if (!item.children) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }
                  onClick={onClose}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              )
            }

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

        {/* Footer del sidebar */}
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
