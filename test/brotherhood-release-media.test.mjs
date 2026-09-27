import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las novedades conservan la fotografía documentada, opcional y sin recorte', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const page = read('app/hermandades/[slug]/page.js')
  const component = read('components/BrotherhoodHeritageUpdates.js')
  const css = read('components/BrotherhoodHeritageUpdates.module.css')

  assert.match(loader, /public_image_path, public_image_alt, public_image_credit/)
  assert.match(loader, /heritageUpdateTargetById\.get\(update\.target_entity_id\)/)
  assert.match(page, /<BrotherhoodHeritageUpdates[\s\S]*?items=\{h\.estrenos\}/)
  assert.match(component, /const imageSrc = String\(item\.imagen\?\.src \|\| ''\)\.trim\(\)/)
  assert.match(component, /imageSrc \? \([\s\S]*?className=\{styles\.thumbnail\}/)
  assert.match(component, /item\.imagen\.credito \? <figcaption>\{item\.imagen\.credito\}/)
  assert.match(component, /sizes="52px"/)
  assert.match(component, /className=\{styles\.imageFrame\}[\s\S]*?<Image[^>]*sizes="\(max-width: 700px\) calc\(100vw - 80px\), 640px"/)
  assert.match(css, /\.thumbnail img\s*\{\s*object-fit: contain/)
  assert.match(css, /\.imageFrame img\s*\{\s*object-fit: contain/)
  assert.doesNotMatch(component, /release-card-placeholder|Responsable no documentado/)
})

test('los estrenos pliegan el texto completo y los equipos sin perder los campos', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const component = read('components/BrotherhoodHeritageUpdates.js')

  assert.match(loader, /fecha: displayDate\(update\.update_date\)/)
  assert.match(loader, /agentes,/)
  assert.match(component, /<details className=\{styles\.entry\} id=\{`estreno-\$\{entryKey\}`\}>/)
  assert.doesNotMatch(component, /<details className=\{styles\.entry\}[^>]*\bopen(?:=|\s|>)/)
  assert.match(component, /<summary className=\{styles\.entrySummary\}>\{summary\}<\/summary>/)
  assert.equal((component.match(/\{description\}/g) || []).length, 1)
  assert.match(component, /<dt>Disciplina<\/dt>/)
  assert.match(component, /<dt>Fecha<\/dt>/)
  assert.match(component, /agents\.map\([\s\S]*?<dt>\{agent\.rol\}<\/dt><dd>\{agent\.nombre\}<\/dd>/)
  assert.match(component, /open=\{group\.open\}/)
  assert.match(component, /\{group\.countLabel\}/)
})

test('la ficha aplica los colores corporativos como tema sin mostrarlos como dato', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const page = read('app/hermandades/[slug]/page.js')
  const overview = read('components/BrotherhoodOverviewV2.js')
  const releaseCss = read('components/BrotherhoodHeritageUpdates.module.css')

  assert.match(loader, /colores: colorTheme\(remote\.colors, base\.colores\)/)
  assert.match(page, /'--brotherhood-primary': h\.colores\?\.primario/)
  assert.match(page, /'--brotherhood-secondary': h\.colores\?\.secundario/)
  assert.match(releaseCss, /var\(--brotherhood-primary\)/)
  assert.match(releaseCss, /var\(--brotherhood-light\)/)
  assert.doesNotMatch(overview, /label: 'Colores'/)
  assert.doesNotMatch(overview, /colorNames\.join/)
})
