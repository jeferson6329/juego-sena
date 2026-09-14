import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

// Clave de localStorage para progreso
const STORAGE_KEY = 'sena_progreso'

// Secciones totales por guía
export const GUIDE_SECTIONS = {
  guia1: [
    'intro-backend',
    'http-protocolo',
    'servidores',
    'lenguajes-web',
    'algoritmos-intro',
    'algoritmos-practicos',
  ],
  guia3: [
    'intro-arquitectura',
    'patron-mvc',
    'arquitectura-capas',
    'microservicios',
    'principios-solid',
    'patrones-diseno',
  ],
}

function cargarProgreso() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function guardarProgreso(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

export function ProgressProvider({ children }) {
  const { agregarPuntos, nombre } = useAuth()
  const [completed, setCompleted] = useState(() => cargarProgreso())

  const isSectionComplete = useCallback((guideId, sectionId) =>
    completed.includes(`${guideId}:${sectionId}`),
  [completed])

  const getGuideProgress = useCallback((guideId) => {
    const sections = GUIDE_SECTIONS[guideId] || []
    const done = sections.filter(s => isSectionComplete(guideId, s)).length
    return {
      done,
      total: sections.length,
      pct: sections.length ? Math.round((done / sections.length) * 100) : 0,
    }
  }, [isSectionComplete])

  const markComplete = useCallback((guideId, sectionId, pointsToAdd = 15) => {
    if (!nombre || isSectionComplete(guideId, sectionId)) return
    const key = `${guideId}:${sectionId}`
    setCompleted(prev => {
      const next = [...prev, key]
      guardarProgreso(next)
      return next
    })
    agregarPuntos(pointsToAdd)
  }, [nombre, isSectionComplete, agregarPuntos])

  // Limpiar progreso (para nueva partida)
  const resetProgress = useCallback(() => {
    setCompleted([])
    guardarProgreso([])
  }, [])

  const value = {
    completed,
    loading: false,
    isSectionComplete,
    getGuideProgress,
    markComplete,
    resetProgress,
    reload: () => setCompleted(cargarProgreso()),
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
