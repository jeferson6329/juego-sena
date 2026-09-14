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
  async signUp({ email, password, fullName, role = 'jugador' }) {
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
    const { error: histError } = await supabase
      .from('points_history')
      .insert({ user_id: userId, points, reason })
    if (histError) return { error: histError }

    const { data, error } = await supabase.rpc('increment_points', {
      uid: userId,
      amount: points,
    })
    return { data, error }
  },

  // Obtener todos los jugadores (solo organizadores)
  async getAllPlayers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'jugador')
      .order('points', { ascending: false })
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

// ─── Helpers del juego ───────────────────────────────────────────────────────

export const gameHelpers = {
  // Obtener o crear sesión de juego
  async getOrCreateSession(userId, totalPreguntas, totalRetos) {
    const { data: existing, error: fetchErr } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!fetchErr && existing) return { data: existing, error: null }

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        total_preguntas: totalPreguntas,
        total_retos: totalRetos,
        status: 'en_progreso',
      })
      .select()
      .single()
    return { data, error }
  },

  // Obtener sesión existente
  async getSession(userId) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Actualizar índice actual (progreso)
  async updateCurrentIndex(userId, index) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update({ current_index: index })
      .eq('user_id', userId)
    return { data, error }
  },

  // Marcar juego como completado
  async completeSession(userId) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update({ status: 'completado', completed_at: new Date().toISOString() })
      .eq('user_id', userId)
    return { data, error }
  },

  // Guardar respuesta individual (pregunta o reto)
  async saveGameAnswer(userId, { itemId, itemType, tema, guia, isCorrect, pts, respuesta }) {
    // Usar RPC que también actualiza session y profile atomicamente
    const { data, error } = await supabase.rpc('save_game_answer', {
      p_item_id:    itemId,
      p_item_type:  itemType,
      p_tema:       tema || '',
      p_guia:       guia || '',
      p_is_correct: isCorrect,
      p_pts:        pts,
      p_respuesta:  typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta),
    })
    return { data, error }
  },

  // Obtener respuestas propias
  async getMyAnswers(userId) {
    const { data, error } = await supabase
      .from('game_answers')
      .select('*')
      .eq('user_id', userId)
      .order('answered_at')
    return { data, error }
  },

  // Reiniciar sesión (borra sesión y respuestas)
  async resetSession(userId) {
    await supabase.from('game_answers').delete().eq('user_id', userId)
    await supabase.from('game_sessions').delete().eq('user_id', userId)
    return { error: null }
  },
}

// ─── Helpers de ajustes de puntos (bonus / descuento) ────────────────────────

export const adjustmentHelpers = {
  // Aplicar bonus o descuento (solo organizadores, vía RPC)
  async applyAdjustment(jugadorId, cantidad, tipo, motivo) {
    const { data, error } = await supabase.rpc('apply_point_adjustment', {
      p_jugador_id: jugadorId,
      p_cantidad:   cantidad,
      p_tipo:       tipo,
      p_motivo:     motivo,
    })
    return { data, error }
  },

  // Obtener ajustes de un jugador
  async getAdjustments(jugadorId) {
    const { data, error } = await supabase
      .from('point_adjustments')
      .select('*, organizador:organizador_id(full_name)')
      .eq('jugador_id', jugadorId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtener todos los ajustes (organizador)
  async getAllAdjustments() {
    const { data, error } = await supabase
      .from('point_adjustments')
      .select('*, organizador:organizador_id(full_name), jugador:jugador_id(full_name)')
      .order('created_at', { ascending: false })
    return { data, error }
  },
}

// ─── Helpers de estadísticas (solo organizadores) ────────────────────────────

export const statsHelpers = {
  // Ranking completo
  async getRanking() {
    const { data, error } = await supabase
      .from('ranking_completo')
      .select('*')
    return { data, error }
  },

  // Todas las sesiones de juego
  async getAllSessions() {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*, jugador:user_id(full_name, role)')
      .order('pts_preguntas', { ascending: false })
    return { data, error }
  },

  // Todas las respuestas del juego agrupadas
  async getAllGameAnswers() {
    const { data, error } = await supabase
      .from('game_answers')
      .select('*')
      .order('answered_at')
    return { data, error }
  },

  // Estadísticas agregadas por ítem
  async getItemStats() {
    const { data, error } = await supabase
      .from('game_answers')
      .select('item_id, item_type, tema, guia, is_correct, pts_obtenidos')
    return { data, error }
  },

  // Perfiles de todos los jugadores con sesión
  async getPlayersWithSessions() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, game_sessions(*), point_adjustments(*)')
      .eq('role', 'jugador')
      .order('points', { ascending: false })
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
