-- ============================================================
-- SENA EDU – Juego en vivo (sesiones temporales)
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================================

-- Habilitar Realtime en las tablas que lo necesitan
-- (Supabase → Database → Replication → supabase_realtime)

-- ─── Tabla: sesiones_vivo ────────────────────────────────────────────────────
-- Una fila por sesión de juego creada por el admin
create table if not exists public.sesiones_vivo (
  id           uuid default gen_random_uuid() primary key,
  codigo       text not null unique,          -- código de 6 letras, ej: "ABC123"
  activa       boolean default true,
  creada_at    timestamptz default now(),
  cerrada_at   timestamptz
);

alter table public.sesiones_vivo disable row level security;
grant select, insert, update, delete on public.sesiones_vivo to anon, authenticated;

-- ─── Tabla: jugadores_vivo ───────────────────────────────────────────────────
-- Un jugador por fila. Se ELIMINA cuando el jugador cierra la sesión.
-- session_id hace referencia a sesiones_vivo.codigo (no UUID para simplicidad)
create table if not exists public.jugadores_vivo (
  id              uuid default gen_random_uuid() primary key,
  codigo_sesion   text not null references public.sesiones_vivo(codigo) on delete cascade,
  nombre          text not null,
  aciertos        integer default 0,
  errores         integer default 0,
  pts_juego       integer default 0,
  pts_bonus       integer default 0,
  pts_descuento   integer default 0,
  puntaje_final   integer default 0,
  pct_aciertos    integer default 0,
  pregunta_actual integer default 0,         -- índice de la pregunta actual
  total_preguntas integer default 0,
  estado          text default 'jugando' check (estado in ('jugando','terminado')),
  respuestas      jsonb default '{}',         -- { itemId: { isCorrect, pts } }
  ajustes         jsonb default '[]',
  unido_at        timestamptz default now(),
  actualizado_at  timestamptz default now(),
  unique(codigo_sesion, nombre)
);

alter table public.jugadores_vivo disable row level security;
grant select, insert, update, delete on public.jugadores_vivo to anon, authenticated;

-- ─── Función: limpiar sesiones viejas (opcional) ─────────────────────────────
-- Elimina jugadores de sesiones cerradas hace más de 24h
create or replace function public.limpiar_sesiones_viejas()
returns void language plpgsql as $$
begin
  delete from public.sesiones_vivo
  where activa = false
    and cerrada_at < now() - interval '24 hours';
end;
$$;

-- ─── Habilitar Realtime en jugadores_vivo ────────────────────────────────────
-- En Supabase Dashboard → Database → Replication, activa:
--   public.jugadores_vivo  (INSERT, UPDATE, DELETE)
-- O ejecuta:
alter publication supabase_realtime add table public.jugadores_vivo;
alter publication supabase_realtime add table public.sesiones_vivo;
