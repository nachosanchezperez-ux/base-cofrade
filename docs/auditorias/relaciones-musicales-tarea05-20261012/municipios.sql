-- Municipio de las Hermandades en borrador, deducido del final de su nombre (12/10/2026).
-- Indicación del propietario: «si te fijas en el final del nombre viene la ubicación».
-- Solo coincidencias exactas con un municipio existente, más dos formas abreviadas:
--   «de Jerez» → Jerez de la Frontera y «de Huévar» → Huévar del Aljarafe.
-- Solo rellena municipios vacíos. Las 10 Hermandades sin fila en brotherhoods la reciben con la
-- convención de los borradores (nombre oficial y popular = nombre de la entidad).
-- Reversión: municipios-rollback.sql.

with h as (
  select distinct e.id, e.name from public.music_accompaniment_periods m join public.entities e on e.id = m.brotherhood_entity_id
  where m.status = 'published' and m.step_entity_id is null and e.status = 'draft'
),
alias(suffix, mname) as (values ('jerez', 'Jerez de la Frontera'), ('huévar', 'Huévar del Aljarafe')),
cand as (
  select h.id, h.name, mu.id mid, row_number() over (partition by h.id order by length(mu.name) desc) rn
  from h join public.municipalities mu on lower(h.name) like '% ' || lower(mu.name)
  union all
  select h.id, h.name, mu.id, 1 from h join alias a on lower(h.name) like '% ' || a.suffix join public.municipalities mu on mu.name = a.mname
),
pick as (select id, name, mid from cand where rn = 1),
upd as (
  update public.brotherhoods b set municipality_id = p.mid
  from pick p where b.entity_id = p.id and b.municipality_id is null
    and b.entity_id in (
  '1441ed8e-8858-436f-879a-d6b86dc18fa7',
  '1929ce51-b21c-4f5e-a4ee-02b0214d511d',
  '4c8f6c96-8537-40ca-89f9-d3c2cf2d14e1',
  '75c7956b-3966-42a4-a234-68107a3a2de2',
  '91eb87a6-b452-469d-a55a-87b21fc59c46',
  '93de8c16-5c7b-45a4-bb6d-018ca5d9d193',
  'a0ad28f3-67ea-4d8d-8c2a-28b88ae27692',
  'b1390a6a-a1fc-4099-9be4-1c7d01bd4e45',
  'c6100000-0000-4000-8000-000000000001',
  'c6100000-0000-4000-8000-000000000004',
  'c6100000-0000-4000-8000-000000000005',
  'c6100000-0000-4000-8000-000000000006',
  'c6100000-0000-4000-8000-000000000007',
  'c6100000-0000-4000-8000-000000000010',
  'c6100000-0000-4000-8000-000000000012',
  'c6100000-0000-4000-8000-000000000013',
  'c6100000-0000-4000-8000-000000000014',
  'c6100000-0000-4000-8000-000000000016',
  'c6100000-0000-4000-8000-000000000017',
  'd071de1d-47f8-4433-a88c-b29697824d66',
  'eb4b570e-f612-4f67-9bee-f57d82343553',
  'f0f741d1-75eb-43b5-b938-9eda31f6cc41',
  'f16c78a6-d872-40f5-af1f-723aaf21f121',
  'f51d8c0c-6436-470e-94f9-b83527d0661c',
  'f800d9c7-547e-41aa-bb57-09e029ee9085')
  returning b.entity_id
),
ins as (
  insert into public.brotherhoods (entity_id, official_name, popular_name, municipality_id)
  select p.id, p.name, p.name, p.mid from pick p
  where p.id in (
  '08044226-39e3-4379-bc6e-a21c8448fa72',
  '21ca9c9f-3cb3-4bff-9b8c-e28008ca797c',
  '36d6ef9d-f529-4562-b22d-972964eb78b3',
  '662f2efd-1558-43fe-8999-b38c1cbf1e1e',
  '9ae9ae93-7a2e-4dc3-ae9e-36bd91e929d5',
  '9cb150fc-d866-4134-bae7-a87766969bcf',
  'bbdba26b-fffb-4473-83ad-2ffec7a83e33',
  'ca0ea6de-53d8-4032-ab61-5d7566dc551b',
  'd37d281c-806a-4115-98b4-3ab2c2c3f55a',
  'fbdf5a65-f693-46c3-8269-fa24cbe73eb4')
    and not exists (select 1 from public.brotherhoods b where b.entity_id = p.id)
  returning entity_id
)
select (select count(*) from upd) actualizadas, (select count(*) from ins) creadas;
