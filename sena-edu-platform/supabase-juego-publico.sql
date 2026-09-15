-- ============================================================
-- SENA EDU – Schema para juego público (sin Supabase Auth)
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla de resultados del juego (acceso público con anon key)
create table if not exists public.resultados_juego (
  id           uuid default gen_random_uuid() primary key,
  nombre       text not null,
  aciertos     integer default 0,
  errores      integer default 0,
  pts_juego    integer default 0,
  pts_bonus    integer default 0,
  pts_descuento integer default 0,
  puntaje_final integer default 0,
  pct_aciertos  integer default 0,
  estado        text default 'en_progreso' check (estado in ('en_progreso','completado')),
  respuestas    jsonb default '{}',
  ajustes       jsonb default '[]',
  iniciado_at   timestamptz default now(),
  actualizado_at timestamptz default now(),
  unique(nombre)
);

-- Sin RLS — acceso público con anon key
alter table public.resultados_juego disable row level security;

-- Dar acceso completo al rol anon
grant select, insert, update, delete
  on public.resultados_juego to anon, authenticated;

-- Tabla de ajustes de puntos por el organizador
create table if not exists public.ajustes_puntos (
  id             uuid default gen_random_uuid() primary key,
  nombre_jugador text not null,
  cantidad       integer not null,
  tipo           text not null check (tipo in ('bonus','descuento')),
  motivo         text not null,
  aplicado_at    timestamptz default now()
);

alter table public.ajustes_puntos disable row level security;
grant select, insert on public.ajustes_puntos to anon, authenticated;
