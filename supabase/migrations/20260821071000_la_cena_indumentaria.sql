-- Hilo Cofrade · Indumentaria nazarena de La Cena
--
-- Vincula la ficha ya publicada con la ilustración WebP optimizada.

update public.brotherhood_habits habit
set
  image_path = '/hermandades/la-cena/tunicas/habito-nazareno.webp',
  image_alt = 'Hábito de nazareno de la Hermandad de la Sagrada Cena de Sevilla, con túnica, capirote y antifaz blancos, cinturón ancho de esparto y sandalias',
  updated_at = now()
from public.entities brotherhood
where brotherhood.id = habit.brotherhood_entity_id
  and brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'la-cena'
  and habit.name = 'Túnica de nazareno'
  and (
    habit.image_path is distinct from '/hermandades/la-cena/tunicas/habito-nazareno.webp'
    or habit.image_alt is distinct from 'Hábito de nazareno de la Hermandad de la Sagrada Cena de Sevilla, con túnica, capirote y antifaz blancos, cinturón ancho de esparto y sandalias'
  );

do $$
begin
  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'la-cena'
      and habit.name = 'Túnica de nazareno'
      and habit.image_path = '/hermandades/la-cena/tunicas/habito-nazareno.webp'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo publicar la indumentaria nazarena de La Cena';
  end if;
end
$$;
