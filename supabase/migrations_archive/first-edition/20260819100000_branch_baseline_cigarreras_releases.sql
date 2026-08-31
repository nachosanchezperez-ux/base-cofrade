-- Hilo Cofrade · baseline reproducible de la discografía de Las Cigarreras
--
-- La migración 054 actualiza nueve publicaciones que nacieron en producción
-- desde el Panel antes de que la migración 064 reconstruyera el catálogo
-- completo. Las ramas sin datos necesitan esas nueve identidades para poder
-- reproducir el tramo 054 → 064 sin rebajar las comprobaciones históricas.
--
-- Solo se fijan identidad, tipo, año y estado. 054 añade sus portadas y 064
-- completa canónicamente el catálogo. En producción el conflicto natural hace
-- que esta migración sea un no-op.

insert into public.band_releases (
  id, band_entity_id, title, release_type, release_year, status
)
values
  ('c1df0593-a996-46d7-ba3a-17168607c64c', 'b1000000-0000-0000-0000-000000000001', 'XX Aniversario', 'album', 1998, 'published'),
  ('ab4fcb30-6ebf-4ffb-8251-71a870a7c225', 'b1000000-0000-0000-0000-000000000001', 'Madre Cigarrera', 'album', 2001, 'published'),
  ('dda56485-f454-4046-b747-b254284f5f1c', 'b1000000-0000-0000-0000-000000000001', '25 Aniversario', 'live', 2004, 'published'),
  ('b6b52c45-8feb-4bf0-a3d9-7964ca18fe2f', 'b1000000-0000-0000-0000-000000000001', 'Armonía', 'album', 2007, 'published'),
  ('c9e30d47-01a6-41f5-86a2-300807bcf1e8', 'b1000000-0000-0000-0000-000000000001', 'Homenaje de la música de Las Cigarreras a su Hermandad', 'compilation', 2013, 'published'),
  ('323d2b2f-6df6-4a2e-b2ea-7cf1e0306074', 'b1000000-0000-0000-0000-000000000001', 'En mis recuerdos...', 'album', 2018, 'published'),
  ('1f39dc0e-87cd-444d-8843-cc1fff9ae303', 'b1000000-0000-0000-0000-000000000001', 'Cuaresma 2024... Suena Cigarreras', 'live', 2024, 'published'),
  ('b497d962-baac-4955-89a5-72d4416cc160', 'b1000000-0000-0000-0000-000000000001', 'Galardón Madre Cigarrera 2024', 'live', 2024, 'published'),
  ('7d86b6da-c7d1-47fb-8eb7-8389f4567ab6', 'b1000000-0000-0000-0000-000000000001', 'Cuaresma 2025... Suena Cigarreras', 'live', 2025, 'published')
on conflict (band_entity_id, title, release_year) do nothing;

do $$
declare
  release_count integer;
begin
  select count(*)
  into release_count
  from public.band_releases
  where band_entity_id = 'b1000000-0000-0000-0000-000000000001'::uuid
    and title in (
      'XX Aniversario',
      'Madre Cigarrera',
      '25 Aniversario',
      'Armonía',
      'Homenaje de la música de Las Cigarreras a su Hermandad',
      'En mis recuerdos...',
      'Cuaresma 2024... Suena Cigarreras',
      'Galardón Madre Cigarrera 2024',
      'Cuaresma 2025... Suena Cigarreras'
    );

  if release_count <> 9 then
    raise exception 'Baseline Cigarreras: se esperaban 9 publicaciones y se encontraron %', release_count;
  end if;
end
$$;
