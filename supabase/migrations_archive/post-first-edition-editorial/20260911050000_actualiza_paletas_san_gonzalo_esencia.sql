begin;

DO $$
DECLARE
  san_gonzalo_id uuid;
  esencia_id uuid;
BEGIN
  SELECT id INTO san_gonzalo_id
  FROM public.entities
  WHERE slug = 'hermandad-de-san-gonzalo'
  LIMIT 1;

  IF san_gonzalo_id IS NULL THEN
    RAISE EXCEPTION 'No se encuentra la Hermandad de San Gonzalo';
  END IF;

  UPDATE public.brotherhood_colors
  SET status = 'archived', updated_at = now()
  WHERE brotherhood_entity_id = san_gonzalo_id
    AND status = 'published'
    AND color_name NOT IN ('Rojo', 'Blanco', 'Dorado');

  INSERT INTO public.brotherhood_colors (
    brotherhood_entity_id,
    color_name,
    hex_value,
    color_role,
    sort_order,
    notes,
    status,
    updated_at
  )
  VALUES
    (san_gonzalo_id, 'Rojo', '#B01B32', 'primary', 10, 'Paleta corporativa indicada para San Gonzalo', 'published', now()),
    (san_gonzalo_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa indicada para San Gonzalo', 'published', now()),
    (san_gonzalo_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Paleta corporativa indicada para San Gonzalo', 'published', now())
  ON CONFLICT (brotherhood_entity_id, color_name) DO UPDATE
  SET hex_value = excluded.hex_value,
      color_role = excluded.color_role,
      sort_order = excluded.sort_order,
      notes = excluded.notes,
      status = 'published',
      updated_at = now();

  SELECT id INTO esencia_id
  FROM public.entities
  WHERE slug = 'banda-cornetas-tambores-esencia-sevilla'
  LIMIT 1;

  IF esencia_id IS NULL THEN
    RAISE EXCEPTION 'No se encuentra la Banda Esencia';
  END IF;

  UPDATE public.bands
  SET primary_color = '#29272C',
      secondary_color = '#123B2A'
  WHERE entity_id = esencia_id;

  UPDATE public.band_colors
  SET status = 'archived', updated_at = now()
  WHERE band_entity_id = esencia_id
    AND status = 'published'
    AND color_name NOT IN ('Gris oscuro', 'Verde oscuro', 'Dorado');

  INSERT INTO public.band_colors (
    band_entity_id,
    color_name,
    hex_value,
    color_role,
    sort_order,
    notes,
    status,
    updated_at
  )
  VALUES
    (esencia_id, 'Gris oscuro', '#29272C', 'primary', 10, 'Paleta corporativa indicada para Esencia', 'published', now()),
    (esencia_id, 'Dorado', '#C5A253', 'accent', 20, 'Paleta corporativa indicada para Esencia', 'published', now()),
    (esencia_id, 'Verde oscuro', '#123B2A', 'secondary', 30, 'Paleta corporativa indicada para Esencia', 'published', now())
  ON CONFLICT (band_entity_id, color_name) DO UPDATE
  SET hex_value = excluded.hex_value,
      color_role = excluded.color_role,
      sort_order = excluded.sort_order,
      notes = excluded.notes,
      status = 'published',
      updated_at = now();
END
$$;

commit;
