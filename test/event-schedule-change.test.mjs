import test from 'node:test'
import assert from 'node:assert/strict'
import { withEventScheduleChange, retainCalendarItem } from '../lib/event-schedule-change.js'
import { agendaItemVEvent, brotherhoodCalendarItems } from '../lib/agenda-ics.js'
import { agendaEventJsonLd } from '../lib/agenda-event-jsonld.js'
import { withProcessionLiveState } from '../lib/procession-live-status.js'
import { scheduleChangePayload, scheduleReviewKey } from '../lib/panel/schedule-change-core.js'
const base = { id: 'a', key: 'devotions:a', title: 'Besamanos', category: 'devotions', date: '2026-11-14', endDate: '2026-11-15', isPast: false, isUpcoming: true, organizerHref: '/hermandades/amparo-sevilla' }
const change = { previousDate: '2026-11-14', revision: 2, changedAt: '2026-11-07T20:00:00Z', reason: 'Aplazamiento', sourceUrl: 'https://example.org/comunicado' }
test('aplazado fuera de Próximos y nunca vuelve a estar en curso', () => {
 const item = withEventScheduleChange({ ...base, eventStatus: 'postponed' }, change)
 assert.equal(item.isUpcoming, false)
 assert.equal(item.scheduleStatusLabel, 'Aplazado · Nueva fecha por anunciar')
 assert.equal(withProcessionLiveState(item, new Date('2026-11-14T12:00:00Z')).liveState.isLive, false)
 assert.equal(agendaEventJsonLd(item).eventStatus, 'https://schema.org/EventPostponed')
})
test('el feed retira la convocatoria antigua con mismo UID incluso después de su fecha', () => {
 const old = agendaItemVEvent(base)
 const item = withEventScheduleChange({ ...base, eventStatus: 'postponed', isPast: true }, change)
 const next = agendaItemVEvent(item)
 assert.equal(next.find(l => l.startsWith('UID:')), old.find(l => l.startsWith('UID:')))
 assert.ok(next.includes('STATUS:CANCELLED'))
 assert.ok(next.includes('SEQUENCE:2'))
 assert.ok(next.includes('LAST-MODIFIED:20261107T200000Z'))
 assert.equal(retainCalendarItem(item), true)
 assert.equal(brotherhoodCalendarItems([item], 'amparo-sevilla').length,1)
 assert.ok(next.includes('DTSTART;VALUE=DATE:20261114'))
})
test('reprogramado: nueva fecha, misma identidad y fecha anterior en JSON-LD', () => {
 const item = withEventScheduleChange({ ...base, date: '2026-12-01', endDate:'2026-12-02', eventStatus: 'rescheduled' }, change)
 assert.equal(item.isUpcoming,true)
 assert.ok(agendaItemVEvent(item).includes('STATUS:CONFIRMED'))
 assert.ok(agendaItemVEvent(item).includes('DTSTART;VALUE=DATE:20261201'))
 assert.equal(agendaEventJsonLd(item).previousStartDate, '2026-11-14')
 assert.equal(agendaEventJsonLd(item).eventStatus, 'https://schema.org/EventRescheduled')
})
test('Panel exige revisión del valor actual, motivo y fuente; no permite usar una revisión antigua', () => {
 const previous = { id:'a', start_date:'2026-11-14', end_date:'2026-11-15', event_status:'announced', schedule_change:{} }
 const form = new FormData()
 assert.throws(() => scheduleChangePayload(form,previous,'2026-11-14','postponed','start_date'), /Revisa/)
 form.set('schedule_reviewed','yes');form.set('schedule_review_key',scheduleReviewKey('a','2026-11-14','2026-11-14','postponed','2026-11-15','2026-11-15'))
 assert.throws(() => scheduleChangePayload(form,previous,'2026-11-14','postponed','start_date'),/motivo/)
 form.set('schedule_reason','Lluvia');form.set('schedule_source','https://example.org/comunicado')
 assert.equal(scheduleChangePayload(form,previous,'2026-11-14','postponed','start_date').schedule_change.reason,'Lluvia')
 assert.throws(() => scheduleChangePayload(form,previous,'2026-11-16','postponed','start_date'),/Revisa/)
 form.set('end_date','2026-11-16')
 assert.throws(() => scheduleChangePayload(form,previous,'2026-11-14','postponed','start_date'),/Revisa/)
})

test('el lector tolera solo la columna ausente; otros fallos no ocultan una agenda incompleta', async () => {
 const { readFileSync } = await import('node:fs')
 const source = readFileSync(new URL('../lib/supabase/event-schedule-change.js', import.meta.url), 'utf8').replace(/^import .*\n/gm, '').replace(/^export /gm, '')
 const reader = (result) => new Function('createPublicClient','withEventScheduleChange', `${source}; return withScheduleChanges`)(() => ({ from: () => ({ select: () => ({ in: async () => result }) }) }), withEventScheduleChange)
 assert.deepEqual(await reader({ error:{ code:'42703', message:'column schedule_change does not exist' } })([base],'outings'),[withEventScheduleChange(base)])
 await assert.rejects(reader({ error:{ code:'57014', message:'timeout' } })([base],'outings'),/timeout/)
 const [item] = await reader({ data:[{ id:base.id, event_status:'postponed', schedule_change:change }] })([base],'outings')
 assert.equal(item.isUpcoming,false)
 assert.equal(item.scheduleChange.revision,2)
})

test('Panel registra una fecha anterior documentada cuando la nueva ya estaba publicada', () => {
 const previous = { id:'a', outing_date:'2026-11-15', event_status:'announced', schedule_change:{} }
 const form = new FormData()
 form.set('schedule_reviewed','yes');form.set('schedule_review_key',scheduleReviewKey('a','2026-11-15','2026-11-15','rescheduled'))
 form.set('schedule_reason','Lluvia');form.set('schedule_source','https://example.org/comunicado')
 assert.throws(() => scheduleChangePayload(form,previous,'2026-11-15','rescheduled'),/fecha anterior/)
 form.set('schedule_previous_date','2026-11-08')
 assert.equal(scheduleChangePayload(form,previous,'2026-11-15','rescheduled').schedule_change.previousDate,'2026-11-08')
})


test('una ficha reprogramada pasada no vuelve a Próximos si el lector no expone isPast', () => {
 const item = { id:'historical', date:'2020-01-01', eventStatus:'rescheduled', isUpcoming:false }
 assert.equal(withEventScheduleChange(item).isUpcoming,false)
})
