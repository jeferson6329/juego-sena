// Helpers de Supabase para el juego público (sin autenticación)
import { supabase } from './supabase'

const TABLE = 'resultados_juego'

// Guardar / actualizar progreso del jugador
export async function guardarResultado(nombre, respuestas, estado = 'en_progreso') {
  const aciertos    = Object.values(respuestas).filter(r => r.isCorrect).length
  const errores     = Object.values(respuestas).filter(r => !r.isCorrect).length
  const pts         = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const total       = Object.keys(respuestas).length
  const pctAciertos = total > 0 ? Math.round((aciertos / total) * 100) : 0

  // Obtener ajustes previos para conservar bonus/descuentos
  const { data: existing } = await supabase
    .from(TABLE).select('pts_bonus,pts_descuento,ajustes,iniciado_at')
    .eq('nombre', nombre).single()

  const pts_bonus     = existing?.pts_bonus     || 0
  const pts_descuento = existing?.pts_descuento || 0

  const row = {
    nombre,
    aciertos,
    errores,
    pts_juego:     pts,
    pts_bonus,
    pts_descuento,
    puntaje_final: pts + pts_bonus + pts_descuento,
    pct_aciertos:  pctAciertos,
    estado,
    respuestas,
    actualizado_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: 'nombre' })

  return { error }
}

// Obtener todos los resultados (para el organizador)
export async function obtenerResultados() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('puntaje_final', { ascending: false })
  return { data: data || [], error }
}

// Aplicar bonus o descuento
export async function aplicarAjusteSupabase(nombreJugador, cantidad, tipo, motivo) {
  // 1. Registrar el ajuste
  await supabase.from('ajustes_puntos').insert({
    nombre_jugador: nombreJugador,
    cantidad: tipo === 'bonus' ? cantidad : -Math.abs(cantidad),
    tipo,
    motivo,
  })

  // 2. Actualizar puntos del jugador
  const { data: existing } = await supabase
    .from(TABLE).select('pts_juego,pts_bonus,pts_descuento,ajustes')
    .eq('nombre', nombreJugador).single()

  if (!existing) return { error: 'Jugador no encontrado' }

  const pts_bonus     = tipo === 'bonus'
    ? (existing.pts_bonus     || 0) + cantidad
    : (existing.pts_bonus     || 0)
  const pts_descuento = tipo === 'descuento'
    ? (existing.pts_descuento || 0) - Math.abs(cantidad)
    : (existing.pts_descuento || 0)

  const ajustes = [...(existing.ajustes || []), {
    cantidad: tipo === 'bonus' ? cantidad : -Math.abs(cantidad),
    tipo, motivo, fecha: new Date().toISOString(),
  }]

  const { error } = await supabase.from(TABLE).update({
    pts_bonus,
    pts_descuento,
    puntaje_final: (existing.pts_juego || 0) + pts_bonus + pts_descuento,
    ajustes,
    actualizado_at: new Date().toISOString(),
  }).eq('nombre', nombreJugador)

  return { error }
}
