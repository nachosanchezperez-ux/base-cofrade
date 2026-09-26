import assert from 'node:assert/strict'
import test from 'node:test'
import { bandSeoIdentity } from '../lib/bands/seo.js'

test('bandSeoIdentity conserva nombres que ya incluyen su tipología', () => {
  assert.equal(
    bandSeoIdentity({
      popularName: 'Agrupación Musical Virgen de los Reyes',
      type: 'Agrupación Musical',
    }),
    'Agrupación Musical Virgen de los Reyes'
  )
  assert.equal(
    bandSeoIdentity({
      popularName: 'Banda del Sol',
      type: 'Cornetas y Tambores',
    }),
    'Banda del Sol'
  )
})

test('bandSeoIdentity añade la formación cuando el nombre popular no la explica', () => {
  assert.equal(
    bandSeoIdentity({
      popularName: 'Santa María Magdalena de Arahal',
      type: 'Agrupación Musical',
    }),
    'Agrupación Musical Santa María Magdalena de Arahal'
  )
  assert.equal(
    bandSeoIdentity({
      popularName: 'Maestro Tejera',
      type: 'Banda de Música',
    }),
    'Banda de Música Maestro Tejera'
  )
  assert.equal(
    bandSeoIdentity({
      popularName: 'Tres Caídas de Triana',
      type: 'Cornetas y Tambores',
    }),
    'Banda Tres Caídas de Triana'
  )
})


test('la ficha de Banda permite un title suficientemente largo para conservar la localidad', () => {
  const page = readFileSync(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /compactSeoTitle\(bandSeoIdentity\(band\), 58\)/)
})
