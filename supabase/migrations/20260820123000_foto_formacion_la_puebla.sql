-- Hilo Cofrade · BM La Puebla: fotografía principal de la formación
-- 2026-08-20

do $$
declare
  band_id uuid;
begin
  select id into band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-municipal-de-musica-de-la-puebla-del-rio';

  if band_id is null then
    raise exception 'No existe la Banda Municipal de Música de La Puebla del Río';
  end if;

  update public.bands
  set
    hero_image_path = '/bandas/la-puebla/la-puebla-formacion.avif',
    hero_image_alt = 'Banda Municipal de Música de La Puebla del Río durante un concierto',
    hero_image_credit = null
  where entity_id = band_id;

  if not found then
    raise exception 'No existe la fila bands para BM La Puebla';
  end if;
end
$$;
