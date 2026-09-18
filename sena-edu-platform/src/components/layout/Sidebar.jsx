import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, Server, Layers, Zap,
  ChevronRight,
  Radio, BarChart2, Users,
} from 'lucide-react'

const NAV_PLATAFORMA = [
  { to: '/',           icon: Home,     label: 'Inicio', end: true },
  {
    label: 'Guía 1 – Back-end', icon: Server, to: '/guia1',
    children: [
      { to: '/guia1/intro',         label: 'Introducción al Back-end', sid: 'intro-backend' },
      { to: '/guia1/http',          label: 'HTTP y protocolos',        sid: 'http-protocolo' },
      { to: '/guia1/servidores',    label: 'Servidores de aplicación', sid: 'servidores' },
      { to: '/guia1/lenguajes',     label: 'Lenguajes web',            sid: 'lenguajes-web' },
      { to: '/guia1/algoritmos',    label: 'Algoritmos básicos',       sid: 'algoritmos-intro' },
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
    ],
  },
  { to: '/playground', icon: Zap, label: 'Editor de código' },
]

const NAV_ORGANIZADOR = [
  { to: '/vivo',                         icon: Radio,     label: 'En vivo' },
  { to: '/organizador/estadisticas',     icon: BarChart2, label: 'Estadísticas' },
  { to: '/organizador/jugadores',        icon: Users,     label: 'Gestión jugadores' },
]

function SectionLink({ to, label, onClick }) {
  return (
    <NavLink to={to} onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-xs transition-all ${
          isActive ? 'bg-sena-green/15 text-sena-green font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  const esOrganizador = location.pathname.startsWith('/organizador')
  const nav  = esOrganizador ? NAV_ORGANIZADOR : NAV_PLATAFORMA

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-14 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-40
        overflow-y-auto transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {esOrganizador && (
          <div className="p-3 border-b border-gray-800">
            <div className="px-2 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                <Radio size={11} /> Panel Organizador
              </p>
            </div>
          </div>
        )}

        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            if (!item.children) {
              return (
                <NavLink key={item.to} to={item.to} end={!!item.end} onClick={onClose}
                  className={({ isActive }) =>
                    item.highlight
                      ? isActive
                        ? 'nav-link bg-sena-green/20 text-sena-green border border-sena-green/30'
                        : 'nav-link text-sena-green border border-sena-green/20 hover:bg-sena-green/10'
                      : isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              )
            }

            const guideId    = item.to.replace('/', '')
            const isExpanded = location.pathname.startsWith(item.to)

            return (
              <div key={item.label}>
                <NavLink to={item.to} onClick={onClose}
                  className={({ isActive }) => `${isActive ? 'nav-link-active' : 'nav-link-inactive'} justify-between`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={16} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </span>
                  <ChevronRight size={13} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </NavLink>
                {isExpanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {item.children.map(child => (
                      <SectionLink key={child.to} {...child} guideId={guideId} onClick={onClose} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 mt-2">
          <p className="text-[10px] text-gray-600 text-center">
            SENA – Análisis y Desarrollo de Software
          </p>
        </div>
      </aside>
    </>
  )
}
