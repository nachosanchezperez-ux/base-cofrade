-- Hilo Cofrade · Indumentaria nazarena de Las Cigarreras
--
-- Vincula el hábito ya documentado con la ilustración del nazareno con capa
-- y añade la variante sin capa utilizada por manigueteros y penitentes.

update public.brotherhood_habits habit
set
  hood_description = 'Antifaz de raso morado y capa blanca.',
  image_path = '/hermandades/las-cigarreras/tunicas/habito-nazareno-capa.png',
  image_alt = 'Hábito nazareno de la Hermandad de Las Cigarreras, con túnica de raso morado, antifaz morado, capa blanca, cíngulo morado y oro y guantes negros',
  sort_order = 1::smallint,
  updated_at = now()
from public.entities brotherhood
where brotherhood.id = habit.brotherhood_entity_id
  and brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-de-las-cigarreras'
  and habit.name = 'Hábito nazareno';

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
  brotherhood.id,
  'Manigueteros y penitentes (sin capa)',
  'Túnica morada de raso.',
  'Antifaz de raso morado, sin capirote y caído hacia atrás.',
  'Cíngulo de dos trencillas morada y oro entrelazadas, con borlas y flecos en oro.',
  'Botonadura morada.',
  'Escudo corporativo en el pecho; esta variante no lleva emblema de capa.',
  'Calzado negro con hebillas plateadas, guantes y calcetines negros.',
  '/hermandades/las-cigarreras/tunicas/habito-nazareno-sin-capa.png',
  'Variante del hábito nazareno de Las Cigarreras para manigueteros y penitentes, con túnica de raso morado, antifaz caído, sin capa y guantes negros',
  2::smallint,
  'La documentación oficial de la cofradía indica que los manigueteros y penitentes no llevan capa. La ilustración muestra el antifaz caído y conserva únicamente el escudo del pecho.',
  'published'
from public.entities brotherhood
where brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-de-las-cigarreras'
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

insert into public.source_links (
  source_id,
  brotherhood_habit_id,
  scope,
  notes
)
select
  source_link.source_id,
  variant.id,
  'Hábito nazareno · manigueteros y penitentes',
  'La fuente oficial de la cofradía documenta que los manigueteros y penitentes no llevan capa.'
from public.entities brotherhood
join public.brotherhood_habits base_habit
  on base_habit.brotherhood_entity_id = brotherhood.id
 and base_habit.name = 'Hábito nazareno'
join public.source_links source_link
  on source_link.brotherhood_habit_id = base_habit.id
join public.brotherhood_habits variant
  on variant.brotherhood_entity_id = brotherhood.id
 and variant.name = 'Manigueteros y penitentes (sin capa)'
where brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-de-las-cigarreras'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source_link.source_id
      and existing.brotherhood_habit_id = variant.id
  );

do $$
begin
  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'hermandad-de-las-cigarreras'
      and habit.name = 'Hábito nazareno'
      and habit.image_path = '/hermandades/las-cigarreras/tunicas/habito-nazareno-capa.png'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo vincular el hábito nazareno con capa de Las Cigarreras';
  end if;

  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'hermandad-de-las-cigarreras'
      and habit.name = 'Manigueteros y penitentes (sin capa)'
      and habit.image_path = '/hermandades/las-cigarreras/tunicas/habito-nazareno-sin-capa.png'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo publicar la variante sin capa de Las Cigarreras';
  end if;
end
$$;
