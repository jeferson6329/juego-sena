// ─── Helpers para el juego en vivo (Supabase Realtime) ───────────────────────
import { supabase } from './supabase'

// Generar código de sesión legible (6 caracteres)
export function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0,O,1,I para evitar confusión
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)]
  }
  return codigo
}

// ─── Sesiones ─────────────────────────────────────────────────────────────────

export async function crearSesion() {
  const codigo = generarCodigo()
  const { data, error } = await supabase
    .from('sesiones_vivo')
    .insert({ codigo, activa: true })
    .select()
    .single()
  return { data, error, codigo }
}

export async function cerrarSesion(codigo) {
  // Eliminar todos los jugadores de esta sesión
  await supabase.from('jugadores_vivo').delete().eq('codigo_sesion', codigo)
  // Marcar sesión como inactiva
  const { error } = await supabase
    .from('sesiones_vivo')
    .update({ activa: false, cerrada_at: new Date().toISOString() })
    .eq('codigo', codigo)
  return { error }
}

export async function verificarSesion(codigo) {
  const { data, error } = await supabase
    .from('sesiones_vivo')
    .select('*')
    .eq('codigo', codigo.toUpperCase())
    .eq('activa', true)
    .single()
  return { data, error, valida: !error && !!data }
}

// ─── Jugadores ────────────────────────────────────────────────────────────────

export async function unirseASesion(codigoSesion, nombre, totalPreguntas) {
  const { data, error } = await supabase
    .from('jugadores_vivo')
    .upsert({
      codigo_sesion:   codigoSesion.toUpperCase(),
      nombre,
      total_preguntas: totalPreguntas,
      estado:          'jugando',
      aciertos:        0,
      errores:         0,
      pts_juego:       0,
      puntaje_final:   0,
      pct_aciertos:    0,
      pregunta_actual: 0,
      respuestas:      {},
      ajustes:         [],
      actualizado_at:  new Date().toISOString(),
    }, { onConflict: 'codigo_sesion,nombre' })
    .select()
    .single()
  return { data, error }
}

export async function actualizarJugador(codigoSesion, nombre, respuestas, preguntaActual, estado = 'jugando') {
  const aciertos    = Object.values(respuestas).filter(r => r.isCorrect).length
  const errores     = Object.values(respuestas).filter(r => !r.isCorrect).length
  const pts         = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const total       = Object.keys(respuestas).length
  const pctAciertos = total > 0 ? Math.round((aciertos / total) * 100) : 0

  // Leer bonus/descuentos actuales para no sobreescribirlos
  const { data: actual } = await supabase
    .from('jugadores_vivo')
    .select('pts_bonus,pts_descuento,ajustes')
    .eq('codigo_sesion', codigoSesion)
    .eq('nombre', nombre)
    .single()

  const pts_bonus     = actual?.pts_bonus     || 0
  const pts_descuento = actual?.pts_descuento || 0

  const { error } = await supabase
    .from('jugadores_vivo')
    .update({
      aciertos,
      errores,
      pts_juego:      pts,
      pts_bonus,
      pts_descuento,
      puntaje_final:  pts + pts_bonus + pts_descuento,
      pct_aciertos:   pctAciertos,
      pregunta_actual: preguntaActual,
      estado,
      respuestas,
      actualizado_at: new Date().toISOString(),
    })
    .eq('codigo_sesion', codigoSesion)
    .eq('nombre', nombre)

  return { error }
}

export async function salirDeSesion(codigoSesion, nombre) {
  const { error } = await supabase
    .from('jugadores_vivo')
    .delete()
    .eq('codigo_sesion', codigoSesion)
    .eq('nombre', nombre)
  return { error }
}

// ─── Leer jugadores (para el admin) ──────────────────────────────────────────

export async function obtenerJugadoresVivos(codigoSesion) {
  const { data, error } = await supabase
    .from('jugadores_vivo')
    .select('*')
    .eq('codigo_sesion', codigoSesion)
    .order('puntaje_final', { ascending: false })
  return { data: data || [], error }
}

// ─── Suscripción Realtime ─────────────────────────────────────────────────────

export function suscribirJugadores(codigoSesion, callback) {
  const channel = supabase
    .channel(`jugadores_vivo_${codigoSesion}`)
    .on(
      'postgres_changes',
      {
        event: '*',   // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'jugadores_vivo',
        filter: `codigo_sesion=eq.${codigoSesion}`,
      },
      () => callback()   // al recibir cualquier cambio, releer la lista completa
    )
    .subscribe()
  return channel
}

export function desuscribir(channel) {
  if (channel) supabase.removeChannel(channel)
}

// ─── Bonus / Descuentos (admin) ───────────────────────────────────────────────

export async function aplicarAjusteVivo(codigoSesion, nombre, cantidad, tipo, motivo) {
  const { data: actual } = await supabase
    .from('jugadores_vivo')
    .select('pts_juego,pts_bonus,pts_descuento,ajustes')
    .eq('codigo_sesion', codigoSesion)
    .eq('nombre', nombre)
    .single()

  if (!actual) return { error: 'Jugador no encontrado' }

  const pts_bonus     = tipo === 'bonus'
    ? (actual.pts_bonus || 0) + cantidad
    : (actual.pts_bonus || 0)
  const pts_descuento = tipo === 'descuento'
    ? (actual.pts_descuento || 0) - Math.abs(cantidad)
    : (actual.pts_descuento || 0)

  const ajustes = [...(actual.ajustes || []), {
    cantidad: tipo === 'bonus' ? cantidad : -Math.abs(cantidad),
    tipo, motivo, fecha: new Date().toISOString(),
  }]

  const { error } = await supabase
    .from('jugadores_vivo')
    .update({
      pts_bonus,
      pts_descuento,
      puntaje_final:  (actual.pts_juego || 0) + pts_bonus + pts_descuento,
      ajustes,
      actualizado_at: new Date().toISOString(),
    })
    .eq('codigo_sesion', codigoSesion)
    .eq('nombre', nombre)

  return { error }
}
