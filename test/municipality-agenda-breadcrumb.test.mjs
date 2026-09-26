import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las guías municipales de la Agenda no muestran la raya decorativa del breadcrumb', () => {
  const breadcrumb = read('components/DirectoryBreadcrumb.js')
  const municipalityHub = read('components/MunicipalityAgendaHub.js')

  assert.match(breadcrumb, /showAccent = true/)
  assert.match(breadcrumb, /showAccent \? <span className=\{styles\.accent\}/)
  assert.match(municipalityHub, /<DirectoryBreadcrumb showAccent=\{false\}/)
})
