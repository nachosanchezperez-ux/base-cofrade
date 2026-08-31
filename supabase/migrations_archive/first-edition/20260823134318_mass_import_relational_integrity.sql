-- Hilo Cofrade · Auditoría y guardas de integridad para cargas relacionales
-- Consolida duplicados detectados, normaliza Fuentes y evita recrear los mismos patrones.

-- 1) Normaliza enlaces legacy que guardaban el id relacional dentro de scope.
insert into public.source_links(id, source_id, image_authorship_id, scope, notes)
select gen_random_uuid(), sl.source_id, split_part(sl.scope, ':', 3)::uuid, 'image_authorship', sl.notes
from public.source_links sl
where sl.scope ~ '^relation:image_authorship:[0-9a-fA-F-]{36}$'
  and exists (select 1 from public.image_authorships ia where ia.id = split_part(sl.scope, ':', 3)::uuid)
  and not exists (
    select 1 from public.source_links x
    where x.source_id = sl.source_id
      and x.image_authorship_id = split_part(sl.scope, ':', 3)::uuid
  );

delete from public.source_links sl
where sl.scope ~ '^relation:image_authorship:[0-9a-fA-F-]{36}$'
  and exists (
    select 1 from public.source_links x
    where x.id <> sl.id
      and x.source_id = sl.source_id
      and x.image_authorship_id = split_part(sl.scope, ':', 3)::uuid
  );

insert into public.source_links(id, source_id, brotherhood_image_id, scope, notes)
select gen_random_uuid(), sl.source_id, split_part(sl.scope, ':', 3)::uuid, 'brotherhood_image', sl.notes
from public.source_links sl
where sl.scope ~ '^relation:brotherhood_image:[0-9a-fA-F-]{36}$'
  and exists (select 1 from public.brotherhood_images bi where bi.id = split_part(sl.scope, ':', 3)::uuid)
  and not exists (
    select 1 from public.source_links x
    where x.source_id = sl.source_id
      and x.brotherhood_image_id = split_part(sl.scope, ':', 3)::uuid
  );

delete from public.source_links sl
where sl.scope ~ '^relation:brotherhood_image:[0-9a-fA-F-]{36}$'
  and exists (
    select 1 from public.source_links x
    where x.id <> sl.id
      and x.source_id = sl.source_id
      and x.brotherhood_image_id = split_part(sl.scope, ':', 3)::uuid
  );

-- 2) Completa la trazabilidad de Bendición y Esperanza con fuentes ya existentes en el lote.
insert into public.source_links(id, source_id, entity_id, scope, notes)
select gen_random_uuid(), s.id, e.id, 'Identidad e historia', 'Fuente oficial ya incorporada por el lote de Viernes de Dolores.'
from public.sources s
join public.entities e on e.slug = 'bendicion-y-esperanza'
where s.url = 'https://bendicionyesperanza.es/?page_id=78'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.entity_id=e.id);

insert into public.source_links(id, source_id, entity_id, scope, notes)
select gen_random_uuid(), s.id, e.id, 'Titular y autoría', 'La fuente oficial documenta la bendición y autoría de los titulares.'
from public.sources s
join public.entities e on e.slug in ('jesus-bendicion-santo-encuentro','santa-maria-esperanza-soledad-bendicion')
where s.url = 'https://bendicionyesperanza.es/?page_id=78'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.entity_id=e.id);

insert into public.source_links(id, source_id, brotherhood_image_id, scope, notes)
select gen_random_uuid(), s.id, bi.id, 'Titular de la Hermandad', 'La fuente oficial identifica los titulares de la corporación.'
from public.sources s
join public.entities b on b.slug='bendicion-y-esperanza'
join public.brotherhood_images bi on bi.brotherhood_entity_id=b.id and bi.status='published'
where s.url = 'https://bendicionyesperanza.es/?page_id=78'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.brotherhood_image_id=bi.id);

insert into public.source_links(id, source_id, image_authorship_id, scope, notes)
select gen_random_uuid(), s.id, ia.id, 'Autoría documentada', 'La fuente oficial atribuye las imágenes a Juan Antonio Blanco Ramos.'
from public.sources s
join public.entities i on i.slug in ('jesus-bendicion-santo-encuentro','santa-maria-esperanza-soledad-bendicion')
join public.image_authorships ia on ia.image_entity_id=i.id and ia.status='published'
where s.url = 'https://bendicionyesperanza.es/?page_id=78'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.image_authorship_id=ia.id);

insert into public.source_links(id, source_id, entity_id, scope, notes)
select gen_random_uuid(), s.id, e.id, 'Paso procesional 2026', 'Ficha oficial de la cofradía para el Viernes de Dolores de 2026.'
from public.sources s
join public.entities e on e.slug='paso-misterio-bendicion-esperanza'
where s.url = 'https://bendicionyesperanza.es/?p=3499'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.entity_id=e.id);

insert into public.source_links(id, source_id, brotherhood_step_id, scope, notes)
select gen_random_uuid(), s.id, bs.id, 'Paso procesional 2026', 'Ficha oficial de la cofradía para el Viernes de Dolores de 2026.'
from public.sources s
join public.entities b on b.slug='bendicion-y-esperanza'
join public.entities st on st.slug='paso-misterio-bendicion-esperanza'
join public.brotherhood_steps bs on bs.brotherhood_entity_id=b.id and bs.step_entity_id=st.id and bs.relation_type='processional_step' and bs.status='published'
where s.url = 'https://bendicionyesperanza.es/?p=3499'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.brotherhood_step_id=bs.id);

-- 3) Consolida La Corona y la Escolanía duplicadas conservando los nodos canónicos más ricos.
do $$
declare
  expected integer;
begin
  select count(*) into expected from public.entities where slug in ('cristo-de-la-corona','la-corona');
  if expected <> 2 then raise exception 'Auditoría Hilo: no se puede consolidar La Corona; se esperaban exactamente dos nodos.'; end if;
  select count(*) into expected from public.entities where slug in ('escolania-salesiana-maria-auxiliadora-sevilla','escolania-maria-auxiliadora-sevilla');
  if expected <> 2 then raise exception 'Auditoría Hilo: no se puede consolidar la Escolanía; se esperaban exactamente dos nodos.'; end if;
end $$;

update public.music_accompaniment_periods m
set brotherhood_entity_id = canonical_brotherhood.id,
    public_brotherhood_name = canonical_brotherhood.name,
    public_brotherhood_slug = canonical_brotherhood.slug,
    updated_at = now()
from public.entities canonical_brotherhood,
     public.entities legacy_brotherhood,
     public.entities canonical_band,
     public.entities step_entity
where canonical_brotherhood.slug='cristo-de-la-corona'
  and legacy_brotherhood.slug='la-corona'
  and canonical_band.slug='escolania-salesiana-maria-auxiliadora-sevilla'
  and step_entity.slug='paso-santisimo-cristo-corona-sevilla'
  and m.brotherhood_entity_id=legacy_brotherhood.id
  and m.band_entity_id=canonical_band.id
  and m.step_entity_id=step_entity.id
  and m.is_current=true
  and m.status='published';

with canonical_period as (
  select m.id
  from public.music_accompaniment_periods m
  join public.entities b on b.id=m.brotherhood_entity_id and b.slug='cristo-de-la-corona'
  join public.entities band on band.id=m.band_entity_id and band.slug='escolania-salesiana-maria-auxiliadora-sevilla'
  join public.entities st on st.id=m.step_entity_id and st.slug='paso-santisimo-cristo-corona-sevilla'
  where m.is_current=true and m.status='published'
  order by m.created_at
  limit 1
), duplicate_period as (
  select m.id
  from public.music_accompaniment_periods m
  join public.entities b on b.id=m.brotherhood_entity_id and b.slug='cristo-de-la-corona'
  join public.entities band on band.id=m.band_entity_id and band.slug='escolania-maria-auxiliadora-sevilla'
  join public.entities st on st.id=m.step_entity_id and st.slug='paso-santisimo-cristo-corona-sevilla'
  where m.is_current=true and m.status='published'
  limit 1
)
insert into public.source_links(id, source_id, music_accompaniment_period_id, scope, notes)
select gen_random_uuid(), sl.source_id, cp.id, coalesce(sl.scope,'Acompañamiento musical 2026'), sl.notes
from public.source_links sl
cross join canonical_period cp
join duplicate_period dp on dp.id=sl.music_accompaniment_period_id
where not exists (
  select 1 from public.source_links x
  where x.source_id=sl.source_id and x.music_accompaniment_period_id=cp.id
);

delete from public.music_accompaniment_periods m
using public.entities band, public.entities b, public.entities st
where band.slug='escolania-maria-auxiliadora-sevilla'
  and b.slug='cristo-de-la-corona'
  and st.slug='paso-santisimo-cristo-corona-sevilla'
  and m.band_entity_id=band.id
  and m.brotherhood_entity_id=b.id
  and m.step_entity_id=st.id
  and m.is_current=true;

delete from public.brotherhood_steps bs
using public.entities b, public.entities st
where b.slug='la-corona'
  and st.slug='paso-santisimo-cristo-corona-sevilla'
  and bs.brotherhood_entity_id=b.id
  and bs.step_entity_id=st.id
  and bs.relation_type='processional_step';

delete from public.brotherhoods bh
using public.entities e
where e.slug='la-corona' and bh.entity_id=e.id;

delete from public.entities where slug='la-corona' and entity_type='brotherhood';

delete from public.bands b
using public.entities e
where e.slug='escolania-maria-auxiliadora-sevilla' and b.entity_id=e.id;

delete from public.entities where slug='escolania-maria-auxiliadora-sevilla' and entity_type='band';

-- Fuente institucional directa para el nodo canónico de La Corona.
insert into public.source_links(id, source_id, entity_id, scope, notes)
select gen_random_uuid(), s.id, e.id, 'Actividad procesional 2026', 'Fuente institucional de la Catedral de Sevilla.'
from public.sources s
join public.entities e on e.slug='cristo-de-la-corona'
where s.url='https://www.catedraldesevilla.es/hoy-viernes-de-dolores-el-arzobispo-de-sevilla-presidira-la-procesion-del-cristo-de-la-corona/'
  and not exists (select 1 from public.source_links x where x.source_id=s.id and x.entity_id=e.id);

-- 4) Guarda genérica: un paso procesional vigente no puede pertenecer simultáneamente a dos Hermandades.
create unique index if not exists brotherhood_steps_one_current_processional_owner_idx
on public.brotherhood_steps(step_entity_id)
where relation_type='processional_step' and status <> 'archived' and date_to is null;

-- 5) Una formación no puede recrearse si su identidad coincide con el nombre/alias vigente de otra del mismo municipio.
create or replace function public.guard_band_identity_collision()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  candidate_name text;
  collision_name text;
begin
  select e.name into candidate_name
  from public.entities e
  where e.id=new.entity_id and e.entity_type='band';

  if candidate_name is null then return new; end if;

  select e.name into collision_name
  from public.bands b
  join public.entities e on e.id=b.entity_id
  where b.entity_id <> new.entity_id
    and b.municipality_id is not distinct from new.municipality_id
    and (
      regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g')
      or exists (
        select 1 from public.band_names bn
        where bn.band_entity_id=b.entity_id
          and bn.is_current=true
          and (
            regexp_replace(lower(trim(bn.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g')
            or (coalesce(trim(bn.short_name),'') <> '' and regexp_replace(lower(trim(bn.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g'))
          )
      )
    )
  limit 1;

  if collision_name is not null then
    raise exception using errcode='23505', message=format('La formación «%s» coincide con una formación o denominación vigente ya existente en el mismo municipio: «%s». Reutiliza la entidad canónica.', candidate_name, collision_name);
  end if;
  return new;
end $$;

drop trigger if exists bands_guard_identity_collision on public.bands;
create trigger bands_guard_identity_collision
before insert or update of entity_id, municipality_id on public.bands
for each row execute function public.guard_band_identity_collision();

create or replace function public.guard_band_name_alias_collision()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  candidate_municipality uuid;
  collision_name text;
  candidate_name text;
  candidate_short text;
begin
  if coalesce(new.is_current,false)=false then return new; end if;
  select b.municipality_id into candidate_municipality from public.bands b where b.entity_id=new.band_entity_id;
  candidate_name := nullif(trim(new.name),'');
  candidate_short := nullif(trim(new.short_name),'');

  select e.name into collision_name
  from public.bands b
  join public.entities e on e.id=b.entity_id
  where b.entity_id <> new.band_entity_id
    and b.municipality_id is not distinct from candidate_municipality
    and (
      (candidate_name is not null and regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g'))
      or (candidate_short is not null and regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g'))
      or exists (
        select 1 from public.band_names other
        where other.band_entity_id=b.entity_id and other.is_current=true
          and (
            (candidate_name is not null and (regexp_replace(lower(trim(other.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g') or (coalesce(trim(other.short_name),'')<>'' and regexp_replace(lower(trim(other.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g'))))
            or (candidate_short is not null and (regexp_replace(lower(trim(other.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g') or (coalesce(trim(other.short_name),'')<>'' and regexp_replace(lower(trim(other.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g'))))
          )
      )
    )
  limit 1;

  if collision_name is not null then
    raise exception using errcode='23505', message=format('La denominación «%s» entra en conflicto con otra formación vigente del mismo municipio: «%s».', coalesce(candidate_name,candidate_short), collision_name);
  end if;
  return new;
end $$;

drop trigger if exists band_names_guard_alias_collision on public.band_names;
create trigger band_names_guard_alias_collision
before insert or update of band_entity_id, name, short_name, is_current on public.band_names
for each row execute function public.guard_band_name_alias_collision();

-- Comprobaciones finales.
do $$
declare n integer;
begin
  select count(*) into n from public.entities where slug='la-corona';
  if n <> 0 then raise exception 'Auditoría Hilo: la entidad legacy La Corona no quedó consolidada.'; end if;
  select count(*) into n from public.entities where slug='escolania-maria-auxiliadora-sevilla';
  if n <> 0 then raise exception 'Auditoría Hilo: la Escolanía duplicada no quedó consolidada.'; end if;
  select count(*) into n from (
    select bs.step_entity_id
    from public.brotherhood_steps bs
    where bs.relation_type='processional_step' and bs.status<>'archived' and bs.date_to is null
    group by bs.step_entity_id having count(*)>1
  ) duplicated_steps;
  if n > 0 then raise exception 'Auditoría Hilo: persiste un paso con más de una Hermandad vigente.'; end if;
end $$;
