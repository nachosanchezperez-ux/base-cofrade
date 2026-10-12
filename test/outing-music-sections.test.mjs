import assert from 'node:assert/strict'
import test from 'node:test'
import { isProcessionalOutingMusic, outingMusicSection } from '../lib/outing-music-sections.js'

test('los códigos posicionales reales de producción son acompañamiento procesional', () => {
  const positional = [
    'processional_music', 'after_step', 'mystery', 'palio', 'behind_glory', 'behind_step',
    'cross_guide', 'after_palio', 'opening', 'after_christ', 'opening_band', 'after_procession',
    'head', 'tras_paso', 'after_san_juan_bosco', 'unspecified', 'procession',
  ]
  for (const code of positional) {
    assert.equal(outingMusicSection(code), 'processional', code)
    assert.equal(isProcessionalOutingMusic(code), true, code)
  }
})

test('la música litúrgica, el bando y las notas «other» quedan fuera del acompañamiento', () => {
  assert.equal(outingMusicSection('liturgical_music'), 'liturgical')
  assert.equal(outingMusicSection('announcement_music'), 'announcement')
  assert.equal(outingMusicSection('other'), 'other')
  assert.equal(isProcessionalOutingMusic('liturgical_music'), false)
  assert.equal(isProcessionalOutingMusic('announcement_music'), false)
  assert.equal(isProcessionalOutingMusic('other'), false)
})

test('normaliza mayúsculas, espacios y valores vacíos', () => {
  assert.equal(outingMusicSection('  LITURGICAL_MUSIC '), 'liturgical')
  assert.equal(outingMusicSection(''), 'processional')
  assert.equal(outingMusicSection(null), 'processional')
  assert.equal(outingMusicSection(undefined), 'processional')
})

test('una salida de Gloria con after_step conserva su banda (antes se descartaba)', () => {
  const music = [
    { name: 'Banda A', type: 'after_step' },
    { name: 'Banda B', type: 'behind_glory' },
    { name: 'Coro', type: 'liturgical_music' },
  ]
  assert.deepEqual(
    music.filter((row) => isProcessionalOutingMusic(row.type)).map((row) => row.name),
    ['Banda A', 'Banda B'],
  )
})
