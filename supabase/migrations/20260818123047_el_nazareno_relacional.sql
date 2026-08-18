-- Hilo Cofrade · El Nazareno · primera pista discográfica relacional
-- Migración 047
--
-- Cierra el primer caso real de la cadena:
-- Banda → lanzamiento → pista/grabación → Marcha → compositor → dedicatoria → Imagen.
--
-- Criterios:
-- - la URL de Spotify pertenece a la grabación concreta de «Hijos de la Encarnación»;
-- - la Marcha conserva autoría y dedicatoria;
-- - Nuestro Padre Jesús de Nazaret se estructura como Imagen en borrador porque su
--   ficha completa todavía no forma parte del alcance actual;
-- - no se fabrican fechas exactas: el repertorio oficial documenta estreno en 2019.

-- -----------------------------------------------------------------------------
-- Fuentes oficiales
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, publication_date, accessed_at
) values
(
  'f4700000-0000-0000-0000-000000000010',
  'El Nazareno · Agrupación Musical Nuestra Señora de la Encarnación',
  'https://www.amencarnacion.com/el-nazareno/',
  'Web oficial',
  'Agrupación Musical Nuestra Señora de la Encarnación',
  '2018-12-01',
  '2026-08-18'
),
(
  'f4700000-0000-0000-0000-000000000011',
  'Repertorio 2019 · Agrupación Musical Nuestra Señora de la Encarnación',
  'https://www.amencarnacion.com/repertorio/',
  'Web oficial',
  'Agrupación Musical Nuestra Señora de la Encarnación',
  null,
  '2026-08-18'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at;

-- -----------------------------------------------------------------------------
-- Compositor reutilizable
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'f4700000-0000-0000-0000-000000000002',
  'agent',
  'Francisco David Álvarez Barroso',
  'francisco-david-alvarez-barroso',
  'Compositor de música procesional vinculado al repertorio de la Agrupación Musical Nuestra Señora de la Encarnación.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
select
  entity.id,
  'person',
  'Compositor de música procesional. La Agrupación Musical Nuestra Señora de la Encarnación documenta su autoría de «El Nazareno».'
from public.entities entity
where entity.slug = 'francisco-david-alvarez-barroso'
  and entity.entity_type = 'agent'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select
  entity.id,
  'Composición',
  true,
  'Compositor de «El Nazareno» y de otras obras documentadas en el repertorio de la formación.'
from public.entities entity
where entity.slug = 'francisco-david-alvarez-barroso'
  and entity.entity_type = 'agent'
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- Imagen dedicada · identidad mínima, todavía en borrador
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
select
  'f4700000-0000-0000-0000-000000000003',
  'image',
  'Nuestro Padre Jesús de Nazaret',
  'nuestro-padre-jesus-de-nazaret-pino-montano',
  'Imagen titular de la Hermandad de Pino Montano, destinataria de la marcha «El Nazareno».',
  'draft'
where not exists (
  select 1
  from public.entities existing
  where existing.entity_type = 'image'
    and existing.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
);

insert into public.images (entity_id, description)
select
  image.id,
  'Imagen de Nuestro Padre Jesús de Nazaret vinculada a la Hermandad de Pino Montano. La ficha documental completa queda pendiente.'
from public.entities image
where image.entity_type = 'image'
  and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
on conflict (entity_id) do update set
  description = coalesce(images.description, excluded.description);

insert into public.brotherhood_images (
  id, brotherhood_entity_id, image_entity_id, relation_type, notes, status
)
select
  'f4700000-0000-0000-0000-000000000004',
  brotherhood.id,
  image.id,
  'titular',
  'La fuente oficial de la Agrupación identifica a Nuestro Padre Jesús de Nazaret como titular de la Hermandad de Pino Montano.',
  'draft'
from public.entities brotherhood
join public.entities image
  on image.entity_type = 'image'
 and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
where brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-de-pino-montano'
  and not exists (
    select 1
    from public.brotherhood_images existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.image_entity_id = image.id
      and existing.relation_type = 'titular'
      and existing.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- Marcha · obra musical
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'f4700000-0000-0000-0000-000000000001',
  'march',
  'El Nazareno',
  'marcha-el-nazareno',
  'Marcha procesional de Francisco David Álvarez Barroso dedicada a Nuestro Padre Jesús de Nazaret, de la Hermandad de Pino Montano.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.marches (
  entity_id, music_type, premiere_date_text, description, notes
)
select
  march.id,
  'Marcha procesional',
  '2019',
  'Composición de Francisco David Álvarez Barroso dedicada a Nuestro Padre Jesús de Nazaret. La Agrupación anunció la obra en diciembre de 2018 y su repertorio oficial la identifica como estreno de 2019.',
  'La fuente de 2018 indica que el autor comenzó a desarrollar la idea en 2017. No se convierte ese dato en una fecha exacta de composición.'
from public.entities march
where march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno'
on conflict (entity_id) do update set
  music_type = excluded.music_type,
  premiere_date_text = excluded.premiere_date_text,
  description = excluded.description,
  notes = excluded.notes;

insert into public.march_authors (
  march_entity_id, agent_entity_id, author_role, notes, status
)
select
  march.id,
  composer.id,
  'composer',
  'Autoría documentada por la Agrupación Musical Nuestra Señora de la Encarnación.',
  'published'
from public.entities march
join public.entities composer
  on composer.entity_type = 'agent'
 and composer.slug = 'francisco-david-alvarez-barroso'
where march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno'
on conflict (march_entity_id, agent_entity_id, author_role) do update set
  notes = excluded.notes,
  status = excluded.status;

insert into public.march_dedications (
  id, march_entity_id, dedicatee_entity_id, dedication_type,
  dedication_text, date_from_text, notes, status
)
select
  'f4700000-0000-0000-0000-000000000005',
  march.id,
  image.id,
  'dedicated_to',
  'Nuestro Padre Jesús de Nazaret',
  'Documentada en 2018',
  'La Agrupación documenta expresamente que «El Nazareno» está dedicada a Nuestro Padre Jesús de Nazaret.',
  'published'
from public.entities march
join public.entities image
  on image.entity_type = 'image'
 and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
where march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno'
on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set
  dedication_text = excluded.dedication_text,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- Grabación concreta · pista 04 de «Hijos de la Encarnación»
-- Spotify es escucha, no Fuente documental.
-- -----------------------------------------------------------------------------

update public.band_release_tracks track
set
  march_entity_id = march.id,
  spotify_url = 'https://open.spotify.com/intl-es/track/0fTyW2v53sD9VRgXUz0eiu?si=7689227cafba479e'
from public.band_releases release,
     public.entities march
where track.release_id = release.id
  and release.band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and release.title = 'Hijos de la Encarnación'
  and track.sequence_no = 4
  and track.title = 'El Nazareno'
  and march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno';

-- -----------------------------------------------------------------------------
-- Vínculo documental exacto
-- -----------------------------------------------------------------------------

insert into public.source_links (id, source_id, entity_id, scope)
select
  'f4700000-0000-0000-0000-000000000020',
  'f4700000-0000-0000-0000-000000000010',
  march.id,
  'Autoría, dedicatoria y anuncio de la composición en 2018'
from public.entities march
where march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope;

insert into public.source_links (id, source_id, entity_id, scope)
select
  'f4700000-0000-0000-0000-000000000021',
  'f4700000-0000-0000-0000-000000000011',
  march.id,
  'Autoría y estreno de la marcha en el repertorio oficial de 2019'
from public.entities march
where march.entity_type = 'march'
  and march.slug = 'marcha-el-nazareno'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope;

insert into public.source_links (
  source_id, march_dedication_id, scope
)
select
  'f4700000-0000-0000-0000-000000000010',
  dedication.id,
  'Dedicatoria expresa a Nuestro Padre Jesús de Nazaret'
from public.march_dedications dedication
join public.entities march on march.id = dedication.march_entity_id
join public.entities image on image.id = dedication.dedicatee_entity_id
where march.slug = 'marcha-el-nazareno'
  and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
  and dedication.dedication_type = 'dedicated_to'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = 'f4700000-0000-0000-0000-000000000010'
      and existing.march_dedication_id = dedication.id
  );

insert into public.source_links (
  source_id, brotherhood_image_id, scope
)
select
  'f4700000-0000-0000-0000-000000000010',
  relation.id,
  'Identificación de Nuestro Padre Jesús de Nazaret como titular de la Hermandad de Pino Montano'
from public.brotherhood_images relation
join public.entities brotherhood on brotherhood.id = relation.brotherhood_entity_id
join public.entities image on image.id = relation.image_entity_id
where brotherhood.slug = 'hermandad-de-pino-montano'
  and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
  and relation.relation_type = 'titular'
  and relation.status <> 'archived'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = 'f4700000-0000-0000-0000-000000000010'
      and existing.brotherhood_image_id = relation.id
  );

-- -----------------------------------------------------------------------------
-- Validación explícita · no aceptar Success con cero filas útiles
-- -----------------------------------------------------------------------------

do $$
declare
  track_matches integer;
begin
  select count(*)
  into track_matches
  from public.band_release_tracks track
  join public.band_releases release on release.id = track.release_id
  join public.entities march on march.id = track.march_entity_id
  where release.band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
    and release.title = 'Hijos de la Encarnación'
    and track.sequence_no = 4
    and track.title = 'El Nazareno'
    and march.slug = 'marcha-el-nazareno'
    and track.spotify_url = 'https://open.spotify.com/intl-es/track/0fTyW2v53sD9VRgXUz0eiu?si=7689227cafba479e';

  if track_matches <> 1 then
    raise exception '047: no se pudo cerrar exactamente una pista El Nazareno en Hijos de la Encarnación';
  end if;

  if not exists (
    select 1
    from public.march_authors author
    join public.entities march on march.id = author.march_entity_id
    join public.entities composer on composer.id = author.agent_entity_id
    where march.slug = 'marcha-el-nazareno'
      and composer.slug = 'francisco-david-alvarez-barroso'
      and author.author_role = 'composer'
      and author.status = 'published'
  ) then
    raise exception '047: falta la autoría documentada de El Nazareno';
  end if;

  if not exists (
    select 1
    from public.march_dedications dedication
    join public.entities march on march.id = dedication.march_entity_id
    join public.entities image on image.id = dedication.dedicatee_entity_id
    where march.slug = 'marcha-el-nazareno'
      and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
      and dedication.status = 'published'
  ) then
    raise exception '047: falta la dedicatoria estructurada de El Nazareno';
  end if;

  if not exists (
    select 1
    from public.brotherhood_images relation
    join public.entities brotherhood on brotherhood.id = relation.brotherhood_entity_id
    join public.entities image on image.id = relation.image_entity_id
    where brotherhood.slug = 'hermandad-de-pino-montano'
      and image.slug = 'nuestro-padre-jesus-de-nazaret-pino-montano'
      and relation.relation_type = 'titular'
      and relation.status <> 'archived'
  ) then
    raise exception '047: falta el contexto Hermandad de Pino Montano → Nuestro Padre Jesús de Nazaret';
  end if;
end
$$;
