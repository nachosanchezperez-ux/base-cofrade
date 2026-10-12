import { buildIntegrityContext } from './context.js'
import { coreChecks } from './checks/core.js'
import { musicChecks } from './checks/music.js'
import { agendaChecks } from './checks/agenda.js'
import { SEVERITIES } from './model.js'

export const INTEGRITY_CHECKS = [...coreChecks, ...musicChecks, ...agendaChecks]

const SEVERITY_ORDER = Object.fromEntries(SEVERITIES.map((severity, index) => [severity, index]))

// Ejecuta todas las comprobaciones sobre una instantánea. Nunca escribe datos.
// Una comprobación que falla no detiene las demás: se informa como no evaluada.
export function runIntegrityChecks(snapshot, options = {}) {
  const ctx = buildIntegrityContext(snapshot, options)
  const checks = options.checks || INTEGRITY_CHECKS
  const results = []
  const issues = []

  for (const check of checks) {
    if (check.requires === 'full' && ctx.mode !== 'full') {
      results.push({ id: check.id, area: check.area, title: check.title, severity: check.severity, status: 'skipped', note: 'Requiere lectura completa (clave secreta).', count: 0 })
      continue
    }
    try {
      const found = check.run(ctx) || []
      issues.push(...found)
      results.push({ id: check.id, area: check.area, title: check.title, severity: check.severity, status: 'ok', count: found.length })
    } catch (error) {
      results.push({ id: check.id, area: check.area, title: check.title, severity: check.severity, status: 'failed', note: error instanceof Error ? error.message : String(error), count: 0 })
    }
  }

  issues.sort((a, b) => (
    SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    || a.area.localeCompare(b.area)
    || a.check.localeCompare(b.check)
    || a.entityName.localeCompare(b.entityName, 'es')
  ))

  const summary = Object.fromEntries(SEVERITIES.map((severity) => [severity, issues.filter((issue) => issue.severity === severity).length]))

  return {
    generatedAt: options.generatedAt || new Date().toISOString(),
    mode: ctx.mode,
    today: ctx.today,
    seasonYear: ctx.seasonYear,
    counts: Object.fromEntries(Object.entries(snapshot).filter(([, value]) => Array.isArray(value)).map(([name, value]) => [name, value.length])),
    summary,
    checks: results,
    issues,
  }
}
