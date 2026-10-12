-- Reversión de calle-real-castilleja.sql.
begin;
update public.entities set status = 'draft' where id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002';
update public.music_accompaniment_periods
set brotherhood_entity_id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002',
    public_brotherhood_name = 'Hermandad del Gran Poder de Castilleja de la Cuesta',
    public_brotherhood_slug = 'hermandad-gran-poder-castilleja'
where id = 'ad90cae2-d395-4a54-9644-8a18bb565bda';
commit;
