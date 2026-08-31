-- Hilo Cofrade · Renovación visual de la indumentaria del Baratillo
--
-- Sustituye las ilustraciones SVG por recortes WebP transparentes y ligeros.

update public.brotherhood_habits as habit
set image_path = case habit.name
  when 'Cortejo del paso de Cristo'
    then '/hermandades/el-baratillo/tunicas/cortejo-cristo.webp'
  when 'Cortejo del paso de palio'
    then '/hermandades/el-baratillo/tunicas/cortejo-palio.webp'
end
from public.entities as brotherhood
where habit.brotherhood_entity_id = brotherhood.id
  and brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'el-baratillo'
  and habit.name in (
    'Cortejo del paso de Cristo',
    'Cortejo del paso de palio'
  );
