import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import {
  Server, Layers, Zap, Trophy, ArrowRight,
  BookOpen, Target, Star, CheckCircle2,
} from 'lucide-react'

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

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, profile } = useAuth()
  const { getGuideProgress, completed } = useProgress()
  const g1 = getGuideProgress('guia1')
  const g3 = getGuideProgress('guia3')
  const totalDone = completed.length

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Aprendiz'

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-sena-green/10 border border-gray-800 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sena-green/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-sena-green text-sm font-semibold mb-2">
            👋 Hola, {firstName}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Plataforma Educativa SENA
          </h1>
          <p className="text-gray-400 max-w-xl mb-6">
            Aprende <strong className="text-white">Construcción del Software</strong> con contenido interactivo,
            ejemplos en vivo y ejercicios prácticos. Gana puntos conforme avanzas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/guia1" className="btn-primary">
              <BookOpen size={16} /> Comenzar Guía 1
            </Link>
            <Link to="/playground" className="btn-secondary">
              <Zap size={16} /> Editor de código
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Star}        value={profile?.points ?? 0}  label="Puntos totales"    color="bg-yellow-500/80" />
          <StatCard icon={CheckCircle2} value={totalDone}             label="Secciones hechas"  color="bg-sena-green/80" />
          <StatCard icon={Target}      value={`${g1.pct}%`}          label="Progreso Guía 1"   color="bg-blue-500/80" />
          <StatCard icon={Target}      value={`${g3.pct}%`}          label="Progreso Guía 3"   color="bg-purple-500/80" />
        </div>
      )}

      {/* Guías */}
      <div>
        <h2 className="section-title">Guías de aprendizaje</h2>
        <p className="section-subtitle">Sigue el orden recomendado para construir el conocimiento de forma progresiva.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <GuideCard
            to="/guia1"
            icon={Server}
            color="bg-blue-600"
            title="Guía 1 – Fundamentos del Back-end"
            subtitle="HTTP, servidores, lenguajes web, algoritmos y lógica de programación."
            guideId="guia1"
          />
          <GuideCard
            to="/guia3"
            icon={Layers}
            color="bg-purple-600"
            title="Guía 3 – Arquitectura y Patrones"
            subtitle="MVC, capas, microservicios, principios SOLID y patrones de diseño."
            guideId="guia3"
          />
        </div>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="section-title">Herramientas</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/playground" className="card-hover group flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-sena-green/20 flex items-center justify-center">
              <Zap size={18} className="text-sena-green" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Editor de código</h3>
              <p className="text-gray-400 text-sm">Editor con vista previa en vivo. Escribe HTML/CSS/JS y ve el resultado al instante.</p>
            </div>
          </Link>
          <Link to="/leaderboard" className="card-hover group flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy size={18} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Ranking</h3>
              <p className="text-gray-400 text-sm">Tabla de posiciones con los aprendices que más puntos han acumulado.</p>
            </div>
          </Link>
          <Link to="/perfil" className="card-hover group flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Star size={18} className="text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Mi perfil</h3>
              <p className="text-gray-400 text-sm">Revisa tu progreso, puntos, insignias y el historial de actividad.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Sobre el programa */}
      <div className="card border-sena-green/20">
        <h2 className="font-bold text-white mb-2">Sobre este programa</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Estas guías hacen parte de la competencia <strong className="text-white">Construcción del Software</strong> del programa
          <strong className="text-white"> Análisis y Desarrollo de Software</strong> (código 228118) del SENA.
          El objetivo es que el aprendiz codifique el software de acuerdo con el diseño establecido,
          aplicando buenas prácticas de arquitectura, patrones de diseño y principios SOLID.
        </p>
      </div>
    </div>
  )
}
