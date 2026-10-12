-- Alta de los municipios de la provincia de Sevilla que faltaban (12/10/2026).
-- Indicación del propietario: «Solo los pueblos de Sevilla». Quedan fuera Hinojos, Paterna del Campo
-- y Villarrasa (Huelva) y Huete (Cuenca).
-- Un municipio no genera página propia: solo aparece en el sitemap si tiene bandas publicadas.
-- Reversión: municipios-sevilla-rollback.sql.

with mu as (
  insert into public.municipalities (id, name, slug, province, autonomous_community, country) values
    ('7a5c0e05-2026-4012-8000-0000000041a1', 'El Pedroso',  'el-pedroso',  'Sevilla', 'Andalucía', 'España'),
    ('7a5c0e05-2026-4012-8000-0000000041a2', 'Los Molares', 'los-molares', 'Sevilla', 'Andalucía', 'España'),
    ('7a5c0e05-2026-4012-8000-0000000041a3', 'Brenes',      'brenes',      'Sevilla', 'Andalucía', 'España')
  on conflict (id) do nothing
  returning id
),
upd as (
  update public.brotherhoods b set municipality_id = v.mid
  from (values ('7c783707-bbe3-4af5-be44-8d6d993e5e4c'::uuid, '7a5c0e05-2026-4012-8000-0000000041a1'::uuid),
               ('1611d490-3cb3-49bc-9789-5a179db03d8d', '7a5c0e05-2026-4012-8000-0000000041a2')) v(eid, mid)
  where b.entity_id = v.eid and b.municipality_id is null and exists (select 1 from mu where mu.id = v.mid)
  returning b.entity_id
),
ins as (
  insert into public.brotherhoods (entity_id, official_name, popular_name, municipality_id)
  select e.id, e.name, e.name, '7a5c0e05-2026-4012-8000-0000000041a3'
  from public.entities e
  where e.id = 'e154d426-bcaa-43cd-acd2-58050b1317a7'
    and exists (select 1 from mu where mu.id = '7a5c0e05-2026-4012-8000-0000000041a3')
    and not exists (select 1 from public.brotherhoods b where b.entity_id = e.id)
  returning entity_id
)
select (select count(*) from mu) municipios, (select count(*) from upd) actualizadas, (select count(*) from ins) creadas;
