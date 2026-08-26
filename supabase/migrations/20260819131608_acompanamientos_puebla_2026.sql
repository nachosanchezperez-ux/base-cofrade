-- Hilo Cofrade · Banda Municipal de Música de La Puebla del Río
-- Acompañamientos musicales vigentes en Semana Santa 2026
-- Migración 058

insert into public.municipalities (name, slug, province, autonomous_community, country)
values
  ('Huelva', 'huelva', 'Huelva', 'Andalucía', 'España'),
  ('Alcalá del Río', 'alcala-del-rio', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

insert into public.entities (entity_type, name, slug, status)
values
  ('brotherhood','Agrupación Parroquial del Cristo de los Desamparados del Santo Ángel','agrupacion-cristo-desamparados-santo-angel','draft'),
  ('brotherhood','Hermandad de San Pablo','hermandad-de-san-pablo','draft'),
  ('brotherhood','Hermandad de la Esperanza de Huelva','hermandad-esperanza-de-huelva','draft'),
  ('brotherhood','Hermandad de la Vera-Cruz de Alcalá del Río','vera-cruz-alcala-del-rio','draft'),
  ('brotherhood','Hermandad del Cachorro','hermandad-del-cachorro','draft')
on conflict (slug) do update set name = excluded.name;

with desired (slug,official_name,popular_name,municipality_slug,procession_day,website_url) as (
  values
    ('agrupacion-cristo-desamparados-santo-angel','Agrupación Parroquial del Santísimo Cristo de los Desamparados','Cristo de los Desamparados del Santo Ángel','sevilla','Sábado de Pasión',null::text),
    ('hermandad-de-san-pablo','Fervorosa y Trinitaria Hermandad del Santísimo Sacramento y Cofradía de Nazarenos de Nuestro Padre Jesús Cautivo y Rescatado, Nuestra Señora del Rosario Doloroso, San Juan de Mata y San Ignacio de Loyola','San Pablo','sevilla','Lunes Santo',null::text),
    ('hermandad-esperanza-de-huelva','Real e Ilustre Hermandad Sacramental de San Francisco, Pura y Limpia Concepción de Nuestra Señora y Cofradía de Nazarenos del Santísimo Cristo de la Expiración, María Santísima del Mayor Dolor, San Juan Evangelista y Nuestra Señora de la Esperanza Coronada','Esperanza de Huelva','huelva','Miércoles Santo','https://www.esperanzadehuelva.com/'),
    ('vera-cruz-alcala-del-rio','Antigua, Real, Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Vera-Cruz y María Santísima de las Angustias Coronada','Vera-Cruz','alcala-del-rio','Jueves Santo','https://www.vera-cruz.org/'),
    ('hermandad-del-cachorro','Pontificia, Real e Ilustre Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Expiración y Nuestra Madre y Señora del Patrocinio','El Cachorro','sevilla','Viernes Santo','https://hermandaddelcachorro.org/')
)
insert into public.brotherhoods (entity_id,official_name,popular_name,municipality_id,website_url,brotherhood_types,current_procession_day)
select e.id,d.official_name,d.popular_name,m.id,d.website_url,array['Penitencia']::text[],d.procession_day
from desired d
join public.entities e on e.slug=d.slug and e.entity_type='brotherhood'
join public.municipalities m on m.slug=d.municipality_slug
on conflict (entity_id) do update set
  official_name=excluded.official_name,
  popular_name=excluded.popular_name,
  municipality_id=excluded.municipality_id,
  website_url=coalesce(excluded.website_url,public.brotherhoods.website_url),
  brotherhood_types=excluded.brotherhood_types,
  current_procession_day=excluded.current_procession_day;

insert into public.entities (entity_type,name,slug,status)
values
  ('step','Paso de palio de María Santísima del Amor','paso-palio-maria-santisima-amor-pino-montano','draft'),
  ('step','Paso de palio de María Santísima de la Paz','paso-palio-maria-santisima-paz','draft'),
  ('step','Paso del Santísimo Cristo de los Desamparados','paso-cristo-desamparados-santo-angel','draft'),
  ('step','Paso de palio de Nuestra Señora del Rosario Doloroso','paso-palio-rosario-doloroso-san-pablo','draft'),
  ('step','Paso de palio de Nuestra Señora de la Esperanza Coronada','paso-palio-esperanza-coronada-huelva','draft'),
  ('step','Paso del Santísimo Cristo de la Vera-Cruz','paso-cristo-vera-cruz-alcala-del-rio','draft'),
  ('step','Paso de palio de María Santísima de las Angustias Coronada','paso-palio-angustias-coronada-alcala-del-rio','draft'),
  ('step','Paso del Santísimo Cristo de la Expiración','paso-cristo-expiracion-cachorro','draft')
on conflict (slug) do update set name=excluded.name;

with desired (slug,step_type) as (
  values
    ('paso-palio-maria-santisima-amor-pino-montano','Palio'),
    ('paso-palio-maria-santisima-paz','Palio'),
    ('paso-cristo-desamparados-santo-angel','Cristo'),
    ('paso-palio-rosario-doloroso-san-pablo','Palio'),
    ('paso-palio-esperanza-coronada-huelva','Palio'),
    ('paso-cristo-vera-cruz-alcala-del-rio','Cristo'),
    ('paso-palio-angustias-coronada-alcala-del-rio','Palio'),
    ('paso-cristo-expiracion-cachorro','Cristo')
)
insert into public.steps (entity_id,step_type,current_condition)
select e.id,d.step_type,'preserved'
from desired d join public.entities e on e.slug=d.slug and e.entity_type='step'
on conflict (entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition;

with desired (brotherhood_slug,step_slug) as (
  values
    ('hermandad-de-pino-montano','paso-palio-maria-santisima-amor-pino-montano'),
    ('hermandad-de-la-paz','paso-palio-maria-santisima-paz'),
    ('agrupacion-cristo-desamparados-santo-angel','paso-cristo-desamparados-santo-angel'),
    ('hermandad-de-san-pablo','paso-palio-rosario-doloroso-san-pablo'),
    ('hermandad-esperanza-de-huelva','paso-palio-esperanza-coronada-huelva'),
    ('vera-cruz-alcala-del-rio','paso-cristo-vera-cruz-alcala-del-rio'),
    ('vera-cruz-alcala-del-rio','paso-palio-angustias-coronada-alcala-del-rio'),
    ('hermandad-del-cachorro','paso-cristo-expiracion-cachorro')
)
insert into public.brotherhood_steps (brotherhood_entity_id,step_entity_id,relation_type,status)
select b.id,s.id,'processional_step','draft'
from desired d
join public.entities b on b.slug=d.brotherhood_slug and b.entity_type='brotherhood'
join public.entities s on s.slug=d.step_slug and s.entity_type='step'
where not exists (
  select 1 from public.brotherhood_steps bs
  where bs.brotherhood_entity_id=b.id and bs.step_entity_id=s.id and bs.relation_type='processional_step' and bs.status<>'archived'
);

create temporary table _hc_puebla_accomp_desired (
  brotherhood_slug text primary key,
  step_slug text,
  outing_type text not null,
  position text,
  year_from integer not null,
  public_brotherhood_name text not null,
  public_step_name text,
  notes text
) on commit drop;

insert into _hc_puebla_accomp_desired values
  ('hermandad-de-pino-montano','paso-palio-maria-santisima-amor-pino-montano','Viernes de Dolores','Tras el paso de palio',2024,'Hermandad de Pino Montano','Paso de palio de María Santísima del Amor','La Banda Municipal de La Puebla del Río regresó a Pino Montano en 2024, tras una presencia anterior en 1995. La nueva vinculación continúa vigente en 2026.'),
  ('agrupacion-cristo-desamparados-santo-angel','paso-cristo-desamparados-santo-angel','Sábado de Pasión','Tras el paso',2024,'Agrupación Parroquial del Cristo de los Desamparados del Santo Ángel','Paso del Santísimo Cristo de los Desamparados','La vinculación procesional comenzó en 2024 y fue renovada expresamente para el Sábado de Pasión de 2026.'),
  ('hermandad-de-la-paz','paso-palio-maria-santisima-paz','Domingo de Ramos','Tras el paso de palio',2025,'Hermandad de la Paz','Paso de palio de María Santísima de la Paz','La banda se incorporó al palio de María Santísima de la Paz en 2025 y renovó su acompañamiento para el Domingo de Ramos de 2026.'),
  ('hermandad-de-san-pablo','paso-palio-rosario-doloroso-san-pablo','Lunes Santo','Tras el paso de palio, en el recorrido de regreso desde la Catedral',2025,'Hermandad de San Pablo','Paso de palio de Nuestra Señora del Rosario Doloroso','Acuerdo para los Lunes Santos de 2025, 2026 y 2027. La Puebla acompaña al palio desde la Catedral hasta San Ignacio de Loyola; la ida corresponde a la Banda de las Nieves de Olivares.'),
  ('san-benito','paso-de-palio-de-nuestra-senora-de-la-encarnacion-coronada','Martes Santo','Tras el paso de palio',2001,'Hermandad de San Benito','Paso de palio de Nuestra Señora de la Encarnación Coronada','Vinculación ininterrumpida desde 2001. En 2026 la Banda Municipal de La Puebla del Río alcanza su vigésimo sexto Martes Santo tras Nuestra Señora de la Encarnación Coronada.'),
  ('hermandad-esperanza-de-huelva','paso-palio-esperanza-coronada-huelva','Miércoles Santo','Tras el paso de palio',2025,'Hermandad de la Esperanza de Huelva','Paso de palio de Nuestra Señora de la Esperanza Coronada','La relación comenzó para el Miércoles Santo de 2025 y fue prorrogada en 2025 por cuatro años, manteniéndose vigente en 2026.'),
  ('vera-cruz-alcala-del-rio',null,'Jueves Santo','Tras el Cristo en el cortejo de ida y tras la Virgen en el regreso',2016,'Hermandad de la Vera-Cruz de Alcalá del Río','Santísimo Cristo de la Vera-Cruz · María Santísima de las Angustias Coronada','La relación vigente comenzó en el Jueves Santo de 2016. En 2026 La Puebla acompaña al Cristo en el tradicional cortejo de la tarde y a la Virgen de las Angustias Coronada en el regreso nocturno desde la Parroquia a la Capilla de San Gregorio.'),
  ('hermandad-del-cachorro','paso-cristo-expiracion-cachorro','Viernes Santo','Tras el paso del Cristo',2024,'Hermandad del Cachorro','Paso del Santísimo Cristo de la Expiración','Tras el precedente del Santo Entierro Grande de 2023, la Banda Municipal de La Puebla del Río pasó a acompañar regularmente al Santísimo Cristo de la Expiración en su estación de penitencia del Viernes Santo desde 2024; la relación continúa vigente en 2026.');

update public.music_accompaniment_periods map
set
  step_entity_id=s.id,
  position=d.position,
  outing_type=d.outing_type,
  year_from=d.year_from,
  year_to=null,
  date_to=null,
  date_to_text=null,
  is_current=true,
  notes=d.notes,
  status='published',
  public_brotherhood_name=d.public_brotherhood_name,
  public_step_name=d.public_step_name,
  public_brotherhood_slug=d.brotherhood_slug,
  updated_at=now()
from _hc_puebla_accomp_desired d
join public.entities b on b.slug=d.brotherhood_slug and b.entity_type='brotherhood'
left join public.entities s on s.slug=d.step_slug and s.entity_type='step'
where map.band_entity_id=(select id from public.entities where entity_type='band' and slug='banda-municipal-de-musica-de-la-puebla-del-rio')
  and map.brotherhood_entity_id=b.id
  and map.is_current
  and map.status<>'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,year_from,is_current,notes,status,public_brotherhood_name,public_step_name,public_brotherhood_slug
)
select b.id,band.id,s.id,d.position,d.outing_type,d.year_from,true,d.notes,'published',d.public_brotherhood_name,d.public_step_name,d.brotherhood_slug
from _hc_puebla_accomp_desired d
join public.entities b on b.slug=d.brotherhood_slug and b.entity_type='brotherhood'
join public.entities band on band.slug='banda-municipal-de-musica-de-la-puebla-del-rio' and band.entity_type='band'
left join public.entities s on s.slug=d.step_slug and s.entity_type='step'
where not exists (
  select 1 from public.music_accompaniment_periods map
  where map.band_entity_id=band.id and map.brotherhood_entity_id=b.id and map.is_current and map.status<>'archived'
);

create temporary table _hc_puebla_accomp_sources (
  brotherhood_slug text not null,
  name text not null,
  url text not null,
  source_type text not null,
  author_or_publisher text,
  publication_date date,
  scope text not null
) on commit drop;

insert into _hc_puebla_accomp_sources values
  ('hermandad-de-pino-montano','Pino Montano · acompañamiento musical 2026','https://www.artesacro.org/Noticia.asp?idreg=165819','Prensa cofrade','Arte Sacro','2026-01-18','Vigencia del acompañamiento musical en el Viernes de Dolores de 2026'),
  ('hermandad-de-pino-montano','La Puebla regresa a Pino Montano','https://bandadelapuebladelrio.com/la-bm-la-puebla-ofrece-un-concierto-de-cuaresma-en-la-hermandad-de-pino-montano','Web oficial','Banda Municipal de Música de La Puebla del Río','2024-03-08','Inicio de la actual vinculación en 2024 y antecedente de 1995'),
  ('agrupacion-cristo-desamparados-santo-angel','Renovación con el Cristo de los Desamparados para 2026','https://bandadelapuebladelrio.com/renovacion-contractual-con-la-agrupacion-parroquial-del-cristo-de-los-desamparados-del-santo-angel','Web oficial','Banda Municipal de Música de La Puebla del Río','2025-10-16','Vigencia del acompañamiento musical en el Sábado de Pasión de 2026'),
  ('agrupacion-cristo-desamparados-santo-angel','Primer acompañamiento al Cristo de los Desamparados','https://bandadelapuebladelrio.com/la-bm-la-puebla-acompanara-al-cristo-de-los-desamparados-del-santo-angel-el-sabado-de-pasion','Web oficial','Banda Municipal de Música de La Puebla del Río','2024-03-11','Inicio de la vinculación procesional en 2024'),
  ('hermandad-de-la-paz','La Paz · renovación con La Puebla para 2026','https://www.gentedepaz.es/la-banda-municipal-de-musica-de-la-puebla-del-rio-renueva-su-compromiso-con-la-hermandad-de-la-paz-para-2026/','Prensa cofrade','Gente de Paz','2025-09-10','Vigencia del acompañamiento musical en el Domingo de Ramos de 2026'),
  ('hermandad-de-la-paz','La Puebla acompañará a María Santísima de la Paz','https://www.hermandaddelapaz.org/20240716-la-banda-municipal-de-musica-de-la-puebla-del-rio-acompanara-a-maria-santisima-de-la-paz/','Web oficial','Hermandad de la Paz','2024-07-16','Inicio de la vinculación para el Domingo de Ramos de 2025'),
  ('hermandad-de-san-pablo','Acuerdo con San Pablo para tres Lunes Santos','https://bandadelapuebladelrio.com/acuerdo-con-la-hermandad-de-san-pablo-de-sevilla-para-el-lunes-santo-de-los-proximos-tres-anos','Web oficial','Banda Municipal de Música de La Puebla del Río','2024-07-29','Vinculación 2025–2027 y tramo de regreso desde la Catedral'),
  ('hermandad-esperanza-de-huelva','Esperanza de Huelva · renovación por cuatro años','https://www.gentedepaz.es/la-banda-puebla-renueva-su-compromiso-con-la-hermandad-de-la-esperanza-de-huelva-por-cuatro-anos/','Prensa cofrade','Gente de Paz','2025-09-22','Vigencia del acompañamiento musical en el Miércoles Santo de 2026'),
  ('hermandad-esperanza-de-huelva','Acuerdo con la Hermandad de la Esperanza de Huelva','https://bandadelapuebladelrio.com/acuerdo-con-la-hermandad-de-la-esperanza-de-huelva','Web oficial','Banda Municipal de Música de La Puebla del Río','2024-04-25','Inicio de la vinculación para el Miércoles Santo de 2025'),
  ('vera-cruz-alcala-del-rio','Vera-Cruz de Alcalá del Río · programa y música del Jueves Santo 2026','https://www.vera-cruz.org/blog/eventos-1/programa-y-horarios-jueves-santo-2026-55','Web oficial','Hermandad de la Vera-Cruz de Alcalá del Río','2026-03-28','Distribución musical de La Puebla entre el Cristo y la Virgen en 2026'),
  ('vera-cruz-alcala-del-rio','La Puebla y la Vera-Cruz de Alcalá del Río','https://bandadelapuebladelrio.com/la-bm-la-puebla-tocara-en-la-veracruz-de-alcala-del-rio-los-proximos-tres-anos','Web oficial','Banda Municipal de Música de La Puebla del Río','2017-07-05','Antigüedad de la relación actual, iniciada tras la Semana Santa de 2015'),
  ('hermandad-del-cachorro','El Cachorro · conciertos de Cuaresma 2026','https://hermandaddelcachorro.org/2026/02/18/conciertos-de-cuaresma-2026/','Web oficial','Hermandad del Cachorro','2026-02-18','Continuidad de La Puebla como banda del Viernes Santo de 2026'),
  ('hermandad-del-cachorro','La Puebla acompañará al Cristo de la Expiración el Viernes Santo','https://bandadelapuebladelrio.com/la-bm-la-puebla-acompanara-al-cristo-de-la-expiracion-de-la-hermandad-del-cachorro-el-viernes-santo','Web oficial','Banda Municipal de Música de La Puebla del Río','2023-05-20','Acuerdo que da inicio al acompañamiento regular del Viernes Santo desde 2024');

insert into public.sources (name,url,source_type,author_or_publisher,publication_date,accessed_at)
select distinct d.name,d.url,d.source_type,d.author_or_publisher,d.publication_date,'2026-08-19'::date
from _hc_puebla_accomp_sources d
where not exists (select 1 from public.sources s where s.url=d.url);

insert into public.source_links (source_id,music_accompaniment_period_id,scope)
select src.id,map.id,d.scope
from _hc_puebla_accomp_sources d
join public.entities b on b.slug=d.brotherhood_slug and b.entity_type='brotherhood'
join public.entities band on band.slug='banda-municipal-de-musica-de-la-puebla-del-rio' and band.entity_type='band'
join public.music_accompaniment_periods map on map.band_entity_id=band.id and map.brotherhood_entity_id=b.id and map.is_current and map.status='published'
join lateral (
  select s.id from public.sources s where s.url=d.url order by s.created_at,s.id limit 1
) src on true
where not exists (
  select 1 from public.source_links sl where sl.source_id=src.id and sl.music_accompaniment_period_id=map.id
);
