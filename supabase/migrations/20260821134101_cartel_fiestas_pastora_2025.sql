-- Hilo Cofrade · «El momento», cartel de las Fiestas Mayores de la
-- Divina Pastora de Cantillana de 2025.

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'heritage_asset',
  'El momento · Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana 2025',
  'cartel-fiestas-mayores-divina-pastora-cantillana-2025',
  '«El momento», cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025, obra de David Payán Campos.',
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
  'David Payán Campos',
  'david-payan-campos',
  'Artista y cartelista cantillanero, graduado en Bellas Artes por la Universidad de Sevilla.',
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
  'Artista y cartelista cantillanero, graduado en Bellas Artes por la Universidad de Sevilla y autor de obras para hermandades de distintos puntos de España.'
from public.entities agent
where agent.slug = 'david-payan-campos'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select
  agent.id,
  'Pintura y cartelería',
  true,
  'Disciplina documentada por su autoría del cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025.'
from public.entities agent
where agent.slug = 'david-payan-campos'
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
  'Cartel de las Fiestas',
  'La obra representa el instante en el que la Divina Pastora es despojada de su sombrero en la calle Martín Rey. El rostro de la Virgen centra una composición donde la figuración dialoga con un fondo abstracto y urbano.',
  $statement$El cartel se titula «El momento». Esta idea nace desde el primer instante que recibo este ilusionante encargo. Era algo que me rondaba por la mente y que poco a poco he ido puliendo y construyendo.

La Divina Pastora en su calle Martín Rey, una calle que no es la arteria principal de Cantillana, pero sí nuestra calle más emblemática y popular, conocida fuera de nuestras fronteras por el inigualable momento en que la Divina Pastora es despojada de su sombrero, escena que protagoniza este cartel. Momento especialísimo, esperado durante todo el año, momento cumbre de Cantillana en que, extasiada ante su Divina Pastora, vive unos instantes de gloria mientras se descubre su purísima frente.

Momento sublime y apoteósico, narrado por escritores, poetas y músicos, intentando definir lo que se vive anualmente en esa calle, santo y seña de Cantillana, pero que pictóricamente no se ha representado tanto y por ello he querido tomar este momento del sombrero, tan propio y tan nuestro, como anuncio de las Fiestas Mayores 2025. Un idílico instante en que Cantillana, rendida a los pies de su Reina y Pastora, vive la misma gloria en Martín Rey.

Una obra que se centra en la Divina Pastora y en su bellísimo rostro, que tanto significa para los pastoreños y pastoreñas, que llevamos grabado en el corazón y en la mente: la cara de la Pastora, bonita y fina como ninguna.

Dentro de la obra encontramos una dialéctica de oposición entre la figuración más absoluta en la Divina Pastora y la abstracción del fondo, conformando un archipiélago en el que la diversidad y un enfoque diferente trabajan en una dirección conjunta, a pesar de las diferencias entre los dos lenguajes.

El color impregna a la Virgen en este fondo que se inicia en abstracto y al que poco a poco se van incorporando elementos figurativos como los arcos de Martín Rey y esa explosión que vemos detrás de la Pastora, representando el júbilo y la alegría del pueblo pastoreño en el momento en que el Padre Álvaro le quita el sombrero.

Nos encontramos con una obra contemporánea que renueva su estética, que muestra la relación entre las técnicas de pintura más tradicionales y las reminiscencias del arte abstracto y urbano. Que une lo tradicional con la vanguardia sin perder la esencia de lo que está representando, que anuncia las Fiestas Mayores de la Divina Pastora de Cantillana 2025, con fuerza, con alegría y con la Divina Pastora como protagonista absoluta de esta obra.$statement$,
  '2025-08-08',
  '2025',
  false,
  'El gesto de retirar el sombrero simboliza uno de los instantes más reconocibles de la procesión. La explosión cromática del fondo representa el júbilo del pueblo pastoreño en la calle Martín Rey.',
  'Pintura contemporánea de lenguaje figurativo, abstracto y urbano',
  null,
  null,
  'La Divina Pastora aparece en primer plano mientras una mano retira su sombrero. El fondo incorpora los arcos de la calle Martín Rey y una explosión de color que envuelve el rostro de la Virgen.',
  'El cartel establece un diálogo entre la representación figurativa de la Divina Pastora y la abstracción del fondo, uniendo técnicas pictóricas tradicionales con referencias al arte abstracto y urbano.',
  'Presentado el 8 de agosto de 2025 en la Casa de la Cultura de Cantillana.',
  910,
  true,
  '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2025.webp',
  'El momento, cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025, obra de David Payán Campos',
  'Obra · David Payán Campos'
from public.entities poster
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
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
  element_name = 'El momento · Cartel de las Fiestas Mayores 2025',
  intervention_type = 'Autoría',
  phase = 'Creación',
  date_from = '2025-08-08',
  date_from_text = '2025',
  description = 'Creación de «El momento», cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025.',
  status = 'published',
  updated_at = now()
from public.entities poster, public.entities agent
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
  and agent.slug = 'david-payan-campos'
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
  'El momento · Cartel de las Fiestas Mayores 2025',
  'Autoría',
  'Creación',
  '2025-08-08',
  '2025',
  'Creación de «El momento», cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025.',
  'published'
from public.entities poster
join public.entities agent on agent.slug = 'david-payan-campos'
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
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
  where slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025';

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
    '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2025.webp',
    'image',
    'El momento · Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana 2025',
    '«El momento», cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025.',
    'El momento, cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2025, obra de David Payán Campos',
    'David Payán Campos',
    'Hermandad de la Divina Pastora de Cantillana',
    'https://www.elpespunte.es/articulo/sevilla/cantillana-presenta-el-cartel-2025-de-la-divina-pastora/20250809113615106448.html',
    'authorized',
    'David Payán Campos / Hermandad de la Divina Pastora de Cantillana',
    'Imagen y explicación autoral aportadas directamente al proyecto para su publicación en Hilo Cofrade.',
    '2025-08-08',
    1272,
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
    'Imagen principal de «El momento», cartel de las Fiestas Mayores de 2025.',
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
  name = 'Cantillana presenta el cartel 2025 de la Divina Pastora',
  source_type = 'Prensa cofrade',
  author_or_publisher = 'El Pespunte',
  publication_date = '2025-08-09',
  accessed_at = '2026-08-21',
  notes = 'La explicación completa del autor y la imagen fueron facilitadas directamente al proyecto.'
where source.url = 'https://www.elpespunte.es/articulo/sevilla/cantillana-presenta-el-cartel-2025-de-la-divina-pastora/20250809113615106448.html';

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
  'Cantillana presenta el cartel 2025 de la Divina Pastora',
  'https://www.elpespunte.es/articulo/sevilla/cantillana-presenta-el-cartel-2025-de-la-divina-pastora/20250809113615106448.html',
  'Prensa cofrade',
  'El Pespunte',
  '2025-08-09',
  '2026-08-21',
  'La explicación completa del autor y la imagen fueron facilitadas directamente al proyecto.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://www.elpespunte.es/articulo/sevilla/cantillana-presenta-el-cartel-2025-de-la-divina-pastora/20250809113615106448.html'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  poster.id,
  'Autoría, título, presentación y explicación iconográfica del cartel de 2025',
  'La transcripción íntegra de la explicación autoral fue aportada directamente al proyecto.'
from public.sources source
join public.entities poster
  on poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
where source.url = 'https://www.elpespunte.es/articulo/sevilla/cantillana-presenta-el-cartel-2025-de-la-divina-pastora/20250809113615106448.html'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = poster.id
      and existing.scope = 'Autoría, título, presentación y explicación iconográfica del cartel de 2025'
  );

do $$
begin
  if not exists (
    select 1
    from public.heritage_assets asset
    join public.entities poster on poster.id = asset.entity_id
    join public.entities brotherhood on brotherhood.id = asset.parent_entity_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
      and brotherhood.slug = 'pastora-de-cantillana'
      and asset.asset_type = 'Cartel de las Fiestas'
      and asset.date_from_text = '2025'
  ) then
    raise exception 'No se ha creado el cartel anual de la Pastora de Cantillana de 2025';
  end if;

  if not exists (
    select 1
    from public.entity_media relation
    join public.entities poster on poster.id = relation.entity_id
    join public.media_assets media on media.id = relation.media_asset_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
      and media.storage_path = '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2025.webp'
      and relation.is_cover
  ) then
    raise exception 'No se ha vinculado la imagen principal del cartel de 2025';
  end if;

  if not exists (
    select 1
    from public.heritage_interventions intervention
    join public.entities poster on poster.id = intervention.target_entity_id
    join public.entities agent on agent.id = intervention.agent_entity_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2025'
      and agent.slug = 'david-payan-campos'
      and intervention.intervention_type = 'Autoría'
  ) then
    raise exception 'No se ha relacionado a David Payán Campos con el cartel de 2025';
  end if;
end
$$;
