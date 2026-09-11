import QuizEngine from '../../components/quiz/QuizEngine'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function QuizGuia3Page() {
  return (
    <div className="space-y-5">
      <div>
        <span className="badge-blue">Guía 3 · Cuestionario</span>
        <h1 className="text-2xl font-bold text-white mt-2">Cuestionario – Arquitectura y Patrones</h1>
        <p className="text-gray-400 mt-1">7 preguntas sobre MVC, capas, microservicios, SOLID y patrones de diseño.</p>
      </div>

      <InfoBox variant="tip" title="Instrucciones">
        Selecciona la respuesta correcta en cada pregunta. Verás la explicación al responder.
        Inicia sesión para guardar tu puntaje en la tabla de posiciones.
      </InfoBox>

      <QuizEngine guideId="guia3" backTo="/guia3" />

      <div className="pt-2">
        <Link to="/guia3" className="btn-ghost text-sm"><ArrowLeft size={14} /> Volver a Guía 3</Link>
      </div>
    </div>
  )
}
