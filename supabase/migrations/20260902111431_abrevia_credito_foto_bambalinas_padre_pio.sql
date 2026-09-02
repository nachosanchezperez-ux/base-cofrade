-- Corrección editorial · Padre Pío
-- Abrevia el crédito visible de la fotografía; la procedencia documental
-- permanece vinculada mediante source_links.

do $$
declare
  v_rows integer;
begin
  update public.heritage_assets ha
  set public_image_credit = 'Fotografía • Hermandad'
  from public.entities e
  where e.id = ha.entity_id
    and e.slug = 'bambalinas-palio-madre-divina-gracia-padre-pio'
    and ha.public_image_path = '/hermandades/padre-pio/bambalinas-palio-2026-original.jpeg';

  get diagnostics v_rows = row_count;

  if v_rows <> 1 then
    raise exception 'El crédito debe actualizar una única fotografía de las bambalinas de Padre Pío';
  end if;

  if not exists (
    select 1
    from public.heritage_assets ha
    join public.entities e on e.id = ha.entity_id
    where e.slug = 'bambalinas-palio-madre-divina-gracia-padre-pio'
      and ha.public_image_credit = 'Fotografía • Hermandad'
  ) then
    raise exception 'La fotografía debe publicar el crédito editorial abreviado';
  end if;
end
$$;
