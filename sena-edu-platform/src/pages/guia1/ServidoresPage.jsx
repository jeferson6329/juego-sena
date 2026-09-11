import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const SERVERS = [
  { name: 'Node.js',  logo: '🟢', desc: 'Entorno de ejecución JavaScript del lado del servidor. Basado en eventos, ideal para APIs en tiempo real.', use: 'APIs, microservicios, apps en tiempo real' },
  { name: 'Apache',   logo: '🪶', desc: 'Servidor web de código abierto. El más usado históricamente. Soporta PHP nativamente.', use: 'Aplicaciones PHP, sitios estáticos' },
  { name: 'Nginx',    logo: '⚡', desc: 'Servidor web de alto rendimiento. Excelente como proxy inverso y balanceador de carga.', use: 'Proxy inverso, archivos estáticos, balanceador de carga' },
  { name: 'Tomcat',   logo: '☕', desc: 'Servidor de aplicaciones Java. Ejecuta servlets y JSP. Base de muchas apps empresariales.', use: 'Aplicaciones Java/Jakarta EE' },
  { name: 'IIS',      logo: '🪟', desc: 'Internet Information Services de Microsoft. Se integra con ASP.NET.', use: 'Aplicaciones .NET en entornos Windows' },
  { name: 'Gunicorn', logo: '🦄', desc: 'Servidor WSGI para Python. Usado junto con Nginx para desplegar Flask y Django.', use: 'Aplicaciones Python (Flask, Django)' },
]

export default function ServidoresPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 1 · Sección 3</span>
        <h1 className="text-2xl font-bold text-white mt-2">Servidores de aplicación</h1>
        <p className="text-gray-400 mt-1">Conoce los principales servidores web y cómo ejecutan la lógica del back-end.</p>
      </div>

      <SectionCard guideId="guia1" sectionId="servidores" title="¿Qué es un servidor de aplicaciones?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Un <strong className="text-white">servidor de aplicaciones</strong> es el software que recibe las
          peticiones HTTP de los clientes, ejecuta la lógica del back-end (tu código) y devuelve una respuesta.
          Es el "motor" que hace correr tu aplicación en producción.
        </p>

        <InfoBox variant="info" title="Diferencia: servidor web vs servidor de aplicaciones">
          Un <strong>servidor web</strong> (Nginx, Apache) sirve archivos estáticos (HTML, imágenes) y enruta peticiones.
          Un <strong>servidor de aplicaciones</strong> ejecuta código dinámico (Python, Java, Node.js).
          En producción se usan <em>juntos</em>: Nginx como proxy delante de Gunicorn/Node.js.
        </InfoBox>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Servidores más usados</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {SERVERS.map(s => (
            <div key={s.name} className="card border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{s.logo}</span>
                <p className="text-white font-semibold">{s.name}</p>
              </div>
              <p className="text-gray-400 text-xs mb-2">{s.desc}</p>
              <p className="text-xs text-sena-green">✓ Ideal para: {s.use}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Arquitectura típica en producción</h3>
        <div className="code-block text-xs leading-relaxed text-gray-300">
          {`
  Internet
     │
     ▼
  [ Nginx ]  ← proxy inverso, SSL/TLS, archivos estáticos
     │
     ▼
  [ Gunicorn / PM2 / Tomcat ]  ← ejecuta tu código
     │
     ▼
  [ Tu aplicación: Flask / Express / Spring ]
     │
     ▼
  [ Base de datos: PostgreSQL / MySQL / MongoDB ]
          `}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Ejemplo: levantar un servidor con Node.js</h3>
        <CodeBlock language="js" title="server.js" code={`const http = require('http')

// Crea el servidor
const server = http.createServer((req, res) => {
  // Cabeceras de la respuesta
  res.writeHead(200, { 'Content-Type': 'application/json' })

  // Cuerpo de la respuesta
  res.end(JSON.stringify({
    mensaje: '¡Servidor funcionando!',
    ruta: req.url,
    metodo: req.method,
    hora: new Date().toISOString(),
  }))
})

// Escucha en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000')
})`} />

        <h3 className="text-lg font-semibold text-white mt-4 mb-3">Con Express (más productivo)</h3>
        <CodeBlock language="js" title="app.js (Express)" code={`const express = require('express')
const app = express()

// Middleware para parsear JSON automáticamente
app.use(express.json())

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ saludo: '¡Hola desde Express!' })
})

// Middleware de error global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(3000, () => console.log('Express en puerto 3000'))`} />

        <CodeBlock language="python" title="app.py (Flask)" code={`from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def inicio():
    return jsonify({'saludo': '¡Hola desde Flask!'})

@app.route('/api/estado')
def estado():
    return jsonify({'estado': 'OK', 'version': '1.0'})

if __name__ == '__main__':
    # debug=True solo para desarrollo, NUNCA en producción
    app.run(host='0.0.0.0', port=5000, debug=True)`} />

        <InfoBox variant="tip" title="Consejo práctico">
          Para desarrollo local usa el servidor integrado de tu framework (Flask, Express, Django).
          Para producción, ponlo detrás de Nginx y usa un proceso manager como <strong>PM2</strong> (Node)
          o <strong>Gunicorn + Supervisor</strong> (Python).
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia1/http" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia1/lenguajes" className="btn-primary">Siguiente: Lenguajes web <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
