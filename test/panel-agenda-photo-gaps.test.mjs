import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaPhotoGaps } from '../lib/panel/agenda-photo-gaps-core.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const cover = { path: 'https://x.supabase.co/storage/v1/object/public/hilo-media/a.jpg', credit: 'Fotografía · Ana' }

test('el aviso lista los actos próximos sin foto propia y dice qué se ve ahora', () => {
  const gaps = agendaPhotoGaps({
    rosaries: [{ id: 'o1', title: 'Rosario', date: '2026-10-24', isUpcoming: true, crestPath: '/e.png', brotherhoodName: 'Pino Montano' }],
    // Mismo rosario extraordinario por dos fuentes: aparece una vez.
    extraordinary: [
      { id: 'o1', title: 'Rosario', date: '2026-10-24', isUpcoming: true, crestPath: '/e.png' },
      { id: 'o2', title: 'Con foto', date: '2026-10-25', isUpcoming: true, heroImagePath: '/f.jpg' },
    ],
    glories: [{ id: 'o3', title: 'Lejos', date: '2026-12-01', isUpcoming: true }],
    generalOutings: [{ id: 'o4', title: 'Pasada', date: '2026-10-19', isUpcoming: false }],
    devotions: [
      { id: 'occ1', cultId: 'c1', title: 'Triduo', date: '2026-10-21', isUpcoming: true, titularCover: cover, titularName: 'Amor' },
      { id: 'occ2', cultId: 'c2', title: 'Novena', date: '2026-10-22', isUpcoming: true, eventCover: cover },
    ],
    concerts: [{ id: 'e1', title: 'Concierto', date: '2026-10-30', isUpcoming: true }],
  }, { days: 15, today: '2026-10-20' })

  assert.deepEqual(gaps.map((gap) => [gap.kind, gap.title, gap.shows]), [
    ['cult', 'Triduo', 'titular'],
    ['outing', 'Rosario', 'crest'],
    ['concert', 'Concierto', 'nothing'],
  ])
  assert.equal(gaps[0].cultId, 'c1')
})

test('el Panel enlaza cada acto a donde se sube su foto y solo lo ven editores', () => {
  const source = read('lib/panel/agenda-photo-gaps.js')
  assert.match(source, /\/panel\/hermandades\/\$\{brotherhoodId\}\/salidas#outing-\$\{gap\.id\}/)
  assert.match(source, /\/panel\/hermandades\/\$\{brotherhoodId\}\/multimedia#contenido-\$\{gap\.cultId\}/)
  assert.match(source, /\/panel\/multimedia\?entity=\$\{gap\.id\}/)
  const page = read('app/panel/(protected)/page.js')
  assert.match(page, /canEdit && photoGaps\.length/)
  assert.match(page, /getAgendaPhotoGaps\(\{ days: 15 \}\)/)
})

test('los cultos admiten foto o cartel y el cartel no se recorta', () => {
  const form = read('app/panel/(protected)/hermandades/[id]/multimedia/QuickMediaUploadForm.js')
  assert.match(form, /name="presentation" value="poster"/)
  assert.match(read('app/panel/(protected)/hermandades/[id]/multimedia/page.js'), /allowPoster=\{kind === 'cult'\}/)
  assert.match(read('app/panel/(protected)/hermandades/[id]/multimedia/actions.js'), /fit_mode: value\(formData, 'presentation'\) === 'poster' \? 'contain' : 'cover'/)
})

test('cualquier cambio de foto refresca la Agenda y sus páginas de periodo', () => {
  assert.match(read('lib/panel/revalidate-agenda.js'), /revalidatePath\('\/agenda-cofrade', 'layout'\)/)
  for (const path of [
    'app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions.js',
    'app/panel/(protected)/hermandades/[id]/multimedia/actions.js',
    'app/panel/(protected)/hermandades/[id]/multimedia/manage-actions.js',
    'app/panel/(protected)/multimedia/actions.js',
  ]) assert.match(read(path), /revalidateAgendaPhotos\(\)/, path)
  assert.doesNotMatch(read('app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions.js'), /revalidatePath\('\/glorias'\)/)
})
