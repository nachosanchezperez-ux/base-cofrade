const DEFAULT_BATCH_SIZE = 75
const DEFAULT_ATTEMPTS = 2

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function errorMessage(error) {
  if (!error) return 'Error desconocido'
  return error.message || String(error)
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function loadPublicRowsInBatches(
  values,
  queryBatch,
  label,
  { batchSize = DEFAULT_BATCH_SIZE, attempts = DEFAULT_ATTEMPTS } = {}
) {
  const ids = unique(values)
  if (!ids.length) return []

  const rows = []
  for (let offset = 0; offset < ids.length; offset += batchSize) {
    const batch = ids.slice(offset, offset + batchSize)
    let lastError = null

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const result = await queryBatch(batch)
        if (!result.error) {
          rows.push(...(result.data || []))
          lastError = null
          break
        }

        lastError = result.error
      } catch (error) {
        lastError = error
      }

      if (attempt < attempts) await wait(100 * attempt)
    }

    if (lastError) throw new Error(`${label}: ${errorMessage(lastError)}`)
  }

  return rows
}
