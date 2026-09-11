import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { quizHelpers, profileHelpers } from '../../lib/supabase'
import { QUIZ_LOCAL } from '../../data/quizData'
import { CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function OptionButton({ option, state, onClick }) {
  const base = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 font-medium'
  const styles = {
    idle:    `${base} bg-gray-800 border-gray-700 hover:border-sena-green hover:bg-gray-700 text-gray-200 cursor-pointer`,
    correct: `${base} bg-sena-green/15 border-sena-green text-sena-green cursor-default`,
    wrong:   `${base} bg-red-500/15 border-red-500 text-red-400 cursor-default shake`,
    missed:  `${base} bg-sena-green/10 border-sena-green/40 text-gray-400 cursor-default`,
  }
  return (
    <button onClick={onClick} className={styles[state]} disabled={state !== 'idle'}>
      {option.text}
    </button>
  )
}

export default function QuizEngine({ guideId, backTo }) {
  const { user, refreshProfile } = useAuth()
  const questions = QUIZ_LOCAL[guideId] || []

  const [current, setCurrent]   = useState(0)
  const [answered, setAnswered] = useState({})   // { qId: optId }
  const [showExp, setShowExp]   = useState(false)
  const [finished, setFinished] = useState(false)
  const [earned, setEarned]     = useState(0)

  const q = questions[current]
  const totalPts = questions.reduce((s, q) => s + q.points, 0)

  const choose = async (option) => {
    if (answered[q.id]) return
    const isCorrect = option.is_correct
    setAnswered(prev => ({ ...prev, [q.id]: option.id }))
    setShowExp(true)

    if (user) {
      try {
        await quizHelpers.saveAnswer(user.id, q.id, option.id, isCorrect)
        if (isCorrect) {
          await profileHelpers.addPoints(user.id, q.points, `Quiz ${guideId}: ${q.question.substring(0, 40)}`)
          setEarned(prev => prev + q.points)
          refreshProfile()
        }
      } catch (_) { /* sin Supabase, seguimos igual */ }
    } else if (isCorrect) {
      setEarned(prev => prev + q.points)
    }
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setShowExp(false)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setCurrent(0); setAnswered({}); setShowExp(false)
    setFinished(false); setEarned(0)
  }

  const getOptionState = (option) => {
    const chosen = answered[q?.id]
    if (!chosen) return 'idle'
    if (option.id === chosen) return option.is_correct ? 'correct' : 'wrong'
    if (option.is_correct && chosen) return 'missed'
    return 'idle'
  }

  const correctCount = questions.filter(q => {
    const chosen = answered[q.id]
    return chosen && q.options.find(o => o.id === chosen)?.is_correct
  }).length

  // ── Pantalla de resultados ────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'
    const msg   = pct >= 80 ? '¡Excelente dominio del tema!'
                : pct >= 60 ? 'Buen intento, repasa las secciones que fallaste.'
                : 'Vuelve a estudiar el material antes de reintentar.'

    return (
      <div className="flex flex-col items-center py-10 text-center space-y-5">
        <div className="text-6xl animate-bounce-light">{emoji}</div>
        <h2 className="text-2xl font-bold text-white">Cuestionario completado</h2>
        <div className="flex gap-6 flex-wrap justify-center">
          <div className="card text-center px-8">
            <p className="text-4xl font-black text-white">{correctCount}/{questions.length}</p>
            <p className="text-gray-400 text-sm mt-1">Respuestas correctas</p>
          </div>
          <div className="card text-center px-8">
            <p className="text-4xl font-black text-yellow-400">{earned}</p>
            <p className="text-gray-400 text-sm mt-1">Puntos ganados</p>
          </div>
          <div className="card text-center px-8">
            <p className={`text-4xl font-black ${pct >= 80 ? 'text-sena-green' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{pct}%</p>
            <p className="text-gray-400 text-sm mt-1">Porcentaje</p>
          </div>
        </div>
        <p className="text-gray-400">{msg}</p>
        <div className="progress-bar w-64">
          <div className={`progress-fill ${pct >= 80 ? 'bg-sena-green' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
               style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-3 flex-wrap justify-center pt-2">
          <button onClick={restart} className="btn-secondary"><RotateCcw size={16} /> Reintentar</button>
          {backTo && <Link to={backTo} className="btn-primary"><BookOpen size={16} /> Volver al contenido</Link>}
        </div>
      </div>
    )
  }

  // ── Quiz activo ───────────────────────────────────────────────────────────
  const progress = ((current) / questions.length) * 100
  const chosen = answered[q.id]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Barra de progreso */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Pregunta {current + 1} de {questions.length}</span>
        <span className="flex items-center gap-1 text-yellow-400">⭐ {earned} pts ganados</span>
      </div>
      <div className="progress-bar h-2 mb-6">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Tarjeta de pregunta */}
      <div className="card border-gray-700 mb-4">
        <div className="flex items-start gap-3 mb-5">
          <span className="w-8 h-8 rounded-full bg-sena-green/20 border border-sena-green/30 flex items-center justify-center text-sena-green text-sm font-bold shrink-0">
            {current + 1}
          </span>
          <p className="text-white font-semibold leading-relaxed">{q.question}</p>
        </div>

        <div className="space-y-2">
          {q.options.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              state={getOptionState(option)}
              onClick={() => choose(option)}
            />
          ))}
        </div>
      </div>

      {/* Explicación */}
      {showExp && (
        <div className={`p-4 rounded-xl border mb-4 animate-slide-in ${
          q.options.find(o => o.id === chosen)?.is_correct
            ? 'bg-sena-green/10 border-sena-green/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-2">
            {q.options.find(o => o.id === chosen)?.is_correct
              ? <CheckCircle2 size={18} className="text-sena-green shrink-0 mt-0.5" />
              : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-semibold mb-1 ${
                q.options.find(o => o.id === chosen)?.is_correct ? 'text-sena-green' : 'text-red-400'
              }`}>
                {q.options.find(o => o.id === chosen)?.is_correct
                  ? `¡Correcto! +${q.points} puntos` : 'Incorrecto'}
              </p>
              <p className="text-gray-300 text-sm">{q.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botón siguiente */}
      {chosen && (
        <div className="flex justify-end">
          <button onClick={next} className="btn-primary">
            {current < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
