-- HC-PERF-SUPABASE-01
-- Precalcula los hilos de conocimiento de la Home para evitar reconstruir
-- el grafo relacional en cada lectura pública. La vista pública conserva
-- nombre, columnas y permisos; la fuente pesada queda interna.

create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

alter view public.home_knowledge_threads
  rename to home_knowledge_threads_live;

revoke all on public.home_knowledge_threads_live
  from anon, authenticated, service_role;

create materialized view public.home_knowledge_threads_cache as
select *
from public.home_knowledge_threads_live;

create unique index home_knowledge_threads_cache_thread_key_uidx
  on public.home_knowledge_threads_cache (thread_key);

create index home_knowledge_threads_cache_activity_priority_latest_idx
  on public.home_knowledge_threads_cache (
    activity_kind,
    priority desc,
    latest_at desc
  );

create index home_knowledge_threads_cache_latest_priority_idx
  on public.home_knowledge_threads_cache (
    latest_at desc,
    priority desc
  );

grant select on public.home_knowledge_threads_cache
  to anon, authenticated, service_role;

create view public.home_knowledge_threads
with (security_invoker = true)
as
select *
from public.home_knowledge_threads_cache;

grant select on public.home_knowledge_threads
  to anon, authenticated, service_role;

comment on view public.home_knowledge_threads is
  'Actividad de conocimiento publicada para la Home, servida desde una caché materializada de refresco periódico.';

comment on materialized view public.home_knowledge_threads_cache is
  'Caché materializada de home_knowledge_threads_live para evitar recalcular el grafo relacional en cada lectura pública.';

select cron.schedule(
  'refresh-home-knowledge-threads-cache',
  '* * * * *',
  'refresh materialized view concurrently public.home_knowledge_threads_cache'
);

notify pgrst, 'reload schema';
