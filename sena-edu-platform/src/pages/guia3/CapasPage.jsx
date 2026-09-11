import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import DiagramBox from '../../components/ui/DiagramBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function CapasPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 3</span>
        <h1 className="text-2xl font-bold text-white mt-2">Arquitectura por capas (N-Capas)</h1>
        <p className="text-gray-400 mt-1">Organiza el sistema en niveles donde cada capa solo interactúa con la inmediatamente inferior.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="arquitectura-capas" title="¿Qué es la arquitectura por capas?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          La <strong className="text-white">arquitectura por capas</strong> divide el sistema en niveles bien definidos.
          Cada capa tiene una responsabilidad específica y solo puede comunicarse con la capa
          <em> inmediatamente inferior</em>. Esto garantiza bajo acoplamiento y alta cohesión.
        </p>

        <DiagramBox title="Arquitectura N-Capas">
{`
  ┌────────────────────────────────────────────────┐
  │         CAPA DE PRESENTACIÓN                   │  ← HTML, CSS, JS, React/Vue
  │   Interfaz de usuario (front-end)              │     Solo muestra datos
  └──────────────────────┬─────────────────────────┘
                         │  petición / respuesta
  ┌──────────────────────▼─────────────────────────┐
  │         CAPA DE LÓGICA DE NEGOCIO              │  ← Reglas, validaciones,
  │   (Lógica de Negocio / Capa de Servicios)      │     cálculos, flujos
  └──────────────────────┬─────────────────────────┘
                         │  consulta / resultado
  ┌──────────────────────▼─────────────────────────┐
  │         CAPA DE ACCESO A DATOS                 │  ← Repositorios, Mapeo ORM
  │   (Capa de Acceso a Datos / Repositorios)      │     SQL, consultas
  └──────────────────────┬─────────────────────────┘
                         │  SQL / NoSQL
  ┌──────────────────────▼─────────────────────────┐
  │         CAPA DE DATOS                          │  ← PostgreSQL, MySQL,
  │   (Base de datos)                              │     MongoDB, etc.
  └────────────────────────────────────────────────┘
`}
        </DiagramBox>

        <div className="grid sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'Presentación', color: 'border-blue-500/40 text-blue-400', desc: 'Recibe las acciones del usuario. Envía peticiones y muestra respuestas. No contiene lógica de negocio.', tech: 'HTML/CSS/JS, React, Vue, Angular' },
            { name: 'Lógica de negocio', color: 'border-sena-green/40 text-sena-green', desc: 'Aplica las reglas del dominio: validaciones, cálculos, flujos de trabajo.', tech: 'Python, Java, Node.js — Servicios' },
            { name: 'Acceso a datos', color: 'border-yellow-500/40 text-yellow-400', desc: 'Abstrae el acceso a la base de datos. Usa repositorios o mapeo objeto-relacional.', tech: 'SQLAlchemy, Hibernate, Sequelize' },
            { name: 'Datos', color: 'border-purple-500/40 text-purple-400', desc: 'Almacenamiento persistente. Solo la capa de acceso a datos puede hablar con ella.', tech: 'PostgreSQL, MySQL, MongoDB, Redis' },
          ].map(c => (
            <div key={c.name} className={`card border ${c.color.split(' ')[0]}`}>
              <p className={`font-bold text-sm mb-1 ${c.color.split(' ')[1]}`}>{c.name}</p>
              <p className="text-gray-400 text-xs mb-2">{c.desc}</p>
              <p className="text-xs text-gray-500 font-mono">{c.tech}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Ejemplo en Python</h3>
        <CodeBlock language="python" title="repository.py – Capa de acceso a datos" code={`# CAPA DE ACCESO A DATOS: solo consultas a la BD
class ProductoRepository:
    def __init__(self, db_connection):
        self.db = db_connection

    def obtener_todos(self):
        return self.db.execute("SELECT * FROM productos").fetchall()

    def obtener_por_id(self, id):
        return self.db.execute(
            "SELECT * FROM productos WHERE id = ?", (id,)
        ).fetchone()

    def guardar(self, producto):
        self.db.execute(
            "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
            (producto.nombre, producto.precio)
        )
        self.db.commit()`} />

        <CodeBlock language="python" title="service.py – Capa de lógica de negocio" code={`# CAPA DE LÓGICA DE NEGOCIO: reglas del dominio
class ProductoService:
    def __init__(self, repo: ProductoRepository):
        self.repo = repo          # depende de abstracción (DIP)

    def listar_productos(self):
        return self.repo.obtener_todos()

    def crear_producto(self, nombre, precio):
        # Regla de negocio: precio no puede ser negativo
        if precio <= 0:
            raise ValueError("El precio debe ser mayor a cero")
        if not nombre or len(nombre.strip()) < 2:
            raise ValueError("El nombre es demasiado corto")

        producto = Producto(nombre=nombre.strip(), precio=precio)
        self.repo.guardar(producto)
        return producto

    def aplicar_descuento(self, id, porcentaje):
        producto = self.repo.obtener_por_id(id)
        if not producto:
            raise ValueError("Producto no encontrado")
        if porcentaje < 0 or porcentaje > 100:
            raise ValueError("Porcentaje inválido")
        producto.precio *= (1 - porcentaje / 100)
        return producto`} />

        <CodeBlock language="python" title="controller.py – Capa de presentación (API)" code={`# CAPA DE PRESENTACIÓN: recibe HTTP, delega al servicio
@app.route('/api/productos', methods=['GET'])
def listar():
    # Solo delega al servicio, no contiene lógica de negocio
    productos = servicio.listar_productos()
    return jsonify([p.to_dict() for p in productos])

@app.route('/api/productos', methods=['POST'])
def crear():
    datos = request.json
    try:
        producto = servicio.crear_producto(
            datos['nombre'], datos['precio']
        )
        return jsonify(producto.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400`} />

        <InfoBox variant="success" title="Ventaja clave">
          Si necesitas cambiar de SQLite a PostgreSQL, solo modificas la <strong>capa de acceso a datos</strong>.
          La lógica de negocio y la presentación no se tocan. Eso es bajo acoplamiento.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia3/mvc" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia3/microservicios" className="btn-primary">Siguiente: Microservicios <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
