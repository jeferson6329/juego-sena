import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const PRINCIPIOS = [
  {
    letra: 'S', color: 'bg-blue-500', nombre: 'Responsabilidad Única',
    en: 'Single Responsibility Principle',
    def: 'Una clase debe tener una sola razón para cambiar (una única responsabilidad).',
    malo: `# ❌ MAL: una clase con múltiples responsabilidades
class Usuario:
    def __init__(self, nombre, email):
        self.nombre = nombre
        self.email  = email

    def guardar_en_bd(self):       # responsabilidad: persistencia
        db.execute("INSERT INTO usuarios VALUES (?)", [self.nombre])

    def enviar_bienvenida(self):   # responsabilidad: email
        smtp.send(self.email, "Bienvenido!")

    def generar_reporte(self):     # responsabilidad: reportes
        return f"Reporte de {self.nombre}"`,
    bueno: `# ✅ BIEN: cada clase con una sola responsabilidad
class Usuario:
    def __init__(self, nombre, email):
        self.nombre = nombre
        self.email  = email

class UsuarioRepository:           # solo persistencia
    def guardar(self, usuario):
        db.execute("INSERT INTO usuarios VALUES (?)", [usuario.nombre])

class EmailService:                 # solo emails
    def enviar_bienvenida(self, usuario):
        smtp.send(usuario.email, "Bienvenido!")

class ReporteService:               # solo reportes
    def generar(self, usuario):
        return f"Reporte de {usuario.nombre}"`,
  },
  {
    letra: 'O', color: 'bg-green-500', nombre: 'Abierto / Cerrado',
    en: 'Open/Closed Principle',
    def: 'Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación.',
    malo: `# ❌ MAL: modificar la clase para cada nuevo descuento
class CalculadorDescuento:
    def calcular(self, producto, tipo):
        if tipo == "navidad":
            return producto.precio * 0.8
        elif tipo == "verano":
            return producto.precio * 0.9
        # ← Hay que modificar esta clase cada vez que
        #   se añade un nuevo tipo de descuento`,
    bueno: `# ✅ BIEN: extender sin modificar
from abc import ABC, abstractmethod

class Descuento(ABC):
    @abstractmethod
    def aplicar(self, precio): pass

class DescuentoNavidad(Descuento):
    def aplicar(self, precio): return precio * 0.8

class DescuentoVerano(Descuento):
    def aplicar(self, precio): return precio * 0.9

class DescuentoBlackFriday(Descuento):   # ← nuevo sin tocar nada
    def aplicar(self, precio): return precio * 0.5

class CalculadorDescuento:
    def calcular(self, precio, descuento: Descuento):
        return descuento.aplicar(precio)`,
  },
  {
    letra: 'L', color: 'bg-yellow-500', nombre: 'Sustitución de Liskov',
    en: 'Liskov Substitution Principle',
    def: 'Un objeto de una subclase debe poder reemplazar a su superclase sin romper el programa.',
    malo: `# ❌ MAL: subclase que rompe el contrato
class Rectangulo:
    def set_ancho(self, v): self.ancho = v
    def set_alto(self, v):  self.alto  = v
    def area(self): return self.ancho * self.alto

class Cuadrado(Rectangulo):
    # ❌ rompe LSP: cambiar el ancho también cambia el alto
    def set_ancho(self, v): self.ancho = self.alto = v
    def set_alto(self, v):  self.ancho = self.alto = v`,
    bueno: `# ✅ BIEN: misma interfaz sin romper comportamiento
class Forma(ABC):
    @abstractmethod
    def area(self): pass

class Rectangulo(Forma):
    def __init__(self, ancho, alto):
        self.ancho = ancho
        self.alto  = alto
    def area(self): return self.ancho * self.alto

class Cuadrado(Forma):
    def __init__(self, lado):
        self.lado = lado
    def area(self): return self.lado ** 2

# Cualquier Forma puede usarse donde se espera Forma
def imprimir_area(forma: Forma):
    print(f"Área: {forma.area()}")`,
  },
  {
    letra: 'I', color: 'bg-orange-500', nombre: 'Segregación de Interfaces',
    en: 'Interface Segregation Principle',
    def: 'Es mejor tener varias interfaces específicas que una sola interfaz muy general.',
    malo: `# ❌ MAL: interfaz monolítica que obliga a implementar todo
class Animal(ABC):
    @abstractmethod
    def caminar(self): pass
    @abstractmethod
    def nadar(self): pass
    @abstractmethod
    def volar(self): pass

class Perro(Animal):
    def caminar(self): print("El perro camina")
    def nadar(self):   print("El perro nada")
    def volar(self):   raise NotImplementedError  # ❌ los perros no vuelan`,
    bueno: `# ✅ BIEN: interfaces específicas
class Caminante(ABC):
    @abstractmethod
    def caminar(self): pass

class Nadador(ABC):
    @abstractmethod
    def nadar(self): pass

class Volador(ABC):
    @abstractmethod
    def volar(self): pass

class Perro(Caminante, Nadador):  # solo implementa lo que puede
    def caminar(self): print("El perro camina")
    def nadar(self):   print("El perro nada")

class Aguila(Caminante, Volador):
    def caminar(self): print("El águila camina")
    def volar(self):   print("El águila vuela")`,
  },
  {
    letra: 'D', color: 'bg-red-500', nombre: 'Inversión de Dependencias',
    en: 'Dependency Inversion Principle',
    def: 'Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.',
    malo: `# ❌ MAL: depende de implementación concreta
class Pedido:
    def __init__(self):
        # Acoplado directamente a EmailNotificador
        self.notificador = EmailNotificador()

    def procesar(self):
        # hacer cosas...
        self.notificador.enviar("Pedido procesado")
# ← Si quiero SMS, tengo que modificar Pedido`,
    bueno: `# ✅ BIEN: depende de abstracción
from abc import ABC, abstractmethod

class Notificador(ABC):            # abstracción
    @abstractmethod
    def enviar(self, mensaje): pass

class EmailNotificador(Notificador):
    def enviar(self, msg): print(f"Email: {msg}")

class SMSNotificador(Notificador):
    def enviar(self, msg): print(f"SMS: {msg}")

class WhatsAppNotificador(Notificador):
    def enviar(self, msg): print(f"WhatsApp: {msg}")

class Pedido:
    def __init__(self, notificador: Notificador):
        self.notificador = notificador   # inyección de dependencia

    def procesar(self):
        # hacer cosas...
        self.notificador.enviar("Pedido procesado")

# Uso
pedido_email = Pedido(EmailNotificador())
pedido_sms   = Pedido(SMSNotificador())
pedido_wa    = Pedido(WhatsAppNotificador())`,
  },
]

export default function SolidPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 3 · Sección 5</span>
        <h1 className="text-2xl font-bold text-white mt-2">Principios SOLID</h1>
        <p className="text-gray-400 mt-1">Cinco principios para un diseño orientado a objetos limpio, flexible y fácil de mantener.</p>
      </div>

      <SectionCard guideId="guia3" sectionId="principios-solid" title="Los cinco principios SOLID" points={20}>

        {/* Resumen visual */}
        <div className="grid sm:grid-cols-5 gap-2 mb-6">
          {PRINCIPIOS.map(p => (
            <div key={p.letra} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center text-white font-black text-sm mb-2`}>{p.letra}</div>
              <p className="text-white text-xs font-semibold">{p.nombre}</p>
            </div>
          ))}
        </div>

        {/* Cada principio */}
        {PRINCIPIOS.map(p => (
          <div key={p.letra} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${p.color} flex items-center justify-center text-white font-black text-lg shrink-0`}>{p.letra}</div>
              <div>
                <h3 className="text-white font-bold">{p.nombre}</h3>
                <p className="text-gray-500 text-xs">{p.en}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{p.def}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-red-400 font-semibold mb-1 flex items-center gap-1">❌ Código que viola el principio</p>
                <CodeBlock language="python" code={p.malo} />
              </div>
              <div>
                <p className="text-xs text-sena-green font-semibold mb-1 flex items-center gap-1">✅ Código que cumple el principio</p>
                <CodeBlock language="python" code={p.bueno} />
              </div>
            </div>
          </div>
        ))}

        <InfoBox variant="tip" title="¿Cómo aplicar SOLID en tu proyecto?">
          No necesitas aplicar todos los principios desde el inicio. Comienza con
          <strong> S (Responsabilidad Única)</strong> — separa bien tus clases —
          y <strong>D (Inversión de Dependencias)</strong> — usa interfaces. Los demás
          se volverán naturales conforme tu sistema crezca.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia3/microservicios" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia3/patrones" className="btn-primary">Siguiente: Patrones de diseño <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
