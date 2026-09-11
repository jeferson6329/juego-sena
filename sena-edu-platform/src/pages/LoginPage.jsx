import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd]  = useState(false)
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Completa todos los campos.'); return }
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { setError(error.message || 'Credenciales incorrectas.'); return }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sena-green rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-sena-green/30">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
          <p className="text-gray-400 text-sm mt-1">Inicia sesión en SENA EDU Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Correo electrónico
            </label>
            <input
              name="email" type="email" value={form.email} onChange={handle}
              placeholder="tu@correo.com" className="input" autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handle}
                placeholder="••••••••" className="input pr-10" autoComplete="current-password"
              />
              <button
                type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            <LogIn size={16} />
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-sena-green hover:underline font-medium">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
