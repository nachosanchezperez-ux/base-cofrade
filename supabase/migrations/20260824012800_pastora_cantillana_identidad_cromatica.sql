-- Hilo Cofrade · Identidad cromática de la Pastora de Cantillana
--
-- Paleta pensada para conservar la identidad celeste, blanca y dorada de la
-- Hermandad y mantener una lectura clara en pantallas grandes y retransmisión.

DO $$
DECLARE
  v_brotherhood_id uuid;
BEGIN
  SELECT id
    INTO v_brotherhood_id
  FROM public.entities
  WHERE entity_type = 'brotherhood'
    AND slug = 'pastora-de-cantillana'
  LIMIT 1;

  IF v_brotherhood_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró la Hermandad pastora-de-cantillana';
  END IF;

  -- Conserva la trazabilidad de cualquier color anterior, pero evita que siga
  -- participando en la presentación pública de la ficha.
  UPDATE public.brotherhood_colors
  SET status = 'archived',
      updated_at = now()
  WHERE brotherhood_entity_id = v_brotherhood_id
    AND lower(color_name) NOT IN ('celeste', 'dorado', 'blanco')
    AND status <> 'archived';

  INSERT INTO public.brotherhood_colors (
    brotherhood_entity_id,
    color_name,
    hex_value,
    color_role,
    sort_order,
    notes,
    status
  )
  VALUES
    (
      v_brotherhood_id,
      'Celeste',
      '#257FA1',
      'primary',
      10,
      'Celeste institucional con contraste reforzado para lectura en pantalla y retransmisión.',
      'published'
    ),
    (
      v_brotherhood_id,
      'Dorado',
      '#C7A24A',
      'secondary',
      20,
      'Dorado cálido empleado como acento de jerarquía y detalle.',
      'published'
    ),
    (
      v_brotherhood_id,
      'Blanco',
      '#FFFFFF',
      'identity',
      30,
      'Blanco de apoyo para fondos, descansos visuales y contraste.',
      'published'
    )
  ON CONFLICT (brotherhood_entity_id, color_name)
  DO UPDATE SET
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();
END
$$;
