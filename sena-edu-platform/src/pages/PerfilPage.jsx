import { useAuth } from '../context/AuthContext'
import { User } from 'lucide-react'

export default function PerfilPage() {
  const { nombre, rol } = useAuth()

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="gradient-border p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-sena-green/20 border-2 border-sena-green/40 flex items-center justify-center text-sena-green text-2xl font-black uppercase shrink-0">
            {nombre?.[0] || '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white mb-1">{nombre}</h1>
            <span className="badge bg-gray-700 text-gray-300 border border-gray-600 capitalize text-xs">
              {rol || 'jugador'}
            </span>
          </div>
        </div>
      </div>

      <div className="card border-gray-700 flex items-center gap-3">
        <User size={18} className="text-gray-500" />
        <p className="text-gray-400 text-sm">
          Sesión activa como <strong className="text-white">{nombre}</strong>
        </p>
      </div>
    </div>
  )
}
