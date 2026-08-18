-- Hilo Cofrade · Encarnación · precisión de dataciones
-- Complemento de la migración 042
--
-- No convierte un año o un mes documentado en una fecha exacta artificial.
-- La fecha textual conserva la precisión real de la fuente.

update public.band_agents
set date_from = null,
    date_from_text = 'Septiembre de 2022'
where id = 'b4230000-0000-0000-0000-000000000001';

update public.heritage_interventions
set date_from = null,
    date_from_text = '2014'
where id in (
  'a4230000-0000-0000-0000-000000000001',
  'a4230000-0000-0000-0000-000000000002'
);

update public.heritage_interventions
set date_from = null,
    date_from_text = '2003'
where id = 'a4230000-0000-0000-0000-000000000003';
