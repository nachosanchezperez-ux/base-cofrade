import { AREA_LABELS, SEVERITIES, SEVERITY_LABELS } from './model.js'

const MAX_ROWS_PER_CHECK = 30

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim() || '—'
}

function shortId(id) {
  const value = String(id || '')
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value) ? value.slice(0, 8) : value
}

// Informe legible (Markdown) para el propietario y para el resumen de GitHub Actions.
// El JSON completo conserva todas las filas y los identificadores enteros.
export function renderIntegrityMarkdown(result, { title = 'Hilo Cofrade · Informe de integridad', maxRows = MAX_ROWS_PER_CHECK } = {}) {
  const lines = []
  lines.push(`# ${title}`, '')
  lines.push(`**Generado:** ${result.generatedAt} · **Fecha de referencia:** ${result.today} (Madrid) · **Temporada musical:** ${result.seasonYear} · **Modo:** ${result.mode === 'full' ? 'lectura completa' : 'lectura pública'}`, '')
  lines.push('Solo lectura: este informe no modifica ningún dato.', '')

  lines.push('| Nivel | Incidencias |', '|---|---|')
  for (const severity of SEVERITIES) lines.push(`| ${SEVERITY_LABELS[severity]} | ${result.summary[severity] || 0} |`)
  lines.push('')

  const skipped = result.checks.filter((check) => check.status !== 'ok')
  if (skipped.length) {
    lines.push('**Comprobaciones no evaluadas:**', '')
    for (const check of skipped) lines.push(`- \`${check.id}\` · ${check.status === 'skipped' ? 'omitida' : 'fallida'}: ${check.note}`)
    lines.push('')
  }

  for (const severity of SEVERITIES) {
    const ofSeverity = result.issues.filter((issue) => issue.severity === severity)
    if (!ofSeverity.length) continue
    lines.push(`## ${SEVERITY_LABELS[severity]} (${ofSeverity.length})`, '')
    const byCheck = new Map()
    for (const issue of ofSeverity) {
      const list = byCheck.get(issue.check) || []
      list.push(issue)
      byCheck.set(issue.check, list)
    }
    for (const [checkId, issues] of byCheck) {
      const [first] = issues
      lines.push(`### ${first.title} · ${AREA_LABELS[first.area] || first.area} (${issues.length})`, '')
      lines.push(`\`${checkId}\` · **Posible solución:** ${first.fix}`, '')
      lines.push('| Entidad | Nombre | ID | Motivo |', '|---|---|---|---|')
      for (const issue of issues.slice(0, maxRows)) {
        lines.push(`| ${cell(issue.entityLabel)} | ${cell(issue.entityName)} | \`${cell(shortId(issue.entityId))}\` | ${cell(issue.reason)} |`)
      }
      if (issues.length > maxRows) lines.push('', `… y ${issues.length - maxRows} más en el JSON completo.`)
      lines.push('')
    }
  }

  lines.push('## Comprobaciones ejecutadas', '')
  lines.push('| Comprobación | Área | Nivel base | Resultado |', '|---|---|---|---|')
  for (const check of result.checks) {
    const outcome = check.status === 'ok' ? String(check.count) : check.status === 'skipped' ? 'omitida' : 'fallida'
    lines.push(`| \`${check.id}\` · ${cell(check.title)} | ${cell(AREA_LABELS[check.area])} | ${SEVERITY_LABELS[check.severity]} | ${outcome} |`)
  }
  lines.push('')
  return lines.join('\n')
}

// Código de salida para automatizaciones: 0 salvo que se pida fallar por nivel.
export function integrityExitCode(result, failOn = 'never') {
  if (failOn === 'never') return 0
  if (failOn === 'error') return result.summary.error ? 1 : 0
  if (failOn === 'warning') return result.summary.error || result.summary.warning ? 1 : 0
  throw new Error(`Valor de --fail-on no válido: ${failOn} (usa never, error o warning)`)
}
