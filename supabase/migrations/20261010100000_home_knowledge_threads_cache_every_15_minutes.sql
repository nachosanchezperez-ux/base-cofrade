-- La caché de hilos de la Home se refrescaba cada minuto y era la consulta de mayor
-- coste acumulado de la base de datos. Cada 15 minutos basta para su uso editorial.
-- En producción el cambio se hizo antes con cron.alter_job; esta migración lo deja
-- también en el historial para que las bases nuevas y las Preview Branches coincidan.

select cron.unschedule('refresh-home-knowledge-threads-cache');

select cron.schedule(
  'refresh-home-knowledge-threads-cache',
  '*/15 * * * *',
  'refresh materialized view concurrently private.home_knowledge_threads_cache'
);
