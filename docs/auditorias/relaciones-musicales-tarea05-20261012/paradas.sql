-- Santo Entierro de Paradas · fusión autorizada por el propietario («Fusiona Paradas», 12/10/2026).
-- El borrador f0f741d1 solo tenía un periodo (Presentación al Pueblo, tras el misterio, Viernes Santo).
-- Pasa a la ficha publicada 2d406310 (sin pasos creados: el periodo queda sin paso). El borrador se archiva.
-- Reversión: paradas-rollback.sql.
update public.music_accompaniment_periods
set brotherhood_entity_id = '2d406310-3024-4050-84ec-e8d54da55286',
    public_brotherhood_name = 'Santo Entierro de Paradas', public_brotherhood_slug = 'santo-entierro-paradas'
where id = '7770dc8b-d881-43c9-8450-1a047ffccc79' and brotherhood_entity_id = 'f0f741d1-75eb-43b5-b938-9eda31f6cc41';
update public.entities set status = 'archived' where id = 'f0f741d1-75eb-43b5-b938-9eda31f6cc41' and status = 'draft';
