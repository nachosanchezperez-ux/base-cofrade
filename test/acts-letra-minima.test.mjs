import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Revisión de calidad en móvil (25/10/2026): en extraordinarias, fichas de acto e
// igualás había rótulos de 8 a 11 px. Mínimo de 12 px, como la portada (#1345).
const FILES = [
  'components/ExtraordinaryDirectory.module.css',
  'components/AgendaRelationLinks.module.css',
  'components/ExtraordinarySeo.module.css',
  'components/ProcessionRoute.module.css',
  'components/CrewEventDirectory.module.css',
  'app/extraordinarias/[slug]/extraordinary-detail.module.css',
  'app/extraordinarias/[slug]/extraordinary-journey.module.css',
  'app/extraordinarias/[slug]/extraordinary-media.module.css',
  'app/procesiones-de-gloria/[slug]/glory-detail.module.css',
  'app/igualas-y-ensayos/[slug]/crew-event-detail.module.css',
]

test('ningún texto por debajo de 12 px en las fichas de acto y sus listados', () => {
  for (const file of FILES) {
    const css = readFileSync(file, 'utf8')
    for (const [, value, unit] of css.matchAll(/font-size:\s*([0-9]*\.?[0-9]+)(px|rem)\b/g)) {
      const px = unit === 'px' ? Number(value) : Number(value) * 16
      assert.ok(px >= 12, `${file}: font-size ${value}${unit}`)
    }
  }
})
