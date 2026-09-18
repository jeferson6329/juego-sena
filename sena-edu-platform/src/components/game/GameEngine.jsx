import { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, ChevronRight } from 'lucide-react'
import { TIPOS } from '../../data/gameData'
import PseudoBuilder from './PseudoBuilder'

// ─── Utilidades ──────────────────────────────────────────────────────────────

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function Badge({ children, color = 'green' }) {
  const colors = {
    green:  'bg-sena-green/20 text-sena-green border-sena-green/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    blue:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red:    'bg-red-500/20 text-red-400 border-red-500/30',
    gray:   'bg-gray-700 text-gray-400 border-gray-600',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  )
}

function NivelBadge({ nivel }) {
  const map = { 'fácil': 'green', 'medio': 'yellow', 'difícil': 'red' }
  return <Badge color={map[nivel] || 'gray'}>{nivel}</Badge>
}

function FeedbackBox({ isCorrect, explicacion, pista, ptsObtenidos, preguntaBase, onNext, isLast }) {
  return (
    <div className={`mt-4 p-4 rounded-xl border animate-slide-in ${
      isCorrect
        ? 'bg-sena-green/10 border-sena-green/30'
        : 'bg-red-500/10 border-red-500/30'
    }`}>
      <div className="flex items-start gap-3">
        {isCorrect
          ? <CheckCircle2 size={20} className="text-sena-green shrink-0 mt-0.5" />
          : <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
        }
        <div className="flex-1">
          <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-sena-green' : 'text-red-400'}`}>
            {isCorrect
              ? ptsObtenidos > preguntaBase
                ? `⚡ ¡Doble o nada! +${ptsObtenidos} puntos`
                : `¡Correcto! +${ptsObtenidos} puntos`
              : ptsObtenidos < 0
                ? `⚡ Doble o nada — ${ptsObtenidos} puntos`
                : 'Incorrecto — 0 puntos'
            }
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">{explicacion}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={onNext} className="btn-primary text-sm">
          {isLast ? '🏁 Ver resultados' : 'Siguiente'} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Tipos de pregunta ────────────────────────────────────────────────────────

// Selección múltiple / Verdadero-Falso
function PreguntaSeleccion({ pregunta, onAnswer, answered, bonusActivo }) {
  const [selected, setSelected] = useState(null)
  const [showPista, setShowPista] = useState(false)

  const todasOpciones = pregunta.opciones || []

  // 50/50: si hay 4+ opciones, mostrar solo la correcta + 1 incorrecta aleatoria
  const opciones = (() => {
    if (bonusActivo === 'cincuenta_cincuenta' && todasOpciones.length >= 4 && !answered) {
      const correcta   = todasOpciones.find(o => !!o.correcto || o.id === pregunta.respuestaCorrecta)
      const incorrectas = todasOpciones.filter(o => !o.correcto && o.id !== pregunta.respuestaCorrecta)
      const unaIncorrecta = incorrectas[Math.floor(Math.random() * incorrectas.length)]
      // Mezclar las dos opciones
      return [correcta, unaIncorrecta].sort(() => Math.random() - 0.5).filter(Boolean)
    }
    return todasOpciones
  })()

  const elegida = answered?.respuesta

  const handleClick = (opcion) => {
    if (elegida) return
    setSelected(opcion.id)
    const correcto = !!opcion.correcto || opcion.id === pregunta.respuestaCorrecta
    onAnswer({
      isCorrect: correcto,
      pts: correcto ? pregunta.puntos : 0,
      respuesta: opcion.id,
    })
  }

  const getEstado = (op) => {
    const id = elegida || selected
    if (!id) return 'idle'
    const esCorrecta = !!op.correcto || op.id === pregunta.respuestaCorrecta
    if (op.id === id) return esCorrecta ? 'correct' : 'wrong'
    if (esCorrecta && id) return 'missed'
    return 'idle'
  }

  const estilos = {
    idle:    'bg-gray-800 border-gray-700 hover:border-sena-green hover:bg-gray-700 text-gray-200 cursor-pointer',
    correct: 'bg-sena-green/15 border-sena-green text-sena-green cursor-default',
    wrong:   'bg-red-500/15 border-red-500 text-red-400 cursor-default shake',
    missed:  'bg-sena-green/10 border-sena-green/40 text-gray-400 cursor-default',
  }

  return (
    <div className="space-y-2">
      {bonusActivo === 'cincuenta_cincuenta' && todasOpciones.length >= 4 && !answered && (
        <p className="text-xs text-blue-400 flex items-center gap-1.5 mb-1">
          ✂️ <strong>50/50 activo</strong> — solo quedan 2 opciones
        </p>
      )}
      {bonusActivo === 'doble_o_nada' && !answered && (
        <p className="text-xs text-yellow-400 flex items-center gap-1.5 mb-1">
          ⚡ <strong>Doble o nada</strong> — acierto = doble pts · fallo = descuento
        </p>
      )}
      {opciones.map(op => (
        <button
          key={op.id}
          onClick={() => handleClick(op)}
          disabled={!!elegida}
          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 font-medium ${estilos[getEstado(op)]}`}
        >
          {op.texto}
        </button>
      ))}
      {pregunta.pista && !elegida && (
        <button
          onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors mt-2"
        >
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista'}
        </button>
      )}
      {showPista && pregunta.pista && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {pregunta.pista}
        </div>
      )}
    </div>
  )
}

// Ordenar pasos
function PreguntaOrdenar({ pregunta, onAnswer, answered }) {
  const pasos = pregunta.pasosDesordenados || pregunta.pasos || []
  const [items, setItems] = useState(() => shuffle(pasos))
  const [enviado, setEnviado] = useState(false)
  const [showPista, setShowPista] = useState(false)

  const mover = (idx, dir) => {
    if (enviado) return
    const nuevoArr = [...items]
    const destIdx = idx + dir
    if (destIdx < 0 || destIdx >= nuevoArr.length) return
    ;[nuevoArr[idx], nuevoArr[destIdx]] = [nuevoArr[destIdx], nuevoArr[idx]]
    setItems(nuevoArr)
  }

  const enviar = () => {
    if (enviado) return
    setEnviado(true)
    const ordenActual = items.map(p => p.id)
    const correcto = pregunta.ordenCorrecto || []
    const esCorrecta = ordenActual.every((id, i) => id === correcto[i])
    onAnswer({
      isCorrect: esCorrecta,
      pts: esCorrecta ? pregunta.puntos : 0,
      respuesta: JSON.stringify(ordenActual),
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Usa las flechas para reordenar los pasos:</p>
      <div className="space-y-1.5">
        {items.map((paso, idx) => (
          <div key={paso.id}
            className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
              enviado ? 'border-gray-700 bg-gray-800/50' : 'border-gray-700 bg-gray-800'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
              {idx + 1}
            </span>
            <span className="flex-1 text-gray-200">{paso.texto}</span>
            {!enviado && (
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => mover(idx, -1)} disabled={idx === 0}
                  className="text-gray-500 hover:text-white disabled:opacity-20 p-0.5 text-xs leading-none">▲</button>
                <button onClick={() => mover(idx, 1)} disabled={idx === items.length - 1}
                  className="text-gray-500 hover:text-white disabled:opacity-20 p-0.5 text-xs leading-none">▼</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {pregunta.pista && !enviado && (
        <button
          onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
        >
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista'}
        </button>
      )}
      {showPista && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {pregunta.pista}
        </div>
      )}
      {!enviado && (
        <button onClick={enviar} className="btn-primary text-sm w-full justify-center mt-2">
          Confirmar orden
        </button>
      )}
    </div>
  )
}

// Relacionar conceptos
function PreguntaRelacionar({ pregunta, onAnswer, answered }) {
  const pares = pregunta.pares || []
  const [selecIzq, setSelecIzq] = useState(null)
  const [relaciones, setRelaciones] = useState({}) // { izquierda: derecha }
  const [enviado, setEnviado] = useState(false)
  const [showPista, setShowPista] = useState(false)

  const derechas = pares.map(p => p.derecha)
  const usadas = new Set(Object.values(relaciones))

  const clickIzq = (izq) => {
    if (enviado || relaciones[izq]) return
    setSelecIzq(izq === selecIzq ? null : izq)
  }

  const clickDer = (der) => {
    if (enviado || !selecIzq || usadas.has(der)) return
    setRelaciones(prev => ({ ...prev, [selecIzq]: der }))
    setSelecIzq(null)
  }

  const desconectar = (izq) => {
    if (enviado) return
    setRelaciones(prev => {
      const n = { ...prev }
      delete n[izq]
      return n
    })
  }

  const enviar = () => {
    if (enviado || Object.keys(relaciones).length !== pares.length) return
    setEnviado(true)
    const correcto = pares.every(p => relaciones[p.izquierda] === p.derecha)
    onAnswer({
      isCorrect: correcto,
      pts: correcto ? pregunta.puntos : 0,
      respuesta: JSON.stringify(relaciones),
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Selecciona un elemento de la izquierda y luego uno de la derecha para conectarlos:</p>
      <div className="grid grid-cols-2 gap-3">
        {/* Columna izquierda */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Concepto</p>
          {pares.map(p => {
            const conectado = relaciones[p.izquierda]
            return (
              <button
                key={p.izquierda}
                onClick={() => conectado ? desconectar(p.izquierda) : clickIzq(p.izquierda)}
                disabled={enviado}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  enviado
                    ? pares.find(par => par.izquierda === p.izquierda)?.derecha === relaciones[p.izquierda]
                      ? 'bg-sena-green/15 border-sena-green text-sena-green'
                      : 'bg-red-500/15 border-red-500 text-red-400'
                    : conectado
                      ? 'bg-sena-green/15 border-sena-green text-sena-green'
                      : selecIzq === p.izquierda
                        ? 'bg-blue-500/15 border-blue-500 text-blue-300'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-200'
                }`}
              >
                {p.izquierda}
                {conectado && <span className="text-xs ml-1 opacity-60">→ {relaciones[p.izquierda]}</span>}
              </button>
            )
          })}
        </div>
        {/* Columna derecha */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Descripción</p>
          {derechas.map(der => (
            <button
              key={der}
              onClick={() => clickDer(der)}
              disabled={enviado || usadas.has(der)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                usadas.has(der)
                  ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-default'
                  : selecIzq
                    ? 'bg-gray-800 border-blue-500/40 hover:border-blue-500 text-gray-200 cursor-pointer'
                    : 'bg-gray-800 border-gray-700 text-gray-400 cursor-default'
              }`}
            >
              {der}
            </button>
          ))}
        </div>
      </div>

      {pregunta.pista && !enviado && (
        <button onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors">
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista'}
        </button>
      )}
      {showPista && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {pregunta.pista}
        </div>
      )}

      {!enviado && (
        <button
          onClick={enviar}
          disabled={Object.keys(relaciones).length !== pares.length}
          className="btn-primary text-sm w-full justify-center disabled:opacity-50"
        >
          Confirmar ({Object.keys(relaciones).length}/{pares.length} relacionados)
        </button>
      )}
    </div>
  )
}

// Identificar MVC: clasificar elementos en M, V o C
function PreguntaIdentificarMVC({ pregunta, onAnswer, answered }) {
  const elementos = pregunta.elementos || []
  const [clasificaciones, setClasificaciones] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [showPista, setShowPista] = useState(false)

  const asignar = (elId, letra) => {
    if (enviado) return
    setClasificaciones(prev => ({ ...prev, [elId]: letra }))
  }

  const enviar = () => {
    if (enviado || Object.keys(clasificaciones).length !== elementos.length) return
    setEnviado(true)
    const correcto = elementos.every(el => clasificaciones[el.id] === el.respuesta)
    onAnswer({
      isCorrect: correcto,
      pts: correcto ? pregunta.puntos : 0,
      respuesta: JSON.stringify(clasificaciones),
    })
  }

  const letraColor = { M: 'blue', V: 'yellow', C: 'green' }
  const letraLabel = { M: 'Modelo', V: 'Vista', C: 'Controlador' }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap text-xs">
        {['M', 'V', 'C'].map(l => (
          <span key={l} className={`badge badge-${letraColor[l] === 'green' ? 'green' : letraColor[l] === 'blue' ? 'blue' : 'yellow'}`}>
            {l} = {letraLabel[l]}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {elementos.map(el => {
          const clasi = clasificaciones[el.id]
          const esCorrecta = clasi === el.respuesta
          return (
            <div key={el.id}
              className={`p-3 rounded-lg border transition-all ${
                enviado
                  ? esCorrecta ? 'border-sena-green/50 bg-sena-green/5' : 'border-red-500/50 bg-red-500/5'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <p className="text-sm text-gray-200 mb-2">{el.texto}</p>
              <div className="flex gap-2">
                {['M', 'V', 'C'].map(l => (
                  <button
                    key={l}
                    onClick={() => asignar(el.id, l)}
                    disabled={enviado}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      clasi === l
                        ? l === 'M' ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : l === 'V' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-sena-green/20 border-sena-green text-sena-green'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {l}
                  </button>
                ))}
                {enviado && (
                  <span className={`ml-auto text-xs font-semibold ${esCorrecta ? 'text-sena-green' : 'text-red-400'}`}>
                    {esCorrecta ? '✓' : `✗ (${el.respuesta})`}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {pregunta.pista && !enviado && (
        <button onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors">
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista'}
        </button>
      )}
      {showPista && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {pregunta.pista}
        </div>
      )}
      {!enviado && (
        <button
          onClick={enviar}
          disabled={Object.keys(clasificaciones).length !== elementos.length}
          className="btn-primary text-sm w-full justify-center disabled:opacity-50"
        >
          Confirmar clasificaciones ({Object.keys(clasificaciones).length}/{elementos.length})
        </button>
      )}
    </div>
  )
}

// Pregunta con código (identificar error / salida / estructura)
function PreguntaConCodigo({ pregunta, onAnswer, answered }) {
  const [showPista, setShowPista] = useState(false)
  const elegida = answered?.respuesta

  const handleClick = (opcion) => {
    if (elegida) return
    const correcto = !!opcion.correcto || opcion.id === pregunta.respuestaCorrecta
    onAnswer({
      isCorrect: correcto,
      pts: correcto ? pregunta.puntos : 0,
      respuesta: opcion.id,
    })
  }

  const getEstado = (op) => {
    if (!elegida) return 'idle'
    const esCorrecta = !!op.correcto || op.id === pregunta.respuestaCorrecta
    if (op.id === elegida) return esCorrecta ? 'correct' : 'wrong'
    if (esCorrecta) return 'missed'
    return 'idle'
  }

  const estilos = {
    idle:    'bg-gray-800 border-gray-700 hover:border-sena-green hover:bg-gray-700 text-gray-200 cursor-pointer',
    correct: 'bg-sena-green/15 border-sena-green text-sena-green cursor-default',
    wrong:   'bg-red-500/15 border-red-500 text-red-400 cursor-default shake',
    missed:  'bg-sena-green/10 border-sena-green/40 text-gray-400 cursor-default',
  }

  return (
    <div className="space-y-3">
      {/* Bloque de código */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-300 whitespace-pre-wrap">{pregunta.codigo}</pre>
      </div>
      {/* Opciones */}
      <div className="space-y-2">
        {(pregunta.opciones || []).map(op => (
          <button
            key={op.id}
            onClick={() => handleClick(op)}
            disabled={!!elegida}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all font-medium ${estilos[getEstado(op)]}`}
          >
            {op.texto}
          </button>
        ))}
      </div>
      {pregunta.pista && !elegida && (
        <button onClick={() => setShowPista(v => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors">
          <HelpCircle size={13} /> {showPista ? 'Ocultar pista' : 'Ver pista'}
        </button>
      )}
      {showPista && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs">
          💡 {pregunta.pista}
        </div>
      )}
    </div>
  )
}

// ─── Componente principal GameEngine ─────────────────────────────────────────

export default function GameEngine({ item, index, total, onAnswer, onNext, answered, bonusActivo }) {

  const renderPregunta = () => {
    const tipo = item.tipo

    if (tipo === TIPOS.CONSTRUIR_PSEUDO || item.bloquesDisponibles) {
      return <PseudoBuilder key={item.id} reto={item} onAnswer={onAnswer} answered={answered} />
    }
    if ([TIPOS.IDENTIFICAR_ERROR, TIPOS.SALIDA_ALGORITMO, TIPOS.ESTRUCTURA_CORRECTA].includes(tipo) && item.codigo) {
      return <PreguntaConCodigo key={item.id} pregunta={item} onAnswer={onAnswer} answered={answered} />
    }
    if (tipo === TIPOS.ORDENAR || tipo === TIPOS.FLUJO_PETICION) {
      return <PreguntaOrdenar key={item.id} pregunta={item} onAnswer={onAnswer} answered={answered} />
    }
    if (tipo === TIPOS.RELACIONAR || tipo === TIPOS.IDENTIFICAR_SOLID) {
      return <PreguntaRelacionar key={item.id} pregunta={item} onAnswer={onAnswer} answered={answered} />
    }
    if (tipo === TIPOS.IDENTIFICAR_MVC) {
      return <PreguntaIdentificarMVC key={item.id} pregunta={item} onAnswer={onAnswer} answered={answered} />
    }
    if (item.opciones) {
      return <PreguntaSeleccion key={item.id} pregunta={item} onAnswer={onAnswer} answered={answered} bonusActivo={bonusActivo} />
    }
    return <p className="text-gray-500 text-sm">Tipo de pregunta no soportado aún.</p>
  }

  const progreso = Math.round((index / total) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progreso global */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
        <span>Pregunta {index + 1} de {total}</span>
        <span className="text-yellow-400">
          {answered
            ? answered.pts > 0
              ? `+${answered.pts} pts ✓`
              : answered.pts < 0
                ? `${answered.pts} pts ✗`
                : '0 pts ✗'
            : ''}
        </span>
      </div>
      <div className="progress-bar h-1.5 mb-5">
        <div className="progress-fill" style={{ width: `${progreso}%` }} />
      </div>

      {/* Tarjeta de pregunta */}
      <div key={item.id} className="card border-gray-700">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <NivelBadge nivel={item.nivel} />
          <Badge color="blue">{item.tema}</Badge>
          <Badge color="gray">{item.puntos} pts</Badge>
          {(item.tipo === TIPOS.CONSTRUIR_PSEUDO || item.bloquesDisponibles) && (
            <Badge color="yellow">🔧 Constructor</Badge>
          )}
        </div>

        {/* Enunciado */}
        <h2 className="text-white font-semibold leading-relaxed mb-5">
          {item.enunciado || item.titulo}
        </h2>

        {/* Descripción adicional para retos */}
        {item.descripcionProblema && (
          <p className="text-gray-400 text-sm mb-4 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
            {item.descripcionProblema}
          </p>
        )}

        {/* Pregunta según tipo */}
        {renderPregunta()}
      </div>

      {/* Feedback tras responder */}
      {answered && (
        <FeedbackBox
          isCorrect={answered.isCorrect}
          explicacion={item.explicacion}
          pista={item.pista}
          ptsObtenidos={answered.pts}
          preguntaBase={item.puntos}
          onNext={onNext}
          isLast={index + 1 >= total}
        />
      )}
    </div>
  )
}
