import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function PatronesPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 6</span>
        <h1 className="text-2xl font-bold text-white mt-2">Patrones de diseño</h1>
        <p className="text-gray-400 mt-1">Soluciones reutilizables y probadas para problemas frecuentes del diseño de software.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="patrones-diseno" title="¿Qué son los patrones de diseño?" points={20}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Los <strong className="text-white">patrones de diseño</strong> son soluciones reutilizables y probadas
          a problemas que se repiten con frecuencia en el desarrollo de software. No son código copiable
          directamente — son <em>plantillas conceptuales</em> que se adaptan a cada situación.
          Fueron popularizados por el libro <em className="text-gray-400">Patrones de Diseño (Gang of Four, 1994)</em>.
        </p>

        {/* Clasificación */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { name: 'Creacionales', emoji: '🏭', desc: 'Definen cómo se crean los objetos. Desacoplan la creación del uso.', examples: 'Singleton, Factory, Builder, Prototype' },
            { name: 'Estructurales', emoji: '🧱', desc: 'Organizan clases y objetos en estructuras más grandes.', examples: 'Adapter, Decorator, Facade, Composite' },
            { name: 'Comportamiento', emoji: '🔄', desc: 'Definen cómo los objetos se comunican e interactúan.', examples: 'Observer, Strategy, Command, Iterator' },
          ].map(c => (
            <div key={c.name} className="card border-gray-700">
              <p className="text-2xl mb-2">{c.emoji}</p>
              <p className="text-white font-bold mb-1">{c.name}</p>
              <p className="text-gray-400 text-xs mb-2">{c.desc}</p>
              <p className="text-xs text-sena-green font-mono">{c.examples}</p>
            </div>
          ))}
        </div>

        {/* Patrón 1: Singleton */}
        <h3 className="text-lg font-semibold text-white mt-4 mb-2">1. Singleton (Creacional)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Garantiza que una clase tenga <strong className="text-white">una sola instancia</strong> en toda la aplicación.
          Ideal para conexiones a base de datos, configuración global o registradores de eventos.
        </p>
        <CodeBlock language="python" title="singleton.py" code={`class DatabaseConnection:
    """
    Singleton: garantiza una sola conexión a la BD en toda la app.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Creando nueva conexión a la BD...")
            cls._instance = super().__new__(cls)
            cls._instance.connection = cls._instance._connect()
        return cls._instance

    def _connect(self):
        # En producción: psycopg2.connect(...) o similar
        return {"host": "localhost", "port": 5432, "status": "conectado"}

    def query(self, sql):
        print(f"Ejecutando: {sql}")


# Uso — ambas variables apuntan al mismo objeto
db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)   # → True (misma instancia)
db1.query("SELECT * FROM productos")`} />

        {/* Patrón 2: Factory */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2. Factory Method (Creacional)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Define una interfaz para crear objetos, pero permite a las subclases decidir qué tipo de objeto instanciar.
        </p>
        <CodeBlock language="python" title="factory.py" code={`from abc import ABC, abstractmethod

class Notificador(ABC):
    @abstractmethod
    def enviar(self, mensaje): pass

class EmailNotificador(Notificador):
    def enviar(self, msg): print(f"📧 Email: {msg}")

class SMSNotificador(Notificador):
    def enviar(self, msg): print(f"📱 SMS: {msg}")

class PushNotificador(Notificador):
    def enviar(self, msg): print(f"🔔 Push: {msg}")

# FACTORY: crea el objeto adecuado según el tipo
class NotificadorFactory:
    @staticmethod
    def crear(tipo: str) -> Notificador:
        opciones = {
            "email": EmailNotificador,
            "sms":   SMSNotificador,
            "push":  PushNotificador,
        }
        clase = opciones.get(tipo.lower())
        if not clase:
            raise ValueError(f"Tipo desconocido: {tipo}")
        return clase()

# Uso
notif = NotificadorFactory.crear("email")
notif.enviar("¡Tu pedido fue despachado!")`} />

        {/* Patrón 3: Observer */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3. Observer (Comportamiento)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Define una dependencia uno-a-muchos: cuando un objeto cambia de estado, notifica automáticamente
          a todos sus observadores. Base de los sistemas de eventos.
        </p>
        <CodeBlock language="python" title="observer.py" code={`class EventoProducto:
    """Sujeto: notifica a observadores cuando un producto cambia."""

    def __init__(self):
        self._observadores = []
        self.precio = 0

    def suscribir(self, observador):
        self._observadores.append(observador)

    def desuscribir(self, observador):
        self._observadores.remove(observador)

    def notificar(self, evento, datos):
        for obs in self._observadores:
            obs.actualizar(evento, datos)

    def cambiar_precio(self, nuevo_precio):
        self.precio = nuevo_precio
        self.notificar("precio_cambiado", {"precio": nuevo_precio})


class AlertaEmail:
    def actualizar(self, evento, datos):
        print(f"📧 Email: precio actualizado a ${datos['precio']}")

class AlertaStock:
    def actualizar(self, evento, datos):
        print(f"📦 Stock system: registrando cambio de precio {datos['precio']}")


# Uso
producto = EventoProducto()
producto.suscribir(AlertaEmail())
producto.suscribir(AlertaStock())

producto.cambiar_precio(49900)
# → 📧 Email: precio actualizado a $49900
# → 📦 Stock system: registrando cambio de precio 49900`} />

        {/* Patrón 4: Repository */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4. Repository (Estructural / Arquitectura)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Abstrae el acceso a datos detrás de una interfaz. La lógica de negocio no sabe si los datos
          vienen de SQL, MongoDB o un archivo. Muy usado en arquitectura por capas.
        </p>
        <CodeBlock language="python" title="repository.py" code={`from abc import ABC, abstractmethod

class IProductoRepository(ABC):
    @abstractmethod
    def buscar_todos(self): pass
    @abstractmethod
    def buscar_por_id(self, id): pass
    @abstractmethod
    def guardar(self, producto): pass
    @abstractmethod
    def eliminar(self, id): pass


class ProductoSQLRepository(IProductoRepository):
    """Implementación real con PostgreSQL."""
    def __init__(self, conn):
        self.conn = conn
    def buscar_todos(self):
        return self.conn.execute("SELECT * FROM productos").fetchall()
    def buscar_por_id(self, id):
        return self.conn.execute("SELECT * FROM productos WHERE id=?", (id,)).fetchone()
    def guardar(self, p):
        self.conn.execute("INSERT INTO productos VALUES (?,?)", (p.nombre, p.precio))
    def eliminar(self, id):
        self.conn.execute("DELETE FROM productos WHERE id=?", (id,))


class ProductoMemoriaRepository(IProductoRepository):
    """Implementación en memoria para tests."""
    def __init__(self):
        self._datos = {}
    def buscar_todos(self):   return list(self._datos.values())
    def buscar_por_id(self, id): return self._datos.get(id)
    def guardar(self, p):     self._datos[p.id] = p
    def eliminar(self, id):   del self._datos[id]

# La capa de negocio solo conoce la interfaz
class ProductoService:
    def __init__(self, repo: IProductoRepository):
        self.repo = repo   # inyección — puede ser SQL o memoria`} />

        <InfoBox variant="info" title="Referencia recomendada">
          El catálogo completo de patrones en español está en{' '}
          <a href="https://refactoring.guru/es/design-patterns" target="_blank" rel="noreferrer"
             className="text-sena-green underline">refactoring.guru/es/design-patterns</a>.
          Incluye diagramas UML, ejemplos en múltiples lenguajes y analogías del mundo real.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia3/solid" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia3/quiz" className="btn-primary">Cuestionario Guía 3 🧠 <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
