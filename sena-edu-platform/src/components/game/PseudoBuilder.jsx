import { useState } from 'react'
import { HelpCircle, RotateCcw, Trash2, ArrowUp, ArrowDown, CheckCircle2, XCircle } from 'lucide-react'

// ─── Colores por tipo de bloque ───────────────────────────────────────────────
const TIPO_COLOR = {
  inicio:    'border-sena-green/50 bg-sena-green/10 text-sena-green',
  fin:       'border-sena-green/50 bg-sena-green/10 text-sena-green',
  leer:      'border-blue-500/50 bg-blue-500/10 text-blue-300',
  mostrar:   'border-purple-500/50 bg-purple-500/10 text-purple-300',
  si:        'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  sino:      'border-orange-500/50 bg-orange-500/10 text-orange-300',
  fin_si:    'border-yellow-500/30 bg-yellow-500/5 text-yellow-500',
  mientras:  'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
  para:      'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
  fin_para:  'border-cyan-500/30 bg-cyan-500/5 text-cyan-500',
  asignar:   'border-gray-500/50 bg-gray-800 text-gray-300',
  proceso:   'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
  default:   'border-gray-600 bg-gray-800 text-gray-300',
}

// Sangría visual por tipo
const INDENTACION = {
  mostrar: 1,
  leer:    0,
  sino:    0,
  asignar: 1,
  proceso: 1,
  fin_si:  0,
  fin_para:0,
}

function getColorClase(tipo) {
  return TIPO_COLOR[tipo] || TIPO_COLOR.default
}

function getIndent(tipo) {
  return (INDENTACION[tipo] ?? 0) * 16
}

// ─── Bloque en el área de construcción ───────────────────────────────────────
function BloqueEnConstruccion({ bloque, idx, total, onMover, onEliminar, enviado }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono transition-all group ${getColorClase(bloque.tipo)} ${enviado ? 'opacity-80' : 'hover:brightness-110'}`}
      style={{ marginLeft: getIndent(bloque.tipo) }}
    >
      <span className="w-5 text-center text-xs opacity-40 font-sans select-none">{idx + 1}</span>
      <span className="flex-1">{bloque.texto}</span>
      {!enviado && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMover(idx, -1)}
            disabled={idx === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-gray-400 hover:text-white"
            title="Mover arriba"
          >
            <ArrowUp size={12} />
          </button>
          <button
            onClick={() => onMover(idx, 1)}
            disabled={idx === total - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-gray-400 hover:text-white"
            title="Mover abajo"
          >
            <ArrowDown size={12} />
          </button>
          <button
            onClick={() => onEliminar(idx)}
            className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
            title="Eliminar"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Chip de bloque disponible ────────────────────────────────────────────────
function ChipBloque({ bloque, onClick, usado, enviado }) {
  return (
    <button
      onClick={() => !enviado && !usado && onClick(bloque)}
      disabled={usado || enviado}
      title={usado ? 'Ya usado' : 'Agregar al pseudocódigo'}
      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
        usado
          ? 'opacity-30 cursor-default border-gray-700 bg-gray-900 text-gray-600'
          : enviado
            ? 'cursor-default opacity-60'
            : `cursor-pointer ${getColorClase(bloque.tipo)} hover:brightness-125 active:scale-95`
      } ${bloque.distractor ? 'border-dashed opacity-70' : ''}`}
    >
      {bloque.texto}
    </button>
  )
}

// ─── Validador de pseudocódigo ────────────────────────────────────────────────
function validar(construido, solucion) {
  if (construido.length !== solucion.length) {
    return {
      correcto: false,
      detalle: `Tu algoritmo tiene ${construido.length} instrucciones pero se esperan ${solucion.length}.`,
    }
  }

  const errores = []
  for (let i = 0; i < solucion.length; i++) {
    if (construido[i] !== solucion[i]) {
      errores.push(`Posición ${i + 1}: se esperaba "${solucion[i]}" pero está "${construido[i]}".`)
    }
  }

  // Verificar INICIO y FIN
  if (!construido.includes('INICIO')) {
    errores.push('Falta la instrucción INICIO.')
  }
  if (!construido.includes('FIN')) {
    errores.push('Falta la instrucción FIN.')
  }

  return {
    correcto: errores.length === 0,
    detalle: errores.length > 0 ? errores[0] : null,
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PseudoBuilder({ reto, onAnswer, answered }) {
  const [construido, setConstruido] = useState([]) // array de IDs de bloques
  const [showPista, setShowPista] = useState(false)
  const [enviado, setEnviado] = useState(!!answered)
  const [resultado, setResultado] = useState(answered || null)

  const bloques = reto.bloquesDisponibles || []
  const solucion = reto.solucion || [] // array de IDs en orden correcto

  // Mapa id → bloque
  const bloqueMap = Object.fromEntries(bloques.map(b => [b.id, b]))

  const usados = new Set(construido)

  const agregar = (bloque) => {
    if (usados.has(bloque.id) || enviado) return
    setConstruido(prev => [...prev, bloque.id])
  }

  const eliminar = (idx) => {
    setConstruido(prev => prev.filter((_, i) => i !== idx))
  }

  const mover = (idx, dir) => {
    const arr = [...construido]
    const dest = idx + dir
    if (dest < 0 || dest >= arr.length) return
    ;[arr[idx], arr[dest]] = [arr[dest], arr[idx]]
    setConstruido(arr)
  }

  const reiniciar = () => {
    if (enviado) return
    setConstruido([])
  }

  const enviar = () => {
    if (enviado || construido.length === 0) return
    setEnviado(true)
    const { correcto, detalle } = validar(construido, solucion)
    const pts = correcto ? reto.puntos : 0
    const res = { isCorrect: correcto, pts, respuesta: JSON.stringify(construido), detalle }
    setResultado(res)
    onAnswer(res)
  }

  return (
    <div className="space-y-4">
      {/* Bloques disponibles */}
      <div>
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
          Bloques disponibles — haz clic para agregar:
        </p>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700 min-h-[60px]">
          {bloques.map(b => (
            <ChipBloque
              key={b.id}
              bloque={b}
              onClick={agregar}
              usado={usados.has(b.id)}
              enviado={enviado}
            />
          ))}
        </div>
        {bloques.some(b => b.distractor) && (
          <p className="text-xs text-gray-600 mt-1.5">
            * Los bloques con borde discontinuo son distractores que pueden no ser necesarios.
          </p>
        )}
      </div>

      {/* Área de construcción */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Tu pseudocódigo ({construido.length} instrucciones):
          </p>
          {!enviado && (
            <button
              onClick={reiniciar}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <RotateCcw size={11} /> Reiniciar
            </button>
          )}
        </div>

        <div className={`min-h-[120px] p-3 rounded-xl border space-y-1.5 ${
          enviado
            ? resultado?.isCorrect
              ? 'border-sena-green/40 bg-sena-green/5'
              : 'border-red-500/30 bg-red-500/5'
            : 'border-gray-700 bg-gray-900/50 border-dashed'
        }`}>
          {construido.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6 select-none">
              ← Haz clic en los bloques de arriba para construir tu pseudocódigo aquí
            </p>
          ) : (
            construido.map((id, idx) => {
              const bloque = bloqueMap[id]
              if (!bloque) return null
              return (
                <BloqueEnConstruccion
                  key={`${id}-${idx}`}
                  bloque={bloque}
                  idx={idx}
                  total={construido.length}
                  onMover={mover}
                  onEliminar={eliminar}
                  enviado={enviado}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Pista */}
      {reto.pista && !enviado && (
        <button
          onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
        >
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista (-5 pts si envías)'}
        </button>
      )}
      {showPista && reto.pista && !enviado && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {reto.pista}
        </div>
      )}

      {/* Resultado tras envío */}
      {enviado && resultado && (
        <div className={`p-4 rounded-xl border ${
          resultado.isCorrect
            ? 'bg-sena-green/10 border-sena-green/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-2 mb-2">
            {resultado.isCorrect
              ? <CheckCircle2 size={18} className="text-sena-green shrink-0 mt-0.5" />
              : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            }
            <div>
              <p className={`font-semibold text-sm ${resultado.isCorrect ? 'text-sena-green' : 'text-red-400'}`}>
                {resultado.isCorrect
                  ? `¡Pseudocódigo correcto! +${resultado.pts} puntos`
                  : 'Pseudocódigo incorrecto — 0 puntos'
                }
              </p>
              {!resultado.isCorrect && resultado.detalle && (
                <p className="text-red-300 text-xs mt-1">
                  ❌ {resultado.detalle}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{reto.explicacion}</p>

          {/* Solución esperada */}
          {!resultado.isCorrect && (
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                Ver pseudocódigo correcto ▼
              </summary>
              <div className="mt-2 p-3 bg-gray-900 rounded-lg space-y-1">
                {solucion.map((id, i) => {
                  const b = bloqueMap[id]
                  if (!b) return null
                  return (
                    <div key={i}
                      className={`px-3 py-1.5 rounded text-xs font-mono ${getColorClase(b.tipo)}`}
                      style={{ marginLeft: getIndent(b.tipo) }}
                    >
                      {b.texto}
                    </div>
                  )
                })}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Botón enviar */}
      {!enviado && (
        <button
          onClick={enviar}
          disabled={construido.length === 0}
          className="btn-primary w-full justify-center text-sm disabled:opacity-50"
        >
          Enviar pseudocódigo
        </button>
      )}
    </div>
  )
}
