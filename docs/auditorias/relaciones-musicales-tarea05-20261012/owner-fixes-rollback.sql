-- Reversión de owner-fixes.sql. Valores anteriores consultados el 12/10/2026 antes de aplicar.
begin;

update public.music_accompaniment_periods
set is_current = false,
    step_entity_id = null,
    position = 'Acompañamiento musical',
    date_from_text = 'Inicio por documentar',
    notes = 'Acompañamiento de Cruz Roja documentado por la web oficial de la banda. Se conserva como histórico/no vigente en 2026; la cronología exacta queda pendiente de Fuente suficiente.'
where id = 'e403394e-31e4-4044-86f5-6870411cba5f';

update public.music_accompaniment_periods
set status = 'published',
    notes = 'Maestro Tejera acompaña a Nuestra Señora de los Dolores Coronada en la procesión patronal de 2026.'
where id = '38067fc3-07e1-41e0-8483-ecce8e252ff5';

update public.outing_music_assignments set band_entity_id = null,
  notes = 'Formación juvenil incorporada por nombre, sin ficha propia de Banda en Hilo Cofrade.'
where id = 'a9cbf2f6-e94c-4a2c-991a-3192f116ffbd';
update public.outing_music_assignments set band_entity_id = null,
  notes = 'Formación confirmada en el cartel oficial; tramo concreto no especificado.'
where id = '719a39df-9eb8-4ea2-90b1-7442b39b575d';
update public.outing_music_assignments set band_entity_id = null,
  notes = 'Edición documentada; no se generaliza a otros años.'
where id = 'f34111b9-68a2-4f0a-ad45-a53a046adb57';

delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca01', '7a5c0e05-2026-4012-8000-00000000ca02');
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca01', '7a5c0e05-2026-4012-8000-00000000ca02');

commit;
