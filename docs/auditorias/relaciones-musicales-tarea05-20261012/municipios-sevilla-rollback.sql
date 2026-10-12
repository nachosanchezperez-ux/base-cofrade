-- Reversión de municipios-sevilla.sql.
begin;
update public.brotherhoods set municipality_id = null
where entity_id in ('7c783707-bbe3-4af5-be44-8d6d993e5e4c', '1611d490-3cb3-49bc-9789-5a179db03d8d');
delete from public.brotherhoods where entity_id = 'e154d426-bcaa-43cd-acd2-58050b1317a7';
delete from public.municipalities where id in ('7a5c0e05-2026-4012-8000-0000000041a1', '7a5c0e05-2026-4012-8000-0000000041a2', '7a5c0e05-2026-4012-8000-0000000041a3');
commit;
