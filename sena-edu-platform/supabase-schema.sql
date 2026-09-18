-- ============================================================
-- SENA EDU PLATFORM – Schema unificado de base de datos
-- Ejecuta este script COMPLETO en el SQL Editor de Supabase
-- (Project → SQL Editor → New query → pegar → Run)
-- ============================================================
-- Tablas incluidas:
--   1. resultados_juego   — resultados permanentes por jugador
--   2. ajustes_puntos     — bonus y descuentos del organizador
--   3. sesiones_vivo      — sesiones de juego en vivo (temporales)
--   4. jugadores_vivo     — jugadores conectados en tiempo real
-- ============================================================

-- ─── Extensiones ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- Grant al schema public (necesario para anon key sin autenticación)
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- ═══════════════════════════════════════════════════════════════
-- BLOQUE 1: RESULTADOS PERMANENTES DEL JUEGO
-- ═══════════════════════════════════════════════════════════════

-- Tabla: resultados_juego
-- Un registro por jugador. Se actualiza en tiempo real mientras juega.
-- Persiste aunque el jugador salga del enlace.
create table if not exists public.resultados_juego (
  id              uuid default gen_random_uuid() primary key,
  nombre          text not null,
  aciertos        integer      default 0,
  errores         integer      default 0,
  pts_juego       integer      default 0,
  pts_bonus       integer      default 0,
  pts_descuento   integer      default 0,
  puntaje_final   integer      default 0,
  pct_aciertos    integer      default 0,
  estado          text         default 'en_progreso'
                    check (estado in ('en_progreso', 'completado')),
  respuestas      jsonb        default '{}',
  ajustes         jsonb        default '[]',
  iniciado_at     timestamptz  default now(),
  actualizado_at  timestamptz  default now(),
  unique (nombre)
);

alter table public.resultados_juego disable row level security;
grant all privileges on public.resultados_juego to anon;
grant all privileges on public.resultados_juego to authenticated;
grant all privileges on public.resultados_juego to service_role;

-- Tabla: ajustes_puntos
-- Registro de cada bonus o descuento aplicado por el organizador.
create table if not exists public.ajustes_puntos (
  id              uuid default gen_random_uuid() primary key,
  nombre_jugador  text         not null,
  cantidad        integer      not null,   -- positivo = bonus, negativo = descuento
  tipo            text         not null check (tipo in ('bonus', 'descuento')),
  motivo          text         not null,
  aplicado_at     timestamptz  default now()
);

alter table public.ajustes_puntos disable row level security;
grant all privileges on public.ajustes_puntos to anon;
grant all privileges on public.ajustes_puntos to authenticated;
grant all privileges on public.ajustes_puntos to service_role;

-- ═══════════════════════════════════════════════════════════════
-- BLOQUE 2: SESIONES EN VIVO (TEMPORALES)
-- ═══════════════════════════════════════════════════════════════

-- Tabla: sesiones_vivo
-- Una fila por sesión creada por el admin.
-- Se marca como inactiva al terminar; los jugadores se eliminan en cascada.
create table if not exists public.sesiones_vivo (
  id          uuid default gen_random_uuid() primary key,
  codigo      text         not null unique,
  activa      boolean      default true,
  -- Bonus activo para la próxima pregunta
  -- null = ninguno | 'doble_o_nada' | 'cincuenta_cincuenta'
  bonus_activo  text         default null
                  check (bonus_activo in ('doble_o_nada', 'cincuenta_cincuenta', null)),
  bonus_usado   boolean      default false,  -- se marca true cuando el primer jugador responde
  creada_at   timestamptz  default now(),
  cerrada_at  timestamptz
);

alter table public.sesiones_vivo disable row level security;
grant all privileges on public.sesiones_vivo to anon;
grant all privileges on public.sesiones_vivo to authenticated;
grant all privileges on public.sesiones_vivo to service_role;

-- Si la tabla ya existía, agregar las columnas de bonus
alter table public.sesiones_vivo
  add column if not exists bonus_activo  text default null
    check (bonus_activo in ('doble_o_nada', 'cincuenta_cincuenta', null)),
  add column if not exists bonus_usado   boolean default false;

-- Tabla: jugadores_vivo
-- Un jugador por fila dentro de una sesión activa.
-- Se ELIMINA automáticamente cuando el jugador cierra la pestaña (beforeunload).
-- Al cerrar la sesión, se eliminan todos en cascada.
create table if not exists public.jugadores_vivo (
  id               uuid default gen_random_uuid() primary key,
  codigo_sesion    text         not null
                     references public.sesiones_vivo(codigo) on delete cascade,
  nombre           text         not null,
  aciertos         integer      default 0,
  errores          integer      default 0,
  pts_juego        integer      default 0,
  pts_bonus        integer      default 0,
  pts_descuento    integer      default 0,
  puntaje_final    integer      default 0,
  pct_aciertos     integer      default 0,
  pregunta_actual  integer      default 0,
  total_preguntas  integer      default 0,
  estado           text         default 'jugando'
                     check (estado in ('jugando', 'terminado')),
  respuestas       jsonb        default '{}',
  ajustes          jsonb        default '[]',
  unido_at         timestamptz  default now(),
  actualizado_at   timestamptz  default now(),
  unique (codigo_sesion, nombre)
);

alter table public.jugadores_vivo disable row level security;
grant all privileges on public.jugadores_vivo to anon;
grant all privileges on public.jugadores_vivo to authenticated;
grant all privileges on public.jugadores_vivo to service_role;

-- ═══════════════════════════════════════════════════════════════
-- BLOQUE 3: FUNCIONES DE UTILIDAD
-- ═══════════════════════════════════════════════════════════════

-- Limpiar sesiones inactivas de más de 24 horas
-- (ejecutar manualmente o programar como cron en Supabase)
create or replace function public.limpiar_sesiones_viejas()
returns void language plpgsql as $$
begin
  delete from public.sesiones_vivo
  where activa = false
    and cerrada_at < now() - interval '24 hours';
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- BLOQUE 4: REALTIME
-- ═══════════════════════════════════════════════════════════════
-- Activa Realtime para el panel en vivo del organizador.
-- Si ya están en la publicación, estas líneas son seguras (no fallan).
alter publication supabase_realtime add table public.jugadores_vivo;
alter publication supabase_realtime add table public.sesiones_vivo;

-- ═══════════════════════════════════════════════════════════════
-- RESUMEN DE TABLAS Y SU USO
-- ═══════════════════════════════════════════════════════════════
--
-- resultados_juego:
--   • Se actualiza cada vez que el jugador responde una pregunta.
--   • Estado: 'en_progreso' mientras juega, 'completado' al terminar.
--   • El organizador la consulta desde /organizador/ranking y /estadisticas.
--   • NO se borra cuando el jugador sale → historial permanente.
--
-- ajustes_puntos:
--   • El organizador registra bonus (+) y descuentos (-) aquí.
--   • Se refleja en puntaje_final de resultados_juego.
--
-- sesiones_vivo:
--   • El admin crea una sesión con un código único (6 letras).
--   • Los jugadores se unen con /juego?codigo=XXXXXX
--   • Al cerrar la sesión → activa = false → jugadores_vivo se limpia.
--considero que los cuadros de secciones echa progreso guía 1 progreso guía 2 y total completados es innecesario ya que como veníamos diciendo las guías son solo educativas no necesitan confirmación de lectura ni nada 
-- jugadores_vivo:
--   • Temporal: existe solo mientras el jugador está en la página.
--   • beforeunload → DELETE de la fila del jugador.
--   • Supabase Realtime notifica al admin cada cambio en tiempo real.
--   • El admin ve el progreso pregunta a pregunta desde /vivo.
--
