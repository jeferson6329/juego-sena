import SectionCard from '../../components/ui/SectionCard'
import CodeBlock from '../../components/ui/CodeBlock'
import InfoBox from '../../components/ui/InfoBox'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function AlgoritmosPage() {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <span className="badge-blue">Guía 1 · Sección 5</span>
        <h1 className="text-2xl font-bold text-white mt-2">Algoritmos fundamentales</h1>
        <p className="text-gray-400 mt-1">Implementa los algoritmos base que se usan en todo back-end: validación, búsqueda, ordenamiento y agregación.</p>
      </div>

      <SectionCard guideId="guia1" sectionId="algoritmos-intro" title="Conceptos de algoritmia" points={20}>

        <InfoBox variant="info" title="¿Qué es un algoritmo?">
          Un <strong>algoritmo</strong> es una secuencia finita, ordenada y determinista de pasos que resuelve
          un problema o realiza una tarea. Antes de codificar, siempre diseña el algoritmo en pseudocódigo
          o diagrama de flujo.
        </InfoBox>

        {/* ── Algoritmo 1: Validación ── */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1. Algoritmo de validación (GP-COD-01)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Valida los datos de un formulario de registro: nombre no vacío, correo con formato válido,
          edad en rango y contraseña con longitud mínima.
        </p>
        <div className="code-block text-xs mb-3 text-gray-400">
          {`PSEUDOCÓDIGO: validar_registro(nombre, correo, edad, contrasena)
  SI nombre está vacío → error "Nombre obligatorio"
  SI correo no tiene '@' → error "Correo inválido"
  SI edad < 1 O edad > 120 → error "Edad fuera de rango"
  SI longitud(contrasena) < 6 → error "Contraseña muy corta"
  RETORNAR { valido: true }`}
        </div>
        <CodeBlock language="python" title="validacion.py" code={`import re

def validar_registro(nombre, correo, edad, contrasena):
    errores = []

    # 1. Validar nombre
    if not nombre or not nombre.strip():
        errores.append("El nombre no puede estar vacío")

    # 2. Validar correo con expresión regular
    patron_email = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    if not re.match(patron_email, correo):
        errores.append("El correo no tiene un formato válido")

    # 3. Validar edad (debe ser número en rango)
    try:
        edad = int(edad)
        if edad < 1 or edad > 120:
            errores.append("La edad debe estar entre 1 y 120")
    except ValueError:
        errores.append("La edad debe ser un número entero")

    # 4. Validar contraseña
    if len(contrasena) < 6:
        errores.append("La contraseña debe tener al menos 6 caracteres")

    if errores:
        return {"valido": False, "errores": errores}
    return {"valido": True, "mensaje": "Datos válidos ✓"}


# Pruebas
print(validar_registro("Ana", "ana@sena.edu.co", 22, "segura123"))
# → {"valido": True, ...}
print(validar_registro("", "correo-roto", 200, "abc"))
# → {"valido": False, "errores": [...]}`} />

        {/* ── Algoritmo 2: Búsqueda ── */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2. Búsqueda lineal y binaria (GP-COD-03)</h3>
        <p className="text-gray-400 text-sm mb-3">
          La búsqueda lineal recorre elemento por elemento O(n).
          La búsqueda binaria requiere lista ordenada y es mucho más eficiente O(log n).
        </p>
        <CodeBlock language="python" title="busqueda.py" code={`def busqueda_lineal(lista, objetivo):
    """Recorre la lista elemento por elemento."""
    comparaciones = 0
    for i, elemento in enumerate(lista):
        comparaciones += 1
        if elemento == objetivo:
            return {"posicion": i, "comparaciones": comparaciones}
    return {"posicion": -1, "comparaciones": comparaciones}


def busqueda_binaria(lista, objetivo):
    """Requiere lista ordenada. Divide el espacio de búsqueda a la mitad."""
    izq, der = 0, len(lista) - 1
    comparaciones = 0

    while izq <= der:
        medio = (izq + der) // 2
        comparaciones += 1

        if lista[medio] == objetivo:
            return {"posicion": medio, "comparaciones": comparaciones}
        elif lista[medio] < objetivo:
            izq = medio + 1   # busca en la mitad derecha
        else:
            der = medio - 1   # busca en la mitad izquierda

    return {"posicion": -1, "comparaciones": comparaciones}


# Comparación en una lista de 1000 elementos
numeros = list(range(1, 1001))   # [1, 2, 3, ..., 1000]
objetivo = 847

lineal = busqueda_lineal(numeros, objetivo)
binaria = busqueda_binaria(numeros, objetivo)

print(f"Lineal:  posición {lineal['posicion']}, {lineal['comparaciones']} comparaciones")
print(f"Binaria: posición {binaria['posicion']}, {binaria['comparaciones']} comparaciones")
# Lineal:  posición 846, 847 comparaciones
# Binaria: posición 846,  10 comparaciones  ← MUCHO más eficiente`} />

        {/* ── Algoritmo 3: Ordenamiento ── */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3. Ordenamiento burbuja (GP-COD-04)</h3>
        <CodeBlock language="python" title="ordenamiento.py" code={`def burbuja(lista, ascendente=True):
    """
    Ordenamiento de burbuja con bandera de optimización.
    Complejidad: O(n²) peor caso, O(n) si ya está ordenada.
    """
    arr = lista[:]           # copia para no modificar el original
    n = len(arr)

    for i in range(n - 1):
        intercambio = False  # bandera de optimización

        for j in range(n - 1 - i):
            # Condición adaptable para asc/desc
            condicion = arr[j] > arr[j+1] if ascendente else arr[j] < arr[j+1]

            if condicion:
                arr[j], arr[j+1] = arr[j+1], arr[j]  # intercambio en Python
                intercambio = True

        if not intercambio:
            break   # lista ya ordenada, termina antes
    return arr


numeros = [64, 34, 25, 12, 22, 11, 90]
print("Original:    ", numeros)
print("Ascendente:  ", burbuja(numeros))
print("Descendente: ", burbuja(numeros, ascendente=False))`} />

        {/* ── Algoritmo 4: Agregación ── */}
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4. Procesamiento y agregación (GP-COD-05)</h3>
        <CodeBlock language="python" title="agregacion.py" code={`def analizar_productos(productos):
    """
    Procesa una lista de productos y calcula:
    total de ventas, promedio, máximo, mínimo y filtra por precio.
    """
    if not productos:
        return {"error": "Lista vacía"}

    total    = 0
    maximo   = productos[0]['precio']
    minimo   = productos[0]['precio']
    caros    = []          # filtro: precio > 50000

    for p in productos:
        precio = p['precio']
        total += precio

        if precio > maximo: maximo = precio
        if precio < minimo: minimo = precio
        if precio > 50000:  caros.append(p)

    promedio = total / len(productos)

    return {
        "cantidad":  len(productos),
        "total":     total,
        "promedio":  round(promedio, 2),
        "maximo":    maximo,
        "minimo":    minimo,
        "caros":     caros,
    }


productos = [
    {"nombre": "Camiseta",  "precio": 25000},
    {"nombre": "Pantalón",  "precio": 75000},
    {"nombre": "Zapatos",   "precio": 120000},
    {"nombre": "Cinturón",  "precio": 18000},
    {"nombre": "Chaqueta",  "precio": 95000},
]

resultado = analizar_productos(productos)
for k, v in resultado.items():
    print(f"{k:10}: {v}")`} />

        <InfoBox variant="success" title="Consejo de la guía">
          Según la guía SENA, se recomienda <strong>documentar cada algoritmo con su diagrama de flujo
          o pseudocódigo antes de codificarlo</strong>. Practica escribir el algoritmo en palabras
          antes de escribirlo en código.
        </InfoBox>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <Link to="/guia1/lenguajes" className="btn-secondary"><ArrowLeft size={16} /> Anterior</Link>
        <Link to="/guia1/quiz" className="btn-primary">Cuestionario Guía 1 🧠 <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}
