import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260915180000_cierra_vera_cruz_alcala_del_rio.sql', import.meta.url),
  'utf8',
)

test('Vera-Cruz se cierra como contexto HC-016 con DML exclusivamente', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160024-0000-4000-8000-000000000001/)
  assert.match(recipe, /'completed'/)
  assert.match(recipe, /'schema', 'unchanged'/)
})

test('los titulares conservan atribuciones cautas y los dos pasos quedan publicados', () => {
  assert.match(recipe, /Santísimo Cristo de la Vera-Cruz/)
  assert.match(recipe, /María Santísima de las Angustias Coronada/)
  assert.equal((recipe.match(/'attributed_to'/g) || []).length, 2)
  assert.equal((recipe.match(/'attributed'/g) || []).length, 2)
  assert.match(recipe, /Roque de Balduque/)
  assert.match(recipe, /José Montes de Oca/)
  assert.match(recipe, /Francisco Verdugo/)
  assert.match(recipe, /Terminado en 1903; estrenado en 1904/)
})

test('el Jueves Santo conserva sus dos tramos, horarios y música', () => {
  assert.match(recipe, /'2026-04-02', '2026-04-03'/)
  assert.match(recipe, /'Salida procesional', '2026-04-02', '18:00'/)
  assert.match(recipe, /'Entrada del palio en la parroquia', '2026-04-02', '22:30'/)
  assert.match(recipe, /'Vía Crucis y salida de regreso', '2026-04-03', '00:30'/)
  assert.match(recipe, /'Entrada del palio en San Gregorio', '2026-04-03', '04:30'/)
  assert.match(recipe, /Tras la Cruz de Guía en el cortejo de ida/)
  assert.match(recipe, /Tras el Santísimo Cristo en el regreso/)
  assert.match(recipe, /Tras la Virgen en el regreso/)
  assert.match(recipe, /de6bb885-b80e-4c26-a176-7f72af419d63/)
  assert.match(recipe, /da951f85-de4c-48a4-bd97-b8c9f835d9b4/)
  assert.match(recipe, /b5ab8fa7-e3e1-4667-a2db-23bea160aa52/)
  assert.match(recipe, /31f46874-049b-4c33-aa68-b65ded5dfda9/)
})

test('San Gregorio mantiene cultos y regreso separados de la estación penitencial', () => {
  assert.match(recipe, /'2026-08-31', '2026-09-08'/)
  assert.match(recipe, /'2026-09-09', '2026-09-09'/)
  assert.match(recipe, /'Regreso de San Gregorio de Osset a su ermita 2026'/)
  assert.match(recipe, /'2026-09-09', '2026-09-09', 2026, '20:30'/)
  assert.match(recipe, /Banda del Valle de Burguillos en 2026/)
})

test('la estadística, el patrimonio y los hitos quedan trazables sin inventar fotografía', () => {
  assert.match(recipe, /2026,\s*\n\s*'2026-04-02', 'Jueves Santo', 902, 32, 1568/)
  assert.match(recipe, /2650, 'exact'/)
  assert.equal((recipe.match(/'heritage_asset'/g) || []).length, 5)
  assert.match(recipe, /Origen documentado de la Vera-Cruz/)
  assert.match(recipe, /Reconocimiento canónico de la Coronación/)
  assert.doesNotMatch(recipe, /insert into public\.media_assets/i)
})
