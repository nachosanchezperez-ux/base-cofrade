-- Reversión de pasos-nuevos.sql: devuelve los periodos a «sin paso» y elimina lo creado.
begin;

update public.music_accompaniment_periods set step_entity_id = null
where id in ('82805953-88c0-4b37-ae31-f8f6dd7115d9', '722fc020-a9f7-4303-a4bc-607fd18b9617', 'b1a33d33-e6ad-4646-bcd3-f6821a7a26c6')
  and step_entity_id in ('7a5c0e05-2026-4012-8000-0000000057a1', '7a5c0e05-2026-4012-8000-0000000057a2', '7a5c0e05-2026-4012-8000-0000000057a3');

delete from public.source_links
where entity_id in ('7a5c0e05-2026-4012-8000-0000000057a1', '7a5c0e05-2026-4012-8000-0000000057a2', '7a5c0e05-2026-4012-8000-0000000057a3')
   or brotherhood_step_id in ('7a5c0e05-2026-4012-8000-0000000057b1', '7a5c0e05-2026-4012-8000-0000000057b2', '7a5c0e05-2026-4012-8000-0000000057b3')
   or image_step_id = '7a5c0e05-2026-4012-8000-0000000057c1';

delete from public.image_steps where id = '7a5c0e05-2026-4012-8000-0000000057c1';
delete from public.brotherhood_steps where id in ('7a5c0e05-2026-4012-8000-0000000057b1', '7a5c0e05-2026-4012-8000-0000000057b2', '7a5c0e05-2026-4012-8000-0000000057b3');
delete from public.steps where entity_id in ('7a5c0e05-2026-4012-8000-0000000057a1', '7a5c0e05-2026-4012-8000-0000000057a2', '7a5c0e05-2026-4012-8000-0000000057a3');
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000057a1', '7a5c0e05-2026-4012-8000-0000000057a2', '7a5c0e05-2026-4012-8000-0000000057a3');
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca05', '7a5c0e05-2026-4012-8000-00000000ca06');

commit;
