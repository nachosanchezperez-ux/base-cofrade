-- TAREA 05 · Segunda tanda autorizada por el propietario (12/10/2026, 12:49).
--   1. «Muestra los nombres de los 12 periodos históricos de San Bernardo y la Trinidad».
--   2. «Juvenil de Arahal, vincúlalo a la A.M. Santa María Magdalena».
--   3. «La Banda Virgen de las Angustias es la que acompañaba a Camas el Jueves Santo».
-- Reversión: owner-fixes-2-rollback.sql (valores anteriores escritos literalmente).

-- 1 · Nombre público de las formaciones históricas archivadas (12 periodos).
update public.music_accompaniment_periods m
set public_band_name = be.name
from public.entities be
where be.id = m.band_entity_id
  and m.status = 'published' and be.status = 'archived' and m.public_band_name is null
  and m.id in ('9ecc91fb-efcb-407c-a68e-605f98336270','4c23f0c2-0a77-4208-bfd6-d4a112d7fab8','4d0ade55-b3ca-464f-a166-70e8661c06c2',
               'ca0dca7a-b4f6-4e6d-8900-3087c5cfb474','5202b2a7-205b-4c81-b99b-f604aec8764b','cdfa19d9-5cad-452c-b00b-9cc7ce6d5b83',
               '4219ad30-605b-41d7-a5fd-52f07413601b','1e9b6dda-9642-4810-b13c-c20426b38c94','fe3da9a1-b98f-4899-8a1c-2bd556b5aac9',
               '61b54b59-7aa1-4f7f-92cc-478dc296d564','1aec8c3d-6a3d-4e35-8d6e-74e480b1ff25','c2aa26f3-95dc-4070-ae57-7fbbb140f65d');

-- 2 · Juvenil de Arahal (San Pablo, Cruz de Guía 2026) → A.M. Santa María Magdalena de Arahal.
--     El nombre juvenil se conserva como texto y en la nota. La ficha juvenil en borrador no se toca.
insert into public.sources (id, name, source_type, author_or_publisher, publication_date, notes)
values ('7a5c0e05-2026-4012-8000-00000000ca03',
        'A.M. Juvenil Santa María Magdalena de Arahal · formación de la A.M. Santa María Magdalena · confirmación editorial',
        'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
        'Confirmación directa del editor: la formación juvenil se vincula a la Agrupación Musical Santa María Magdalena de Arahal.')
on conflict (id) do nothing;

update public.outing_music_assignments
set band_entity_id = 'c6000000-0000-4000-8000-000000000002',
    band_name_text = 'Agrupación Musical Juvenil Santa María Magdalena de Arahal',
    notes = 'Formación juvenil de la A.M. Santa María Magdalena de Arahal. Acompañamiento de ida.'
where id = '81d25750-4f5f-4924-bdf0-bbbb3e33df51' and band_entity_id = '9f3636a3-6b3e-4a63-9cd2-2f08383158f3';

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select '7a5c0e05-2026-4012-8000-00000000ca03', '81d25750-4f5f-4924-bdf0-bbbb3e33df51', 'Identidad de la formación', 'Formación juvenil de la A.M. Santa María Magdalena.'
where not exists (select 1 from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca03' and outing_music_assignment_id = '81d25750-4f5f-4924-bdf0-bbbb3e33df51');

-- 3 · Camas · Jueves Santo · Virgen de las Angustias: confirmada; 2026 es constatación, no inicio.
insert into public.sources (id, name, source_type, author_or_publisher, publication_date, notes)
values ('7a5c0e05-2026-4012-8000-00000000ca04',
        'Camas · Jueves Santo · Banda Virgen de las Angustias · confirmación editorial',
        'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
        'Confirmación directa del editor: la Banda de Música Virgen de las Angustias acompañaba a la Virgen de los Dolores de Camas el Jueves Santo. No fija el año inicial.')
on conflict (id) do nothing;

update public.music_accompaniment_periods
set date_from_text = 'Vigente en 2026; inicio no acreditado'
where id = '6c3dc58d-c9cd-46fc-9074-44d24a0cd227' and date_from_text is null;

insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
select '7a5c0e05-2026-4012-8000-00000000ca04', '6c3dc58d-c9cd-46fc-9074-44d24a0cd227', 'Acompañamiento · Jueves Santo', 'Banda confirmada por el editor.'
where not exists (select 1 from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca04' and music_accompaniment_period_id = '6c3dc58d-c9cd-46fc-9074-44d24a0cd227');
