-- Hilo Cofrade · Indumentaria nazarena de San Benito
--
-- Publica el hábito documentado por la Hermandad y lo vincula con la
-- ilustración WebP optimizada para la ficha pública.

insert into public.brotherhood_habits (
  brotherhood_entity_id,
  name,
  tunic_description,
  hood_description,
  cord_description,
  buttons_description,
  shield_description,
  footwear_description,
  image_path,
  image_alt,
  sort_order,
  notes,
  status
)
select
  e.id,
  'Hábito de nazareno',
  'Túnica y capa blancas',
  'Antifaz de terciopelo morado',
  'Morado, anudado al lado izquierdo',
  'Forrados de terciopelo morado, separados aproximadamente 3 cm',
  'Bordado a la altura del pecho en el antifaz y en el lado izquierdo de la capa',
  'Zapatos de piel negros con hebillas plateadas y calcetines blancos',
  '/hermandades/san-benito/tunicas/habito-nazareno.webp',
  'Hábito de nazareno de la Hermandad de San Benito, con túnica y capa blancas, antifaz y cíngulo morados',
  1::smallint,
  'Indumentaria reproducida a partir del cartel oficial aportado por la Hermandad de San Benito.',
  'published'
from public.entities e
where e.entity_type = 'brotherhood'
  and e.slug = 'san-benito'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  footwear_description = excluded.footwear_description,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

do $$
begin
  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'san-benito'
      and habit.name = 'Hábito de nazareno'
      and habit.image_path = '/hermandades/san-benito/tunicas/habito-nazareno.webp'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo publicar la indumentaria nazarena de San Benito';
  end if;
end
$$;
