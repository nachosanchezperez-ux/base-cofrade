-- Reversión de owner-fixes-3.sql. Valores anteriores consultados el 12/10/2026.
begin;

update public.entities set name = 'Banda Municipal de Música de Bollullos del Condado'
where id = 'a2208260-0000-0000-0000-000000000040';

update public.outing_music_assignments set band_name_text = 'Banda Municipal de Música de Bollullos del Condado'
where id in ('1f3f13dc-b893-4cb2-83ad-a1e9e87dcdd2', '0c80296a-2e48-4138-ae67-7ff5bea74f84');

update public.music_accompaniment_periods
set band_entity_id = '91f268e2-c0ea-4216-8582-d9b996a2f113',
    public_band_name = 'Banda Municipal de Música de Bollullos Par del Condado',
    public_band_slug = 'banda-municipal-bollullos-par-condado'
where id = '69e37af7-c32c-421b-a9ec-a1a777db9959';

update public.entities set status = 'draft' where id = '91f268e2-c0ea-4216-8582-d9b996a2f113';

update public.outing_music_assignments
set band_entity_id = '17e1e5a8-a7b4-46ce-97ad-d27868ab8959', band_name_text = null
where id = '286fb4a5-0a16-4587-86ed-1de8ac7045f4';

commit;
