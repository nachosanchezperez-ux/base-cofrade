-- Corrige dos relaciones que quedaron asociadas por error a la banda de
-- cornetas y tambores de Las Cigarreras. Ambas corresponden a la Banda de
-- Música María Santísima de la Victoria (Las Cigarreras).
--
-- La guarda por banda de origen hace la migración idempotente y evita mover
-- estas relaciones si una corrección editorial posterior ya las hubiera
-- reasignado expresamente.

update public.music_accompaniment_periods
set
  band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f',
  notes = case id
    when '5ba4db18-06df-40e2-ae28-9472e5ad773d' then
      'Acompañamiento de la Banda de Música María Santísima de la Victoria documentado desde 2024. Continuidad confirmada para la procesión de 2026 por Dirección de Hilo Cofrade el 5 de septiembre de 2026; se mantiene como acompañamiento vigente tras Nuestra Señora de los Reyes.'
    when '7730fc5e-03a7-4929-b362-ab420c49641a' then
      'La Banda de Música María Santísima de la Victoria acompañó la procesión anual de 2025. No se marca como vigente en 2026 sin confirmación específica.'
    else notes
  end,
  updated_at = now()
where id in (
    '5ba4db18-06df-40e2-ae28-9472e5ad773d', -- Nuestra Señora de los Reyes · Sastres
    '7730fc5e-03a7-4929-b362-ab420c49641a'  -- Nuestra Señora de la Luz
  )
  and band_entity_id = 'b1000000-0000-0000-0000-000000000001';
