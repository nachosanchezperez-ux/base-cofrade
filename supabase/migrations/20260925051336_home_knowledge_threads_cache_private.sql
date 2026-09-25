-- HC-PERF-SUPABASE-01 · hardening
-- Mantiene la caché materializada fuera del esquema público para que no quede
-- expuesta directamente por la Data API. La vista pública conserva la interfaz.

create schema if not exists private;

grant usage on schema private
  to anon, authenticated, service_role;

alter materialized view public.home_knowledge_threads_cache
  set schema private;

grant select on private.home_knowledge_threads_cache
  to anon, authenticated, service_role;

select cron.unschedule('refresh-home-knowledge-threads-cache');

select cron.schedule(
  'refresh-home-knowledge-threads-cache',
  '* * * * *',
  'refresh materialized view concurrently private.home_knowledge_threads_cache'
);

notify pgrst, 'reload schema';
