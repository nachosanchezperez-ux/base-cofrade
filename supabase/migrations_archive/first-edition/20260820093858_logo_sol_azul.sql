-- Hilo Cofrade · Actualización del logotipo público de la Banda del Sol

do $$
declare
  updated_rows integer;
begin
  update public.bands band
  set logo_path = '/bandas/banda-del-sol/imagotipo-sol-azul.webp'
  from public.entities entity
  where entity.id = band.entity_id
    and entity.entity_type = 'band'
    and entity.slug = 'banda-del-sol';

  get diagnostics updated_rows = row_count;

  if updated_rows <> 1 then
    raise exception 'Se esperaba actualizar una ficha de la Banda del Sol y se actualizaron %', updated_rows;
  end if;
end
$$;
