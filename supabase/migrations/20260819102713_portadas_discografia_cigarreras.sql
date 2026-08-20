-- Hilo Cofrade · Portadas verificadas de la discografía de Las Cigarreras
-- Migración 054
--
-- Incorpora únicamente carátulas identificadas de forma reproducible en
-- fuentes oficiales, plataformas musicales o catálogos musicales contrastados.
-- Los lanzamientos cuya portada no se ha podido verificar permanecen con el
-- placeholder del componente, sin inventar ni aproximar imágenes.

do $$
declare
  band_id uuid;
  updated_covers integer;
  updated_spotify integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'las-cigarreras'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda de Las Cigarreras';
  end if;

  update public.band_releases as release
  set
    cover_image_path = covers.cover_path,
    cover_image_alt = covers.cover_alt,
    updated_at = now()
  from (
    values
      (
        'Cuaresma 2025... Suena Cigarreras',
        'https://lascigarreras.net/wp-content/uploads/2025/03/cartel-suenacigarreras-2025.jpg',
        'Portada de Cuaresma 2025... Suena Cigarreras'
      ),
      (
        'Galardón Madre Cigarrera 2024',
        'https://m.media-amazon.com/images/I/51LN3AoYV1L._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada de Galardón Madre Cigarrera 2024'
      ),
      (
        'Cuaresma 2024... Suena Cigarreras',
        'https://m.media-amazon.com/images/I/51zaMS3O44L._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada de Cuaresma 2024... Suena Cigarreras'
      ),
      (
        'En mis recuerdos...',
        'https://lascigarreras.net/wp-content/uploads/2023/08/producto-cd-en-mis-recuerdos-1-600x600.jpg',
        'Portada del disco En mis recuerdos... de Las Cigarreras'
      ),
      (
        'Homenaje de la música de Las Cigarreras a su Hermandad',
        'https://m.media-amazon.com/images/I/41XQ3j72eyL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada de Homenaje de la música de Las Cigarreras a su Hermandad'
      ),
      (
        'Armonía',
        'https://m.media-amazon.com/images/I/41YQI9D7JtL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada del disco Armonía de Las Cigarreras'
      ),
      (
        '25 Aniversario',
        'https://m.media-amazon.com/images/I/61ObJ9yn6eL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada del disco 25 Aniversario de Las Cigarreras'
      ),
      (
        'Madre Cigarrera',
        'https://m.media-amazon.com/images/I/51UQHpUh7WL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg',
        'Portada del disco Madre Cigarrera de Las Cigarreras'
      ),
      (
        'XX Aniversario',
        'https://coverartarchive.org/release/88cfa61a-3f5d-4df1-8673-a684aa71453a/front-500',
        'Portada del disco XX Aniversario de Las Cigarreras'
      )
  ) as covers(title, cover_path, cover_alt)
  where release.band_entity_id = band_id
    and release.title = covers.title;

  get diagnostics updated_covers = row_count;

  if updated_covers <> 9 then
    raise exception 'Se esperaban 9 portadas actualizadas y se actualizaron %', updated_covers;
  end if;

  update public.band_releases as release
  set
    spotify_url = links.spotify_url,
    updated_at = now()
  from (
    values
      (
        'Cuaresma 2025... Suena Cigarreras',
        'https://open.spotify.com/album/0tbw1E8iiSEblaR94wu1TO'
      ),
      (
        'XX Aniversario',
        'https://open.spotify.com/album/2VYlXfYizXK9LHwhzn08Pv'
      )
  ) as links(title, spotify_url)
  where release.band_entity_id = band_id
    and release.title = links.title;

  get diagnostics updated_spotify = row_count;

  if updated_spotify <> 2 then
    raise exception 'Se esperaban 2 enlaces de Spotify actualizados y se actualizaron %', updated_spotify;
  end if;
end
$$;
