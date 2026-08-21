-- Hilo Cofrade · Cartel de las Fiestas Mayores de la Divina Pastora 2026
-- Modelado como pieza patrimonial anual para reutilizar el mismo archivo
-- gráfico en la Pastora, la Asunción y futuras hermandades.

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'heritage_asset',
  'Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana 2026',
  'cartel-fiestas-mayores-divina-pastora-cantillana-2026',
  'Cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026, obra de Juan Miguel Martín Mena.',
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
  'Juan Miguel Martín Mena',
  'juan-miguel-martin-mena',
  'Artista y cartelista, autor del cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026.',
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
  'Artista y cartelista relacionado con la creación plástica y la cartelería religiosa.'
from public.entities agent
where agent.slug = 'juan-miguel-martin-mena'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select
  agent.id,
  'Pintura y cartelería',
  true,
  'Disciplina documentada por su autoría del cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026.'
from public.entities agent
where agent.slug = 'juan-miguel-martin-mena'
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
  'La obra presenta a la Divina Pastora preparada para su salida, envuelta por capas de memoria, golondrinas, rosas, destellos, el escudo corporativo y las cintas con los colores de España.',
  $statement$Cuando las golondrinas comienzan a despedirse del verano, Cantillana empieza a vivir la espera más hermosa del año. Su vuelo se convierte en el anuncio de que llegan los días de la Pastora.

Cuando pensamos en un cartel, solemos imaginar una imagen acompañada de un título. En esta ocasión he querido mirar mucho más atrás e inspirarme en aquellos antiguos carteles de ferias y fiestas de finales del siglo XIX y comienzos del XX, donde ilustración, ornamentación y tipografía formaban una única obra.

El cartel está realizado en técnica mixta sobre papel de algodón encolado a una tabla de 100 × 70 cm. Para ello he utilizado grafito, acuarela y acrílico. Apoyándome también en el collage con papel y piezas textiles y la transferencia de imágenes.

La composición está construida como si el tiempo hubiera ido superponiendo capas de historia. Los papeles rasgados dejan al descubierto las huellas de tantos septiembres, invitando al espectador a descubrir, poco a poco, la profundidad de una devoción transmitida de generación en generación.

Entre esas capas aparece un antiguo cartel de la Divina Pastora, donde se adivinan fragmentos de un texto apenas legible, inspirados en las expresiones y fórmulas con las que se anunciaban antiguamente los cultos a la Divina Pastora. Su redacción toma como referencia el cartel de 1863, el más antiguo que se conserva de estas fiestas.

De ese pasado emerge la imagen de la Divina Pastora con mantilla, con sombrero, con sus joyas. Lista para salir a la calle. Todo lo que aparece en este cartel hace que la mirada conduzca a Ella.

Las ramas del árbol que cobija a la Divina Pastora rompen deliberadamente el límite del cuadro y avanzan hacia el espectador.

Ese rosal simboliza el corazón del pastoreño que estalla de amor y devoción. Sus ramas se desbordan y se adueñan de Cantillana cada septiembre cuando la devoción abandona la intimidad de la casa para salir y llenar las calles del pueblo al encuentro de su Pastora.

Los destellos de luz evocan los fuegos artificiales que anuncian y acompañan el paso de la Virgen. Son la representación de ese instante irrepetible en el que la emoción contenida durante todo un año estalla con fuerza en la calle Martín Rey, uno de los instantes en que la devoción deja de ser un sentimiento íntimo y se convierte en un fervor compartido con todos los pastoreños.

También aparecen el escudo de la Hermandad y las cintas con los colores de España, elementos que recuerdan la identidad y el profundo arraigo histórico y popular de estas fiestas.

Las flores que envuelven la composición no están pintadas. Son bordados auténticos, recortados de antiguos mantones de Manila e incorporados a la obra mediante collage. Y es que me gustaría que este cartel pudiera entenderse como un rico mantón de seda. Yo he tejido su composición con recuerdos, símbolos e historia; pero a este mantón aún le falta el remate más importante. Y ese remate solo puede hacerlo Cantillana. Quiero que cada viva, cada Salve, cada oración, cada aplauso y cada lágrima se conviertan en los nudos invisibles que completen el enrejado de sus flecos.

Desde este momento, la obra deja de pertenecerme a mí para quedar en manos de quienes verdaderamente le dan sentido, de sus dueños, para que lo flequéis con vuestra verdad, con vuestra autenticidad y con ese fervor que solo Cantillana sabe ofrecer a la Divina Pastora de las Almas.$statement$,
  '2026-08-08',
  '2026',
  true,
  'Las golondrinas anuncian la llegada de septiembre; el rosal representa el corazón pastoreño que desborda la intimidad de las casas y los destellos evocan los fuegos artificiales de la calle Martín Rey. Los bordados de mantones de Manila convierten simbólicamente el cartel en un mantón que completa Cantillana con sus vivas, oraciones, aplausos y lágrimas.',
  'Técnica mixta sobre papel de algodón encolado a tabla',
  'Grafito, acuarela, acrílico, collage con papel y piezas textiles, transferencia de imágenes y bordados de antiguos mantones de Manila',
  '100 × 70 cm',
  'La Divina Pastora aparece con mantilla, sombrero y joyas, rodeada por golondrinas, ramas de rosal, fuegos artificiales, el escudo de la Hermandad y cintas con los colores de España. La composición conduce deliberadamente la mirada hacia la imagen mariana.',
  'La composición recupera el lenguaje unitario de ilustración, ornamentación y tipografía de los carteles de ferias y fiestas de finales del siglo XIX y comienzos del XX. Incorpora fragmentos inspirados en el cartel pastoreño de 1863, el más antiguo conservado de estas fiestas.',
  'Presentado el 8 de agosto de 2026 en la Casa de la Cultura de Cantillana.',
  900,
  true,
  '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2026.webp',
  'Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026, obra de Juan Miguel Martín Mena',
  'Obra · Juan Miguel Martín Mena'
from public.entities poster
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
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
  element_name = 'Cartel de las Fiestas Mayores 2026',
  intervention_type = 'Autoría',
  phase = 'Creación',
  date_from = '2026-08-08',
  date_from_text = '2026',
  description = 'Creación del cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026.',
  status = 'published',
  updated_at = now()
from public.entities poster, public.entities agent
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
  and agent.slug = 'juan-miguel-martin-mena'
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
  'Cartel de las Fiestas Mayores 2026',
  'Autoría',
  'Creación',
  '2026-08-08',
  '2026',
  'Creación del cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026.',
  'published'
from public.entities poster
join public.entities agent on agent.slug = 'juan-miguel-martin-mena'
where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
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
  where slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026';

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
    '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2026.webp',
    'image',
    'Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana 2026',
    'Cartel anunciador de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026.',
    'Cartel de las Fiestas Mayores de la Divina Pastora de Cantillana de 2026, obra de Juan Miguel Martín Mena',
    'Juan Miguel Martín Mena',
    'Hermandad de la Divina Pastora de Cantillana',
    'https://www.diariodesevilla.es/semana_santa/cartel-anunciador-fiestas-pastora-cantillana_0_2007693297.amp.html',
    'authorized',
    'Juan Miguel Martín Mena / Hermandad de la Divina Pastora de Cantillana',
    'Imagen y explicación autoral aportadas directamente al proyecto para su publicación en Hilo Cofrade.',
    '2026-08-08',
    1434,
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
    'Imagen principal del cartel de las Fiestas Mayores de 2026.',
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
  name = 'Así es el cartel anunciador de las Fiestas de la Pastora de Cantillana 2026',
  source_type = 'Prensa',
  author_or_publisher = 'Diario de Sevilla',
  publication_date = '2026-08-10',
  accessed_at = '2026-08-21',
  notes = 'La explicación completa del autor y la imagen fueron facilitadas directamente al proyecto.'
where source.url = 'https://www.diariodesevilla.es/semana_santa/cartel-anunciador-fiestas-pastora-cantillana_0_2007693297.amp.html';

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
  'Así es el cartel anunciador de las Fiestas de la Pastora de Cantillana 2026',
  'https://www.diariodesevilla.es/semana_santa/cartel-anunciador-fiestas-pastora-cantillana_0_2007693297.amp.html',
  'Prensa',
  'Diario de Sevilla',
  '2026-08-10',
  '2026-08-21',
  'La explicación completa del autor y la imagen fueron facilitadas directamente al proyecto.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://www.diariodesevilla.es/semana_santa/cartel-anunciador-fiestas-pastora-cantillana_0_2007693297.amp.html'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  poster.id,
  'Autoría, presentación, técnica, materiales, dimensiones y explicación iconográfica del cartel de 2026',
  'La transcripción íntegra de la explicación autoral fue aportada directamente al proyecto.'
from public.sources source
join public.entities poster
  on poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
where source.url = 'https://www.diariodesevilla.es/semana_santa/cartel-anunciador-fiestas-pastora-cantillana_0_2007693297.amp.html'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = poster.id
      and existing.scope = 'Autoría, presentación, técnica, materiales, dimensiones y explicación iconográfica del cartel de 2026'
  );

do $$
begin
  if not exists (
    select 1
    from public.heritage_assets asset
    join public.entities poster on poster.id = asset.entity_id
    join public.entities brotherhood on brotherhood.id = asset.parent_entity_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
      and brotherhood.slug = 'pastora-de-cantillana'
      and asset.asset_type = 'Cartel de las Fiestas'
      and asset.date_from_text = '2026'
  ) then
    raise exception 'No se ha creado el cartel anual de la Pastora de Cantillana de 2026';
  end if;

  if not exists (
    select 1
    from public.entity_media relation
    join public.entities poster on poster.id = relation.entity_id
    join public.media_assets media on media.id = relation.media_asset_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
      and media.storage_path = '/hermandades/pastora-de-cantillana/carteles/cartel-fiestas-mayores-2026.webp'
      and relation.is_cover
  ) then
    raise exception 'No se ha vinculado la imagen principal del cartel de 2026';
  end if;

  if not exists (
    select 1
    from public.heritage_interventions intervention
    join public.entities poster on poster.id = intervention.target_entity_id
    join public.entities agent on agent.id = intervention.agent_entity_id
    where poster.slug = 'cartel-fiestas-mayores-divina-pastora-cantillana-2026'
      and agent.slug = 'juan-miguel-martin-mena'
      and intervention.intervention_type = 'Autoría'
  ) then
    raise exception 'No se ha relacionado a Juan Miguel Martín Mena con el cartel de 2026';
  end if;
end
$$;
