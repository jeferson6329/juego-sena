import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  BookOpen, Trophy, User, LogOut, Menu, X, ChevronDown, Zap,
} from 'lucide-react'

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

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
        <span className="hidden sm:block text-sm">SENA<span className="text-sena-green">·EDU</span></span>
      </Link>

      <div className="flex-1" />

      {/* Quick links */}
      <nav className="hidden md:flex items-center gap-1">
        <Link to="/guia1" className="btn-ghost text-sm py-1.5">Guía 1</Link>
        <Link to="/guia3" className="btn-ghost text-sm py-1.5">Guía 3</Link>
        <Link to="/playground" className="btn-ghost text-sm py-1.5">
          <Zap size={14} /> Editor
        </Link>
        <Link to="/leaderboard" className="btn-ghost text-sm py-1.5">
          <Trophy size={14} /> Ranking
        </Link>
      </nav>

      {/* Points chip */}
      {profile && (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-semibold">
          <span>⭐</span> {profile.points ?? 0} pts
        </div>
      )}

      {/* User menu */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setDropOpen(v => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white"
          >
            <div className="w-7 h-7 rounded-full bg-sena-green/20 border border-sena-green/40 flex items-center justify-center text-sena-green font-bold text-xs uppercase">
              {profile?.full_name?.[0] || user.email[0]}
            </div>
            <span className="hidden sm:block max-w-[100px] truncate">
              {profile?.full_name || user.email.split('@')[0]}
            </span>
            <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1 animate-fade-in"
              onMouseLeave={() => setDropOpen(false)}
            >
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => setDropOpen(false)}
              >
                <User size={15} /> Mi perfil
              </Link>
              <Link
                to="/leaderboard"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => setDropOpen(false)}
              >
                <Trophy size={15} /> Ranking
              </Link>
              <hr className="border-gray-800 my-1" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
              >
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="btn-primary text-sm py-1.5 px-3">
          Iniciar sesión
        </Link>
      )}
    </header>
  )
}
