-- Reversión de calle-real-publicacion.sql (vuelve todo a borrador y retira el periodo nuevo).
begin;
delete from public.source_links where music_accompaniment_period_id = '7a5c0e05-2026-4012-8000-0000000061a2';
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000061a2';
delete from public.sources where id = '7a5c0e05-2026-4012-8000-00000000ca12';
update public.image_steps set status = 'draft' where id::text like '7a5c0e05-2026-4012-8000-0000000005a%';
update public.brotherhood_steps set status = 'draft' where brotherhood_entity_id = 'c6100000-0000-4000-8000-000000000007';
update public.brotherhood_images set status = 'draft' where brotherhood_entity_id = 'c6100000-0000-4000-8000-000000000007';
update public.entities set status = 'draft' where id in ('c6100000-0000-4000-8000-000000000007',
  '7a5c0e05-2026-4012-8000-0000000057e1','7a5c0e05-2026-4012-8000-0000000057e2','7a5c0e05-2026-4012-8000-0000000057e3',
  '7a5c0e05-2026-4012-8000-0000000057e4','7a5c0e05-2026-4012-8000-0000000057e5',
  '7a5c0e05-2026-4012-8000-0000000057f1','7a5c0e05-2026-4012-8000-0000000057f2','7a5c0e05-2026-4012-8000-0000000057f3','7a5c0e05-2026-4012-8000-0000000057f4');
commit;
