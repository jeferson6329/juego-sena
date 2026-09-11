import PlaygroundEditor from '../components/playground/PlaygroundEditor'
import InfoBox from '../components/ui/InfoBox'
import { Zap } from 'lucide-react'

export default function PlaygroundPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-sena-green/20 flex items-center justify-center">
            <Zap size={16} className="text-sena-green" />
          </div>
          <h1 className="text-2xl font-bold text-white">Editor de código en vivo</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Escribe HTML, CSS y JavaScript en el editor y haz clic en <strong className="text-white">Ejecutar</strong> para
          ver el resultado en tiempo real. Usa los ejemplos de práctica para explorar los temas de las guías.
        </p>
      </div>

      <InfoBox variant="tip" title="¿Cómo usarlo?">
        <ul className="text-sm space-y-1 mt-1">
          <li>• Escribe o pega cualquier código HTML/CSS/JS en el editor izquierdo.</li>
          <li>• Haz clic en <strong>Ejecutar</strong> para actualizar la vista previa.</li>
          <li>• Usa <strong>Tab</strong> para indentar con 2 espacios dentro del editor.</li>
          <li>• Los ejemplos de práctica cubren temas de la Guía 1 y Guía 3.</li>
          <li>• Descarga tu código como archivo .html con el botón <strong>Guardar</strong>.</li>
        </ul>
      </InfoBox>

      <PlaygroundEditor />
    </div>
  )
}
