import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const SECTIONS = [
  { to: '/guia1/intro',      title: 'Introducción al Back-end'      },
  { to: '/guia1/http',       title: 'HTTP y protocolos web'         },
  { to: '/guia1/servidores', title: 'Servidores de aplicación'      },
  { to: '/guia1/lenguajes',  title: 'Lenguajes de programación web' },
  { to: '/guia1/algoritmos', title: 'Algoritmos fundamentales'      },
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
