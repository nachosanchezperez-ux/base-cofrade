-- Hilo Cofrade · Reparación verificable del acompañamiento histórico de San Bernardo
--
-- La migración 028 modela todas las entidades relacionadas. Esta corrección
-- vuelve a materializar el periodo y la curiosidad y falla de forma explícita
-- si alguno de los tres elementos imprescindibles no existe, evitando que un
-- insert ... select sin coincidencias termine aparentemente bien con cero filas.

do $$
declare
  band_id uuid;
  brotherhood_id uuid;
  step_id uuid;
begin
  select id into band_id
  from public.entities
  where slug = 'las-cigarreras';

  select id into brotherhood_id
  from public.entities
  where slug = 'hermandad-de-san-bernardo';

  select id into step_id
  from public.entities
  where slug = 'paso-misterio-cristo-salud-san-bernardo';

  if band_id is null then
    raise exception 'No existe la entidad de banda las-cigarreras';
  end if;

  if brotherhood_id is null then
    raise exception 'No existe la entidad hermandad-de-san-bernardo';
  end if;

  if step_id is null then
    raise exception 'No existe la entidad paso-misterio-cristo-salud-san-bernardo';
  end if;

  insert into public.music_accompaniment_periods (
    id, brotherhood_entity_id, band_entity_id, step_entity_id,
    public_brotherhood_name, public_brotherhood_slug, public_step_name,
    position, outing_type, year_from, year_to, is_current, notes, status
  ) values (
    'e1300000-0000-0000-0000-000000000001',
    brotherhood_id,
    band_id,
    step_id,
    'Hermandad de San Bernardo',
    'hermandad-de-san-bernardo',
    'Paso de misterio del Santísimo Cristo de la Salud',
    'Tras el paso del Cristo de la Salud',
    'Miércoles Santo',
    1993,
    2003,
    false,
    null,
    'published'
  )
  on conflict (id) do update set
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    band_entity_id = excluded.band_entity_id,
    step_entity_id = excluded.step_entity_id,
    public_brotherhood_name = excluded.public_brotherhood_name,
    public_brotherhood_slug = excluded.public_brotherhood_slug,
    public_step_name = excluded.public_step_name,
    position = excluded.position,
    outing_type = excluded.outing_type,
    year_from = excluded.year_from,
    year_to = excluded.year_to,
    is_current = excluded.is_current,
    notes = excluded.notes,
    status = excluded.status;

  if not exists (
    select 1
    from public.music_accompaniment_periods
    where id = 'e1300000-0000-0000-0000-000000000001'
      and band_entity_id = band_id
      and is_current = false
      and status = 'published'
  ) then
    raise exception 'No se pudo verificar el acompañamiento histórico de San Bernardo';
  end if;

  insert into public.editorial_content (
    id, content_type, title, summary, body, eligible_for_daily, status
  ) values (
    'e1600000-0000-0000-0000-000000000001',
    'curiosity',
    '¿Sabías que…?',
    'De esta vinculación nació la marcha «Refúgiame», compuesta por Francis González Ríos.',
    'De esta vinculación nació la marcha «Refúgiame», compuesta por Francis González Ríos.',
    false,
    'published'
  )
  on conflict (id) do update set
    content_type = excluded.content_type,
    title = excluded.title,
    summary = excluded.summary,
    body = excluded.body,
    eligible_for_daily = excluded.eligible_for_daily,
    status = excluded.status;

  insert into public.editorial_content_links (
    id, editorial_content_id, entity_id, relation_type, is_primary
  ) values (
    'e1700000-0000-0000-0000-000000000001',
    'e1600000-0000-0000-0000-000000000001',
    band_id,
    'historical_accompaniment',
    true
  )
  on conflict (id) do update set
    editorial_content_id = excluded.editorial_content_id,
    entity_id = excluded.entity_id,
    relation_type = excluded.relation_type,
    is_primary = excluded.is_primary;
end
$$;
