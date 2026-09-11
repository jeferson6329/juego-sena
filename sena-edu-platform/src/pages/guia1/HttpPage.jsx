import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import DiagramBox from '../../components/ui/DiagramBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const METHODS = [
  { method: 'GET',    color: 'text-green-400',  desc: 'Leer / obtener un recurso',          example: 'GET /api/productos' },
  { method: 'POST',   color: 'text-blue-400',   desc: 'Crear un nuevo recurso',             example: 'POST /api/productos' },
  { method: 'PUT',    color: 'text-yellow-400', desc: 'Reemplazar un recurso completo',     example: 'PUT /api/productos/1' },
  { method: 'PATCH',  color: 'text-orange-400', desc: 'Actualizar parcialmente un recurso', example: 'PATCH /api/productos/1' },
  { method: 'DELETE', color: 'text-red-400',    desc: 'Eliminar un recurso',                example: 'DELETE /api/productos/1' },
]

const STATUS = [
  { code: '200 OK',               color: 'text-green-400',  desc: 'Solicitud exitosa' },
  { code: '201 Created',          color: 'text-green-400',  desc: 'Recurso creado correctamente' },
  { code: '400 Bad Request',      color: 'text-yellow-400', desc: 'Error en la solicitud del cliente' },
  { code: '401 Unauthorized',     color: 'text-yellow-400', desc: 'No autenticado' },
  { code: '403 Forbidden',        color: 'text-orange-400', desc: 'Autenticado pero sin permisos' },
  { code: '404 Not Found',        color: 'text-orange-400', desc: 'Recurso no encontrado' },
  { code: '500 Internal Error',   color: 'text-red-400',    desc: 'Error en el servidor' },
]

export default function HttpPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 1 · Sección 2</span>
        <h1 className="text-2xl font-bold text-white mt-2">HTTP y protocolos web</h1>
        <p className="text-gray-400 mt-1">Aprende cómo se comunican el cliente y el servidor a través de la red.</p>
      </div>

      <SectionCard guideId="guia1" sectionId="http-protocolo" title="El protocolo HTTP/HTTPS" points={15}>

        <p className="text-gray-300 mb-4 leading-relaxed">
          <strong className="text-white">HTTP</strong> (HyperText Transfer Protocol) es el protocolo que define
          cómo viaja la información entre el navegador y el servidor. Cada vez que abres una página web,
          tu navegador envía una <em>petición HTTP</em> al servidor, y el servidor responde con los datos solicitados.
        </p>

        <DiagramBox title="Ciclo petición / respuesta HTTP">
          {`
  CLIENTE (navegador)                         SERVIDOR (back-end)
       │                                            │
       │  1. GET https://tienda.com/productos       │
       │ ─────────────────────────────────────────► │
       │                                            │  2. Procesa la petición
       │                                            │     Consulta la BD
       │  3. HTTP/1.1 200 OK                        │
       │     Content-Type: application/json         │
       │     [{"id":1,"nombre":"Camiseta"...}]      │
       │ ◄───────────────────────────────────────── │
       │                                            │
  `}
        </DiagramBox>

        <InfoBox variant="info" title="HTTP vs HTTPS">
          <strong>HTTP</strong> transmite los datos en texto plano — cualquiera en la red podría leerlos.
          <br /><strong>HTTPS</strong> cifra toda la comunicación con <strong>TLS/SSL</strong>,
          protegiendo contraseñas, datos bancarios y cualquier información sensible.
          En producción <strong>siempre</strong> debes usar HTTPS.
        </InfoBox>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Métodos HTTP (verbos)</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="px-4 py-2.5 text-gray-400 font-medium">Método</th>
                <th className="px-4 py-2.5 text-gray-400 font-medium">Uso</th>
                <th className="px-4 py-2.5 text-gray-400 font-medium">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {METHODS.map((m, i) => (
                <tr key={m.method} className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}>
                  <td className={`px-4 py-2.5 font-mono font-bold ${m.color}`}>{m.method}</td>
                  <td className="px-4 py-2.5 text-gray-300">{m.desc}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{m.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Códigos de estado HTTP</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {STATUS.map(s => (
            <div key={s.code} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className={`font-mono text-sm font-bold shrink-0 ${s.color}`}>{s.code}</span>
              <span className="text-gray-400 text-sm">{s.desc}</span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Estructura de una petición HTTP</h3>
        <CodeBlock language="js" title="Petición HTTP (raw)" code={`// Petición
GET /api/usuarios/42 HTTP/1.1
Host: api.miapp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Accept: application/json

// Respuesta
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache

{
  "id": 42,
  "nombre": "Ana García",
  "email": "ana@ejemplo.com"
}`} />

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">REST y APIs</h3>
        <p className="text-gray-300 mb-3 text-sm leading-relaxed">
          <strong className="text-white">REST</strong> (Representational State Transfer) es un estilo de arquitectura
          para diseñar APIs web. Define convenios para usar los métodos HTTP de forma predecible.
          Los datos generalmente viajan en formato <strong className="text-white">JSON</strong>.
        </p>
        <CodeBlock language="js" title="Ejemplo API REST – Node.js / Express" code={`const express = require('express')
const app = express()
app.use(express.json())

const productos = [
  { id: 1, nombre: 'Camiseta', precio: 25000 },
  { id: 2, nombre: 'Pantalón', precio: 55000 },
]

// GET  – Listar todos
app.get('/api/productos', (req, res) => {
  res.json(productos)
})

// GET  – Obtener uno por ID
app.get('/api/productos/:id', (req, res) => {
  const p = productos.find(p => p.id === +req.params.id)
  if (!p) return res.status(404).json({ error: 'No encontrado' })
  res.json(p)
})

// POST – Crear
app.post('/api/productos', (req, res) => {
  const nuevo = { id: Date.now(), ...req.body }
  productos.push(nuevo)
  res.status(201).json(nuevo)
})

app.listen(3000, () => console.log('API en http://localhost:3000'))`} />

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Otros protocolos clave</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'TCP/IP',     desc: 'Protocolo de transporte. Divide los datos en paquetes y los enruta por la red.' },
            { name: 'DNS',        desc: 'Traduce nombres de dominio (google.com) a direcciones IP numéricas.' },
            { name: 'WebSockets', desc: 'Comunicación bidireccional en tiempo real (chats, notificaciones live).' },
            { name: 'TLS/SSL',    desc: 'Cifra la comunicación HTTP → HTTPS. Usa certificados digitales.' },
          ].map(p => (
            <div key={p.name} className="card border-gray-700">
              <p className="text-white font-semibold text-sm mb-1">{p.name}</p>
              <p className="text-gray-400 text-xs">{p.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia1/intro" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia1/servidores" className="btn-primary">Siguiente: Servidores <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
