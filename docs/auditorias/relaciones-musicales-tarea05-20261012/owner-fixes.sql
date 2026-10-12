-- TAREA 05 · Correcciones con datos aportados por el propietario (12/10/2026).
--   1. «La Banda de la Cruz Roja es la que iba en la procesión de Camas 2026».
--   2. «Puedes vincular a la Juvenil de Santa Ana dentro del apartado de la Banda de Santa Ana».
-- Idempotente. Los valores anteriores están escritos literalmente en owner-fixes-rollback.sql.

begin;

-- Fuentes editoriales (mismo patrón que las confirmaciones editoriales existentes).
insert into public.sources (id, name, source_type, author_or_publisher, publication_date, notes)
values
  ('7a5c0e05-2026-4012-8000-00000000ca01',
   'Camas · Procesión de Gloria 2026 · confirmación editorial de Cruz Roja',
   'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
   'Confirmación directa del editor: la Banda de la Cruz Roja acompañó a Nuestra Señora de los Dolores Coronada en la Procesión de Gloria de 2026. No fija el año inicial de la vinculación.'),
  ('7a5c0e05-2026-4012-8000-00000000ca02',
   'Banda Juvenil de Santa Ana · formación de la Banda de Música Santa Ana · confirmación editorial',
   'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
   'Confirmación directa del editor: la Banda Juvenil de Santa Ana de Dos Hermanas se integra en el apartado de la Banda de Música Santa Ana de Dos Hermanas.')
on conflict (id) do nothing;

-- 1a · Cruz Roja: vigente en la Gloria de 2026, tras la Virgen, en su paso
--      (la Gloria usa el paso de palio sin palio, documentado en image_steps).
update public.music_accompaniment_periods
set is_current = true,
    step_entity_id = '63062886-1c3c-4698-8991-5fe344f96b01',
    position = 'Tras Nuestra Señora María Santísima de los Dolores Coronada',
    date_from_text = 'Vigente en 2026; inicio no acreditado',
    notes = 'Acompañó a la Patrona en la Procesión de Gloria de 2026 (confirmación editorial). La web de la banda incluye esta Gloria entre sus acompañamientos; el año inicial queda por documentar. No presupone continuidad posterior.'
where id = 'e403394e-31e4-4044-86f5-6870411cba5f' and is_current = false;

insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
select '7a5c0e05-2026-4012-8000-00000000ca01', 'e403394e-31e4-4044-86f5-6870411cba5f', 'Acompañamiento · Gloria 2026', 'Banda que acompañó en 2026.'
where not exists (select 1 from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca01' and music_accompaniment_period_id = 'e403394e-31e4-4044-86f5-6870411cba5f');

-- 1b · Maestro Tejera en la Gloria de 2026: contradicho por el propietario. Se archiva, no se borra.
--      Su única fuente se refiere a la procesión extraordinaria del 30/05, cuya música curada es
--      Virgen de las Angustias y Cruz Roja.
update public.music_accompaniment_periods
set status = 'archived',
    notes = coalesce(notes, '') || ' [Archivado el 12/10/2026: el editor confirma que en la Gloria de 2026 acompañó Cruz Roja.]'
where id = '38067fc3-07e1-41e0-8483-ecce8e252ff5' and status = 'published';

-- 2 · Banda Juvenil de Santa Ana → ficha de la Banda de Música Santa Ana.
--     band_name_text conserva el nombre juvenil; la nota lo hace visible en la salida.
update public.outing_music_assignments
set band_entity_id = '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1',
    notes = 'Banda Juvenil de la Banda de Música Santa Ana de Dos Hermanas.' || case
      when id = '719a39df-9eb8-4ea2-90b1-7442b39b575d' then ' Formación confirmada en el cartel oficial; tramo concreto no especificado.'
      when id = 'f34111b9-68a2-4f0a-ad45-a53a046adb57' then ' Edición documentada; no se generaliza a otros años.'
      else '' end
where id in ('a9cbf2f6-e94c-4a2c-991a-3192f116ffbd', '719a39df-9eb8-4ea2-90b1-7442b39b575d', 'f34111b9-68a2-4f0a-ad45-a53a046adb57')
  and band_entity_id is null;

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select '7a5c0e05-2026-4012-8000-00000000ca02', a.id, 'Identidad de la formación', 'Formación juvenil de la Banda de Música Santa Ana.'
from public.outing_music_assignments a
where a.id in ('a9cbf2f6-e94c-4a2c-991a-3192f116ffbd', '719a39df-9eb8-4ea2-90b1-7442b39b575d', 'f34111b9-68a2-4f0a-ad45-a53a046adb57')
  and not exists (select 1 from public.source_links s where s.source_id = '7a5c0e05-2026-4012-8000-00000000ca02' and s.outing_music_assignment_id = a.id);

-- Comprobación interna.
do $$
begin
  if (select count(*) from public.music_accompaniment_periods where id = 'e403394e-31e4-4044-86f5-6870411cba5f' and is_current and step_entity_id = '63062886-1c3c-4698-8991-5fe344f96b01') <> 1
     or (select count(*) from public.music_accompaniment_periods where id = '38067fc3-07e1-41e0-8483-ecce8e252ff5' and status = 'archived') <> 1
     or (select count(*) from public.outing_music_assignments where band_entity_id = '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1' and id in ('a9cbf2f6-e94c-4a2c-991a-3192f116ffbd', '719a39df-9eb8-4ea2-90b1-7442b39b575d', 'f34111b9-68a2-4f0a-ad45-a53a046adb57')) <> 3
  then raise exception 'Comprobación fallida';
  end if;
end $$;

commit;
