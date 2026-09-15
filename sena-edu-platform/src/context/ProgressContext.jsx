import { createContext, useContext, useState, useCallback } from 'react'

const ProgressContext = createContext(null)
const STORAGE_KEY = 'sena_progreso'

export const GUIDE_SECTIONS = {
  guia1: ['intro-backend','http-protocolo','servidores','lenguajes-web','algoritmos-intro','algoritmos-practicos'],
  guia3: ['intro-arquitectura','patron-mvc','arquitectura-capas','microservicios','principios-solid','patrones-diseno'],
}

function cargar() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(cargar)

  const isSectionComplete = useCallback((guideId, sectionId) =>
    completed.includes(`${guideId}:${sectionId}`), [completed])

  const getGuideProgress = useCallback((guideId) => {
    const sections = GUIDE_SECTIONS[guideId] || []
    const done = sections.filter(s => isSectionComplete(guideId, s)).length
    return { done, total: sections.length, pct: sections.length ? Math.round((done / sections.length) * 100) : 0 }
  }, [isSectionComplete])

  const markComplete = useCallback((guideId, sectionId) => {
    if (isSectionComplete(guideId, sectionId)) return
    const key = `${guideId}:${sectionId}`
    setCompleted(prev => {
      const next = [...prev, key]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [isSectionComplete])

  const value = { completed, loading: false, isSectionComplete, getGuideProgress, markComplete, reload: () => setCompleted(cargar()) }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
