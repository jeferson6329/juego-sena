import SectionCard from '../../components/ui/SectionCard'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function IntroArquitecturaPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 1</span>
        <h1 className="text-2xl font-bold text-white mt-2">Introducción a la Arquitectura de Software</h1>
        <p className="text-gray-400 mt-1">Entiende qué es la arquitectura y por qué organizar el código correctamente importa.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="intro-arquitectura" title="¿Qué es la arquitectura de software?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          La <strong className="text-white">arquitectura de software</strong> define la organización de alto nivel
          de un sistema: cómo se divide en componentes, qué responsabilidad tiene cada uno y cómo se comunican.
          Elegir y respetar una arquitectura es clave para construir software mantenible, escalable y comprensible
          por todo el equipo.
        </p>

        <InfoBox variant="warning" title="¿Qué ocurre sin arquitectura?">
          Cuando todo el código se escribe en un solo archivo enorme — lo que se conoce como
          <strong> código espagueti</strong> — ocurre lo siguiente:
          <ul className="mt-2 space-y-1">
            <li>• Un cambio pequeño puede romper todo el sistema.</li>
            <li>• Es imposible trabajar en equipo sin conflictos.</li>
            <li>• Agregar nuevas funciones se vuelve cada vez más lento y riesgoso.</li>
            <li>• Las pruebas son casi imposibles de escribir.</li>
          </ul>
        </InfoBox>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Las tres arquitecturas que estudiaremos</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🏛️', name: 'MVC', desc: 'Separa Modelo, Vista y Controlador. Ideal para aplicaciones web clásicas.', color: 'border-blue-500/30' },
            { icon: '🥞', name: 'Por capas', desc: 'Organiza el sistema en niveles: presentación, negocio, datos. Muy usada en aplicaciones empresariales.', color: 'border-yellow-500/30' },
            { icon: '🔬', name: 'Microservicios', desc: 'Divide la app en servicios pequeños e independientes. Ideal para sistemas grandes y equipos distribuidos.', color: 'border-purple-500/30' },
          ].map(a => (
            <div key={a.name} className={`card border ${a.color}`}>
              <p className="text-3xl mb-2">{a.icon}</p>
              <p className="text-white font-bold mb-1">{a.name}</p>
              <p className="text-gray-400 text-xs">{a.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Beneficios de una buena arquitectura</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { emoji: '🔧', title: 'Mantenibilidad', desc: 'Los cambios se hacen en un lugar sin afectar el resto.' },
            { emoji: '📈', title: 'Escalabilidad', desc: 'El sistema puede crecer sin rediseñarlo desde cero.' },
            { emoji: '👥', title: 'Trabajo en equipo', desc: 'Cada desarrollador trabaja en su capa sin bloquear al otro.' },
            { emoji: '🧪', title: 'Testabilidad', desc: 'Los componentes aislados son fáciles de probar unitariamente.' },
            { emoji: '♻️', title: 'Reutilización', desc: 'Los componentes bien definidos se pueden usar en otros proyectos.' },
            { emoji: '📖', title: 'Legibilidad', desc: 'El código organizado es más fácil de entender y documentar.' },
          ].map(b => (
            <div key={b.title} className="flex gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className="text-xl shrink-0">{b.emoji}</span>
              <div>
                <p className="text-white text-sm font-medium">{b.title}</p>
                <p className="text-gray-400 text-xs">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <InfoBox variant="success" title="Objetivo de esta guía">
          Al finalizar la Guía 3, podrás seleccionar y aplicar la arquitectura adecuada para tu proyecto,
          organizar el código siguiendo MVC, aplicar al menos un patrón de diseño y los principios SOLID,
          y sustentar tus decisiones técnicas.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-end pt-4">
        <Link to="/guia3/mvc" className="btn-primary">Siguiente: Patrón MVC <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
