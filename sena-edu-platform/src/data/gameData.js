// ============================================================
// SENA EDU – Banco de preguntas del juego
// Basado en las Guías 1 y 3 – Julio 2026
// 25 preguntas + 3 retos de pseudocódigo
// ============================================================

export const NIVELES = { FACIL: 'fácil', MEDIO: 'medio' }

export const TEMAS = {
  BACKEND:       'Fundamentos del Back-end',
  HTTP:          'HTTP y protocolos',
  ALGORITMOS:    'Algoritmos y pseudocódigo',
  LENGUAJES:     'Lenguajes de programación',
  ARQUITECTURA:  'Arquitectura de software',
  MVC:           'Patrón MVC',
  CAPAS:         'Arquitectura por capas',
  MICROSERVICIOS:'Microservicios',
  SOLID:         'Principios SOLID',
}

export const TIPOS = {
  SELECCION_MULTIPLE: 'seleccion_multiple',
  VERDADERO_FALSO:    'verdadero_falso',
  ORDENAR:            'ordenar',
  RELACIONAR:         'relacionar',
  CONSTRUIR_PSEUDO:   'construir_pseudo',
}

// ============================================================
// BLOQUE 1 — SELECCIÓN MÚLTIPLE (10 preguntas)
// ============================================================
export const PREGUNTAS = [

  // ── Guía 1 ──────────────────────────────────────────────

  {
    id: 'sm_01',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.BACKEND,
    puntos: 10,
    enunciado: '¿Qué es el back-end de una aplicación web?',
    opciones: [
      { id: 'a', texto: 'Lo que el usuario ve en el navegador: botones, colores y texto', correcto: false },
      { id: 'b', texto: 'La parte que corre en el servidor: lógica, base de datos y seguridad', correcto: true },
      { id: 'c', texto: 'El diseño visual de la página web', correcto: false },
      { id: 'd', texto: 'El cable de red que conecta al usuario con internet', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El back-end es la capa que se ejecuta en el servidor. Contiene la lógica de negocio, el acceso a la base de datos y la seguridad. El usuario nunca lo ve directamente.',
    pista: 'Piensa en "lo que ocurre detrás de escena".',
  },

  {
    id: 'sm_02',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 10,
    enunciado: 'Cuando escribes una dirección web y presionas Enter, ¿qué hace tu navegador primero?',
    opciones: [
      { id: 'a', texto: 'Espera a que el servidor le envíe datos sin pedir nada', correcto: false },
      { id: 'b', texto: 'Apaga la conexión a internet para reiniciarla', correcto: false },
      { id: 'c', texto: 'Envía una petición HTTP al servidor pidiendo la página', correcto: true },
      { id: 'd', texto: 'Descarga automáticamente todos los archivos del sitio', correcto: false },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'En el modelo cliente-servidor, siempre es el cliente (navegador) quien inicia la comunicación enviando una petición HTTP. El servidor solo responde cuando recibe esa petición.',
    pista: 'En HTTP, alguien tiene que "llamar" primero. ¿Quién es?',
  },

  {
    id: 'sm_03',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 10,
    enunciado: '¿Cuál es la diferencia principal entre HTTP y HTTPS?',
    opciones: [
      { id: 'a', texto: 'HTTPS es más lento porque usa más letras en la dirección', correcto: false },
      { id: 'b', texto: 'HTTPS cifra los datos con TLS/SSL para que nadie los pueda leer en el camino', correcto: true },
      { id: 'c', texto: 'No hay diferencia, son exactamente lo mismo', correcto: false },
      { id: 'd', texto: 'HTTP es más seguro porque es más antiguo', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'HTTPS agrega una capa de cifrado (TLS/SSL) sobre HTTP. Esto protege contraseñas, datos bancarios y cualquier información sensible que viaje por la red.',
    pista: 'La "S" al final significa "Secure" (seguro).',
  },

  {
    id: 'sm_04',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 10,
    enunciado: 'Un amigo te dice que recibió un error "404" al entrar a una página. ¿Qué significa eso?',
    opciones: [
      { id: 'a', texto: 'El servidor tuvo un error interno y se cayó', correcto: false },
      { id: 'b', texto: 'El usuario no tiene permiso para ver esa página', correcto: false },
      { id: 'c', texto: 'La página o recurso que buscaba no fue encontrado', correcto: true },
      { id: 'd', texto: 'La conexión a internet está fallando', correcto: false },
    ],
    respuestaCorrecta: 'c',
    explicacion: '404 Not Found significa que el servidor no encontró lo que se pidió. Puede ser que la página fue eliminada o que la dirección está mal escrita.',
    pista: 'Los códigos 4xx son errores del cliente. ¿Qué pasa cuando pides algo que no existe?',
  },

  {
    id: 'sm_05',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.ALGORITMOS,
    puntos: 10,
    enunciado: '¿Qué es un algoritmo?',
    opciones: [
      { id: 'a', texto: 'Un tipo especial de base de datos', correcto: false },
      { id: 'b', texto: 'Una secuencia ordenada y finita de pasos para resolver un problema', correcto: true },
      { id: 'c', texto: 'El nombre de un lenguaje de programación muy avanzado', correcto: false },
      { id: 'd', texto: 'Una herramienta para diseñar páginas web', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'Un algoritmo es como una receta de cocina: tiene pasos ordenados, empieza y termina, y para los mismos ingredientes siempre da el mismo resultado.',
    pista: 'Piensa en una receta de cocina con pasos bien definidos.',
  },

  {
    id: 'sm_06',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    tema: TEMAS.LENGUAJES,
    puntos: 15,
    enunciado: '¿Cuál lenguaje de programación puede correr tanto en el navegador del usuario como en el servidor?',
    opciones: [
      { id: 'a', texto: 'Python', correcto: false },
      { id: 'b', texto: 'PHP', correcto: false },
      { id: 'c', texto: 'JavaScript con Node.js', correcto: true },
      { id: 'd', texto: 'Java', correcto: false },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'JavaScript es el único lenguaje que corre nativamente en el navegador. Con Node.js también corre en el servidor, lo que permite hacer desarrollo "full-stack" con un solo lenguaje.',
    pista: 'Un lenguaje que trabaja en los dos lados: front-end y back-end.',
  },

  {
    id: 'sm_07',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.ARQUITECTURA,
    puntos: 10,
    enunciado: '¿Para qué sirve la arquitectura de software?',
    opciones: [
      { id: 'a', texto: 'Para hacer que el código se vea más bonito en la pantalla', correcto: false },
      { id: 'b', texto: 'Para organizar el sistema en partes con responsabilidades claras y facilitar el trabajo en equipo', correcto: true },
      { id: 'c', texto: 'Para eliminar la necesidad de hacer pruebas', correcto: false },
      { id: 'd', texto: 'Para que el código ocupe menos espacio en el disco', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La arquitectura de software define cómo se divide el sistema, qué hace cada parte y cómo se comunican. Esto hace que el software sea más fácil de mantener y ampliar.',
    pista: 'Piensa en cómo se organizan los cuartos de una casa para que cada uno tenga una función.',
  },

  {
    id: 'sm_08',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.MVC,
    puntos: 10,
    enunciado: 'En el patrón MVC, ¿qué parte se encarga de los datos y las reglas del negocio?',
    opciones: [
      { id: 'a', texto: 'La Vista', correcto: false },
      { id: 'b', texto: 'El Controlador', correcto: false },
      { id: 'c', texto: 'El Modelo', correcto: true },
      { id: 'd', texto: 'El Router', correcto: false },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'El Modelo gestiona los datos y la lógica de negocio (reglas del sistema). La Vista muestra la información al usuario y el Controlador coordina entre los dos.',
    pista: 'M = datos y reglas. V = lo que ve el usuario. C = el coordinador.',
  },

  {
    id: 'sm_09',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    tema: TEMAS.MICROSERVICIOS,
    puntos: 10,
    enunciado: '¿Qué hace la API Gateway en una arquitectura de microservicios?',
    opciones: [
      { id: 'a', texto: 'Guarda todos los datos de los microservicios en una sola base de datos', correcto: false },
      { id: 'b', texto: 'Es el punto único de entrada que recibe las peticiones del cliente y las envía al servicio correcto', correcto: true },
      { id: 'c', texto: 'Diseña la interfaz gráfica de la aplicación', correcto: false },
      { id: 'd', texto: 'Reemplaza la base de datos en los microservicios', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La API Gateway funciona como la "puerta de entrada" de toda la aplicación. Recibe las peticiones del cliente y las redirige al microservicio que corresponde (usuarios, productos, pedidos, etc.).',
    pista: 'Gateway = puerta de entrada. Imagina una recepcionista que dirige a cada visitante al área correcta.',
  },

  {
    id: 'sm_10',
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    tema: TEMAS.SOLID,
    puntos: 15,
    enunciado: '¿Qué dice el principio "S" de SOLID (Responsabilidad Única)?',
    opciones: [
      { id: 'a', texto: 'Un programa debe hacer muchas cosas para ser más eficiente', correcto: false },
      { id: 'b', texto: 'Cada clase o módulo debe tener una sola razón para cambiar (una sola responsabilidad)', correcto: true },
      { id: 'c', texto: 'El código solo puede tener una función por archivo', correcto: false },
      { id: 'd', texto: 'Los servicios deben estar separados en servidores distintos', correcto: false },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El principio S dice que cada clase debe tener un solo trabajo. Si una clase hace demasiadas cosas (guardar en BD, enviar email, generar PDF), es mejor separarla en clases más pequeñas y especializadas.',
    pista: 'Un chef, una especialidad. Una clase, una responsabilidad.',
  },

  // ============================================================
  // BLOQUE 2 — VERDADERO O FALSO (6 preguntas)
  // ============================================================

  {
    id: 'vf_01',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.BACKEND,
    puntos: 5,
    enunciado: 'En la arquitectura cliente-servidor, es el SERVIDOR quien inicia la comunicación enviando datos al cliente sin que este lo pida.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: false },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'Falso. Siempre es el CLIENTE (el navegador) quien inicia la comunicación enviando una petición. El servidor solo responde cuando recibe esa petición.',
    pista: '¿Quién "llama" primero en HTTP?',
  },

  {
    id: 'vf_02',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 5,
    enunciado: 'El método GET de HTTP se usa para crear un nuevo recurso en el servidor (por ejemplo, registrar un usuario nuevo).',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: false },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'Falso. GET se usa para LEER o consultar datos. Para crear un recurso nuevo se usa POST.',
    pista: 'GET = obtener/leer. Para crear algo nuevo se usa otro verbo.',
  },

  {
    id: 'vf_03',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.ALGORITMOS,
    puntos: 5,
    enunciado: 'La búsqueda binaria puede usarse en cualquier lista, incluso si sus elementos están en desorden.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: false },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'Falso. La búsqueda binaria solo funciona en listas que ya estén ORDENADAS. Si la lista está desordenada, hay que usar búsqueda lineal o primero ordenar la lista.',
    pista: 'Para dividir por la mitad necesitas saber qué hay a cada lado.',
  },

  {
    id: 'vf_04',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.MVC,
    puntos: 5,
    enunciado: 'En el patrón MVC, la Vista puede acceder directamente a la base de datos para obtener los datos que necesita mostrar.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: false },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'Falso. La Vista solo se encarga de mostrar datos. Acceder a la base de datos es responsabilidad del Modelo. La Vista recibe los datos ya procesados a través del Controlador.',
    pista: 'En MVC cada parte tiene su rol. La Vista solo "muestra".',
  },

  {
    id: 'vf_05',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.MEDIO,
    tema: TEMAS.CAPAS,
    puntos: 10,
    enunciado: 'Una ventaja de la arquitectura por capas es que si cambias la base de datos (por ejemplo de MySQL a PostgreSQL), solo necesitas modificar la capa de acceso a datos, sin tocar las demás capas.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: true },
      { id: 'falso', texto: 'Falso', correcto: false },
    ],
    respuestaCorrecta: 'verdadero',
    explicacion: 'Verdadero. Esa es una de las grandes ventajas de la arquitectura por capas: el aislamiento. Como cada capa solo conoce a la de abajo, cambiar la base de datos solo afecta la capa de acceso a datos.',
    pista: 'Cada capa solo conoce a su vecina de abajo. Si cambias la de abajo, ¿las de arriba lo notan?',
  },

  {
    id: 'vf_06',
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.MICROSERVICIOS,
    puntos: 5,
    enunciado: 'En la arquitectura de microservicios, todos los servicios deben compartir la misma base de datos para que los datos estén centralizados.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: false },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'Falso. En microservicios, cada servicio tiene su PROPIA base de datos independiente. Eso les permite escalar, cambiar tecnología y desplegarse por separado sin afectar a los otros.',
    pista: 'La independencia es clave en microservicios. ¿Pueden tener sus propias BDs?',
  },

  // ============================================================
  // BLOQUE 3 — ORDENAR PASOS (3 preguntas)
  // ============================================================

  {
    id: 'ord_01',
    tipo: TIPOS.ORDENAR,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 15,
    enunciado: 'Ordena los pasos del ciclo de una petición HTTP, desde que el usuario actúa hasta que ve el resultado:',
    pasosDesordenados: [
      { id: 'p3', texto: 'El servidor procesa la petición y consulta la base de datos' },
      { id: 'p1', texto: 'El usuario escribe una dirección web y presiona Enter' },
      { id: 'p5', texto: 'El navegador muestra el contenido al usuario' },
      { id: 'p2', texto: 'El navegador envía una petición HTTP al servidor' },
      { id: 'p4', texto: 'El servidor responde con un código de estado y los datos solicitados' },
    ],
    ordenCorrecto: ['p1', 'p2', 'p3', 'p4', 'p5'],
    explicacion: 'El flujo HTTP siempre sigue este orden: el usuario activa → el navegador pide → el servidor procesa → el servidor responde → el navegador muestra.',
    pista: 'Empieza por la acción del usuario y termina en lo que ve en pantalla.',
  },

  {
    id: 'ord_02',
    tipo: TIPOS.ORDENAR,
    nivel: NIVELES.FACIL,
    tema: TEMAS.MVC,
    puntos: 15,
    enunciado: 'Ordena el flujo correcto del patrón MVC cuando un usuario hace clic en "Ver lista de productos":',
    pasosDesordenados: [
      { id: 'm3', texto: 'El Modelo consulta la base de datos y devuelve los productos' },
      { id: 'm1', texto: 'El usuario hace clic y envía una petición al servidor' },
      { id: 'm5', texto: 'El usuario ve la lista de productos en su pantalla' },
      { id: 'm2', texto: 'El Controlador recibe la petición y le pide los datos al Modelo' },
      { id: 'm4', texto: 'El Controlador pasa los datos a la Vista para que los muestre' },
    ],
    ordenCorrecto: ['m1', 'm2', 'm3', 'm4', 'm5'],
    explicacion: 'El flujo MVC es siempre: Usuario → Controlador → Modelo → Controlador → Vista → Usuario. El Controlador es el intermediario entre Modelo y Vista.',
    pista: 'El Controlador siempre es el primero en recibir la petición.',
  },

  {
    id: 'ord_03',
    tipo: TIPOS.ORDENAR,
    nivel: NIVELES.MEDIO,
    tema: TEMAS.ALGORITMOS,
    puntos: 15,
    enunciado: 'Ordena los pasos correctos para diseñar e implementar un algoritmo, según lo que recomienda la guía SENA:',
    pasosDesordenados: [
      { id: 'a3', texto: 'Codificar el algoritmo en el lenguaje de programación elegido' },
      { id: 'a1', texto: 'Entender bien el problema que se quiere resolver' },
      { id: 'a5', texto: 'Verificar con pruebas que el algoritmo funciona correctamente' },
      { id: 'a2', texto: 'Diseñar el pseudocódigo o diagrama de flujo antes de codificar' },
      { id: 'a4', texto: 'Depurar (debug) si hay errores en el código' },
    ],
    ordenCorrecto: ['a1', 'a2', 'a3', 'a4', 'a5'],
    explicacion: 'La guía recomienda siempre diseñar el algoritmo (pseudocódigo o diagrama) ANTES de escribir código. Primero entender → diseñar → codificar → depurar → verificar.',
    pista: 'El pseudocódigo va antes del código real.',
  },

  // ============================================================
  // BLOQUE 4 — RELACIONAR PAREJAS (3 preguntas)
  // ============================================================

  {
    id: 'rel_01',
    tipo: TIPOS.RELACIONAR,
    nivel: NIVELES.FACIL,
    tema: TEMAS.HTTP,
    puntos: 15,
    enunciado: 'Relaciona cada método HTTP con su función:',
    pares: [
      { izquierda: 'GET',    derecha: 'Leer o consultar un recurso' },
      { izquierda: 'POST',   derecha: 'Crear un nuevo recurso' },
      { izquierda: 'PUT',    derecha: 'Reemplazar un recurso completo' },
      { izquierda: 'DELETE', derecha: 'Eliminar un recurso' },
    ],
    respuestaCorrecta: {
      GET: 'Leer o consultar un recurso',
      POST: 'Crear un nuevo recurso',
      PUT: 'Reemplazar un recurso completo',
      DELETE: 'Eliminar un recurso',
    },
    explicacion: 'Los métodos HTTP tienen funciones fijas: GET lee, POST crea, PUT reemplaza y DELETE elimina. Esto es lo que hace que las APIs REST sean predecibles.',
    pista: 'Recuerda CRUD: Create→POST, Read→GET, Update→PUT, Delete→DELETE.',
  },

  {
    id: 'rel_02',
    tipo: TIPOS.RELACIONAR,
    nivel: NIVELES.FACIL,
    tema: TEMAS.SOLID,
    puntos: 15,
    enunciado: 'Relaciona cada letra de SOLID con su principio:',
    pares: [
      { izquierda: 'S', derecha: 'Responsabilidad Única: una clase, un solo trabajo' },
      { izquierda: 'O', derecha: 'Abierto/Cerrado: abierto para extender, cerrado para modificar' },
      { izquierda: 'I', derecha: 'Segregación de Interfaces: interfaces específicas, no generales' },
      { izquierda: 'D', derecha: 'Inversión de Dependencias: depender de abstracciones, no de clases concretas' },
    ],
    respuestaCorrecta: {
      S: 'Responsabilidad Única: una clase, un solo trabajo',
      O: 'Abierto/Cerrado: abierto para extender, cerrado para modificar',
      I: 'Segregación de Interfaces: interfaces específicas, no generales',
      D: 'Inversión de Dependencias: depender de abstracciones, no de clases concretas',
    },
    explicacion: 'SOLID son cinco principios para escribir código limpio. Cada letra tiene un significado diferente que ayuda a que el código sea más fácil de mantener y extender.',
    pista: 'S=solo un trabajo, O=extender sin romper, I=interfaces pequeñas, D=depender de contratos.',
  },

  {
    id: 'rel_03',
    tipo: TIPOS.RELACIONAR,
    nivel: NIVELES.FACIL,
    tema: TEMAS.CAPAS,
    puntos: 15,
    enunciado: 'Relaciona cada capa de la arquitectura por capas con su función:',
    pares: [
      { izquierda: 'Capa de Presentación',      derecha: 'Interfaz del usuario: HTML, CSS, botones' },
      { izquierda: 'Capa de Lógica de Negocio', derecha: 'Reglas del sistema: validaciones y cálculos' },
      { izquierda: 'Capa de Acceso a Datos',    derecha: 'Consultas a la base de datos (repositorios)' },
      { izquierda: 'Capa de Datos',             derecha: 'La base de datos real (SQL, NoSQL)' },
    ],
    respuestaCorrecta: {
      'Capa de Presentación':      'Interfaz del usuario: HTML, CSS, botones',
      'Capa de Lógica de Negocio': 'Reglas del sistema: validaciones y cálculos',
      'Capa de Acceso a Datos':    'Consultas a la base de datos (repositorios)',
      'Capa de Datos':             'La base de datos real (SQL, NoSQL)',
    },
    explicacion: 'La arquitectura por capas organiza el sistema en cuatro niveles: presentación (lo que ve el usuario), negocio (las reglas), acceso a datos (las consultas) y datos (la BD real).',
    pista: 'De arriba a abajo: lo que se ve → las reglas → las consultas → los datos.',
  },

]

// ============================================================
// BLOQUE 5 — RETOS DE PSEUDOCÓDIGO (3 retos)
// ============================================================
export const RETOS_PSEUDOCODIGO = [

  {
    id: 'pseudo_01',
    tipo: TIPOS.CONSTRUIR_PSEUDO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.ALGORITMOS,
    puntos: 20,
    titulo: 'Verificar si una calificación es aprobatoria',
    enunciado: 'Construye el pseudocódigo de un algoritmo que lea una calificación y muestre "Aprobado" si es mayor o igual a 60, o "Reprobado" si no.',
    descripcionProblema: 'El algoritmo recibe una calificación del usuario y decide si pasó o no. El umbral de aprobación es 60 puntos.',
    bloquesDisponibles: [
      { id: 'INICIO',       tipo: 'inicio',   texto: 'INICIO' },
      { id: 'FIN',          tipo: 'fin',       texto: 'FIN' },
      { id: 'LEER_cal',     tipo: 'leer',      texto: 'LEER calificacion' },
      { id: 'SI_apr',       tipo: 'si',        texto: 'SI calificacion >= 60 ENTONCES' },
      { id: 'MOSTRAR_apr',  tipo: 'mostrar',   texto: 'MOSTRAR "Aprobado"' },
      { id: 'SINO',         tipo: 'sino',      texto: 'SINO' },
      { id: 'MOSTRAR_rep',  tipo: 'mostrar',   texto: 'MOSTRAR "Reprobado"' },
      { id: 'FIN_SI',       tipo: 'fin_si',    texto: 'FIN SI' },
      { id: 'LEER_nom',     tipo: 'leer',      texto: 'LEER nombre',        distractor: true },
      { id: 'SI_100',       tipo: 'si',        texto: 'SI calificacion > 100 ENTONCES', distractor: true },
    ],
    solucion: ['INICIO', 'LEER_cal', 'SI_apr', 'MOSTRAR_apr', 'SINO', 'MOSTRAR_rep', 'FIN_SI', 'FIN'],
    explicacion: 'El algoritmo siempre empieza con INICIO y termina con FIN. Lee la calificación, evalúa la condición >= 60 y muestra el mensaje correspondiente con SI/SINO.',
    pista: 'El orden es: INICIO → LEER → SI condición → MOSTRAR → SINO → MOSTRAR → FIN SI → FIN.',
  },

  {
    id: 'pseudo_02',
    tipo: TIPOS.CONSTRUIR_PSEUDO,
    nivel: NIVELES.FACIL,
    tema: TEMAS.ALGORITMOS,
    puntos: 20,
    titulo: 'Determinar si un número es par o impar',
    enunciado: 'Construye el pseudocódigo para un algoritmo que lea un número y muestre si es "Par" o "Impar". Un número es par si al dividirlo entre 2 el residuo es 0.',
    descripcionProblema: 'Usa el operador % (módulo) para obtener el residuo de la división. Si el residuo es 0, el número es par.',
    bloquesDisponibles: [
      { id: 'INICIO',        tipo: 'inicio',   texto: 'INICIO' },
      { id: 'FIN',           tipo: 'fin',       texto: 'FIN' },
      { id: 'LEER_num',      tipo: 'leer',      texto: 'LEER numero' },
      { id: 'SI_par',        tipo: 'si',        texto: 'SI numero % 2 == 0 ENTONCES' },
      { id: 'MOSTRAR_par',   tipo: 'mostrar',   texto: 'MOSTRAR "Par"' },
      { id: 'SINO',          tipo: 'sino',      texto: 'SINO' },
      { id: 'MOSTRAR_imp',   tipo: 'mostrar',   texto: 'MOSTRAR "Impar"' },
      { id: 'FIN_SI',        tipo: 'fin_si',    texto: 'FIN SI' },
      { id: 'SI_pos',        tipo: 'si',        texto: 'SI numero > 0 ENTONCES', distractor: true },
      { id: 'MOSTRAR_pos',   tipo: 'mostrar',   texto: 'MOSTRAR "Positivo"',     distractor: true },
    ],
    solucion: ['INICIO', 'LEER_num', 'SI_par', 'MOSTRAR_par', 'SINO', 'MOSTRAR_imp', 'FIN_SI', 'FIN'],
    explicacion: 'El operador % calcula el residuo. Si numero % 2 es 0, el número es par (ej: 4 % 2 = 0). Si es 1, es impar (ej: 7 % 2 = 1).',
    pista: '% es el operador "módulo". Si el residuo de dividir entre 2 es 0, es par.',
  },

  {
    id: 'pseudo_03',
    tipo: TIPOS.CONSTRUIR_PSEUDO,
    nivel: NIVELES.MEDIO,
    tema: TEMAS.ALGORITMOS,
    puntos: 25,
    titulo: 'Calcular el promedio de tres notas',
    enunciado: 'Construye el pseudocódigo para leer tres notas, calcular el promedio y mostrar si el estudiante "Aprobó" (promedio >= 60) o "Reprobó".',
    descripcionProblema: 'Lee las tres notas, súmalas, divídelas entre 3 para obtener el promedio y luego verifica si es aprobatorio.',
    bloquesDisponibles: [
      { id: 'INICIO',        tipo: 'inicio',   texto: 'INICIO' },
      { id: 'FIN',           tipo: 'fin',       texto: 'FIN' },
      { id: 'LEER_n1',       tipo: 'leer',      texto: 'LEER nota1' },
      { id: 'LEER_n2',       tipo: 'leer',      texto: 'LEER nota2' },
      { id: 'LEER_n3',       tipo: 'leer',      texto: 'LEER nota3' },
      { id: 'CALC_prom',     tipo: 'asignar',   texto: 'promedio = (nota1 + nota2 + nota3) / 3' },
      { id: 'MOSTRAR_prom',  tipo: 'mostrar',   texto: 'MOSTRAR promedio' },
      { id: 'SI_apr',        tipo: 'si',        texto: 'SI promedio >= 60 ENTONCES' },
      { id: 'MOSTRAR_apr',   tipo: 'mostrar',   texto: 'MOSTRAR "Aprobó"' },
      { id: 'SINO',          tipo: 'sino',      texto: 'SINO' },
      { id: 'MOSTRAR_rep',   tipo: 'mostrar',   texto: 'MOSTRAR "Reprobó"' },
      { id: 'FIN_SI',        tipo: 'fin_si',    texto: 'FIN SI' },
      { id: 'LEER_n4',       tipo: 'leer',      texto: 'LEER nota4', distractor: true },
    ],
    solucion: ['INICIO', 'LEER_n1', 'LEER_n2', 'LEER_n3', 'CALC_prom', 'SI_apr', 'MOSTRAR_apr', 'SINO', 'MOSTRAR_rep', 'FIN_SI', 'MOSTRAR_prom', 'FIN'],
    explicacion: 'Primero lee las tres notas, luego calcula el promedio, evalúa si aprobó o reprobó, y finalmente muestra el promedio numérico.',
    pista: 'Primero lee → calcula el promedio → decide aprobado/reprobado → muestra el número.',
  },
]

// ─── Índices para acceso rápido ───────────────────────────────────────────────

export const TOTAL_PUNTOS_POSIBLES =
  PREGUNTAS.reduce((s, p) => s + p.puntos, 0) +
  RETOS_PSEUDOCODIGO.reduce((s, r) => s + r.puntos, 0)
