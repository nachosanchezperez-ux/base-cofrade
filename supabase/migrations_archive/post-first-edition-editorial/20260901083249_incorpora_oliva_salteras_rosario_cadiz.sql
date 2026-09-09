-- Lote editorial · La Oliva de Salteras + Rosario de Cádiz
-- Solo DML sobre el modelo First Edition existente: identidad, fuentes,
-- relaciones musicales, discografía y grafo. No introduce DDL ni RLS.

do $$
begin
  if (select count(*) from public.entities where slug = 'banda-musica-oliva-salteras') <> 1 then
    raise exception 'La ficha canónica de La Oliva de Salteras no es unívoca';
  end if;

  if (select count(*) from public.entities
      where slug = 'banda-cornetas-tambores-rosario-cadiz') > 1 then
    raise exception 'Rosario de Cádiz aparece duplicada antes del lote';
  end if;
end $$;

insert into public.municipalities (name, slug, province, autonomous_community, country)
select v.name, v.slug, v.province, 'Andalucía', 'España'
from (values
  ('Cádiz', 'cadiz', 'Cádiz'),
  ('Salteras', 'salteras', 'Sevilla'),
  ('Sevilla', 'sevilla', 'Sevilla'),
  ('Jerez de la Frontera', 'jerez-de-la-frontera', 'Cádiz')
) as v(name, slug, province)
where not exists (
  select 1 from public.municipalities m
  where m.slug = v.slug or lower(m.name) = lower(v.name)
);

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select v.name, v.url, v.source_type, v.publisher, v.publication_date, date '2026-09-01', v.notes
from (values
  ('La Oliva de Salteras · Historia', 'https://laolivadesalteras.com/historia/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', null::date, 'Identidad, fundación administrativa, trayectoria y acompañamientos publicados por la formación.'),
  ('La Oliva de Salteras · Discografía', 'https://laolivadesalteras.com/discografia/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', null::date, 'Catálogo histórico, carátulas y repertorios de diecisiete trabajos.'),
  ('La Oliva de Salteras · sitio oficial', 'https://laolivadesalteras.com/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', null::date, 'Identidad visual y enlaces oficiales.'),
  ('Apple Music · La Oliva de Salteras', 'https://music.apple.com/es/artist/la-oliva-de-salteras/1544305380', 'Catálogo musical', 'Apple Music', null::date, 'Perfil oficial de artista y catálogo digital vigente.'),
  ('La Oliva · renovación con El Museo', 'https://laolivadesalteras.com/renovacion-museo/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2024-01-22', 'Renovación para los Lunes Santos de 2024, 2025 y 2026.'),
  ('La Oliva · cuarenta años tras la Estrella', 'https://laolivadesalteras.com/40-anos-tras-maria-santisima-de-la-estrella/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2020-04-05', 'Documenta el inicio del periodo actual en 1980.'),
  ('La Oliva · continuidad con la Estrella', 'https://laolivadesalteras.com/estrella-coronada/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2024-10-27', 'Confirma más de cuatro décadas ininterrumpidas y la continuidad del vínculo.'),
  ('La Oliva · renovación con el Dulce Nombre', 'https://laolivadesalteras.com/oliva-renueva-hermandad-dulce-nombre/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2023-01-26', 'Renovación hasta 2026 y más de veintisiete años de vínculo documentados en 2023; no permite fijar un año inicial exacto.'),
  ('La Oliva · renovación con la Sed', 'https://laolivadesalteras.com/renovacion-con-la-hermandad-de-la-sed-de-nervion/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2024-08-06', 'Renovación por cuatro años y veintidós años de vinculación en 2024.'),
  ('La Oliva · Pasión en 2026', 'https://laolivadesalteras.com/concierto-benefico-de-cuaresma-en-el-salvador-2026-para-la-archicofradia-de-pasion/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2026-03-12', 'Actividad oficial de 2026 que confirma la continuidad del vínculo con Pasión.'),
  ('La Oliva · Pasión: elegancia y seriedad', 'https://laolivadesalteras.com/pasion-elegancia-y-seriedad/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2022-02-25', 'La formación incluye expresamente a Pasión entre sus hermandades y confirma el acompañamiento del Jueves Santo.'),
  ('La Oliva · Cachorro en 2026', 'https://laolivadesalteras.com/concierto-en-honor-a-la-hermandad-del-cachorro-en-la-cuaresma-de-2026/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2026-02-18', 'Actividad oficial de 2026 y continuidad del vínculo con el Cachorro.'),
  ('La Oliva · renovación con la Trinidad', 'https://laolivadesalteras.com/renovacion-hermandad-de-trinidad/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2023-12-20', 'Renovación por tres años, incluido el Sábado Santo de 2026.'),
  ('La Oliva · renovación con la Vera Cruz de Salteras', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2024-02-11', 'Vinculación local y acompañamiento del Miércoles Santo.'),
  ('La Oliva · Angustias de Aznalcázar 2026', 'https://laolivadesalteras.com/salida-extraordinaria-de-maria-santisima-de-las-angustias-de-aznalcazar/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', date '2026-08-21', 'Confirma la salida extraordinaria ya conectada en el calendario.'),
  ('Rosario de Cádiz · Sentirse Rosario', 'https://rosariodecadiz.com/sentirse-rosario/', 'Web oficial', 'Banda de Cornetas y Tambores Nuestra Señora del Rosario Coronada', null::date, 'Historia institucional: fundación en 1996, cambio de denominación en 1998 y evolución discográfica.'),
  ('Rosario de Cádiz · Discografía', 'https://rosariodecadiz.com/discografia/', 'Web oficial', 'Banda de Cornetas y Tambores Nuestra Señora del Rosario Coronada', null::date, 'Índice oficial de los cinco trabajos discográficos.'),
  ('Rosario de Cádiz · logotipo', 'https://rosariodecadiz.com/logotipo-01/', 'Web oficial', 'Banda de Cornetas y Tambores Nuestra Señora del Rosario Coronada', date '2016-09-23', 'Adjunto oficial del logotipo de la formación.'),
  ('Apple Music · Rosario de Cádiz', 'https://music.apple.com/es/artist/rosario-de-c%C3%A1diz/1348563005', 'Catálogo musical', 'Apple Music', null::date, 'Perfil oficial de artista y catálogo digital vigente.'),
  ('Spotify · Rosario de Cádiz', 'https://open.spotify.com/artist/5UFZ8g9ZH8FMbvftI8NC15', 'Catálogo musical', 'Spotify', null::date, 'Perfil oficial de artista.'),
  ('YouTube · Rosario de Cádiz', 'https://www.youtube.com/channel/UCN2u_wP105P0mU8fPmB4kpA', 'Canal oficial', 'Rosario de Cádiz', null::date, 'Canal oficial de la formación.'),
  ('Rosario · renovación con la Estrella hasta 2029', 'https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html', 'Prensa especializada', 'Diario de Sevilla', date '2025-11-11', 'Renovación por cuatro años tras el misterio de Jesús de las Penas.'),
  ('Rosario · renovación con Las Aguas', 'https://www.facebook.com/Rosariodecadiz/posts/1417386663077206/', 'Red social oficial', 'Rosario de Cádiz', date '2026-01-30', 'Renovación por tres años tras el Santísimo Cristo de las Aguas.'),
  ('Rosario · renovación con Columna', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html', 'Prensa especializada', 'Diario de Cádiz', date '2024-08-01', 'Contrato para 2025 y 2026; periodo actual iniciado en 2017.'),
  ('Rosario · renovación con la Sed hasta 2028', 'https://www.diariodesevilla.es/semana_santa/sed-renueva-rosario-cadiz-cuatro_0_2002121749.html', 'Prensa especializada', 'Diario de Sevilla', date '2024-07-30', 'Renovación por cuatro años; primer acompañamiento efectivo en 2017.'),
  ('Rosario · renovación con la Exaltación', 'https://www.instagram.com/p/DTgeGLcjDLj/', 'Red social oficial', 'Rosario de Cádiz', null::date, 'Continuidad tras el Santísimo Cristo de la Exaltación.'),
  ('Rosario · renovación con la Entrega', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html', 'Prensa especializada', 'Diario de Jerez', date '2025-02-13', 'Vínculo iniciado en 2022 y renovado para el Sábado de Pasión.'),
  ('Rosario de Cádiz · agenda penitencial 2026', 'https://musicofrades.com/asi-sera-la-semana-santa-de-2026-de-rosario-de-cadiz/', 'Prensa especializada', 'Musicofrades', date '2026-02-01', 'Contraste de la agenda de 2026; no incluye la relación finalizada con Santa Marta.'),
  ('Rosario · final de la vinculación con Santa Marta', 'https://www.diariodejerez.es/semanasanta/banda-rosario-cadiz-no-continuara-hermandad-santa-marta_0_2005755938.html', 'Prensa especializada', 'Diario de Jerez', date '2026-01-28', 'Fuente negativa de control: Santa Marta no forma parte de la agenda vigente de 2026.')
) as v(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

update public.sources
set accessed_at = date '2026-09-01'
where url in (
  'https://laolivadesalteras.com/historia/',
  'https://laolivadesalteras.com/discografia/',
  'https://laolivadesalteras.com/',
  'https://music.apple.com/es/artist/la-oliva-de-salteras/1544305380',
  'https://rosariodecadiz.com/sentirse-rosario/',
  'https://rosariodecadiz.com/discografia/',
  'https://rosariodecadiz.com/logotipo-01/',
  'https://music.apple.com/es/artist/rosario-de-c%C3%A1diz/1348563005',
  'https://open.spotify.com/artist/5UFZ8g9ZH8FMbvftI8NC15',
  'https://www.youtube.com/channel/UCN2u_wP105P0mU8fPmB4kpA'
);

update public.entities
set name = 'Banda de Música de la Oliva de Salteras',
    summary = 'Sociedad filarmónica fundada administrativamente en Salteras el 4 de enero de 1913, con antecedentes musicales documentados hacia 1900 y una extensa trayectoria procesional y discográfica.',
    status = 'published',
    updated_at = now()
where slug = 'banda-musica-oliva-salteras';

insert into public.entities (entity_type, name, slug, summary, status)
select
  'band',
  'Rosario de Cádiz',
  'banda-cornetas-tambores-rosario-cadiz',
  'Banda de cornetas y tambores fundada en Cádiz el 7 de mayo de 1996 y denominada Nuestra Señora del Rosario Coronada desde 1998.',
  'published'
where not exists (
  select 1 from public.entities where slug = 'banda-cornetas-tambores-rosario-cadiz'
);

update public.entities
set name = 'Rosario de Cádiz',
    summary = 'Banda de cornetas y tambores fundada en Cádiz el 7 de mayo de 1996 y denominada Nuestra Señora del Rosario Coronada desde 1998.',
    status = 'published',
    updated_at = now()
where slug = 'banda-cornetas-tambores-rosario-cadiz';

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url, instagram_url,
  description, primary_color, secondary_color, logo_path, logo_background_color,
  headquarters_text, youtube_url
)
select
  e.id,
  'Banda de Música',
  (select id from public.municipalities where slug = 'salteras' order by created_at limit 1),
  '4 de enero de 1913; antecedentes documentados hacia 1900',
  'https://laolivadesalteras.com/',
  'https://www.instagram.com/olivasalteras',
  'La Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras quedó constituida administrativamente en 1913 sobre una tradición musical local documentada desde comienzos del siglo XX. Su actividad reúne repertorio sinfónico y procesional, formación musical y una discografía histórica de diecisiete trabajos, ampliada en años recientes por nuevas grabaciones digitales.',
  '#08090B', '#D7A01A',
  'https://laolivadesalteras.com/wp-content/uploads/2026/08/cropped-para-insta.png',
  '#FFFFFF',
  'Salteras · Sevilla',
  'https://www.youtube.com/channel/UC8jnIuRjbWgCCiXNQBTx3Ug'
from public.entities e
where e.slug = 'banda-musica-oliva-salteras'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  logo_background_color = excluded.logo_background_color,
  headquarters_text = excluded.headquarters_text,
  youtube_url = excluded.youtube_url;

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url, instagram_url,
  description, primary_color, secondary_color, logo_path, logo_background_color,
  headquarters_text, youtube_url
)
select
  e.id,
  'Cornetas y Tambores',
  (select id from public.municipalities where slug = 'cadiz' order by created_at limit 1),
  '7 de mayo de 1996; denominación actual desde 1998',
  'https://rosariodecadiz.com/',
  'https://www.instagram.com/bandarosariodecadiz/',
  'La formación nació en Cádiz en 1996 bajo la advocación del Santísimo Cristo de la Humildad y Paciencia. En 1998 adoptó la denominación de Nuestra Señora del Rosario Coronada. Su proyección procesional alcanza Cádiz, Jerez y Sevilla y su catálogo reúne cinco trabajos discográficos, además de sencillos digitales posteriores.',
  '#6F1831', '#C7A24A',
  'https://rosariodecadiz.com/wp-content/uploads/2016/09/Logotipo-01.png',
  '#FFFFFF',
  'Calle Honduras, naves 14–15 · Cádiz',
  'https://www.youtube.com/channel/UCN2u_wP105P0mU8fPmB4kpA'
from public.entities e
where e.slug = 'banda-cornetas-tambores-rosario-cadiz'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  logo_background_color = excluded.logo_background_color,
  headquarters_text = excluded.headquarters_text,
  youtube_url = excluded.youtube_url;

with name_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'Sociedad Filarmónica Nuestra Señora de la Oliva de Salteras', 'La Oliva de Salteras', 'official', true, 'Denominación institucional.'),
    ('banda-musica-oliva-salteras', 'Banda de Música de la Oliva de Salteras', 'La Oliva', 'popular', true, 'Denominación pública habitual.'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Banda de Cornetas y Tambores Nuestra Señora del Rosario Coronada', 'Rosario de Cádiz', 'official', true, 'Denominación vigente desde 1998.'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Rosario de Cádiz', 'Rosario', 'popular', true, 'Denominación pública habitual.')
  ) as d(band_slug, name, short_name, name_type, is_current, notes)
)
insert into public.band_names (band_entity_id, name, short_name, name_type, is_current, notes)
select e.id, d.name, d.short_name, d.name_type, d.is_current, d.notes
from name_data d
join public.entities e on e.slug = d.band_slug
where not exists (
  select 1 from public.band_names bn
  where bn.band_entity_id = e.id and lower(bn.name) = lower(d.name)
);

with color_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'Negro', '#08090B', 'primary', 1, 'Color de fondo del emblema oficial.'),
    ('banda-musica-oliva-salteras', 'Dorado', '#D7A01A', 'secondary', 2, 'Color dominante de la lira y el filete del emblema oficial.'),
    ('banda-musica-oliva-salteras', 'Verde oliva', '#15843A', 'accent', 3, 'Color vegetal del emblema oficial.'),
    ('banda-musica-oliva-salteras', 'Lila', '#B04A9C', 'accent', 4, 'Color de contraste presente en el emblema oficial.'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Burdeos', '#6F1831', 'primary', 1, 'Color identitario asociado a la uniformidad y a la marca de la formación.'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Dorado', '#C7A24A', 'secondary', 2, 'Color del bordado y los elementos heráldicos del banderín.'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Azul marino', '#1E3A5F', 'accent', 3, 'Color marítimo presente en la identidad gráfica con el ancla.')
  ) as d(band_slug, color_name, hex_value, color_role, sort_order, notes)
)
insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select e.id, d.color_name, d.hex_value, d.color_role, d.sort_order, d.notes, 'published'
from color_data d
join public.entities e on e.slug = d.band_slug
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

with social_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'website', 'https://laolivadesalteras.com/', 'Web oficial', 0),
    ('banda-musica-oliva-salteras', 'instagram', 'https://www.instagram.com/olivasalteras', 'Instagram oficial', 10),
    ('banda-musica-oliva-salteras', 'facebook', 'https://www.facebook.com/olivasalteras/', 'Facebook oficial', 20),
    ('banda-musica-oliva-salteras', 'x', 'https://twitter.com/olivasalteras', 'X oficial', 30),
    ('banda-musica-oliva-salteras', 'youtube', 'https://www.youtube.com/channel/UC8jnIuRjbWgCCiXNQBTx3Ug', 'YouTube oficial', 40),
    ('banda-musica-oliva-salteras', 'spotify', 'https://open.spotify.com/artist/62hSf6sLIyNY5nxKq21wrr', 'Spotify oficial', 50),
    ('banda-cornetas-tambores-rosario-cadiz', 'website', 'https://rosariodecadiz.com/', 'Web oficial', 0),
    ('banda-cornetas-tambores-rosario-cadiz', 'instagram', 'https://www.instagram.com/bandarosariodecadiz/', 'Instagram oficial', 10),
    ('banda-cornetas-tambores-rosario-cadiz', 'facebook', 'https://www.facebook.com/Rosariodecadiz/', 'Facebook oficial', 20),
    ('banda-cornetas-tambores-rosario-cadiz', 'youtube', 'https://www.youtube.com/channel/UCN2u_wP105P0mU8fPmB4kpA', 'YouTube oficial', 30),
    ('banda-cornetas-tambores-rosario-cadiz', 'spotify', 'https://open.spotify.com/artist/5UFZ8g9ZH8FMbvftI8NC15', 'Spotify oficial', 40)
  ) as d(band_slug, platform, url, label, display_order)
)
insert into public.entity_social_links (entity_id, platform, url, label, display_order, is_public)
select e.id, d.platform, d.url, d.label, d.display_order, true
from social_data d
join public.entities e on e.slug = d.band_slug
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

with entity_source_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'https://laolivadesalteras.com/historia/', 'Identidad, fundación e historia'),
    ('banda-musica-oliva-salteras', 'https://laolivadesalteras.com/discografia/', 'Discografía histórica'),
    ('banda-musica-oliva-salteras', 'https://laolivadesalteras.com/', 'Identidad visual y enlaces oficiales'),
    ('banda-musica-oliva-salteras', 'https://music.apple.com/es/artist/la-oliva-de-salteras/1544305380', 'Catálogo digital'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://rosariodecadiz.com/sentirse-rosario/', 'Identidad, fundación e historia'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://rosariodecadiz.com/discografia/', 'Discografía oficial'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://rosariodecadiz.com/logotipo-01/', 'Identidad visual'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://music.apple.com/es/artist/rosario-de-c%C3%A1diz/1348563005', 'Catálogo digital')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Fuente incorporada en el lote editorial de bandas del 1 de septiembre de 2026.'
from entity_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

-- Entidades relacionadas que no existían: se crean como borradores canónicos,
-- conectadas y con fuente, sin abrir una auditoría pública independiente.
with brotherhood_data as (
  select * from (values
    ('hermandad-de-pasion-sevilla', 'Archicofradía Sacramental de Pasión', 'Pasión', 'sevilla', 'Jueves Santo', 'https://laolivadesalteras.com/pasion-elegancia-y-seriedad/'),
    ('hermandad-vera-cruz-salteras', 'Hermandad de la Vera Cruz de Salteras', 'Vera Cruz de Salteras', 'salteras', 'Miércoles Santo', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/'),
    ('hermandad-entrega-guadalcacin', 'Hermandad de la Entrega de Guadalcacín', 'La Entrega', 'jerez-de-la-frontera', 'Sábado de Pasión', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html'),
    ('archicofradia-columna-cadiz', 'Archicofradía de la Columna de Cádiz', 'Columna', 'cadiz', 'Martes Santo', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html'),
    ('hermandad-de-la-exaltacion-sevilla', 'Hermandad de la Exaltación', 'La Exaltación', 'sevilla', 'Jueves Santo', 'https://www.instagram.com/p/DTgeGLcjDLj/')
  ) as d(slug, official_name, popular_name, municipality_slug, procession_day, source_url)
), inserted as (
  insert into public.entities (entity_type, name, slug, summary, status)
  select 'brotherhood', d.popular_name, d.slug,
         'Entidad relacionada creada para sostener un acompañamiento musical documentado; ficha completa pendiente de lote propio.',
         'draft'
  from brotherhood_data d
  where not exists (select 1 from public.entities e where e.slug = d.slug)
  returning id
)
insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  current_procession_day, notes
)
select e.id, d.official_name, d.popular_name, m.id, d.procession_day,
       'Alta relacional mínima y trazable; no certifica aún la ficha completa de la hermandad.'
from brotherhood_data d
join public.entities e on e.slug = d.slug
join public.municipalities m on m.slug = d.municipality_slug
where not exists (select 1 from public.brotherhoods b where b.entity_id = e.id);

with step_data as (
  select * from (values
    ('paso-palio-maria-santisima-estrella-sevilla', 'Paso de palio de María Santísima de la Estrella', 'hermandad-de-la-estrella', 'palio', 'https://laolivadesalteras.com/estrella-coronada/'),
    ('paso-palio-virgen-aguas-museo-sevilla', 'Paso de palio de María Santísima de las Aguas', 'el-museo', 'palio', 'https://laolivadesalteras.com/renovacion-museo/'),
    ('paso-palio-maria-santisima-dulce-nombre-sevilla', 'Paso de palio de María Santísima del Dulce Nombre', 'hermandad-del-dulce-nombre-sevilla', 'palio', 'https://laolivadesalteras.com/oliva-renueva-hermandad-dulce-nombre/'),
    ('paso-palio-consolacion-sed-sevilla', 'Paso de palio de Santa María de Consolación Madre de la Iglesia', 'hermandad-de-la-sed', 'palio', 'https://laolivadesalteras.com/renovacion-con-la-hermandad-de-la-sed-de-nervion/'),
    ('paso-palio-virgen-merced-pasion-sevilla', 'Paso de palio de Nuestra Madre y Señora de la Merced', 'hermandad-de-pasion-sevilla', 'palio', 'https://laolivadesalteras.com/pasion-elegancia-y-seriedad/'),
    ('paso-palio-virgen-patrocinio-cachorro', 'Paso de palio de Nuestra Madre y Señora del Patrocinio', 'hermandad-del-cachorro', 'palio', 'https://laolivadesalteras.com/concierto-en-honor-a-la-hermandad-del-cachorro-en-la-cuaresma-de-2026/'),
    ('paso-palio-esperanza-trinidad-sevilla', 'Paso de palio de Nuestra Señora de la Esperanza de la Trinidad', 'hermandad-de-la-trinidad-sevilla', 'palio', 'https://laolivadesalteras.com/renovacion-hermandad-de-trinidad/'),
    ('paso-palio-soledad-vera-cruz-salteras', 'Paso de María Santísima de la Soledad Coronada', 'hermandad-vera-cruz-salteras', 'palio', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/'),
    ('paso-misterio-jesus-penas-estrella-sevilla', 'Paso de misterio de Nuestro Padre Jesús de las Penas', 'hermandad-de-la-estrella', 'misterio', 'https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html'),
    ('paso-misterio-cristo-aguas-sevilla', 'Paso de misterio del Santísimo Cristo de las Aguas', 'las-aguas-sevilla', 'misterio', 'https://www.facebook.com/Rosariodecadiz/posts/1417386663077206/'),
    ('paso-misterio-jesus-atado-columna-cadiz', 'Paso de misterio de Nuestro Padre Jesús Atado a la Columna de Cádiz', 'archicofradia-columna-cadiz', 'misterio', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html'),
    ('paso-misterio-cristo-sed-sevilla', 'Paso del Santísimo Cristo de la Sed', 'hermandad-de-la-sed', 'misterio', 'https://www.diariodesevilla.es/semana_santa/sed-renueva-rosario-cadiz-cuatro_0_2002121749.html'),
    ('paso-misterio-cristo-exaltacion-sevilla', 'Paso de misterio del Santísimo Cristo de la Exaltación', 'hermandad-de-la-exaltacion-sevilla', 'misterio', 'https://www.instagram.com/p/DTgeGLcjDLj/'),
    ('paso-misterio-senor-entrega-guadalcacin', 'Paso de misterio de Nuestro Padre Jesús Nazareno en su Entrega', 'hermandad-entrega-guadalcacin', 'misterio', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html')
  ) as d(step_slug, step_name, brotherhood_slug, step_type, source_url)
), inserted as (
  insert into public.entities (entity_type, name, slug, summary, status)
  select 'step', d.step_name, d.step_slug,
         'Paso conectado a un acompañamiento musical documentado; inventario patrimonial completo pendiente.',
         'draft'
  from step_data d
  where not exists (select 1 from public.entities e where e.slug = d.step_slug)
  returning id
)
insert into public.steps (entity_id, step_type, description, notes)
select e.id, d.step_type,
       'Paso procesional identificado por la relación musical vigente de la banda.',
       'Alta relacional mínima; no sustituye una auditoría patrimonial completa.'
from step_data d
join public.entities e on e.slug = d.step_slug
where not exists (select 1 from public.steps st where st.entity_id = e.id);

with step_data as (
  select * from (values
    ('paso-palio-maria-santisima-estrella-sevilla', 'hermandad-de-la-estrella'),
    ('paso-palio-virgen-aguas-museo-sevilla', 'el-museo'),
    ('paso-palio-maria-santisima-dulce-nombre-sevilla', 'hermandad-del-dulce-nombre-sevilla'),
    ('paso-palio-consolacion-sed-sevilla', 'hermandad-de-la-sed'),
    ('paso-palio-virgen-merced-pasion-sevilla', 'hermandad-de-pasion-sevilla'),
    ('paso-palio-virgen-patrocinio-cachorro', 'hermandad-del-cachorro'),
    ('paso-palio-esperanza-trinidad-sevilla', 'hermandad-de-la-trinidad-sevilla'),
    ('paso-palio-soledad-vera-cruz-salteras', 'hermandad-vera-cruz-salteras'),
    ('paso-misterio-jesus-penas-estrella-sevilla', 'hermandad-de-la-estrella'),
    ('paso-misterio-cristo-aguas-sevilla', 'las-aguas-sevilla'),
    ('paso-misterio-jesus-atado-columna-cadiz', 'archicofradia-columna-cadiz'),
    ('paso-misterio-cristo-sed-sevilla', 'hermandad-de-la-sed'),
    ('paso-misterio-cristo-exaltacion-sevilla', 'hermandad-de-la-exaltacion-sevilla'),
    ('paso-misterio-senor-entrega-guadalcacin', 'hermandad-entrega-guadalcacin')
  ) as d(step_slug, brotherhood_slug)
)
insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, notes, status
)
select h.id, st.id, 'processional_step',
       'Relación incorporada desde el acompañamiento musical documentado.', 'published'
from step_data d
join public.entities h on h.slug = d.brotherhood_slug
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.brotherhood_steps bs
  where bs.brotherhood_entity_id = h.id
    and bs.step_entity_id = st.id
    and bs.relation_type = 'processional_step'
);

with related_source_data as (
  select * from (values
    ('hermandad-de-pasion-sevilla', 'https://laolivadesalteras.com/pasion-elegancia-y-seriedad/', 'Identidad relacional'),
    ('hermandad-vera-cruz-salteras', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/', 'Identidad relacional'),
    ('hermandad-entrega-guadalcacin', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html', 'Identidad relacional'),
    ('archicofradia-columna-cadiz', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html', 'Identidad relacional'),
    ('hermandad-de-la-exaltacion-sevilla', 'https://www.instagram.com/p/DTgeGLcjDLj/', 'Identidad relacional'),
    ('paso-palio-maria-santisima-estrella-sevilla', 'https://laolivadesalteras.com/estrella-coronada/', 'Paso y acompañamiento'),
    ('paso-palio-virgen-aguas-museo-sevilla', 'https://laolivadesalteras.com/renovacion-museo/', 'Paso y acompañamiento'),
    ('paso-palio-maria-santisima-dulce-nombre-sevilla', 'https://laolivadesalteras.com/oliva-renueva-hermandad-dulce-nombre/', 'Paso y acompañamiento'),
    ('paso-palio-consolacion-sed-sevilla', 'https://laolivadesalteras.com/renovacion-con-la-hermandad-de-la-sed-de-nervion/', 'Paso y acompañamiento'),
    ('paso-palio-virgen-merced-pasion-sevilla', 'https://laolivadesalteras.com/pasion-elegancia-y-seriedad/', 'Paso y acompañamiento'),
    ('paso-palio-virgen-patrocinio-cachorro', 'https://laolivadesalteras.com/concierto-en-honor-a-la-hermandad-del-cachorro-en-la-cuaresma-de-2026/', 'Paso y acompañamiento'),
    ('paso-palio-esperanza-trinidad-sevilla', 'https://laolivadesalteras.com/renovacion-hermandad-de-trinidad/', 'Paso y acompañamiento'),
    ('paso-palio-soledad-vera-cruz-salteras', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/', 'Paso y acompañamiento'),
    ('paso-misterio-jesus-penas-estrella-sevilla', 'https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html', 'Paso y acompañamiento'),
    ('paso-misterio-cristo-aguas-sevilla', 'https://www.facebook.com/Rosariodecadiz/posts/1417386663077206/', 'Paso y acompañamiento'),
    ('paso-misterio-jesus-atado-columna-cadiz', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html', 'Paso y acompañamiento'),
    ('paso-misterio-cristo-sed-sevilla', 'https://www.diariodesevilla.es/semana_santa/sed-renueva-rosario-cadiz-cuatro_0_2002121749.html', 'Paso y acompañamiento'),
    ('paso-misterio-cristo-exaltacion-sevilla', 'https://www.instagram.com/p/DTgeGLcjDLj/', 'Paso y acompañamiento'),
    ('paso-misterio-senor-entrega-guadalcacin', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html', 'Paso y acompañamiento')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Fuente de la relación creada por el lote editorial de bandas.'
from related_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

with period_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'hermandad-de-la-estrella', 'paso-palio-maria-santisima-estrella-sevilla', 'Tras el paso de palio', 'Domingo de Ramos', 'Desde 1980 en el periodo actual', 1980, 'Vinculación ininterrumpida del periodo actual; existieron antecedentes en 1929 y 1930.', 'Hermandad de la Estrella', 'María Santísima de la Estrella', 'hermandad-de-la-estrella', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/estrella-coronada/'),
    ('banda-musica-oliva-salteras', 'el-museo', 'paso-palio-virgen-aguas-museo-sevilla', 'Tras el paso de palio', 'Lunes Santo', 'Vigente en 2026; inicio no fijado en esta auditoría', null::integer, 'Contrato renovado para los Lunes Santos de 2024, 2025 y 2026.', 'Hermandad del Museo', 'María Santísima de las Aguas', 'el-museo', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/renovacion-museo/'),
    ('banda-musica-oliva-salteras', 'hermandad-del-dulce-nombre-sevilla', 'paso-palio-maria-santisima-dulce-nombre-sevilla', 'Tras el paso de palio', 'Martes Santo', 'Más de 27 años documentados en 2023; inicio exacto no fijado en esta auditoría', null::integer, 'Renovación documentada hasta el Martes Santo de 2026.', 'Hermandad del Dulce Nombre', 'María Santísima del Dulce Nombre', 'hermandad-del-dulce-nombre-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/oliva-renueva-hermandad-dulce-nombre/'),
    ('banda-musica-oliva-salteras', 'hermandad-de-la-sed', 'paso-palio-consolacion-sed-sevilla', 'Tras el paso de palio', 'Miércoles Santo', 'Desde 2002', 2002, 'La renovación de 2024 documenta veintidós años de vínculo y cuatro años adicionales.', 'Hermandad de la Sed', 'Santa María de Consolación Madre de la Iglesia', 'hermandad-de-la-sed', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/renovacion-con-la-hermandad-de-la-sed-de-nervion/'),
    ('banda-musica-oliva-salteras', 'hermandad-de-pasion-sevilla', 'paso-palio-virgen-merced-pasion-sevilla', 'Tras el paso de palio', 'Jueves Santo', 'Vigente en 2026; inicio no fijado en esta auditoría', null::integer, 'Vinculación incluida por la formación entre sus acompañamientos de Semana Santa y confirmada por actividad oficial de 2026.', 'Archicofradía Sacramental de Pasión', 'Nuestra Madre y Señora de la Merced', 'hermandad-de-pasion-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/concierto-benefico-de-cuaresma-en-el-salvador-2026-para-la-archicofradia-de-pasion/'),
    ('banda-musica-oliva-salteras', 'hermandad-del-cachorro', 'paso-palio-virgen-patrocinio-cachorro', 'Tras el paso de palio', 'Viernes Santo', 'Vínculo de varias décadas; inicio exacto no fijado en esta auditoría', null::integer, 'La formación confirma décadas de acompañamiento y la continuidad en 2026.', 'Hermandad del Cachorro', 'Nuestra Madre y Señora del Patrocinio', 'hermandad-del-cachorro', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/concierto-en-honor-a-la-hermandad-del-cachorro-en-la-cuaresma-de-2026/'),
    ('banda-musica-oliva-salteras', 'hermandad-de-la-trinidad-sevilla', 'paso-palio-esperanza-trinidad-sevilla', 'Tras el paso de palio', 'Sábado Santo', 'Vigente en 2026; inicio exacto no fijado en esta auditoría', null::integer, 'Renovación por tres años firmada en diciembre de 2023.', 'Hermandad de la Trinidad', 'Nuestra Señora de la Esperanza de la Trinidad', 'hermandad-de-la-trinidad-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'https://laolivadesalteras.com/renovacion-hermandad-de-trinidad/'),
    ('banda-musica-oliva-salteras', 'hermandad-vera-cruz-salteras', 'paso-palio-soledad-vera-cruz-salteras', 'Tras el paso de la Virgen', 'Miércoles Santo', 'Vinculación histórica local; inicio exacto no fijado en esta auditoría', null::integer, 'Acompañamiento de la Vera Cruz de Salteras documentado por la propia formación.', 'Hermandad de la Vera Cruz de Salteras', 'María Santísima de la Soledad Coronada', 'hermandad-vera-cruz-salteras', 'Salteras', 'salteras', 'Sevilla', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/'),
    ('banda-cornetas-tambores-rosario-cadiz', 'hermandad-entrega-guadalcacin', 'paso-misterio-senor-entrega-guadalcacin', 'Tras el paso de misterio durante el tramo urbano', 'Sábado de Pasión', 'Desde 2022', 2022, 'Vinculación vigente en la Semana Santa de 2026; la banda cubre el tramo urbano del recorrido.', 'Hermandad de la Entrega de Guadalcacín', 'Nuestro Padre Jesús Nazareno en su Entrega', 'hermandad-entrega-guadalcacin', 'Guadalcacín', 'guadalcacin', 'Cádiz', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'hermandad-de-la-estrella', 'paso-misterio-jesus-penas-estrella-sevilla', 'Tras el paso de misterio', 'Domingo de Ramos', 'Contrato desde 2024; primer acompañamiento efectivo en 2025', 2024, 'La lluvia impidió la salida de 2024. Renovación posterior hasta 2029.', 'Hermandad de la Estrella', 'Nuestro Padre Jesús de las Penas', 'hermandad-de-la-estrella', 'Sevilla', 'sevilla', 'Sevilla', 'https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'las-aguas-sevilla', 'paso-misterio-cristo-aguas-sevilla', 'Tras el paso de misterio', 'Lunes Santo', 'Vinculación contractual desde 2019; primera salida efectiva posterior a la pandemia', 2019, 'Renovación oficial por tres años en enero de 2026.', 'Hermandad de las Aguas', 'Santísimo Cristo de las Aguas', 'las-aguas-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'https://www.facebook.com/Rosariodecadiz/posts/1417386663077206/'),
    ('banda-cornetas-tambores-rosario-cadiz', 'archicofradia-columna-cadiz', 'paso-misterio-jesus-atado-columna-cadiz', 'Tras el primer paso', 'Martes Santo', 'Desde 2017', 2017, 'Contrato renovado para 2025 y 2026; único acompañamiento penitencial de la formación en la capital gaditana durante 2026.', 'Archicofradía de la Columna', 'Nuestro Padre Jesús Atado a la Columna', 'archicofradia-columna-cadiz', 'Cádiz', 'cadiz', 'Cádiz', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'hermandad-de-la-sed', 'paso-misterio-cristo-sed-sevilla', 'Tras el paso de Cristo', 'Miércoles Santo', 'Desde 2017', 2017, 'Primera formación gaditana en acompañar un paso en la Semana Santa de Sevilla; renovada hasta 2028.', 'Hermandad de la Sed', 'Santísimo Cristo de la Sed', 'hermandad-de-la-sed', 'Sevilla', 'sevilla', 'Sevilla', 'https://www.diariodesevilla.es/semana_santa/sed-renueva-rosario-cadiz-cuatro_0_2002121749.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'hermandad-de-la-exaltacion-sevilla', 'paso-misterio-cristo-exaltacion-sevilla', 'Tras el paso de misterio', 'Jueves Santo', 'Contrato desde 2024; primer acompañamiento efectivo en 2025', 2024, 'La lluvia impidió el estreno procesional de 2024; la vinculación continúa vigente.', 'Hermandad de la Exaltación', 'Santísimo Cristo de la Exaltación', 'hermandad-de-la-exaltacion-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'https://www.instagram.com/p/DTgeGLcjDLj/')
  ) as d(
    band_slug, brotherhood_slug, step_slug, position, outing_type,
    date_from_text, year_from, notes, public_brotherhood_name, public_step_name,
    public_brotherhood_slug, public_municipality_name, public_municipality_slug,
    public_province, source_url
  )
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  date_from_text, year_from, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select h.id, b.id, st.id, d.position, d.outing_type,
       d.date_from_text, d.year_from, true, d.notes, 'published',
       d.public_brotherhood_name, d.public_step_name, d.public_brotherhood_slug,
       d.public_municipality_name, d.public_municipality_slug, d.public_province
from period_data d
join public.entities b on b.slug = d.band_slug
join public.entities h on h.slug = d.brotherhood_slug
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.music_accompaniment_periods p
  where p.band_entity_id = b.id
    and p.brotherhood_entity_id = h.id
    and p.step_entity_id = st.id
    and p.outing_type = d.outing_type
    and p.is_current
);

with period_source_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'Domingo de Ramos', 'hermandad-de-la-estrella', 'https://laolivadesalteras.com/estrella-coronada/'),
    ('banda-musica-oliva-salteras', 'Lunes Santo', 'el-museo', 'https://laolivadesalteras.com/renovacion-museo/'),
    ('banda-musica-oliva-salteras', 'Martes Santo', 'hermandad-del-dulce-nombre-sevilla', 'https://laolivadesalteras.com/oliva-renueva-hermandad-dulce-nombre/'),
    ('banda-musica-oliva-salteras', 'Miércoles Santo', 'hermandad-de-la-sed', 'https://laolivadesalteras.com/renovacion-con-la-hermandad-de-la-sed-de-nervion/'),
    ('banda-musica-oliva-salteras', 'Jueves Santo', 'hermandad-de-pasion-sevilla', 'https://laolivadesalteras.com/concierto-benefico-de-cuaresma-en-el-salvador-2026-para-la-archicofradia-de-pasion/'),
    ('banda-musica-oliva-salteras', 'Viernes Santo', 'hermandad-del-cachorro', 'https://laolivadesalteras.com/concierto-en-honor-a-la-hermandad-del-cachorro-en-la-cuaresma-de-2026/'),
    ('banda-musica-oliva-salteras', 'Sábado Santo', 'hermandad-de-la-trinidad-sevilla', 'https://laolivadesalteras.com/renovacion-hermandad-de-trinidad/'),
    ('banda-musica-oliva-salteras', 'Miércoles Santo', 'hermandad-vera-cruz-salteras', 'https://laolivadesalteras.com/renovacion-hermandad-vera-cruz/'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Sábado de Pasión', 'hermandad-entrega-guadalcacin', 'https://www.diariodejerez.es/semanasanta/renovacion-hermandad-entrega-banda-rosario-cadiz_0_2003330800.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Domingo de Ramos', 'hermandad-de-la-estrella', 'https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Lunes Santo', 'las-aguas-sevilla', 'https://www.facebook.com/Rosariodecadiz/posts/1417386663077206/'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Martes Santo', 'archicofradia-columna-cadiz', 'https://www.diariodecadiz.es/semana_santa/banda-rosario-seguira-sonando-semana_0_2002151504.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Miércoles Santo', 'hermandad-de-la-sed', 'https://www.diariodesevilla.es/semana_santa/sed-renueva-rosario-cadiz-cuatro_0_2002121749.html'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Jueves Santo', 'hermandad-de-la-exaltacion-sevilla', 'https://www.instagram.com/p/DTgeGLcjDLj/')
  ) as d(band_slug, outing_type, brotherhood_slug, source_url)
)
insert into public.source_links (
  source_id, music_accompaniment_period_id, scope, notes
)
select s.id, p.id, 'Vigencia y cronología del acompañamiento',
       'Fuente contrastada en el lote editorial del 1 de septiembre de 2026.'
from period_source_data d
join public.entities b on b.slug = d.band_slug
join public.entities h on h.slug = d.brotherhood_slug
join public.music_accompaniment_periods p
  on p.band_entity_id = b.id
 and p.brotherhood_entity_id = h.id
 and p.outing_type = d.outing_type
 and p.is_current
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id
    and sl.music_accompaniment_period_id = p.id
);

-- La relación con Santa Marta terminó antes de la Semana Santa de 2026.
-- Si existiera por una carga concurrente, se preserva como histórico y no se borra.
update public.music_accompaniment_periods p
set is_current = false,
    year_to = coalesce(p.year_to, 2025),
    notes = concat_ws(' ', p.notes, 'La relación con Santa Marta terminó antes de la Semana Santa de 2026.'),
    updated_at = now()
where p.band_entity_id = (select id from public.entities where slug = 'banda-cornetas-tambores-rosario-cadiz')
  and p.is_current
  and (
    lower(coalesce(p.public_brotherhood_name, '')) like '%santa marta%'
    or p.brotherhood_entity_id in (
      select id from public.entities where lower(name) like '%santa marta%'
    )
  );

-- Discografía: catálogo histórico oficial y publicaciones digitales vigentes.
with release_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'Crucifixus', 'album', 2019, 17, 'Trabajo procesional publicado en 2019.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-crucifixus.jpg', 'https://music.apple.com/es/album/crucifixus/1748108825'),
    ('banda-musica-oliva-salteras', 'Salteras y sus Bandas de Música', 'ep', 2018, 16, 'Grabación compartida dedicada al patrimonio musical de Salteras.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-salteras.jpg', 'https://music.apple.com/es/album/salteras-y-sus-bandas-de-m%C3%BAsica-ep/1444469054'),
    ('banda-musica-oliva-salteras', 'Partituras de Pasión. Volumen 1', 'single', 2017, 15, 'Edición digital de dos marchas procesionales.', 'https://laolivadesalteras.com/wp-content/uploads/2020/03/PARTITURAS-DE-PASION.-Volumen-1-PORTADA-1024x1024-1.jpg', 'https://music.apple.com/es/album/partituras-de-pasi%C3%B3n-volumen-1-single/1438860258'),
    ('banda-musica-oliva-salteras', 'Passio', 'album', 2016, 14, 'Trabajo procesional publicado en 2016.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-passio.jpg', 'https://music.apple.com/es/album/passio/1753182126'),
    ('banda-musica-oliva-salteras', '1913… desde Salteras', 'album', 2014, 13, 'Grabación conmemorativa del centenario administrativo de la formación.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-1913.jpg', 'https://music.apple.com/es/album/1913-desde-salteras/1760734589'),
    ('banda-musica-oliva-salteras', 'Pasión. Un siglo de música', 'album', 2009, 12, 'Monográfico dedicado al patrimonio musical de la Archicofradía de Pasión.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-pasion.jpg', 'https://music.apple.com/es/album/pasi%C3%B3n-un-siglo-de-m%C3%BAsica/1760615223'),
    ('banda-musica-oliva-salteras', 'Camino del Gólgota', 'album', 2006, 11, 'Trabajo procesional publicado en 2006.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-camino-del-golgota.jpg', 'https://music.apple.com/es/album/camino-del-g%C3%B3lgota/1760628969'),
    ('banda-musica-oliva-salteras', 'Mektub «Estaba escrito»', 'album', 2005, 10, 'Trabajo procesional publicado en 2005.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-mektub.jpg', 'https://music.apple.com/es/album/mektub-estaba-escrito/1760599585'),
    ('banda-musica-oliva-salteras', 'Vera Cruz', 'ep', 2004, 9, 'Monográfico dedicado al patrimonio musical crucero.', 'https://laolivadesalteras.com/wp-content/uploads/2020/03/veracruzportada.jpg', 'https://music.apple.com/es/album/vera-cruz-ep/1439059496'),
    ('banda-musica-oliva-salteras', 'Cordero de Dios', 'album', 2003, 8, 'Trabajo procesional publicado en 2003.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-cordero-de-dios.jpg', 'https://music.apple.com/es/album/cordero-de-dios/1743738870'),
    ('banda-musica-oliva-salteras', 'Sevilla Llora', 'album', 1998, 7, 'Trabajo procesional publicado en 1998.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-sevilla-llora.jpg', 'https://music.apple.com/es/album/sevilla-llora/1736980360'),
    ('banda-musica-oliva-salteras', 'Al Cachorro', 'album', 1996, 6, 'Trabajo procesional dedicado al entorno devocional del Cachorro.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-al-cachorro.jpg', 'https://music.apple.com/es/album/al-cachorro/1837464220'),
    ('banda-musica-oliva-salteras', 'Pasodobles Taurinos', 'album', 1995, 5, 'Selección de pasodobles taurinos.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-pasodobles-taurinos.jpg', 'https://music.apple.com/es/album/pasodobles-taurinos/1751744653'),
    ('banda-musica-oliva-salteras', 'Sinfonía Sevillana', 'album', 1993, 4, 'Trabajo procesional publicado en 1993.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-sinfonia-sevillana.jpg', 'https://music.apple.com/es/album/sinfon%C3%ADa-sevillana/1736980530'),
    ('banda-musica-oliva-salteras', 'De Triana a Sevilla', 'album', 1991, 3, 'Trabajo procesional publicado en 1991.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-de-triana-a-sevilla.jpg', 'https://music.apple.com/es/album/de-triana-a-sevilla/1837465151'),
    ('banda-musica-oliva-salteras', 'Coronación', 'album', 1990, 2, 'Trabajo procesional publicado en 1990.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-coronacion.jpg', 'https://music.apple.com/es/album/coronaci%C3%B3n/1743992863'),
    ('banda-musica-oliva-salteras', 'Semana Santa en Triana', 'album', 1988, 1, 'Primer trabajo del catálogo histórico inventariado por la formación.', 'https://laolivadesalteras.com/wp-content/uploads/2019/02/discografia-oliva-semana-santa-en-triana.jpg', 'https://music.apple.com/es/album/semana-santa-en-triana/1735486116'),
    ('banda-musica-oliva-salteras', 'Hebdomada Sancta', 'album', 2024, null::integer, 'Grabación publicada en 2024 con once marchas procesionales.', null::text, 'https://music.apple.com/es/album/hebdomada-sancta/1739543220'),
    ('banda-musica-oliva-salteras', 'Esperanza por Huelva Coronada', 'ep', 2025, null::integer, 'EP dedicado a la coronación canónica de la Esperanza de Huelva.', null::text, 'https://music.apple.com/es/album/esperanza-por-huelva-coronada-ep/1817124295'),
    ('banda-musica-oliva-salteras', 'Amarguras', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/amarguras-single/1884725761'),
    ('banda-musica-oliva-salteras', 'El Triunfo de la Cruz', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/el-triunfo-de-la-cruz-single/6777425987'),
    ('banda-musica-oliva-salteras', 'La Estrella Trianera', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/la-estrella-trianera-single/1881141067'),
    ('banda-musica-oliva-salteras', 'Marcha Fúnebre', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/marcha-f%C3%BAnebre-single/1865518104'),
    ('banda-musica-oliva-salteras', 'Pasan los Campanilleros', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/pasan-los-campanilleros-single/1882714316'),
    ('banda-musica-oliva-salteras', 'Pasión de Cristo, confórtanos', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/pasi%C3%B3n-de-cristo-conf%C3%B3rtanos-single/1883240603'),
    ('banda-musica-oliva-salteras', 'Reina de la Vera Cruz', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/reina-de-la-vera-cruz-single/6777420204'),
    ('banda-musica-oliva-salteras', 'Soledad, Reina del Altozano', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/soledad-reina-del-altozano-single/1880869466'),

    ('banda-cornetas-tambores-rosario-cadiz', 'De tu Humildad un Rosario', 'album', 2002, 1, 'Primer trabajo discográfico de la formación.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/35/ba/ea/35baea36-9fab-de8a-34f5-184c2b212b1d/196006882983.jpg/1000x1000bb.jpg', 'https://music.apple.com/es/album/de-tu-humildad-un-rosario/1572337067'),
    ('banda-cornetas-tambores-rosario-cadiz', 'En Nuestros Corazones', 'album', 2004, 2, 'Segundo trabajo discográfico de la formación.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/50/9e/78/509e78f6-dbf0-3e86-7b78-9ca1dce0ee2c/196006874834.jpg/1000x1000bb.jpg', 'https://music.apple.com/es/album/en-nuestros-corazones/1571341981'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Sentirse Rosario', 'album', 2008, 3, 'Tercer trabajo discográfico, construido como relato musical y locutado.', 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/61/06/7d/61067d0f-1e00-9d3f-6f4b-7e778c6f7b37/193483027494.jpg/1000x1000bb.jpg', 'https://music.apple.com/es/album/sentirse-rosario/1437840868'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Eternidad', 'album', 2013, 4, 'Cuarto trabajo discográfico de la formación.', 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ab/02/c2/ab02c22f-d479-6bfe-fac3-7c2535d1d1ec/193483028842.jpg/1000x1000bb.jpg', 'https://music.apple.com/es/album/eternidad/1437844084'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Devoción', 'album', 2018, 5, 'Quinto trabajo discográfico de la formación.', 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/ef/c7/b9/efc7b952-ae99-75a6-61d3-3e59e310b6b7/193483028064.jpg/1000x1000bb.jpg', 'https://music.apple.com/es/album/devoci%C3%B3n/1437838797'),
    ('banda-cornetas-tambores-rosario-cadiz', 'De Cádiz... Un Rosario', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/de-c%C3%A1diz-un-rosario-single/1617119696'),
    ('banda-cornetas-tambores-rosario-cadiz', 'El Alma de un Maestro', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/el-alma-de-un-maestro-single/1635288499'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Eterno', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/eterno-single/1617117529'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Flagelación', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/flagelaci%C3%B3n-single/1635204829'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Mayor Dolor en Tu Calvario', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/mayor-dolor-en-tu-calvario-single/1635205158'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Sagrada Familia', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/sagrada-familia-single/1617122358'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Señor de Cádiz', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/se%C3%B1or-de-c%C3%A1diz-single/1635204807'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Sólo Tú, Soledad', 'single', 2022, null::integer, 'Sencillo digital posterior a la discografía física inventariada.', null::text, 'https://music.apple.com/es/album/s%C3%B3lo-t%C3%BA-soledad-single/1635205133'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Entregados a Ti', 'single', 2023, null::integer, 'Sencillo digital publicado en 2023.', null::text, 'https://music.apple.com/es/album/entregados-a-ti-single/1719091753'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Quinto Misterio', 'single', 2023, null::integer, 'Sencillo digital publicado en 2023.', null::text, 'https://music.apple.com/es/album/quinto-misterio-single/1719092205'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Siempre Caminando', 'single', 2023, null::integer, 'Sencillo digital publicado en 2023.', null::text, 'https://music.apple.com/es/album/siempre-caminando-single/1679326565'),
    ('banda-cornetas-tambores-rosario-cadiz', 'A Tu Corazón Mis Lágrimas', 'single', 2024, null::integer, 'Nueva edición digital publicada en 2024.', null::text, 'https://music.apple.com/es/album/a-tu-coraz%C3%B3n-mis-l%C3%A1grimas-single/1782539127'),
    ('banda-cornetas-tambores-rosario-cadiz', 'El Rezo', 'single', 2024, null::integer, 'Sencillo digital publicado en 2024.', null::text, 'https://music.apple.com/es/album/el-rezo-single/1732532590'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Hijo de la Estrella', 'single', 2024, null::integer, 'Sencillo digital publicado en 2024.', null::text, 'https://music.apple.com/es/album/hijo-de-la-estrella-single/1777023668'),
    ('banda-cornetas-tambores-rosario-cadiz', 'A Dios', 'single', 2025, null::integer, 'Sencillo digital publicado en 2025.', null::text, 'https://music.apple.com/es/album/a-dios-single/1854725326'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Aguas', 'single', 2025, null::integer, 'Sencillo digital publicado en 2025.', null::text, 'https://music.apple.com/es/album/aguas-single/1840600345'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Muerte en la Cruz', 'single', 2025, null::integer, 'Sencillo digital publicado en 2025.', null::text, 'https://music.apple.com/es/album/muerte-en-la-cruz-single/1796857790'),
    ('banda-cornetas-tambores-rosario-cadiz', 'Cinco Lágrimas', 'single', 2026, null::integer, 'Sencillo digital publicado en 2026.', null::text, 'https://music.apple.com/es/album/cinco-l%C3%A1grimas-single/1875926468')
  ) as d(
    band_slug, title, release_type, release_year, ordinal_number,
    description, cover_image_path, external_url
  )
)
insert into public.band_releases (
  band_entity_id, title, release_type, release_year, release_date_text,
  ordinal_number, description, cover_image_path, cover_image_alt,
  cover_image_credit, external_url, status
)
select e.id, d.title, d.release_type, d.release_year, d.release_year::text,
       d.ordinal_number, d.description, d.cover_image_path,
       case when d.cover_image_path is not null then 'Carátula de ' || d.title else null end,
       case
         when d.cover_image_path is null then null
         when d.band_slug = 'banda-musica-oliva-salteras' then 'Web oficial de La Oliva de Salteras'
         else 'Apple Music'
       end,
       d.external_url, 'published'
from release_data d
join public.entities e on e.slug = d.band_slug
on conflict (band_entity_id, title, release_year) do update set
  release_type = excluded.release_type,
  release_date_text = excluded.release_date_text,
  ordinal_number = excluded.ordinal_number,
  description = excluded.description,
  cover_image_path = excluded.cover_image_path,
  cover_image_alt = excluded.cover_image_alt,
  cover_image_credit = excluded.cover_image_credit,
  external_url = excluded.external_url,
  status = excluded.status,
  updated_at = now();

with release_source_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'https://music.apple.com/es/artist/la-oliva-de-salteras/1544305380', 'Catálogo digital, fecha, tipo de edición y escucha'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://music.apple.com/es/artist/rosario-de-c%C3%A1diz/1348563005', 'Catálogo digital, fecha, tipo de edición y escucha')
  ) as d(band_slug, source_url, scope)
)
insert into public.band_release_sources (release_id, source_id, scope)
select r.id, s.id, d.scope
from release_source_data d
join public.entities e on e.slug = d.band_slug
join public.band_releases r on r.band_entity_id = e.id and r.status = 'published'
join public.sources s on s.url = d.source_url
on conflict (release_id, source_id) do update set scope = excluded.scope;

with historical_source_data as (
  select * from (values
    ('banda-musica-oliva-salteras', 'https://laolivadesalteras.com/discografia/'),
    ('banda-cornetas-tambores-rosario-cadiz', 'https://rosariodecadiz.com/discografia/')
  ) as d(band_slug, source_url)
)
insert into public.band_release_sources (release_id, source_id, scope)
select r.id, s.id, 'Catálogo histórico oficial, repertorio y orden discográfico'
from historical_source_data d
join public.entities e on e.slug = d.band_slug
join public.band_releases r on r.band_entity_id = e.id and r.ordinal_number is not null
join public.sources s on s.url = d.source_url
on conflict (release_id, source_id) do update set scope = excluded.scope;

-- Repertorios completos de La Oliva. La relación con una marcha canónica se
-- establece solo cuando el nombre identifica un único nodo ya existente.
with track_data as (
  select * from (values
    ('Crucifixus', 2019, 1, 'Crucifixus', null::text),
    ('Crucifixus', 2019, 2, 'La Virgen de Sevilla', null::text),
    ('Crucifixus', 2019, 3, 'Todo se ha consumado', null::text),
    ('Crucifixus', 2019, 4, '¿Quién te vio y no te recuerda?', null::text),
    ('Crucifixus', 2019, 5, 'La Sollevazione di Cristo', null::text),
    ('Crucifixus', 2019, 6, 'Danos la Paz', null::text),
    ('Crucifixus', 2019, 7, 'Mi Esperanza', null::text),
    ('Crucifixus', 2019, 8, 'Triana, tu Esperanza', null::text),
    ('Crucifixus', 2019, 9, 'Iesus Nazarenus', null::text),
    ('Crucifixus', 2019, 10, 'Bajo tu manto', null::text),
    ('Crucifixus', 2019, 11, 'La Virgen de los Desamparados', null::text),
    ('Crucifixus', 2019, 12, 'La Muerte no es el final', null::text),

    ('Salteras y sus Bandas de Música', 2018, 1, 'Nuestra Señora de la Oliva', null::text),
    ('Salteras y sus Bandas de Música', 2018, 2, 'Sólo en tu Cruz', null::text),
    ('Salteras y sus Bandas de Música', 2018, 3, 'Oliva', null::text),
    ('Salteras y sus Bandas de Música', 2018, 4, 'Dolor y Esperanza', null::text),
    ('Salteras y sus Bandas de Música', 2018, 5, 'Salteras', null::text),

    ('Partituras de Pasión. Volumen 1', 2017, 1, 'Mi Esperanza', null::text),
    ('Partituras de Pasión. Volumen 1', 2017, 2, 'Frente a ti', null::text),

    ('Passio', 2016, 1, 'Passio Granatensis', null::text),
    ('Passio', 2016, 2, 'Estrella Mater Dolorosa', null::text),
    ('Passio', 2016, 3, 'Nuestra Señora de la Oliva', null::text),
    ('Passio', 2016, 4, 'Hosanna in Excelsis', null::text),
    ('Passio', 2016, 5, 'La Sangre y la Gloria', null::text),
    ('Passio', 2016, 6, 'Jerusalén', null::text),
    ('Passio', 2016, 7, 'Madre, tu Dulce Nombre', null::text),
    ('Passio', 2016, 8, 'Como Tú ninguna', null::text),
    ('Passio', 2016, 9, 'Alma de la Trinidad', null::text),
    ('Passio', 2016, 10, 'La Esperanza de Triana', null::text),
    ('Passio', 2016, 11, 'Valle de Sevilla', null::text),

    ('1913… desde Salteras', 2014, 1, 'Requiem in D minor, K 626: Lacrimosa', null::text),
    ('1913… desde Salteras', 2014, 2, 'Mediatrix Omnium Gratiarum', null::text),
    ('1913… desde Salteras', 2014, 3, 'Virgen de la Estrella', null::text),
    ('1913… desde Salteras', 2014, 4, 'Crux Immissa', null::text),
    ('1913… desde Salteras', 2014, 5, 'Cristo de la Buena Muerte', null::text),
    ('1913… desde Salteras', 2014, 6, 'Lunes Santo en el Museo', null::text),
    ('1913… desde Salteras', 2014, 7, 'Nuestra Señora de la Soledad Coronada', null::text),
    ('1913… desde Salteras', 2014, 8, 'A la memoria del General Chinchilla', null::text),
    ('1913… desde Salteras', 2014, 9, 'Jesus Christus', null::text),
    ('1913… desde Salteras', 2014, 10, 'Cristo de la Vera Cruz', null::text),
    ('1913… desde Salteras', 2014, 11, 'Esperanza Salesiana', null::text),
    ('1913… desde Salteras', 2014, 12, 'Alíviame esta pena', null::text),
    ('1913… desde Salteras', 2014, 13, 'Soledad', null::text),
    ('1913… desde Salteras', 2014, 14, 'Lágrimas de Dolor', null::text),

    ('Pasión. Un siglo de música', 2009, 1, 'Marcha fúnebre a Nuestro Padre Jesús de la Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 2, 'Jesús de Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 3, 'Al Señor de Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 4, 'Nuestra Señora de la Merced', null::text),
    ('Pasión. Un siglo de música', 2009, 5, 'El Señor de Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 6, 'Margot', null::text),
    ('Pasión. Un siglo de música', 2009, 7, 'Nazarenos de Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 8, 'Pasión… poema sinfónico', null::text),
    ('Pasión. Un siglo de música', 2009, 9, 'Nuestro Padre Jesús de Pasión', null::text),
    ('Pasión. Un siglo de música', 2009, 10, 'Nuestra Señora de la Merced', null::text),

    ('Camino del Gólgota', 2006, 1, 'Virgen de las Aguas', null::text),
    ('Camino del Gólgota', 2006, 2, 'Camino del Gólgota', null::text),
    ('Camino del Gólgota', 2006, 3, 'Salmo Penitencial', null::text),
    ('Camino del Gólgota', 2006, 4, 'María Santísima del Dulce Nombre', null::text),
    ('Camino del Gólgota', 2006, 5, 'Marcha fúnebre de Sors', null::text),
    ('Camino del Gólgota', 2006, 6, 'Esperanza', null::text),
    ('Camino del Gólgota', 2006, 7, 'Dolorosa de Pasión', null::text),
    ('Camino del Gólgota', 2006, 8, 'Grave', null::text),
    ('Camino del Gólgota', 2006, 9, 'Regina Coelis', null::text),
    ('Camino del Gólgota', 2006, 10, 'El Héroe Muerto', null::text),
    ('Camino del Gólgota', 2006, 11, 'Pobre Carmen', null::text),
    ('Camino del Gólgota', 2006, 12, 'Getsemaní', null::text),

    ('Mektub «Estaba escrito»', 2005, 1, 'La Estrella Sublime', null::text),
    ('Mektub «Estaba escrito»', 2005, 2, 'Margot', null::text),
    ('Mektub «Estaba escrito»', 2005, 3, 'La Sagrada Lanzada', null::text),
    ('Mektub «Estaba escrito»', 2005, 4, 'Saeta Cordobesa', null::text),
    ('Mektub «Estaba escrito»', 2005, 5, 'Expiración', null::text),
    ('Mektub «Estaba escrito»', 2005, 6, 'Candelaria', null::text),
    ('Mektub «Estaba escrito»', 2005, 7, 'Al Santísimo Cristo de la Exaltación', null::text),
    ('Mektub «Estaba escrito»', 2005, 8, 'Mektub «Estaba escrito»', null::text),
    ('Mektub «Estaba escrito»', 2005, 9, 'Santísimo Cristo de las Siete Palabras', null::text),
    ('Mektub «Estaba escrito»', 2005, 10, 'Nuestra Señora de Guadalupe', null::text),
    ('Mektub «Estaba escrito»', 2005, 11, 'El Ocaso de los Dioses', null::text),

    ('Vera Cruz', 2004, 1, 'Cristo de la Vera Cruz', null::text),
    ('Vera Cruz', 2004, 2, 'Cristo de los Cruceros', null::text),
    ('Vera Cruz', 2004, 3, 'Cristo del Alma', null::text),
    ('Vera Cruz', 2004, 4, 'Angustia de los Cruceros Coronada', null::text),
    ('Vera Cruz', 2004, 5, 'El día de la Cruz', null::text),

    ('Cordero de Dios', 2003, 1, 'Señorita de Triana', null::text),
    ('Cordero de Dios', 2003, 2, 'Virgen de la Trinidad', null::text),
    ('Cordero de Dios', 2003, 3, 'Cordero de Dios', null::text),
    ('Cordero de Dios', 2003, 4, 'Azahar de San Gonzalo', null::text),
    ('Cordero de Dios', 2003, 5, 'Estrella', null::text),
    ('Cordero de Dios', 2003, 6, 'Virgen de Gracia', null::text),
    ('Cordero de Dios', 2003, 7, 'Virgen Coronada de Estrellas', null::text),
    ('Cordero de Dios', 2003, 8, 'Jesús de Pasión', null::text),
    ('Cordero de Dios', 2003, 9, 'Amarguras', null::text),
    ('Cordero de Dios', 2003, 10, 'La Estrella en Sevilla', null::text),
    ('Cordero de Dios', 2003, 11, 'Marcha Fúnebre', null::text),

    ('Sevilla Llora', 1998, 1, 'Jesús de la Salud', null::text),
    ('Sevilla Llora', 1998, 2, 'Tus Dolores son mis Penas', null::text),
    ('Sevilla Llora', 1998, 3, 'Virgen de la Palma', null::text),
    ('Sevilla Llora', 1998, 4, 'Salus Infirmorum', null::text),
    ('Sevilla Llora', 1998, 5, 'Crucifixión', null::text),
    ('Sevilla Llora', 1998, 6, 'Virgen del Valle', null::text),
    ('Sevilla Llora', 1998, 7, 'Salve Madre de la Salud', null::text),
    ('Sevilla Llora', 1998, 8, 'Sevilla Llora', null::text),
    ('Sevilla Llora', 1998, 9, 'Dominus Flevit', null::text),
    ('Sevilla Llora', 1998, 10, 'Esperanza Nuestra', null::text),
    ('Sevilla Llora', 1998, 11, 'Patrocinio', null::text),

    ('Al Cachorro', 1996, 1, 'Solo en tu Cruz', null::text),
    ('Al Cachorro', 1996, 2, 'Sevilla Cofradiera', null::text),
    ('Al Cachorro', 1996, 3, 'El Señor de Pasión', null::text),
    ('Al Cachorro', 1996, 4, 'Coronación de la Macarena', null::text),
    ('Al Cachorro', 1996, 5, 'Madre de los Gitanos Coronada', null::text),
    ('Al Cachorro', 1996, 6, 'Nuestra Señora del Patrocinio', null::text),
    ('Al Cachorro', 1996, 7, 'Al Cachorro', null::text),
    ('Al Cachorro', 1996, 8, 'Jesús de las Penas, una oración', null::text),
    ('Al Cachorro', 1996, 9, 'A ti Soledad', null::text),
    ('Al Cachorro', 1996, 10, 'Esperanza Trinitaria', null::text),
    ('Al Cachorro', 1996, 11, 'Pasan los Campanilleros', null::text),
    ('Al Cachorro', 1996, 12, 'A ti, Soledad', null::text),

    ('Pasodobles Taurinos', 1995, 1, 'Plaza de la Maestranza', null::text),
    ('Pasodobles Taurinos', 1995, 2, 'España Cañí', null::text),
    ('Pasodobles Taurinos', 1995, 3, 'La Giralda', null::text),
    ('Pasodobles Taurinos', 1995, 4, 'Suspiros de España', null::text),
    ('Pasodobles Taurinos', 1995, 5, 'La Entrada', null::text),
    ('Pasodobles Taurinos', 1995, 6, 'Ayamonte', null::text),
    ('Pasodobles Taurinos', 1995, 7, 'Nerva', null::text),
    ('Pasodobles Taurinos', 1995, 8, 'Paquito el Chocolatero', null::text),
    ('Pasodobles Taurinos', 1995, 9, 'Pepita Greus', null::text),
    ('Pasodobles Taurinos', 1995, 10, 'La Gracia de Dios', null::text),
    ('Pasodobles Taurinos', 1995, 11, '¡Churumbelerías!', null::text),
    ('Pasodobles Taurinos', 1995, 12, 'Ragón Falez', null::text),
    ('Pasodobles Taurinos', 1995, 13, 'Manolete', null::text),
    ('Pasodobles Taurinos', 1995, 14, 'Amparito Roca', null::text),
    ('Pasodobles Taurinos', 1995, 15, 'El Gato Montés', null::text),

    ('Sinfonía Sevillana', 1993, 1, 'María Santísima del Subterráneo', null::text),
    ('Sinfonía Sevillana', 1993, 2, 'Cristo de la Vera-Cruz', null::text),
    ('Sinfonía Sevillana', 1993, 3, 'Cristo de la Misericordia', null::text),
    ('Sinfonía Sevillana', 1993, 4, 'Virgen de la Paz', null::text),
    ('Sinfonía Sevillana', 1993, 5, 'Nuestro Padre Jesús', null::text),
    ('Sinfonía Sevillana', 1993, 6, 'Virgen de Monserrat', null::text),
    ('Sinfonía Sevillana', 1993, 7, 'Cristo de la Presentación', null::text),
    ('Sinfonía Sevillana', 1993, 8, 'Aniversario Macareno', null::text),
    ('Sinfonía Sevillana', 1993, 9, 'Virgen de la Cabeza', null::text),
    ('Sinfonía Sevillana', 1993, 10, 'Resurrección Gloriosa', null::text),
    ('Sinfonía Sevillana', 1993, 11, 'Jesús de las Penas', null::text),

    ('De Triana a Sevilla', 1991, 1, 'Pasa la Virgen Macarena', null::text),
    ('De Triana a Sevilla', 1991, 2, 'Jesús Preso', null::text),
    ('De Triana a Sevilla', 1991, 3, 'Soledad de los Servitas', null::text),
    ('De Triana a Sevilla', 1991, 4, 'Dulce Nombre de Jesús', null::text),
    ('De Triana a Sevilla', 1991, 5, 'Virgen del Socorro', null::text),
    ('De Triana a Sevilla', 1991, 6, 'Nuestra Señora del Patrocinio', null::text),
    ('De Triana a Sevilla', 1991, 7, 'Virgen de los Estudiantes', null::text),
    ('De Triana a Sevilla', 1991, 8, 'Quinta Angustia', null::text),
    ('De Triana a Sevilla', 1991, 9, 'Pasan los Campanilleros', null::text),
    ('De Triana a Sevilla', 1991, 10, 'Virgen del Valle', null::text),
    ('De Triana a Sevilla', 1991, 11, 'Virgen del Refugio', null::text),
    ('De Triana a Sevilla', 1991, 12, 'María Santísima del Dulce Nombre', null::text),
    ('De Triana a Sevilla', 1991, 13, 'Cirios y Claveles', null::text),
    ('De Triana a Sevilla', 1991, 14, 'Virgen de la Victoria', null::text),
    ('De Triana a Sevilla', 1991, 15, 'Soleá dame la mano', null::text),

    ('Coronación', 1990, 1, 'Virgen del Valle', null::text),
    ('Coronación', 1990, 2, 'Virgen del Refugio', null::text),
    ('Coronación', 1990, 3, 'María Santísima del Dulce Nombre', null::text),
    ('Coronación', 1990, 4, 'Cirios y Claveles', null::text),
    ('Coronación', 1990, 5, 'Virgen de la Victoria', null::text),
    ('Coronación', 1990, 6, 'Soleá dame la mano', null::text),
    ('Coronación', 1990, 7, 'Virgen de la O', null::text),
    ('Coronación', 1990, 8, 'Estrella de Triana', null::text),

    ('Semana Santa en Triana', 1988, 1, 'Virgen de la Estrella', null::text),
    ('Semana Santa en Triana', 1988, 2, 'Nuestra Señora de la Oliva', null::text),
    ('Semana Santa en Triana', 1988, 3, 'Aquella Virgen', null::text),
    ('Semana Santa en Triana', 1988, 4, 'Hermanos Costaleros', null::text),
    ('Semana Santa en Triana', 1988, 5, 'Virgen del Dulce Nombre', null::text),
    ('Semana Santa en Triana', 1988, 6, 'El Cachorro (Saeta Sevillana)', null::text),
    ('Semana Santa en Triana', 1988, 7, 'Soledad de Salteras', null::text),
    ('Semana Santa en Triana', 1988, 8, 'Cristo de la Sangre', null::text),
    ('Semana Santa en Triana', 1988, 9, 'Gracia y Esperanza', null::text),

    ('Hebdomada Sancta', 2024, 1, 'Cristo de la Sed', '5:18'),
    ('Hebdomada Sancta', 2024, 2, 'Magna Cathedralis', '6:27'),
    ('Hebdomada Sancta', 2024, 3, 'Siguiriya, como tu gracia', '5:04'),
    ('Hebdomada Sancta', 2024, 4, 'El Mayor Dolor', '5:13'),
    ('Hebdomada Sancta', 2024, 5, 'La Virgen del Rosario (Saeta en San Pablo)', '4:51'),
    ('Hebdomada Sancta', 2024, 6, 'Lamento', '4:33'),
    ('Hebdomada Sancta', 2024, 7, 'El Dulce Nombre', '4:22'),
    ('Hebdomada Sancta', 2024, 8, 'A orillas del Genil', '4:47'),
    ('Hebdomada Sancta', 2024, 9, 'Una saeta al cielo', '4:37'),
    ('Hebdomada Sancta', 2024, 10, 'Y en su palio, la Victoria', '5:25'),
    ('Hebdomada Sancta', 2024, 11, 'Esperanza, Vida y Dulzura', '5:20'),

    ('Esperanza por Huelva Coronada', 2025, 1, 'La Esperanza de Huelva', '3:33'),
    ('Esperanza por Huelva Coronada', 2025, 2, 'Esperanza de Huelva', '4:21'),
    ('Esperanza por Huelva Coronada', 2025, 3, 'Esperanza de Huelva Coronada', '4:46'),
    ('Esperanza por Huelva Coronada', 2025, 4, 'Esperanza por Huelva Coronada', '4:16'),
    ('Esperanza por Huelva Coronada', 2025, 5, 'Así en los mares como en el Cielo', '6:08'),

    ('Amarguras', 2026, 1, 'Amarguras', null::text),
    ('El Triunfo de la Cruz', 2026, 1, 'El Triunfo de la Cruz', null::text),
    ('La Estrella Trianera', 2026, 1, 'La Estrella Trianera', null::text),
    ('Marcha Fúnebre', 2026, 1, 'Marcha Fúnebre', null::text),
    ('Pasan los Campanilleros', 2026, 1, 'Pasan los Campanilleros', null::text),
    ('Pasión de Cristo, confórtanos', 2026, 1, 'Pasión de Cristo, confórtanos', null::text),
    ('Reina de la Vera Cruz', 2026, 1, 'Reina de la Vera Cruz', null::text),
    ('Soledad, Reina del Altozano', 2026, 1, 'Soledad, Reina del Altozano', null::text)
  ) as d(release_title, release_year, sequence_no, title, duration_text)
), unique_marches as (
  select lower(trim(name)) as normalized_name,
         (array_agg(id order by created_at))[1] as march_entity_id
  from public.entities
  where entity_type = 'march'
  group by lower(trim(name))
  having count(*) = 1
)
insert into public.band_release_tracks (
  release_id, sequence_no, title, march_entity_id, duration_text, notes
)
select r.id, d.sequence_no, d.title, m.march_entity_id, d.duration_text,
       'Pista contrastada con la discografía oficial o el catálogo digital de la formación.'
from track_data d
join public.entities e on e.slug = 'banda-musica-oliva-salteras'
join public.band_releases r
  on r.band_entity_id = e.id
 and r.title = d.release_title
 and r.release_year = d.release_year
left join unique_marches m on m.normalized_name = lower(trim(d.title))
on conflict (release_id, sequence_no) do update set
  title = excluded.title,
  march_entity_id = excluded.march_entity_id,
  duration_text = excluded.duration_text,
  notes = excluded.notes;

-- Repertorios completos de Rosario de Cádiz y pistas únicas de sus sencillos.
with track_data as (
  select * from (values
    ('De tu Humildad un Rosario', 2002, 1, 'Rosario', '3:35'),
    ('De tu Humildad un Rosario', 2002, 2, 'La Pasión del Barrio', '3:38'),
    ('De tu Humildad un Rosario', 2002, 3, 'Santa María', '3:40'),
    ('De tu Humildad un Rosario', 2002, 4, 'A Tu Corazón Mis Lágrimas', '3:41'),
    ('De tu Humildad un Rosario', 2002, 5, 'Jesús Ante Anás', '3:38'),
    ('De tu Humildad un Rosario', 2002, 6, 'Misericordia Divina', '3:33'),
    ('De tu Humildad un Rosario', 2002, 7, 'Consuelo', '4:05'),
    ('De tu Humildad un Rosario', 2002, 8, 'De Tu Humildad un Rosario', '3:33'),
    ('De tu Humildad un Rosario', 2002, 9, 'Himno Cofrade', '2:45'),

    ('En Nuestros Corazones', 2004, 1, 'En Brazos de Dios', '3:32'),
    ('En Nuestros Corazones', 2004, 2, 'Señor de la Merced', '3:15'),
    ('En Nuestros Corazones', 2004, 3, 'La Traición', '4:07'),
    ('En Nuestros Corazones', 2004, 4, 'Gloria a Ti, Señor del Consuelo', '3:20'),
    ('En Nuestros Corazones', 2004, 5, 'A Nuestro Padre Jesús', '3:26'),
    ('En Nuestros Corazones', 2004, 6, 'Humildad y Paciencia', '3:26'),
    ('En Nuestros Corazones', 2004, 7, 'En Tus Sones... Mi Inspiración', '4:15'),
    ('En Nuestros Corazones', 2004, 8, 'Misericordia en Tus Penas', '3:44'),
    ('En Nuestros Corazones', 2004, 9, 'En Nuestros Corazones', '2:02'),
    ('En Nuestros Corazones', 2004, 10, 'Himno Cofrade', '2:48'),

    ('Sentirse Rosario', 2008, 1, 'Introducción: Locución', '1:44'),
    ('Sentirse Rosario', 2008, 2, 'Niño de Mi Alma', '3:08'),
    ('Sentirse Rosario', 2008, 3, 'Con el Alma (Locución)', '1:16'),
    ('Sentirse Rosario', 2008, 4, 'Tristeza de Tus Ojos, Padre', '4:17'),
    ('Sentirse Rosario', 2008, 5, 'Consuelo', '3:55'),
    ('Sentirse Rosario', 2008, 6, 'Padre Jesús Nazareno (Locución)', '0:43'),
    ('Sentirse Rosario', 2008, 7, 'Gitano Tú Eres de Santa María', '3:30'),
    ('Sentirse Rosario', 2008, 8, 'Rey Desnudo (Locución)', '1:08'),
    ('Sentirse Rosario', 2008, 9, 'Dios y Hombre', '3:37'),
    ('Sentirse Rosario', 2008, 10, 'Santa María', '3:27'),
    ('Sentirse Rosario', 2008, 11, 'En Tus Manos Encomiendo Tu Espíritu', '2:43'),
    ('Sentirse Rosario', 2008, 12, 'Amor Sentido (Locución)', '0:50'),
    ('Sentirse Rosario', 2008, 13, 'Rosario... Un Sentimiento', '3:33'),
    ('Sentirse Rosario', 2008, 14, 'Una Semana Santa (Locución)', '2:41'),
    ('Sentirse Rosario', 2008, 15, 'Aires de Tu Barrio', '3:13'),

    ('Eternidad', 2013, 1, 'Un Nuevo Amanecer', '1:39'),
    ('Eternidad', 2013, 2, 'Eternidad', '3:30'),
    ('Eternidad', 2013, 3, 'El Amor', '4:17'),
    ('Eternidad', 2013, 4, 'A la Tercera Caída', '3:42'),
    ('Eternidad', 2013, 5, 'En el Cielo de Tu Gloria', '3:37'),
    ('Eternidad', 2013, 6, 'A Mi Rosario', '3:44'),
    ('Eternidad', 2013, 7, 'Al Compás de Tu Andar, Despojado', '4:15'),
    ('Eternidad', 2013, 8, 'Cautivo en Santa Cruz', '4:02'),
    ('Eternidad', 2013, 9, 'Venga Tu Reino', '4:17'),
    ('Eternidad', 2013, 10, 'A Tus Brazos, Madre', '4:20'),
    ('Eternidad', 2013, 11, 'Antes de Morir', '4:01'),
    ('Eternidad', 2013, 12, 'Madre Galeona', '4:19'),
    ('Eternidad', 2013, 13, 'El Dolor', '4:29'),

    ('Devoción', 2018, 1, 'Cuando Suene Rosario...', '3:48'),
    ('Devoción', 2018, 2, 'Devoción', '3:38'),
    ('Devoción', 2018, 3, 'Esperanza', '3:54'),
    ('Devoción', 2018, 4, 'Señor de Humilde Mirada', '3:50'),
    ('Devoción', 2018, 5, 'Consuela a Tu Barrio, Señor', '4:31'),
    ('Devoción', 2018, 6, 'El Milagro', '4:18'),
    ('Devoción', 2018, 7, 'Septem Dolorum', '4:44'),
    ('Devoción', 2018, 8, 'Marineros de Tu Fe', '3:32'),
    ('Devoción', 2018, 9, 'La Amargura', '4:06'),
    ('Devoción', 2018, 10, 'Tu Sentencia', '3:51'),
    ('Devoción', 2018, 11, 'Señor de Nervión', '3:31'),

    ('De Cádiz... Un Rosario', 2022, 1, 'De Cádiz... Un Rosario', null::text),
    ('El Alma de un Maestro', 2022, 1, 'El Alma de un Maestro', null::text),
    ('Eterno', 2022, 1, 'Eterno', null::text),
    ('Flagelación', 2022, 1, 'Flagelación', null::text),
    ('Mayor Dolor en Tu Calvario', 2022, 1, 'Mayor Dolor en Tu Calvario', null::text),
    ('Sagrada Familia', 2022, 1, 'Sagrada Familia', null::text),
    ('Señor de Cádiz', 2022, 1, 'Señor de Cádiz', null::text),
    ('Sólo Tú, Soledad', 2022, 1, 'Sólo Tú, Soledad', null::text),
    ('Entregados a Ti', 2023, 1, 'Entregados a Ti', null::text),
    ('Quinto Misterio', 2023, 1, 'Quinto Misterio', null::text),
    ('Siempre Caminando', 2023, 1, 'Siempre Caminando', null::text),
    ('A Tu Corazón Mis Lágrimas', 2024, 1, 'A Tu Corazón Mis Lágrimas', null::text),
    ('El Rezo', 2024, 1, 'El Rezo', null::text),
    ('Hijo de la Estrella', 2024, 1, 'Hijo de la Estrella', null::text),
    ('A Dios', 2025, 1, 'A Dios', null::text),
    ('Aguas', 2025, 1, 'Aguas', null::text),
    ('Muerte en la Cruz', 2025, 1, 'Muerte en la Cruz', null::text),
    ('Cinco Lágrimas', 2026, 1, 'Cinco Lágrimas', null::text)
  ) as d(release_title, release_year, sequence_no, title, duration_text)
), unique_marches as (
  select lower(trim(name)) as normalized_name,
         (array_agg(id order by created_at))[1] as march_entity_id
  from public.entities
  where entity_type = 'march'
  group by lower(trim(name))
  having count(*) = 1
)
insert into public.band_release_tracks (
  release_id, sequence_no, title, march_entity_id, duration_text, notes
)
select r.id, d.sequence_no, d.title, m.march_entity_id, d.duration_text,
       'Pista contrastada con la discografía oficial y el catálogo digital de la formación.'
from track_data d
join public.entities e on e.slug = 'banda-cornetas-tambores-rosario-cadiz'
join public.band_releases r
  on r.band_entity_id = e.id
 and r.title = d.release_title
 and r.release_year = d.release_year
left join unique_marches m on m.normalized_name = lower(trim(d.title))
on conflict (release_id, sequence_no) do update set
  title = excluded.title,
  march_entity_id = excluded.march_entity_id,
  duration_text = excluded.duration_text,
  notes = excluded.notes;

-- Certificación del lote. Cualquier incumplimiento revierte la migración entera.
do $$
declare
  v_oliva_id uuid;
  v_rosario_id uuid;
begin
  select id into v_oliva_id
  from public.entities
  where slug = 'banda-musica-oliva-salteras' and status = 'published';

  select id into v_rosario_id
  from public.entities
  where slug = 'banda-cornetas-tambores-rosario-cadiz' and status = 'published';

  if v_oliva_id is null or v_rosario_id is null then
    raise exception 'Las dos bandas no han quedado publicadas';
  end if;

  if (select count(*) from public.source_links where entity_id = v_oliva_id) < 4
     or (select count(*) from public.source_links where entity_id = v_rosario_id) < 4 then
    raise exception 'Una banda carece de la cobertura documental mínima';
  end if;

  if (select count(*) from public.music_accompaniment_periods
      where band_entity_id = v_oliva_id and is_current and status = 'published') < 8 then
    raise exception 'La Oliva no conserva los ocho acompañamientos actuales auditados';
  end if;

  if (select count(*) from public.music_accompaniment_periods
      where band_entity_id = v_rosario_id and is_current and status = 'published') < 6 then
    raise exception 'Rosario no conserva los seis acompañamientos actuales auditados';
  end if;

  if exists (
    select 1
    from public.music_accompaniment_periods p
    where p.band_entity_id in (v_oliva_id, v_rosario_id)
      and p.is_current
      and (
        p.step_entity_id is null
        or not exists (
          select 1 from public.source_links sl
          where sl.music_accompaniment_period_id = p.id
        )
      )
  ) then
    raise exception 'Existe un acompañamiento vigente sin paso o sin fuente';
  end if;

  if exists (
    select 1
    from public.music_accompaniment_periods p
    where p.band_entity_id = v_rosario_id
      and p.is_current
      and (
        lower(coalesce(p.public_brotherhood_name, '')) like '%santa marta%'
        or p.brotherhood_entity_id in (
          select id from public.entities where lower(name) like '%santa marta%'
        )
      )
  ) then
    raise exception 'Santa Marta continúa indebidamente como acompañamiento actual de Rosario';
  end if;

  if (select count(*) from public.band_releases
      where band_entity_id = v_oliva_id and status = 'published') < 27
     or (select count(*) from public.band_releases
         where band_entity_id = v_rosario_id and status = 'published') < 23 then
    raise exception 'El catálogo discográfico no ha quedado completo';
  end if;

  if (select count(*)
      from public.band_release_tracks t
      join public.band_releases r on r.id = t.release_id
      where r.band_entity_id = v_oliva_id) < 198
     or (select count(*)
         from public.band_release_tracks t
         join public.band_releases r on r.id = t.release_id
         where r.band_entity_id = v_rosario_id) < 76 then
    raise exception 'Faltan pistas en uno de los repertorios discográficos';
  end if;

  if exists (
    select 1
    from public.band_releases r
    where r.band_entity_id in (v_oliva_id, v_rosario_id)
      and r.status = 'published'
      and (
        not exists (select 1 from public.band_release_tracks t where t.release_id = r.id)
        or not exists (select 1 from public.band_release_sources rs where rs.release_id = r.id)
      )
  ) then
    raise exception 'Existe una edición publicada sin pista o sin fuente';
  end if;

  if exists (
    select 1
    from public.band_releases r
    where r.band_entity_id in (v_oliva_id, v_rosario_id)
      and r.ordinal_number is not null
      and (
        r.cover_image_path is null
        or r.cover_image_alt is null
        or r.cover_image_credit is null
      )
  ) then
    raise exception 'Falta trazabilidad de carátula en una edición histórica';
  end if;
end $$;
