import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const LANGS = [
  {
    name: 'JavaScript (Node.js)', emoji: '🟨', color: 'border-yellow-500/30',
    badge: 'badge-yellow',
    strengths: ['Funciona en cliente y servidor', 'Gran ecosistema (npm)', 'Asíncrono y orientado a eventos'],
    frameworks: ['Express.js', 'NestJS', 'Fastify'],
    sample: `// Express.js – API REST básica
const express = require('express')
const app = express()
app.use(express.json())

app.get('/saludo', (req, res) => {
  const nombre = req.query.nombre || 'Mundo'
  res.json({ mensaje: \`¡Hola, \${nombre}!\` })
})

app.listen(3000)`,
  },
  {
    name: 'Python', emoji: '🐍', color: 'border-blue-500/30',
    badge: 'badge-blue',
    strengths: ['Sintaxis legible y sencilla', 'IA / Ciencia de Datos', 'Gran comunidad educativa'],
    frameworks: ['Django', 'Flask', 'FastAPI'],
    sample: `# FastAPI – API moderna con validación automática
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Producto(BaseModel):
    nombre: str
    precio: float

@app.post("/productos/")
def crear_producto(producto: Producto):
    return {"id": 1, **producto.dict()}`,
  },
  {
    name: 'Java', emoji: '☕', color: 'border-orange-500/30',
    badge: 'badge-yellow',
    strengths: ['Robusto y escalable', 'Fuerte en empresas', 'Tipado estático'],
    frameworks: ['Spring Boot', 'Jakarta EE'],
    sample: `// Spring Boot – Controlador REST
@RestController
@RequestMapping("/api")
public class ProductoController {

    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        Producto p = productoService.buscar(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }
}`,
  },
  {
    name: 'PHP', emoji: '🐘', color: 'border-purple-500/30',
    badge: 'badge-blue',
    strengths: ['Base de gran parte de la web', 'Fácil despliegue', 'WordPress, Drupal'],
    frameworks: ['Laravel', 'Symfony'],
    sample: `<?php
// Laravel – Ruta y controlador básico
Route::get('/api/usuarios/{id}', function ($id) {
    $usuario = Usuario::findOrFail($id);
    return response()->json($usuario);
});

// Controlador con validación
public function store(Request $request) {
    $request->validate([
        'nombre' => 'required|max:100',
        'email'  => 'required|email|unique:usuarios',
    ]);
    return Usuario::create($request->all());
}`,
  },
]

export default function LenguajesPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 1 · Sección 4</span>
        <h1 className="text-2xl font-bold text-white mt-2">Lenguajes de programación web</h1>
        <p className="text-gray-400 mt-1">Compara los principales lenguajes para back-end y elige con criterio.</p>
      </div>

      <SectionCard guideId="guia1" sectionId="lenguajes-web" title="Panorama de lenguajes back-end" points={15}>
        <InfoBox variant="tip" title="No existe el 'mejor' lenguaje">
          La elección depende del proyecto, el equipo y los requisitos de rendimiento.
          Todos permiten implementar los mismos algoritmos fundamentales. Lo más importante es dominar
          los conceptos: los lenguajes son herramientas intercambiables.
        </InfoBox>

        <div className="space-y-6 mt-4">
          {LANGS.map(lang => (
            <div key={lang.name} className={`card border ${lang.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{lang.emoji}</span>
                <div>
                  <h3 className="text-white font-bold">{lang.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {lang.frameworks.map(f => (
                      <span key={f} className="badge bg-gray-800 text-gray-400 border border-gray-700">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-400 mb-4 space-y-0.5">
                {lang.strengths.map(s => <li key={s}>✓ {s}</li>)}
              </ul>
              <CodeBlock language={lang.name.includes('Java') ? 'java' : lang.name.includes('Python') ? 'python' : 'js'} code={lang.sample} />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Tabla comparativa</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800 text-left">
                {['Lenguaje','Tipado','Rendimiento','Curva aprendizaje','Caso de uso ideal'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                ['JavaScript','Dinámico','Alto','Baja','APIs, apps cliente-servidor, tiempo real'],
                ['Python','Dinámico','Medio','Muy baja','IA, Ciencia de Datos, APIs'],
                ['Java','Estático','Muy alto','Alta','Apps empresariales, Android'],
                ['PHP','Dinámico','Medio','Baja','Sitios web clásicos, CMS'],
                ['C# (.NET)','Estático','Muy alto','Media','Apps empresariales Windows'],
                ['Go','Estático','Muy alto','Media','Microservicios, alto rendimiento'],
              ].map(([lang,...cols]) => (
                <tr key={lang} className="bg-gray-900/60">
                  <td className="px-3 py-2 text-white font-medium">{lang}</td>
                  {cols.map((c, i) => (
                    <td key={i} className="px-3 py-2 text-gray-400">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBox variant="success" title="Recomendación para el programa SENA">
          Para esta guía puedes elegir <strong>Python (Flask/FastAPI)</strong> por su sintaxis clara y curva de
          aprendizaje baja, o <strong>JavaScript (Node.js/Express)</strong> si ya conoces JS del front-end.
          Ambos tienen excelente documentación en español.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia1/servidores" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia1/algoritmos" className="btn-primary">Siguiente: Algoritmos <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
