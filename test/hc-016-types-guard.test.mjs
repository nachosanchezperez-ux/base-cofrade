import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBrotherhoodTypesGuard } from '../scripts/hc016-brotherhood-types-guard.mjs'
import { DIRECTORY_TYPES } from '../lib/brotherhood-directory.js'

test('el guard SQL exige un universo explícito, unívoco y sin texto SQL', () => {
  for (const ids of [null, [], ['x'], ["'); COMMIT; --"], ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001']]) {
    assert.throws(() => buildBrotherhoodTypesGuard(ids), /HC016_SCOPE/)
  }
  const sql = buildBrotherhoodTypesGuard(['c0160037-0306-4000-8000-000000000006'])
  assert.match(sql, /RAISE EXCEPTION 'HC016_TYPES/)
  assert.match(sql, /count\(\*\).*<> cardinality\(target_ids\)/)
  assert.match(sql, /cardinality\(b.brotherhood_types\) = 0/)
  assert.match(sql, /count\(DISTINCT t\)/)
  for (const { type } of DIRECTORY_TYPES) assert.ok(sql.includes(`'${type}'`))
  assert.doesNotMatch(sql.split('\n').filter((line) => !line.startsWith('--')).join('\n'), /\b(?:INSERT|UPDATE|DELETE|ALTER|CREATE|COMMIT|ROLLBACK)\b/)
})
