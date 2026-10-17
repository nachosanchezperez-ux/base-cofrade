import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  brotherhoodFactSentence,
  brotherhoodFoundingYear,
  brotherhoodSeatJsonLd,
  processionDayPhrase,
} from '../lib/seo.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la frase de hechos usa solo datos publicados, con artículos correctos', () => {
  assert.equal(
    brotherhoodFactSentence({ nombrePopular: 'La Macarena', localidad: 'Sevilla', tipos: ['Penitencia'], sede: 'Basílica de Santa María de la Esperanza Macarena', diaSalida: 'Madrugada' }),
    'La Macarena es una hermandad de penitencia de Sevilla, con sede en la Basílica de Santa María de la Esperanza Macarena. Sale en procesión en la Madrugada.'
  )
  assert.equal(
    brotherhoodFactSentence({ nombrePopular: 'Los Gitanos', localidad: 'Sevilla', tipos: ['Penitencia'], barrio: 'San Román', sede: 'Santuario de los Gitanos' }),
    'Los Gitanos es una hermandad de penitencia de Sevilla (San Román), con sede en el Santuario de los Gitanos.'
  )
  assert.equal(
    brotherhoodFactSentence({ nombrePopular: 'Amargura de Dos Hermanas', localidad: 'Dos Hermanas', tipos: ['Penitencia'], fundacion: 'Fundada en 1931' }),
    'Amargura de Dos Hermanas es una hermandad de penitencia. Fundada en 1931.'
  )
})

test('no fuerza datos ambiguos: barrios compuestos, «Centro», días sin forma segura', () => {
  const sentence = brotherhoodFactSentence({ nombrePopular: 'X', localidad: 'Sevilla', tipos: ['Gloria'], barrio: 'Triana · Barrio León', diaSalida: 'Romería del Rocío' })
  assert.equal(sentence, 'X es una hermandad de Gloria de Sevilla.')
  assert.equal(brotherhoodFactSentence({ nombrePopular: 'Y', localidad: 'Sevilla', barrio: 'Centro' }), 'Y es una hermandad de Sevilla.')
  assert.equal(processionDayPhrase('Pendiente de confirmar'), '')
  assert.equal(processionDayPhrase('Septiembre'), 'en septiembre')
  assert.equal(processionDayPhrase('8 de septiembre'), 'el 8 de septiembre')
  assert.equal(processionDayPhrase('Último domingo de mayo'), 'el último domingo de mayo')
  assert.equal(processionDayPhrase('Domingo de Ramos · tarde'), 'el Domingo de Ramos')
})

test('el año de fundación solo se publica cuando el texto es inequívoco', () => {
  assert.equal(brotherhoodFoundingYear('1948'), '1948')
  assert.equal(brotherhoodFoundingYear('Fundada en 1931'), '1931')
  assert.equal(brotherhoodFoundingYear('1601; primeras reglas conocidas aprobadas el 3 de febrero de 1601'), '')
  assert.equal(brotherhoodFoundingYear('Siglo XVI'), '')
})

test('la sede se publica como Place con la dirección desglosada', () => {
  assert.deepEqual(
    brotherhoodSeatJsonLd({ nombre: 'Parroquia de San Isidro Labrador', direccion: 'Plaza María Santísima del Amor, s/n, 41015 Sevilla', localidad: 'Sevilla', provincia: 'Sevilla', latitud: null, longitud: null }),
    { '@type': 'Place', name: 'Parroquia de San Isidro Labrador', address: { '@type': 'PostalAddress', streetAddress: 'Plaza María Santísima del Amor, s/n', postalCode: '41015', addressLocality: 'Sevilla', addressRegion: 'Sevilla', addressCountry: 'ES' } }
  )
  assert.equal(brotherhoodSeatJsonLd(null), null)
  assert.equal(brotherhoodSeatJsonLd({ nombre: 'Basílica', direccion: 'Calle Bécquer, 1, Sevilla', localidad: 'Sevilla', provincia: 'Sevilla' }).address.streetAddress, 'Calle Bécquer, 1')
  assert.equal(brotherhoodSeatJsonLd({ nombre: 'Capilla', direccion: 'Alcalá de Guadaíra, Sevilla', localidad: 'Alcalá de Guadaíra', provincia: 'Sevilla' }).address.streetAddress, undefined)
  assert.equal(brotherhoodSeatJsonLd({ nombre: 'Capilla', direccion: 'Dos Hermanas', localidad: 'Dos Hermanas', provincia: 'Sevilla' }).address.streetAddress, undefined)
})

test('la ficha publica sede, descripción, fundación y la miga de la localidad', () => {
  const page = read('app/hermandades/[slug]/page.js')
  assert.match(page, /description: brotherhoodFactSentence\(h\)/)
  assert.match(page, /\.\.\.\(seatJsonLd \? \{ location: seatJsonLd \} : \{\}\)/)
  assert.match(page, /foundingDate: brotherhoodFoundingYear\(h\.fundacion\)/)
  assert.match(page, /\{ name: publicText\(h\.localidad\), path: municipalityHubHref \}/)
})
