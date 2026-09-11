import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { CheckCircle2, Circle, ArrowRight, Clock, Star } from 'lucide-react'

const SECTIONS = [
  { to: '/guia3/intro',          sid: 'intro-arquitectura', title: 'Introducción a la Arquitectura',  time: '10 min', pts: 15 },
  { to: '/guia3/mvc',            sid: 'patron-mvc',         title: 'Patrón MVC',                      time: '15 min', pts: 15 },
  { to: '/guia3/capas',          sid: 'arquitectura-capas', title: 'Arquitectura por capas',           time: '15 min', pts: 15 },
  { to: '/guia3/microservicios', sid: 'microservicios',     title: 'Microservicios',                   time: '20 min', pts: 15 },
  { to: '/guia3/solid',          sid: 'principios-solid',   title: 'Principios SOLID',                 time: '20 min', pts: 20 },
  { to: '/guia3/patrones',       sid: 'patrones-diseno',    title: 'Patrones de diseño',               time: '20 min', pts: 20 },
  { to: '/guia3/quiz',           sid: null,                 title: '🧠 Cuestionario Guía 3',        time: '15 min', pts: 50 },
]

export default function Guia3IndexPage() {
  const { isSectionComplete, getGuideProgress } = useProgress()
  const prog = getGuideProgress('guia3')

  return (
    <div className="space-y-6">
      <div className="gradient-border p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="badge-blue mb-3">Guía N.° 3</span>
            <h1 className="text-2xl font-bold text-white mt-2 mb-2">
              Arquitectura de Software y Patrones de Diseño
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Aprende a organizar el código usando MVC, arquitectura por capas y microservicios.
              Aplica los principios SOLID y patrones de diseño para un código limpio y mantenible.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold text-white">{prog.pct}%</p>
            <p className="text-xs text-gray-400">{prog.done}/{prog.total} completadas</p>
          </div>
        </div>
        <div className="mt-4 progress-bar h-2.5">
          <div className="progress-fill" style={{ width: `${prog.pct}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="card flex items-center gap-3">
          <Clock size={18} className="text-purple-400" />
          <div><p className="text-white font-semibold text-sm">48 horas</p><p className="text-xs text-gray-500">Duración total</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <Star size={18} className="text-yellow-400" />
          <div><p className="text-white font-semibold text-sm">150 puntos</p><p className="text-xs text-gray-500">Puntos disponibles</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <CheckCircle2 size={18} className="text-sena-green" />
          <div><p className="text-white font-semibold text-sm">{prog.done} secciones</p><p className="text-xs text-gray-500">Completadas</p></div>
        </div>
      </div>

      <div>
        <h2 className="section-title">Contenido de la guía</h2>
        <div className="space-y-2">
          {SECTIONS.map((s, i) => {
            const done = s.sid ? isSectionComplete('guia3', s.sid) : false
            return (
              <Link key={s.to} to={s.to}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group
                  ${done ? 'bg-sena-green/5 border-sena-green/20 hover:border-sena-green/40'
                         : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
              >
                <span className="text-gray-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
                {done ? <CheckCircle2 size={18} className="text-sena-green shrink-0" />
                      : <Circle size={18} className="text-gray-700 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${done ? 'text-gray-300' : 'text-white'}`}>{s.title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} />{s.time}</span>
                  <span className="badge-yellow text-xs">+{s.pts} pts</span>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
