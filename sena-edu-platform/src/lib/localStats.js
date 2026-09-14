// ─── Helpers para leer estadísticas del juego desde localStorage ──────────────
// Usados por las páginas del organizador cuando Supabase no está disponible
// (modo sin autenticación Supabase Auth)

const STORAGE_JUGADORES_KEY = 'sena_jugadores_registro'

// Guardar/actualizar registro de un jugador al completar el juego
export function registrarJugador(nombre, respuestas, secuenciaIds) {
  const todos = cargarJugadores()
  const ahora = new Date().toISOString()

  const aciertos   = Object.values(respuestas).filter(r => r.isCorrect).length
  const errores    = Object.values(respuestas).filter(r => !r.isCorrect).length
  const pts        = Object.values(respuestas).reduce((s, r) => s + (r.pts || 0), 0)
  const total      = Object.keys(respuestas).length
  const pctAciertos = total > 0 ? Math.round((aciertos / total) * 100) : 0

  // Calcular pts por tema para estadísticas
  const porTema = {}
  // (necesitamos la secuencia para esto, la pasamos como parámetro)

  const entrada = {
    nombre,
    aciertos,
    errores,
    pts_juego: pts,
    pts_bonus: 0,
    pts_descuento: 0,
    puntaje_final: pts,
    pct_aciertos: pctAciertos,
    estado: 'completado',
    fecha: ahora,
    respuestas, // { itemId: { isCorrect, pts } }
  }

  // Actualizar si ya existe, agregar si es nuevo
  const idx = todos.findIndex(j => j.nombre === nombre)
  if (idx >= 0) {
    todos[idx] = { ...todos[idx], ...entrada }
  } else {
    todos.push(entrada)
  }

  localStorage.setItem(STORAGE_JUGADORES_KEY, JSON.stringify(todos))
  return entrada
}

// Aplicar bonus o descuento a un jugador
export function aplicarAjuste(nombre, cantidad, tipo, motivo, organizador) {
  const todos = cargarJugadores()
  const idx   = todos.findIndex(j => j.nombre === nombre)
  if (idx < 0) return false

  const j = todos[idx]
  if (tipo === 'bonus') {
    j.pts_bonus     = (j.pts_bonus || 0) + cantidad
  } else {
    j.pts_descuento = (j.pts_descuento || 0) - Math.abs(cantidad)
  }
  j.puntaje_final = (j.pts_juego || 0) + (j.pts_bonus || 0) + (j.pts_descuento || 0)

  if (!j.ajustes) j.ajustes = []
  j.ajustes.push({
    cantidad: tipo === 'bonus' ? cantidad : -Math.abs(cantidad),
    tipo,
    motivo,
    organizador,
    fecha: new Date().toISOString(),
  })

  todos[idx] = j
  localStorage.setItem(STORAGE_JUGADORES_KEY, JSON.stringify(todos))
  return true
}

// Cargar todos los jugadores registrados
export function cargarJugadores() {
  try {
    const raw = localStorage.getItem(STORAGE_JUGADORES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

// Ranking ordenado por puntaje final
export function getRanking() {
  return cargarJugadores().sort((a, b) => (b.puntaje_final || 0) - (a.puntaje_final || 0))
}

// Estadísticas generales
export function getEstadisticas(gameData) {
  const jugadores  = cargarJugadores()
  const completados = jugadores.filter(j => j.estado === 'completado')

  // Agregar respuestas por item
  const porItem = {}
  jugadores.forEach(j => {
    Object.entries(j.respuestas || {}).forEach(([itemId, resp]) => {
      if (!porItem[itemId]) porItem[itemId] = { total: 0, aciertos: 0, errores: 0 }
      porItem[itemId].total++
      if (resp.isCorrect) porItem[itemId].aciertos++
      else porItem[itemId].errores++
    })
  })

  // Enriquecer con datos del gameData
  const { PREGUNTAS = [], RETOS_PSEUDOCODIGO = [] } = gameData || {}
  const todosItems = [...PREGUNTAS, ...RETOS_PSEUDOCODIGO]
  const itemMap    = Object.fromEntries(todosItems.map(i => [i.id, i]))

  const itemsStats = Object.entries(porItem).map(([id, st]) => ({
    id,
    ...st,
    pctAcierto: st.total > 0 ? Math.round((st.aciertos / st.total) * 100) : 0,
    pctError:   st.total > 0 ? Math.round((st.errores  / st.total) * 100) : 0,
    itemData:   itemMap[id] || null,
    tema:       itemMap[id]?.tema || 'Sin tema',
  }))

  // Agrupar por tema
  const porTema = {}
  itemsStats.forEach(i => {
    const t = i.tema
    if (!porTema[t]) porTema[t] = { total: 0, aciertos: 0, errores: 0 }
    porTema[t].total    += i.total
    porTema[t].aciertos += i.aciertos
    porTema[t].errores  += i.errores
  })
  const temasStats = Object.entries(porTema).map(([tema, st]) => ({
    tema, ...st,
    pctAcierto: st.total > 0 ? Math.round((st.aciertos / st.total) * 100) : 0,
    pctError:   st.total > 0 ? Math.round((st.errores  / st.total) * 100) : 0,
  })).sort((a, b) => b.pctError - a.pctError)

  const promedioAciertos = jugadores.length > 0
    ? Math.round(jugadores.reduce((s, j) => s + (j.pct_aciertos || 0), 0) / jugadores.length)
    : 0

  const ptsPromedio = jugadores.length > 0
    ? Math.round(jugadores.reduce((s, j) => s + (j.puntaje_final || 0), 0) / jugadores.length)
    : 0

  return {
    totalJugadores:  jugadores.length,
    completados:     completados.length,
    pctFinalizacion: jugadores.length > 0 ? Math.round((completados.length / jugadores.length) * 100) : 0,
    promedioAciertos,
    ptsPromedio,
    itemsStats:      itemsStats.sort((a, b) => b.pctError - a.pctError),
    temasStats,
    masFallado:      itemsStats.sort((a, b) => b.pctError - a.pctError)[0] || null,
    masAcertado:     [...itemsStats].sort((a, b) => b.pctAcierto - a.pctAcierto)[0] || null,
  }
}
