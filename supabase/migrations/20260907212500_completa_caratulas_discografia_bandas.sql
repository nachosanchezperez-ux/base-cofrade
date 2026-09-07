-- Completa las carátulas editoriales pendientes de La Oliva de Salteras
-- y Rosario de Cádiz a partir de las ediciones canónicas de Apple Music.

do $$
declare
  v_updated_count integer;
begin
  with cover_data as (
    select *
    from (values
    (
      'banda-musica-oliva-salteras',
      'Hebdomada Sancta',
      2024,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ff/a3/12/ffa31220-d0be-c8be-65eb-abb00e23ca1c/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Esperanza por Huelva Coronada',
      2025,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/de/ab/05/deab056e-4e49-7f67-cf9c-613703f70aa3/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Amarguras',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/37/9c/67/379c670c-9034-39a9-ebb2-475a4e12b317/199891965540_cover.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'El Triunfo de la Cruz',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4f/78/be/4f78bec9-aa6e-82c2-43bb-f3a798b0798c/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'La Estrella Trianera',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/60/94/11609462-4950-249f-c29b-7836b98fc18e/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Marcha Fúnebre',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/7e/b1/1d7eb1a8-cb0c-b2d3-75b9-e3bea399651b/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Pasan los Campanilleros',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a6/68/3f/a6683f04-6cd6-2a2b-053c-4bedd35801aa/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Pasión de Cristo, confórtanos',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/d2/81/38d2815e-f15d-9715-dd83-5b3ca6734b27/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Reina de la Vera Cruz',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/68/e0/41/68e041f7-9d41-c22d-ce3b-9f282636a2a7/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-musica-oliva-salteras',
      'Soledad, Reina del Altozano',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/09/e0/db/09e0dbcf-a9d2-39e7-0ff5-c8b03e273ea8/artwork.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'De Cádiz... Un Rosario',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9d/24/6c/9d246c26-f9bf-3fb4-84d5-5d0fbd5032aa/196626730428.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'El Alma de un Maestro',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0c/d5/d1/0cd5d1ef-424f-aaa2-c9e5-68938e7170e3/196626789952.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Eterno',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f1/27/c3/f127c323-d525-c2c8-f051-38c94ef3e005/196626706881.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Flagelación',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bb/25/c0/bb25c034-9782-7db7-cb6b-dd42fc840d5a/196626818041.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Mayor Dolor en Tu Calvario',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/67/d1/b6/67d1b676-14bb-4f1b-bc7a-492184f0fc3a/196626809575.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Sagrada Familia',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/2e/0e/8c/2e0e8c23-190b-cbcf-1988-47f4a4af3078/196626750556.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Señor de Cádiz',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/63/fc/f6/63fcf6c2-65c7-2b83-5b01-5ffba043264e/196626801555.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Sólo Tú, Soledad',
      2022,
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/5b/57/aa/5b57aa0d-21dc-3ebe-fac7-3c14d5435cb4/196626810694.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Entregados a Ti',
      2023,
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8c/95/06/8c9506dd-ba34-9b00-4db2-5e42887d8a7b/197190527346.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Quinto Misterio',
      2023,
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/29/a0/1a29a0b2-ca90-14e1-177c-61bbc4946504/197190534061.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Siempre Caminando',
      2023,
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/3b/7d/3a3b7ddf-747d-466c-a757-d93b7909ea9e/197188483487.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'A Tu Corazón Mis Lágrimas',
      2024,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/20/c1/b5/20c1b59d-d7e8-e5ba-fe5c-507a655c4766/199066121771.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'El Rezo',
      2024,
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/fb/84/da/fb84da38-88c9-a542-2445-be63cf3b648b/198391254130.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Hijo de la Estrella',
      2024,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/ea/22/ecea229d-bd7b-8dff-9b1f-37ba3206ddd4/198846808147.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'A Dios',
      2025,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/00/ab/a1/00aba1f5-a9a6-c521-30a4-53c370f8f654/199806524602.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Aguas',
      2025,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1c/1c/9b/1c1c9be3-73a8-95fc-e0d4-510320ce8bad/199538863116.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Muerte en la Cruz',
      2025,
      'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c6/46/56/c64656ec-43ec-27b2-a9e8-30a7bb052a4e/199066905166.jpg/1200x1200bb.jpg'
    ),
    (
      'banda-cornetas-tambores-rosario-cadiz',
      'Cinco Lágrimas',
      2026,
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a1/54/48/a1544883-fcba-b394-ab09-4f12ebaf7bd2/820200235657.jpg/1200x1200bb.jpg'
    )
    ) as d(band_slug, release_title, release_year, cover_image_path)
  )
  update public.band_releases release
  set
    cover_image_path = desired.cover_image_path,
    cover_image_alt = 'Carátula de «' || release.title || '» de ' || band.name,
    cover_image_credit = 'Carátula editorial · Apple Music'
  from cover_data desired
  join public.entities band
    on band.slug = desired.band_slug
   and band.entity_type = 'band'
  where release.band_entity_id = band.id
    and release.title = desired.release_title
    and release.release_year = desired.release_year
    and release.status = 'published';

  get diagnostics v_updated_count = row_count;

  if v_updated_count <> 28 then
    raise exception
      'Se esperaban 28 carátulas actualizadas y se actualizaron %',
      v_updated_count;
  end if;

  if exists (
    select 1
    from public.band_releases
    where status = 'published'
      and (
        nullif(btrim(cover_image_path), '') is null
        or nullif(btrim(cover_image_alt), '') is null
        or nullif(btrim(cover_image_credit), '') is null
      )
  ) then
    raise exception 'Queda alguna edición publicada sin carátula, texto alternativo o crédito';
  end if;
end $$;
