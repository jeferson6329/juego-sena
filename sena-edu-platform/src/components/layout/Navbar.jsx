import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Zap, Menu, X, BarChart2, Users, Crown, Gamepad2, Radio } from 'lucide-react'

export default function Navbar({ onMenuToggle, menuOpen }) {
  const location = useLocation()
  const esOrganizador = location.pathname.startsWith('/organizador')

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center px-4 gap-3">
      {/* Hamburger (mobile) */}
      <button
        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        onClick={onMenuToggle}
        aria-label="Abrir menú"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-white shrink-0">
        <span className="w-7 h-7 bg-sena-green rounded-lg flex items-center justify-center text-sm font-black">S</span>
        <span className="hidden sm:block text-sm">SENA<span className="text-sena-green"> Jeferson lugo 3177444</span></span>
      </Link>

      <div className="flex-1" />

      {/* Links según sección */}
      <nav className="hidden md:flex items-center gap-1">
        {esOrganizador ? (
          <>
            <Link to="/vivo"                     className="btn-ghost text-sm py-1.5"><Radio size={14} /> En vivo</Link>
            <Link to="/organizador/estadisticas" className="btn-ghost text-sm py-1.5"><BarChart2 size={14} /> Estadísticas</Link>
            <Link to="/organizador/jugadores"    className="btn-ghost text-sm py-1.5"><Users size={14} /> Jugadores</Link>
            <Link to="/" className="btn-ghost text-sm py-1.5"><BookOpen size={14} /> Plataforma</Link>
          </>
        ) : (
          <>
            <Link to="/juego"   className="btn-ghost text-sm py-1.5 text-sena-green"><Gamepad2 size={14} /> Juego</Link>
            <Link to="/guia1"   className="btn-ghost text-sm py-1.5">Guía 1</Link>
            <Link to="/guia3"   className="btn-ghost text-sm py-1.5">Guía 3</Link>
            <Link to="/playground" className="btn-ghost text-sm py-1.5"><Zap size={14} /> Editor</Link>
          </>
        )}
      </nav>
    </header>
  )
}
