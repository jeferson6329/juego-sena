import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import DiagramBox from '../../components/ui/DiagramBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function MicroserviciosPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 4</span>
        <h1 className="text-2xl font-bold text-white mt-2">Arquitectura de Microservicios</h1>
        <p className="text-gray-400 mt-1">Divide la aplicación en servicios pequeños, independientes y desplegables por separado.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="microservicios" title="¿Qué son los microservicios?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          En la arquitectura de <strong className="text-white">microservicios</strong>, la aplicación se divide en
          servicios pequeños e independientes (usuarios, productos, pedidos, pagos…), cada uno con su propia
          base de datos, comunicados a través de una <strong className="text-sena-green">API Gateway</strong>.
          Cada servicio puede desarrollarse, desplegarse y escalarse de forma independiente.
        </p>

        <DiagramBox title="Arquitectura de microservicios">
{`
  Cliente (web / móvil)
         │
         ▼
  ┌─────────────────┐
  │   API GATEWAY   │  ← Punto único de entrada
  │  (enrutamiento) │    Autenticación, rate limiting
  └────────┬────────┘
           │
    ┌──────┼──────────────┐
    │      │              │
    ▼      ▼              ▼
┌───────┐ ┌──────────┐ ┌──────────┐
│USERS  │ │PRODUCTS  │ │ ORDERS   │
│service│ │ service  │ │ service  │
└───┬───┘ └────┬─────┘ └────┬─────┘
    │          │             │
  ┌─┴─┐      ┌─┴─┐        ┌─┴─┐
  │BD │      │BD │        │BD │   ← Cada servicio
  │propia│   │propia│     │propia│   tiene su propia BD
  └───┘      └───┘        └───┘
`}
        </DiagramBox>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Monolito vs. Microservicios</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2.5 text-left text-gray-400">Aspecto</th>
                <th className="px-4 py-2.5 text-left text-yellow-400">Monolito</th>
                <th className="px-4 py-2.5 text-left text-sena-green">Microservicios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                ['Despliegue','Una sola unidad desplegable','Cada servicio se despliega por separado'],
                ['Escalabilidad','Escala todo o nada','Escala solo el servicio que lo necesita'],
                ['Complejidad inicial','Baja','Alta'],
                ['Complejidad con el tiempo','Crece rápido','Manejable si bien diseñado'],
                ['Tecnología','Una sola tecnología','Cada servicio puede usar su propio conjunto de tecnologías'],
                ['Fallos','Un fallo puede tumbar todo','Fallos aislados por servicio'],
                ['Ideal para','Proyectos pequeños/medianos','Proyectos grandes, equipos distribuidos'],
              ].map(([a, m, ms]) => (
                <tr key={a} className="bg-gray-900/50">
                  <td className="px-4 py-2.5 text-white font-medium">{a}</td>
                  <td className="px-4 py-2.5 text-gray-400">{m}</td>
                  <td className="px-4 py-2.5 text-gray-400">{ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Ejemplo: Servicio de Productos (Node.js)</h3>
        <CodeBlock language="js" title="products-service/index.js" code={`// Microservicio independiente de Productos
const express = require('express')
const app = express()
app.use(express.json())

// Base de datos PROPIA del servicio
const db = require('./database')   // PostgreSQL solo para productos

// GET /products
app.get('/products', async (req, res) => {
  const products = await db.query('SELECT * FROM products')
  res.json(products.rows)
})

// GET /products/:id
app.get('/products/:id', async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM products WHERE id = $1', [req.params.id]
  )
  if (!rows[0]) return res.status(404).json({ error: 'No encontrado' })
  res.json(rows[0])
})

// POST /products
app.post('/products', async (req, res) => {
  const { nombre, precio } = req.body
  const { rows } = await db.query(
    'INSERT INTO products (nombre, precio) VALUES ($1, $2) RETURNING *',
    [nombre, precio]
  )
  res.status(201).json(rows[0])
})

// Este servicio corre en su propio puerto
app.listen(3002, () => console.log('Products service en :3002'))`} />

        <CodeBlock language="js" title="api-gateway/index.js – API Gateway" code={`// API Gateway: enruta peticiones a los microservicios correctos
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// Rutas → Servicios
app.use('/api/users',    createProxyMiddleware({ target: 'http://users-service:3001' }))
app.use('/api/products', createProxyMiddleware({ target: 'http://products-service:3002' }))
app.use('/api/orders',   createProxyMiddleware({ target: 'http://orders-service:3003' }))
app.use('/api/payments', createProxyMiddleware({ target: 'http://payments-service:3004' }))

// Middleware de autenticación (se aplica a todos los servicios)
app.use((req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: 'Token requerido' })
  // Valida token...
  next()
})

app.listen(80, () => console.log('API Gateway en :80'))`} />

        <InfoBox variant="tip" title="¿Cuándo usar microservicios?">
          Los microservicios agregan complejidad operativa (más servicios que gestionar, monitorear y desplegar).
          Para un proyecto formativo o una aplicación pequeña, <strong>un monolito bien arquitecturado es suficiente</strong>.
          Usa microservicios cuando el equipo sea grande, el sistema sea complejo o necesites escalar
          partes específicas de la aplicación.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia3/capas" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia3/solid" className="btn-primary">Siguiente: Principios SOLID <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
