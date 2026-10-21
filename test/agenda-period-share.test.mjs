import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaPeriodShare } from '../lib/share.js'

const day = (date, weekdayLabel) => ({ temporalDate: date, temporalDateInfo: { weekdayLabel } })

test('la agenda del fin de semana sale en un mensaje por días, con hora y localidad', () => {
  const share = agendaPeriodShare({
    period: 'weekend',
    path: '/agenda-cofrade/fin-de-semana',
    dateCaption: 'sábado 24 de octubre · domingo 25 de octubre',
    items: [
      { ...day('2026-10-24', 'Sábado, 24 de octubre'), title: 'Rosario de la Aurora', startTime: '09:30', municipality: 'Sevilla' },
      { ...day('2026-10-24', 'Sábado, 24 de octubre'), title: 'Triduo', timeText: 'A las 20.00 horas', municipality: 'Utrera' },
      { ...day('2026-10-25', 'Domingo, 25 de octubre'), title: 'Procesión', timeText: 'Según calendario anual', municipality: 'Écija' },
      { ...day('2026-10-25', 'Domingo, 25 de octubre'), title: 'Suspendido', isCancelled: true },
    ],
  })
  assert.match(share.text, /^🗓️ Agenda cofrade · Fin de semana\n/)
  assert.match(share.text, /\*Sábado, 24 de octubre\*\n• 09:30 · Rosario de la Aurora \(Sevilla\)\n• 20:00 · Triduo \(Utrera\)/)
  assert.match(share.text, /\*Domingo, 25 de octubre\*\n• Procesión \(Écija\)/)
  assert.doesNotMatch(share.text, /Suspendido/)
  assert.match(share.text, /https:\/\/hilocofrade\.es\/agenda-cofrade\/fin-de-semana$/)
  assert.doesNotMatch(share.text, /\n\n\n/)
})

test('un solo día no repite el día y se recorta con «y N actos más»', () => {
  const items = Array.from({ length: 5 }, (_, index) => ({ ...day('2026-10-21', 'Miércoles, 21 de octubre'), title: `Acto ${index + 1}` }))
  const share = agendaPeriodShare({ period: 'today', path: '/agenda-cofrade/hoy', items }, { maxItems: 3 })
  assert.doesNotMatch(share.text, /\*Miércoles/)
  assert.match(share.text, /• Acto 3\n…y 2 actos más/)
  assert.equal(agendaPeriodShare({ period: 'today', items: [] }), null)
})

test('la lista del periodo ofrece compartir la agenda entera', () => {
  const list = readFileSync(new URL('../components/AgendaTemporalEventList.js', import.meta.url), 'utf8')
  assert.match(list, /<ShareActions share=\{periodShare\} contentType="agenda_period"/)
})
