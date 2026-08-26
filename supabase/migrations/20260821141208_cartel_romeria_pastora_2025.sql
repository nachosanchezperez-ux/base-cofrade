-- Hilo Cofrade · Cartel anunciador de la Romería y Besamanos de la
-- Divina Pastora de Cantillana de 2025.

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'heritage_asset',
  'Cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana 2025',
  'cartel-romeria-besamanos-divina-pastora-cantillana-2025',
  'Cartel anunciador de la Romería y el solemne Besamanos de la Divina Pastora de Cantillana de 2025, obra de Ricardo Gil Lozano.',
  'published'
)
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'agent',
  'Ricardo Gil Lozano',
  'ricardo-gil-lozano',
  'Artista sevillano y cartelista, graduado en Bellas Artes por la Universidad de Sevilla.',
  'published'
)
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.agents (entity_id, agent_kind, description)
select
  agent.id,
  'person',
  'Artista sevillano y cartelista, graduado en Bellas Artes por la Universidad de Sevilla. Su producción combina pintura figurativa, color y técnicas mixtas.'
from public.entities agent
where agent.slug = 'ricardo-gil-lozano'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select
  agent.id,
  'Pintura y cartelería',
  true,
  'Disciplina documentada por su autoría del cartel de la Romería y Besamanos de la Divina Pastora de Cantillana de 2025.'
from public.entities agent
where agent.slug = 'ricardo-gil-lozano'
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

insert into public.heritage_assets (
  entity_id,
  parent_entity_id,
  asset_type,
  description,
  notes,
  date_from,
  date_from_text,
  is_current,
  origin_notes,
  technique,
  materials,
  dimensions_text,
  iconography,
  historical_context,
  provenance_text,
  display_order,
  is_featured,
  public_image_path,
  public_image_alt,
  public_image_credit
)
select
  poster.id,
  brotherhood.id,
  'Cartel de la Romería y Besamanos',
  'La Divina Pastora ocupa el primer plano y dirige su mirada al espectador. El amarillo del sombrero y las joyas subraya su realeza, mientras las hiladas de la mantilla evocan la llegada de la carreta a la ermita.',
  $statement$El cartel anunciador de la Romería de la Divina Pastora de Cantillana 2025 es una obra del artista sevillano Ricardo Gil, realizada en técnica mixta —collage, acrílico y óleo— sobre tabla.

Nos presenta una imagen poderosa y profundamente simbólica. En un primer plano, la Divina Pastora fija su mirada directa sobre el espectador, una mirada que traspasa el papel para encontrarse con los ojos de su pueblo cantillanero.

Es la Reina de los Cielos y de la Tierra, y así se presenta: majestuosa, serena y cercana. La Santísima Virgen luce su característico sombrero, que en este cartel se convierte en símbolo de su realeza divina. El color amarillo, presente con fuerza en la composición a través del sombrero, los pendientes y collares, actúa como reflejo de esa divinidad y realeza que emanan de su figura.

Uno de los detalles más significativos se encuentra en las hiladas de su mantilla, donde, como si de un bordado se tratase, se representa la llegada de la Divina Pastora en su carreta a la ermita. Una imagen cargada de emoción, pues simboliza el esperado regreso tras diez largos años, un momento de júbilo absoluto que envolverá a todo el pueblo de Cantillana.

En la parte inferior del cartel, sobre un fondo que simula un papel rasgado, aparece la tipografía que anuncia la celebración de la Romería y el solemne Besamanos, que tendrán lugar durante el último fin de semana de septiembre. Un detalle visual que conecta la tradición con la actualidad, recordando que esta cita no es solo un evento religioso, sino una manifestación viva de fe, devoción y verdad.

Este cartel no solo anuncia una fecha: proclama un reencuentro. Es el reflejo de una esperanza que ha latido durante años y que, por fin, se convertirá en realidad.$statement$,
  null,
  '2025',
  false,
  'La obra se concibe como la proclamación visual de un reencuentro: el regreso de la Divina Pastora en su carreta a la ermita después de diez años.',
  'Técnica mixta: collage, acrílico y óleo',
  'Tabla',
  null,
  'Primer plano de la Divina Pastora con sombrero y joyas amarillas. Las hiladas de la mantilla incorporan la escena de la llegada de la carreta a la ermita y la zona inferior emplea el recurso del papel rasgado para integrar la rotulación.',
  'El cartel anuncia la Romería y el solemne Besamanos celebrados los días 27 y 28 de septiembre de 2025 y rememora el regreso de la Divina Pastora a la ermita tras diez años.',
  'Presentado públicamente en septiembre de 2025 como cartel anunciador de la Romería y el Besamanos de los días 27 y 28 de septiembre.',
  920,
  true,
  '/hermandades/pastora-de-cantillana/carteles/cartel-romeria-besamanos-2025.webp',
  'Cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana de 2025, obra de Ricardo Gil Lozano',
  'Obra · Ricardo Gil Lozano'
from public.entities poster
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  notes = excluded.notes,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  origin_notes = excluded.origin_notes,
  technique = excluded.technique,
  materials = excluded.materials,
  dimensions_text = excluded.dimensions_text,
  iconography = excluded.iconography,
  historical_context = excluded.historical_context,
  provenance_text = excluded.provenance_text,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  public_image_path = excluded.public_image_path,
  public_image_alt = excluded.public_image_alt,
  public_image_credit = excluded.public_image_credit;

update public.heritage_interventions intervention
set
  discipline = 'Pintura y cartelería',
  element_name = 'Cartel de la Romería y Besamanos 2025',
  intervention_type = 'Autoría',
  phase = 'Creación',
  date_from = null,
  date_from_text = '2025',
  description = 'Creación del cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana de 2025.',
  status = 'published',
  updated_at = now()
from public.entities poster, public.entities agent
where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
  and agent.slug = 'ricardo-gil-lozano'
  and intervention.target_entity_id = poster.id
  and intervention.agent_entity_id = agent.id
  and intervention.intervention_type = 'Autoría';

insert into public.heritage_interventions (
  target_entity_id,
  agent_entity_id,
  discipline,
  element_name,
  intervention_type,
  phase,
  date_from,
  date_from_text,
  description,
  status
)
select
  poster.id,
  agent.id,
  'Pintura y cartelería',
  'Cartel de la Romería y Besamanos 2025',
  'Autoría',
  'Creación',
  null,
  '2025',
  'Creación del cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana de 2025.',
  'published'
from public.entities poster
join public.entities agent on agent.slug = 'ricardo-gil-lozano'
where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
  and not exists (
    select 1
    from public.heritage_interventions existing
    where existing.target_entity_id = poster.id
      and existing.agent_entity_id = agent.id
      and existing.intervention_type = 'Autoría'
  );

do $$
declare
  poster_id uuid;
  poster_media_id uuid;
begin
  select id into poster_id
  from public.entities
  where slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025';

  insert into public.media_assets (
    storage_path,
    media_type,
    title,
    caption,
    alt_text,
    author_name,
    source_name,
    source_url,
    rights_status,
    rights_holder,
    permission_notes,
    taken_or_created_date,
    width_px,
    height_px
  ) values (
    '/hermandades/pastora-de-cantillana/carteles/cartel-romeria-besamanos-2025.webp',
    'image',
    'Cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana 2025',
    'Cartel de la Romería y el solemne Besamanos de la Divina Pastora de Cantillana de 2025.',
    'Cartel anunciador de la Romería y Besamanos de la Divina Pastora de Cantillana de 2025, obra de Ricardo Gil Lozano',
    'Ricardo Gil Lozano',
    'Hermandad de la Divina Pastora de Cantillana',
    'https://www.gentedepaz.es/presentado-el-cartel-anunciador-de-la-romeria-y-besamanos-de-la-divina-pastora-de-cantillana-2025/',
    'authorized',
    'Ricardo Gil Lozano / Hermandad de la Divina Pastora de Cantillana',
    'Imagen y explicación aportadas directamente al proyecto para su publicación en Hilo Cofrade.',
    null,
    1196,
    2048
  )
  on conflict (storage_path) do update set
    media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    author_name = excluded.author_name,
    source_name = excluded.source_name,
    source_url = excluded.source_url,
    rights_status = excluded.rights_status,
    rights_holder = excluded.rights_holder,
    permission_notes = excluded.permission_notes,
    taken_or_created_date = excluded.taken_or_created_date,
    width_px = excluded.width_px,
    height_px = excluded.height_px,
    updated_at = now()
  returning id into poster_media_id;

  insert into public.entity_media (
    entity_id,
    media_asset_id,
    relation_type,
    sort_order,
    is_cover,
    notes,
    fit_mode
  ) values (
    poster_id,
    poster_media_id,
    'cover',
    0,
    true,
    'Imagen principal del cartel de la Romería y Besamanos de 2025.',
    'contain'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes,
    fit_mode = excluded.fit_mode;
end
$$;

update public.sources source
set
  name = 'Presentado el cartel de la Romería y Besamanos de la Divina Pastora de Cantillana 2025',
  source_type = 'Prensa cofrade',
  author_or_publisher = 'Gente de Paz',
  publication_date = '2025-09-13',
  accessed_at = '2026-08-21',
  notes = 'La imagen y el texto explicativo fueron aportados directamente al proyecto.'
where source.url = 'https://www.gentedepaz.es/presentado-el-cartel-anunciador-de-la-romeria-y-besamanos-de-la-divina-pastora-de-cantillana-2025/';

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  publication_date,
  accessed_at,
  notes
)
select
  'Presentado el cartel de la Romería y Besamanos de la Divina Pastora de Cantillana 2025',
  'https://www.gentedepaz.es/presentado-el-cartel-anunciador-de-la-romeria-y-besamanos-de-la-divina-pastora-de-cantillana-2025/',
  'Prensa cofrade',
  'Gente de Paz',
  '2025-09-13',
  '2026-08-21',
  'La imagen y el texto explicativo fueron aportados directamente al proyecto.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://www.gentedepaz.es/presentado-el-cartel-anunciador-de-la-romeria-y-besamanos-de-la-divina-pastora-de-cantillana-2025/'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  poster.id,
  'Autoría, técnica, actos anunciados y explicación iconográfica del cartel de 2025',
  'La imagen y el texto completo fueron aportados directamente al proyecto.'
from public.sources source
join public.entities poster
  on poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
where source.url = 'https://www.gentedepaz.es/presentado-el-cartel-anunciador-de-la-romeria-y-besamanos-de-la-divina-pastora-de-cantillana-2025/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = poster.id
      and existing.scope = 'Autoría, técnica, actos anunciados y explicación iconográfica del cartel de 2025'
  );

do $$
begin
  if not exists (
    select 1
    from public.heritage_assets asset
    join public.entities poster on poster.id = asset.entity_id
    join public.entities brotherhood on brotherhood.id = asset.parent_entity_id
    where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
      and brotherhood.slug = 'pastora-de-cantillana'
      and asset.asset_type = 'Cartel de la Romería y Besamanos'
      and asset.date_from_text = '2025'
  ) then
    raise exception 'No se ha creado el cartel de la Romería y Besamanos de 2025';
  end if;

  if not exists (
    select 1
    from public.entity_media relation
    join public.entities poster on poster.id = relation.entity_id
    join public.media_assets media on media.id = relation.media_asset_id
    where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
      and media.storage_path = '/hermandades/pastora-de-cantillana/carteles/cartel-romeria-besamanos-2025.webp'
      and relation.is_cover
  ) then
    raise exception 'No se ha vinculado la imagen principal del cartel de la Romería y Besamanos de 2025';
  end if;

  if not exists (
    select 1
    from public.heritage_interventions intervention
    join public.entities poster on poster.id = intervention.target_entity_id
    join public.entities agent on agent.id = intervention.agent_entity_id
    where poster.slug = 'cartel-romeria-besamanos-divina-pastora-cantillana-2025'
      and agent.slug = 'ricardo-gil-lozano'
      and intervention.intervention_type = 'Autoría'
  ) then
    raise exception 'No se ha relacionado a Ricardo Gil Lozano con el cartel de 2025';
  end if;
end
$$;
