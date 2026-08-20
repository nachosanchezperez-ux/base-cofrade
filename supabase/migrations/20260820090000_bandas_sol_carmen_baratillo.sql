-- Hilo Cofrade · Banda del Sol y Carmen de Salteras en la Hermandad del Baratillo
--
-- Crea las dos fichas de banda y documenta el acompañamiento musical vigente
-- de los pasos de la Piedad y de la Caridad. La relación institucional se
-- expresa como asociación, no como pertenencia a la Hermandad del Baratillo.

create temporary table _hc_baratillo_bands (
  slug text primary key,
  popular_name text not null,
  official_name text not null,
  short_name text,
  summary text not null,
  band_type text not null,
  municipality_slug text not null,
  foundation_text text not null,
  description text not null,
  website_url text,
  instagram_url text,
  youtube_url text,
  spotify_url text,
  primary_color text not null,
  secondary_color text not null,
  logo_path text not null,
  hero_image_path text not null,
  hero_image_alt text not null,
  hero_image_credit text not null,
  headquarters_text text not null
) on commit drop;

insert into _hc_baratillo_bands values
  (
    'banda-del-sol',
    'Banda del Sol',
    'Banda de Cornetas y Tambores Nuestra Señora del Sol',
    'BCT Ntra. Sra. del Sol',
    'Banda sevillana de cornetas y tambores fundada en 1975 y vinculada musicalmente a la Hermandad del Baratillo.',
    'Cornetas y Tambores',
    'sevilla',
    '1975',
    'La Banda de Cornetas y Tambores Nuestra Señora del Sol, conocida popularmente como Banda del Sol, acompaña actualmente al paso de la Piedad de la Hermandad del Baratillo. El contrato vigente fue renovado para los Miércoles Santos de 2027, 2028 y 2029.',
    'https://www.bandasol.com/',
    'https://www.instagram.com/bandasol/',
    'https://www.youtube.com/user/BandaSoLcom',
    'https://open.spotify.com/artist/2D3ZetVLafGW8DLFf2KpQu',
    '#0A3A92',
    '#061D59',
    '/bandas/banda-del-sol/imagotipo-50-aniversario.jpg',
    '/bandas/banda-del-sol/formacion-baratillo-2026.jpg',
    'Banda del Sol tras el paso de la Piedad de la Hermandad del Baratillo',
    'Hermandad del Baratillo · web oficial',
    'Sevilla'
  ),
  (
    'carmen-de-salteras',
    'Carmen de Salteras',
    'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',
    'Carmen de Salteras',
    'Sociedad filarmónica de Salteras fundada en 1928 y vinculada musicalmente a la Hermandad del Baratillo.',
    'Banda de Música',
    'salteras',
    '1928',
    'La Sociedad Filarmónica Nuestra Señora del Carmen de Salteras acompaña de forma ininterrumpida desde 1980 al paso de palio de María Santísima de la Caridad en su Soledad de la Hermandad del Baratillo.',
    'https://elcarmendesalteras.es/',
    'https://www.instagram.com/elcarmendesalteras/',
    'https://www.youtube.com/user/ElCarmenDeSalteras',
    'https://open.spotify.com/artist/77yqdpsmEhTAsUeG9dBaIE',
    '#8B451F',
    '#3C2115',
    '/bandas/carmen-de-salteras/imagotipo.png',
    '/bandas/carmen-de-salteras/formacion-baratillo-2024.jpg',
    'Músicos del Carmen de Salteras junto a la Piedad de la Hermandad del Baratillo',
    'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras · web oficial',
    'Calle 28 de Febrero, 11 · Salteras'
  );

insert into public.entities (entity_type, name, slug, summary, status)
select 'band', popular_name, slug, summary, 'published'
from _hc_baratillo_bands
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url,
  instagram_url, youtube_url, description, primary_color, secondary_color,
  logo_path, hero_image_path, hero_image_alt, hero_image_credit,
  linked_brotherhood_name, headquarters_text
)
select
  e.id, catalog.band_type, municipality.id, catalog.foundation_text,
  catalog.website_url, catalog.instagram_url, catalog.youtube_url,
  catalog.description, catalog.primary_color, catalog.secondary_color,
  catalog.logo_path, catalog.hero_image_path, catalog.hero_image_alt,
  catalog.hero_image_credit, 'Hermandad del Baratillo', catalog.headquarters_text
from _hc_baratillo_bands catalog
join public.entities e
  on e.slug = catalog.slug and e.entity_type = 'band'
join public.municipalities municipality
  on municipality.slug = catalog.municipality_slug
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  youtube_url = excluded.youtube_url,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  hero_image_path = excluded.hero_image_path,
  hero_image_alt = excluded.hero_image_alt,
  hero_image_credit = excluded.hero_image_credit,
  linked_brotherhood_name = excluded.linked_brotherhood_name,
  headquarters_text = excluded.headquarters_text;

update public.band_names name
set
  short_name = desired.short_name,
  is_current = true,
  date_to = null,
  date_to_text = null
from (
  select e.id as band_entity_id, catalog.official_name as name,
    catalog.short_name, 'official'::text as name_type
  from _hc_baratillo_bands catalog
  join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
  union all
  select e.id, catalog.popular_name, catalog.popular_name, 'popular'::text
  from _hc_baratillo_bands catalog
  join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
) desired
where name.band_entity_id = desired.band_entity_id
  and name.name = desired.name
  and name.name_type = desired.name_type;

insert into public.band_names (
  band_entity_id, name, short_name, name_type, is_current
)
select desired.band_entity_id, desired.name, desired.short_name, desired.name_type, true
from (
  select e.id as band_entity_id, catalog.official_name as name,
    catalog.short_name, 'official'::text as name_type
  from _hc_baratillo_bands catalog
  join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
  union all
  select e.id, catalog.popular_name, catalog.popular_name, 'popular'::text
  from _hc_baratillo_bands catalog
  join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
) desired
where not exists (
  select 1
  from public.band_names existing
  where existing.band_entity_id = desired.band_entity_id
    and existing.name = desired.name
    and existing.name_type = desired.name_type
);

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select e.id, link.platform, link.url, link.label, link.display_order, true
from _hc_baratillo_bands catalog
join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
cross join lateral (
  values
    ('website'::text, catalog.website_url, 'Web oficial'::text, 10::smallint),
    ('instagram', catalog.instagram_url, 'Instagram', 30::smallint),
    ('youtube', catalog.youtube_url, 'YouTube', 40::smallint),
    ('spotify', catalog.spotify_url, 'Spotify oficial', 50::smallint)
) link(platform, url, label, display_order)
where link.url is not null
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select e.id, color.color_name, color.hex_value, color.color_role,
  color.sort_order, color.notes, 'published'
from _hc_baratillo_bands catalog
join public.entities e on e.slug = catalog.slug and e.entity_type = 'band'
cross join lateral (
  values
    ('Primario'::text, catalog.primary_color, 'primary'::text, 10::smallint, 'Color principal de la identidad visual'::text),
    ('Secundario', catalog.secondary_color, 'secondary', 20::smallint, 'Color secundario de la identidad visual')
) color(color_name, hex_value, color_role, sort_order, notes)
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status;

create temporary table _hc_baratillo_music (
  band_slug text primary key,
  step_slug text not null,
  position text not null,
  date_from_text text not null,
  year_from integer,
  date_to_text text,
  year_to integer,
  notes text not null
) on commit drop;

insert into _hc_baratillo_music values
  (
    'banda-del-sol',
    'paso-de-la-piedad',
    'Tras el paso de la Piedad',
    'Vigente en 2026 · contrato hasta 2029',
    null,
    'Hasta 2029',
    2029,
    'Contrato renovado para los Miércoles Santos de 2027, 2028 y 2029.'
  ),
  (
    'carmen-de-salteras',
    'paso-de-palio-de-maria-santisima-de-la-caridad',
    'Tras el paso de palio de la Caridad',
    'Desde 1980',
    1980,
    null,
    null,
    'Acompañamiento ininterrumpido desde 1980.'
  );

update public.entity_relations relation
set
  date_from_text = music.date_from_text,
  date_to_text = music.date_to_text,
  notes = music.notes,
  status = 'published'
from _hc_baratillo_music music
join public.entities band
  on band.slug = music.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
where relation.source_entity_id = band.id
  and relation.target_entity_id = brotherhood.id
  and relation.relation_type = 'associated_with_brotherhood';

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id,
  date_from_text, date_to_text, notes, status
)
select
  band.id, 'associated_with_brotherhood', brotherhood.id,
  music.date_from_text, music.date_to_text, music.notes, 'published'
from _hc_baratillo_music music
join public.entities band
  on band.slug = music.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
where not exists (
  select 1
  from public.entity_relations existing
  where existing.source_entity_id = band.id
    and existing.target_entity_id = brotherhood.id
    and existing.relation_type = 'associated_with_brotherhood'
);

update public.music_accompaniment_periods period
set
  step_entity_id = step.id,
  position = music.position,
  outing_type = 'Miércoles Santo',
  date_from_text = music.date_from_text,
  year_from = music.year_from,
  date_to = null,
  date_to_text = music.date_to_text,
  year_to = music.year_to,
  is_current = true,
  notes = music.notes,
  status = 'published',
  public_brotherhood_name = 'Hermandad del Baratillo',
  public_step_name = step.name,
  public_brotherhood_slug = 'el-baratillo',
  updated_at = now()
from _hc_baratillo_music music
join public.entities band
  on band.slug = music.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = music.step_slug and step.entity_type = 'step'
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, date_from_text, year_from, date_to_text, year_to,
  is_current, notes, status, public_brotherhood_name,
  public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id, music.position,
  'Miércoles Santo', music.date_from_text, music.year_from,
  music.date_to_text, music.year_to, true, music.notes, 'published',
  'Hermandad del Baratillo', step.name, 'el-baratillo'
from _hc_baratillo_music music
join public.entities band
  on band.slug = music.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = music.step_slug and step.entity_type = 'step'
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.is_current
    and existing.status <> 'archived'
);

create temporary table _hc_baratillo_sources (
  band_slug text not null,
  name text not null,
  url text primary key,
  source_type text not null,
  author_or_publisher text not null,
  publication_date date,
  source_scope text not null,
  link_entity boolean not null default false,
  link_relation boolean not null default false,
  link_period boolean not null default false
) on commit drop;

insert into _hc_baratillo_sources values
  (
    'banda-del-sol',
    'Nuestra música · Banda de Cornetas y Tambores Nuestra Señora del Sol',
    'https://hermandaddelsol.org/grupos/nuestra-musica/',
    'Web oficial',
    'Hermandad del Sol',
    null,
    'Denominación oficial y año de fundación',
    true, false, false
  ),
  (
    'banda-del-sol',
    'Renovación del contrato con la Banda de CC. y TT. Ntra. Sra. del Sol',
    'https://hermandadelbaratillo.es/renovacion-del-contrato-con-la-banda-de-cc-tt-ntra-sra-del-sol/',
    'Web oficial',
    'Hermandad del Baratillo',
    '2026-08-07',
    'Vigencia del acompañamiento tras el paso de la Piedad hasta 2029',
    false, true, true
  ),
  (
    'carmen-de-salteras',
    'Historia de la Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',
    'https://elcarmendesalteras.es/historia/',
    'Web oficial',
    'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',
    null,
    'Denominación oficial y año de fundación',
    true, false, false
  ),
  (
    'carmen-de-salteras',
    'Renovación con la Sociedad Filarmónica de Ntra. Sra. del Carmen de Salteras',
    'https://hermandadelbaratillo.es/renovacion-con-la-sociedad-filarmonica-de-ntra-sra-del-carmen-de-salteras/',
    'Web oficial',
    'Hermandad del Baratillo',
    '2022-02-16',
    'Acompañamiento ininterrumpido tras el paso de palio desde 1980',
    false, true, true
  ),
  (
    'carmen-de-salteras',
    'Hermandad del Baratillo 2026 · Carmen de Salteras',
    'https://www.youtube.com/watch?v=uym5OGkCUpk',
    'Vídeo oficial',
    'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',
    null,
    'Vigencia del acompañamiento musical en 2026',
    false, false, true
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.author_or_publisher,
  publication_date = desired.publication_date,
  accessed_at = current_date
from _hc_baratillo_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select name, url, source_type, author_or_publisher, publication_date, current_date
from _hc_baratillo_sources desired
where not exists (
  select 1 from public.sources existing where existing.url = desired.url
);

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.source_scope
from _hc_baratillo_sources desired
join public.sources source on source.url = desired.url
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
where desired.link_entity
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id and existing.entity_id = band.id
  );

insert into public.source_links (source_id, entity_relation_id, scope)
select source.id, relation.id, desired.source_scope
from _hc_baratillo_sources desired
join public.sources source on source.url = desired.url
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
join public.entity_relations relation
  on relation.source_entity_id = band.id
 and relation.target_entity_id = brotherhood.id
 and relation.relation_type = 'associated_with_brotherhood'
where desired.link_relation
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_relation_id = relation.id
  );

insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select source.id, period.id, desired.source_scope
from _hc_baratillo_sources desired
join public.sources source on source.url = desired.url
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo' and brotherhood.entity_type = 'brotherhood'
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.is_current
 and period.status = 'published'
where desired.link_period
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.music_accompaniment_period_id = period.id
  );

do $$
declare
  band_count integer;
  relation_count integer;
  period_count integer;
begin
  select count(*) into band_count
  from public.entities
  where entity_type = 'band'
    and slug in ('banda-del-sol', 'carmen-de-salteras')
    and status = 'published';

  select count(*) into relation_count
  from public.entity_relations relation
  join public.entities band on band.id = relation.source_entity_id
  join public.entities brotherhood on brotherhood.id = relation.target_entity_id
  where band.slug in ('banda-del-sol', 'carmen-de-salteras')
    and brotherhood.slug = 'el-baratillo'
    and relation.relation_type = 'associated_with_brotherhood'
    and relation.status = 'published';

  select count(*) into period_count
  from public.music_accompaniment_periods period
  join public.entities band on band.id = period.band_entity_id
  join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
  join public.entities step on step.id = period.step_entity_id
  where band.slug in ('banda-del-sol', 'carmen-de-salteras')
    and brotherhood.slug = 'el-baratillo'
    and step.slug in (
      'paso-de-la-piedad',
      'paso-de-palio-de-maria-santisima-de-la-caridad'
    )
    and period.is_current
    and period.status = 'published';

  if band_count <> 2 then
    raise exception 'Se esperaban 2 bandas publicadas y se encontraron %', band_count;
  end if;

  if relation_count <> 2 then
    raise exception 'Se esperaban 2 asociaciones con el Baratillo y se encontraron %', relation_count;
  end if;

  if period_count <> 2 then
    raise exception 'Se esperaban 2 acompañamientos actuales del Baratillo y se encontraron %', period_count;
  end if;
end
$$;
