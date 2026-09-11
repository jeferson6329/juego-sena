import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProgress, GUIDE_SECTIONS } from '../context/ProgressContext'
import { profileHelpers } from '../lib/supabase'
import {
  User, Star, CheckCircle2, Edit3, Save, X,
  Trophy, Zap, BookOpen, Target, Award,
} from 'lucide-react'

const BADGES = [
  { id: 'first_section',  emoji: '🌱', label: 'Primer paso',      desc: 'Completaste tu primera sección',  req: (done) => done >= 1 },
  { id: 'guia1_complete', emoji: '🔵', label: 'Experto Back-end',   desc: 'Completaste toda la Guía 1',      req: (done, g1, g3) => g1.pct === 100 },
  { id: 'guia3_complete', emoji: '🟣', label: 'Arquitecto',         desc: 'Completaste toda la Guía 3',      req: (done, g1, g3) => g3.pct === 100 },
  { id: 'both_complete',  emoji: '🏆', label: 'Desarrollador Pleno',desc: 'Completaste ambas guías',         req: (done, g1, g3) => g1.pct === 100 && g3.pct === 100 },
  { id: 'quiz_player',    emoji: '🧠', label: 'Cuestionarista',     desc: 'Respondiste 5 preguntas',         req: (done) => done >= 5 },
  { id: 'points_100',     emoji: '⭐', label: '100 puntos',        desc: 'Acumulaste 100 puntos',           req: (done, g1, g3, pts) => pts >= 100 },
  { id: 'points_300',     emoji: '💫', label: '300 puntos',        desc: 'Acumulaste 300 puntos',           req: (done, g1, g3, pts) => pts >= 300 },
  { id: 'all_sections',   emoji: '🎓', label: 'Graduado SENA',     desc: 'Completaste todas las secciones', req: (done) => done >= 12 },
]

function BadgeCard({ badge, unlocked }) {
  return (
    <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
      unlocked
        ? 'bg-sena-green/10 border-sena-green/30'
        : 'bg-gray-800/30 border-gray-800 opacity-40 grayscale'
    }`}>
      <span className="text-3xl mb-2">{badge.emoji}</span>
      <p className={`text-xs font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.label}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</p>
      {unlocked && <span className="badge-green text-[10px] mt-2">Obtenida ✓</span>}
    </div>
  )
}

export default function PerfilPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { getGuideProgress, completed }   = useProgress()
  const g1 = getGuideProgress('guia1')
  const g3 = getGuideProgress('guia3')

  const [editing, setEditing]   = useState(false)
  const [name, setName]         = useState(profile?.full_name || '')
  const [saving, setSaving]     = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={48} className="text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Inicia sesión para ver tu perfil</h2>
        <p className="text-gray-400 mb-6">Tu progreso y puntos se guardan cuando tienes una cuenta.</p>
        <a href="/login" className="btn-primary">Iniciar sesión</a>
      </div>
    )
  }

  const totalSections = Object.values(GUIDE_SECTIONS).flat().length
  const pts = profile?.points ?? 0
  const level = pts < 50 ? 1 : pts < 150 ? 2 : pts < 300 ? 3 : pts < 500 ? 4 : 5
  const levelNames = ['', 'Novato', 'Aprendiz', 'Desarrollador', 'Desarrollador Senior', 'Maestro Desarrollador']
  const nextLevelPts = [0, 50, 150, 300, 500, 9999]
  const pctToNext = level < 5
    ? Math.round(((pts - nextLevelPts[level - 1]) / (nextLevelPts[level] - nextLevelPts[level - 1])) * 100)
    : 100

  const unlockedBadges = BADGES.filter(b => b.req(completed.length, g1, g3, pts))

  const saveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)
    const { error } = await profileHelpers.updateProfile(user.id, { full_name: name.trim() })
    setSaving(false)
    if (!error) {
      setSaveMsg('Guardado ✓')
      refreshProfile()
      setTimeout(() => { setSaveMsg(''); setEditing(false) }, 1500)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header de perfil */}
      <div className="gradient-border p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-sena-green/20 border-2 border-sena-green/40 flex items-center justify-center text-sena-green text-2xl font-black uppercase shrink-0">
            {(profile?.full_name || user.email)[0]}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input text-lg font-bold max-w-xs"
                  autoFocus
                />
                <button onClick={saveProfile} disabled={saving} className="btn-primary py-1.5 px-3 text-sm">
                  <Save size={14} /> {saving ? 'Guardando…' : saveMsg || 'Guardar'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-ghost py-1.5 px-2">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white truncate">{profile?.full_name || 'Sin nombre'}</h1>
                <button onClick={() => { setName(profile?.full_name || ''); setEditing(true) }}
                  className="text-gray-500 hover:text-white transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
            )}
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Nivel {level} · {levelNames[level]}
              </span>
              <span className="badge bg-gray-700 text-gray-300 border border-gray-600 capitalize">
                {profile?.role || 'aprendiz'}
              </span>
            </div>
          </div>

          {/* Puntos destacados */}
          <div className="text-right shrink-0">
            <p className="text-3xl font-black text-yellow-400">{pts}</p>
            <p className="text-xs text-gray-400">puntos totales</p>
          </div>
        </div>

        {/* Barra de nivel */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Nivel {level}</span>
            <span>{level < 5 ? `${pts} / ${nextLevelPts[level]} pts para Nivel ${level + 1}` : '¡Nivel máximo!'}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-yellow-400" style={{ width: `${pctToNext}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Star,         value: pts,              label: 'Puntos',        color: 'text-yellow-400' },
          { icon: CheckCircle2, value: completed.length, label: 'Secciones',     color: 'text-sena-green' },
          { icon: Award,        value: unlockedBadges.length, label: 'Insignias', color: 'text-purple-400' },
          { icon: Target,       value: `${Math.round(((g1.pct + g3.pct) / 2))}%`, label: 'Progreso medio', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <s.icon size={18} className={`${s.color} shrink-0`} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progreso por guía */}
      <div>
        <h2 className="section-title">Progreso por guía</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: BookOpen, label: 'Guía 1 – Back-end',          prog: g1, color: 'bg-blue-500' },
            { icon: Zap,      label: 'Guía 3 – Arquitectura',       prog: g3, color: 'bg-purple-500' },
          ].map(g => (
            <div key={g.label} className="card border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${g.color} flex items-center justify-center`}>
                  <g.icon size={16} className="text-white" />
                </div>
                <span className="text-white font-medium text-sm">{g.label}</span>
                <span className="ml-auto text-sena-green font-bold text-sm">{g.prog.pct}%</span>
              </div>
              <div className="progress-bar mb-1">
                <div className="progress-fill" style={{ width: `${g.prog.pct}%` }} />
              </div>
              <p className="text-xs text-gray-500">{g.prog.done} de {g.prog.total} secciones completadas</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insignias */}
      <div>
        <h2 className="section-title">Insignias</h2>
        <p className="section-subtitle">{unlockedBadges.length} de {BADGES.length} obtenidas</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map(b => (
            <BadgeCard key={b.id} badge={b} unlocked={unlockedBadges.some(u => u.id === b.id)} />
          ))}
        </div>
      </div>

      {/* Secciones completadas */}
      {completed.length > 0 && (
        <div>
          <h2 className="section-title">Secciones completadas</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {completed.map(key => {
              const [gid, sid] = key.split(':')
              return (
                <div key={key} className="flex items-center gap-2 p-2.5 bg-sena-green/5 border border-sena-green/20 rounded-lg">
                  <CheckCircle2 size={14} className="text-sena-green shrink-0" />
                  <span className="text-xs text-gray-300 truncate">
                    <span className="text-gray-500">{gid} · </span>{sid}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
