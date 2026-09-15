-- Discografía de La Oliva de Salteras · estabilización de carátulas históricas.
-- Sustituye 17 recursos del servidor editorial de la banda por las carátulas
-- canónicas de las mismas ediciones ya enlazadas en Apple Music.
-- Solo DML. No modifica esquema, funciones, permisos ni RLS.

do $$
declare
  v_band_id uuid;
  v_updated_count integer;
begin
  select id
  into v_band_id
  from public.entities
  where slug = 'banda-musica-oliva-salteras'
    and entity_type = 'band';

  if v_band_id is null then
    raise exception 'No existe la ficha canónica de La Oliva de Salteras';
  end if;

  if (
    select count(*)
    from public.entities
    where slug = 'banda-musica-oliva-salteras'
      and entity_type = 'band'
  ) <> 1 then
    raise exception 'La ficha canónica de La Oliva de Salteras no es unívoca';
  end if;

  with cover_data as (
    select *
    from (values
      ('Crucifixus', 2019, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/5c/75/f65c7507-8276-2add-9342-b58871f873fa/artwork.jpg/1200x1200bb.jpg'),
      ('Salteras y sus Bandas de Música', 2018, 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/80/a6/80/80a680cc-e84c-cceb-bbde-ede34e49789a/5057917946438_cover.jpg/1200x1200bb.jpg'),
      ('Partituras de Pasión. Volumen 1', 2017, 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/d1/54/22/d1542265-dc8e-4a87-ab28-68ffb8343d96/5057917639729_cover.jpg/1200x1200bb.jpg'),
      ('Passio', 2016, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8c/16/53/8c1653de-fc5f-af89-a7e8-8b31e6523540/artwork.jpg/1200x1200bb.jpg'),
      ('1913… desde Salteras', 2014, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e8/99/20/e8992051-f915-867b-ca94-c94dcfcafe56/artwork.jpg/1200x1200bb.jpg'),
      ('Pasión. Un siglo de música', 2009, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/78/8c/00/788c001c-1d0d-0bc0-99c4-feeb5d6c8934/artwork.jpg/1200x1200bb.jpg'),
      ('Camino del Gólgota', 2006, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f0/a7/51/f0a75193-522f-f3cd-8c9d-d6a4fa3ca122/artwork.jpg/1200x1200bb.jpg'),
      ('Mektub «Estaba escrito»', 2005, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/20/38/bd203845-ed05-4c13-bc98-ab01f0bce9ba/artwork.jpg/1200x1200bb.jpg'),
      ('Vera Cruz', 2004, 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/93/f1/c6/93f1c61b-6a4a-ee46-0eef-348f2f7c88e7/5057917771948_cover.jpg/1200x1200bb.jpg'),
      ('Cordero de Dios', 2003, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/20/10/f8/2010f8e6-5a04-15b6-ff3b-a0ac08741a43/8429721008454.jpg/1200x1200bb.jpg'),
      ('Sevilla Llora', 1998, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/12/64/48/12644804-3069-8399-2485-8537108f19c1/8429721001080.jpg/1200x1200bb.jpg'),
      ('Al Cachorro', 1996, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c9/03/5f/c9035f72-a095-d906-849d-19bcde088dcf/199538638899.jpg/1200x1200bb.jpg'),
      ('Pasodobles Taurinos', 1995, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/82/a0/30/82a0307d-708c-ea6c-7d30-fec493417fdb/198588409268.jpg/1200x1200bb.jpg'),
      ('Sinfonía Sevillana', 1993, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/21/ed/6e/21ed6e0d-90c6-5cb1-4e25-a811be12deba/8429721003008.jpg/1200x1200bb.jpg'),
      ('De Triana a Sevilla', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/5d/7f/7c5d7f5c-3847-62c4-6b86-0ec95f8baba6/199538617405.jpg/1200x1200bb.jpg'),
      ('Coronación', 1990, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/bc/6e/2bbc6e76-6094-c114-ea1a-e989ae65889f/198391959370.jpg/1200x1200bb.jpg'),
      ('Semana Santa en Triana', 1988, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3b/c9/f1/3bc9f11c-2713-b8cb-b005-cbb8edc29fd8/198391562402.jpg/1200x1200bb.jpg')
    ) as d(release_title, release_year, cover_image_path)
  )
  update public.band_releases release
  set
    cover_image_path = desired.cover_image_path,
    cover_image_alt = 'Carátula de «' || release.title || '» de Banda de Música de la Oliva de Salteras',
    cover_image_credit = 'Carátula editorial · Apple Music'
  from cover_data desired
  where release.band_entity_id = v_band_id
    and release.title = desired.release_title
    and release.release_year = desired.release_year
    and release.status = 'published';

  get diagnostics v_updated_count = row_count;

  if v_updated_count <> 17 then
    raise exception
      'Se esperaban 17 carátulas históricas actualizadas y se actualizaron %',
      v_updated_count;
  end if;

  if exists (
    select 1
    from public.band_releases
    where band_entity_id = v_band_id
      and status = 'published'
      and cover_image_path like 'https://laolivadesalteras.com/wp-content/%'
  ) then
    raise exception 'La discografía publicada conserva alguna carátula dependiente del servidor antiguo';
  end if;

  if exists (
    select 1
    from public.band_releases
    where band_entity_id = v_band_id
      and status = 'published'
      and (
        nullif(btrim(cover_image_path), '') is null
        or nullif(btrim(cover_image_alt), '') is null
        or nullif(btrim(cover_image_credit), '') is null
      )
  ) then
    raise exception 'La discografía publicada conserva alguna carátula sin ruta, texto alternativo o crédito';
  end if;
end $$;
