-- Periodo de Maestro Tejera atribuido a las Nieves de Benacazón (12/10/2026).
-- El propietario indica que su fuente (vídeo de la banda, 2 de agosto de 2026) es de Castilleja de la Cuesta.
-- En Benacazón acompañan Cruz Roja (5 de agosto) y Virgen de las Mercedes (6 de agosto), según el
-- propietario y El Pespunte. Se archiva el periodo (no se borra) hasta identificar la Hermandad de Castilleja.
-- Además se asigna municipio a «Hermandad del Gran Poder de Castilleja de la Cuesta», deducido de su nombre.
-- Reversión: tejera-castilleja-rollback.sql.
update public.music_accompaniment_periods
set status = 'archived',
    notes = 'Acompañamiento musical de la procesión de la Patrona de Benacazón. [Archivado el 12/10/2026: según el propietario, la fuente corresponde a Castilleja de la Cuesta; en Benacazón acompañan Cruz Roja el 5 y Virgen de las Mercedes el 6 de agosto.]'
where id = '828e5709-d3fd-41bd-bf87-2120e3dfe626' and status = 'published';

update public.brotherhoods set municipality_id = (select id from public.municipalities where name = 'Castilleja de la Cuesta')
where entity_id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002' and municipality_id is null;
