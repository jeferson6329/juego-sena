import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import DiagramBox from '../../components/ui/DiagramBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function MVCPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 2</span>
        <h1 className="text-2xl font-bold text-white mt-2">Patrón Modelo-Vista-Controlador (MVC)</h1>
        <p className="text-gray-400 mt-1">El patrón arquitectónico más usado en frameworks web. Separa responsabilidades en tres componentes.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="patron-mvc" title="¿Qué es el patrón MVC?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          El <strong className="text-white">MVC</strong> separa la aplicación en tres componentes con responsabilidades
          bien definidas: el <strong className="text-sena-green">Modelo</strong> gestiona los datos y la lógica de negocio,
          la <strong className="text-purple-400">Vista</strong> muestra la interfaz al usuario,
          y el <strong className="text-blue-400">Controlador</strong> coordina la comunicación entre ambos.
        </p>

        {/* Diagrama de flujo MVC */}
        <DiagramBox title="Flujo del patrón MVC">
{`
  Usuario
  (navegador)
      │
      │  1. Petición HTTP (GET /productos)
      ▼
  ┌─────────────────┐
  │   CONTROLADOR   │  ← Recibe la petición y coordina
  │  (routes/ctrl)  │
  └────────┬────────┘
           │  2. Solicita datos
           ▼
  ┌─────────────────┐
  │     MODELO      │  ← Lógica de negocio + acceso a BD
  │   (models/)     │
  └────────┬────────┘
           │  3. Devuelve datos
           ▼
  ┌─────────────────┐
  │  CONTROLADOR    │  4. Selecciona la vista correcta
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │     VISTA       │  ← Plantilla HTML con los datos
  │  (templates/)   │
  └────────┬────────┘
           │  5. Respuesta HTML al usuario
           ▼
      Usuario
`}
        </DiagramBox>

        {/* Tres componentes */}
        <div className="grid sm:grid-cols-3 gap-4 my-4">
          <div className="card border-sena-green/30">
            <p className="text-sena-green font-bold text-sm mb-2">🗃️ Modelo</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Gestiona los datos</li>
              <li>• Contiene la lógica de negocio</li>
              <li>• Se comunica con la base de datos</li>
              <li>• No conoce la Vista</li>
            </ul>
          </div>
          <div className="card border-purple-500/30">
            <p className="text-purple-400 font-bold text-sm mb-2">🖼️ Vista</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Presenta los datos al usuario</li>
              <li>• Solo contiene presentación</li>
              <li>• HTML + plantillas (Jinja2, EJS…)</li>
              <li>• No contiene lógica de negocio</li>
            </ul>
          </div>
          <div className="card border-blue-500/30">
            <p className="text-blue-400 font-bold text-sm mb-2">🎮 Controlador</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Recibe las peticiones HTTP</li>
              <li>• Invoca el Modelo</li>
              <li>• Selecciona la Vista</li>
              <li>• Es el intermediario</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Implementación MVC en Python/Flask</h3>
        <CodeBlock language="python" title="models/producto.py – Modelo" code={`# MODELO: gestiona datos y lógica de negocio
import sqlite3

class Producto:
    def __init__(self, id, nombre, precio):
        self.id     = id
        self.nombre = nombre
        self.precio = precio

    @staticmethod
    def obtener_todos():
        """Consulta todos los productos de la BD."""
        conn = sqlite3.connect('tienda.db')
        cursor = conn.cursor()
        cursor.execute("SELECT id, nombre, precio FROM productos")
        filas = cursor.fetchall()
        conn.close()
        return [Producto(*fila) for fila in filas]

    @staticmethod
    def buscar_por_id(id):
        conn = sqlite3.connect('tienda.db')
        cursor = conn.cursor()
        cursor.execute("SELECT id, nombre, precio FROM productos WHERE id=?", (id,))
        fila = cursor.fetchone()
        conn.close()
        return Producto(*fila) if fila else None`} />

        <CodeBlock language="python" title="controllers/producto_controller.py – Controlador" code={`# CONTROLADOR: recibe la petición, coordina modelo y vista
from flask import render_template, jsonify, request, abort
from models.producto import Producto

def listar_productos():
    """GET /productos – Devuelve la lista de productos."""
    productos = Producto.obtener_todos()          # ← llama al Modelo
    return render_template(                       # ← selecciona la Vista
        'productos/lista.html',
        productos=productos
    )

def detalle_producto(id):
    """GET /productos/<id> – Detalle de un producto."""
    producto = Producto.buscar_por_id(id)
    if not producto:
        abort(404)
    return render_template('productos/detalle.html', producto=producto)`} />

        <CodeBlock language="python" title="templates/productos/lista.html – Vista" code={`{# VISTA: solo presentación, recibe datos del controlador #}
<!DOCTYPE html>
<html lang="es">
<head><title>Productos</title></head>
<body>
  <h1>Catálogo de Productos</h1>
  <ul>
    {% for p in productos %}
      <li>
        <a href="/productos/{{ p.id }}">{{ p.nombre }}</a>
        — ${{ "%.0f"|format(p.precio) }}
      </li>
    {% endfor %}
  </ul>
</body>
</html>`} />

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Estructura de carpetas MVC</h3>
        <div className="code-block text-xs text-gray-300 leading-relaxed">
{`mi-app/
├── models/               ← MODELO: clases y lógica de negocio
│   ├── producto.py
│   └── usuario.py
├── controllers/          ← CONTROLADOR: manejo de rutas y peticiones
│   ├── producto_controller.py
│   └── usuario_controller.py
├── templates/            ← VISTA: plantillas HTML
│   ├── productos/
│   │   ├── lista.html
│   │   └── detalle.html
│   └── base.html
├── static/               ← CSS, imágenes, JS del front-end
└── app.py                ← Punto de entrada, registra rutas`}
        </div>

        <InfoBox variant="tip" title="MVC en frameworks modernos">
          Frameworks como <strong>Django</strong> (MTV), <strong>Laravel</strong>, <strong>Spring MVC</strong> y
          <strong> Ruby on Rails</strong> están basados en MVC. Dominar este patrón te permite aprender
          cualquiera de ellos mucho más rápido.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia3/intro" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia3/capas" className="btn-primary">Siguiente: Arquitectura por capas <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
