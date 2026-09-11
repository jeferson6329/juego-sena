import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { progressHelpers, profileHelpers } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

// Secciones totales por guía (refleja los IDs usados en las páginas)
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

export function ProgressProvider({ children }) {
  const { user, refreshProfile } = useAuth()
  const [completed, setCompleted] = useState([])   // array de "guideId:sectionId"
  const [loading, setLoading]     = useState(false)

  const loadProgress = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await progressHelpers.getProgress(user.id)
    if (data) {
      setCompleted(data.filter(r => r.completed).map(r => `${r.guide_id}:${r.section_id}`))
    }
    setLoading(false)
  }, [user])

  useEffect(() => { loadProgress() }, [loadProgress])

  const isSectionComplete = (guideId, sectionId) =>
    completed.includes(`${guideId}:${sectionId}`)

  const getGuideProgress = (guideId) => {
    const sections = GUIDE_SECTIONS[guideId] || []
    const done = sections.filter(s => isSectionComplete(guideId, s)).length
    return { done, total: sections.length, pct: sections.length ? Math.round((done / sections.length) * 100) : 0 }
  }

  const markComplete = async (guideId, sectionId, pointsToAdd = 15) => {
    if (!user || isSectionComplete(guideId, sectionId)) return
    const key = `${guideId}:${sectionId}`
    setCompleted(prev => [...prev, key])
    await progressHelpers.markSectionComplete(user.id, guideId, sectionId)
    await profileHelpers.addPoints(user.id, pointsToAdd, `Sección completada: ${guideId}/${sectionId}`)
    refreshProfile()
  }

  const value = { completed, loading, isSectionComplete, getGuideProgress, markComplete, reload: loadProgress }

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
