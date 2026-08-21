-- Hilo Cofrade · ficha completa de la Banda de Música de Nuestra Señora
-- de la Soledad de Cantillana.
--
-- La banda ya existe. Esta carga conserva su UUID, completa su identidad,
-- publica sus canales oficiales y añade el acompañamiento vigente de la
-- Asunción sin alterar la relación ya documentada con la Divina Pastora.

-- -----------------------------------------------------------------------------
-- 1. Identidad editorial y visual
-- -----------------------------------------------------------------------------

update public.entities
set
  name = 'Banda de Música de Nuestra Señora de la Soledad de Cantillana',
  summary = 'Banda de música de Cantillana fundada en 1960, presente en las principales celebraciones de la localidad y con acompañamientos documentados a la Asunción y la Divina Pastora.',
  status = 'published',
  updated_at = now()
where entity_type = 'band'
  and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

do $$
begin
  if not exists (
    select 1
    from public.entities
    where entity_type = 'band'
      and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  ) then
    raise exception 'No existe la ficha de la Banda de la Soledad de Cantillana';
  end if;
end $$;

update public.bands band
set
  band_type = 'Banda de Música',
  foundation_text = '1960',
  website_url = 'https://lasoledaddecantillana.blogspot.com/',
  instagram_url = 'https://www.instagram.com/bmsoledadcantillana/',
  youtube_url = 'https://www.youtube.com/channel/UCi_MgyLzkNQ73Wc4YxMl83g',
  description = 'Formación musical fundada en 1960 en Cantillana. Su actividad comprende repertorio cofrade, conciertos y acompañamientos procesionales, con presencia documentada en las Fiestas Asuncionistas y en los cultos y fiestas de la Divina Pastora.',
  primary_color = '#D6A51F',
  secondary_color = '#111216',
  logo_path = '/bandas/soledad-cantillana/logotipo.webp',
  hero_image_path = null,
  hero_image_alt = null,
  hero_image_credit = null,
  banderin_entity_id = null,
  headquarters_text = 'Cantillana'
from public.entities entity
where band.entity_id = entity.id
  and entity.entity_type = 'band'
  and entity.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

update public.band_names band_name
set
  name = 'Banda de Música de Nuestra Señora de la Soledad de Cantillana',
  short_name = 'B. M. Ntra. Sra. de la Soledad',
  notes = 'Denominación pública de la formación.'
from public.entities band
where band_name.band_entity_id = band.id
  and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and band_name.name_type = 'official'
  and band_name.is_current;

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select
  band.id, desired.color_name, desired.hex_value,
  desired.color_role, desired.sort_order, desired.notes, 'published'
from public.entities band
cross join (
  values
    ('Oro del escudo', '#D6A51F', 'primary', 1::smallint, 'Color dominante del escudo de la formación.'),
    ('Negro del escudo', '#111216', 'secondary', 2::smallint, 'Fondo del escudo de la formación.')
) as desired(color_name, hex_value, color_role, sort_order, notes)
where band.entity_type = 'band'
  and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 2. Canales oficiales
-- -----------------------------------------------------------------------------

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select
  band.id, desired.platform, desired.url, desired.label,
  desired.display_order, true
from public.entities band
cross join (
  values
    ('website', 'https://lasoledaddecantillana.blogspot.com/', 'Web oficial', 1::smallint),
    ('facebook', 'https://www.facebook.com/bandademusicade.cantillana/', 'Facebook oficial', 2::smallint),
    ('instagram', 'https://www.instagram.com/bmsoledadcantillana/', 'Instagram oficial', 3::smallint),
    ('x', 'https://x.com/BandaCantillana', 'X oficial', 4::smallint),
    ('youtube', 'https://www.youtube.com/channel/UCi_MgyLzkNQ73Wc4YxMl83g', 'YouTube oficial', 5::smallint),
    ('spotify', 'https://open.spotify.com/artist/7F8kpo1olf3MpRMqVSNGR5', 'Spotify', 6::smallint)
) as desired(platform, url, label, display_order)
where band.entity_type = 'band'
  and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 3. Glorias de Cantillana: Pastora y Asunción
-- -----------------------------------------------------------------------------

update public.music_accompaniment_periods period
set
  outing_type = 'Procesión de gloria',
  public_municipality_name = 'Cantillana',
  public_municipality_slug = 'cantillana',
  public_province = 'Sevilla',
  updated_at = now()
from public.entities band, public.entities brotherhood
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and brotherhood.slug = 'pastora-de-cantillana'
  and period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

update public.entity_relations relation
set
  date_from_text = 'Vigente en 2026',
  notes = 'Acompañamiento musical documentado para la procesión del 15 de agosto de 2026.',
  status = 'published'
from public.entities band, public.entities brotherhood
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and brotherhood.slug = 'asuncion-de-cantillana'
  and relation.source_entity_id = band.id
  and relation.target_entity_id = brotherhood.id
  and relation.relation_type = 'associated_with_brotherhood';

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id,
  date_from_text, notes, status
)
select
  band.id, 'associated_with_brotherhood', brotherhood.id,
  'Vigente en 2026',
  'Acompañamiento musical documentado para la procesión del 15 de agosto de 2026.',
  'published'
from public.entities band
join public.entities brotherhood
  on brotherhood.slug = 'asuncion-de-cantillana'
 and brotherhood.entity_type = 'brotherhood'
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and band.entity_type = 'band'
  and not exists (
    select 1
    from public.entity_relations existing
    where existing.source_entity_id = band.id
      and existing.target_entity_id = brotherhood.id
      and existing.relation_type = 'associated_with_brotherhood'
  );

update public.music_accompaniment_periods period
set
  step_entity_id = step.id,
  position = 'Tras el paso de Nuestra Señora de la Asunción',
  outing_type = 'Procesión de gloria',
  date_from = null,
  date_from_text = 'Vigente en 2026',
  year_from = 2026,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = 'Acompaña a Nuestra Señora de la Asunción en la procesión del 15 de agosto, dentro de las Fiestas Asuncionistas.',
  status = 'published',
  public_brotherhood_name = 'La Asunción de Cantillana',
  public_step_name = 'Paso procesional de Nuestra Señora de la Asunción',
  public_brotherhood_slug = 'asuncion-de-cantillana',
  public_municipality_name = 'Cantillana',
  public_municipality_slug = 'cantillana',
  public_province = 'Sevilla',
  updated_at = now()
from public.entities band, public.entities brotherhood, public.entities step
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and brotherhood.slug = 'asuncion-de-cantillana'
  and step.slug = 'paso-procesional-nuestra-senora-de-la-asuncion-cantillana'
  and period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text, year_from,
  is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select
  brotherhood.id, band.id, step.id,
  'Tras el paso de Nuestra Señora de la Asunción',
  'Procesión de gloria', 'Vigente en 2026', 2026,
  true,
  'Acompaña a Nuestra Señora de la Asunción en la procesión del 15 de agosto, dentro de las Fiestas Asuncionistas.',
  'published',
  'La Asunción de Cantillana',
  'Paso procesional de Nuestra Señora de la Asunción',
  'asuncion-de-cantillana',
  'Cantillana', 'cantillana', 'Sevilla'
from public.entities band
join public.entities brotherhood
  on brotherhood.slug = 'asuncion-de-cantillana'
 and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = 'paso-procesional-nuestra-senora-de-la-asuncion-cantillana'
 and step.entity_type = 'step'
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and band.entity_type = 'band'
  and not exists (
    select 1
    from public.music_accompaniment_periods existing
    where existing.band_entity_id = band.id
      and existing.brotherhood_entity_id = brotherhood.id
      and existing.is_current
      and existing.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 4. Fuentes y trazabilidad
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_soledad_identity_sources;
create temporary table _hc_soledad_identity_sources (
  name text not null,
  url text primary key,
  source_type text not null,
  publisher text,
  publication_date date,
  scope text not null,
  notes text
) on commit drop;

insert into _hc_soledad_identity_sources values
  (
    'Cantillana estrena su nueva Escuela de Música Gabriel Ríos Amores',
    'https://www.dipusevilla.es/comunicacion/noticias/Cantillana-estrena-su-nueva-escuela-de-musica-Gabriel-Rios-Amores-con-una-inversion-de-659.000-euros/',
    'Web institucional', 'Diputación de Sevilla', null,
    'Fundación en 1960 e identidad histórica de la formación',
    null
  ),
  (
    'Directorio · Nuestra Señora de la Soledad de Cantillana',
    'https://musicofrades.com/directorio-de-bandas/bandas-de-musica/nuestra-senora-de-la-soledad-de-cantillana/',
    'Directorio especializado', 'Musicofrades', null,
    'Denominación, localidad y canales públicos de la banda',
    'Ficha consultada para normalizar los enlaces oficiales.'
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date,
  notes = desired.notes
from _hc_soledad_identity_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher,
  publication_date, accessed_at, notes
)
select
  desired.name, desired.url, desired.source_type, desired.publisher,
  desired.publication_date, '2026-08-21'::date, desired.notes
from _hc_soledad_identity_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
);

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.scope
from _hc_soledad_identity_sources desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = band.id
);

drop table if exists pg_temp._hc_soledad_asuncion_sources;
create temporary table _hc_soledad_asuncion_sources (
  name text not null,
  url text primary key,
  source_type text not null,
  publisher text,
  publication_date date
) on commit drop;

insert into _hc_soledad_asuncion_sources values
  (
    'La Asunción de Cantillana cambia el estilo musical de los rosarios de agosto',
    'https://www.elpespunte.es/articulo/cofrade/asuncion-cantillana-cambia-estilo-musical-rosarios-agosto-banda-santa-ana/20260618135434138181.html',
    'Prensa cofrade', 'El Pespunte', '2026-06-18'
  ),
  (
    'La Virgen de la Asunción recorrerá Cantillana durante casi nueve horas el 15 de agosto',
    'https://www.mundocofrade.es/articulo/actualidad/virgen-asuncion-recorrera-cantillana-casi-nueve-horas-15-agosto/20260814092242007657.html',
    'Prensa cofrade', 'Mundo Cofrade', '2026-08-14'
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date
from _hc_soledad_asuncion_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher,
  publication_date, accessed_at
)
select
  desired.name, desired.url, desired.source_type, desired.publisher,
  desired.publication_date, '2026-08-21'::date
from _hc_soledad_asuncion_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
);

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select
  source.id, period.id,
  'Acompañamiento de la Asunción y procesión del 15 de agosto de 2026'
from _hc_soledad_asuncion_sources desired
join public.entities band
  on band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
 and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = 'asuncion-de-cantillana'
 and brotherhood.entity_type = 'brotherhood'
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.is_current
 and period.status = 'published'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
);

-- -----------------------------------------------------------------------------
-- 5. Invariantes editoriales
-- -----------------------------------------------------------------------------

do $$
declare
  band_id uuid;
  accompaniment_count integer;
  social_count integer;
  source_count integer;
begin
  select id into band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

  if band_id is null then
    raise exception 'No se ha localizado la Banda de la Soledad';
  end if;

  if not exists (
    select 1
    from public.bands
    where entity_id = band_id
      and logo_path = '/bandas/soledad-cantillana/logotipo.webp'
      and hero_image_path is null
      and banderin_entity_id is null
  ) then
    raise exception 'La identidad visual de la banda no es la prevista';
  end if;

  select count(*) into social_count
  from public.entity_social_links
  where entity_id = band_id
    and is_public
    and platform in ('website', 'facebook', 'instagram', 'x', 'youtube', 'spotify');

  if social_count <> 6 then
    raise exception 'La banda debe tener seis canales públicos documentados';
  end if;

  select count(*) into accompaniment_count
  from public.music_accompaniment_periods period
  join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published'
    and period.outing_type = 'Procesión de gloria'
    and period.public_municipality_slug = 'cantillana'
    and brotherhood.slug in ('pastora-de-cantillana', 'asuncion-de-cantillana');

  if accompaniment_count <> 2 then
    raise exception 'Deben constar las dos procesiones de gloria de Cantillana';
  end if;

  select count(*) into source_count
  from public.source_links link
  join public.sources source on source.id = link.source_id
  left join public.music_accompaniment_periods period
    on period.id = link.music_accompaniment_period_id
  where (link.entity_id = band_id or period.band_entity_id = band_id)
    and source.url in (
      'https://www.dipusevilla.es/comunicacion/noticias/Cantillana-estrena-su-nueva-escuela-de-musica-Gabriel-Rios-Amores-con-una-inversion-de-659.000-euros/',
      'https://musicofrades.com/directorio-de-bandas/bandas-de-musica/nuestra-senora-de-la-soledad-de-cantillana/',
      'https://www.elpespunte.es/articulo/cofrade/asuncion-cantillana-cambia-estilo-musical-rosarios-agosto-banda-santa-ana/20260618135434138181.html',
      'https://www.mundocofrade.es/articulo/actualidad/virgen-asuncion-recorrera-cantillana-casi-nueve-horas-15-agosto/20260814092242007657.html'
    );

  if source_count <> 4 then
    raise exception 'Deben existir cuatro vínculos de fuente para la ampliación';
  end if;
end $$;

