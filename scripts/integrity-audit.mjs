#!/usr/bin/env node
// Hilo Cofrade · control de integridad de la enciclopedia (solo lectura).
//
// Uso:
//   node scripts/integrity-audit.mjs [--out=dir] [--fail-on=never|error|warning] [--today=YYYY-MM-DD]
//
// Credenciales (variables de entorno, nunca en el repositorio):
//   NEXT_PUBLIC_SUPABASE_URL                 obligatoria
//   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY     modo público (recomendado para ejecuciones periódicas)
//   SUPABASE_SECRET_KEY                      modo completo (opcional; activa dos comprobaciones más)
//
// Genera <out>/integrity-report.json e <out>/integrity-report.md. No escribe en la base de datos:
// solo usa select(), y el modo público además está limitado por RLS a lo publicado.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadIntegritySnapshot } from '../lib/integrity/snapshot.js'
import { runIntegrityChecks } from '../lib/integrity/index.js'
import { integrityExitCode, renderIntegrityMarkdown } from '../lib/integrity/report.js'
import { preservedAgendaEventPaths } from '../lib/agenda-preserved-event-paths.js'

const ALLOWED = {
  mode: ['public', 'full'],
  'fail-on': ['never', 'error', 'warning'],
}

function parseArgs(argv) {
  const args = { out: 'integrity-report', failOn: 'never', today: undefined, mode: undefined }
  for (const raw of argv) {
    const body = raw.replace(/^--?/, '')
    const separator = body.indexOf('=')
    const key = separator === -1 ? body : body.slice(0, separator)
    const value = separator === -1 ? '' : body.slice(separator + 1)
    if (key === 'help' || key === 'h') { args.help = true; continue }
    if (!['out', 'fail-on', 'today', 'mode'].includes(key)) throw new Error(`Argumento desconocido: ${raw}`)
    if (!value) throw new Error(`Falta el valor de --${key}`)
    if (ALLOWED[key] && !ALLOWED[key].includes(value)) throw new Error(`Valor no válido para --${key}: ${value} (usa ${ALLOWED[key].join(', ')})`)
    if (key === 'today' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`--today debe tener el formato AAAA-MM-DD: ${value}`)
    if (key === 'out') args.out = value
    else if (key === 'fail-on') args.failOn = value
    else if (key === 'today') args.today = value
    else if (key === 'mode') args.mode = value
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log('node scripts/integrity-audit.mjs [--out=dir] [--fail-on=never|error|warning] [--today=YYYY-MM-DD] [--mode=public|full]')
    return 0
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const mode = args.mode || (secretKey ? 'full' : 'public')
  const key = mode === 'full' ? secretKey : publishableKey

  if (!url || !key) {
    console.error(`[integridad] Faltan credenciales para el modo ${mode}: NEXT_PUBLIC_SUPABASE_URL y ${mode === 'full' ? 'SUPABASE_SECRET_KEY' : 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'}.`)
    return 2
  }

  // Import diferido: las comprobaciones y sus tests no dependen de supabase-js.
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  const started = Date.now()
  const snapshot = await loadIntegritySnapshot(client, { mode, preservedPaths: preservedAgendaEventPaths })
  const result = runIntegrityChecks(snapshot, { mode, today: args.today })
  result.durationMs = Date.now() - started

  await mkdir(args.out, { recursive: true })
  await writeFile(path.join(args.out, 'integrity-report.json'), `${JSON.stringify(result, null, 2)}\n`)
  await writeFile(path.join(args.out, 'integrity-report.md'), renderIntegrityMarkdown(result))

  const { error, warning, incomplete } = result.summary
  console.log(`[integridad] ${mode} · ${error} errores · ${warning} a revisar · ${incomplete} datos incompletos · ${result.durationMs} ms → ${args.out}/`)
  for (const check of result.checks.filter((item) => item.status === 'failed')) console.error(`[integridad] Comprobación fallida ${check.id}: ${check.note}`)

  return integrityExitCode(result, args.failOn)
}

main().then((code) => { process.exitCode = code }).catch((error) => {
  console.error('[integridad] Error:', error instanceof Error ? error.message : error)
  process.exitCode = 2
})
