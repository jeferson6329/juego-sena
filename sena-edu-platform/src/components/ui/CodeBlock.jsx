import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

/**
 * Bloque de código con syntax highlighting manual (sin dependencias pesadas).
 * Soporta resaltado por palabras clave de JS, Python y Java.
 */
export default function CodeBlock({ code = '', language = 'js', title = '' }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 my-4">
      {/* Titlebar estilo editor */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-sena-green/70" />
          {title && <span className="ml-2 text-xs text-gray-400 font-mono">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-blue">{language}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check size={13} className="text-sena-green" /> : <Copy size={13} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Código */}
      <pre className="bg-gray-950 p-4 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${language} text-gray-300 font-mono`}>
          {highlight(code, language)}
        </code>
      </pre>
    </div>
  )
}

// ── Resaltado mínimo sin dependencias ─────────────────────────────────────────
function highlight(code, lang) {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const colors = {
    keyword:  'text-purple-400',
    string:   'text-yellow-300',
    comment:  'text-gray-500 italic',
    number:   'text-cyan-400',
    fn:       'text-blue-400',
    decorator:'text-sena-green',
  }

  const keywords = {
    js:     ['const','let','var','function','return','if','else','for','while','class','import','export','default','async','await','new','this','true','false','null','undefined','typeof','=>'],
    python: ['def','return','if','elif','else','for','while','class','import','from','True','False','None','and','or','not','in','is','lambda','with','as','try','except','pass','self'],
    java:   ['public','private','protected','class','interface','void','return','if','else','for','while','new','static','final','import','extends','implements','boolean','int','String','true','false','null'],
  }

  const kws = keywords[lang] || keywords['js']
  let result = escaped

  // Comments
  result = result.replace(/(\/\/[^\n]*|#[^\n]*)/g, `<span class="${colors.comment}">$1</span>`)
  // Strings
  result = result.replace(/(["'`][^"'`\n]*["'`])/g, `<span class="${colors.string}">$1</span>`)
  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, `<span class="${colors.number}">$1</span>`)
  // Decorators (@app.route)
  result = result.replace(/(@\w+)/g, `<span class="${colors.decorator}">$1</span>`)
  // Keywords
  kws.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g')
    result = result.replace(re, `<span class="${colors.keyword}">$1</span>`)
  })

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}
