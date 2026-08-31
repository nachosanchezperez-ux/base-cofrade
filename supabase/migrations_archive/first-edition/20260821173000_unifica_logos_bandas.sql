-- La transparencia pertenece al recurso gráfico; el contenedor visual pertenece a la interfaz.
-- Estos dos registros seguían apuntando a los raster originales y dependían de CSS por slug
-- para sustituirlos en la vista. Dejamos el recurso transparente como logo activo del dato.

update public.bands as b
set logo_path = case e.slug
  when 'banda-municipal-de-musica-de-la-puebla-del-rio' then '/bandas/la-puebla/imagotipo-transparent.webp'
  when 'banda-de-musica-del-maestro-tejera' then '/bandas/maestro-tejera/logotipo-transparent.webp'
  else b.logo_path
end
from public.entities as e
where e.id = b.entity_id
  and e.entity_type = 'band'
  and e.slug in (
    'banda-municipal-de-musica-de-la-puebla-del-rio',
    'banda-de-musica-del-maestro-tejera'
  );
