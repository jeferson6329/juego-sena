import { CheckCircle2 } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'

export default function SectionCard({ guideId, sectionId, title, points = 15, children }) {
  const { isSectionComplete, markComplete } = useProgress()
  const { nombre } = useAuth()
  const done = isSectionComplete(guideId, sectionId)

  return (
    <section className="mb-10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {done && <CheckCircle2 size={20} className="text-sena-green shrink-0" />}
          {title}
        </h2>

        {nombre && !done && (
          <button
            onClick={() => markComplete(guideId, sectionId, points)}
            className="shrink-0 btn-secondary text-xs py-1.5 px-3"
          >
            ✓ Marcar completada <span className="badge-green ml-1">+{points} pts</span>
          </button>
        )}
        {done && (
          <span className="shrink-0 badge-green text-xs py-1.5 px-3">Completada ✓</span>
        )}
      </div>

      {children}
    </section>
  )
}
