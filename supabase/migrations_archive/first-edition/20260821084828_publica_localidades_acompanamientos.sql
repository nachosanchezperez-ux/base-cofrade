-- Hilo Cofrade · expone la localidad mínima de los acompañamientos publicados.
--
-- Las hermandades pueden seguir en borrador aunque el contrato musical ya sea
-- público. Estas columnas conservan únicamente nombre, slug y provincia para
-- que la ficha de la banda pueda mostrar el ámbito sin publicar la ficha
-- incompleta de la hermandad ni relajar sus políticas RLS.

alter table public.music_accompaniment_periods
  add column if not exists public_municipality_name text,
  add column if not exists public_municipality_slug text,
  add column if not exists public_province text;

comment on column public.music_accompaniment_periods.public_municipality_name is
  'Nombre público del municipio para acompañamientos visibles aunque la hermandad siga en borrador.';

comment on column public.music_accompaniment_periods.public_municipality_slug is
  'Slug público del municipio para agrupación y navegación.';

comment on column public.music_accompaniment_periods.public_province is
  'Provincia pública del municipio del acompañamiento.';

create or replace function public.sync_music_accompaniment_public_location()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  location_name text;
  location_slug text;
  location_province text;
begin
  if new.brotherhood_entity_id is null then
    return new;
  end if;

  select municipality.name, municipality.slug, municipality.province
    into location_name, location_slug, location_province
  from public.brotherhoods brotherhood
  join public.municipalities municipality
    on municipality.id = brotherhood.municipality_id
  where brotherhood.entity_id = new.brotherhood_entity_id;

  if found then
    new.public_municipality_name := location_name;
    new.public_municipality_slug := location_slug;
    new.public_province := location_province;
  end if;

  return new;
end
$function$;

revoke all on function public.sync_music_accompaniment_public_location() from public;

drop trigger if exists sync_music_accompaniment_public_location
  on public.music_accompaniment_periods;

create trigger sync_music_accompaniment_public_location
before insert or update of brotherhood_entity_id
on public.music_accompaniment_periods
for each row
execute function public.sync_music_accompaniment_public_location();

update public.music_accompaniment_periods period
set
  public_municipality_name = municipality.name,
  public_municipality_slug = municipality.slug,
  public_province = municipality.province
from public.brotherhoods brotherhood
join public.municipalities municipality
  on municipality.id = brotherhood.municipality_id
where brotherhood.entity_id = period.brotherhood_entity_id
  and (
    period.public_municipality_name is distinct from municipality.name
    or period.public_municipality_slug is distinct from municipality.slug
    or period.public_province is distinct from municipality.province
  );

do $validation$
declare
  documented_contracts integer;
begin
  select count(*)
    into documented_contracts
  from public.music_accompaniment_periods period
  join public.entities band on band.id = period.band_entity_id
  where band.entity_type = 'band'
    and band.slug = 'banda-de-musica-del-maestro-tejera'
    and period.status = 'published'
    and period.is_current
    and period.outing_type in (
      'Procesión de gloria',
      'Procesión eucarística',
      'Procesión extraordinaria'
    )
    and period.public_municipality_name is not null
    and period.public_municipality_slug is not null
    and period.public_province is not null;

  if documented_contracts <> 16 then
    raise exception 'Se esperaban 16 contratos de Glorias de Maestro Tejera con localidad y se han encontrado %', documented_contracts;
  end if;
end
$validation$;

notify pgrst, 'reload schema';
