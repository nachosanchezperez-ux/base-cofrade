-- Hilo Cofrade · Banda del Santísimo Cristo de la Sangre
--
-- Cierra y explica el periodo en que la formación acompañó la Cruz de Guía
-- de San Benito. En 1997 pasó a acompañar al Santísimo Cristo de la Sangre.

do $migration$
declare
  affected_rows integer;
begin
  update public.music_accompaniment_periods period
  set
    date_from_text = 'Desde 1993',
    year_from = 1993,
    date_to_text = 'Hasta 1996',
    year_to = 1996,
    is_current = false,
    notes = 'La banda acompañó la Cruz de Guía de San Benito entre 1993 y 1996. Desde el Martes Santo de 1997 acompaña al Santísimo Cristo de la Sangre.',
    updated_at = now()
  from public.entities band, public.entities brotherhood
  where period.band_entity_id = band.id
    and period.brotherhood_entity_id = brotherhood.id
    and band.slug = 'sangre-de-san-benito'
    and band.entity_type = 'band'
    and brotherhood.slug = 'san-benito'
    and brotherhood.entity_type = 'brotherhood'
    and period.position = 'En la Cruz de Guía'
    and period.status <> 'archived';

  get diagnostics affected_rows = row_count;

  if affected_rows <> 1 then
    raise exception 'Se esperaba corregir un acompañamiento de la Cruz de Guía de San Benito y se corrigieron %', affected_rows;
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities band on band.id = period.band_entity_id
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where band.slug = 'sangre-de-san-benito'
      and brotherhood.slug = 'san-benito'
      and period.position = 'En la Cruz de Guía'
      and period.year_from = 1993
      and period.year_to = 1996
      and not period.is_current
      and period.status <> 'archived'
  ) then
    raise exception 'No se pudo verificar el periodo 1993–1996 de la Cruz de Guía de San Benito';
  end if;
end
$migration$;
