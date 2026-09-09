import { execFileSync, spawnSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'

const DEFAULT_MANIFEST = 'docs/BRANCH-CLEANUP-CANDIDATES-2026-09-09.csv'
const DEFAULT_RECOVERY_REF = 'archive/pre-cleanup-20260909'
const DEFAULT_RECOVERY_SHA = '1261c3d1d7da023faa0449ed2cd2b69fef7fabe1'
const EXPECTED_REPOSITORY = 'nachosanchezperez-ux/base-cofrade'
const ALLOWED_BASES = new Set(['merged_ancestor', 'patch_equivalent', 'merged_pr_exact_tip'])
const CHUNK_SIZE = 40

function option(name, fallback = null) {
  const prefix = `${name}=`
  const inline = process.argv.find((argument) => argument.startsWith(prefix))
  if (inline) return inline.slice(prefix.length)
  const index = process.argv.indexOf(name)
  if (index !== -1) return process.argv[index + 1] || fallback
  return fallback
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.silentStderr ? 'ignore' : 'pipe'],
  }).trim()
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(field)
      field = ''
    } else if (character === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (character !== '\r') {
      field += character
    }
  }

  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

function readCandidates(path) {
  const rows = parseCsv(readFileSync(path, 'utf8'))
  const headers = rows.shift() || []
  const expectedHeaders = ['branch', 'sha', 'classification', 'basis']
  if (headers.join(',') !== expectedHeaders.join(',')) {
    throw new Error(`Cabecera inesperada en ${path}: ${headers.join(',')}`)
  }

  return rows.filter((row) => row.some(Boolean)).map(([branch, sha, classification, basis]) => ({
    branch,
    sha,
    classification,
    basis,
  }))
}

function remoteBranches() {
  const output = git(['ls-remote', '--heads', 'origin'])
  return new Map(output.split('\n').filter(Boolean).map((line) => {
    const [sha, ref] = line.split(/\s+/)
    return [ref.replace(/^refs\/heads\//, ''), sha]
  }))
}

function assertSafe(candidates, expectedCount, recoveryRef, recoverySha) {
  if (candidates.length !== expectedCount) {
    throw new Error(`El manifiesto contiene ${candidates.length} ramas; se esperaban ${expectedCount}`)
  }

  const seen = new Set()
  for (const candidate of candidates) {
    if (!candidate.branch || seen.has(candidate.branch)) {
      throw new Error(`Rama vacía o duplicada: ${candidate.branch || '(vacía)'}`)
    }
    seen.add(candidate.branch)

    if (!/^[0-9a-f]{40}$/.test(candidate.sha)) {
      throw new Error(`SHA inválido para ${candidate.branch}: ${candidate.sha}`)
    }
    if (!ALLOWED_BASES.has(candidate.basis)) {
      throw new Error(`Base de limpieza no autorizada para ${candidate.branch}: ${candidate.basis}`)
    }
    if (
      candidate.branch === 'main'
      || candidate.branch.startsWith('archive/')
      || candidate.branch.startsWith('release/')
    ) {
      throw new Error(`Rama protegida por política incluida en el manifiesto: ${candidate.branch}`)
    }

    const checked = spawnSync('git', ['check-ref-format', `refs/heads/${candidate.branch}`], {
      cwd: process.cwd(),
      stdio: 'ignore',
    })
    if (checked.status !== 0) throw new Error(`Nombre de rama inválido: ${candidate.branch}`)
  }

  const remote = remoteBranches()
  const mismatches = candidates.filter(({ branch, sha }) => remote.get(branch) !== sha)
  if (mismatches.length) {
    throw new Error(`Preflight abortado: ${mismatches.length} ramas no coinciden con su SHA esperado`)
  }

  if (remote.get(recoveryRef) !== recoverySha) {
    throw new Error(`La rama de recuperación ${recoveryRef} no coincide con ${recoverySha}`)
  }
}

function deleteCandidates(candidates) {
  for (let index = 0; index < candidates.length; index += CHUNK_SIZE) {
    const chunk = candidates.slice(index, index + CHUNK_SIZE)
    const args = ['push', '--atomic', 'origin']
    for (const { branch, sha } of chunk) {
      args.push(`--force-with-lease=refs/heads/${branch}:${sha}`)
    }
    for (const { branch } of chunk) args.push(`:refs/heads/${branch}`)

    const result = spawnSync('git', args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    if (result.status !== 0) {
      throw new Error(`Falló el bloque ${index / CHUNK_SIZE + 1}: ${result.stderr.trim()}`)
    }
    process.stdout.write(`Eliminadas ${Math.min(index + CHUNK_SIZE, candidates.length)}/${candidates.length}\n`)
  }
}

const manifest = option('--manifest', DEFAULT_MANIFEST)
const expectedCount = Number(option('--expected-count'))
const recoveryRef = option('--recovery-ref', DEFAULT_RECOVERY_REF)
const recoverySha = option('--recovery-sha', DEFAULT_RECOVERY_SHA)
const execute = process.argv.includes('--execute')
const candidates = readCandidates(manifest)

if (!Number.isInteger(expectedCount) || expectedCount <= 0) {
  throw new Error('--expected-count debe ser un entero positivo')
}

if (execute) {
  if (process.env.GITHUB_ACTIONS !== 'true') {
    throw new Error('La ejecución destructiva solo está permitida dentro de GitHub Actions')
  }
  if (process.env.GITHUB_REPOSITORY !== EXPECTED_REPOSITORY) {
    throw new Error(`Repositorio no autorizado: ${process.env.GITHUB_REPOSITORY || '(vacío)'}`)
  }
  if (process.env.GITHUB_REF !== 'refs/heads/main') {
    throw new Error(`La limpieza solo puede ejecutarse desde main: ${process.env.GITHUB_REF || '(vacío)'}`)
  }
}

assertSafe(candidates, expectedCount, recoveryRef, recoverySha)

if (execute) {
  deleteCandidates(candidates)
  const remaining = remoteBranches()
  const undeleted = candidates.filter(({ branch }) => remaining.has(branch))
  if (undeleted.length) throw new Error(`Postflight fallido: quedan ${undeleted.length} ramas del manifiesto`)
}

const summary = [
  '## Limpieza de ramas',
  '',
  `- modo: ${execute ? 'ejecución' : 'simulación'}`,
  `- candidatas verificadas: ${candidates.length}`,
  `- eliminadas: ${execute ? candidates.length : 0}`,
  `- recuperación: ${recoveryRef} @ ${recoverySha}`,
].join('\n')

process.stdout.write(`${summary}\n`)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`)
