-- TAREA 05 · Tercera tanda autorizada por el propietario (12/10/2026, 13:00).
--   1. «Banda Municipal de Bollullos del Condado es el nombre correcto».
--   2. «Ánima Sacra solo en texto».
-- Reversión: owner-fixes-3-rollback.sql.

-- 1 · Bollullos: una sola ficha (a2208260…0040, sigue en borrador) con el nombre correcto.
update public.entities set name = 'Banda Municipal de Bollullos del Condado'
where id = 'a2208260-0000-0000-0000-000000000040' and name = 'Banda Municipal de Música de Bollullos del Condado';

update public.outing_music_assignments set band_name_text = 'Banda Municipal de Bollullos del Condado'
where band_entity_id = 'a2208260-0000-0000-0000-000000000040'
  and band_name_text = 'Banda Municipal de Música de Bollullos del Condado';

-- El periodo 2027–2028 de la Esperanza de Arahal pasa a la ficha correcta. Sin enlace público
-- (la ficha está en borrador): public_band_slug se vacía para no apuntar a una página inexistente.
update public.music_accompaniment_periods
set band_entity_id = 'a2208260-0000-0000-0000-000000000040',
    public_band_name = 'Banda Municipal de Bollullos del Condado',
    public_band_slug = null
where id = '69e37af7-c32c-421b-a9ec-a1a777db9959' and band_entity_id = '91f268e2-c0ea-4216-8582-d9b996a2f113';

-- La ficha duplicada se archiva (no se borra). No tenía otras referencias.
update public.entities set status = 'archived'
where id = '91f268e2-c0ea-4216-8582-d9b996a2f113' and status = 'draft';

-- 2 · Ánima Sacra: solo como texto en el Corpus del Cerro. La ficha (en revisión) no se toca.
update public.outing_music_assignments
set band_entity_id = null, band_name_text = 'Ánima Sacra'
where id = '286fb4a5-0a16-4587-86ed-1de8ac7045f4' and band_entity_id = '17e1e5a8-a7b4-46ce-97ad-d27868ab8959';
