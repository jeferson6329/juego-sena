# SENA EDU Platform 🎓

Plataforma educativa interactiva para las **Guías 1 y 3** de la competencia
**Construcción del Software** — Programa Análisis y Desarrollo de Software (228118).

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| **React 18** | UI / componentes |
| **Vite 5** | Build tool y dev server |
| **Tailwind CSS 3** | Estilos |
| **React Router 6** | Navegación SPA |
| **Supabase** | Auth, BD, puntos, progreso |
| **Vercel** | Despliegue |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/       # Navbar, Sidebar, AppLayout
│   ├── ui/           # CodeBlock, InfoBox, DiagramBox, SectionCard
│   ├── playground/   # PlaygroundEditor (editor + iframe live)
│   └── quiz/         # QuizEngine
├── context/
│   ├── AuthContext.jsx
│   └── ProgressContext.jsx
├── data/
│   └── quizData.js   # Preguntas locales (fallback)
├── lib/
│   └── supabase.js   # Cliente + helpers
├── pages/
│   ├── guia1/        # 6 secciones + quiz
│   ├── guia3/        # 7 secciones + quiz
│   ├── HomePage.jsx
│   ├── PlaygroundPage.jsx
│   ├── PerfilPage.jsx
│   └── LeaderboardPage.jsx
└── App.jsx
```

---

## Inicio rápido

### 1. Instalar Node.js

Descarga desde [nodejs.org](https://nodejs.org) (versión LTS).

### 2. Instalar dependencias

```bash
cd sena-edu-platform
npm install
```

### 3. Configurar Supabase (opcional para demo)

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de [supabase.com](https://supabase.com):

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Luego ejecuta el script `supabase-schema.sql` en el **SQL Editor** de tu proyecto Supabase.

> **Sin Supabase** la app funciona igual: el quiz usa datos locales y el progreso
> se maneja en memoria. Solo el ranking y los puntos persistentes requieren Supabase.

### 4. Levantar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

### 5. Build para producción

```bash
npm run build
```

---

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. En **Environment Variables** agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy** — Vercel detecta Vite automáticamente.

El archivo `vercel.json` ya incluye el rewrite para el router de React.

---

## Funcionalidades

### 📚 Contenido educativo
- **Guía 1**: Back-end, HTTP/HTTPS, servidores, lenguajes web, algoritmos (validación, búsqueda, ordenamiento, agregación)
- **Guía 3**: Arquitectura MVC, por capas, microservicios, principios SOLID (con código bien/mal), patrones de diseño (Singleton, Factory, Observer, Repository)

### 💻 Playground en vivo
- Editor de texto con soporte Tab y descarga
- iframe preview en tiempo real
- 3 ejemplos presetados: Calculadora, Burbuja animada, MVC

### 🧠 Quiz interactivo
- 7 preguntas por guía con explicaciones
- Feedback visual inmediato (correcto/incorrecto)
- Acumulación de puntos por respuesta correcta
- Pantalla de resultados con porcentaje

### 🏆 Sistema de gamificación
- Puntos por completar secciones (+15 pts) y quiz (+10 pts/pregunta)
- Sistema de niveles (1-5)
- 8 insignias desbloqueables
- Leaderboard con podio top-3

### 👤 Perfil
- Edición de nombre
- Progreso por guía con barras visuales
- Barra de nivel con XP
- Historial de secciones completadas

---

## Configuración de Supabase

El archivo `supabase-schema.sql` contiene:
- Tablas: `profiles`, `points_history`, `progress`, `questions`, `options`, `answers`
- Políticas RLS para seguridad
- Trigger automático para crear perfil al registrarse
- Función RPC `increment_points` para suma atómica de puntos
- 10 preguntas seed de ejemplo

---

## Créditos

Guías elaboradas por instructores del Centro de Diseño y Metrología — Distrito Capital SENA.
Plataforma desarrollada como material complementario para el programa 228118.
