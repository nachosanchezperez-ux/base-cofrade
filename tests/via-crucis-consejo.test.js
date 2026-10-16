import test from 'node:test'
import assert from 'node:assert/strict'
import {
  councilBrotherhoods, councilViaCrucisEditions, councilNextEdition,
  councilExtraordinary2013, councilDayStats, councilIconographyStats,
  councilRepeatedBrotherhoods, councilSummary, pendingBrotherhoods,
  pendingWithoutNextDesignation,
} from '../lib/via-crucis-consejo.js'

test('historical archive has the 50 ordinary editions between 1976 and 2026', () => {
  const years = councilViaCrucisEditions.map((edition) => edition.year)
  assert.equal(years.length, 50)
  assert.equal(new Set(years).size, 50)
  assert.equal(Math.min(...years), 1976)
  assert.equal(Math.max(...years), 2026)
  assert.equal(years.includes(2013), false)
  for (const edition of councilViaCrucisEditions) {
    assert.ok(edition.brotherhood?.href, 'Historical edition links to canonical brotherhood')
    assert.ok(edition.imageName)
  }
})

test('census and remaining brotherhoods never double count a canonical entity', () => {
  assert.equal(councilBrotherhoods.length, 71)
  assert.equal(new Set(councilBrotherhoods.map((item) => item.slug)).size, 71)
  assert.deepEqual(
    { ...councilSummary },
    { editions: 50, representedBrotherhoods: 47, census: 71, pending: 24, withoutNextDesignation: 23 }
  )
  assert.equal(pendingBrotherhoods.length, 24)
  assert.equal(pendingWithoutNextDesignation.length, 23)
  assert.ok(pendingBrotherhoods.some((b) => b.slug === councilNextEdition.brotherhoodSlug))
  assert.ok(!pendingWithoutNextDesignation.some((b) => b.slug === councilNextEdition.brotherhoodSlug))
  assert.ok(pendingBrotherhoods.some((b) => b.name === 'Las Siete Palabras'))
  assert.ok(!pendingBrotherhoods.some((b) => b.name === 'Gran Poder'))
})

test('historical day and iconography distributions exactly partition editions', () => {
  assert.deepEqual(
    Object.fromEntries(councilDayStats.map(({ day, count }) => [day, count])),
    {
      'Madrugada': 8,
      'Lunes Santo': 7,
      'Domingo de Ramos': 6,
      'Martes Santo': 6,
      'Viernes Santo': 6,
      'Miércoles Santo': 5,
      'Jueves Santo': 5,
      'Sábado Santo': 5,
      'Viernes de Dolores': 1,
      'Sábado de Pasión': 1,
      'Domingo de Resurrección': 0,
    }
  )
  assert.deepEqual(Object.fromEntries(councilIconographyStats.map(({ key, count }) => [key, count])), {
    crucificado: 18,
    nazareno: 14,
    cautivo: 7,
    otros: 8,
    yacente: 2,
    mariana: 1,
  })
})

test('extraordinary 2013 and announced 2027 do not pollute ordinary totals', () => {
  assert.equal(councilExtraordinary2013.year, 2013)
  assert.equal(councilExtraordinary2013.plannedStations, 14)
  assert.equal(councilExtraordinary2013.status, 'celebrado_sin_pasos')
  assert.equal(councilNextEdition.status, 'designada')
  assert.equal(councilNextEdition.date, '2027-02-15')
  assert.equal(councilRepeatedBrotherhoods.length, 3)
  assert.deepEqual(
    councilRepeatedBrotherhoods.map((b) => [...b.years].sort()).sort((a,b) => a[0]-b[0]),
    [[1979,1987],[1986,2025],[2009,2020]]
  )
})
