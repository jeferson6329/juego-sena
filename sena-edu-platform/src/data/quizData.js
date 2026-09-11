// Preguntas locales (fallback cuando Supabase no está configurado)
// Las preguntas reales viven en Supabase (supabase-schema.sql)

export const QUIZ_LOCAL = {
  guia1: [
    {
      id: 'q1g1', points: 10, order_index: 1,
      question: '¿Cuál es la diferencia principal entre HTTP y HTTPS?',
      explanation: 'HTTPS añade cifrado TLS/SSL sobre HTTP, protegiendo los datos en tránsito.',
      options: [
        { id: 'a', text: 'HTTPS usa el puerto 80 y HTTP el 443', is_correct: false },
        { id: 'b', text: 'HTTPS cifra los datos con TLS/SSL; HTTP no cifra', is_correct: true },
        { id: 'c', text: 'No hay diferencia, son sinónimos', is_correct: false },
        { id: 'd', text: 'HTTP es más rápido porque no tiene cabeceras', is_correct: false },
      ],
    },
    {
      id: 'q2g1', points: 10, order_index: 2,
      question: '¿Qué método HTTP se usa normalmente para crear un nuevo recurso?',
      explanation: 'POST crea recursos. PUT/PATCH actualizan. DELETE elimina. GET lee.',
      options: [
        { id: 'a', text: 'GET', is_correct: false },
        { id: 'b', text: 'DELETE', is_correct: false },
        { id: 'c', text: 'POST', is_correct: true },
        { id: 'd', text: 'OPTIONS', is_correct: false },
      ],
    },
    {
      id: 'q3g1', points: 10, order_index: 3,
      question: '¿Qué es un algoritmo?',
      explanation: 'Un algoritmo es una secuencia finita, ordenada y determinista de pasos que resuelve un problema.',
      options: [
        { id: 'a', text: 'Un lenguaje de programación', is_correct: false },
        { id: 'b', text: 'Una secuencia finita de pasos que resuelve un problema', is_correct: true },
        { id: 'c', text: 'Un tipo de base de datos', is_correct: false },
        { id: 'd', text: 'Un patrón de diseño', is_correct: false },
      ],
    },
    {
      id: 'q4g1', points: 10, order_index: 4,
      question: '¿Cuál de los siguientes lenguajes puede correr tanto en el navegador como en el servidor?',
      explanation: 'JavaScript con Node.js es el único lenguaje que funciona en ambos entornos (cliente y servidor).',
      options: [
        { id: 'a', text: 'Python', is_correct: false },
        { id: 'b', text: 'PHP', is_correct: false },
        { id: 'c', text: 'Java', is_correct: false },
        { id: 'd', text: 'JavaScript (Node.js)', is_correct: true },
      ],
    },
    {
      id: 'q5g1', points: 10, order_index: 5,
      question: 'En la búsqueda binaria, ¿cuál es el requisito previo de la lista?',
      explanation: 'La búsqueda binaria solo funciona en listas ordenadas. Divide el espacio de búsqueda a la mitad en cada paso → O(log n).',
      options: [
        { id: 'a', text: 'La lista debe tener exactamente 100 elementos', is_correct: false },
        { id: 'b', text: 'La lista debe estar ordenada', is_correct: true },
        { id: 'c', text: 'La lista no puede tener duplicados', is_correct: false },
        { id: 'd', text: 'La lista debe estar en memoria RAM', is_correct: false },
      ],
    },
    {
      id: 'q6g1', points: 10, order_index: 6,
      question: '¿Qué código de estado HTTP indica que un recurso no fue encontrado?',
      explanation: '404 Not Found indica que el servidor no encontró el recurso solicitado. 200 = éxito, 500 = error de servidor.',
      options: [
        { id: 'a', text: '200 OK', is_correct: false },
        { id: 'b', text: '500 Internal Server Error', is_correct: false },
        { id: 'c', text: '404 Not Found', is_correct: true },
        { id: 'd', text: '301 Moved Permanently', is_correct: false },
      ],
    },
    {
      id: 'q7g1', points: 10, order_index: 7,
      question: '¿Cuál es el framework de Python diseñado para APIs modernas con validación automática?',
      explanation: 'FastAPI está diseñado para construir APIs con Python de forma rápida, con validación automática vía Pydantic.',
      options: [
        { id: 'a', text: 'Django', is_correct: false },
        { id: 'b', text: 'Flask', is_correct: false },
        { id: 'c', text: 'FastAPI', is_correct: true },
        { id: 'd', text: 'Laravel', is_correct: false },
      ],
    },
  ],

  guia3: [
    {
      id: 'q1g3', points: 10, order_index: 1,
      question: '¿Qué componente del patrón MVC gestiona los datos y la lógica de negocio?',
      explanation: 'El Modelo encapsula los datos y las reglas de negocio. La Vista muestra la interfaz. El Controlador coordina.',
      options: [
        { id: 'a', text: 'Vista', is_correct: false },
        { id: 'b', text: 'Controlador', is_correct: false },
        { id: 'c', text: 'Modelo', is_correct: true },
        { id: 'd', text: 'Router', is_correct: false },
      ],
    },
    {
      id: 'q2g3', points: 10, order_index: 2,
      question: 'En el flujo MVC, ¿qué ocurre primero cuando el usuario envía una petición?',
      explanation: 'El Controlador recibe la petición del usuario, luego consulta al Modelo y finalmente selecciona la Vista.',
      options: [
        { id: 'a', text: 'El Modelo recibe la petición directamente', is_correct: false },
        { id: 'b', text: 'El Controlador recibe la petición', is_correct: true },
        { id: 'c', text: 'La Vista procesa los datos', is_correct: false },
        { id: 'd', text: 'La BD responde al usuario', is_correct: false },
      ],
    },
    {
      id: 'q3g3', points: 10, order_index: 3,
      question: '¿Qué significa la "S" en los principios SOLID?',
      explanation: 'S = Single Responsibility Principle: una clase debe tener una sola razón para cambiar.',
      options: [
        { id: 'a', text: 'Segregación de Interfaces', is_correct: false },
        { id: 'b', text: 'Sustitución de Liskov', is_correct: false },
        { id: 'c', text: 'Single Responsibility (Responsabilidad Única)', is_correct: true },
        { id: 'd', text: 'Servicios Separados', is_correct: false },
      ],
    },
    {
      id: 'q4g3', points: 10, order_index: 4,
      question: '¿Qué principio SOLID dice que los módulos deben depender de abstracciones, no de implementaciones concretas?',
      explanation: 'D = Dependency Inversion: los módulos de alto nivel no deben depender de los de bajo nivel; ambos deben depender de abstracciones.',
      options: [
        { id: 'a', text: 'Abierto/Cerrado', is_correct: false },
        { id: 'b', text: 'Segregación de Interfaces', is_correct: false },
        { id: 'c', text: 'Responsabilidad Única', is_correct: false },
        { id: 'd', text: 'Inversión de Dependencias', is_correct: true },
      ],
    },
    {
      id: 'q5g3', points: 10, order_index: 5,
      question: '¿Cuál es la función de la API Gateway en microservicios?',
      explanation: 'La API Gateway es el punto único de entrada que enruta las peticiones del cliente hacia el microservicio correspondiente.',
      options: [
        { id: 'a', text: 'Almacenar datos de todos los microservicios', is_correct: false },
        { id: 'b', text: 'Punto único de entrada que enruta peticiones a microservicios', is_correct: true },
        { id: 'c', text: 'Reemplazar la base de datos', is_correct: false },
        { id: 'd', text: 'Generar la interfaz de usuario', is_correct: false },
      ],
    },
    {
      id: 'q6g3', points: 10, order_index: 6,
      question: '¿Qué patrón de diseño garantiza que una clase tenga una sola instancia en toda la aplicación?',
      explanation: 'El patrón Singleton asegura una única instancia. Es útil para conexiones a BD, configuración global o loggers.',
      options: [
        { id: 'a', text: 'Factory', is_correct: false },
        { id: 'b', text: 'Observer', is_correct: false },
        { id: 'c', text: 'Singleton', is_correct: true },
        { id: 'd', text: 'Repository', is_correct: false },
      ],
    },
    {
      id: 'q7g3', points: 10, order_index: 7,
      question: 'En la arquitectura por capas, ¿qué capa SOLO puede interactuar con la base de datos?',
      explanation: 'La Capa de Acceso a Datos (Repositorio/DAL) es la única autorizada a hacer consultas SQL directas. Esto aísla el resto del sistema.',
      options: [
        { id: 'a', text: 'Capa de Presentación', is_correct: false },
        { id: 'b', text: 'Capa de Lógica de Negocio', is_correct: false },
        { id: 'c', text: 'Capa de Acceso a Datos', is_correct: true },
        { id: 'd', text: 'Cualquier capa puede hacerlo', is_correct: false },
      ],
    },
  ],
}
