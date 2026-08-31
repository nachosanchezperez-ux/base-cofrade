-- Hilo Cofrade · patrimonio estructurado y tipología musical reutilizable
-- 2026-08-24

-- 1. Denominaciones alternativas genéricas para cualquier entidad.
create table if not exists public.entity_names (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  name_type text not null default 'alternative',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default true,
  notes text,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  constraint entity_names_name_type_check check (name_type in ('official','popular','alternative','historical','liturgical','short')),
  constraint entity_names_status_check check (status in ('draft','review','published','archived')),
  constraint entity_names_unique unique (entity_id, name, name_type)
);

create index if not exists entity_names_entity_idx on public.entity_names(entity_id, status);
alter table public.entity_names enable row level security;

drop policy if exists "Published entity names" on public.entity_names;
create policy "Published entity names" on public.entity_names
  for select to public
  using (
    status = 'published'
    and exists (
      select 1 from public.entities e
      where e.id = entity_names.entity_id and e.status = 'published'
    )
  );

drop policy if exists "Panel members can read entity names" on public.entity_names;
create policy "Panel members can read entity names" on public.entity_names
  for select to authenticated using ((select public.is_panel_member()));

drop policy if exists "Editors can create entity names" on public.entity_names;
create policy "Editors can create entity names" on public.entity_names
  for insert to authenticated
  with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));

drop policy if exists "Editors can update entity names" on public.entity_names;
create policy "Editors can update entity names" on public.entity_names
  for update to authenticated
  using ((select public.can_edit_panel()))
  with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));

drop policy if exists "Admins can delete entity names" on public.entity_names;
create policy "Admins can delete entity names" on public.entity_names
  for delete to authenticated using ((select public.can_admin_panel()));

-- 2. El uso es una propiedad patrimonial general, no específica del Simpecado.
alter table public.heritage_assets
  add column if not exists usage_text text;

-- 3. Separar naturaleza de la obra de su estilo/formación musical.
alter table public.marches
  add column if not exists work_type text;

update public.marches
set work_type = case
  when coalesce(music_type, '') ilike 'Adaptación%' then 'Adaptación'
  when coalesce(music_type, '') ilike 'Copla%' then 'Copla'
  when coalesce(music_type, '') ilike 'Himno%' then 'Himno'
  else 'Marcha procesional'
end
where work_type is null;

alter table public.marches
  alter column work_type set default 'Marcha procesional',
  alter column work_type set not null;

alter table public.marches drop constraint if exists marches_work_type_check;
alter table public.marches
  add constraint marches_work_type_check
  check (work_type in ('Marcha procesional','Himno','Copla','Adaptación'));

create index if not exists marches_work_type_year_idx
  on public.marches(work_type, composition_year, entity_id);

-- 4. Fuentes documentales usadas en este primer caso real.
insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'ArteSacro · Autoría del Simpecado blanco de la Pastora de Cantillana',
       'https://www.artesacro.org/Noticia/Ver/157515/provincia-confirman-que-simpecado-blanco-divina-pastora-cantillana-es-obra',
       'web', 'ArteSacro', '2024-09-16'::date, current_date,
       'Documenta encargo en 1805, estreno en 1806, autoría de Antonia Bazo Davied, materiales, técnica y uso en los Rosarios de hermanas.'
where not exists (select 1 from public.sources where url='https://www.artesacro.org/Noticia/Ver/157515/provincia-confirman-que-simpecado-blanco-divina-pastora-cantillana-es-obra');

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'Diario de Sevilla · Pastora de Cantillana 2024: cultos y Simpecados',
       'https://www.diariodesevilla.es/semana_santa/pastora-cantillana-2024-salida-procesional_0_2002348003.html',
       'press', 'Diario de Sevilla', '2024-09-06'::date, current_date,
       'Documenta los cinco Simpecados, sus usos y el Simpecado azul del III Centenario con bajorrelieve de Darío Fernández.'
where not exists (select 1 from public.sources where url='https://www.diariodesevilla.es/semana_santa/pastora-cantillana-2024-salida-procesional_0_2002348003.html');

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'Yo soy Pastoreño · El Simpecado Verde',
       'https://yosoypastoreno.blogspot.com/2013/05/las-insignias-de-la-hermandad-de-la.html',
       'web', 'Yo soy Pastoreño', '2013-05-12'::date, current_date,
       'Documenta el Simpecado Verde de 1966 y las restauraciones del Simpecado Grana en 1990 y 2001.'
where not exists (select 1 from public.sources where url='https://yosoypastoreno.blogspot.com/2013/05/las-insignias-de-la-hermandad-de-la.html');

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'Yo soy Pastoreño · Marchas dedicadas a la Divina Pastora',
       'https://yosoypastoreno.blogspot.com/2012/03/marchas-dedicadas-la-divina-pastora.html',
       'web', 'Yo soy Pastoreño', '2012-03-08'::date, current_date,
       'Relación histórica de composiciones dedicadas a la Divina Pastora de Cantillana. Las fechas ausentes no se infieren.'
where not exists (select 1 from public.sources where url='https://yosoypastoreno.blogspot.com/2012/03/marchas-dedicadas-la-divina-pastora.html');

insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
select 'Las Cigarreras · Divina Pastora de Cantillana',
       'https://www.youtube.com/watch?v=a88PPy43tOw',
       'video', 'Banda de Las Cigarreras', current_date,
       'Fuente oficial de la formación: acredita autoría de Pedro Manuel Pacheco Palomo, composición para Las Cigarreras y presencia en el disco de 1996. No fija de forma inequívoca el año de composición.'
where not exists (select 1 from public.sources where url='https://www.youtube.com/watch?v=a88PPy43tOw');

-- 5. Cinco Simpecados como heritage_asset independientes y reutilizables.
with brotherhood as (
  select id from public.entities where slug='pastora-de-cantillana' and entity_type='brotherhood'
), seed(name, slug, summary, date_text, description, technique, materials, usage_text, historical_context, origin_notes, display_order, notes) as (
  values
  ('Simpecado Primitivo de la Divina Pastora de Cantillana','simpecado-primitivo-pastora-cantillana','Simpecado fundacional vinculado al origen rosariano de la Hermandad.','Primer tercio del siglo XVIII','La insignia histórica del Rosario de la Divina Pastora se conserva actualmente en una vitrina en el coro parroquial. La pintura fundacional fue intercambiada en época posterior con la que hoy preside el Simpecado Grana.','Pintura y labores textiles históricas','Textil bordado y pintura sobre soporte oval','Testimonio fundacional del Rosario; pieza de conservación y veneración en la parroquia.','La Hermandad nació en 1720 como Rosario de mujeres impulsado por Fray Isidoro de Sevilla.','La datación se conserva como periodo documental y no se fuerza a un año exacto.',1,'Fecha exacta y autoría material completas pendientes de fuente primaria. No presentar un año cerrado.'),
  ('Simpecado Blanco de Gala de la Divina Pastora de Cantillana','simpecado-blanco-gala-pastora-cantillana','Simpecado de gala encargado en 1805 y estrenado en 1806, obra documentada de Antonia Bazo Davied.','Encargado en 1805 · estrenado en 1806','Insignia de gala ofrecida en acción de gracias por la protección atribuida a la Divina Pastora durante la epidemia de fiebre amarilla de 1800.','Bordado en relieve: cetillo, hojilla, cartulina, mostacillas, espejuelos y lentejuelas','Lama de plata, hilo de plata sobredorada, flocadura de oro y pintura al óleo','Preside el Santo Rosario de hermanas en la víspera del 8 de septiembre y en el último día de la Novena.','El encargo corresponde a 1805; la insignia se estrenó en 1806 y aparece en inventario de 1807.','La manda testamentaria de Antonia Bazo de 1809 confirma documentalmente la deuda pendiente por el bordado.',2,'No reducir la cronología a un único año: 1805 es encargo, 1806 estreno y 1809 confirmación documental de autoría.'),
  ('Simpecado Grana de la Divina Pastora de Cantillana','simpecado-grana-rojo-pastora-cantillana','Simpecado histórico grana o rojo que porta la pintura fundacional de la Divina Pastora.','Siglo XIX','Simpecado grana que contiene actualmente la pintura fundacional procedente del primitivo. Tras su recuperación y restauración volvió a adquirir un papel central en la Romería.','Bordado histórico pasado a nuevo soporte en 1990','Terciopelo grana y bordados; pintura fundacional en el óvalo central','Es el Simpecado que peregrina anualmente en la Romería al Santuario de Los Pajares.','La pieza fue recuperada para un uso más frecuente tras la intervención de 1990; la pintura central fue restaurada en 2001.','Regresó a la Romería con motivo del cincuentenario en 2001 y volvió a utilizarse de forma anual posteriormente.',3,'Datación decimonónica sin año exacto cerrado en las fuentes consultadas.'),
  ('Simpecado Verde de la Divina Pastora de Cantillana','simpecado-verde-peregrino-pastora-cantillana','Simpecado romero estrenado en 1966 y posteriormente convertido en insignia peregrina y representativa.','1966','Donado y confeccionado por José González Villarreal y Dolores Gata Baños para representar a la Virgen en la Romería y proteger de la intemperie a los Simpecados históricos.','Bordado en oro de inspiración neobarroca; tondo central repujado y cincelado','Terciopelo verde oscuro, bordados de oro y plata repujada y sobredorada','Durante décadas peregrinó en la carreta hasta la Ermita; después ha servido especialmente en peregrinaciones, encuentros y representaciones fuera de Cantillana.','Estrenado y bendecido en la víspera de la Romería de 1966.','El tondo central de plata es obra del taller de orfebrería Villarreal.',4,'La denominación “Peregrino” se conserva como denominación funcional/alternativa, no como nombre oficial documentado.'),
  ('Simpecado Azul del III Centenario de la Divina Pastora de Cantillana','simpecado-azul-iii-centenario-pastora-cantillana','Simpecado conmemorativo del III Centenario fundacional de la Hermandad.','2020','La insignia más reciente de la serie de Simpecados pastoreños, realizada para conmemorar los tres siglos de la fundación de 1720.','Bajorrelieve escultórico en el óvalo central','Textil azul y bajorrelieve oval de la Divina Pastora','Insignia conmemorativa y representativa vinculada al III Centenario fundacional.','Conmemora el tercer centenario de la fundación de la Hermandad, celebrado en 2020.','El óvalo central contiene un bajorrelieve de la Divina Pastora tallado por Darío Fernández.',5,'La fecha 2020 se refiere a la efeméride y estreno conmemorativo documentado.')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'heritage_asset', s.name, s.slug, s.summary, 'published'
from seed s
where exists (select 1 from brotherhood)
  and not exists (select 1 from public.entities e where e.slug=s.slug);

with brotherhood as (
  select id from public.entities where slug='pastora-de-cantillana' and entity_type='brotherhood'
), seed(slug, date_text, description, technique, materials, usage_text, historical_context, origin_notes, display_order, notes) as (
  values
  ('simpecado-primitivo-pastora-cantillana','Primer tercio del siglo XVIII','La insignia histórica del Rosario de la Divina Pastora se conserva actualmente en una vitrina en el coro parroquial. La pintura fundacional fue intercambiada en época posterior con la que hoy preside el Simpecado Grana.','Pintura y labores textiles históricas','Textil bordado y pintura sobre soporte oval','Testimonio fundacional del Rosario; pieza de conservación y veneración en la parroquia.','La Hermandad nació en 1720 como Rosario de mujeres impulsado por Fray Isidoro de Sevilla.','La datación se conserva como periodo documental y no se fuerza a un año exacto.',1,'Fecha exacta y autoría material completas pendientes de fuente primaria. No presentar un año cerrado.'),
  ('simpecado-blanco-gala-pastora-cantillana','Encargado en 1805 · estrenado en 1806','Insignia de gala ofrecida en acción de gracias por la protección atribuida a la Divina Pastora durante la epidemia de fiebre amarilla de 1800.','Bordado en relieve: cetillo, hojilla, cartulina, mostacillas, espejuelos y lentejuelas','Lama de plata, hilo de plata sobredorada, flocadura de oro y pintura al óleo','Preside el Santo Rosario de hermanas en la víspera del 8 de septiembre y en el último día de la Novena.','El encargo corresponde a 1805; la insignia se estrenó en 1806 y aparece en inventario de 1807.','La manda testamentaria de Antonia Bazo de 1809 confirma documentalmente la deuda pendiente por el bordado.',2,'No reducir la cronología a un único año: 1805 es encargo, 1806 estreno y 1809 confirmación documental de autoría.'),
  ('simpecado-grana-rojo-pastora-cantillana','Siglo XIX','Simpecado grana que contiene actualmente la pintura fundacional procedente del primitivo. Tras su recuperación y restauración volvió a adquirir un papel central en la Romería.','Bordado histórico pasado a nuevo soporte en 1990','Terciopelo grana y bordados; pintura fundacional en el óvalo central','Es el Simpecado que peregrina anualmente en la Romería al Santuario de Los Pajares.','La pieza fue recuperada para un uso más frecuente tras la intervención de 1990; la pintura central fue restaurada en 2001.','Regresó a la Romería con motivo del cincuentenario en 2001 y volvió a utilizarse de forma anual posteriormente.',3,'Datación decimonónica sin año exacto cerrado en las fuentes consultadas.'),
  ('simpecado-verde-peregrino-pastora-cantillana','1966','Donado y confeccionado por José González Villarreal y Dolores Gata Baños para representar a la Virgen en la Romería y proteger de la intemperie a los Simpecados históricos.','Bordado en oro de inspiración neobarroca; tondo central repujado y cincelado','Terciopelo verde oscuro, bordados de oro y plata repujada y sobredorada','Durante décadas peregrinó en la carreta hasta la Ermita; después ha servido especialmente en peregrinaciones, encuentros y representaciones fuera de Cantillana.','Estrenado y bendecido en la víspera de la Romería de 1966.','El tondo central de plata es obra del taller de orfebrería Villarreal.',4,'La denominación “Peregrino” se conserva como denominación funcional/alternativa, no como nombre oficial documentado.'),
  ('simpecado-azul-iii-centenario-pastora-cantillana','2020','La insignia más reciente de la serie de Simpecados pastoreños, realizada para conmemorar los tres siglos de la fundación de 1720.','Bajorrelieve escultórico en el óvalo central','Textil azul y bajorrelieve oval de la Divina Pastora','Insignia conmemorativa y representativa vinculada al III Centenario fundacional.','Conmemora el tercer centenario de la fundación de la Hermandad, celebrado en 2020.','El óvalo central contiene un bajorrelieve de la Divina Pastora tallado por Darío Fernández.',5,'La fecha 2020 se refiere a la efeméride y estreno conmemorativo documentado.')
)
insert into public.heritage_assets (entity_id,parent_entity_id,asset_type,date_from_text,description,technique,materials,usage_text,historical_context,origin_notes,display_order,is_current,is_featured,notes)
select e.id,b.id,'Simpecado',s.date_text,s.description,s.technique,s.materials,s.usage_text,s.historical_context,s.origin_notes,s.display_order,true,true,s.notes
from seed s join public.entities e on e.slug=s.slug cross join brotherhood b
where not exists (select 1 from public.heritage_assets h where h.entity_id=e.id);

-- Denominaciones alternativas de los cinco Simpecados.
with aliases(slug, alias) as (
  values
  ('simpecado-primitivo-pastora-cantillana','Simpecado Fundacional'),
  ('simpecado-primitivo-pastora-cantillana','Simpecado Primitivo'),
  ('simpecado-primitivo-pastora-cantillana','Simpecado del Rosario'),
  ('simpecado-blanco-gala-pastora-cantillana','Simpecado Blanco'),
  ('simpecado-blanco-gala-pastora-cantillana','Simpecado de Gala'),
  ('simpecado-grana-rojo-pastora-cantillana','Simpecado Grana'),
  ('simpecado-grana-rojo-pastora-cantillana','Simpecado Rojo'),
  ('simpecado-verde-peregrino-pastora-cantillana','Simpecado Verde'),
  ('simpecado-verde-peregrino-pastora-cantillana','Simpecado Peregrino'),
  ('simpecado-verde-peregrino-pastora-cantillana','Simpecado Romero'),
  ('simpecado-azul-iii-centenario-pastora-cantillana','Simpecado Azul'),
  ('simpecado-azul-iii-centenario-pastora-cantillana','Simpecado del III Centenario'),
  ('simpecado-azul-iii-centenario-pastora-cantillana','Simpecado del Tercer Centenario')
)
insert into public.entity_names(entity_id,name,name_type,status)
select e.id,a.alias,'alternative','published'
from aliases a join public.entities e on e.slug=a.slug
on conflict (entity_id,name,name_type) do nothing;

-- Agentes documentados de los Simpecados.
with people(name,slug) as (
  values
  ('Antonia Bazo Davied','antonia-bazo-davied'),
  ('José González Villarreal','jose-gonzalez-villarreal'),
  ('Dolores Gata Baños','dolores-gata-banos'),
  ('Darío Fernández Parra','dario-fernandez-parra'),
  ('José Benito Molero López','jose-benito-molero-lopez'),
  ('Jesús Carlos Calero García','jesus-carlos-calero-garcia'),
  ('José Antonio Calero García','jose-antonio-calero-garcia'),
  ('Francisco Arquillo de la Torre','francisco-arquillo-de-la-torre')
)
insert into public.entities(entity_type,name,slug,status)
select 'agent',p.name,p.slug,'published' from people p
where not exists (select 1 from public.entities e where e.slug=p.slug);

insert into public.agents(entity_id,agent_kind)
select e.id,'person' from public.entities e
where e.slug in ('antonia-bazo-davied','jose-gonzalez-villarreal','dolores-gata-banos','dario-fernandez-parra','jose-benito-molero-lopez','jesus-carlos-calero-garcia','jose-antonio-calero-garcia','francisco-arquillo-de-la-torre')
  and not exists (select 1 from public.agents a where a.entity_id=e.id);

with contributions(asset_slug, agent_slug, discipline, intervention_type, phase, date_text, description) as (
  values
  ('simpecado-blanco-gala-pastora-cantillana','antonia-bazo-davied','Bordado','Creación','Ejecución','1805–1806','Autoría documentada del bordado; encargado en 1805 y estrenado en 1806.'),
  ('simpecado-verde-peregrino-pastora-cantillana','jose-gonzalez-villarreal','Bordado y diseño','Creación','Confección','1966','Donación y confección del Simpecado Verde junto a Dolores Gata Baños.'),
  ('simpecado-verde-peregrino-pastora-cantillana','dolores-gata-banos','Bordado y diseño','Creación','Confección','1966','Donación y confección del Simpecado Verde junto a José González Villarreal.'),
  ('simpecado-azul-iii-centenario-pastora-cantillana','dario-fernandez-parra','Escultura','Creación','Bajorrelieve central','2020','Autor del bajorrelieve oval de la Divina Pastora.'),
  ('simpecado-grana-rojo-pastora-cantillana','jose-benito-molero-lopez','Bordado','Restauración','Pasado a nuevo terciopelo','1990','Restauración y pasado del bordado histórico a nuevo terciopelo.'),
  ('simpecado-grana-rojo-pastora-cantillana','jesus-carlos-calero-garcia','Bordado','Restauración','Colaboración en el pasado','1990','Colaboración en la restauración y pasado del Simpecado Grana.'),
  ('simpecado-grana-rojo-pastora-cantillana','jose-antonio-calero-garcia','Bordado','Restauración','Colaboración en el pasado','1990','Colaboración en la restauración y pasado del Simpecado Grana.'),
  ('simpecado-grana-rojo-pastora-cantillana','francisco-arquillo-de-la-torre','Restauración pictórica','Restauración','Pintura fundacional','2001','Restauración de la pintura primitiva de la Divina Pastora que preside el Simpecado Grana.')
)
insert into public.heritage_interventions(target_entity_id,agent_entity_id,discipline,intervention_type,phase,date_from_text,description,status)
select asset.id,agent.id,c.discipline,c.intervention_type,c.phase,c.date_text,c.description,'published'
from contributions c
join public.entities asset on asset.slug=c.asset_slug
join public.entities agent on agent.slug=c.agent_slug
where not exists (
  select 1 from public.heritage_interventions hi
  where hi.target_entity_id=asset.id and hi.agent_entity_id=agent.id
    and coalesce(hi.intervention_type,'')=c.intervention_type and coalesce(hi.date_from_text,'')=c.date_text
);

-- Fuentes de los Simpecados y de sus intervenciones.
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,'Patrimonio · Simpecado','Fuente documental del registro estructurado.'
from public.entities e
join public.heritage_assets h on h.entity_id=e.id and h.asset_type='Simpecado'
join public.sources s on s.url = case
  when e.slug='simpecado-blanco-gala-pastora-cantillana' then 'https://www.artesacro.org/Noticia/Ver/157515/provincia-confirman-que-simpecado-blanco-divina-pastora-cantillana-es-obra'
  when e.slug in ('simpecado-grana-rojo-pastora-cantillana','simpecado-verde-peregrino-pastora-cantillana') then 'https://yosoypastoreno.blogspot.com/2013/05/las-insignias-de-la-hermandad-de-la.html'
  else 'https://www.diariodesevilla.es/semana_santa/pastora-cantillana-2024-salida-procesional_0_2002348003.html'
end
where h.parent_entity_id=(select id from public.entities where slug='pastora-de-cantillana')
  and not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id and sl.scope='Patrimonio · Simpecado');

insert into public.source_links(source_id,intervention_id,scope,notes)
select s.id,hi.id,'Patrimonio · intervención','Fuente de la creación o restauración documentada.'
from public.heritage_interventions hi
join public.entities e on e.id=hi.target_entity_id
join public.sources s on s.url = case
  when e.slug='simpecado-blanco-gala-pastora-cantillana' then 'https://www.artesacro.org/Noticia/Ver/157515/provincia-confirman-que-simpecado-blanco-divina-pastora-cantillana-es-obra'
  when e.slug='simpecado-azul-iii-centenario-pastora-cantillana' then 'https://www.diariodesevilla.es/semana_santa/pastora-cantillana-2024-salida-procesional_0_2002348003.html'
  else 'https://yosoypastoreno.blogspot.com/2013/05/las-insignias-de-la-hermandad-de-la.html'
end
where e.slug in ('simpecado-blanco-gala-pastora-cantillana','simpecado-grana-rojo-pastora-cantillana','simpecado-verde-peregrino-pastora-cantillana','simpecado-azul-iii-centenario-pastora-cantillana')
  and not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.intervention_id=hi.id);

-- El Azul conmemora de forma relacional la fundación de 1720.
insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select blue.id,'commemorates',foundation.id,'2020','El Simpecado Azul fue creado como insignia conmemorativa del III Centenario fundacional.','published'
from public.entities blue, public.entities foundation
where blue.slug='simpecado-azul-iii-centenario-pastora-cantillana'
  and foundation.slug='fundacion-hermandad-divina-pastora-cantillana-1720'
  and not exists (
    select 1 from public.entity_relations r
    where r.source_entity_id=blue.id and r.target_entity_id=foundation.id and r.relation_type='commemorates'
  );

-- 6. Compositores/autores necesarios para el patrimonio musical Pastoreño.
with people(name,slug) as (
  values
  ('Manuel Ramos Rincón','manuel-ramos-rincon'),
  ('Salvador Hidalgo Dorado','salvador-hidalgo-dorado'),
  ('Juan de Dios Espinosa','juan-de-dios-espinosa'),
  ('José Félix García Domínguez','jose-felix-garcia-dominguez'),
  ('Joaquín Ruiz González','joaquin-ruiz-gonzalez'),
  ('J. Arriaga','j-arriaga'),
  ('Torralva','torralva'),
  ('Fray Sebastián de Villaviciosa','fray-sebastian-de-villaviciosa')
)
insert into public.entities(entity_type,name,slug,status)
select 'agent',p.name,p.slug,'published' from people p
where not exists (select 1 from public.entities e where e.slug=p.slug);

insert into public.agents(entity_id,agent_kind)
select e.id,'person' from public.entities e
where e.slug in ('manuel-ramos-rincon','salvador-hidalgo-dorado','juan-de-dios-espinosa','jose-felix-garcia-dominguez','joaquin-ruiz-gonzalez','j-arriaga','torralva','fray-sebastian-de-villaviciosa')
  and not exists (select 1 from public.agents a where a.entity_id=e.id);

-- 7. Obras musicales independientes. music_type mantiene estilo/formación; work_type clasifica la naturaleza de la obra.
with works(name,slug,year,date_text,work_type,music_type,description,notes) as (
  values
  ('Pastora de las almas','pastora-de-las-almas-manuel-ramos-rincon',1998,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Pastora de Cantillana','pastora-de-cantillana-pedro-morales',1999,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Repican a gloria','repican-a-gloria-manuel-ramos-rincon',1999,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Pasa la Divina Pastora','pasa-la-divina-pastora',2001,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Pastora, Madre y Reina','pastora-madre-y-reina',2001,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Madre del Buen Pastor','madre-del-buen-pastor-salvador-hidalgo',2002,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Centenario Pastoreño','centenario-pastoreno',2003,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Madre de los Pastoreños','madre-de-los-pastorenos',2007,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Pastora, Reina de Cantillana','pastora-reina-de-cantillana-jose-felix-garcia',2009,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','Existe variante documental del título “Reina de Cantillana”; se conserva este título como forma principal y la variante como denominación alternativa.'),
  ('Salve Pastora','salve-pastora-david-alvarez',2013,null,'Marcha procesional','Cornetas y Tambores','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Reina y Pastora de Cantillana','reina-y-pastora-de-cantillana',2018,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('Divina Pastora de Cantillana','divina-pastora-de-cantillana-pedro-manuel-pacheco',null,'Documentada en grabación de 1996 · fecha de composición por confirmar','Marcha procesional','Cornetas y Tambores','Marcha compuesta por Pedro Manuel Pacheco Palomo para la Banda de Las Cigarreras.','La fuente oficial acredita su inclusión en el álbum “…a Sevilla” de 1996. Ese dato no se presenta como fecha definitiva de composición.'),
  ('Y en Cantillana, Pastora','y-en-cantillana-pastora',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','La fuente consultada no fija año; se mantiene sin fecha cerrada.'),
  ('Dios te Salve, Pastora','dios-te-salve-pastora',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','La fuente consultada no fija año; se mantiene sin fecha cerrada.'),
  ('Reina y Madre de los Pastoreños','reina-y-madre-de-los-pastorenos',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','La fuente consultada no fija año; se mantiene sin fecha cerrada.'),
  ('Hermosa Pastora','hermosa-pastora-copla',null,'Siglo XIX','Copla','Copla','Copla histórica posteriormente adaptada para banda.','La fuente secundaria la atribuye a Torralva y la sitúa en el siglo XIX; no se fuerza un año.'),
  ('Hermosa Pastora · adaptación para banda','hermosa-pastora-adaptacion-banda',null,'Fecha de adaptación por documentar','Adaptación','Banda de Música','Adaptación para banda de la copla histórica “Hermosa Pastora”.','La autoría de la adaptación se documenta a nombre de Juan de Dios Espinosa; el año queda abierto.'),
  ('Gloria a ti','gloria-a-ti-copla',null,'Siglo XIX','Copla','Copla','Copla histórica dedicada a la Divina Pastora.','La fuente secundaria cita a J. Arriaga y la sitúa en el siglo XIX; no se fuerza un año.'),
  ('Gloria a ti · adaptación para banda','gloria-a-ti-adaptacion-banda',2016,null,'Adaptación','Banda de Música','Adaptación para banda de la copla histórica “Gloria a ti”.','La fuente documenta el año 2016 para la adaptación, pero no identifica de forma inequívoca al adaptador en la referencia consultada.'),
  ('Himno de la Divina Pastora de Cantillana','himno-divina-pastora-cantillana',null,'Fecha histórica por documentar','Himno','Himno','Himno pastoreño con texto atribuido a Fray Sebastián de Villaviciosa.','No se fija año ni compositor musical sin fuente inequívoca.'),
  ('Himno de la Divina Pastora de Cantillana · adaptación para banda','himno-divina-pastora-cantillana-adaptacion-banda',null,'Fecha de adaptación por documentar','Adaptación','Banda de Música','Versión instrumentada para banda del Himno pastoreño.','La fuente consultada atribuye la adaptación a Salvador Hidalgo Dorado sin fijar año.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'march',w.name,w.slug,w.description,'published' from works w
where not exists (select 1 from public.entities e where e.slug=w.slug);

with works(slug,year,date_text,work_type,music_type,description,notes) as (
  values
  ('pastora-de-las-almas-manuel-ramos-rincon',1998,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('pastora-de-cantillana-pedro-morales',1999,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('repican-a-gloria-manuel-ramos-rincon',1999,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('pasa-la-divina-pastora',2001,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('pastora-madre-y-reina',2001,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('madre-del-buen-pastor-salvador-hidalgo',2002,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('centenario-pastoreno',2003,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('madre-de-los-pastorenos',2007,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('pastora-reina-de-cantillana-jose-felix-garcia',2009,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','Existe variante documental del título “Reina de Cantillana”.'),
  ('salve-pastora-david-alvarez',2013,null,'Marcha procesional','Cornetas y Tambores','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('reina-y-pastora-de-cantillana',2018,null,'Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.',null),
  ('divina-pastora-de-cantillana-pedro-manuel-pacheco',null,'Documentada en grabación de 1996 · fecha de composición por confirmar','Marcha procesional','Cornetas y Tambores','Marcha compuesta por Pedro Manuel Pacheco Palomo para la Banda de Las Cigarreras.','La grabación oficial de 1996 acredita existencia, no año de composición.'),
  ('y-en-cantillana-pastora',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','No fijar año sin fuente.'),
  ('dios-te-salve-pastora',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','No fijar año sin fuente.'),
  ('reina-y-madre-de-los-pastorenos',null,'Año por documentar','Marcha procesional','Banda de Música','Marcha dedicada a la Divina Pastora de Cantillana.','No fijar año sin fuente.'),
  ('hermosa-pastora-copla',null,'Siglo XIX','Copla','Copla','Copla histórica posteriormente adaptada para banda.','No fijar año sin fuente primaria.'),
  ('hermosa-pastora-adaptacion-banda',null,'Fecha de adaptación por documentar','Adaptación','Banda de Música','Adaptación para banda de la copla histórica “Hermosa Pastora”.','No fijar año.'),
  ('gloria-a-ti-copla',null,'Siglo XIX','Copla','Copla','Copla histórica dedicada a la Divina Pastora.','No fijar año sin fuente primaria.'),
  ('gloria-a-ti-adaptacion-banda',2016,null,'Adaptación','Banda de Música','Adaptación para banda de la copla histórica “Gloria a ti”.','Adaptador pendiente de documentación inequívoca.'),
  ('himno-divina-pastora-cantillana',null,'Fecha histórica por documentar','Himno','Himno','Himno pastoreño con texto atribuido a Fray Sebastián de Villaviciosa.','No fijar año ni compositor musical sin fuente inequívoca.'),
  ('himno-divina-pastora-cantillana-adaptacion-banda',null,'Fecha de adaptación por documentar','Adaptación','Banda de Música','Versión instrumentada para banda del Himno pastoreño.','No fijar año.')
)
insert into public.marches(entity_id,composition_year,composition_date_text,work_type,music_type,description,notes)
select e.id,w.year,w.date_text,w.work_type,w.music_type,w.description,w.notes
from works w join public.entities e on e.slug=w.slug
where not exists (select 1 from public.marches m where m.entity_id=e.id);

-- Variante nominal documentada.
insert into public.entity_names(entity_id,name,name_type,status)
select e.id,'Reina de Cantillana','alternative','published'
from public.entities e where e.slug='pastora-reina-de-cantillana-jose-felix-garcia'
on conflict (entity_id,name,name_type) do nothing;

-- 8. Autorías musicales estructuradas.
with authors(work_slug,agent_slug,role,notes) as (
  values
  ('pastora-de-las-almas-manuel-ramos-rincon','manuel-ramos-rincon','composer',null),
  ('pastora-de-cantillana-pedro-morales','pedro-morales-munoz','composer',null),
  ('repican-a-gloria-manuel-ramos-rincon','manuel-ramos-rincon','composer',null),
  ('pasa-la-divina-pastora','salvador-hidalgo-dorado','composer',null),
  ('pastora-madre-y-reina','salvador-hidalgo-dorado','composer',null),
  ('madre-del-buen-pastor-salvador-hidalgo','salvador-hidalgo-dorado','composer',null),
  ('centenario-pastoreno','salvador-hidalgo-dorado','composer',null),
  ('madre-de-los-pastorenos','juan-de-dios-espinosa','composer',null),
  ('pastora-reina-de-cantillana-jose-felix-garcia','jose-felix-garcia-dominguez','composer',null),
  ('salve-pastora-david-alvarez','david-alvarez-garcia','composer',null),
  ('reina-y-pastora-de-cantillana','cristobal-lopez-gandara','composer',null),
  ('divina-pastora-de-cantillana-pedro-manuel-pacheco','pedro-manuel-pacheco-palomo','composer',null),
  ('y-en-cantillana-pastora','joaquin-ruiz-gonzalez','composer',null),
  ('dios-te-salve-pastora','salvador-hidalgo-dorado','composer',null),
  ('reina-y-madre-de-los-pastorenos','manuel-ramos-rincon','composer',null),
  ('hermosa-pastora-copla','torralva','composer','Autoría recogida por la fuente secundaria; cronología exacta pendiente.'),
  ('hermosa-pastora-adaptacion-banda','juan-de-dios-espinosa','adapter','Adaptación para banda.'),
  ('gloria-a-ti-copla','j-arriaga','composer','Autoría recogida por la fuente secundaria; cronología exacta pendiente.'),
  ('himno-divina-pastora-cantillana','fray-sebastian-de-villaviciosa','lyricist','Autor del texto según la fuente consultada.'),
  ('himno-divina-pastora-cantillana-adaptacion-banda','salvador-hidalgo-dorado','adapter','Adaptación/instrumentación para banda.')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select m.id,a.id,x.role,x.notes,'published'
from authors x join public.entities m on m.slug=x.work_slug join public.entities a on a.slug=x.agent_slug
where not exists (
  select 1 from public.march_authors ma
  where ma.march_entity_id=m.id and ma.agent_entity_id=a.id and ma.author_role=x.role
);

-- 9. Dedicatoria simultánea a Hermandad e Imagen, reutilizable para cualquier entidad.
insert into public.march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,notes,status)
select work.id,target.id,'dedicated_to','Dedicada a la Divina Pastora de Cantillana','Relación canónica de patrimonio musical pastoreño.','published'
from public.entities work
cross join public.entities target
where work.slug in (
  'pastora-de-las-almas-manuel-ramos-rincon','pastora-de-cantillana-pedro-morales','repican-a-gloria-manuel-ramos-rincon','pasa-la-divina-pastora','pastora-madre-y-reina','madre-del-buen-pastor-salvador-hidalgo','centenario-pastoreno','madre-de-los-pastorenos','pastora-reina-de-cantillana-jose-felix-garcia','salve-pastora-david-alvarez','reina-y-pastora-de-cantillana','divina-pastora-de-cantillana-pedro-manuel-pacheco','y-en-cantillana-pastora','dios-te-salve-pastora','reina-y-madre-de-los-pastorenos','hermosa-pastora-copla','hermosa-pastora-adaptacion-banda','gloria-a-ti-copla','gloria-a-ti-adaptacion-banda','himno-divina-pastora-cantillana','himno-divina-pastora-cantillana-adaptacion-banda'
)
  and target.slug in ('pastora-de-cantillana','divina-pastora-de-las-almas-de-cantillana')
  and not exists (
    select 1 from public.march_dedications d
    where d.march_entity_id=work.id and d.dedicatee_entity_id=target.id and d.dedication_type='dedicated_to'
  );

-- 10. Relaciones entre original y adaptación.
with pairs(adaptation_slug,original_slug) as (
  values
  ('hermosa-pastora-adaptacion-banda','hermosa-pastora-copla'),
  ('gloria-a-ti-adaptacion-banda','gloria-a-ti-copla'),
  ('himno-divina-pastora-cantillana-adaptacion-banda','himno-divina-pastora-cantillana')
)
insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,notes,status)
select a.id,'adaptation_of',o.id,'La adaptación conserva relación explícita con la obra de origen.','published'
from pairs p join public.entities a on a.slug=p.adaptation_slug join public.entities o on o.slug=p.original_slug
where not exists (select 1 from public.entity_relations r where r.source_entity_id=a.id and r.target_entity_id=o.id and r.relation_type='adaptation_of');

-- 11. Relaciones con formaciones cuando la fuente permite afirmarlas.
insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,notes,status)
select m.id,'composed_for_band',b.id,'La fuente oficial de Las Cigarreras indica que Pedro Manuel Pacheco compuso esta marcha para la formación.','published'
from public.entities m, public.entities b
where m.slug='divina-pastora-de-cantillana-pedro-manuel-pacheco' and b.slug='las-cigarreras'
  and not exists (select 1 from public.entity_relations r where r.source_entity_id=m.id and r.target_entity_id=b.id and r.relation_type='composed_for_band');

update public.marches m
set premiere_date='2013-09-08', premiere_date_text='8 de septiembre de 2013', premiered_by_band_entity_id=b.id
from public.entities e, public.entities b
where m.entity_id=e.id and e.slug='salve-pastora-david-alvarez' and b.slug='banda-del-sol'
  and m.premiered_by_band_entity_id is null;

-- 12. Fuentes exactas de las obras y relaciones musicales.
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,'Patrimonio musical','Fuente de la relación de obras dedicadas. Las fechas no indicadas se conservan abiertas.'
from public.entities e
join public.marches m on m.entity_id=e.id
join public.sources s on s.url='https://yosoypastoreno.blogspot.com/2012/03/marchas-dedicadas-la-divina-pastora.html'
where e.slug in (
  'pastora-de-las-almas-manuel-ramos-rincon','pastora-de-cantillana-pedro-morales','repican-a-gloria-manuel-ramos-rincon','pasa-la-divina-pastora','pastora-madre-y-reina','madre-del-buen-pastor-salvador-hidalgo','centenario-pastoreno','madre-de-los-pastorenos','pastora-reina-de-cantillana-jose-felix-garcia','salve-pastora-david-alvarez','reina-y-pastora-de-cantillana','divina-pastora-de-cantillana-pedro-manuel-pacheco','y-en-cantillana-pastora','dios-te-salve-pastora','reina-y-madre-de-los-pastorenos','hermosa-pastora-copla','hermosa-pastora-adaptacion-banda','gloria-a-ti-copla','gloria-a-ti-adaptacion-banda','himno-divina-pastora-cantillana','himno-divina-pastora-cantillana-adaptacion-banda'
)
  and not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id and sl.scope='Patrimonio musical');

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,'Patrimonio musical · formación','Fuente oficial de Las Cigarreras; 1996 se conserva como evidencia de existencia/grabación, no como año cerrado de composición.'
from public.entities e join public.sources s on s.url='https://www.youtube.com/watch?v=a88PPy43tOw'
where e.slug='divina-pastora-de-cantillana-pedro-manuel-pacheco'
  and not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id and sl.scope='Patrimonio musical · formación');

-- Fuente sobre la relación con el III Centenario.
insert into public.source_links(source_id,entity_relation_id,scope,notes)
select s.id,r.id,'Patrimonio · acontecimiento','Fuente del carácter conmemorativo del Simpecado Azul.'
from public.entity_relations r
join public.entities e on e.id=r.source_entity_id and e.slug='simpecado-azul-iii-centenario-pastora-cantillana'
join public.sources s on s.url='https://www.diariodesevilla.es/semana_santa/pastora-cantillana-2024-salida-procesional_0_2002348003.html'
where r.relation_type='commemorates'
  and not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_relation_id=r.id);
