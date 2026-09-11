import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import DiagramBox from '../../components/ui/DiagramBox'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function IntroBackendPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 1 · Sección 1</span>
        <h1 className="text-2xl font-bold text-white mt-2">Introducción al Back-end</h1>
        <p className="text-gray-400 mt-1">Entiende qué es el back-end, cuál es su rol y cómo se diferencia del front-end.</p>
      </div>

      <SectionCard guideId="guia1" sectionId="intro-backend" title="¿Qué es el back-end?" points={15}>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Cuando usas una aplicación web — ya sea para hacer una compra, enviar un mensaje o consultar un saldo —
          ves únicamente la interfaz visual (front-end). Sin embargo, detrás de esa interfaz existe una capa
          invisible llamada <strong className="text-white">back-end</strong> que es la que realmente procesa tu
          solicitud, consulta la base de datos y devuelve la respuesta.
        </p>

        <DiagramBox title="Arquitectura cliente-servidor">
          {`
  ┌─────────────────────────┐          ┌──────────────────────────────────┐
  │        CLIENTE          │          │             SERVIDOR              │
  │  (Navegador / App móvil)│          │         (Back-end)               │
  │                         │          │                                   │
  │  HTML  ·  CSS  ·  JS    │ ←──────→ │  Lógica de negocio               │
  │  (lo que el usuario ve) │  HTTP/S  │  Acceso a datos (DB)             │
  │                         │          │  Autenticación / Seguridad       │
  └─────────────────────────┘          │  APIs / Servicios                │
                                       └──────────────────────────────────┘
          `}
        </DiagramBox>

        <div className="grid sm:grid-cols-2 gap-4 my-4">
          <div className="card border-blue-500/20">
            <p className="text-blue-400 font-semibold text-sm mb-2">Front-end (cliente)</p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Se ejecuta en el navegador del usuario</li>
              <li>• HTML, CSS, JavaScript</li>
              <li>• Lo que el usuario ve e interactúa</li>
              <li>• Frameworks: React, Vue, Angular</li>
            </ul>
          </div>
          <div className="card border-sena-green/20">
            <p className="text-sena-green font-semibold text-sm mb-2">Back-end (servidor)</p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Se ejecuta en el servidor</li>
              <li>• Python, Node.js, Java, PHP, C#, Go</li>
              <li>• Lógica de negocio y acceso a datos</li>
              <li>• Frameworks: Express, Django, Spring</li>
            </ul>
          </div>
        </div>

        <InfoBox variant="tip" title="Dato clave">
          El back-end es la capa que <strong>nunca expone</strong> sus datos directamente al navegador.
          Todo pasa por validación, autenticación y control de acceso antes de llegar al cliente.
        </InfoBox>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">¿Qué hace concretamente el back-end?</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { emoji: '🔐', title: 'Autenticación', desc: 'Verifica quién eres (login, tokens JWT, sesiones).' },
            { emoji: '🗃️', title: 'Base de datos', desc: 'Lee y escribe datos persistentes (SQL, NoSQL).' },
            { emoji: '🧮', title: 'Lógica de negocio', desc: 'Aplica las reglas del sistema (cálculos, validaciones, flujos).' },
            { emoji: '📡', title: 'APIs', desc: 'Expone endpoints que el front-end puede consumir.' },
            { emoji: '🔒', title: 'Seguridad', desc: 'Cifrado, control de acceso, sanitización de entradas.' },
            { emoji: '📬', title: 'Notificaciones', desc: 'Envío de emails, SMS, notificaciones push.' },
          ].map(item => (
            <div key={item.title} className="card border-gray-700 text-sm">
              <p className="text-xl mb-1">{item.emoji}</p>
              <p className="text-white font-medium">{item.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Ejemplo: flujo de un login</h3>
        <CodeBlock language="python" title="login.py (Flask)" code={`# Back-end: procesa el formulario de login
@app.route('/login', methods=['POST'])
def login():
    email    = request.json.get('email')
    password = request.json.get('password')

    # 1. Busca el usuario en la base de datos
    user = db.query("SELECT * FROM users WHERE email = ?", [email])

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # 2. Verifica la contraseña (bcrypt)
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    # 3. Genera un token JWT seguro
    token = jwt.encode({"user_id": user['id']}, SECRET_KEY)

    return jsonify({"token": token}), 200
    # ↑ El front-end recibe solo el token, NUNCA la contraseña`} />

        <InfoBox variant="warning" title="Seguridad">
          La contraseña NUNCA se guarda en texto plano. Siempre se hashea con algoritmos como bcrypt.
          El front-end nunca debe tener acceso a la lógica de validación real.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-end pt-4">
        <Link to="/guia1/http" className="btn-primary">
          Siguiente: HTTP y protocolos <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
