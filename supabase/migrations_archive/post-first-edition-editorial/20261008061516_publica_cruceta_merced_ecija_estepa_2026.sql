-- Hilo Cofrade · Cruceta de Nuestra Señora de la Merced · Écija · 26 de septiembre de 2026.
-- Repertorio interpretado por la Banda de Música de Estepa.
-- Solo DML editorial: 22 obras y 22 interpretaciones, sin multiplicidades inferidas.

begin;

do $preflight$
begin
  if (
    select count(*) from public.entities
    where entity_type = 'brotherhood' and slug = 'hermandad-piedad-merced-ecija' and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad de la Piedad y la Merced de Écija no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'band' and slug = 'banda-musica-estepa' and status = 'published'
  ) <> 1 then
    raise exception 'La Banda de Música de Estepa no es unívoca';
  end if;

  if (
    select count(*) from public.municipalities where slug = 'ecija'
  ) <> 1 then
    raise exception 'El municipio de Écija no es unívoco';
  end if;

  if (
    select count(*) from public.places where slug = 'iglesia-conventual-merced-ecija'
  ) <> 1 then
    raise exception 'La Iglesia Conventual de la Merced de Écija no es unívoca';
  end if;
end
$preflight$;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select
  'Repertorio interpretado · Nuestra Señora de la Merced de Écija 2026',
  null,
  'social_media',
  'Banda de Música de Estepa',
  null,
  date '2026-10-08',
  'Carrusel de tres láminas publicado por la banda tras la procesión. Documenta 22 obras y 22 interpretaciones.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Nuestra Señora de la Merced de Écija 2026'
    and author_or_publisher = 'Banda de Música de Estepa'
);

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select
  'ArteSacro · Procesión de Nuestra Señora de la Merced de Écija 2026',
  'https://www.artesacro.org/Noticia/Ver/168874/provincia-cultos-externos-hoy-provincia',
  'news',
  'ArteSacro',
  null,
  date '2026-10-08',
  'Documenta la procesión de Nuestra Señora de la Merced en Écija el 26 de septiembre de 2026.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/168874/provincia-cultos-externos-hoy-provincia'
);

insert into public.entities (entity_type, name, slug, summary, status)
select
  'image',
  'Nuestra Señora de la Merced',
  'nuestra-senora-merced-ecija',
  'Titular gloriosa de la Iglesia Conventual de la Merced de Écija, vinculada a la Hermandad de la Piedad.',
  'published'
where not exists (
  select 1 from public.entities
  where entity_type = 'image' and slug = 'nuestra-senora-merced-ecija'
);

update public.entities
set name = 'Nuestra Señora de la Merced',
    summary = 'Titular gloriosa de la Iglesia Conventual de la Merced de Écija, vinculada a la Hermandad de la Piedad.',
    status = 'published',
    updated_at = now()
where entity_type = 'image' and slug = 'nuestra-senora-merced-ecija';

insert into public.images (entity_id, image_type, description, notes)
select id, 'Gloria',
       'Imagen de Nuestra Señora de la Merced que preside su procesión anual por Écija.',
       'Datos artísticos pendientes de revisión documental.'
from public.entities
where entity_type = 'image' and slug = 'nuestra-senora-merced-ecija'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  description = excluded.description,
  notes = coalesce(public.images.notes, excluded.notes);

insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status
)
select brotherhood.id, image.id, 'titular', 'Vigente en 2026',
       'Titular gloriosa que procesiona en torno a la festividad de Nuestra Señora de la Merced.',
       'published'
from public.entities brotherhood
join public.entities image on image.entity_type = 'image' and image.slug = 'nuestra-senora-merced-ecija'
where brotherhood.entity_type = 'brotherhood' and brotherhood.slug = 'hermandad-piedad-merced-ecija'
  and not exists (
    select 1 from public.brotherhood_images existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.image_entity_id = image.id
      and existing.relation_type = 'titular'
      and existing.status <> 'archived'
  );

insert into public.entities (entity_type, name, slug, summary, status)
select
  'step',
  'Paso procesional de Nuestra Señora de la Merced',
  'paso-procesional-nuestra-senora-merced-ecija',
  'Paso de Gloria de Nuestra Señora de la Merced de Écija.',
  'published'
where not exists (
  select 1 from public.entities
  where entity_type = 'step' and slug = 'paso-procesional-nuestra-senora-merced-ecija'
);

insert into public.steps (entity_id, step_type, description, current_state_notes)
select id, 'Paso procesional de Gloria',
       'Paso que porta a Nuestra Señora de la Merced en su procesión anual por Écija.',
       'Documentado en la salida celebrada el 26 de septiembre de 2026.'
from public.entities
where entity_type = 'step' and slug = 'paso-procesional-nuestra-senora-merced-ecija'
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select brotherhood.id, step.id, 'processional_step', 'Vigente en 2026',
       'Paso de la procesión anual de Nuestra Señora de la Merced.', 'published'
from public.entities brotherhood
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-procesional-nuestra-senora-merced-ecija'
where brotherhood.entity_type = 'brotherhood' and brotherhood.slug = 'hermandad-piedad-merced-ecija'
  and not exists (
    select 1 from public.brotherhood_steps existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processional_step'
      and existing.status <> 'archived'
  );

insert into public.image_steps (
  image_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select image.id, step.id, 'processes_on', 'Vigente en 2026',
       'Nuestra Señora de la Merced preside este paso en su procesión anual.', 'published'
from public.entities image
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-procesional-nuestra-senora-merced-ecija'
where image.entity_type = 'image' and image.slug = 'nuestra-senora-merced-ecija'
  and not exists (
    select 1 from public.image_steps existing
    where existing.image_entity_id = image.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processes_on'
      and existing.status <> 'archived'
  );

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, municipality_id, origin_place_id, destination_place_id,
  reason, description, event_status, status, public_notes, organizer_name,
  slug, origin_text, destination_text
)
select
  brotherhood.id,
  'Procesión de Gloria',
  'ordinary',
  'Procesión de Nuestra Señora de la Merced · 2026',
  date '2026-09-26',
  2026,
  time '21:30',
  municipality.id,
  place.id,
  place.id,
  'Procesión anual en torno a la festividad de Nuestra Señora de la Merced.',
  'Procesión de Gloria de Nuestra Señora de la Merced por las calles de Écija.',
  'held',
  'published',
  'Procesión celebrada el 26 de septiembre de 2026. Acompañamiento musical: Banda de Música de Estepa.',
  'Hermandad de la Piedad y la Merced de Écija',
  'ecija-nuestra-senora-merced-2026-09-26',
  'Iglesia Conventual de la Merced',
  'Iglesia Conventual de la Merced'
from public.entities brotherhood
join public.municipalities municipality on municipality.slug = 'ecija'
join public.places place on place.slug = 'iglesia-conventual-merced-ecija'
where brotherhood.entity_type = 'brotherhood' and brotherhood.slug = 'hermandad-piedad-merced-ecija'
  and not exists (
    select 1 from public.outings where slug = 'ecija-nuestra-senora-merced-2026-09-26'
  );

update public.outings outing
set outing_type = 'Procesión de Gloria',
    character = 'ordinary',
    title = 'Procesión de Nuestra Señora de la Merced · 2026',
    outing_date = date '2026-09-26',
    year = 2026,
    departure_time = time '21:30',
    event_status = 'held',
    status = 'published',
    public_notes = 'Procesión celebrada el 26 de septiembre de 2026. Acompañamiento musical: Banda de Música de Estepa.',
    updated_at = now()
where outing.slug = 'ecija-nuestra-senora-merced-2026-09-26';

insert into public.outing_entities (outing_id, entity_id, role, notes)
select outing.id, image.id, 'processional_image',
       'Nuestra Señora de la Merced preside la procesión de Gloria.'
from public.outings outing
join public.entities image on image.entity_type = 'image' and image.slug = 'nuestra-senora-merced-ecija'
where outing.slug = 'ecija-nuestra-senora-merced-2026-09-26'
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

delete from public.outing_music_positions
where outing_id = (
  select id from public.outings where slug = 'ecija-nuestra-senora-merced-2026-09-26'
);

insert into public.outing_music_positions (
  outing_id, position_code, position_label, sequence_no, step_entity_id, notes, status
)
select outing.id, 'behind_glory', 'Tras Nuestra Señora de la Merced', 1, step.id,
       'Acompañamiento musical realizado en la procesión de Gloria de 2026.', 'published'
from public.outings outing
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-procesional-nuestra-senora-merced-ecija'
where outing.slug = 'ecija-nuestra-senora-merced-2026-09-26';

insert into public.outing_music_assignments (
  music_position_id, band_entity_id, participation_mode, sequence_no, notes, status
)
select position.id, band.id, 'full_route', 1,
       'Banda de Música de Estepa tras Nuestra Señora de la Merced.', 'published'
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-musica-estepa'
where outing.slug = 'ecija-nuestra-senora-merced-2026-09-26'
  and position.position_code = 'behind_glory';

update public.bands band
set primary_color = '#050505',
    secondary_color = '#C6A24A',
    logo_background_color = '#FFFFFF'
from public.entities entity
where entity.id = band.entity_id
  and entity.entity_type = 'band'
  and entity.slug = 'banda-musica-estepa';

insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, image.id, 'Imagen procesional', 'Documenta a Nuestra Señora de la Merced de Écija.'
from public.sources source
join public.entities image on image.entity_type = 'image' and image.slug = 'nuestra-senora-merced-ecija'
where source.name = 'Repertorio interpretado · Nuestra Señora de la Merced de Écija 2026'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id and existing.entity_id = image.id
  );

insert into public.source_links (source_id, outing_id, scope, notes)
select source.id, outing.id, 'Procesión de Gloria', 'Documenta la fecha y celebración de la procesión.'
from public.sources source
join public.outings outing on outing.slug = 'ecija-nuestra-senora-merced-2026-09-26'
where source.url = 'https://www.artesacro.org/Noticia/Ver/168874/provincia-cultos-externos-hoy-provincia'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id and existing.outing_id = outing.id
  );

with refs as (
  select source.id source_id, assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug = 'ecija-nuestra-senora-merced-2026-09-26'
  join public.outing_music_positions position on position.outing_id = outing.id and position.position_code = 'behind_glory'
  join public.outing_music_assignments assignment on assignment.music_position_id = position.id
  where source.name = 'Repertorio interpretado · Nuestra Señora de la Merced de Écija 2026'
)
insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select source_id, assignment_id, 'Acompañamiento musical',
       'La publicación de la banda documenta su participación y el repertorio interpretado.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id
    and existing.outing_music_assignment_id = refs.assignment_id
);

with seed(slug, title, notes) as (values
  (
    'piedad-ecija-merced-estepa-2026',
    'La Piedad · 26 de septiembre de 2026 · Banda de Música de Estepa',
    'Repertorio interpretado tras Nuestra Señora de la Merced: 22 obras y 22 interpretaciones. La fuente no declara multiplicidades.'
  )
)
insert into public.musical_repertoires (
  slug, outing_id, band_entity_id, step_entity_id, source_id, title,
  repertoire_kind, notes, primary_color, accent_color, status
)
select seed.slug, outing.id, band.id, step.id, source.id, seed.title,
       'performed', seed.notes, '#050505', '#C6A24A', 'published'
from seed
join public.outings outing on outing.slug = 'ecija-nuestra-senora-merced-2026-09-26'
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-musica-estepa'
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-procesional-nuestra-senora-merced-ecija'
join public.sources source on source.name = 'Repertorio interpretado · Nuestra Señora de la Merced de Écija 2026'
on conflict (slug) do update set
  outing_id = excluded.outing_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  source_id = excluded.source_id,
  title = excluded.title,
  repertoire_kind = excluded.repertoire_kind,
  notes = excluded.notes,
  primary_color = excluded.primary_color,
  accent_color = excluded.accent_color,
  status = excluded.status,
  updated_at = now();

delete from public.musical_repertoire_entries
where repertoire_id = (
  select id from public.musical_repertoires where slug = 'piedad-ecija-merced-estepa-2026'
);

with seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
  (1, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al cielo la Reina de Triana', 'José Luis Gómez Jaldón', 1, 'La autoría canónica conserva también a Juan de Dios Espinosa Ordóñez.'),
  (2, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez', 1, null::text),
  (3, 'marcha-el-dia-del-senor', 'El Día del Señor', 'Alfonso López Cortés', 1, null),
  (4, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'José Albero Francés', 1, null),
  (5, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Pablo Ojeda Jiménez', 1, null),
  (6, 'la-mision-de-la-esperanza-ruben-jordan', 'La Misión de la Esperanza', 'Rubén Jordán Flores', 1, null),
  (7, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez', 1, 'Se vincula a la obra de Abel Moreno, no a sus homónimas.'),
  (8, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Pablo Ojeda Jiménez', 1, null),
  (9, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, null),
  (10, 'reina-de-triana-jose-miguel-lopez', 'Reina de Triana', 'José Miguel López Rueda', 1, null),
  (11, 'marcha-reina', '¡Reina!', 'José Miguel López Rueda', 1, null),
  (12, 'rocio-manuel-ruiz-vidriet', 'Rocío', 'Manuel Ruiz Vidriet', 1, null),
  (13, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez Sánchez', 1, null),
  (14, 'salud-de-triana-jose-miguel-lopez', 'Salud de Triana', 'José Miguel López Rueda', 1, null),
  (15, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'Pedro Morales Muñoz', 1, null),
  (16, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'J. J. Espinosa', 1, null),
  (17, 'siempre-macarena-jose-leon-alapont', 'Siempre Macarena', 'José León Alapont', 1, null),
  (18, 'tras-tu-verde-manto-rafael-wals', 'Tras tu verde manto', 'Rafael Wals Dantas', 1, null),
  (19, 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda', 'Tú eres el orgullo de nuestro pueblo', 'Pablo Ojeda Jiménez', 1, 'Se reutiliza la ficha canónica más antigua y relacionada.'),
  (20, 'marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos', 'Pedro Morales Muñoz', 1, null),
  (21, 'y-amanecio-en-tu-albayzin-elias-santiago', 'Y amaneció en tu Albayzín', 'Elías Santiago Vico', 1, null),
  (22, 'himno-nacional-espana', 'Himno Nacional', 'Bartolomé Pérez Casas y Francisco Grau Vegara', 1, null)
)
insert into public.musical_repertoire_entries (
  repertoire_id, march_entity_id, display_title, source_credit,
  performance_count, display_order, notes
)
select repertoire.id, march.id, seed.display_title, seed.source_credit,
       seed.performance_count, seed.display_order, seed.notes
from seed
join public.musical_repertoires repertoire on repertoire.slug = 'piedad-ecija-merced-estepa-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

do $postflight$
declare
  v_repertoire_id uuid;
begin
  select id into v_repertoire_id
  from public.musical_repertoires
  where slug = 'piedad-ecija-merced-estepa-2026';

  if v_repertoire_id is null then
    raise exception 'La cruceta de la Merced de Écija no se ha creado';
  end if;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 22 then
    raise exception 'La cruceta de la Merced de Écija debe contener 22 obras';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 22 then
    raise exception 'La cruceta de la Merced de Écija debe sumar 22 interpretaciones';
  end if;

  if exists (
    select 1 from public.musical_repertoire_entries
    where repertoire_id = v_repertoire_id and performance_count <> 1
  ) then
    raise exception 'La fuente no declara multiplicidades';
  end if;

  if (
    select count(*)
    from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id
      and march.slug = 'macarena-abel-moreno'
  ) <> 1 then
    raise exception 'Macarena debe vincularse a la obra de Abel Moreno';
  end if;

  if (
    select count(*)
    from public.musical_repertoires repertoire
    join public.outings outing on outing.id = repertoire.outing_id
    join public.entities band on band.id = repertoire.band_entity_id
    join public.entities step on step.id = repertoire.step_entity_id
    where repertoire.id = v_repertoire_id
      and outing.outing_date = date '2026-09-26'
      and outing.event_status = 'held'
      and band.slug = 'banda-musica-estepa'
      and step.slug = 'paso-procesional-nuestra-senora-merced-ecija'
      and repertoire.primary_color = '#050505'
      and repertoire.accent_color = '#C6A24A'
  ) <> 1 then
    raise exception 'La relación procesión-banda-paso-paleta no es íntegra';
  end if;

  if exists (
    select 1
    from public.musical_repertoire_entries entry
    left join public.march_authors author
      on author.march_entity_id = entry.march_entity_id and author.status = 'published'
    where entry.repertoire_id = v_repertoire_id
    group by entry.id
    having count(author.id) = 0
  ) then
    raise exception 'Todas las obras deben conservar al menos una autoría publicada';
  end if;
end
$postflight$;

commit;
