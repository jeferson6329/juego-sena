import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Variables de entorno de Supabase no configuradas.\n' +
    'Copia .env.example → .env.local y completa tus credenciales.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

// ─── Helpers de autenticación ────────────────────────────────────────────────

export const authHelpers = {
  async signUp({ email, password, fullName, role = 'aprendiz' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })
    return { data, error }
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
}

// ─── Helpers de perfil ───────────────────────────────────────────────────────

export const profileHelpers = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async addPoints(userId, points, reason) {
    // Inserta entrada en historial de puntos
    const { error: histError } = await supabase
      .from('points_history')
      .insert({ user_id: userId, points, reason })
    if (histError) return { error: histError }

    // Actualiza total en perfil
    const { data, error } = await supabase.rpc('increment_points', {
      uid: userId,
      amount: points,
    })
    return { data, error }
  },
}

// ─── Helpers de progreso ─────────────────────────────────────────────────────

export const progressHelpers = {
  async getProgress(userId) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  },

  async markSectionComplete(userId, guideId, sectionId) {
    const { data, error } = await supabase
      .from('progress')
      .upsert(
        {
          user_id: userId,
          guide_id: guideId,
          section_id: sectionId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,guide_id,section_id' }
      )
    return { data, error }
  },
}

// ─── Helpers de cuestionarios ────────────────────────────────────────────────

export const quizHelpers = {
  async getQuestions(guideId) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, options(*)')
      .eq('guide_id', guideId)
      .order('order_index')
    return { data, error }
  },

  async saveAnswer(userId, questionId, optionId, isCorrect) {
    const { data, error } = await supabase
      .from('answers')
      .upsert(
        {
          user_id: userId,
          question_id: questionId,
          option_id: optionId,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,question_id' }
      )
    return { data, error }
  },

  async getUserAnswers(userId) {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  },
}

// ─── Helpers de clasificación/ranking ───────────────────────────────────────

export const leaderboardHelpers = {
  async getTop(limit = 20) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, points, role')
      .order('points', { ascending: false })
      .limit(limit)
    return { data, error }
  },
}
