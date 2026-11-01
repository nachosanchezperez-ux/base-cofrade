import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { gloryDisplayTitle } from '../lib/glory-display.js'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Glory directory reuses the generic outings model without schema-specific hardcodes', async () => {
  const loader = await read('lib/supabase/glory-directory.js')

  assert.match(loader, /\.from\('outings'\)/)
  assert.match(loader, /\.eq\('character', 'ordinary'\)/)
  assert.match(loader, /\.ilike\('outing_type', 'ProcesiÃ³n de Gloria'\)/)
  assert.match(loader, /\.eq\('status', 'published'\)/)
  assert.doesNotMatch(loader, /pastora-de-cantillana|asuncion-de-cantillana/i)
})

test('Glory public routes are discoverable from navigation and sitemap', async () => {
  const [header, sitemap] = await Promise.all([
    read('lib/site-navigation.js'),
    read('app/sitemap.js'),
  ])

  assert.match(header, /\/procesiones-de-gloria/)
  assert.match(header, /Procesiones de Gloria/)
  assert.match(sitemap, /getGloryDirectory/)
  assert.match(sitemap, /absoluteUrl\('\/procesiones-de-gloria'\)/)
  assert.match(sitemap, /gloryEntries\(gloryOutings\)/)
})

test('Glory pages keep directory and individual procession responsibilities separate', async () => {
  const [directoryPage, detailPage, directoryComponent] = await Promise.all([
    read('app/procesiones-de-gloria/page.js'),
    read('app/procesiones-de-gloria/[slug]/page.js'),
  ¶»§q«^