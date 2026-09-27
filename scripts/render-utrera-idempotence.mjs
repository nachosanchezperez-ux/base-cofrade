import { readFileSync } from 'node:fs'

// Generates SQL only. Execute separately after the same live preflight.
const folder = new URL('../docs/evidence/modelado-utrera-2026-09-27/', import.meta.url)
const sql = readFileSync(new URL('prepared-dry-run.sql', folder), 'utf8')
const snapshot = readFileSync(new URL('rollback-snapshot.sql', folder), 'utf8')
const start = sql.indexOf('DO $utrera$\n')
const end = sql.indexOf('$utrera$;', start) + '$utrera$;'.length
if (start < 0 || end <= start || !sql.includes('\nROLLBACK;') || /^COMMIT;/m.test(sql)) throw new Error('Invalid rollback candidate')
const block = sql.slice(start, end)
const expression = snapshot.slice(snapshot.indexOf('SELECT jsonb_build_object(') + 7).replace(/\s+AS rollback_snapshot;\s*$/, '')
const before = `SELECT set_config('hc016.idempotence',(${expression})::text,true);\n`
const after = `DO $idempotence$ DECLARE actual jsonb; BEGIN SELECT ${expression} INTO actual; IF actual IS DISTINCT FROM current_setting('hc016.idempotence')::jsonb THEN RAISE EXCEPTION 'UTRERA_IDEMPOTENCE_FAILED'; END IF; END $idempotence$;\n`
const result = sql.slice(0, end) + '\n' + before + block + '\n' + after + sql.slice(end)
process.stdout.write(result.replace("'UTRERA_DRY_RUN_PASS_ROLLED_BACK'", "'UTRERA_IDEMPOTENCE_PASS_ROLLED_BACK'"))
