-- ============================================================
-- SENA EDU PLATFORM – Esquema de base de datos (Supabase)
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- v2.0 – Incluye tablas del juego educativo individual
-- ============================================================

-- Habilitar extensión uuid
create extension if not exists "uuid-ossp";

-- ─── TABLA: profiles ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null default '',
  avatar_url  text,
  role        text not null default 'jugador' check (role in ('jugador', 'organizador', 'admin')),
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

create policy "Organizadores pueden actualizar puntos de jugadores"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'jugador')
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

-- Función RPC: ajustar puntos (puede ser negativo) – solo organizadores
create or replace function public.adjust_points(target_uid uuid, amount integer)
returns void language plpgsql security definer as $$
declare
  caller_role text;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role not in ('organizador', 'admin') then
    raise exception 'Acceso denegado: solo organizadores pueden ajustar puntos';
  end if;
  update public.profiles
  set points = greatest(0, points + amount),
      updated_at = now()
  where id = target_uid;
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

create policy "Sistema inserta historial propio"
  on public.points_history for insert
  with check (auth.uid() = user_id);

create policy "Organizadores ven todo el historial"
  on public.points_history for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- ─── TABLA: progress ─────────────────────────────────────────────────────────
create table if not exists public.progress (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  guide_id     text not null,
  section_id   text not null,
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
  option_id    uuid,
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

create policy "Organizadores ven todas las respuestas"
  on public.answers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- ─── TABLA: game_sessions ─────────────────────────────────────────────────────
-- Una sesión de juego por usuario (el juego individual)
create table if not exists public.game_sessions (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null unique,
  status          text not null default 'en_progreso' check (status in ('en_progreso', 'completado')),
  current_index   integer default 0,
  total_preguntas integer default 0,
  total_retos     integer default 0,
  pts_preguntas   integer default 0,
  pts_retos       integer default 0,
  pts_bonus       integer default 0,
  pts_descuento   integer default 0,
  aciertos        integer default 0,
  errores         integer default 0,
  started_at      timestamptz default now(),
  completed_at    timestamptz
);

alter table public.game_sessions enable row level security;

create policy "Ver propia sesión"
  on public.game_sessions for select
  using (auth.uid() = user_id);

create policy "Gestionar propia sesión"
  on public.game_sessions for all
  using (auth.uid() = user_id);

create policy "Organizadores ven todas las sesiones"
  on public.game_sessions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- ─── TABLA: game_answers ──────────────────────────────────────────────────────
-- Respuestas del juego (preguntas y retos)
create table if not exists public.game_answers (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  item_id         text not null,          -- ID de la pregunta o reto (de gameData.js)
  item_type       text not null check (item_type in ('pregunta', 'reto')),
  tema            text,
  guia            text,
  is_correct      boolean default false,
  pts_obtenidos   integer default 0,
  respuesta_dada  text,                   -- JSON stringificado
  answered_at     timestamptz default now(),
  unique (user_id, item_id)
);

alter table public.game_answers enable row level security;

create policy "Ver propias respuestas de juego"
  on public.game_answers for select
  using (auth.uid() = user_id);

create policy "Insertar propias respuestas de juego"
  on public.game_answers for insert
  with check (auth.uid() = user_id);

create policy "Actualizar propias respuestas de juego"
  on public.game_answers for update
  using (auth.uid() = user_id);

create policy "Organizadores ven todas las respuestas del juego"
  on public.game_answers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- ─── TABLA: point_adjustments ────────────────────────────────────────────────
-- Bonus y descuentos aplicados por organizadores
create table if not exists public.point_adjustments (
  id              uuid default uuid_generate_v4() primary key,
  jugador_id      uuid references public.profiles(id) on delete cascade not null,
  organizador_id  uuid references public.profiles(id) on delete set null,
  cantidad        integer not null,       -- positivo = bonus, negativo = descuento
  tipo            text not null check (tipo in ('bonus', 'descuento')),
  motivo          text not null,
  created_at      timestamptz default now()
);

alter table public.point_adjustments enable row level security;

create policy "Jugadores ven sus propios ajustes"
  on public.point_adjustments for select
  using (auth.uid() = jugador_id);

create policy "Organizadores ven todos los ajustes"
  on public.point_adjustments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

create policy "Organizadores insertan ajustes"
  on public.point_adjustments for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('organizador', 'admin')
    )
  );

-- ─── RPC: aplicar ajuste de puntos (bonus/descuento) ─────────────────────────
create or replace function public.apply_point_adjustment(
  p_jugador_id    uuid,
  p_cantidad      integer,
  p_tipo          text,
  p_motivo        text
) returns void language plpgsql security definer as $$
declare
  caller_role text;
  caller_id   uuid;
begin
  caller_id   := auth.uid();
  select role into caller_role from public.profiles where id = caller_id;

  if caller_role not in ('organizador', 'admin') then
    raise exception 'Acceso denegado';
  end if;

  -- Registrar ajuste
  insert into public.point_adjustments
    (jugador_id, organizador_id, cantidad, tipo, motivo)
  values
    (p_jugador_id, caller_id, p_cantidad, p_tipo, p_motivo);

  -- Actualizar puntos (sin bajar de 0)
  update public.profiles
  set points = greatest(0, points + p_cantidad),
      updated_at = now()
  where id = p_jugador_id;

  -- Insertar en historial
  insert into public.points_history (user_id, points, reason)
  values (p_jugador_id, p_cantidad, p_motivo);
end;
$$;

-- ─── RPC: guardar respuesta del juego ────────────────────────────────────────
create or replace function public.save_game_answer(
  p_item_id       text,
  p_item_type     text,
  p_tema          text,
  p_guia          text,
  p_is_correct    boolean,
  p_pts           integer,
  p_respuesta     text
) returns void language plpgsql security definer as $$
declare
  uid uuid;
begin
  uid := auth.uid();

  insert into public.game_answers
    (user_id, item_id, item_type, tema, guia, is_correct, pts_obtenidos, respuesta_dada)
  values
    (uid, p_item_id, p_item_type, p_tema, p_guia, p_is_correct, p_pts, p_respuesta)
  on conflict (user_id, item_id)
  do update set
    is_correct     = excluded.is_correct,
    pts_obtenidos  = excluded.pts_obtenidos,
    respuesta_dada = excluded.respuesta_dada,
    answered_at    = now();

  -- Actualizar sesión
  update public.game_sessions
  set
    aciertos      = aciertos + case when p_is_correct then 1 else 0 end,
    errores       = errores  + case when p_is_correct then 0 else 1 end,
    pts_preguntas = pts_preguntas + case when p_item_type = 'pregunta' then p_pts else 0 end,
    pts_retos     = pts_retos     + case when p_item_type = 'reto'     then p_pts else 0 end
  where user_id = uid;

  -- Sumar al perfil si correcto
  if p_is_correct and p_pts > 0 then
    update public.profiles
    set points = points + p_pts, updated_at = now()
    where id = uid;

    insert into public.points_history (user_id, points, reason)
    values (uid, p_pts, 'Juego: ' || p_item_id);
  end if;
end;
$$;

-- ─── Vista: ranking completo (solo organizadores) ────────────────────────────
create or replace view public.ranking_completo as
select
  p.id,
  p.full_name,
  p.role,
  p.points                                    as puntos_perfil,
  coalesce(gs.aciertos, 0)                    as aciertos,
  coalesce(gs.errores, 0)                     as errores,
  coalesce(gs.pts_preguntas, 0)               as pts_preguntas,
  coalesce(gs.pts_retos, 0)                   as pts_retos,
  coalesce(sum_adj.bonus, 0)                  as bonus,
  coalesce(sum_adj.descuento, 0)              as descuento,
  gs.status                                   as estado_juego,
  gs.started_at,
  gs.completed_at,
  (coalesce(gs.pts_preguntas,0) + coalesce(gs.pts_retos,0)
    + coalesce(sum_adj.bonus,0) + coalesce(sum_adj.descuento,0)
  )                                           as puntaje_final,
  case
    when coalesce(gs.aciertos,0) + coalesce(gs.errores,0) = 0 then 0
    else round(
      100.0 * coalesce(gs.aciertos,0) /
      (coalesce(gs.aciertos,0) + coalesce(gs.errores,0))
    )
  end                                         as porcentaje_aciertos
from public.profiles p
left join public.game_sessions gs on gs.user_id = p.id
left join lateral (
  select
    coalesce(sum(cantidad) filter (where tipo = 'bonus'),     0) as bonus,
    coalesce(sum(cantidad) filter (where tipo = 'descuento'), 0) as descuento
  from public.point_adjustments
  where jugador_id = p.id
) sum_adj on true
where p.role = 'jugador'
order by puntaje_final desc;

-- ─── Seed: preguntas en Supabase (opcional, el juego usa gameData.js local) ──
-- Las preguntas del juego están en src/data/gameData.js (sin necesidad de BD).
-- Las tablas questions/options/answers son para el cuestionario de las guías.
