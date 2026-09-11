import QuizEngine from '../../components/quiz/QuizEngine'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function QuizGuia1Page() {
  return (
    <div className="space-y-5">
      <div>
        <span className="badge-blue">Guía 1 · Cuestionario</span>
        <h1 className="text-2xl font-bold text-white mt-2">Cuestionario – Fundamentos del Back-end</h1>
        <p className="text-gray-400 mt-1">7 preguntas sobre HTTP, protocolos, lenguajes y algoritmos. Cada respuesta correcta suma puntos.</p>
      </div>

      <InfoBox variant="tip" title="Instrucciones">
        Selecciona la respuesta que consideres correcta. Después de elegir verás la explicación.
        No hay penalización por respuesta incorrecta. Puedes reintentar el cuestionario las veces que quieras.
        {!localStorage.getItem('sb-session') && <><br /><strong>Inicia sesión</strong> para que tus puntos se guarden en tu perfil.</>}
      </InfoBox>

      <QuizEngine guideId="guia1" backTo="/guia1" />

      <div className="pt-2">
        <Link to="/guia1" className="btn-ghost text-sm"><ArrowLeft size={14} /> Volver a Guía 1</Link>
      </div>
    </div>
  )
}
