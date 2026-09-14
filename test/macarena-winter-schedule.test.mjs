import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const migrationUrl = new URL(
  '../supabase/migrations_archive/post-first-edition-editorial/20260914151000_documenta_horarios_invierno_macarena.sql',
  import.meta.url,
)

test('La Macarena documenta el horario de invierno completo y estacional', async () => {
  const migration = await readFile(migrationUrl, 'utf8')

  assert.match(migration, /14 de septiembre de 2026–30 de mayo de 2027/)
  assert.match(migration, /Apertura · Lunes a sábado y vísperas de festivo: 08:00–14:00 y 17:00–21:00/)
  assert.match(migration, /Apertura · Domingos y festivos: 09:30–14:00 y 17:00–21:00/)
  assert.match(migration, /Misas · Lunes a viernes: 09:00, 11:30, 19:00 y 20:00/)
  assert.match(migration, /Misas · Sábados: 09:00 y 20:00 \(Santo Rosario, Salve y Sabatina\)/)
  assert.match(migration, /Misas · Domingos y festivos de precepto: 10:00, 12:30 y 20:00/)
  assert.match(migration, /Rosario · Todos los días: 19:40/)
  assert.match(migration, /Misa de la Sentencia · Primer viernes de mes: 20:00/)
  assert.match(migration, /Confesiones · Media hora antes de cada misa/)
  assert.match(migration, /Museo-Tesoro · Lunes a sábado y vísperas de festivo: 09:00–14:00 y 17:00–21:00/)
  assert.match(migration, /Museo-Tesoro · Domingos y festivos: 09:30–14:00 y 17:00–21:00/)
  assert.match(migration, /El acceso finaliza 30 minutos antes de cada cierre/)
  assert.match(migration, /Despacho rectoral · Martes a jueves: 18:30–19:30/)
})

test('el horario pertenece a la sede canónica y conserva trazabilidad', async () => {
  const migration = await readFile(migrationUrl, 'utf8')

  assert.match(migration, /hermandad-de-la-macarena/)
  assert.match(migration, /basilica-esperanza-macarena/)
  assert.match(migration, /opening_hours_verified_at = date '2026-09-14'/)
  assert.match(migration, /Cartel oficial aportado por Dirección/)
  assert.match(migration, /entity_location_id/)
  assert.match(migration, /Sede y visita · horarios de invierno 2026-2027/)
  assert.doesNotMatch(migration, /\b(create|alter|drop)\s+(table|policy|view|function|index)\b/i)
})
