import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { contributionSubmissionHash } from '../lib/contributions/submission-hash.js'

test('duplicados normalizan espacios, Unicode, mayúsculas y orden de fuentes/adjuntos', () => {
  const a = { contributionType: 'correction', title: 'Una CORRECCIÓN', description: 'Dos  datos\n documentados', pageUrl: 'https://hilocofrade.es/', sources: ['https://a.example/', 'https://b.example/'] }
  const b = { ...a, title: 'una correccio\u0301n', description: 'DOS DATOS DOCUMENTADOS', sources: [...a.sources].reverse() }
  assert.equal(contributionSubmissionHash(a, [{ sha256: 'a' }, { sha256: 'b' }]), contributionSubmissionHash(b, [{ sha256: 'b' }, { sha256: 'a' }]))
  assert.notEqual(contributionSubmissionHash(a, []), contributionSubmissionHash({ ...a, description: 'Otro dato' }, []))
})

test('la reserva de hash ocurre dentro del INSERT y no concede un endpoint público', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261002221858_atomic_contribution_reservation.sql', import.meta.url), 'utf8')
  assert.match(sql, /pg_advisory_xact_lock/)
  assert.match(sql, /before insert or update of submission_hash, created_at/i)
  assert.match(sql, /interval '24 hours'/)
  assert.match(sql, /security invoker/i)
  assert.match(sql, /set search_path = ''/)
  assert.match(sql, /errcode = '23505'/)
  assert.match(sql, /from public, anon, authenticated/i)
})
