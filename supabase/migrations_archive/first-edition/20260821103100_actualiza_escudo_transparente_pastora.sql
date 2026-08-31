-- Sustituye el escudo de la Pastora de Cantillana por la versión PNG
-- con transparencia real, usando una ruta nueva para evitar caché obsoleta.

update public.brotherhoods brotherhood
set crest_path = '/escudos/pastora-de-cantillana-sin-fondo.png'
from public.entities entity
where entity.id = brotherhood.entity_id
  and entity.slug = 'pastora-de-cantillana'
  and brotherhood.crest_path is distinct from '/escudos/pastora-de-cantillana-sin-fondo.png';

do $$
begin
  if not exists (
    select 1
    from public.brotherhoods brotherhood
    join public.entities entity on entity.id = brotherhood.entity_id
    where entity.slug = 'pastora-de-cantillana'
      and brotherhood.crest_path = '/escudos/pastora-de-cantillana-sin-fondo.png'
  ) then
    raise exception 'No se ha asociado el escudo transparente de la Pastora de Cantillana';
  end if;
end
$$;
