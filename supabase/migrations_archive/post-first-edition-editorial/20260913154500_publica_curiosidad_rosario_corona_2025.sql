-- Hilo Cofrade · Curiosidad documentada del Rosario de la Corona · 2025
--
-- La relación con el paso de Guadalupe se conserva en la salida concreta de
-- 2025. No se crea una relación permanente Corona–paso, porque fue una cesión
-- para aquella procesión extraordinaria.

begin;

do $$
declare
  v_brotherhood_id uuid;
  v_image_id uuid;
  v_guadalupe_brotherhood_id uuid;
  v_guadalupe_step_id uuid;
  v_municipality_id uuid;
  v_outing_id uuid;
  v_editorial_content_id uuid := '55edb8a2-6c36-4c74-8858-bd5b244f148d';
  v_guadalupe_source_id uuid;
  v_anniversary_source_id uuid;
begin
  select id into v_brotherhood_id
  from public.entities
  where slug = 'cristo-de-la-corona'
    and entity_type = 'brotherhood'
    and status = 'published';

  select id into v_image_id
  from public.entities
  where slug = 'nuestra-senora-rosario-corona-sevilla'
    and entity_type = 'image'
    and status = 'published';

  select id into v_guadalupe_brotherhood_id
  from public.entities
  where slug = 'guadalupe-san-buenaventura'
    and entity_type = 'brotherhood'
    and status = 'published';

  select id into v_guadalupe_step_id
  from public.entities
  where slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
    and entity_type = 'step'
    and status = 'published';

  if v_brotherhood_id is null then
    raise exception 'No se encuentra publicada la Hermandad del Santísimo Cristo de la Corona';
  end if;

  if v_image_id is null then
    raise exception 'No se encuentra publicada Nuestra Señora del Rosario de la Hermandad de la Corona';
  end if;

  if v_guadalupe_brotherhood_id is null then
    raise exception 'No se encuentra publicada la Hermandad de Guadalupe de San Buenaventura';
  end if;

  if v_guadalupe_step_id is null then
    raise exception 'No se encuentra publicado el paso procesional de Nuestra Señora de Guadalupe de San Buenaventura';
  end if;

  if not exists (
    select 1
    from public.brotherhood_steps
    where brotherhood_entity_id = v_guadalupe_brotherhood_id
      and step_entity_id = v_guadalupe_step_id
      and relation_type = 'processional_step'
      and status = 'published'
  ) then
    raise exception 'El paso de Guadalupe no está vinculado a la Hermandad de San Buenaventura';
  end if;

  select municipality_id into v_municipality_id
  from public.brotherhoods
  where entity_id = v_brotherhood_id;

  if v_municipality_id is null then
    raise exception 'La Hermandad de la Corona no tiene localidad canónica';
  end if;

  insert into public.outings (
    brotherhood_entity_id,
    outing_type,
    character,
    title,
    outing_date,
    year,
    municipality_id,
    reason,
    route_summary,
    description,
    organizer_name,
    event_status,
    status,
    slug,
    reference_code,
    updated_at
  ) values (
    v_brotherhood_id,
    'Procesión extraordinaria',
    'extraordinary',
    'Procesión extraordinaria de Nuestra Señora del Rosario 2025',
    date '2025-10-04',
    2025,
    v_municipality_id,
    'XXV aniversario de la aprobación de las reglas de la corporación como Hermandad de Penitencia.',
    'Por las calles de la feligresía de la Hermandad de la Corona.',
    'Nuestra Señora del Rosario volvió a procesionar en 2025 y lo hizo sobre el paso procesional de Nuestra Señora de Guadalupe, cedido por la Hermandad de Guadalupe de San Buenaventura.',
    'Hermandad del Santísimo Cristo de la Corona',
    'held',
    'published',
    'sevilla-corona-procesion-extraordinaria-rosario-2025-10-04',
    'CORONA-ROSARIO-2025',
    now()
  )
  on conflict (slug) where slug is not null do update set
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    outing_type = excluded.outing_type,
    character = excluded.character,
    title = excluded.title,
    outing_date = excluded.outing_date,
    year = excluded.year,
    municipality_id = excluded.municipality_id,
    reason = excluded.reason,
    route_summary = excluded.route_summary,
    description = excluded.description,
    organizer_name = excluded.organizer_name,
    event_status = excluded.event_status,
    status = excluded.status,
    reference_code = excluded.reference_code,
    updated_at = now()
  returning id into v_outing_id;

  insert into public.outing_entities (
    outing_id,
    entity_id,
    role,
    notes
  ) values
    (
      v_outing_id,
      v_image_id,
      'processional_image',
      'Nuestra Señora del Rosario presidió la procesión extraordinaria del 4 de octubre de 2025.'
    ),
    (
      v_outing_id,
      v_guadalupe_step_id,
      'processional_step',
      'Paso de Nuestra Señora de Guadalupe cedido por la Hermandad de Guadalupe de San Buenaventura para esta salida extraordinaria.'
    )
  on conflict (outing_id, entity_id, role) do update set
    notes = excluded.notes;

  insert into public.editorial_content (
    id,
    content_type,
    title,
    subtitle,
    summary,
    body,
    publish_date,
    author_name,
    eligible_for_daily,
    daily_priority,
    status,
    updated_at
  ) values (
    v_editorial_content_id,
    'curiosity',
    'El regreso de Nuestra Señora del Rosario en 2025',
    'Historia · XXV aniversario',
    'Nuestra Señora del Rosario volvió a procesionar el 4 de octubre de 2025 sobre el paso de Nuestra Señora de Guadalupe de San Buenaventura.',
    'El 4 de octubre de 2025, Nuestra Señora del Rosario volvió a procesionar por las calles de la feligresía en una salida extraordinaria por el XXV aniversario de la aprobación de las reglas de la Corona como Hermandad de Penitencia. Para aquella ocasión, la imagen fue entronizada sobre el paso procesional de Nuestra Señora de Guadalupe, cedido por la Hermandad de Guadalupe de San Buenaventura.',
    date '2026-09-13',
    'Hilo Cofrade',
    false,
    0,
    'published',
    now()
  )
  on conflict (id) do update set
    content_type = excluded.content_type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    summary = excluded.summary,
    body = excluded.body,
    publish_date = excluded.publish_date,
    author_name = excluded.author_name,
    eligible_for_daily = excluded.eligible_for_daily,
    daily_priority = excluded.daily_priority,
    status = excluded.status,
    updated_at = now();

  insert into public.editorial_content_links (
    editorial_content_id,
    entity_id,
    relation_type,
    is_primary,
    notes
  ) values
    (
      v_editorial_content_id,
      v_brotherhood_id,
      'about',
      true,
      'Curiosidad histórica principal de la Hermandad de la Corona.'
    ),
    (
      v_editorial_content_id,
      v_image_id,
      'featured_image',
      false,
      'Imagen que protagonizó la salida extraordinaria de 2025.'
    ),
    (
      v_editorial_content_id,
      v_guadalupe_brotherhood_id,
      'related_brotherhood',
      false,
      'Hermandad que cedió el paso procesional para la salida de 2025.'
    ),
    (
      v_editorial_content_id,
      v_guadalupe_step_id,
      'featured_step',
      false,
      'Paso procesional utilizado por Nuestra Señora del Rosario en la salida extraordinaria de 2025.'
    )
  on conflict (editorial_content_id, entity_id, relation_type) do update set
    is_primary = excluded.is_primary,
    notes = excluded.notes;

  select id into v_guadalupe_source_id
  from public.sources
  where url = 'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/'
  order by created_at
  limit 1;

  if v_guadalupe_source_id is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      'Guadalupe de San Buenaventura · cesión del paso a la Hermandad de la Corona',
      'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/',
      'Web oficial',
      'Hermandad de Nuestra Señora de Guadalupe de Sevilla',
      date '2025-09-14',
      date '2026-09-13',
      'Fuente oficial para la cesión, la identidad del paso, la fecha y el carácter conmemorativo de la salida.'
    )
    returning id into v_guadalupe_source_id;
  else
    update public.sources
    set name = 'Guadalupe de San Buenaventura · cesión del paso a la Hermandad de la Corona',
        source_type = 'Web oficial',
        author_or_publisher = 'Hermandad de Nuestra Señora de Guadalupe de Sevilla',
        publication_date = date '2025-09-14',
        accessed_at = date '2026-09-13',
        notes = 'Fuente oficial para la cesión, la identidad del paso, la fecha y el carácter conmemorativo de la salida.'
    where id = v_guadalupe_source_id;
  end if;

  select id into v_anniversary_source_id
  from public.sources
  where url = 'https://pasionyesperanza.com/2024/02/08/la-corona-conmemorara-en-2025-el-xxv-aniversario-de-sus-reglas-como-hermandad-penitencial/'
  order by created_at
  limit 1;

  if v_anniversary_source_id is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      'La Corona · XXV aniversario de sus reglas como Hermandad de Penitencia',
      'https://pasionyesperanza.com/2024/02/08/la-corona-conmemorara-en-2025-el-xxv-aniversario-de-sus-reglas-como-hermandad-penitencial/',
      'Medio especializado',
      'Pasión y Esperanza',
      date '2024-02-08',
      date '2026-09-13',
      'Fuente para la efeméride, la fecha del 4 de octubre de 2025 y la salida de Nuestra Señora del Rosario.'
    )
    returning id into v_anniversary_source_id;
  else
    update public.sources
    set name = 'La Corona · XXV aniversario de sus reglas como Hermandad de Penitencia',
        source_type = 'Medio especializado',
        author_or_publisher = 'Pasión y Esperanza',
        publication_date = date '2024-02-08',
        accessed_at = date '2026-09-13',
        notes = 'Fuente para la efeméride, la fecha del 4 de octubre de 2025 y la salida de Nuestra Señora del Rosario.'
    where id = v_anniversary_source_id;
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_guadalupe_source_id
      and outing_id = v_outing_id
  ) then
    insert into public.source_links (source_id, outing_id, scope, notes)
    values (
      v_guadalupe_source_id,
      v_outing_id,
      'Procesión extraordinaria · 4 de octubre de 2025',
      'Cesión y utilización del paso de Nuestra Señora de Guadalupe.'
    );
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_anniversary_source_id
      and outing_id = v_outing_id
  ) then
    insert into public.source_links (source_id, outing_id, scope, notes)
    values (
      v_anniversary_source_id,
      v_outing_id,
      'Procesión extraordinaria · 4 de octubre de 2025',
      'Fecha y motivo conmemorativo de la procesión.'
    );
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_guadalupe_source_id
      and editorial_content_id = v_editorial_content_id
  ) then
    insert into public.source_links (source_id, editorial_content_id, scope, notes)
    values (
      v_guadalupe_source_id,
      v_editorial_content_id,
      'Curiosidad · paso cedido',
      'Documenta la cesión y el uso del paso de Guadalupe en la salida de 2025.'
    );
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_anniversary_source_id
      and editorial_content_id = v_editorial_content_id
  ) then
    insert into public.source_links (source_id, editorial_content_id, scope, notes)
    values (
      v_anniversary_source_id,
      v_editorial_content_id,
      'Curiosidad · XXV aniversario',
      'Documenta la efeméride y la fecha de la salida extraordinaria.'
    );
  end if;
end
$$;

commit;
