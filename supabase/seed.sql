-- Hilo Cofrade · datos mínimos de QA para ramas sin datos de producción.
--
-- Este seed no replica producción. Conserva únicamente dos Bandas ya públicas
-- y sin datos personales para validar de forma transversal logotipos, colores,
-- fichas y cambios de Panel como #432.

insert into public.municipalities (
  id, name, slug, province, autonomous_community, country
)
values (
  'ca85889c-21fe-4367-8477-a57656b25da4',
  'Sevilla',
  'sevilla',
  'Sevilla',
  'Andalucía',
  'España'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

insert into public.entities (
  id, entity_type, name, slug, summary, status
)
values
  (
    'e1fe592f-c67d-42c3-9f2f-67137ef629ec',
    'band',
    'Maestro Tejera',
    'banda-de-musica-del-maestro-tejera',
    'Banda de música sevillana con origen documentado en 1901.',
    'published'
  ),
  (
    'b1000000-0000-0000-0000-000000000001',
    'band',
    'Las Cigarreras',
    'las-cigarreras',
    'Banda sevillana de cornetas y tambores.',
    'published'
  )
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id,
  band_type,
  municipality_id,
  foundation_text,
  description,
  primary_color,
  secondary_color,
  logo_path,
  hero_image_path,
  hero_image_alt,
  hero_image_credit,
  headquarters_text
)
values
  (
    'e1fe592f-c67d-42c3-9f2f-67137ef629ec',
    'Banda de Música',
    'ca85889c-21fe-4367-8477-a57656b25da4',
    '1901 · denominación vinculada al Maestro Tejera desde 1912',
    'Formación musical sevillana de referencia para QA de ramas.',
    '#00001C',
    '#00001C',
    '/bandas/maestro-tejera/emblema.webp',
    '/bandas/maestro-tejera/formacion.webp',
    'Detalle del emblema de la Banda de Música del Maestro Tejera',
    'Fotografía · Banda de Música Maestro Tejera',
    'Sevilla'
  ),
  (
    'b1000000-0000-0000-0000-000000000001',
    'Cornetas y Tambores',
    'ca85889c-21fe-4367-8477-a57656b25da4',
    '1979',
    'Formación musical sevillana de referencia para QA de ramas.',
    '#63358B',
    '#29272C',
    '/bandas/las-cigarreras/imagotipo.svg',
    '/bandas/las-cigarreras/cigarreras-corneta.jpg',
    'Corneta de Las Cigarreras con la gala bordada de la formación',
    'Foto · Las Cigarreras',
    'Sevilla'
  )
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  hero_image_path = excluded.hero_image_path,
  hero_image_alt = excluded.hero_image_alt,
  hero_image_credit = excluded.hero_image_credit,
  headquarters_text = excluded.headquarters_text;
