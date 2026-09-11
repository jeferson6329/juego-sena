-- ============================================================
-- SENA EDU PLATFORM – Esquema de base de datos (Supabase)
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Habilitar extensión uuid
create extension if not exists "uuid-ossp";

-- ─── TABLA: profiles ─────────────────────────────────────────────────────────
-- Extiende auth.users con datos del aprendiz
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null default '',
  avatar_url  text,
  role        text not null default 'aprendiz' check (role in ('aprendiz', 'instructor', 'admin')),
  points      integer not null default 0,
  badges      text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfil visible por todos los autenticados"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Cada usuario edita su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'aprendiz')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Función RPC: incrementar puntos de forma atómica
create or replace function public.increment_points(uid uuid, amount integer)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set points = points + amount,
      updated_at = now()
  where id = uid;
end;
$$;

-- ─── TABLA: points_history ────────────────────────────────────────────────────
create table if not exists public.points_history (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  points      integer not null,
  reason      text not null,
  created_at  timestamptz default now()
);

alter table public.points_history enable row level security;

create policy "Ver propio historial"
  on public.points_history for select
  using (auth.uid() = user_id);

create policy "Sistema inserta historial"
  on public.points_history for insert
  with check (auth.uid() = user_id);

-- ─── TABLA: progress ─────────────────────────────────────────────────────────
create table if not exists public.progress (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  guide_id     text not null,   -- ej: 'guia1' | 'guia3'
  section_id   text not null,   -- ej: 'http-intro' | 'mvc-patron'
  completed    boolean default false,
  completed_at timestamptz,
  unique (user_id, guide_id, section_id)
);

alter table public.progress enable row level security;

create policy "Ver propio progreso"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Gestionar propio progreso"
  on public.progress for all
  using (auth.uid() = user_id);

-- ─── TABLA: questions ────────────────────────────────────────────────────────
create table if not exists public.questions (
  id           uuid default uuid_generate_v4() primary key,
  guide_id     text not null,
  section_id   text,
  question     text not null,
  explanation  text,
  points       integer default 10,
  order_index  integer default 0,
  created_at   timestamptz default now()
);

alter table public.questions enable row level security;

create policy "Preguntas visibles para autenticados"
  on public.questions for select
  using (auth.role() = 'authenticated');

-- ─── TABLA: options ──────────────────────────────────────────────────────────
create table if not exists public.options (
  id           uuid default uuid_generate_v4() primary key,
  question_id  uuid references public.questions(id) on delete cascade not null,
  text         text not null,
  is_correct   boolean default false
);

alter table public.options enable row level security;

create policy "Opciones visibles para autenticados"
  on public.options for select
  using (auth.role() = 'authenticated');

-- ─── TABLA: answers ──────────────────────────────────────────────────────────
create table if not exists public.answers (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  question_id  uuid references public.questions(id) on delete cascade not null,
  option_id    uuid references public.options(id) on delete cascade,
  is_correct   boolean default false,
  answered_at  timestamptz default now(),
  unique (user_id, question_id)
);

alter table public.answers enable row level security;

create policy "Ver propias respuestas"
  on public.answers for select
  using (auth.uid() = user_id);

create policy "Insertar propias respuestas"
  on public.answers for insert
  with check (auth.uid() = user_id);

create policy "Actualizar propias respuestas"
  on public.answers for update
  using (auth.uid() = user_id);

-- ─── DATOS SEMILLA: preguntas Guía 1 ─────────────────────────────────────────
-- Insertar algunas preguntas de ejemplo (ajusta los UUIDs si quieres fijos)

insert into public.questions (guide_id, section_id, question, explanation, points, order_index)
values
  ('guia1','http','¿Cuál es la diferencia principal entre HTTP y HTTPS?','HTTPS añade cifrado TLS/SSL sobre HTTP, protegiendo los datos en tránsito entre cliente y servidor.',10,1),
  ('guia1','http','¿Qué método HTTP se usa normalmente para crear un nuevo recurso?','POST se usa para crear recursos; PUT/PATCH para actualizar; DELETE para eliminar; GET para leer.',10,2),
  ('guia1','algoritmos','¿Qué es un algoritmo?','Un algoritmo es una secuencia finita, ordenada y determinista de pasos que resuelve un problema concreto.',10,3),
  ('guia1','lenguajes','¿Cuál de los siguientes lenguajes corre tanto en el navegador como en el servidor?','JavaScript con Node.js es el único lenguaje que puede ejecutarse en ambos entornos (full-stack).',10,4),
  ('guia1','lenguajes','¿Qué framework de Python se recomienda para APIs rápidas y modernas?','FastAPI está diseñado para construir APIs con Python de forma rápida, con validación automática y documentación integrada.',10,5),
  ('guia3','mvc','¿Qué componente del patrón MVC gestiona los datos y la lógica de negocio?','El Modelo encapsula los datos y las reglas de negocio; la Vista muestra la información; el Controlador coordina.',10,1),
  ('guia3','mvc','En el flujo MVC, ¿qué ocurre primero cuando el usuario envía una petición?','El Controlador recibe la petición del usuario/navegador, luego consulta al Modelo y finalmente selecciona la Vista.',10,2),
  ('guia3','solid','¿Qué significa la "S" en los principios SOLID?','S = Single Responsibility Principle: una clase debe tener una sola razón para cambiar.',10,3),
  ('guia3','solid','¿Qué principio SOLID dice que las clases deben depender de abstracciones y no de implementaciones concretas?','D = Dependency Inversion Principle: los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones.',10,4),
  ('guia3','microservicios','¿Cuál es la función de la API Gateway en una arquitectura de microservicios?','La API Gateway actúa como punto único de entrada que enruta las peticiones del cliente hacia el microservicio correspondiente.',10,5);

-- Ahora inserta las opciones para cada pregunta
-- (Para simplificar el seed, usa DO block con variables)

do $$
declare
  q_id uuid;
begin
  -- Q1: HTTP vs HTTPS
  select id into q_id from public.questions where question like '¿Cuál es la diferencia principal%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'HTTPS usa el puerto 80 y HTTP el 443', false),
    (q_id, 'HTTPS cifra los datos con TLS/SSL; HTTP no', true),
    (q_id, 'No hay diferencia, son sinónimos', false),
    (q_id, 'HTTP es más rápido porque no tiene cabeceras', false);

  -- Q2: Método HTTP POST
  select id into q_id from public.questions where question like '¿Qué método HTTP se usa%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'GET', false),
    (q_id, 'DELETE', false),
    (q_id, 'POST', true),
    (q_id, 'OPTIONS', false);

  -- Q3: Algoritmo
  select id into q_id from public.questions where question like '¿Qué es un algoritmo%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Un lenguaje de programación', false),
    (q_id, 'Una secuencia finita de pasos que resuelve un problema', true),
    (q_id, 'Un tipo de base de datos', false),
    (q_id, 'Un patrón de diseño', false);

  -- Q4: JS full-stack
  select id into q_id from public.questions where question like '¿Cuál de los siguientes lenguajes corre tanto%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Python', false),
    (q_id, 'PHP', false),
    (q_id, 'Java', false),
    (q_id, 'JavaScript (Node.js)', true);

  -- Q5: FastAPI
  select id into q_id from public.questions where question like '¿Qué framework de Python%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Django', false),
    (q_id, 'Flask', false),
    (q_id, 'FastAPI', true),
    (q_id, 'Laravel', false);

  -- Q6: MVC - Modelo
  select id into q_id from public.questions where question like '¿Qué componente del patrón MVC gestiona%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Vista', false),
    (q_id, 'Controlador', false),
    (q_id, 'Modelo', true),
    (q_id, 'Router', false);

  -- Q7: MVC flujo
  select id into q_id from public.questions where question like 'En el flujo MVC%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'El Modelo recibe la petición directamente', false),
    (q_id, 'El Controlador recibe la petición', true),
    (q_id, 'La Vista procesa los datos', false),
    (q_id, 'La base de datos responde al usuario', false);

  -- Q8: SOLID S
  select id into q_id from public.questions where question like '¿Qué significa la "S"%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Segregación de Interfaces', false),
    (q_id, 'Sustitución de Liskov', false),
    (q_id, 'Single Responsibility (Responsabilidad Única)', true),
    (q_id, 'Servicios Separados', false);

  -- Q9: SOLID D
  select id into q_id from public.questions where question like '¿Qué principio SOLID dice que las clases%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Abierto/Cerrado', false),
    (q_id, 'Segregación de Interfaces', false),
    (q_id, 'Responsabilidad Única', false),
    (q_id, 'Inversión de Dependencias', true);

  -- Q10: API Gateway
  select id into q_id from public.questions where question like '¿Cuál es la función de la API Gateway%';
  insert into public.options (question_id, text, is_correct) values
    (q_id, 'Almacenar todos los datos de los microservicios', false),
    (q_id, 'Punto único de entrada que enruta peticiones a microservicios', true),
    (q_id, 'Reemplazar la base de datos en microservicios', false),
    (q_id, 'Generar la interfaz de usuario', false);
end $$;
