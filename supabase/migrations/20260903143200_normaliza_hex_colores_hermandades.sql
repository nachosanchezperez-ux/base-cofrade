-- Completa tonos HEX editoriales de colores ya documentados en Hermandades.
-- No altera nombres, roles ni significado institucional; solo permite aplicar la identidad visual de forma consistente.

update public.brotherhood_colors
set hex_value = case lower(color_name)
  when 'morado' then '#5B2C83'
  when 'crema' then '#E8DFC8'
  when 'verde' then '#1F5A3A'
  when 'azul pavo' then '#1E6F78'
  when 'blanco' then '#FFFFFF'
  when 'burdeos' then '#7A263A'
  when 'celeste' then '#66B8D4'
  when 'dorado' then '#B08D3C'
  when 'merino' then '#D8C8A8'
  else hex_value
end,
updated_at = now()
where status = 'published'
  and hex_value is null
  and lower(color_name) in (
    'morado',
    'crema',
    'verde',
    'azul pavo',
    'blanco',
    'burdeos',
    'celeste',
    'dorado',
    'merino'
  );
