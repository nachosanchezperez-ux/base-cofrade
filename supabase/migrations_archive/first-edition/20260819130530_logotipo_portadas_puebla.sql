-- Hilo Cofrade · Logotipo y portadas de la Banda Municipal de La Puebla del Río
-- Migración 057
--
-- Incorpora la identidad gráfica visible en el perfil oficial de Spotify y
-- las tres portadas históricas publicadas por la propia Banda. Los archivos
-- se sirven desde el proyecto para no depender de disponibilidad remota.

do $$
declare
  band_id uuid;
  updated_covers integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'banda-municipal-de-musica-de-la-puebla-del-rio'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda Municipal de Música de La Puebla del Río';
  end if;

  update public.bands
  set logo_path = '/bandas/la-puebla/imagotipo.jpg'
  where entity_id = band_id;

  if not found then
    raise exception 'No existe la ficha interna de la Banda Municipal de Música de La Puebla del Río';
  end if;

  update public.band_releases as release
  set
    cover_image_path = covers.cover_path,
    cover_image_alt = covers.cover_alt,
    cover_image_credit = 'Banda Municipal de Música de La Puebla del Río · web oficial',
    updated_at = now()
  from (
    values
      (
        'Jesús de Pasión',
        '/bandas/la-puebla/discografia/jesus-de-pasion.jpg',
        'Portada del disco Jesús de Pasión de la Banda Municipal de Música de La Puebla del Río'
      ),
      (
        'Evocación Cofrade',
        '/bandas/la-puebla/discografia/evocacion-cofrade.jpg',
        'Portada del disco Evocación Cofrade de la Banda Municipal de Música de La Puebla del Río'
      ),
      (
        '…A la Sevilla Cofrade',
        '/bandas/la-puebla/discografia/a-la-sevilla-cofrade.jpg',
        'Portada del disco …A la Sevilla Cofrade de la Banda Municipal de Música de La Puebla del Río'
      )
  ) as covers(title, cover_path, cover_alt)
  where release.band_entity_id = band_id
    and release.title = covers.title;

  get diagnostics updated_covers = row_count;

  if updated_covers <> 3 then
    raise exception 'Se esperaban 3 portadas actualizadas y se actualizaron %', updated_covers;
  end if;

  insert into public.entity_social_links (
    entity_id, platform, url, label, display_order, is_public
  ) values (
    band_id,
    'spotify',
    'https://open.spotify.com/artist/39z6lIpQDmy1nBE0401di8',
    'Spotify oficial',
    50,
    true
  )
  on conflict (entity_id, platform) do update set
    url = excluded.url,
    label = excluded.label,
    display_order = excluded.display_order,
    is_public = excluded.is_public;
end
$$;
