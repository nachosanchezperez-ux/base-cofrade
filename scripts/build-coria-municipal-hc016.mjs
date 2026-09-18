import { mkdirSync, writeFileSync } from 'node:fs'
import plan from './coria-municipal-hc016-plan.json' with { type: 'json' }

function lit(value) {
  if (value == null) return 'null'
  if (Array.isArray(value)) return `ARRAY[${value.map(lit).join(', ')}]::text[]`
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') return `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`
  return `'${String(value).replaceAll("'", "''")}'`
}
const qi = (value) => `"${String(value).replaceAll('"', '""')}"`
function statement(row) {
  const cols = Object.keys(row.data)
  if (row.operation === 'update') {
    const where = row.where_keys.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(' and ')
    const updates = cols.filter((col) => !row.where_keys.includes(col))
    return `update public.${qi(row.table)} set ${updates.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(', ')} where ${where};`
  }
  const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length
    ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}`
    : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}
const coreSql = plan.rows.map(statement).join('\n\n')
mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/coria-municipal-hc016-preflight.sql', `begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/coria-municipal-hc016-core.sql', `begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/coria-municipal-hc016-summary.json', JSON.stringify(plan.summary, null, 2) + '\n')
console.log(JSON.stringify(plan.summary))
