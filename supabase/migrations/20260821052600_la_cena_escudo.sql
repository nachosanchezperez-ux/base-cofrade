-- Hilo Cofrade · Escudo de la Hermandad de la Cena de Sevilla.
-- La ruta apunta al recurso WebP publicado con la aplicación.

update public.brotherhoods as brotherhood
set crest_path = '/escudos/la-cena.webp'
from public.entities as entity
where brotherhood.entity_id = entity.id
  and entity.slug = 'la-cena'
  and brotherhood.crest_path is distinct from '/escudos/la-cena.webp';
