// #1253 · Jerarquía visual de portada y actualidad, sin bloques nuevos.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('agenda: la primera cita es la principal; reserva e igualás, compactas', () => {
  const agenda = read('components/HomeAgendaNow.js')
  assert.match(agenda, /current\.cards\.map\(\(card, index\) => <AgendaRow card=\{card\} key=\{card\.key\} variant=\{index === 0 \? 'lead' : undefined\} \/>\)/)
  assert.match(agenda, /agenda\.upcoming\.map\(\(card, index\) => <AgendaRow card=\{card\} key=\{card\.key\} variant=\{index === 0 \? 'lead' : 'compact'\} \/>\)/)
  assert.match(read('components/HomeCrewCalls.js'), /<li className=\{agendaStyles\.row\} data-variant="compact">/)
  const css = read('components/HomeAgendaNow.module.css')
  assert.match(css, /\.row\[data-variant="lead"\] \.time \{\s*font-size: 28px;/)
  assert.match(css, /\.row\[data-variant="compact"\] \.time \{\s*font-size: 16px;/)
})

test('El Hilo se mueve en portada: una principal con foto y titulares secundarios', async () => {
  const block = read('components/HomeUpdatesLink.js')
  assert.match(block, /const \[lead, \.\.\.secondary\] = items/)
  assert.match(block, /<LeadStory item=\{lead\}/)
  assert.match(block, /data-home-news="secondary"/)
  assert.match(block, /href="\/el-hilo-se-mueve">Ver todas</)
  // Escudos y enlace a las fichas en todas las noticias.
  assert.equal((block.match(/<Crest item=\{item\}/g) || []).length, 3)
  assert.equal((block.match(/item\.discover\.href/g) || []).length, 2)

  const { buildHomeNews } = await import('../lib/home-news.js')
  const [withCover, withoutCover] = buildHomeNews([
    { id: 'a', href: '/el-hilo-se-mueve/a', title: 'A', topic: 'musica', protagonist: { id: 'h1', label: 'H1' }, announcedOn: '2026-10-12', cover: { path: '/h1.jpg', alt: 'Foto H1', focusPosition: '50% 30%' } },
    { id: 'b', href: '/el-hilo-se-mueve/b', title: 'B', topic: 'agenda', protagonist: { id: 'h2', label: 'H2' }, announcedOn: '2026-10-11' },
  ], 3)
  assert.deepEqual(withCover.photo, { src: '/h1.jpg', alt: 'Foto H1', focusPosition: '50% 30%' })
  assert.equal(withoutCover.photo, null)
})

test('Descubre: la ficha del día es el único bloque azul; marcha y juego en blanco', () => {
  const discover = read('components/HomeDiscover.module.css')
  assert.match(discover, /\.ghost \{\s*display: none;/)
  assert.match(discover, /min-height: 60px;/)
  const today = read('components/HomeTodayV2.js')
  assert.match(today, /data-home-weight=\{embedded \? 'secondary' : undefined\}/)
  assert.match(today, /variant=\{embedded \? 'default' : 'inverse'\}/)
  const todayCss = read('components/HomeTodayV2.module.css')
  assert.match(todayCss, /\.embedded \.featureCard \{[^}]*background: linear-gradient\(140deg, var\(--home-blue\)/)
  assert.match(todayCss, /\.embedded \.musicCard \{[^}]*background: #fff;/)
  assert.match(read('components/HiddenThreadTeaser.module.css'), /border: 1\.5px solid #74273c;\s*background: transparent;/)
  assert.match(today, /embedded \? gameStyles\.teaserFeature : ''/)
  assert.match(today, /href="\/juegos\/el-hilo-escondido"/)
  assert.doesNotMatch(read('components/HiddenThreadTeaser.module.css').slice(read('components/HiddenThreadTeaser.module.css').indexOf('.teaserFeature.teaserFeature')), /linear-gradient|box-shadow: 0/)
  // «Más en Hilo Cofrade»: etiquetas ligeras; no se retira ningún acceso.
  assert.match(read('components/HomeDiscover.module.css'), /\.moreLink \{\s*display: inline-flex;[\s\S]*border-radius: 999px;/)
  assert.match(read('lib/home-discover.js'), /'\/igualas-y-ensayos'/)
  assert.match(read('components/HomeKnowledgeThreads.module.css'), /\.embedded \.leadCard::before \{\s*display: none;/)
  // Sin bloques nuevos: los mismos cinco de la portada.
  const home = read('components/HomePageV2.js')
  assert.equal((home.match(/<(HomeHero|HomeAgendaNow|section|HomeUpdatesLink|HomeDiscover)\b/g) || []).length, 5)
})

test('índice de noticias: principal, secundarias discretas y archivo', () => {
  const hub = read('app/el-hilo-se-mueve/page.js')
  assert.match(hub, /<HiloMovementCards items=\{selected\.slice\(0, 1\)\} headingLevel=\{2\} featured \/>/)
  assert.match(hub, /<HiloMovementCards items=\{selected\.slice\(1, HILO_INDEX_CARDS\)\} headingLevel=\{3\} secondary \/>/)
  assert.match(hub, /compact anchors/)
  const cards = read('components/HiloMovementCards.js')
  assert.match(cards, /secondary = false/)
  assert.match(cards, /\{!compact && !secondary \? <ShareActions compact/)
  // El titular es el enlace: sin «Leer la noticia» ni «con efecto desde» en el segundo nivel.
  assert.match(cards, /\{!secondary \? <Link className=\{styles\.more\}/)
  // Sin foto real, el segundo nivel no repite la ilustración del escudo.
  assert.match(cards, /const thumbless = secondary && !hiloMovementPhoto\(item\)/)
  // Las fichas y la página de cada noticia siguen usando la tarjeta de siempre.
  assert.doesNotMatch(read('components/HiloMovementsSection.js'), /secondary/)
})

test('estilos de la portada: «Hoy» en una sola hoja y colores con nombre', () => {
  const today = read('components/HomeTodayV2.js')
  assert.doesNotMatch(today, /HomeTodayMobileFix|HomeTodayDynamic|HomeResponsivePolish/)
  const tokens = read('app/home-tokens.css')
  for (const name of ['--home-ink', '--home-blue', '--home-red', '--home-muted', '--home-line']) assert.match(tokens, new RegExp(`${name}: #`))
  assert.match(read('app/layout.js'), /import '\.\/home-tokens\.css'/)
  // Los colores principales ya no se repiten como literales en las hojas de la portada.
  for (const file of ['components/HomeTodayV2.module.css', 'components/HomeAgendaNow.module.css', 'components/HomeUpdatesLink.module.css', 'components/HomeDiscover.module.css']) {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '')
    assert.doesNotMatch(css, /#(0f2742|123a67|b71f37)\b/i, file)
  }
})
