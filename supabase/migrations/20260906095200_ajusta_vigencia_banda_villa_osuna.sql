-- Actualidad estricta: el convenio publica fecha de firma y duración, no fecha exacta de fin.
update public.music_accompaniment_periods
set date_from = date '2025-12-23',
    date_from_text = '23 de diciembre de 2025',
    year_from = 2025,
    date_to = null,
    date_to_text = null,
    year_to = null,
    is_current = true,
    notes = 'Convenio municipal firmado el 23 de diciembre de 2025 con vigencia de cuatro años, que incluye expresamente la procesión de Nuestra Señora de Consolación. La fuente no publica fecha exacta de finalización y no se infiere. No se presenta como contrato directo de la Hermandad.',
    updated_at = now()
where brotherhood_entity_id = (select id from public.entities where slug = 'consolacion-osuna')
  and band_entity_id = (select id from public.entities where slug = 'banda-musica-villa-osuna')
  and step_entity_id = (select id from public.entities where slug = 'paso-nuestra-senora-consolacion-osuna')
  and position = 'Tras el paso';
