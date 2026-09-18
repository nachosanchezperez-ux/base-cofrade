import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260917070000_cierra_cantillana_macrolote_municipal.sql', import.meta.url), 'utf8')

test('Cantillana se cierra mediante DML y un lote gobernado', () => {
  assert.match(recipe, /c0160030-0000-4000-8000-000000000001/)
  assert.match(recipe, /Operaciones editoriales: 93 \(88 insert\/upsert, 5 update, 7 reuse\)/)
  assert.doesNotMatch(recipe, /\b(create|alter|drop|truncate)\s+(table|policy|schema|function|extension)\b/i)
  assert.doesNotMatch(recipe, /row level security|\bgrant\b|\brevoke\b/i)
})

test('el universo municipal preserva Asunción y Pastora y concentra el cambio en la Soledad', () => {
  assert.match(recipe, /Asunción y Pastora se preservan/)
  assert.match(recipe, /Muy Antigua, Ilustre y Fervorosa|Soledad de Cantillana/)
  assert.doesNotMatch(recipe, /set .*pastora|set .*asunci[oó]n/i)
})

test('la Soledad publica cuatro titulares y tres pasos sin duplicar el palio', () => {
  for (const value of [
    'Santísimo Cristo Yacente de Cantillana',
    'Nuestra Señora de la Soledad Coronada de Cantillana',
    'San Juan Evangelista de la Soledad de Cantillana',
    'Santa María Magdalena de la Soledad de Cantillana',
    'Paso del Santo Sepulcro de Cantillana',
    'Paso del Calvario de la Soledad de Cantillana',
    'Paso de palio de Nuestra Señora de la Soledad Coronada',
  ]) assert.match(recipe, new RegExp(value))
  assert.match(recipe, /d42514a4-cd0f-499b-86de-65637db156f6/)
})

test('la actualidad diferencia held de announced con evidencia posterior', () => {
  assert.match(recipe, /2026-04-03.*held/s)
  assert.match(recipe, /Septenario.*held/s)
  assert.match(recipe, /Besamanos.*held/s)
  assert.match(recipe, /Función solemne al Santísimo Cristo Yacente.*announced/s)
  assert.match(recipe, /Misa de Pascua y procesión eucarística.*announced/s)
  assert.doesNotMatch(recipe, /2027-\d{2}-\d{2}/)
})

test('la música reutiliza la Banda local y mantiene Montefrío como crédito textual', () => {
  assert.match(recipe, /7a0f25e9-4901-4fb2-b35e-c851c24fb845/)
  assert.match(recipe, /Banda de Música “Montefrío” de Granada/)
  assert.match(recipe, /Crédito textual: no se crea nodo de Banda/)
  assert.match(recipe, /No se asigna a un paso sin evidencia inequívoca/)
})

test('Agenda no se duplica como evento independiente', () => {
  assert.doesNotMatch(recipe, /insert into public\."events"/)
  assert.match(recipe, /insert into public\."outings"/)
  assert.match(recipe, /insert into public\."cult_occurrences"/)
  assert.match(recipe, /insert into public\."outing_series"/)
})

test('las fuentes directas trazan imágenes, pasos, cultos, salida y música', () => {
  for (const url of [
    'drive.google.com/file/d/1npeoMWaU1xox46apKEOOlKwk__QXKjc-',
    'passionaevensis.blogspot.com/2026/03/',
    'passionaevensis.blogspot.com/2026/04/',
    'soledadcantillana.blogspot.com/2009/11/viernes-santo.html',
    'soledadcantillana.blogspot.com/2009/11/paso-del-calvario.html',
    'archisevilla.org/la-soledad-de-cantillana-y-su-ermita-ii/',
  ]) assert.match(recipe, new RegExp(url.replaceAll('.', '\\.')))
  assert.match(recipe, /insert into public\."source_links"/)
})
