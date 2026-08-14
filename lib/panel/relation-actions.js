import 'server-only'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

export function formValue(formData, name) {
  return String(formData.get(name) || '').trim()
}

export function requiredValue(formData, name, label) {
  const candidate = formValue(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}

export function uuidValue(formData, name) {
  const candidate = formValue(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

export function optionalDate(formData, name, label) {
  const candidate = formValue(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`${label} no es válida.`)
  }
  return candidate
}

export function normalizedToken(formData, name, {
  fallback = '',
  label = 'El tipo de relación',
  maxLength = 80,
} = {}) {
  const candidate = formValue(formData, name) || fallback
  const normalized = candidate
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  if (!normalized) throw new Error(`${label} es obligatorio.`)
  if (normalized.length > maxLength) throw new Error(`${label} es demasiado largo.`)
  return normalized
}

export function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

export function validateDateOrder(dateFrom, dateTo) {
  if (dateFrom && dateTo && dateTo < dateFrom) {
    throw new Error('La fecha final no puede ser anterior a la fecha inicial.')
  }
}

export function relationalStatus(...entities) {
  return entities.every((entity) => entity?.status === 'published')
    ? 'published'
    : 'draft'
}

export async function writeAudit(supabase, user, entry, context = 'la relación') {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error(`[Hilo Cofrade] No se pudo registrar ${context}`, error)
}
