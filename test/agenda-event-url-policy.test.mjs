import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaEventDetailHref, allowAgendaSitemapUrl } from '../lib/agenda-event-url-policy.js'

test('preserva la ficha publicada del Cautivo sin cambiar su URL', () => {
 const slug = 'rosario-vespertino-esperanza-cautivo-dos-hermanas-2026'
 assert.equal(agendaEventDetailHref({ id:'old',slug },'agenda-cofrade/rosarios'),`/agenda-cofrade/rosarios/${slug}`)
 assert.equal(allowAgendaSitemapUrl(`https://hilocofrade.es/agenda-cofrade/rosarios/${slug}`),true)
})

test('un alta puntual y una edición futura no generan páginas ni entradas de sitemap', () => {
 for(const [family,category] of [['agenda-cofrade/rosarios','rosaries'],['extraordinarias','processions'],['procesiones-de-gloria','processions']]) {
  const href=agendaEventDetailHref({id:'future',slug:'nuevo-acto-2027'},family)
  assert.equal(href,`/agenda-cofrade#acto-${category}-future`)
  assert.equal(allowAgendaSitemapUrl(`https://hilocofrade.es/${family}/nuevo-acto-2027`),false)
  assert.equal(allowAgendaSitemapUrl(href),false)
 }
})

test('conserva hubs municipales, agenda y entidades; un traslado abre su categoría correcta', () => {
 for(const path of ['/agenda-cofrade','/agenda-cofrade/localidad/dos-hermanas','/hermandades/el-baratillo']) assert.equal(allowAgendaSitemapUrl(path),true)
 assert.equal(agendaEventDetailHref({id:'future',slug:'traslado-nuevo',outingType:'Traslado'},'extraordinarias'),'/agenda-cofrade#acto-transfers-future')
})
