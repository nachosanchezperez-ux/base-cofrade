-- Hilo Cofrade · Ubicación de la Banda de Las Cigarreras
--
-- Completa la sede/local de ensayo con la dirección publicada por la propia
-- banda y vincula la fuente oficial a su ficha.

update public.bands band
set headquarters_text = 'Parque Empresarial Arte Sacro · Calle Ingeniería, 9 · Naves 35–37 · Sevilla'
from public.entities entity
where entity.id = band.entity_id
  and entity.slug = 'las-cigarreras'
  and entity.entity_type = 'band';

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  'Contacto · Las Cigarreras',
  'https://lascigarreras.net/contacto/',
  'Web oficial',
  'Banda de Las Cigarreras',
  current_date,
  'Dirección oficial de la sede y local de ensayo.'
where not exists (
  select 1
  from public.sources
  where url = 'https://lascigarreras.net/contacto/'
);

insert into public.source_links (source_id, entity_id, scope)
select
  source.id,
  entity.id,
  'Sede y local de ensayo'
from public.sources source
join public.entities entity
  on entity.slug = 'las-cigarreras'
 and entity.entity_type = 'band'
where source.url = 'https://lascigarreras.net/contacto/'
  and not exists (
    select 1
    from public.source_links link
    where link.source_id = source.id
      and link.entity_id = entity.id
  );

do $$
declare
  headquarters text;
begin
  select band.headquarters_text
    into headquarters
  from public.bands band
  join public.entities entity on entity.id = band.entity_id
  where entity.slug = 'las-cigarreras'
    and entity.entity_type = 'band';

  if headquarters <> 'Parque Empresarial Arte Sacro · Calle Ingeniería, 9 · Naves 35–37 · Sevilla' then
    raise exception 'No se pudo actualizar la sede de Las Cigarreras';
  end if;
end
$$;
