const DEFAULT_BATCH_SIZE = 75
const DEFAULT_ATTEMPTS = 2
const DEFAULT_PAGE_SIZE = 500

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

export async function loadPublicRowsInPages(
  queryPage,
  label,
  { pageSize = DEFAULT_PAGE_SIZE, attempts = DEFAULT_ATTEMPTS } = {}
) {
  const rows = []

  for (let offset = 0; ; offset += pageSize) {
    let page = null
    let lastError = null

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const result = await queryPage(offset, offset + pageSize - 1)
        if (!result.error) {
          page = result.data || []
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

    rows.push(...page)
    if (page.length < pageSize) return rows
  }
}
