-- Hilo Cofrade · Normaliza los nombres públicos de los hábitos de Las Cigarreras
--
-- Mantiene el mismo sistema de presentación empleado por el resto de hermandades:
-- títulos breves y simétricos, sin introducir estilos ni escalados específicos.

update public.brotherhood_habits habit
set
  name = case habit.name
    when 'Hábito nazareno' then 'Hábito de nazareno con capa'
    when 'Manigueteros y penitentes (sin capa)' then 'Hábito de nazareno sin capa'
    else habit.name
  end,
  updated_at = now()
from public.entities brotherhood
where brotherhood.id = habit.brotherhood_entity_id
  and brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-de-las-cigarreras'
  and habit.name in ('Hábito nazareno', 'Manigueteros y penitentes (sin capa)');

do $$
begin
  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'hermandad-de-las-cigarreras'
      and habit.name = 'Hábito de nazareno con capa'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo normalizar el hábito con capa de Las Cigarreras';
  end if;

  if not exists (
    select 1
    from public.brotherhood_habits habit
    join public.entities brotherhood
      on brotherhood.id = habit.brotherhood_entity_id
    where brotherhood.entity_type = 'brotherhood'
      and brotherhood.slug = 'hermandad-de-las-cigarreras'
      and habit.name = 'Hábito de nazareno sin capa'
      and habit.status = 'published'
  ) then
    raise exception 'No se pudo normalizar el hábito sin capa de Las Cigarreras';
  end if;
end
$$;
