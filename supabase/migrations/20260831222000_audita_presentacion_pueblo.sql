-- Auditoría documental de Presentación al Pueblo (31-08-2026).
-- Solo contenido y relaciones ya contempladas por el modelo canónico.

do $$
declare
  v_band uuid;
  v_history_source uuid;
  v_discography_source uuid;
  v_en_silencio_source uuid;
  v_lazar_source uuid;
begin
  select id into v_band from entities
  where slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
    and entity_type = 'band';

  if v_band is null then
    raise exception 'No se localiza la banda Presentación al Pueblo';
  end if;

  insert into sources (id,name,url,source_type,author_or_publisher,accessed_at,notes)
  select gen_random_uuid(),'Presentación al Pueblo · historia oficial',
    'https://presentaciondoshermanas.com/historia-about/','Web oficial',
    'Banda de Cornetas y Tambores Nuestro Padre Jesús en la Presentación al Pueblo',
    date '2026-08-31','Historia institucional, primeros contratos y relaciones históricas.'
  where not exists (select 1 from sources where url='https://presentaciondoshermanas.com/historia-about/');

  select id into v_history_source from sources
  where url='https://presentaciondoshermanas.com/historia-about/' order by created_at limit 1;

  select id into v_discography_source from sources
  where url='https://presentaciondoshermanas.com/discografia-2/' order by created_at limit 1;

  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
  select gen_random_uuid(),'Hermandad del Transporte · En tu silencio',
    'https://hermandaddeltransporte.com/2025/03/10/entusilencio25/','Web oficial',
    'Hermandad del Transporte',date '2025-03-10',date '2026-08-31',
    'Anuncio institucional con autoría, dedicatoria, fecha, hora y lugar del estreno.'
  where not exists (select 1 from sources where url='https://hermandaddeltransporte.com/2025/03/10/entusilencio25/');

  select id into v_en_silencio_source from sources
  where url='https://hermandaddeltransporte.com/2025/03/10/entusilencio25/' order by created_at limit 1;

  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
  select gen_random_uuid(),'Presentación al Pueblo · nueva marcha L’AZAR',
    'https://presentaciondoshermanas.com/nueva-marcha-lazar/','Web oficial',
    'Presentación al Pueblo',date '2024-08-29',date '2026-08-31',
    'Publicación institucional que fecha el estreno el 26 de julio de 2024 e identifica al autor.'
  where not exists (select 1 from sources where url='https://presentaciondoshermanas.com/nueva-marcha-lazar/');

  select id into v_lazar_source from sources
  where url='https://presentaciondoshermanas.com/nueva-marcha-lazar/' order by created_at limit 1;

  -- Antigüedad e integridad de acompañamientos vigentes.
  update music_accompaniment_periods set
    year_from=1989,date_from_text='Desde 1989',
    notes='Acompañamiento de la banda propia tras Nuestro Padre Jesús en la Presentación al Pueblo, documentado desde la primera Semana Santa de la formación.',
    updated_at=now()
  where band_entity_id=v_band and public_brotherhood_slug='hermandad-santa-cruz-dos-hermanas' and is_current;

  update music_accompaniment_periods set
    year_from=2003,date_from_text='Desde 2003',
    position='Tras el Santísimo Cristo de la Vera-Cruz en el cortejo de regreso',
    notes='Vínculo documentado desde 2003. La banda participa en el cortejo de regreso de la Parroquia a la Ermita durante la madrugada.',
    updated_at=now()
  where band_entity_id=v_band and public_brotherhood_slug='vera-cruz-alcala-del-rio' and is_current;

  update music_accompaniment_periods set
    year_from=2007,date_from_text='Desde 2007',
    notes='Contrato firmado tras la Semana Santa de 2006 para comenzar el Miércoles Santo de 2007; continuidad ratificada en 2025.',
    updated_at=now()
  where band_entity_id=v_band and public_brotherhood_slug='hermandad-de-san-bernardo' and is_current;

  update music_accompaniment_periods set
    year_from=2024,date_from_text='Desde 2024',
    position='Tras el paso de misterio, en el recorrido de vuelta',
    notes='Contrato para el Domingo de Ramos de 2024; la lluvia impidió materializar aquel primer acompañamiento. Renovado para 2025 y vigente en 2026.',
    updated_at=now()
  where band_entity_id=v_band and public_brotherhood_slug='hermandad-transporte-jerez' and is_current;

  update music_accompaniment_periods set
    year_from=2025,date_from_text='Desde 2025',step_entity_id=null,
    public_step_name='Paso del Santísimo Cristo de la Misericordia',
    notes='Acompañamiento iniciado en 2025 y repetido en 2026. Se desvincula el paso de Castilblanco que estaba asociado por error; la identidad textual de La Rinconada queda conservada hasta disponer de su entidad canónica propia.',
    updated_at=now()
  where band_entity_id=v_band and public_brotherhood_slug='dolores-la-rinconada' and is_current;

  -- Fuentes específicas de los periodos vigentes.
  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at)
  select gen_random_uuid(),'Presentación al Pueblo · renovación con el Transporte',
    'https://presentaciondoshermanas.com/renovacion-hermandad-del-transporte-jerez/','Web oficial',
    'Presentación al Pueblo',date '2024-09-19',date '2026-08-31'
  where not exists (select 1 from sources where url='https://presentaciondoshermanas.com/renovacion-hermandad-del-transporte-jerez/');

  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at)
  select gen_random_uuid(),'Presentación al Pueblo · contrato con la Defensión',
    'https://presentaciondoshermanas.com/nuevo-contrato-hermandad-de-la-defension-jerez/','Web oficial',
    'Presentación al Pueblo',date '2025-07-18',date '2026-08-31'
  where not exists (select 1 from sources where url='https://presentaciondoshermanas.com/nuevo-contrato-hermandad-de-la-defension-jerez/');

  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at)
  select gen_random_uuid(),'Presentación al Pueblo · renovación con San Bernardo',
    'https://presentaciondoshermanas.com/renovacion-hermandad-de-san-bernardo/','Web oficial',
    'Presentación al Pueblo',date '2025-08-12',date '2026-08-31'
  where not exists (select 1 from sources where url='https://presentaciondoshermanas.com/renovacion-hermandad-de-san-bernardo/');

  insert into sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at)
  select gen_random_uuid(),'Ayuntamiento de La Rinconada · Sábado Santo 2026',
    'https://www.larinconada.es/es/noticias/15218/sabado-santo-misericordia-y-dolores-para-cerrar-el-tiempo-de-penitencia-en-la-rinconada',
    'Fuente institucional','Ayuntamiento de La Rinconada',date '2026-04-01',date '2026-08-31'
  where not exists (select 1 from sources where url like 'https://www.larinconada.es/es/noticias/15218/%');

  insert into source_links (id,source_id,music_accompaniment_period_id,scope,notes)
  select gen_random_uuid(),s.id,mp.id,'Antigüedad y contexto del acompañamiento','Fuente específica incorporada en auditoría de 31-08-2026.'
  from music_accompaniment_periods mp
  join sources s on s.url = case mp.public_brotherhood_slug
    when 'hermandad-transporte-jerez' then 'https://presentaciondoshermanas.com/renovacion-hermandad-del-transporte-jerez/'
    when 'hermandad-defension-jerez' then 'https://presentaciondoshermanas.com/nuevo-contrato-hermandad-de-la-defension-jerez/'
    when 'hermandad-de-san-bernardo' then 'https://presentaciondoshermanas.com/renovacion-hermandad-de-san-bernardo/'
    when 'dolores-la-rinconada' then 'https://www.larinconada.es/es/noticias/15218/sabado-santo-misericordia-y-dolores-para-cerrar-el-tiempo-de-penitencia-en-la-rinconada'
    else null end
  where mp.band_entity_id=v_band and mp.is_current
    and not exists(select 1 from source_links sl where sl.source_id=s.id and sl.music_accompaniment_period_id=mp.id);

  insert into source_links (id,source_id,music_accompaniment_period_id,scope)
  select gen_random_uuid(),v_history_source,mp.id,'Inicio del vínculo'
  from music_accompaniment_periods mp
  where mp.band_entity_id=v_band and mp.is_current
    and mp.public_brotherhood_slug in ('hermandad-santa-cruz-dos-hermanas','vera-cruz-alcala-del-rio','hermandad-de-san-bernardo')
    and not exists(select 1 from source_links sl where sl.source_id=v_history_source and sl.music_accompaniment_period_id=mp.id);

  -- Entidades mínimas necesarias para no dejar relaciones históricas sin nodo canónico.
  create temporary table hc_min_brotherhoods(name text,slug text) on commit drop;
  insert into hc_min_brotherhoods values
    ('Hermandad de la Amargura de Jerez','hermandad-amargura-jerez'),
    ('Hermandad de la Vera-Cruz de Olivares','hermandad-vera-cruz-olivares'),
    ('Hermandad de Jesús Nazareno de Utrera','hermandad-jesus-nazareno-utrera'),
    ('Hermandad de la Soledad de La Algaba','hermandad-soledad-la-algaba');

  insert into entities(id,entity_type,name,slug,summary,status)
  select gen_random_uuid(),'brotherhood',h.name,h.slug,
    'Entidad mínima creada para documentar un acompañamiento histórico de Presentación al Pueblo; queda pendiente su ficha integral.','draft'
  from hc_min_brotherhoods h
  where not exists(select 1 from entities e where e.slug=h.slug);

  insert into brotherhoods(entity_id,official_name,popular_name,notes)
  select e.id,h.name,h.name,
    'Alta mínima relacional. Pendiente de investigación editorial completa antes de publicación.'
  from hc_min_brotherhoods h join entities e on e.slug=h.slug
  where not exists(select 1 from brotherhoods b where b.entity_id=e.id);

  -- Acompañamientos históricos documentados. Los contratos acreditados para un solo año no se convierten en rangos.
  create temporary table hc_hist_periods(
    brotherhood_slug text, public_name text, public_step text, municipality text, province text,
    outing_type text, position_text text, year_from int, year_to int, from_text text, to_text text, notes_text text
  ) on commit drop;

  insert into hc_hist_periods values
  ('hermandad-hiniesta-sevilla','Hermandad de la Hiniesta',null,'Sevilla','Sevilla','Domingo de Ramos','En la Cruz de Guía',1989,1989,'1989','1989','Primer Domingo de Ramos documentado de la formación.'),
  ('hermandad-amargura-jerez','Hermandad de la Amargura de Jerez',null,'Jerez de la Frontera','Cádiz','Miércoles Santo','Acompañamiento musical',1989,1989,'1989','1989','Contrato documentado para la Semana Santa de 1989.'),
  ('hermandad-vera-cruz-olivares','Hermandad de la Vera-Cruz de Olivares',null,'Olivares','Sevilla','Jueves Santo','Acompañamiento musical',1989,1989,'1989','1989','Contrato documentado para la Semana Santa de 1989.'),
  ('hermandad-jesus-nazareno-utrera','Hermandad de Jesús Nazareno de Utrera',null,'Utrera','Sevilla','Madrugá','Tras Nuestro Padre Jesús Nazareno',1989,1989,'1989','1989','Contrato documentado para la Semana Santa de 1989.'),
  ('hermandad-soledad-la-algaba','Hermandad de la Soledad de La Algaba',null,'La Algaba','Sevilla','Viernes Santo','Acompañamiento musical',1989,1989,'1989','1989','Contrato documentado para la Semana Santa de 1989.'),
  ('hermandad-candelaria-sevilla','Hermandad de la Candelaria',null,'Sevilla','Sevilla','Martes Santo','Acompañamiento musical',1990,1990,'1990','1990','Sustitución por un año de la Banda de Nuestra Señora del Sol.'),
  ('hermandad-de-la-o','Hermandad de La O',null,'Sevilla','Sevilla','Viernes Santo','Tras Nuestro Padre Jesús Nazareno',1990,1990,'1990','1990','Sustitución por un año de la Banda de Nuestra Señora del Sol.'),
  ('hermandad-de-la-estrella','Hermandad de la Estrella','Paso de misterio de Nuestro Padre Jesús de las Penas','Sevilla','Sevilla','Domingo de Ramos','Tras el paso de misterio',1991,2023,'Desde 1991','Hasta 2023','Vinculación histórica continuada documentada hasta la Semana Santa de 2023.'),
  ('hermandad-del-cachorro','Hermandad del Cachorro','Paso del Santísimo Cristo de la Expiración','Sevilla','Sevilla','Viernes Santo','Tras el Santísimo Cristo de la Expiración',1992,2023,'Desde 1992','Hasta 2023','Relación iniciada en 1992 y finalizada tras la Semana Santa de 2023.'),
  ('siete-palabras-sevilla','Las Siete Palabras',null,'Sevilla','Sevilla','Miércoles Santo','Tras el Santísimo Cristo de las Siete Palabras',1992,2006,'Desde 1992','Hasta 2006','Quince Semanas Santas de vinculación, concluidas al finalizar el contrato de 2006.'),
  ('san-benito','Hermandad de San Benito',null,'Sevilla','Sevilla','Martes Santo','Tras el Santísimo Cristo de la Sangre',1995,1996,'Desde 1995','Hasta 1996','Acompañamiento documentado durante las Semanas Santas de 1995 y 1996.'),
  ('dulce-nombre-bellavista','Hermandad del Dulce Nombre de Bellavista','Paso de misterio de Nuestro Padre Jesús de la Salud y Remedios','Sevilla','Sevilla','Viernes de Dolores','Tras el paso de misterio',1997,1999,'Desde 1997','Hasta 1999','Acompañamiento documentado entre 1997 y 1999, ambos inclusive.');

  insert into music_accompaniment_periods(
    id,brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,
    year_from,year_to,date_from_text,date_to_text,is_current,notes,status,
    public_brotherhood_name,public_step_name,public_brotherhood_slug,
    public_municipality_name,public_municipality_slug,public_province
  )
  select gen_random_uuid(),b.id,v_band,st.id,h.position_text,h.outing_type,
    h.year_from,h.year_to,h.from_text,h.to_text,false,h.notes_text,'published',
    h.public_name,h.public_step,h.brotherhood_slug,h.municipality,
    lower(regexp_replace(translate(h.municipality,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','-','g')),
    h.province
  from hc_hist_periods h
  left join entities b on b.slug=h.brotherhood_slug and b.entity_type='brotherhood'
  left join entities st on st.entity_type='step' and (
    (h.brotherhood_slug='hermandad-del-cachorro' and st.slug='paso-cristo-expiracion-cachorro') or
    (h.brotherhood_slug='dulce-nombre-bellavista' and st.slug='paso-misterio-salud-remedios-bellavista')
  )
  where not exists (
    select 1 from music_accompaniment_periods x
    where x.band_entity_id=v_band and x.public_brotherhood_name=h.public_name
      and x.year_from=h.year_from and coalesce(x.year_to,-1)=coalesce(h.year_to,-1)
  );

  insert into source_links (id,source_id,music_accompaniment_period_id,scope)
  select gen_random_uuid(),v_history_source,mp.id,'Acompañamiento histórico'
  from music_accompaniment_periods mp
  join hc_hist_periods h on h.public_name=mp.public_brotherhood_name and h.year_from=mp.year_from
  where mp.band_entity_id=v_band
    and not exists(select 1 from source_links sl where sl.source_id=v_history_source and sl.music_accompaniment_period_id=mp.id);

  -- Autores canónicos comprobados antes del alta.
  create temporary table hc_agents(name text,slug text) on commit drop;
  insert into hc_agents values
    ('Sergio Muñiz Carmona','sergio-muniz-carmona'),
    ('Sergio Larrinaga','sergio-larrinaga'),
    ('Agustín Castro Rodríguez','agustin-castro-rodriguez'),
    ('Jorge Águila Ordóñez','jorge-aguila-ordonez'),
    ('Raúl Rodríguez Domínguez','raul-rodriguez-dominguez'),
    ('José Manuel Ortega Cruz','jose-manuel-ortega-cruz'),
    ('Antonio Velasco Rodríguez','antonio-velasco-rodriguez'),
    ('Francisco José Martínez Pérez','francisco-jose-martinez-perez'),
    ('Antonio Rodríguez Márquez','antonio-rodriguez-marquez'),
    ('Joaquín Eligio Brun','joaquin-eligio-brun'),
    ('Manuel Antonio González Cruz','manuel-antonio-gonzalez-cruz');

  insert into entities(id,entity_type,name,slug,summary,status)
  select gen_random_uuid(),'agent',a.name,a.slug,'Compositor vinculado al repertorio documentado de Presentación al Pueblo.','published'
  from hc_agents a where not exists(
    select 1 from entities e where e.entity_type='agent' and
      (e.slug=a.slug or lower(e.name)=lower(a.name))
  );

  insert into agents(entity_id,agent_kind,description)
  select e.id,'person','Autor musical documentado en la discografía oficial de Presentación al Pueblo.'
  from hc_agents a join entities e on e.slug=a.slug
  where not exists(select 1 from agents ag where ag.entity_id=e.id);

  insert into agent_names(id,agent_entity_id,name,name_type,is_current)
  select gen_random_uuid(),e.id,e.name,'official',true
  from hc_agents a join entities e on e.slug=a.slug
  where not exists(select 1 from agent_names an where an.agent_entity_id=e.id and lower(an.name)=lower(e.name));

  -- Marchas y relaciones de autoría inequívocas de la discografía oficial.
  create temporary table hc_marches(title text,slug text,author_slugs text[],arranger_slugs text[]) on commit drop;
  insert into hc_marches values
    ('Mi Cristo Moreno','marcha-mi-cristo-moreno',array['raul-rodriguez-dominguez'],array[]::text[]),
    ('Nazareno, Nazareno','marcha-nazareno-nazareno',array['jose-manuel-ortega-cruz'],array[]::text[]),
    ('Jesús o Barrabás','marcha-jesus-o-barrabas',array['jose-manuel-ortega-cruz'],array[]::text[]),
    ('Pasa la Estrella','marcha-pasa-la-estrella',array['jose-ramon-perez-soto'],array['francisco-jose-martinez-perez']),
    ('Pilatos a Jesús','marcha-pilatos-a-jesus',array['antonio-velasco-rodriguez'],array[]::text[]),
    ('Crucifixión','marcha-crucifixion-presentacion',array['francisco-jose-martinez-perez'],array[]::text[]),
    ('Varón de Dolores','marcha-varon-de-dolores-presentacion',array['jose-manuel-ortega-cruz'],array[]::text[]),
    ('Llora la Madre de Dios en su Soledad','marcha-llora-la-madre-de-dios-en-su-soledad',array['jose-ramon-perez-soto'],array[]::text[]),
    ('Mi Esperanza','marcha-mi-esperanza-presentacion',array['jose-ramon-perez-soto'],array[]::text[]),
    ('Misericordia en tus Palabras','marcha-misericordia-en-tus-palabras',array['francisco-jose-martinez-perez'],array[]::text[]),
    ('Recuerdos','marcha-recuerdos-presentacion',array['francisco-japon-rodriguez'],array[]::text[]),
    ('Penas de Triana','marcha-penas-de-triana',array['antonio-velasco-rodriguez'],array['agustin-castro-rodriguez']),
    ('Madre','marcha-madre-presentacion',array['raul-rodriguez-dominguez'],array[]::text[]),
    ('Ecce-Homo','marcha-ecce-homo-presentacion',array['francisco-jose-martinez-perez'],array[]::text[]),
    ('Al Gitano de la Cava','marcha-al-gitano-de-la-cava',array['pedro-manuel-pacheco-palomo'],array[]::text[]),
    ('Triana te Corona','marcha-triana-te-corona',array['isaac-gomez','jorge-aguila-ordonez'],array[]::text[]),
    ('Mi Niña Azahar','marcha-mi-nina-azahar',array['pedro-manuel-pacheco-palomo'],array[]::text[]),
    ('Presentación','marcha-presentacion-ct-1999',array['francisco-jose-martinez-perez'],array[]::text[]),
    ('Sentimiento Gitano','marcha-sentimiento-gitano',array['raul-rodriguez-dominguez'],array[]::text[]),
    ('Amor y Sacrificio','marcha-amor-y-sacrificio',array['jorge-aguila-ordonez'],array[]::text[]),
    ('Amor, Corneta y Costal','marcha-amor-corneta-y-costal',array['raul-rodriguez-dominguez'],array[]::text[]),
    ('Cachorro Mío','marcha-cachorro-mio',array['jorge-aguila-ordonez'],array[]::text[]),
    ('A ti Padre','marcha-a-ti-padre',array['agustin-castro-rodriguez'],array[]::text[]),
    ('Hágase tu Voluntad','marcha-hagase-tu-voluntad',array['jorge-aguila-ordonez','isaac-gomez'],array[]::text[]),
    ('…Al Alba Jesús y Barrabás','marcha-al-alba-jesus-y-barrabas',array['isaac-gomez','jorge-aguila-ordonez'],array[]::text[]),
    ('Tu Cáliz de Amargura','marcha-tu-caliz-de-amargura',array['david-alvarez-garcia'],array[]::text[]),
    ('Siete Palabras de Nuestro Señor','marcha-siete-palabras-de-nuestro-senor',array['isaac-gomez','jorge-aguila-ordonez'],array[]::text[]),
    ('A la Triana Costalera','marcha-a-la-triana-costalera',array['jorge-aguila-ordonez'],array[]::text[]),
    ('Váleme Señora','marcha-valeme-senora',array['agustin-castro-rodriguez'],array[]::text[]),
    ('El Dios del Perdón','marcha-el-dios-del-perdon',array['pedro-manuel-pacheco-palomo'],array[]::text[]),
    ('La historia de un Profeta','marcha-la-historia-de-un-profeta',array['sergio-larrinaga'],array[]::text[]),
    ('Aire para mis Penas','marcha-aire-para-mis-penas',array['manuel-jesus-guerrero-marin'],array[]::text[]),
    ('Al Cielo Presentado','marcha-al-cielo-presentado',array['agustin-castro-rodriguez'],array[]::text[]),
    ('Cachorro de Alma Gitana','marcha-cachorro-de-alma-gitana',array['sergio-larrinaga'],array[]::text[]),
    ('A Jesús de la Agonía','marcha-a-jesus-de-la-agonia',array['pedro-manuel-pacheco-palomo'],array[]::text[]),
    ('La Luz que Guía a Triana','marcha-la-luz-que-guia-a-triana',array['manuel-jesus-guerrero-marin'],array[]::text[]),
    ('Trianeando por Sevilla','marcha-trianeando-por-sevilla',array['antonio-rodriguez-marquez'],array[]::text[]),
    ('En Triana','marcha-en-triana-presentacion',array['joaquin-eligio-brun'],array['manuel-antonio-gonzalez-cruz']),
    ('Una Vida de Esperanza','marcha-una-vida-de-esperanza',array['manuel-jesus-guerrero-marin'],array[]::text[]),
    ('Sentir','marcha-sentir-presentacion',array['jorge-aguila-ordonez'],array[]::text[]),
    ('El Refugio… de una Madre','marcha-el-refugio-de-una-madre',array['manuel-jesus-guerrero-marin','sergio-larrinaga'],array[]::text[]),
    ('Cuenta la Leyenda','marcha-cuenta-la-leyenda',array['agente-jose-maria-sanchez-martin'],array[]::text[]),
    ('L’AZAR','marcha-lazar-presentacion',array['agente-jesus-barrera-rios'],array[]::text[]),
    ('En Tu Silencio','marcha-en-tu-silencio',array['isaac-gomez','sergio-muniz-carmona'],array[]::text[]);

  insert into entities(id,entity_type,name,slug,summary,status)
  select gen_random_uuid(),'march',m.title,m.slug,'Marcha procesional documentada en el universo musical de Presentación al Pueblo.','published'
  from hc_marches m where not exists(select 1 from entities e where e.slug=m.slug);

  insert into marches(entity_id,music_type,work_type,description,eligible_for_daily,daily_priority)
  select e.id,'Cornetas y Tambores','Marcha procesional',
    'Obra relacionada con Presentación al Pueblo mediante grabación discográfica o estreno documentado.',false,0
  from hc_marches m join entities e on e.slug=m.slug
  where not exists(select 1 from marches x where x.entity_id=e.id);

  insert into march_authors(id,march_entity_id,agent_entity_id,author_role,notes,status)
  select gen_random_uuid(),me.id,ae.id,'composer','Autoría según la discografía o publicación oficial de la formación.','published'
  from hc_marches m join entities me on me.slug=m.slug
  cross join lateral unnest(m.author_slugs) a_slug
  join entities ae on ae.slug=a_slug
  on conflict (march_entity_id,agent_entity_id,author_role) do nothing;

  insert into march_authors(id,march_entity_id,agent_entity_id,author_role,notes,status)
  select gen_random_uuid(),me.id,ae.id,'arranger','Arreglo identificado expresamente en la discografía oficial.','published'
  from hc_marches m join entities me on me.slug=m.slug
  cross join lateral unnest(m.arranger_slugs) a_slug
  join entities ae on ae.slug=a_slug
  on conflict (march_entity_id,agent_entity_id,author_role) do nothing;

  -- La coincidencia «Presentación» no debe apuntar a la marcha homónima de agrupación musical de 1974.
  update band_release_tracks t set march_entity_id=me.id
  from band_releases r, entities me
  where t.release_id=r.id and r.band_entity_id=v_band and me.slug='marcha-presentacion-ct-1999'
    and t.title='Presentación';

  -- Enlace de pistas por identidad normalizada; se excluye la levantá, que no es una marcha.
  update band_release_tracks t set march_entity_id=me.id
  from band_releases r, hc_marches hm, entities me
  where t.release_id=r.id and r.band_entity_id=v_band and me.slug=hm.slug
    and t.title <> 'Levantá del paso de Cristo de la Hermandad de la Estrella'
    and lower(regexp_replace(translate(t.title,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g'))
      = lower(regexp_replace(translate(hm.title,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g'));

  -- Variantes editoriales inequívocas.
  update band_release_tracks t set march_entity_id=me.id
  from band_releases r, entities me
  where t.release_id=r.id and r.band_entity_id=v_band and me.slug='marcha-triana-te-corona'
    and t.title='…Y Triana te Corona';

  update band_release_tracks t set march_entity_id=me.id
  from band_releases r, entities me
  where t.release_id=r.id and r.band_entity_id=v_band and me.slug='marcha-tu-caliz-de-amargura'
    and t.title='Cáliz de Amargura';

  insert into source_links(id,source_id,entity_id,scope,notes)
  select gen_random_uuid(),v_discography_source,e.id,'Título y autoría en la discografía oficial',
    'No se atribuyen autorías cuando la propia página institucional presenta variantes incompatibles.'
  from hc_marches m join entities e on e.slug=m.slug
  where v_discography_source is not null
    and not exists(select 1 from source_links sl where sl.source_id=v_discography_source and sl.entity_id=e.id);

  -- Estrenos normalizados.
  update marches set premiere_date=date '2024-07-26',premiere_date_text='26 de julio de 2024',
    premiered_by_band_entity_id=v_band,
    notes='La noticia específica oficial fecha el estreno en 2024; la página histórica lo etiqueta como 2023. Se conserva constancia del conflicto y se prioriza la publicación contemporánea al hecho.'
  where entity_id=(select id from entities where slug='marcha-lazar-presentacion');

  insert into band_premieres(id,band_entity_id,title,composer_name,premiere_year,premiere_date,venue_text,municipality_text,video_url,description,source_id,status,display_order,march_entity_id)
  select gen_random_uuid(),v_band,'L’AZAR','Jesús Barrera Ríos',2024,date '2024-07-26',null,null,null,
    'Tipo de novedad: estreno absoluto. La publicación específica oficial acredita fecha y autor; la reseña histórica contiene una datación distinta.',v_lazar_source,'published',20,e.id
  from entities e where e.slug='marcha-lazar-presentacion'
  on conflict (band_entity_id,title,premiere_year) do update set
    premiere_date=excluded.premiere_date,composer_name=excluded.composer_name,
    description=excluded.description,source_id=excluded.source_id,march_entity_id=excluded.march_entity_id,status='published';

  update marches set premiere_date=date '2025-03-16',premiere_date_text='16 de marzo de 2025',
    premiered_by_band_entity_id=v_band,
    notes='Estreno anunciado por la Hermandad del Transporte para el 16 de marzo de 2025. La página histórica de la banda lo etiqueta como 2024; se prioriza el anuncio institucional fechado y contemporáneo.'
  where entity_id=(select id from entities where slug='marcha-en-tu-silencio');

  insert into band_premieres(id,band_entity_id,title,composer_name,premiere_year,premiere_date,venue_text,municipality_text,video_url,description,source_id,status,display_order,march_entity_id)
  select gen_random_uuid(),v_band,'En Tu Silencio','Isaac Manuel Gómez Jiménez y Sergio Muñiz Carmona',
    2025,date '2025-03-16','Basílica de Nuestra Señora de la Merced Coronada','Jerez de la Frontera',null,
    'Tipo de novedad: estreno absoluto. Marcha dedicada a Nuestro Padre Jesús del Consuelo en el Desprecio de Herodes.',v_en_silencio_source,'published',10,e.id
  from entities e where e.slug='marcha-en-tu-silencio'
  on conflict (band_entity_id,title,premiere_year) do update set
    premiere_date=excluded.premiere_date,composer_name=excluded.composer_name,venue_text=excluded.venue_text,
    municipality_text=excluded.municipality_text,description=excluded.description,source_id=excluded.source_id,
    march_entity_id=excluded.march_entity_id,status='published';

  insert into source_links(id,source_id,band_premiere_id,scope)
  select gen_random_uuid(),bp.source_id,bp.id,'Estreno absoluto'
  from band_premieres bp
  where bp.band_entity_id=v_band and bp.title in ('L’AZAR','En Tu Silencio') and bp.source_id is not null
    and not exists(select 1 from source_links sl where sl.source_id=bp.source_id and sl.band_premiere_id=bp.id);
end $$;
