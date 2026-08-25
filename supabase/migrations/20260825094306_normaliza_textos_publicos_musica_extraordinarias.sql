update public.outing_music_assignments oma
set notes = 'Formación dirigida por Arturo Ártigas Campos. Orquesta sinfónica de 57 músicos, coro mixto de 28 voces y solistas de soprano, tenor, barítono y bajo.'
from public.outing_music_positions omp
join public.outings o on o.id = omp.outing_id
where oma.music_position_id = omp.id
  and o.reference_code = 'GERENA-SANGRE-2026'
  and omp.position_code = 'liturgical_music'
  and coalesce(oma.band_name_text, '') = 'Grupo de Cámara “SACRA”';

update public.outing_music_assignments oma
set notes = null
from public.outing_music_positions omp
join public.outings o on o.id = omp.outing_id
where oma.music_position_id = omp.id
  and o.reference_code like 'PILAS%2026%'
  and omp.position_label = 'Rosario de la Aurora'
  and coalesce(oma.band_name_text, '') = 'Sociedad Filarmónica Juvenil de Pilas'
  and oma.notes ilike '%fuente%';
