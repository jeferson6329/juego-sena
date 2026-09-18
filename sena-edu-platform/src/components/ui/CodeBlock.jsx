import { useState, useRef, useCallback, useEffect } from 'react'
import { Copy, Check, Play, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

// ─── Resaltado de sintaxis (sin dependencias externas) ────────────────────────
// Usa tokenización secuencial para evitar que los spans del HTML rompan el output
function tokenize(code, lang) {
  const tokens = []
  let rest = code

  // Palabras clave por lenguaje
  const kwMap = {
    js:     /^(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await|new|this|true|false|null|undefined|typeof|=>)\b/,
    python: /^(def|return|if|elif|else|for|while|class|import|from|True|False|None|and|or|not|in|is|lambda|with|as|try|except|pass|self)\b/,
    java:   /^(public|private|protected|class|interface|void|return|if|else|for|while|new|static|final|import|extends|implements|boolean|int|String|true|false|null)\b/,
  }
  const kw = kwMap[lang] || kwMap['js']

  while (rest.length > 0) {
    // Comentario de línea (// o #)
    const commentMatch = rest.match(/^(\/\/[^\n]*|#[^\n]*)/)
    if (commentMatch) {
      tokens.push({ type: 'comment', value: commentMatch[1] })
      rest = rest.slice(commentMatch[1].length)
      continue
    }
    // String (comillas simples, dobles o backtick)
    const strMatch = rest.match(/^(["'`])((?:[^"'`\\]|\\.)*)(\1)/)
    if (strMatch) {
      tokens.push({ type: 'string', value: strMatch[0] })
      rest = rest.slice(strMatch[0].length)
      continue
    }
    // Número
    const numMatch = rest.match(/^(\d+\.?\d*)/)
    if (numMatch) {
      tokens.push({ type: 'number', value: numMatch[1] })
      rest = rest.slice(numMatch[1].length)
      continue
    }
    // Decorador (@algo)
    const decMatch = rest.match(/^(@\w+)/)
    if (decMatch) {
      tokens.push({ type: 'decorator', value: decMatch[1] })
      rest = rest.slice(decMatch[1].length)
      continue
    }
    // Palabra clave
    const kwMatch = rest.match(kw)
    if (kwMatch) {
      tokens.push({ type: 'keyword', value: kwMatch[1] })
      rest = rest.slice(kwMatch[1].length)
      continue
    }
    // Cualquier otro carácter
    tokens.push({ type: 'plain', value: rest[0] })
    rest = rest.slice(1)
  }
  return tokens
}

const TOKEN_COLORS = {
  keyword:   'text-purple-400',
  string:    'text-yellow-300',
  comment:   'text-gray-500 italic',
  number:    'text-cyan-400',
  decorator: 'text-sena-green',
  plain:     '',
}

function HighlightedCode({ code, lang }) {
  const tokens = tokenize(code, lang)
  return (
    <>
      {tokens.map((t, i) => (
        t.type === 'plain'
          ? <span key={i}>{t.value}</span>
          : <span key={i} className={TOKEN_COLORS[t.type]}>{t.value}</span>
      ))}
    </>
  )
}

// ─── Output de ejecución en iframe (solo JS/HTML) ─────────────────────────────
function buildRunnable(code, lang) {
  if (lang === 'python' || lang === 'java') {
    // Para Python/Java mostramos un mensaje amigable
    return `<!DOCTYPE html><html><body style="background:#030712;color:#9ca3af;font-family:monospace;padding:16px;font-size:13px;">
<p style="color:#f59e0b;">⚠️ La ejecución en vivo está disponible solo para JavaScript.</p>
<p style="color:#6b7280;margin-top:8px;">Python y Java requieren un entorno en el servidor.<br>Copia el código y ejecútalo en tu editor local.</p>
</body></html>`
  }
  // JS — envuelto en HTML con captura de console.log
  return `<!DOCTYPE html>
<html>
<head><style>
  body { background: #030712; color: #d1d5db; font-family: monospace; font-size: 13px; padding: 16px; margin: 0; }
  .out { color: #4ade80; }
  .err { color: #f87171; }
  .log-line { margin: 2px 0; line-height: 1.5; }
</style></head>
<body>
<div id="output"></div>
<script>
  const out = document.getElementById('output');
  const addLine = (text, cls) => {
    const d = document.createElement('div');
    d.className = 'log-line ' + cls;
    d.textContent = text;
    out.appendChild(d);
  };
  const _log = console.log;
  console.log = (...args) => {
    addLine(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '), 'out');
  };
  window.onerror = (msg, src, line) => { addLine('Error: ' + msg, 'err'); };
  try {
    ${code}
  } catch(e) {
    addLine('Error: ' + e.message, 'err');
  }
<\/script>
</body></html>`
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CodeBlock({ code: initialCode = '', language = 'js', title = '' }) {
  const [code,      setCode]      = useState(initialCode)
  const [output,    setOutput]    = useState('')
  const [ran,       setRan]       = useState(false)
  const [copied,    setCopied]    = useState(false)
  const [expanded,  setExpanded]  = useState(false)
  const textareaRef = useRef(null)

  // Sincronizar altura del textarea
  const syncHeight = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px'
  }, [])

  useEffect(() => { syncHeight() }, [code, syncHeight])

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const run = () => {
    setOutput(buildRunnable(code, language))
    setRan(true)
  }

  const reset = () => {
    setCode(initialCode)
    setOutput('')
    setRan(false)
    setTimeout(syncHeight, 10)
  }

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current
      const start = ta.selectionStart
      const end   = ta.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2 }, 0)
    }
  }

  const isJS = language === 'js' || language === 'javascript'

  const editorBlock = (
    <div className={`rounded-xl overflow-hidden border border-gray-800 my-4 ${expanded ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/90 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-sena-green/70" />
          {title && <span className="ml-2 text-xs text-gray-400 font-mono">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-blue text-xs">{language}</span>
          <button onClick={run}
            className="flex items-center gap-1 text-xs text-sena-green hover:text-white bg-sena-green/10 hover:bg-sena-green/20 border border-sena-green/30 px-2 py-0.5 rounded transition-all"
          >
            <Play size={11} /> Ejecutar
          </button>
          {code !== initialCode && (
            <button onClick={reset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              title="Restablecer código original"
            >
              <RotateCcw size={11} />
            </button>
          )}
          <button onClick={copy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check size={12} className="text-sena-green" /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <button onClick={() => setExpanded(v => !v)}
            className="text-gray-500 hover:text-white transition-colors"
            title={expanded ? 'Reducir' : 'Expandir'}
          >
            {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Editor + output */}
      <div className={`flex flex-col ${ran ? 'sm:flex-row' : ''} ${expanded ? 'flex-1 overflow-hidden' : ''}`}>
        {/* Área de edición */}
        <div className={`relative bg-gray-950 ${ran ? 'sm:w-1/2 border-b sm:border-b-0 sm:border-r border-gray-800' : 'w-full'} ${expanded ? 'flex-1 overflow-auto' : ''}`}>
          {/* Highlight superpuesto (solo visual) */}
          <pre
            aria-hidden
            className="absolute inset-0 p-4 text-sm leading-relaxed font-mono text-gray-300 pointer-events-none overflow-hidden whitespace-pre"
          >
            <HighlightedCode code={code} lang={language} />
          </pre>
          {/* Textarea transparente encima */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => { setCode(e.target.value); syncHeight() }}
            onKeyDown={handleTab}
            spellCheck={false}
            className="relative w-full p-4 text-sm leading-relaxed font-mono bg-transparent text-transparent caret-white resize-none outline-none min-h-[80px]"
            style={{ caretColor: 'white' }}
          />
        </div>

        {/* Output en tiempo real */}
        {ran && (
          <div className={`bg-gray-900 ${ran ? 'sm:w-1/2' : 'w-full'} ${expanded ? 'flex-1 overflow-hidden' : ''}`}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800">
              <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Resultado</span>
              <button
                onClick={run}
                className="text-[10px] text-sena-green hover:text-white transition-colors flex items-center gap-1"
              >
                <Play size={9} /> Actualizar
              </button>
            </div>
            <iframe
              srcDoc={output}
              sandbox="allow-scripts"
              title="output"
              className={`w-full border-0 ${expanded ? 'h-full' : 'h-48'}`}
            />
          </div>
        )}
      </div>

      {/* Nota para Python/Java */}
      {!isJS && (
        <div className="px-4 py-1.5 bg-yellow-500/5 border-t border-yellow-500/10 flex items-center gap-1.5">
          <span className="text-yellow-500 text-[10px]">✏️ Editable — ejecuta JS en tiempo real · Para Python/Java copia y ejecuta en tu editor local</span>
        </div>
      )}
    </div>
  )

  if (expanded) {
    return (
      <>
        {/* Fondo oscuro */}
        <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setExpanded(false)} />
        {editorBlock}
      </>
    )
  }
  return editorBlock
}
