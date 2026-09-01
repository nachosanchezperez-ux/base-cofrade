-- Completa la dirección pública de la Sede canónica del Baratillo.
-- Solo DML sobre Lugares y Fuentes existentes; no introduce DDL ni RLS.

update public.places
set
  address = 'Calle Adriano, 13',
  updated_at = now()
where slug = 'capilla-de-la-piedad-sevilla'
  and address is distinct from 'Calle Adriano, 13';

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  'Hermandad del Baratillo · localización oficial de la Capilla de la Piedad',
  'https://www.facebook.com/hdadbaratillo/',
  'Red social oficial',
  'Hermandad del Baratillo',
  date '2026-09-01',
  'La página oficial sitúa la Capilla de la Piedad en Calle Adriano, 13; se distingue de la Casa Hermandad, ubicada en el número 15.'
where not exists (
  select 1
  from public.sources
  where url = 'https://www.facebook.com/hdadbaratillo/'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  entity.id,
  'Sede canónica · dirección',
  'Dirección de la Capilla de la Piedad comprobada el 1 de septiembre de 2026.'
from public.sources source
join public.entities entity on entity.slug = 'el-baratillo'
where source.url = 'https://www.facebook.com/hdadbaratillo/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = entity.id
      and existing.scope = 'Sede canónica · dirección'
  );

do $$
begin
  if not exists (
    select 1
    from public.places
    where slug = 'capilla-de-la-piedad-sevilla'
      and address = 'Calle Adriano, 13'
  ) then
    raise exception 'La Sede canónica del Baratillo no conserva la dirección esperada';
  end if;
end $$;
