-- ============================================================
-- SENA EDU – Políticas RLS para modo sin Supabase Auth
-- Ejecuta este script en el SQL Editor de Supabase
-- Permite acceso con la anon key sin autenticación de usuario
-- ============================================================

-- Deshabilitar RLS en las tablas que necesita el organizador
-- (el juego ahora usa localStorage, Supabase es opcional)

alter table public.profiles         disable row level security;
alter table public.game_sessions    disable row level security;
alter table public.game_answers     disable row level security;
alter table public.point_adjustments disable row level security;
alter table public.points_history   disable row level security;
alter table public.progress         disable row level security;
alter table public.questions        disable row level security;
alter table public.options          disable row level security;
alter table public.answers          disable row level security;

-- Dar acceso total a la anon key (rol anon de Supabase)
grant select, insert, update, delete on all tables in schema public to anon;
grant usage on schema public to anon;
grant execute on all functions in schema public to anon;
