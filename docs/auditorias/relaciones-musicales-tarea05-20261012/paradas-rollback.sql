-- Reversión de paradas.sql.
begin;
update public.entities set status = 'draft' where id = 'f0f741d1-75eb-43b5-b938-9eda31f6cc41';
update public.music_accompaniment_periods
set brotherhood_entity_id = 'f0f741d1-75eb-43b5-b938-9eda31f6cc41',
    public_brotherhood_name = 'Hermandad del Santo Entierro', public_brotherhood_slug = 'hermandad-santo-entierro-paradas'
where id = '7770dc8b-d881-43c9-8450-1a047ffccc79';
commit;
