import { useState, useRef, useCallback } from 'react'
import { Play, RotateCcw, Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react'

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
    h1 { color: #39A900; }
    button {
      background: #39A900; color: white;
      border: none; padding: 8px 16px;
      border-radius: 6px; cursor: pointer;
    }
    button:hover { background: #1e6b00; }
    #resultado { margin-top: 16px; padding: 12px;
      background: white; border-radius: 8px;
      border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>¡Hola desde el Editor SENA!</h1>
  <p>Edita este código y haz clic en <strong>Ejecutar</strong>.</p>
  <button onclick="saludar()">Saludar</button>
  <div id="resultado"></div>

  <script>
    function saludar() {
      const hora = new Date().toLocaleTimeString('es-CO')
      document.getElementById('resultado').innerHTML =
        '<b>¡Hola Aprendiz SENA!</b><br>Hora actual: ' + hora
    }
  </script>
</body>
</html>`

const EXAMPLES = [
  {
    label: 'Calculadora',
    code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: sans-serif; display:flex; justify-content:center; padding:20px; background:#1a1a2e; }
    .calc { background:#16213e; border-radius:12px; padding:20px; width:260px; }
    input { width:100%; background:#0f3460; color:#e94560; font-size:1.5rem;
            text-align:right; border:none; padding:10px; border-radius:8px; margin-bottom:12px; }
    .btns { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
    button { padding:14px; border:none; border-radius:8px; font-size:1rem; cursor:pointer; }
    .op { background:#e94560; color:white; }
    .num { background:#0f3460; color:white; }
    .eq  { background:#39A900; color:white; }
    .clr { background:#533483; color:white; }
  </style>
</head>
<body>
<div class="calc">
  <input id="display" value="0" readonly/>
  <div class="btns">
    <button class="clr" onclick="limpiar()">C</button>
    <button class="op"  onclick="op('%')">%</button>
    <button class="op"  onclick="op('/')">÷</button>
    <button class="op"  onclick="op('*')">×</button>
    <button class="num" onclick="num('7')">7</button>
    <button class="num" onclick="num('8')">8</button>
    <button class="num" onclick="num('9')">9</button>
    <button class="op"  onclick="op('-')">−</button>
    <button class="num" onclick="num('4')">4</button>
    <button class="num" onclick="num('5')">5</button>
    <button class="num" onclick="num('6')">6</button>
    <button class="op"  onclick="op('+')">+</button>
    <button class="num" onclick="num('1')">1</button>
    <button class="num" onclick="num('2')">2</button>
    <button class="num" onclick="num('3')">3</button>
    <button class="eq" style="grid-row:span 2" onclick="igual()">=</button>
    <button class="num" style="grid-column:span 2" onclick="num('0')">0</button>
    <button class="num" onclick="num('.')">.</button>
  </div>
</div>
<script>
  let expr = ''
  const d = () => document.getElementById('display')
  function num(v){ expr += v; d().value = expr }
  function op(v) { expr += v; d().value = expr }
  function igual(){ try{ d().value = eval(expr); expr = String(eval(expr)) }catch(e){ d().value='Error'; expr='' } }
  function limpiar(){ expr=''; d().value='0' }
</script>
</body>
</html>`
  },
  {
    label: 'Algoritmo burbuja',
    code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #0d1117; color: #c9d1d9; }
    h2 { color: #39A900; }
    .barra-container { display:flex; align-items:flex-end; gap:4px; height:200px; margin:20px 0; }
    .barra { background:#39A900; border-radius:4px 4px 0 0; transition: height 0.3s, background 0.3s; min-width:28px; display:flex; align-items:flex-end; justify-content:center; color:white; font-size:10px; padding-bottom:2px; }
    .comparando { background:#e94560 !important; }
    button { background:#39A900; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; margin-right:8px; }
    #info { color:#8b949e; font-size:14px; margin-top:8px; }
  </style>
</head>
<body>
  <h2>🫧 Ordenamiento Burbuja – Visualización</h2>
  <div class="barra-container" id="barras"></div>
  <div id="info">Haz clic en Ordenar para comenzar</div>
  <button onclick="nuevo()">🔀 Nuevo arreglo</button>
  <button onclick="ordenar()">▶ Ordenar</button>
<script>
  let arr = [], sorting = false
  function nuevo() {
    if(sorting) return
    arr = Array.from({length:10},()=>Math.floor(Math.random()*90)+10)
    renderizar()
    document.getElementById('info').textContent = 'Arreglo: [' + arr.join(', ') + ']'
  }
  function renderizar(comp=[]) {
    const c = document.getElementById('barras')
    c.innerHTML = arr.map((v,i)=>
      \`<div class="barra \${comp.includes(i)?'comparando':''}" style="height:\${v*1.8}px;flex:1">\${v}</div>\`
    ).join('')
  }
  async function ordenar() {
    if(sorting) return; sorting=true
    let n=arr.length, intercambio
    for(let i=0;i<n-1;i++){
      intercambio=false
      for(let j=0;j<n-1-i;j++){
        renderizar([j,j+1])
        document.getElementById('info').textContent=\`Comparando \${arr[j]} y \${arr[j+1]}\`
        await sleep(300)
        if(arr[j]>arr[j+1]){ [arr[j],arr[j+1]]=[arr[j+1],arr[j]]; intercambio=true }
      }
      if(!intercambio) break
    }
    renderizar()
    document.getElementById('info').textContent='✅ Ordenado: [' + arr.join(', ') + ']'
    sorting=false
  }
  const sleep = ms => new Promise(r=>setTimeout(r,ms))
  nuevo()
</script>
</body>
</html>`
  },
  {
    label: 'Patrón MVC',
    code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    body{font-family:sans-serif;padding:20px;background:#0d1117;color:#c9d1d9}
    h2{color:#39A900}
    .mvc{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:16px 0}
    .box{padding:16px;border-radius:10px;border:1px solid}
    .model{background:#0f3460;border-color:#4a9eff}
    .view{background:#1a0a2e;border-color:#a855f7}
    .ctrl{background:#0a2e1a;border-color:#39A900}
    .label{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
    .label.m{color:#4a9eff}.label.v{color:#a855f7}.label.c{color:#39A900}
    input{background:#1c1c1c;border:1px solid #333;color:white;padding:8px;border-radius:6px;width:100%}
    button{background:#39A900;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-top:8px}
    #lista{list-style:none;padding:0}
    #lista li{padding:6px 10px;background:#1c1c1c;border-radius:6px;margin-top:6px;display:flex;justify-content:space-between}
    .del{cursor:pointer;color:#e94560}
  </style>
</head>
<body>
  <h2>Patrón MVC – Lista de tareas</h2>
  <div class="mvc">
    <div class="box model"><div class="label m">Modelo</div><small>Datos: arreglo de tareas</small><br><code id="modelo-data" style="font-size:10px;color:#4a9eff"></code></div>
    <div class="box ctrl"><div class="label c">Controlador</div><input id="input" placeholder="Nueva tarea…"/><br><button onclick="agregar()">Agregar</button></div>
    <div class="box view"><div class="label v">Vista</div><ul id="lista"></ul></div>
  </div>
<script>
  // MODELO: gestiona los datos
  const Modelo = {
    tareas: [],
    agregar(texto){ this.tareas.push({id:Date.now(), texto}) },
    eliminar(id){ this.tareas = this.tareas.filter(t=>t.id!==id) }
  }
  // VISTA: renderiza la UI
  const Vista = {
    render(tareas){
      document.getElementById('lista').innerHTML =
        tareas.map(t=>\`<li>\${t.texto}<span class="del" onclick="eliminar(\${t.id})">✕</span></li>\`).join('')
      document.getElementById('modelo-data').textContent =
        JSON.stringify(tareas.map(t=>t.texto), null, 1)
    }
  }
  // CONTROLADOR: coordina modelo y vista
  function agregar(){
    const input = document.getElementById('input')
    if(!input.value.trim()) return
    Modelo.agregar(input.value.trim())
    Vista.render(Modelo.tareas)
    input.value = ''
  }
  function eliminar(id){
    Modelo.eliminar(id)
    Vista.render(Modelo.tareas)
  }
  Vista.render([])
</script>
</body>
</html>`
  },
]

export default function PlaygroundEditor() {
  const [code, setCode]       = useState(DEFAULT_HTML)
  const [preview, setPreview] = useState(DEFAULT_HTML)
  const [copied, setCopied]   = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const textareaRef = useRef(null)

  const run = useCallback(() => setPreview(code), [code])

  const reset = () => { setCode(DEFAULT_HTML); setPreview(DEFAULT_HTML) }

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([code], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'codigo-sena.html'
    a.click()
  }

  const handleTab = (e) => {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const ta = textareaRef.current
    const s = ta.selectionStart, en = ta.selectionEnd
    const newCode = code.substring(0, s) + '  ' + code.substring(en)
    setCode(newCode)
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2 })
  }

  return (
    <div className={`flex flex-col gap-3 ${fullscreen ? 'fixed inset-0 z-50 bg-gray-950 p-4' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => { setCode(ex.code); setPreview(ex.code) }}
              className="badge bg-gray-800 text-gray-300 border border-gray-700 hover:border-sena-green hover:text-sena-green cursor-pointer transition-colors text-xs px-2.5 py-1"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copy}     className="btn-ghost text-xs py-1.5 px-2.5">
            {copied ? <><Check size={13} className="text-sena-green" /> Copiado</> : <><Copy size={13} /> Copiar</>}
          </button>
          <button onClick={download} className="btn-ghost text-xs py-1.5 px-2.5"><Download size={13} /> Guardar</button>
          <button onClick={reset}    className="btn-ghost text-xs py-1.5 px-2.5"><RotateCcw size={13} /> Reiniciar</button>
          <button onClick={() => setFullscreen(v => !v)} className="btn-ghost text-xs py-1.5 px-2.5">
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button onClick={run} className="btn-primary text-xs py-1.5 px-3">
            <Play size={13} /> Ejecutar
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="grid md:grid-cols-2 gap-3" style={{ height: fullscreen ? 'calc(100vh - 100px)' : '520px' }}>
        {/* Editor */}
        <div className="flex flex-col rounded-xl overflow-hidden border border-gray-700">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-sena-green/70" />
            <span className="ml-1 text-xs text-gray-400 font-mono">index.html</span>
            <span className="ml-auto badge-blue text-xs">HTML · CSS · JS</span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleTab}
            spellCheck={false}
            className="flex-1 bg-gray-950 text-gray-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col rounded-xl overflow-hidden border border-gray-700">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
            <span className="w-2 h-2 rounded-full bg-sena-green" />
            <span className="text-xs text-gray-400">Vista previa en vivo</span>
            <span className="ml-auto text-xs text-sena-green">● En vivo</span>
          </div>
          <iframe
            title="preview"
            srcDoc={preview}
            sandbox="allow-scripts allow-forms allow-same-origin"
            className="flex-1 bg-white w-full"
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Tab = 2 espacios · La vista previa se actualiza al hacer clic en <strong className="text-gray-500">Ejecutar</strong>
      </p>
    </div>
  )
}
