import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { BROTHERHOOD_READING_COHORT, usesBrotherhoodReading } from '../lib/brotherhood-reading-rollout.js';

test('Publication cohort contains only the approved entity IDs', () => {
  assert.deepEqual(BROTHERHOOD_READING_COHORT, [
    '10000000-0000-0000-0000-000000000001',
    '36b4d5c1-f7bb-4025-a09a-948e0d5d188f',
  ]);
  assert.equal(usesBrotherhoodReading(BROTHERHOOD_READING_COHORT[0]), true);
  assert.equal(usesBrotherhoodReading(BROTHERHOOD_READING_COHORT[1]), true);
  assert.equal(usesBrotherhoodReading('00000000-0000-0000-0000-000000000000'), false);
  assert.equal(usesBrotherhoodReading(undefined), false);
  assert.equal(usesBrotherhoodReading('san-esteban'), false);
  assert.equal(Object.isFrozen(BROTHERHOOD_READING_COHORT), true);
});

test('Public rendering resolves the cohort after entity lookup; laboratory remains explicit', () => {
  const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8');
  const lab = readFileSync(new URL('../app/laboratorio/hermandades/[slug]/page.js', import.meta.url), 'utf8');
  assert.match(page, /readingOverride \?\? usesBrotherhoodReading\(h\.id\)/);
  assert.doesNotMatch(page, /slug\s*===\s*['"]el-baratillo/);
  assert.match(lab, /reading: true/);
  assert.match(lab, /VERCEL_ENV === 'production'\) notFound\(\)/);
});