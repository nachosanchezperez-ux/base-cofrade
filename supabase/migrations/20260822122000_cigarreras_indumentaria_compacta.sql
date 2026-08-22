-- Hilo Cofrade · Ajuste editorial de la indumentaria de Las Cigarreras
--
-- Mantiene el mismo componente y patrón visual empleado por el resto de hermandades,
-- reduciendo la longitud de los textos para que las dos variantes se presenten con
-- una densidad comparable y sin introducir estilos específicos por hermandad.

update public.brotherhood_habits h
set
  tunic_description = 'Túnica de raso morado.',
  hood_description = case h.name
    when 'Hábito de nazareno con capa' then 'Antifaz de raso morado y capa blanca.'
    when 'Hábito de nazareno sin capa' then 'Antifaz de raso morado, sin capirote y caído hacia atrás.'
    else h.hood_description
  end,
  cord_description = 'Morado y oro, con borlas doradas.',
  buttons_description = 'Morada.',
  shield_description = case h.name
    when 'Hábito de nazareno con capa' then 'Corporativo en el antifaz; Columna y Azotes en la capa.'
    when 'Hábito de nazareno sin capa' then 'Corporativo en el pecho.'
    else h.shield_description
  end,
  footwear_description = 'Negro con hebillas plateadas; guantes y calcetines negros.',
  updated_at = now()
from public.entities e
where e.id = h.brotherhood_entity_id
  and e.entity_type = 'brotherhood'
  and e.slug = 'hermandad-de-las-cigarreras'
  and h.name in (
    'Hábito de nazareno con capa',
    'Hábito de nazareno sin capa'
  );

do $$
begin
  if (
    select count(*)
    from public.brotherhood_habits h
    join public.entities e on e.id = h.brotherhood_entity_id
    where e.entity_type = 'brotherhood'
      and e.slug = 'hermandad-de-las-cigarreras'
      and h.status = 'published'
      and h.name in (
        'Hábito de nazareno con capa',
        'Hábito de nazareno sin capa'
      )
  ) <> 2 then
    raise exception 'No se pudieron validar las dos variantes de indumentaria de Las Cigarreras';
  end if;
end
$$;
