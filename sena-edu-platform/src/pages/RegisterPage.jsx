import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'jugador' })
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.fullName.trim())  return 'El nombre completo es obligatorio.'
    if (!form.email.includes('@')) return 'Ingresa un correo válido.'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    return null
  }

  const submit = async e => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName, form.role)
    setLoading(false)
    if (error) { setError(error.message || 'Error al registrar.'); return }
    setSuccess(true)
    setTimeout(() => navigate('/'), 2500)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sena-green rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-sena-green/30">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-gray-400 text-sm mt-1">SENA – Análisis y Desarrollo de Software</p>
        </div>

        <form onSubmit={submit} className="card space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-sena-green/10 border border-sena-green/30 rounded-lg text-sena-green text-sm">
              <CheckCircle2 size={16} /> ¡Registro exitoso! Redirigiendo…
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre completo</label>
            <input name="fullName" type="text" value={form.fullName} onChange={handle}
              placeholder="Ej: Ana García" className="input" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="tu@correo.com" className="input" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <input name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handle}
                placeholder="Mínimo 6 caracteres" className="input pr-10" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Rol</label>
            <select name="role" value={form.role} onChange={handle} className="input">
              <option value="jugador">Jugador</option>
              <option value="organizador">Organizador</option>
            </select>
          </div>

          <button type="submit" disabled={loading || success} className="btn-primary w-full justify-center py-2.5">
            <UserPlus size={16} />
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-sena-green hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
