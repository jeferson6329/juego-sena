import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'

const SECTIONS = [
  { to: '/guia1/intro',      title: 'Introducción al Back-end',     time: '10 min' },
  { to: '/guia1/http',       title: 'HTTP y protocolos web',        time: '15 min' },
  { to: '/guia1/servidores', title: 'Servidores de aplicación',     time: '10 min' },
  { to: '/guia1/lenguajes',  title: 'Lenguajes de programación web',time: '20 min' },
  { to: '/guia1/algoritmos', title: 'Algoritmos fundamentales',     time: '25 min' },
]

export default function Guia1IndexPage() {
  return (
    <div className="space-y-6">
      <div className="gradient-border p-6">
        <span className="badge-blue mb-3">Guía N.° 1</span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-2">
          Fundamentos del Back-end y Lenguajes de Programación Web
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Comprende cómo funciona el servidor, los protocolos web, los lenguajes de programación
          disponibles y la construcción de algoritmos como base de la codificación.
        </p>
      </div>

      <div className="card flex items-center gap-3">
        <Clock size={18} className="text-blue-400" />
        <div><p className="text-white font-semibold text-sm">60 horas</p><p className="text-xs text-gray-500">Duración total</p></div>
      </div>

      <div>
        <h2 className="section-title">Contenido de la guía</h2>
        <div className="space-y-2">
          {SECTIONS.map((s, i) => (
            <Link key={s.to} to={s.to}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 transition-all duration-200 group"
            >
              <span className="text-gray-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white">{s.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} />{s.time}</span>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
