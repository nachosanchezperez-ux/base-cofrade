import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formatCultOccurrenceDate } from '../lib/cults/occurrences.js';

test('Un culto de un día sin fecha de fin se muestra con su día', () => {
  assert.equal(formatCultOccurrenceDate('2026-11-08', null), '8 NOV');
  assert.equal(formatCultOccurrenceDate('2026-11-08', ''), '8 NOV');
  assert.equal(formatCultOccurrenceDate('2026-11-08'), '8 NOV');
  assert.equal(formatCultOccurrenceDate('2026-11-14', '2026-11-15'), '14–15 NOV');
});

test('La ficha no descarta los cultos futuros sin fecha de fin', () => {
  const source = readFileSync(new URL('../lib/supabase/brotherhoods.js', import.meta.url), 'utf8');
  assert.match(source, /end_date\.is\.null,start_date\.gte\./);
  assert.doesNotMatch(source, /\.gte\('end_date', today\)/);
});
