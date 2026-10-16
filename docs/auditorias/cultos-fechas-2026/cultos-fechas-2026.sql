-- Borradores de fechas 2026 para cultos que se repiten cada año (16/10/2026).
-- Solo cultos cuya regla da una fecha inequívoca (día fijo, «primer miércoles»,
-- «segundo domingo de Adviento»…) o que ya tienen fecha de 2026 en el propio culto.
-- Se crean en BORRADOR: no se ven en la web hasta confirmarlos (cultos-fechas-2026-publicar.sql).
-- Idempotente: no duplica si el culto ya tiene edición en 2026.
-- Reversión: cultos-fechas-2026-rollback.sql.

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, event_status, status, notes)
select v.id::uuid, v.cult_id::uuid, v.year, v.start_date::date, v.end_date::date, v.event_status, v.status, v.notes
from (values
  ('7a5c0e05-2026-4016-8000-000000c00001', 'c0160700-7700-4000-8000-000000000004', 2026, '2026-10-24', '2026-10-26', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «24, 25 y 26 de octubre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00002', '38000000-0000-0000-0000-000000000003', 2026, '2026-10-29', '2026-10-31', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «29, 30 y 31 de octubre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00003', 'c0160700-7700-4000-8000-000000000005', 2026, '2026-11-01', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «1 de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00004', '38000000-0000-0000-0000-000000000004', 2026, '2026-11-01', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «1 de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00005', '186a5feb-cf43-4ace-935c-6fde0293982d', 2026, '2026-11-04', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Primer miércoles de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00006', 'd3946c41-94fe-4f25-8aa4-ef50885bda17', 2026, '2026-11-07', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla fecha del culto: 7/11/2026. Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00007', '06e1466a-0a6b-4576-baaf-464ef02d2e59', 2026, '2026-11-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla fecha del culto: 8/11/2026. Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00008', '9c0d2785-6953-42f1-8c39-f2541d91c422', 2026, '2026-11-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Segundo domingo de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00009', 'a1b1c912-a63f-43f2-831b-0c9f07bcce04', 2026, '2026-11-16', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla fecha del culto: 16/11/2026. Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00010', 'c0160700-7700-4000-8000-000000000006', 2026, '2026-11-19', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «19 de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00011', 'aa1813d0-467d-43de-b287-f593ad9ef4e5', 2026, '2026-11-27', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Último viernes de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00012', '0c2f6ac4-65d9-4474-b6d8-846693d1d335', 2026, '2026-11-27', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Último viernes de noviembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00013', 'c0160700-7700-4000-8000-000000000007', 2026, '2026-12-01', '2026-12-03', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «1, 2 y 3 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00014', '4cb5f872-40c9-459f-8227-96025beadb3f', 2026, '2026-12-04', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «4 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00015', '3644d971-5a25-465d-9c66-802babeb26dc', 2026, '2026-12-05', '2026-12-07', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Tres días previos al 8 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00016', 'bcd691ac-b1dc-4f4b-90ef-f7c828f0c67d', 2026, '2026-12-06', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «Segundo domingo de Adviento». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00017', '4882a380-9d12-445f-98e5-9bc474b045f2', 2026, '2026-12-07', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «7 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00018', 'c0160700-7700-4000-8000-000000000008', 2026, '2026-12-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «8 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00019', '31f458c1-659f-4e1b-b9a4-07804b6a9f65', 2026, '2026-12-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «8 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00020', 'b299629c-da4d-4cf9-841b-7c6120379f69', 2026, '2026-12-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «8 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00021', 'c0160600-0004-4000-8000-000000000007', 2026, '2026-12-08', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «8 de diciembre, festividad de la Inmaculada Concepción». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00022', '466e0410-5eac-44e6-8679-065011fd4b2c', 2026, '2026-12-09', '2026-12-11', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «9, 10 y 11 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00023', 'a731e5c8-4d29-46f1-b803-9e62c7d154fa', 2026, '2026-12-10', '2026-12-12', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «10, 11 y 12 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00024', '635adb89-22b7-4c90-8de2-e54d7915ef24', 2026, '2026-12-12', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «12 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00025', 'd2c4a986-7f31-4e05-9268-1b53d9c647ae', 2026, '2026-12-13', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «13 de diciembre, festividad de Santa Lucía». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00026', 'e95f2b47-18d6-43ca-a701-5c84e9f236bd', 2026, '2026-12-13', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «13 de diciembre, festividad de Santa Lucía». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00027', 'a1b28515-4198-4c81-a350-58bccbb2f470', 2026, '2026-12-15', '2026-12-18', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «15 al 18 de diciembre de 2026». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00028', 'd46bb663-dac4-4aae-81c9-57fc6b320adf', 2026, '2026-12-15', '2026-12-23', 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «15 al 23 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00029', '7e705ea2-bf2a-4b35-ae01-6c4a61f00299', 2026, '2026-12-18', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «18 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00030', '00525142-acf1-4254-9e2b-ab22bf97ff19', 2026, '2026-12-18', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «18 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00031', 'e1600000-0000-4000-8000-000000000026', 2026, '2026-12-23', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «23 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00032', 'dc1d7cd0-ceab-4960-984b-10fcfe69dc38', 2026, '2026-12-27', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «27 de diciembre». Pendiente de confirmar.'),
  ('7a5c0e05-2026-4016-8000-000000c00033', '5291361f-2f4f-48a8-88e2-f76f8c2c33e3', 2026, '2026-12-27', NULL, 'announced', 'draft', 'Borrador calculado el 16/10/2026 a partir de la regla «27 de diciembre». Pendiente de confirmar.')
) as v(id, cult_id, year, start_date, end_date, event_status, status, notes)
where exists (select 1 from public.cults c where c.id = v.cult_id::uuid and c.status = 'published')
  and not exists (select 1 from public.cult_occurrences o where o.cult_id = v.cult_id::uuid and o.year = 2026)
on conflict (id) do nothing;
