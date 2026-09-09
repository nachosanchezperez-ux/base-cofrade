-- Compatibilidad con la señal histórica de acompañamientos de Hermandad.
-- El hecho ya está modelado en outing_music_positions / outing_music_assignments y en music_accompaniment_periods.
insert into public.accompaniments (
  outing_id, band_entity_id, step_entity_id, position, year, notes, status
)
select o.id, b.id, st.id, 'Tras el paso', 2026,
       'Acompañamiento confirmado de la Banda de Música Villa de Osuna en la procesión patronal del 8 de septiembre de 2026; reflejo de compatibilidad con el modelo histórico de acompañamientos.',
       'published'
from public.outings o
join public.entities b on b.slug = 'banda-musica-villa-osuna'
join public.entities st on st.slug = 'paso-nuestra-senora-consolacion-osuna'
where o.slug = 'osuna-consolacion-2026-09-08'
  and not exists (
    select 1 from public.accompaniments a
    where a.outing_id = o.id
      and a.band_entity_id = b.id
      and a.step_entity_id = st.id
      and a.position = 'Tras el paso'
      and a.year = 2026
  );
