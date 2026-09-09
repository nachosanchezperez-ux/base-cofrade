-- Hilo Cofrade · Normalización editorial del tipo de acontecimiento

begin;

update public.events event
set event_type = 'Traslado al Risco',
    updated_at = now()
from public.entities event_entity
where event_entity.id = event.entity_id
  and event_entity.slug = 'traslado-divina-pastora-risco-cantillana-2026'
  and event_entity.entity_type = 'event';

commit;
