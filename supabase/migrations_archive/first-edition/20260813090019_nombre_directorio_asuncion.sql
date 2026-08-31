-- Hilo Cofrade · Nombre identificativo en el directorio de hermandades

update public.entities
set name = 'La Asunción de Cantillana'
where entity_type = 'brotherhood'
  and slug = 'asuncion-de-cantillana';

update public.brotherhoods b
set popular_name = 'La Asunción de Cantillana'
from public.entities e
where e.id = b.entity_id
  and e.entity_type = 'brotherhood'
  and e.slug = 'asuncion-de-cantillana';
