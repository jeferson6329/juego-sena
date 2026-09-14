// ============================================================
// SENA EDU – Datos del juego educativo
// Basado en el contenido real de las Guías 1 y 3
// ============================================================

// ─── TIPOS DE PREGUNTA ────────────────────────────────────────────────────────
export const TIPOS = {
  SELECCION_MULTIPLE: 'seleccion_multiple',
  VERDADERO_FALSO:    'verdadero_falso',
  RELACIONAR:         'relacionar',
  ORDENAR:            'ordenar',
  IDENTIFICAR_ERROR:  'identificar_error',
  COMPLETAR_PSEUDO:   'completar_pseudo',
  CONSTRUIR_PSEUDO:   'construir_pseudo',
  SALIDA_ALGORITMO:   'salida_algoritmo',
  ESTRUCTURA_CORRECTA:'estructura_correcta',
  IDENTIFICAR_MVC:    'identificar_mvc',
  IDENTIFICAR_SOLID:  'identificar_solid',
  RESPONSABILIDAD:    'responsabilidad',
  FLUJO_PETICION:     'flujo_peticion',
}

// ─── NIVELES ──────────────────────────────────────────────────────────────────
export const NIVELES = { FACIL: 'fácil', MEDIO: 'medio', DIFICIL: 'difícil' }

// ─── TEMAS ────────────────────────────────────────────────────────────────────
export const TEMAS = {
  BACKEND:        'Fundamentos del Back-end',
  HTTP:           'HTTP y protocolos',
  SERVIDORES:     'Servidores de aplicación',
  LENGUAJES:      'Lenguajes de programación web',
  ALGORITMOS:     'Algoritmos y pseudocódigo',
  ARQUITECTURA:   'Arquitectura de software',
  MVC:            'Patrón MVC',
  CAPAS:          'Arquitectura por capas',
  MICROSERVICIOS: 'Microservicios',
  SOLID:          'Principios SOLID',
  PATRONES:       'Patrones de diseño',
}

// ============================================================
// PREGUNTAS DE SELECCIÓN MÚLTIPLE / V-F / OTROS TIPOS
// ============================================================
export const PREGUNTAS = [

  // ── GUÍA 1: BACK-END ─────────────────────────────────────────────────────

  {
    id: 'g1_b_01',
    guia: 'guia1',
    tema: TEMAS.BACKEND,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 1,
    enunciado: '¿Cuál de las siguientes opciones describe mejor el concepto de back-end?',
    opciones: [
      { id: 'a', texto: 'La parte visual que ve el usuario en el navegador' },
      { id: 'b', texto: 'La parte del sistema que procesa datos, gestiona la lógica y se comunica con la base de datos', correcto: true },
      { id: 'c', texto: 'El servidor de correos electrónicos de la empresa' },
      { id: 'd', texto: 'El diseño de la interfaz de usuario (UI/UX)' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El back-end es la capa del sistema que maneja la lógica de negocio, procesa las solicitudes del cliente, gestiona la autenticación y se comunica con la base de datos.',
    pista: 'Piensa en qué ocurre "detrás de escena" cuando haces clic en un botón.',
  },

  {
    id: 'g1_b_02',
    guia: 'guia1',
    tema: TEMAS.BACKEND,
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    puntos: 5,
    orden: 2,
    enunciado: 'En la arquitectura cliente-servidor, el servidor siempre inicia la comunicación enviando datos al cliente.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero' },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'En la arquitectura cliente-servidor es el cliente quien inicia la comunicación enviando una petición (request). El servidor solo responde cuando recibe una solicitud.',
    pista: 'Recuerda quién hace la primera "llamada" en el proceso.',
  },

  {
    id: 'g1_b_03',
    guia: 'guia1',
    tema: TEMAS.BACKEND,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 3,
    enunciado: '¿Cuál de estas responsabilidades corresponde al back-end y NO al front-end?',
    opciones: [
      { id: 'a', texto: 'Mostrar un formulario HTML al usuario' },
      { id: 'b', texto: 'Aplicar estilos CSS a los elementos de la página' },
      { id: 'c', texto: 'Validar los datos recibidos y guardarlos en la base de datos', correcto: true },
      { id: 'd', texto: 'Ejecutar animaciones JavaScript en el navegador' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'Validar datos del servidor y persistirlos en la base de datos es responsabilidad del back-end. El front-end puede hacer validaciones básicas, pero la validación definitiva y el almacenamiento siempre deben ocurrir en el servidor.',
    pista: 'El back-end maneja lógica, seguridad y persistencia.',
  },

  // ── GUÍA 1: HTTP ─────────────────────────────────────────────────────────

  {
    id: 'g1_h_01',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 4,
    enunciado: '¿Cuál es la diferencia principal entre HTTP y HTTPS?',
    opciones: [
      { id: 'a', texto: 'HTTPS usa el puerto 80 y HTTP el 443' },
      { id: 'b', texto: 'HTTPS cifra los datos con TLS/SSL; HTTP los transmite sin cifrar', correcto: true },
      { id: 'c', texto: 'No hay diferencia práctica entre ellos' },
      { id: 'd', texto: 'HTTP es más rápido porque no usa cabeceras' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'HTTPS añade una capa de cifrado TLS/SSL sobre HTTP, protegiendo los datos en tránsito. HTTP usa el puerto 80 y HTTPS el 443 (no al revés).',
    pista: 'La "S" en HTTPS significa Secure (seguro).',
  },

  {
    id: 'g1_h_02',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.RELACIONAR,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 5,
    enunciado: 'Relaciona cada método HTTP con su función correcta:',
    pares: [
      { izquierda: 'GET',    derecha: 'Leer un recurso existente' },
      { izquierda: 'POST',   derecha: 'Crear un nuevo recurso' },
      { izquierda: 'PUT',    derecha: 'Reemplazar un recurso completo' },
      { izquierda: 'DELETE', derecha: 'Eliminar un recurso' },
    ],
    respuestaCorrecta: { GET: 'Leer un recurso existente', POST: 'Crear un nuevo recurso', PUT: 'Reemplazar un recurso completo', DELETE: 'Eliminar un recurso' },
    explicacion: 'Cada método HTTP tiene una semántica específica: GET lee, POST crea, PUT reemplaza completo, PATCH actualiza parcialmente y DELETE elimina.',
    pista: 'Recuerda CRUD: Create→POST, Read→GET, Update→PUT/PATCH, Delete→DELETE.',
  },

  {
    id: 'g1_h_03',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 6,
    enunciado: '¿Qué código de estado HTTP indica que una solicitud fue exitosa?',
    opciones: [
      { id: 'a', texto: '200 OK', correcto: true },
      { id: 'b', texto: '404 Not Found' },
      { id: 'c', texto: '500 Internal Server Error' },
      { id: 'd', texto: '301 Moved Permanently' },
    ],
    respuestaCorrecta: 'a',
    explicacion: '200 OK indica que la solicitud se procesó correctamente. 404 significa recurso no encontrado, 500 es error interno del servidor, 301 es redirección permanente.',
    pista: 'Los códigos 2xx siempre indican éxito.',
  },

  {
    id: 'g1_h_04',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.ORDENAR,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 7,
    enunciado: 'Ordena los pasos del ciclo de una petición HTTP desde el inicio hasta la respuesta:',
    pasosDesordenados: [
      { id: 'p3', texto: 'El servidor procesa la petición y consulta la base de datos' },
      { id: 'p1', texto: 'El usuario escribe una URL en el navegador y presiona Enter' },
      { id: 'p4', texto: 'El servidor envía la respuesta HTTP con código de estado y datos' },
      { id: 'p2', texto: 'El navegador (cliente) envía una petición HTTP al servidor' },
      { id: 'p5', texto: 'El navegador recibe la respuesta y muestra el contenido al usuario' },
    ],
    ordenCorrecto: ['p1', 'p2', 'p3', 'p4', 'p5'],
    explicacion: 'El flujo HTTP siempre es: usuario activa → cliente envía request → servidor procesa → servidor responde → cliente muestra resultado.',
    pista: 'Empieza por la acción del usuario.',
  },

  {
    id: 'g1_h_05',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 8,
    enunciado: '¿Qué código HTTP devuelve el servidor cuando el usuario no tiene permiso para acceder a un recurso (está autenticado pero no autorizado)?',
    opciones: [
      { id: 'a', texto: '401 Unauthorized' },
      { id: 'b', texto: '403 Forbidden', correcto: true },
      { id: 'c', texto: '404 Not Found' },
      { id: 'd', texto: '500 Internal Server Error' },
    ],
    respuestaCorrecta: 'b',
    explicacion: '401 se usa cuando el usuario no está autenticado (no ha iniciado sesión). 403 se usa cuando está autenticado pero no tiene permisos para ese recurso.',
    pista: 'Piensa: ¿estás autenticado pero te niegan la entrada? Eso es 403.',
  },

  {
    id: 'g1_h_06',
    guia: 'guia1',
    tema: TEMAS.HTTP,
    tipo: TIPOS.FLUJO_PETICION,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 9,
    enunciado: 'Un usuario hace clic en "Ver perfil" en una aplicación web. Ordena correctamente los pasos del flujo de la petición:',
    pasos: [
      { id: 'f1', texto: 'El navegador envía GET /api/perfil/123 con token de autenticación' },
      { id: 'f2', texto: 'El servidor valida el token JWT' },
      { id: 'f3', texto: 'El servidor consulta la base de datos por el usuario 123' },
      { id: 'f4', texto: 'La base de datos devuelve los datos del usuario' },
      { id: 'f5', texto: 'El servidor responde con 200 OK y los datos en formato JSON' },
      { id: 'f6', texto: 'El navegador muestra la información del perfil' },
    ],
    ordenCorrecto: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    explicacion: 'El flujo correcto es: petición → autenticación → consulta a BD → datos → respuesta → visualización. La validación del token siempre va antes de consultar la BD.',
    pista: 'La seguridad (validar token) siempre va antes de acceder a los datos.',
  },

  // ── GUÍA 1: SERVIDORES ───────────────────────────────────────────────────

  {
    id: 'g1_s_01',
    guia: 'guia1',
    tema: TEMAS.SERVIDORES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 10,
    enunciado: '¿Para qué se usa principalmente Nginx en una arquitectura de producción?',
    opciones: [
      { id: 'a', texto: 'Como motor de base de datos relacional' },
      { id: 'b', texto: 'Como servidor de correo electrónico' },
      { id: 'c', texto: 'Como proxy inverso y balanceador de carga', correcto: true },
      { id: 'd', texto: 'Como compilador de lenguajes de programación' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'Nginx se usa comúnmente como proxy inverso, recibiendo peticiones del exterior y distribuyéndolas hacia los servidores de aplicación (Node.js, Gunicorn, Tomcat).',
    pista: 'En la arquitectura: Internet → Nginx → Servidor de app.',
  },

  {
    id: 'g1_s_02',
    guia: 'guia1',
    tema: TEMAS.SERVIDORES,
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    puntos: 5,
    orden: 11,
    enunciado: 'Para el entorno de desarrollo local es suficiente usar el servidor integrado de Node.js o Python. Sin embargo, en producción se recomienda usar Nginx + PM2/Gunicorn.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: true },
      { id: 'falso', texto: 'Falso' },
    ],
    respuestaCorrecta: 'verdadero',
    explicacion: 'El servidor integrado es práctico para desarrollo, pero en producción Nginx gestiona el tráfico de forma eficiente y PM2/Gunicorn mantienen el proceso activo, con reinicio automático y múltiples workers.',
    pista: 'Desarrollo ≠ Producción.',
  },

  // ── GUÍA 1: LENGUAJES ────────────────────────────────────────────────────

  {
    id: 'g1_l_01',
    guia: 'guia1',
    tema: TEMAS.LENGUAJES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 12,
    enunciado: '¿Cuál de los siguientes lenguajes puede ejecutarse tanto en el navegador del usuario (cliente) como en el servidor?',
    opciones: [
      { id: 'a', texto: 'Python' },
      { id: 'b', texto: 'PHP' },
      { id: 'c', texto: 'Java' },
      { id: 'd', texto: 'JavaScript (con Node.js)', correcto: true },
    ],
    respuestaCorrecta: 'd',
    explicacion: 'JavaScript es el único lenguaje que corre nativamente en el navegador y, con Node.js, también en el servidor. Esto permite hacer desarrollo full-stack con un solo lenguaje.',
    pista: 'Node.js llevó JavaScript al servidor.',
  },

  {
    id: 'g1_l_02',
    guia: 'guia1',
    tema: TEMAS.LENGUAJES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 13,
    enunciado: 'Según las guías SENA, ¿cuál framework de Python se recomienda para construir APIs modernas con validación automática de datos?',
    opciones: [
      { id: 'a', texto: 'Django REST Framework' },
      { id: 'b', texto: 'Flask' },
      { id: 'c', texto: 'FastAPI', correcto: true },
      { id: 'd', texto: 'Laravel' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'FastAPI está diseñado para construir APIs con Python de forma rápida, con validación automática vía Pydantic y documentación integrada con OpenAPI/Swagger.',
    pista: 'Usa Pydantic para validar automáticamente los datos de entrada.',
  },

  {
    id: 'g1_l_03',
    guia: 'guia1',
    tema: TEMAS.LENGUAJES,
    tipo: TIPOS.IDENTIFICAR_ERROR,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 14,
    enunciado: 'El siguiente fragmento de código tiene un error de seguridad grave. ¿Cuál es el problema?',
    codigo: `# Registro de usuario
def registrar_usuario(nombre, contrasena):
    guardar_en_bd(nombre, contrasena)  # Guarda directamente
    return "Usuario registrado"`,
    opciones: [
      { id: 'a', texto: 'La función debería retornar True en lugar de un string' },
      { id: 'b', texto: 'La contraseña se guarda en texto plano sin cifrar', correcto: true },
      { id: 'c', texto: 'Falta un parámetro de email en la función' },
      { id: 'd', texto: 'No se valida si el nombre está vacío' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'Las contraseñas NUNCA deben guardarse en texto plano. Siempre deben cifrarse usando algoritmos como bcrypt antes de almacenarse. Si la BD es comprometida, las contraseñas quedan expuestas.',
    pista: 'Recuerda: las contraseñas siempre deben ser hasheadas con bcrypt.',
  },

  // ── GUÍA 1: ALGORITMOS ───────────────────────────────────────────────────

  {
    id: 'g1_a_01',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 15,
    enunciado: '¿Cuál es la definición correcta de un algoritmo?',
    opciones: [
      { id: 'a', texto: 'Un lenguaje de programación de alto nivel' },
      { id: 'b', texto: 'Una secuencia finita, ordenada y determinista de pasos que resuelve un problema', correcto: true },
      { id: 'c', texto: 'Un tipo de base de datos relacional' },
      { id: 'd', texto: 'Un patrón de diseño de software' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'Un algoritmo tiene tres características clave: es finito (termina), ordenado (los pasos tienen secuencia) y determinista (para la misma entrada siempre produce la misma salida).',
    pista: 'Tres palabras clave: finito, ordenado, determinista.',
  },

  {
    id: 'g1_a_02',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 16,
    enunciado: '¿Cuál es el requisito previo para poder usar la búsqueda binaria en una lista?',
    opciones: [
      { id: 'a', texto: 'La lista debe tener exactamente 100 elementos' },
      { id: 'b', texto: 'La lista debe estar ordenada', correcto: true },
      { id: 'c', texto: 'La lista no puede tener valores duplicados' },
      { id: 'd', texto: 'La lista debe estar en memoria RAM' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La búsqueda binaria divide el espacio de búsqueda a la mitad en cada paso (O(log n)), pero solo funciona en listas ordenadas. Si la lista no está ordenada, se debe usar búsqueda lineal O(n).',
    pista: 'La búsqueda binaria divide el espacio de búsqueda. ¿Qué necesitas para dividirlo correctamente?',
  },

  {
    id: 'g1_a_03',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.SALIDA_ALGORITMO,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 17,
    enunciado: '¿Cuál es la salida del siguiente algoritmo si la entrada es calificacion = 75?',
    codigo: `INICIO
  LEER calificacion
  SI calificacion >= 60 ENTONCES
    MOSTRAR "Aprobado"
  SINO
    MOSTRAR "Reprobado"
  FIN SI
FIN`,
    opciones: [
      { id: 'a', texto: 'Reprobado' },
      { id: 'b', texto: 'Aprobado', correcto: true },
      { id: 'c', texto: 'No muestra nada' },
      { id: 'd', texto: 'Error en el algoritmo' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El valor 75 es mayor o igual a 60, por lo tanto se cumple la condición y se muestra "Aprobado".',
    pista: '75 >= 60 → ¿es verdadero o falso?',
  },

  {
    id: 'g1_a_04',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.SALIDA_ALGORITMO,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 18,
    enunciado: '¿Cuál es la salida del siguiente algoritmo si numero = 4?',
    codigo: `INICIO
  LEER numero
  SI numero % 2 == 0 ENTONCES
    MOSTRAR "Par"
  SINO
    MOSTRAR "Impar"
  FIN SI
FIN`,
    opciones: [
      { id: 'a', texto: 'Impar' },
      { id: 'b', texto: 'Par', correcto: true },
      { id: 'c', texto: '0' },
      { id: 'd', texto: '4' },
    ],
    respuestaCorrecta: 'b',
    explicacion: '4 % 2 = 0 (el residuo de dividir 4 entre 2 es 0), por lo tanto se cumple la condición y se muestra "Par".',
    pista: 'El operador % calcula el residuo de la división.',
  },

  {
    id: 'g1_a_05',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.ESTRUCTURA_CORRECTA,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 19,
    enunciado: '¿Cuál es la estructura correcta para un algoritmo que lee 5 números y calcula su suma?',
    opciones: [
      {
        id: 'a',
        texto: `INICIO\n  suma = 0\n  PARA i DE 1 HASTA 5 HACER\n    LEER numero\n    suma = suma + numero\n  FIN PARA\n  MOSTRAR suma\nFIN`,
        correcto: true,
      },
      {
        id: 'b',
        texto: `INICIO\n  LEER numero\n  suma = numero * 5\n  MOSTRAR suma\nFIN`,
      },
      {
        id: 'c',
        texto: `INICIO\n  PARA i DE 1 HASTA 5 HACER\n    suma = suma + numero\n  FIN PARA\n  MOSTRAR suma\nFIN`,
      },
      {
        id: 'd',
        texto: `INICIO\n  suma = 0\n  LEER numero1, numero2, numero3, numero4, numero5\n  MOSTRAR suma\nFIN`,
      },
    ],
    respuestaCorrecta: 'a',
    explicacion: 'La opción A es correcta: inicializa suma en 0 (acumulador), usa un bucle PARA para leer cada número y acumular la suma. Las demás opciones tienen errores: B multiplica en lugar de sumar, C no inicializa suma ni lee el número, D lee pero nunca suma.',
    pista: 'Necesitas un acumulador inicializado en 0 y un bucle que lea y sume.',
  },

  {
    id: 'g1_a_06',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.MEDIO,
    puntos: 10,
    orden: 20,
    enunciado: 'La búsqueda lineal tiene una complejidad O(n), lo que significa que en el peor caso debe revisar TODOS los elementos de la lista.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero', correcto: true },
      { id: 'falso', texto: 'Falso' },
    ],
    respuestaCorrecta: 'verdadero',
    explicacion: 'En la búsqueda lineal O(n), en el peor caso el elemento buscado está al final o no existe, por lo que se revisan todos los n elementos. En una lista de 1000 elementos podría necesitar hasta 1000 comparaciones.',
    pista: 'O(n) = crece linealmente con el tamaño n de la lista.',
  },

  // ── GUÍA 3: ARQUITECTURA ─────────────────────────────────────────────────

  {
    id: 'g3_arq_01',
    guia: 'guia3',
    tema: TEMAS.ARQUITECTURA,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 1,
    enunciado: '¿Cuál es el principal beneficio de aplicar una arquitectura de software bien definida?',
    opciones: [
      { id: 'a', texto: 'Hace que el código se ejecute más rápido en todos los casos' },
      { id: 'b', texto: 'Permite organizar el sistema en componentes con responsabilidades claras, facilitando el mantenimiento y el trabajo en equipo', correcto: true },
      { id: 'c', texto: 'Elimina completamente la necesidad de probar el software' },
      { id: 'd', texto: 'Garantiza que el sistema nunca falle en producción' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La arquitectura de software organiza los componentes, define sus responsabilidades y las formas de comunicación, lo que mejora la mantenibilidad, escalabilidad, testabilidad y el trabajo colaborativo.',
    pista: 'Piensa en los 6 beneficios mencionados en la guía: Mantenibilidad, Escalabilidad, Trabajo en equipo...',
  },

  {
    id: 'g3_arq_02',
    guia: 'guia3',
    tema: TEMAS.ARQUITECTURA,
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.FACIL,
    puntos: 5,
    orden: 2,
    enunciado: 'El "código espagueti" es un término positivo que describe código bien organizado y fácil de mantener.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero' },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'El "código espagueti" es un término negativo. Describe código sin arquitectura donde todo está mezclado, los cambios en una parte rompen otras, es imposible hacer pruebas y el trabajo en equipo se vuelve caótico.',
    pista: 'El espagueti es difícil de desenredar... igual que ese tipo de código.',
  },

  // ── GUÍA 3: MVC ─────────────────────────────────────────────────────────

  {
    id: 'g3_mvc_01',
    guia: 'guia3',
    tema: TEMAS.MVC,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 3,
    enunciado: '¿Qué componente del patrón MVC gestiona los datos y la lógica de negocio?',
    opciones: [
      { id: 'a', texto: 'Vista' },
      { id: 'b', texto: 'Controlador' },
      { id: 'c', texto: 'Modelo', correcto: true },
      { id: 'd', texto: 'Router' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'El Modelo encapsula los datos y las reglas de negocio. La Vista muestra la información al usuario. El Controlador actúa como intermediario recibiendo las peticiones.',
    pista: 'Modelo = datos + lógica. Vista = presentación. Controlador = intermediario.',
  },

  {
    id: 'g3_mvc_02',
    guia: 'guia3',
    tema: TEMAS.MVC,
    tipo: TIPOS.ORDENAR,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 4,
    enunciado: 'Ordena el flujo correcto del patrón MVC cuando un usuario hace una petición:',
    pasosDesordenados: [
      { id: 'm3', texto: 'El Modelo consulta/actualiza la base de datos y devuelve los datos' },
      { id: 'm1', texto: 'El usuario envía una petición (hace clic, llena un formulario)' },
      { id: 'm5', texto: 'El usuario ve la respuesta en la interfaz' },
      { id: 'm2', texto: 'El Controlador recibe la petición y llama al Modelo' },
      { id: 'm4', texto: 'El Controlador pasa los datos a la Vista para que los muestre' },
    ],
    ordenCorrecto: ['m1', 'm2', 'm3', 'm4', 'm5'],
    explicacion: 'El flujo MVC es: Usuario → Controlador → Modelo → Controlador → Vista → Usuario. El controlador nunca envía datos directamente al usuario; siempre usa la Vista.',
    pista: 'El Controlador es el intermediario: recibe de un lado y entrega al otro.',
  },

  {
    id: 'g3_mvc_03',
    guia: 'guia3',
    tema: TEMAS.MVC,
    tipo: TIPOS.IDENTIFICAR_MVC,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 5,
    enunciado: 'Clasifica cada elemento como perteneciente al Modelo (M), Vista (V) o Controlador (C):',
    elementos: [
      { id: 'e1', texto: 'Consulta SQL para obtener productos de la BD',             respuesta: 'M' },
      { id: 'e2', texto: 'Plantilla HTML que muestra la lista de productos',         respuesta: 'V' },
      { id: 'e3', texto: 'Función que recibe la petición GET /productos',            respuesta: 'C' },
      { id: 'e4', texto: 'Validación de reglas de negocio (precio > 0)',             respuesta: 'M' },
      { id: 'e5', texto: 'Formulario HTML para crear un nuevo producto',             respuesta: 'V' },
      { id: 'e6', texto: 'Función que llama al Modelo y selecciona la Vista',        respuesta: 'C' },
    ],
    explicacion: 'Modelo: todo lo relacionado con datos y reglas de negocio. Vista: todo lo visual/presentación. Controlador: el intermediario que recibe peticiones y coordina Modelo y Vista.',
    pista: 'M=datos, V=presentación, C=coordinación.',
  },

  {
    id: 'g3_mvc_04',
    guia: 'guia3',
    tema: TEMAS.MVC,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 6,
    enunciado: 'En el flujo MVC, ¿qué ocurre primero cuando un usuario envía una petición web?',
    opciones: [
      { id: 'a', texto: 'El Modelo recibe la petición directamente y consulta la BD' },
      { id: 'b', texto: 'El Controlador recibe la petición y decide qué hacer', correcto: true },
      { id: 'c', texto: 'La Vista procesa los datos y los muestra' },
      { id: 'd', texto: 'La base de datos responde directamente al usuario' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El Controlador siempre es el punto de entrada. Recibe la petición HTTP, valida los datos de entrada, llama al Modelo para obtener/modificar datos y luego selecciona la Vista adecuada.',
    pista: 'El Controlador = portero del sistema MVC.',
  },

  // ── GUÍA 3: CAPAS ────────────────────────────────────────────────────────

  {
    id: 'g3_cap_01',
    guia: 'guia3',
    tema: TEMAS.CAPAS,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 7,
    enunciado: 'En la arquitectura por capas, ¿qué capa es la ÚNICA autorizada a interactuar directamente con la base de datos?',
    opciones: [
      { id: 'a', texto: 'Capa de Presentación' },
      { id: 'b', texto: 'Capa de Lógica de Negocio' },
      { id: 'c', texto: 'Capa de Acceso a Datos', correcto: true },
      { id: 'd', texto: 'Cualquier capa puede acceder a la BD directamente' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'En la arquitectura N-Capas, cada capa solo se comunica con la inmediatamente inferior. La Capa de Acceso a Datos (repositorios/ORM) es la única que hace consultas SQL directas, aislando al resto del sistema.',
    pista: 'Principio: solo puede comunicarse con la capa inmediatamente inferior.',
  },

  {
    id: 'g3_cap_02',
    guia: 'guia3',
    tema: TEMAS.CAPAS,
    tipo: TIPOS.IDENTIFICAR_ERROR,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 8,
    enunciado: 'El siguiente código viola la arquitectura por capas. ¿Cuál es el problema?',
    codigo: `# Capa de Presentación (Controlador)
def mostrar_productos(request):
    # Consulta directa a BD desde el controlador
    productos = db.execute("SELECT * FROM productos")
    return render("productos.html", productos)`,
    opciones: [
      { id: 'a', texto: 'La consulta SQL debería usar parámetros en lugar de texto fijo' },
      { id: 'b', texto: 'La capa de Presentación está accediendo directamente a la base de datos, saltándose la Capa de Acceso a Datos', correcto: true },
      { id: 'c', texto: 'Se debería usar ORM en lugar de SQL directo' },
      { id: 'd', texto: 'La función debería retornar JSON en lugar de HTML' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La consulta SQL debe estar en la Capa de Acceso a Datos (repositorio). La Capa de Presentación solo debería llamar a la Capa de Servicio, que a su vez llama al repositorio. Esto viola el principio de separación de responsabilidades.',
    pista: 'Recuerda: Presentación → Servicio → Acceso a Datos → BD.',
  },

  {
    id: 'g3_cap_03',
    guia: 'guia3',
    tema: TEMAS.CAPAS,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 9,
    enunciado: 'Una gran ventaja de la arquitectura por capas es que para cambiar de SQLite a PostgreSQL, ¿qué capa se debe modificar?',
    opciones: [
      { id: 'a', texto: 'Todas las capas deben modificarse' },
      { id: 'b', texto: 'Solo la Capa de Presentación' },
      { id: 'c', texto: 'Solo la Capa de Acceso a Datos', correcto: true },
      { id: 'd', texto: 'Solo la Capa de Lógica de Negocio' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'Esta es la gran ventaja de la arquitectura por capas: el aislamiento. Si solo la Capa de Acceso a Datos conoce la BD, cambiarla solo requiere modificar esa capa. Las demás capas no se enteran del cambio.',
    pista: 'El aislamiento hace que cada cambio solo afecte una capa.',
  },

  // ── GUÍA 3: MICROSERVICIOS ───────────────────────────────────────────────

  {
    id: 'g3_ms_01',
    guia: 'guia3',
    tema: TEMAS.MICROSERVICIOS,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 10,
    enunciado: '¿Cuál es la función principal de la API Gateway en una arquitectura de microservicios?',
    opciones: [
      { id: 'a', texto: 'Almacenar datos de todos los microservicios en una BD central' },
      { id: 'b', texto: 'Actuar como punto único de entrada que enruta las peticiones al microservicio correspondiente', correcto: true },
      { id: 'c', texto: 'Reemplazar la base de datos en microservicios' },
      { id: 'd', texto: 'Generar la interfaz de usuario automáticamente' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'La API Gateway es el punto único de entrada. Recibe todas las peticiones del cliente y las enruta al microservicio correcto (usuarios, productos, pedidos), también puede manejar autenticación global.',
    pista: 'Gateway = puerta de entrada única.',
  },

  {
    id: 'g3_ms_02',
    guia: 'guia3',
    tema: TEMAS.MICROSERVICIOS,
    tipo: TIPOS.VERDADERO_FALSO,
    nivel: NIVELES.MEDIO,
    puntos: 10,
    orden: 11,
    enunciado: 'En microservicios, todos los servicios deben compartir la misma base de datos central para garantizar la consistencia de los datos.',
    opciones: [
      { id: 'verdadero', texto: 'Verdadero' },
      { id: 'falso', texto: 'Falso', correcto: true },
    ],
    respuestaCorrecta: 'falso',
    explicacion: 'En microservicios, cada servicio tiene su propia base de datos. Esta independencia es una característica clave que permite escalar, desplegar y cambiar tecnología de BD por servicio de forma independiente.',
    pista: 'La independencia es uno de los pilares de los microservicios.',
  },

  // ── GUÍA 3: SOLID ────────────────────────────────────────────────────────

  {
    id: 'g3_sol_01',
    guia: 'guia3',
    tema: TEMAS.SOLID,
    tipo: TIPOS.IDENTIFICAR_SOLID,
    nivel: NIVELES.MEDIO,
    puntos: 20,
    orden: 12,
    enunciado: 'Relaciona cada letra de SOLID con su principio correcto:',
    pares: [
      { izquierda: 'S', derecha: 'Responsabilidad Única (Single Responsibility)' },
      { izquierda: 'O', derecha: 'Abierto/Cerrado (Open/Closed)' },
      { izquierda: 'L', derecha: 'Sustitución de Liskov (Liskov Substitution)' },
      { izquierda: 'I', derecha: 'Segregación de Interfaces (Interface Segregation)' },
      { izquierda: 'D', derecha: 'Inversión de Dependencias (Dependency Inversion)' },
    ],
    respuestaCorrecta: { S: 'Responsabilidad Única', O: 'Abierto/Cerrado', L: 'Sustitución de Liskov', I: 'Segregación de Interfaces', D: 'Inversión de Dependencias' },
    explicacion: 'SOLID es un acrónimo de cinco principios: S=Single Responsibility, O=Open/Closed, L=Liskov Substitution, I=Interface Segregation, D=Dependency Inversion.',
    pista: 'El más importante para empezar: S (separar clases) y D (usar interfaces).',
  },

  {
    id: 'g3_sol_02',
    guia: 'guia3',
    tema: TEMAS.SOLID,
    tipo: TIPOS.IDENTIFICAR_ERROR,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 13,
    enunciado: '¿Qué principio SOLID viola el siguiente código?',
    codigo: `class Usuario:
    def guardar_en_bd(self): ...
    def enviar_email_bienvenida(self): ...
    def generar_reporte_pdf(self): ...`,
    opciones: [
      { id: 'a', texto: 'Abierto/Cerrado (O)' },
      { id: 'b', texto: 'Sustitución de Liskov (L)' },
      { id: 'c', texto: 'Responsabilidad Única (S)', correcto: true },
      { id: 'd', texto: 'Inversión de Dependencias (D)' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'La clase Usuario tiene tres responsabilidades: persistencia (guardar_en_bd), comunicación (enviar_email) y reportes (generar_reporte_pdf). El principio S dice que cada clase debe tener una sola razón para cambiar. La solución: crear UsuarioRepository, EmailService y ReporteService.',
    pista: 'Cuenta las responsabilidades de la clase. ¿Cuántas tiene?',
  },

  {
    id: 'g3_sol_03',
    guia: 'guia3',
    tema: TEMAS.SOLID,
    tipo: TIPOS.RESPONSABILIDAD,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 14,
    enunciado: 'La clase Pedido llama directamente a EmailNotificador para enviar confirmaciones. ¿Qué principio SOLID aplica para mejorar este diseño?',
    opciones: [
      { id: 'a', texto: 'Segregación de Interfaces (I): crear interfaces más pequeñas' },
      { id: 'b', texto: 'Inversión de Dependencias (D): Pedido debe depender de una abstracción Notificador, no de EmailNotificador', correcto: true },
      { id: 'c', texto: 'Responsabilidad Única (S): separar la lógica de email en otra clase' },
      { id: 'd', texto: 'Abierto/Cerrado (O): agregar un método genérico en Pedido' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El principio D (Inversión de Dependencias) dice que los módulos de alto nivel (Pedido) no deben depender de módulos de bajo nivel (EmailNotificador). Ambos deben depender de una abstracción (interfaz Notificador). Así, Pedido puede notificar por email, SMS o push sin cambiar su código.',
    pista: 'Pedido es módulo de alto nivel, EmailNotificador es de bajo nivel. ¿Qué debe ponerse en el medio?',
  },

  {
    id: 'g3_sol_04',
    guia: 'guia3',
    tema: TEMAS.SOLID,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 15,
    enunciado: '¿Qué significa la "D" en SOLID?',
    opciones: [
      { id: 'a', texto: 'Diseño limpio (Design Clean)' },
      { id: 'b', texto: 'Delegación de responsabilidades' },
      { id: 'c', texto: 'Inversión de Dependencias (Dependency Inversion)', correcto: true },
      { id: 'd', texto: 'Distribución de servicios' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'D = Dependency Inversion Principle: los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones (interfaces o clases abstractas).',
    pista: 'Tus clases deben depender de contratos (interfaces), no de implementaciones concretas.',
  },

  // ── GUÍA 3: PATRONES ─────────────────────────────────────────────────────

  {
    id: 'g3_pat_01',
    guia: 'guia3',
    tema: TEMAS.PATRONES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.FACIL,
    puntos: 10,
    orden: 16,
    enunciado: '¿Qué patrón de diseño garantiza que una clase tenga una única instancia en toda la aplicación?',
    opciones: [
      { id: 'a', texto: 'Factory' },
      { id: 'b', texto: 'Observer' },
      { id: 'c', texto: 'Singleton', correcto: true },
      { id: 'd', texto: 'Repository' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'El patrón Singleton asegura una única instancia de la clase. Es útil para conexiones a BD, configuración global o loggers, donde necesitas exactamente un objeto compartido en toda la app.',
    pista: 'Single = uno solo. ¿Qué patrón garantiza UNA sola instancia?',
  },

  {
    id: 'g3_pat_02',
    guia: 'guia3',
    tema: TEMAS.PATRONES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 17,
    enunciado: 'El patrón Factory Method se usa para:',
    opciones: [
      { id: 'a', texto: 'Garantizar una sola instancia de una clase' },
      { id: 'b', texto: 'Crear objetos sin especificar la clase concreta a instanciar', correcto: true },
      { id: 'c', texto: 'Notificar a múltiples objetos cuando ocurre un evento' },
      { id: 'd', texto: 'Separar la interfaz de la implementación en capas' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El patrón Factory Method crea objetos sin que el código cliente conozca la clase concreta. Ejemplo: NotificadorFactory.crear("email") devuelve un EmailNotificador sin que quien llama sepa qué clase específica se instancia.',
    pista: 'Factory = fábrica. Una fábrica crea cosas sin que tú sepas exactamente cómo las hace.',
  },

  {
    id: 'g3_pat_03',
    guia: 'guia3',
    tema: TEMAS.PATRONES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.MEDIO,
    puntos: 15,
    orden: 18,
    enunciado: 'El patrón Observer permite:',
    opciones: [
      { id: 'a', texto: 'Garantizar que una clase tenga una única instancia' },
      { id: 'b', texto: 'Crear objetos de diferentes tipos con una interfaz común' },
      { id: 'c', texto: 'Que múltiples objetos sean notificados automáticamente cuando cambia el estado de un objeto', correcto: true },
      { id: 'd', texto: 'Separar el acceso a datos de la lógica de negocio' },
    ],
    respuestaCorrecta: 'c',
    explicacion: 'El patrón Observer define una relación de uno-a-muchos: cuando el objeto observable cambia su estado, notifica automáticamente a todos sus observadores. Ejemplo: un producto cambia de precio y se notifica a AlertaEmail y AlertaStock.',
    pista: 'Observer = observador. Los observadores esperan que algo cambie para reaccionar.',
  },

  {
    id: 'g3_pat_04',
    guia: 'guia3',
    tema: TEMAS.PATRONES,
    tipo: TIPOS.SELECCION_MULTIPLE,
    nivel: NIVELES.DIFICIL,
    puntos: 20,
    orden: 19,
    enunciado: 'El patrón Repository se usa para:',
    opciones: [
      { id: 'a', texto: 'Guardar versiones del código fuente' },
      { id: 'b', texto: 'Abstraer el acceso a datos detrás de una interfaz, desacoplando la lógica de negocio del almacenamiento', correcto: true },
      { id: 'c', texto: 'Crear copias de seguridad de la base de datos' },
      { id: 'd', texto: 'Organizar los archivos del proyecto en carpetas' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El patrón Repository define una interfaz para el acceso a datos (IProductoRepository con buscar_todos, guardar, etc.). La lógica de negocio solo conoce la interfaz. Esto permite cambiar la implementación (SQL, MongoDB, en memoria para tests) sin modificar el código de negocio.',
    pista: 'Repository separa "qué datos necesito" de "cómo los obtengo".',
  },

  {
    id: 'g3_pat_05',
    guia: 'guia3',
    tema: TEMAS.PATRONES,
    tipo: TIPOS.IDENTIFICAR_ERROR,
    nivel: NIVELES.DIFICIL,
    puntos: 25,
    orden: 20,
    enunciado: '¿Qué problema tiene el siguiente código respecto al patrón Abierto/Cerrado (Open/Closed)?',
    codigo: `class CalculadorDescuento:
    def calcular(self, tipo, precio):
        if tipo == "navidad":
            return precio * 0.8
        elif tipo == "verano":
            return precio * 0.9
        elif tipo == "blackfriday":
            return precio * 0.5
        # Cada nuevo tipo requiere modificar esta clase`,
    opciones: [
      { id: 'a', texto: 'Los porcentajes de descuento son incorrectos' },
      { id: 'b', texto: 'La clase viola el principio Abierto/Cerrado: cada nueva promoción obliga a modificar el código existente', correcto: true },
      { id: 'c', texto: 'Se debería usar un diccionario en lugar de ifs' },
      { id: 'd', texto: 'La función debería retornar el descuento, no el precio final' },
    ],
    respuestaCorrecta: 'b',
    explicacion: 'El principio Abierto/Cerrado dice que el código debe estar abierto para extensión pero cerrado para modificación. La solución es crear una clase abstracta Descuento con subclases DescuentoNavidad, DescuentoVerano, etc. Agregar una nueva promoción no requiere tocar el código existente.',
    pista: 'O/C = abierto para extender, cerrado para modificar. ¿Qué pasa cuando agregas un nuevo tipo de descuento?',
  },
]

// ============================================================
// RETOS DE PSEUDOCÓDIGO (Constructor)
// ============================================================
export const RETOS_PSEUDOCODIGO = [

  {
    id: 'reto_01',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.FACIL,
    puntos: 30,
    orden: 1,
    titulo: 'Verificar si una calificación es aprobatoria',
    enunciado: 'Crea un algoritmo que lea una calificación y muestre "Aprobado" si es mayor o igual a 60. Si no, muestra "Reprobado".',
    descripcionProblema: 'Necesitas leer una calificación del usuario y determinar si superó el umbral de aprobación (60 puntos).',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',      tipo: 'inicio',     texto: 'INICIO' },
      { id: 'FIN',         tipo: 'fin',         texto: 'FIN' },
      { id: 'LEER_cal',    tipo: 'leer',        texto: 'LEER calificacion' },
      { id: 'SI',          tipo: 'si',          texto: 'SI calificacion >= 60 ENTONCES' },
      { id: 'MOSTRAR_apr', tipo: 'mostrar',     texto: 'MOSTRAR "Aprobado"' },
      { id: 'SINO',        tipo: 'sino',        texto: 'SINO' },
      { id: 'MOSTRAR_rep', tipo: 'mostrar',     texto: 'MOSTRAR "Reprobado"' },
      { id: 'FIN_SI',      tipo: 'fin_si',      texto: 'FIN SI' },
      { id: 'LEER_nom',    tipo: 'leer',        texto: 'LEER nombre',         distractor: true },
      { id: 'MIENTRAS',    tipo: 'mientras',    texto: 'MIENTRAS calificacion < 0', distractor: true },
    ],
    solucion: ['INICIO', 'LEER_cal', 'SI', 'MOSTRAR_apr', 'SINO', 'MOSTRAR_rep', 'FIN_SI', 'FIN'],
    explicacion: 'El algoritmo lee la calificación, evalúa la condición (>= 60) con un SI/SINO y muestra el mensaje correspondiente. Siempre empieza con INICIO y termina con FIN.',
    pista: 'Recuerda el orden: INICIO → LEER → SI condición ENTONCES → instrucción → SINO → instrucción → FIN SI → FIN.',
  },

  {
    id: 'reto_02',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.FACIL,
    puntos: 30,
    orden: 2,
    titulo: 'Determinar si un número es par o impar',
    enunciado: 'Crea un algoritmo que lea un número entero y muestre si es "Par" o "Impar".',
    descripcionProblema: 'Un número es par si al dividirlo entre 2 el residuo es 0. Usa el operador % (módulo) para obtener el residuo.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',         tipo: 'inicio',   texto: 'INICIO' },
      { id: 'FIN',            tipo: 'fin',       texto: 'FIN' },
      { id: 'LEER_num',       tipo: 'leer',      texto: 'LEER numero' },
      { id: 'SI_par',         tipo: 'si',        texto: 'SI numero % 2 == 0 ENTONCES' },
      { id: 'MOSTRAR_par',    tipo: 'mostrar',   texto: 'MOSTRAR "Par"' },
      { id: 'SINO',           tipo: 'sino',      texto: 'SINO' },
      { id: 'MOSTRAR_imp',    tipo: 'mostrar',   texto: 'MOSTRAR "Impar"' },
      { id: 'FIN_SI',         tipo: 'fin_si',    texto: 'FIN SI' },
      { id: 'SI_mayor',       tipo: 'si',        texto: 'SI numero > 0 ENTONCES', distractor: true },
      { id: 'MOSTRAR_pos',    tipo: 'mostrar',   texto: 'MOSTRAR "Positivo"',      distractor: true },
    ],
    solucion: ['INICIO', 'LEER_num', 'SI_par', 'MOSTRAR_par', 'SINO', 'MOSTRAR_imp', 'FIN_SI', 'FIN'],
    explicacion: 'El operador % calcula el residuo de la división. Si numero % 2 == 0, el residuo es 0 y el número es par. Si el residuo es 1, es impar.',
    pista: 'Usa el operador % para obtener el residuo. Si el residuo es 0, el número es par.',
  },

  {
    id: 'reto_03',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.MEDIO,
    puntos: 40,
    orden: 3,
    titulo: 'Calcular el promedio de tres notas',
    enunciado: 'Crea un algoritmo que lea tres notas, calcule el promedio y muestre si el estudiante "Aprobó" (promedio >= 60) o "Reprobó".',
    descripcionProblema: 'Necesitas leer tres notas, sumarlas, dividir entre 3 para obtener el promedio y luego verificar si el promedio es aprobatorio.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',           tipo: 'inicio',    texto: 'INICIO' },
      { id: 'FIN',              tipo: 'fin',         texto: 'FIN' },
      { id: 'LEER_n1',          tipo: 'leer',        texto: 'LEER nota1' },
      { id: 'LEER_n2',          tipo: 'leer',        texto: 'LEER nota2' },
      { id: 'LEER_n3',          tipo: 'leer',        texto: 'LEER nota3' },
      { id: 'CALC_prom',        tipo: 'asignar',     texto: 'promedio = (nota1 + nota2 + nota3) / 3' },
      { id: 'SI_apr',           tipo: 'si',          texto: 'SI promedio >= 60 ENTONCES' },
      { id: 'MOSTRAR_apr',      tipo: 'mostrar',     texto: 'MOSTRAR "Aprobó"' },
      { id: 'SINO',             tipo: 'sino',        texto: 'SINO' },
      { id: 'MOSTRAR_rep',      tipo: 'mostrar',     texto: 'MOSTRAR "Reprobó"' },
      { id: 'FIN_SI',           tipo: 'fin_si',      texto: 'FIN SI' },
      { id: 'MOSTRAR_prom',     tipo: 'mostrar',     texto: 'MOSTRAR promedio' },
      { id: 'CALC_suma',        tipo: 'asignar',     texto: 'suma = nota1 + nota2 + nota3', distractor: true },
      { id: 'LEER_n4',          tipo: 'leer',        texto: 'LEER nota4',                   distractor: true },
    ],
    solucion: ['INICIO', 'LEER_n1', 'LEER_n2', 'LEER_n3', 'CALC_prom', 'SI_apr', 'MOSTRAR_apr', 'SINO', 'MOSTRAR_rep', 'FIN_SI', 'MOSTRAR_prom', 'FIN'],
    explicacion: 'El algoritmo lee las tres notas, calcula el promedio dividiéndolas entre 3, muestra si aprobó o reprobó, y finalmente muestra el promedio numérico.',
    pista: 'Primero lee, luego calcula, luego decide, luego muestra.',
  },

  {
    id: 'reto_04',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.MEDIO,
    puntos: 40,
    orden: 4,
    titulo: 'Validar la edad para acceso',
    enunciado: 'Crea un algoritmo que lea el nombre y la edad de una persona. Si tiene 18 años o más, muestra "Acceso permitido para [nombre]". Si no, muestra "Acceso denegado. Debes tener 18 años o más."',
    descripcionProblema: 'Valida que la persona sea mayor o igual a 18 años para permitir el acceso. Incluye el nombre en el mensaje de bienvenida.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',         tipo: 'inicio',    texto: 'INICIO' },
      { id: 'FIN',            tipo: 'fin',         texto: 'FIN' },
      { id: 'LEER_nom',       tipo: 'leer',        texto: 'LEER nombre' },
      { id: 'LEER_edad',      tipo: 'leer',        texto: 'LEER edad' },
      { id: 'SI_adult',       tipo: 'si',          texto: 'SI edad >= 18 ENTONCES' },
      { id: 'MOSTRAR_ok',     tipo: 'mostrar',     texto: 'MOSTRAR "Acceso permitido para " + nombre' },
      { id: 'SINO',           tipo: 'sino',        texto: 'SINO' },
      { id: 'MOSTRAR_no',     tipo: 'mostrar',     texto: 'MOSTRAR "Acceso denegado. Debes tener 18 años o más."' },
      { id: 'FIN_SI',         tipo: 'fin_si',      texto: 'FIN SI' },
      { id: 'SI_edad14',      tipo: 'si',          texto: 'SI edad >= 14 ENTONCES',  distractor: true },
      { id: 'LEER_correo',    tipo: 'leer',        texto: 'LEER correo',              distractor: true },
    ],
    solucion: ['INICIO', 'LEER_nom', 'LEER_edad', 'SI_adult', 'MOSTRAR_ok', 'SINO', 'MOSTRAR_no', 'FIN_SI', 'FIN'],
    explicacion: 'Primero se leen los datos (nombre y edad), luego se evalúa si edad >= 18. Si es verdadero se muestra el mensaje de acceso con el nombre; si no, el mensaje de denegación.',
    pista: 'Lee ambos datos antes de evaluar la condición.',
  },

  {
    id: 'reto_05',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.DIFICIL,
    puntos: 50,
    orden: 5,
    titulo: 'Sumar números del 1 al 10 con un bucle',
    enunciado: 'Crea un algoritmo que calcule y muestre la suma de todos los números del 1 al 10 usando un ciclo PARA.',
    descripcionProblema: 'Usa un acumulador (variable suma inicializada en 0) y un ciclo PARA que vaya del 1 al 10. En cada iteración, suma el contador al acumulador.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',         tipo: 'inicio',    texto: 'INICIO' },
      { id: 'FIN',            tipo: 'fin',         texto: 'FIN' },
      { id: 'ASIG_suma',      tipo: 'asignar',     texto: 'suma = 0' },
      { id: 'PARA',           tipo: 'para',        texto: 'PARA i DE 1 HASTA 10 HACER' },
      { id: 'ACUM',           tipo: 'asignar',     texto: 'suma = suma + i' },
      { id: 'FIN_PARA',       tipo: 'fin_para',    texto: 'FIN PARA' },
      { id: 'MOSTRAR_suma',   tipo: 'mostrar',     texto: 'MOSTRAR suma' },
      { id: 'ASIG_suma5',     tipo: 'asignar',     texto: 'suma = 0 + 5',                       distractor: true },
      { id: 'MIENTRAS',       tipo: 'mientras',    texto: 'MIENTRAS i <= 10 HACER',              distractor: true },
      { id: 'LEER_num',       tipo: 'leer',        texto: 'LEER numero',                         distractor: true },
    ],
    solucion: ['INICIO', 'ASIG_suma', 'PARA', 'ACUM', 'FIN_PARA', 'MOSTRAR_suma', 'FIN'],
    explicacion: 'El patrón acumulador: inicializar en 0, iterar con PARA, sumar en cada vuelta, mostrar al final. La suma 1+2+...+10 = 55.',
    pista: 'Necesitas: 1) inicializar el acumulador, 2) el bucle PARA, 3) la acumulación dentro del bucle, 4) mostrar el resultado FUERA del bucle.',
  },

  {
    id: 'reto_06',
    guia: 'guia3',
    tema: TEMAS.MVC,
    nivel: NIVELES.MEDIO,
    puntos: 40,
    orden: 6,
    titulo: 'Flujo de una petición en MVC',
    enunciado: 'Construye el pseudocódigo que describe el flujo de una petición GET /productos en el patrón MVC.',
    descripcionProblema: 'El usuario solicita ver la lista de productos. Debes mostrar el flujo correcto por los componentes MVC.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',         tipo: 'inicio',    texto: 'INICIO' },
      { id: 'FIN',            tipo: 'fin',         texto: 'FIN' },
      { id: 'RECV_PET',       tipo: 'proceso',     texto: 'Controlador RECIBE petición GET /productos' },
      { id: 'LLAM_MOD',       tipo: 'proceso',     texto: 'Controlador LLAMA a Modelo.obtener_productos()' },
      { id: 'MOD_BD',         tipo: 'proceso',     texto: 'Modelo CONSULTA base de datos' },
      { id: 'MOD_RET',        tipo: 'proceso',     texto: 'Modelo RETORNA lista de productos al Controlador' },
      { id: 'CTRL_VISTA',     tipo: 'proceso',     texto: 'Controlador PASA datos a Vista' },
      { id: 'VISTA_MUESTRA',  tipo: 'proceso',     texto: 'Vista GENERA respuesta HTML/JSON con los productos' },
      { id: 'RESP_USR',       tipo: 'mostrar',     texto: 'RESPONDER al usuario con la Vista generada' },
      { id: 'VISTA_BD',       tipo: 'proceso',     texto: 'Vista CONSULTA directamente la base de datos', distractor: true },
      { id: 'CTRL_BD',        tipo: 'proceso',     texto: 'Controlador CONSULTA directamente la base de datos', distractor: true },
    ],
    solucion: ['INICIO', 'RECV_PET', 'LLAM_MOD', 'MOD_BD', 'MOD_RET', 'CTRL_VISTA', 'VISTA_MUESTRA', 'RESP_USR', 'FIN'],
    explicacion: 'El flujo MVC correcto: Controlador recibe → llama al Modelo → Modelo consulta BD → Modelo retorna datos → Controlador pasa a Vista → Vista genera respuesta → se responde al usuario.',
    pista: 'La Vista NUNCA consulta la BD directamente. El Controlador NUNCA consulta la BD directamente.',
  },

  {
    id: 'reto_07',
    guia: 'guia1',
    tema: TEMAS.ALGORITMOS,
    nivel: NIVELES.DIFICIL,
    puntos: 50,
    orden: 7,
    titulo: 'Búsqueda lineal en una lista',
    enunciado: 'Crea un algoritmo de búsqueda lineal que recorra una lista de 5 productos y muestre si un producto buscado existe o no.',
    descripcionProblema: 'La búsqueda lineal recorre la lista elemento por elemento hasta encontrar el buscado o llegar al final.',
    bloquesFijos: [],
    bloquesDisponibles: [
      { id: 'INICIO',         tipo: 'inicio',    texto: 'INICIO' },
      { id: 'FIN',            tipo: 'fin',         texto: 'FIN' },
      { id: 'LEER_bus',       tipo: 'leer',        texto: 'LEER producto_buscado' },
      { id: 'ASIG_enc',       tipo: 'asignar',     texto: 'encontrado = FALSO' },
      { id: 'PARA',           tipo: 'para',        texto: 'PARA i DE 1 HASTA 5 HACER' },
      { id: 'SI_enc',         tipo: 'si',          texto: 'SI lista[i] == producto_buscado ENTONCES' },
      { id: 'ASIG_true',      tipo: 'asignar',     texto: 'encontrado = VERDADERO' },
      { id: 'FIN_SI',         tipo: 'fin_si',      texto: 'FIN SI' },
      { id: 'FIN_PARA',       tipo: 'fin_para',    texto: 'FIN PARA' },
      { id: 'SI_result',      tipo: 'si',          texto: 'SI encontrado ENTONCES' },
      { id: 'MOSTRAR_si',     tipo: 'mostrar',     texto: 'MOSTRAR "Producto encontrado"' },
      { id: 'SINO',           tipo: 'sino',        texto: 'SINO' },
      { id: 'MOSTRAR_no',     tipo: 'mostrar',     texto: 'MOSTRAR "Producto no encontrado"' },
      { id: 'FIN_SI2',        tipo: 'fin_si',      texto: 'FIN SI' },
      { id: 'ORDENAR',        tipo: 'proceso',     texto: 'ORDENAR lista',                  distractor: true },
      { id: 'DIVIDIR',        tipo: 'proceso',     texto: 'DIVIDIR lista por la mitad',     distractor: true },
    ],
    solucion: ['INICIO', 'LEER_bus', 'ASIG_enc', 'PARA', 'SI_enc', 'ASIG_true', 'FIN_SI', 'FIN_PARA', 'SI_result', 'MOSTRAR_si', 'SINO', 'MOSTRAR_no', 'FIN_SI2', 'FIN'],
    explicacion: 'La búsqueda lineal: 1) Lee el valor a buscar, 2) Inicia una bandera en FALSO, 3) Recorre toda la lista, 4) Si encuentra el elemento cambia la bandera a VERDADERO, 5) Al final muestra según la bandera.',
    pista: 'Usa una variable "bandera" (encontrado = FALSO) que cambias a VERDADERO cuando encuentras el elemento.',
  },
]

// ─── Índices para acceso rápido ───────────────────────────────────────────────
export const PREGUNTAS_POR_GUIA = {
  guia1: PREGUNTAS.filter(p => p.guia === 'guia1'),
  guia3: PREGUNTAS.filter(p => p.guia === 'guia3'),
}

export const RETOS_POR_GUIA = {
  guia1: RETOS_PSEUDOCODIGO.filter(r => r.guia === 'guia1'),
  guia3: RETOS_PSEUDOCODIGO.filter(r => r.guia === 'guia3'),
}

export const PREGUNTAS_POR_TEMA = TEMAS
  ? Object.values(TEMAS).reduce((acc, tema) => {
      acc[tema] = PREGUNTAS.filter(p => p.tema === tema)
      return acc
    }, {})
  : {}

export const TOTAL_PUNTOS_POSIBLES =
  PREGUNTAS.reduce((s, p) => s + p.puntos, 0) +
  RETOS_PSEUDOCODIGO.reduce((s, r) => s + r.puntos, 0)
