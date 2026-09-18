import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const SECTIONS = [
  { to: '/guia3/intro',          title: 'Introducción a la Arquitectura' },
  { to: '/guia3/mvc',            title: 'Patrón MVC'                     },
  { to: '/guia3/capas',          title: 'Arquitectura por capas'          },
  { to: '/guia3/microservicios', title: 'Microservicios'                  },
  { to: '/guia3/solid',          title: 'Principios SOLID'                },
  { to: '/guia3/patrones',       title: 'Patrones de diseño'              },
]

export default function Guia3IndexPage() {
  return (
    <div className="space-y-6">
      <div className="gradient-border p-6">
        <span className="badge-blue mb-3">Guía N.° 3</span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-2">
          Arquitectura de Software y Patrones de Diseño
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Aprende a organizar el código usando MVC, arquitectura por capas y microservicios.
          Aplica los principios SOLID y patrones de diseño para un código limpio y mantenible.
        </p>
      </div>

      <div>
        <h2 className="section-title">Contenido de la guía</h2>
        <div className="space-y-2">
          {SECTIONS.map((s, i) => (
            <Link key={s.to} to={s.to}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 transition-all duration-200 group"
            >
              <span className="text-gray-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
              <p className="flex-1 font-medium text-sm text-white">{s.title}</p>
              <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
