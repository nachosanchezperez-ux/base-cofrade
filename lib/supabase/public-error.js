export function publicErrorMessage(error) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (!error || typeof error !== 'object') return String(error)

  const details = [error.message, error.details, error.hint, error.code]
    .map((value) => String(value || '').trim())
    .filter(Boolean)

  if (details.length) return [...new Set(details)].join(' · ')

  try {
    return JSON.stringify(error)
  } catch {
    return 'Error no serializable'
  }
}

export function isMissingPublicSupabaseConfig(error) {
  return /faltan? (?:las variables p[uú]blicas|la configuraci[oó]n p[uú]blica) de supabase/i.test(
    publicErrorMessage(error)
  )
}
