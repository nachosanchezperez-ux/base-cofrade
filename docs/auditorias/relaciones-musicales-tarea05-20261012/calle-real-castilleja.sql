-- Castilleja de la Cuesta · fusión de duplicados (12/10/2026).
-- Propietario: «Son la misma Hermandad: Hermandad de la Calle Real».
-- El borrador «Hermandad del Gran Poder de Castilleja de la Cuesta» (38d9322f) solo tenía un periodo:
-- Carmen de Salteras, tras el misterio del Santísimo Cristo de la Vera Cruz, el Jueves Santo.
-- Pasa a la Calle Real (c6100000…0007, en borrador) y el duplicado se archiva. No se borra nada.
-- Reversión: calle-real-castilleja-rollback.sql.
update public.music_accompaniment_periods
set brotherhood_entity_id = 'c6100000-0000-4000-8000-000000000007',
    public_brotherhood_name = 'Hermandad de la Calle Real de Castilleja de la Cuesta',
    public_brotherhood_slug = 'hermandad-calle-real-castilleja-cuesta'
where id = 'ad90cae2-d395-4a54-9644-8a18bb565bda' and brotherhood_entity_id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002';

update public.entities set status = 'archived'
where id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002' and status = 'draft';
