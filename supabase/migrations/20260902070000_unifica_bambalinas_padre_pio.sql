-- Ajuste editorial · Padre Pío
-- Unifica la actuación de las bambalinas, completa sus colores y asocia una
-- fotografía oficial. Solo DML sobre el modelo First Edition existente.

do $$
declare
  v_brotherhood_id uuid;
  v_step_id uuid;
  v_asset_id uuid;
  v_update_id uuid;
begin
  select id into strict v_brotherhood_id
  from public.entities
  where slug = 'padre-pio-sevilla';

  select id into strict v_step_id
  from public.entities
  where slug = 'paso-palio-madre-divina-gracia-padre-pio';

  update public.brotherhood_colors
  set color_name = 'Crema',
      color_role = 'secondary',
      sort_order = 2,
      notes = 'Color de la túnica y la capa; sin HEX institucional documentado.',
      status = 'published',
      updated_at = now()
  where brotherhood_entity_id = v_brotherhood_id
    and color_name = 'Marfil'
    and not exists (
      select 1
      from public.brotherhood_colors existing
      where existing.brotherhood_entity_id = v_brotherhood_id
        and existing.color_name = 'Crema'
    );

  delete from public.brotherhood_colors
  where brotherhood_entity_id = v_brotherhood_id
    and color_name = 'Marfil';

  insert into public.brotherhood_colors (
    brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  )
  values
    (v_brotherhood_id, 'Burdeos', null, 'primary', 1, 'Color del antifaz, el cíngulo y la botonadura; también presente en el terciopelo de las bambalinas. Sin HEX institucional documentado.', 'published'),
    (v_brotherhood_id, 'Crema', null, 'secondary', 2, 'Color de la túnica y la capa; sin HEX institucional documentado.', 'published'),
    (v_brotherhood_id, 'Dorado', null, 'accent', 3, 'Color complementario de la pasamanería del palio; sin HEX institucional documentado.', 'published')
  on conflict (brotherhood_entity_id, color_name) do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();

  insert into public.entities (entity_type, name, slug, summary, status)
  values (
    'heritage_asset',
    'Bambalinas del paso de palio de la Madre de la Divina Gracia',
    'bambalinas-palio-madre-divina-gracia-padre-pio',
    'Conjunto de cuatro bambalinas renovado en 2026 mediante limpieza, mejora y un nuevo juego de cordones y flecos de bellota.',
    'published'
  )
  on conflict (slug) do update set
    entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now()
  returning id into v_asset_id;

  insert into public.heritage_assets (
    entity_id, parent_entity_id, asset_type, description, current_condition,
    notes, date_from, date_from_text, is_current, origin_notes, technique,
    materials, display_order, is_featured, public_image_path,
    public_image_alt, public_image_credit
  )
  values (
    v_asset_id,
    v_step_id,
    'Conjunto textil del palio',
    'Las cuatro bambalinas fueron limpiadas y mejoradas en 2026 y recibieron un nuevo juego completo de cordones y flecos de bellota.',
    'extant',
    'La actuación se conserva como una única unidad documental vinculada al paso de palio.',
    date '2026-08-24',
    'Limpieza concluida el 24 de agosto de 2026; estreno previsto el 11 de octubre de 2026',
    true,
    'Donación íntegra de un grupo de hermanos para la salida extraordinaria de la Virgen Madre de la Divina Gracia.',
    'Conservación textil y pasamanería',
    'Terciopelo burdeos y pasamanería dorada',
    0,
    false,
    '/hermandades/padre-pio/bambalinas-palio-2026.jpeg',
    'Bambalina de terciopelo burdeos con el nuevo juego dorado de cordones y flecos de bellota.',
    'Procedencia: web oficial de la Hermandad de Padre Pío · autoría no indicada'
  )
  on conflict (entity_id) do update set
    parent_entity_id = excluded.parent_entity_id,
    asset_type = excluded.asset_type,
    description = excluded.description,
    current_condition = excluded.current_condition,
    notes = excluded.notes,
    date_from = excluded.date_from,
    date_from_text = excluded.date_from_text,
    is_current = excluded.is_current,
    origin_notes = excluded.origin_notes,
    technique = excluded.technique,
    materials = excluded.materials,
    display_order = excluded.display_order,
    is_featured = excluded.is_featured,
    public_image_path = excluded.public_image_path,
    public_image_alt = excluded.public_image_alt,
    public_image_credit = excluded.public_image_credit;

  select hu.id into v_update_id
  from public.heritage_updates hu
  where hu.brotherhood_entity_id = v_brotherhood_id
    and hu.year = 2026
    and hu.title in (
      'Renovación de las bambalinas del palio',
      'Nuevos cordones y flecos de bellota para el palio'
    )
  order by (hu.title = 'Renovación de las bambalinas del palio') desc
  limit 1;

  if v_update_id is null then
    insert into public.heritage_updates (
      brotherhood_entity_id, update_type, title, update_date, year,
      target_entity_id, element_name, discipline, description, status
    )
    values (
      v_brotherhood_id, 'estreno', 'Renovación de las bambalinas del palio',
      date '2026-10-11', 2026, v_asset_id,
      'Bambalinas, cordones y flecos de bellota del paso de palio',
      'Conservación textil y pasamanería',
      'Actuación unificada para la extraordinaria de la Virgen Madre de la Divina Gracia: limpieza y mejora de las cuatro bambalinas, concluidas el 24 de agosto de 2026, y realización de un nuevo juego completo de cordones y flecos de bellota dorados, previsto para estrenarse el 11 de octubre de 2026. El conjunto fue donado íntegramente por un grupo de hermanos.',
      'published'
    )
    returning id into v_update_id;
  else
    update public.heritage_updates
    set update_type = 'estreno',
        title = 'Renovación de las bambalinas del palio',
        update_date = date '2026-10-11',
        year = 2026,
        target_entity_id = v_asset_id,
        element_name = 'Bambalinas, cordones y flecos de bellota del paso de palio',
        discipline = 'Conservación textil y pasamanería',
        description = 'Actuación unificada para la extraordinaria de la Virgen Madre de la Divina Gracia: limpieza y mejora de las cuatro bambalinas, concluidas el 24 de agosto de 2026, y realización de un nuevo juego completo de cordones y flecos de bellota dorados, previsto para estrenarse el 11 de octubre de 2026. El conjunto fue donado íntegramente por un grupo de hermanos.',
        status = 'published',
        updated_at = now()
    where id = v_update_id;
  end if;

  delete from public.heritage_updates
  where brotherhood_entity_id = v_brotherhood_id
    and year = 2026
    and id <> v_update_id
    and title = 'Limpieza y mejora de las bambalinas del palio';

  delete from public.heritage_update_agents
  where heritage_update_id = v_update_id;

  insert into public.heritage_update_agents (
    heritage_update_id, agent_entity_id, role_name, discipline, notes
  )
  select v_update_id, agent.id,
         'Limpieza, mejora y realización',
         'Conservación textil y pasamanería',
         'Trabajo desarrollado desde mediados de julio de 2026 en domicilios de devotas y en la Casa de Hermandad.'
  from public.entities agent
  where agent.slug in (
    'ana-sanchez-padre-pio',
    'isabel-sanchez-padre-pio',
    'maria-angeles-barrionuevo-padre-pio',
    'dolores-arnozan-padre-pio',
    'clara-bocanegra-padre-pio',
    'rosario-exposito-padre-pio',
    'rosa-maria-pavon-padre-pio'
  );

  insert into public.source_links (source_id, heritage_update_id, scope, notes)
  select source.id, v_update_id, 'Renovación y estreno de las bambalinas',
         'Publicación oficial del 25 de agosto de 2026, incluida su galería fotográfica.'
  from public.sources source
  where source.url = 'https://hermandadpadrepio.com/estreno-de-nuevos-cordones-y-flecos-de-bellota-para-el-palio-de-la-santisima-virgen-madre-de-la-divina-gracia/'
    and not exists (
      select 1
      from public.source_links link
      where link.source_id = source.id
        and link.heritage_update_id = v_update_id
    );

  insert into public.source_links (source_id, entity_id, scope, notes)
  select source.id, v_asset_id, 'Bambalinas del paso de palio',
         'Fuente oficial de la actuación y de la fotografía asociada.'
  from public.sources source
  where source.url = 'https://hermandadpadrepio.com/estreno-de-nuevos-cordones-y-flecos-de-bellota-para-el-palio-de-la-santisima-virgen-madre-de-la-divina-gracia/'
    and not exists (
      select 1
      from public.source_links link
      where link.source_id = source.id
        and link.entity_id = v_asset_id
    );

  if (
    select array_agg(color_name order by sort_order)
    from public.brotherhood_colors
    where brotherhood_entity_id = v_brotherhood_id and status = 'published'
  ) <> array['Burdeos', 'Crema', 'Dorado']::text[] then
    raise exception 'Padre Pío debe publicar los colores burdeos, crema y dorado en ese orden';
  end if;

  if (
    select count(*)
    from public.heritage_updates
    where brotherhood_entity_id = v_brotherhood_id and year = 2026 and status = 'published'
  ) <> 1 then
    raise exception 'La actuación de las bambalinas debe quedar unificada en una ficha';
  end if;

  if (
    select count(*)
    from public.heritage_update_agents
    where heritage_update_id = v_update_id
  ) <> 7 then
    raise exception 'La ficha unificada debe reconocer a sus siete responsables';
  end if;

  if not exists (
    select 1
    from public.heritage_assets
    where entity_id = v_asset_id
      and public_image_path = '/hermandades/padre-pio/bambalinas-palio-2026.jpeg'
      and nullif(public_image_alt, '') is not null
      and nullif(public_image_credit, '') is not null
  ) then
    raise exception 'La ficha unificada debe conservar fotografía, texto alternativo y crédito';
  end if;
end
$$;
