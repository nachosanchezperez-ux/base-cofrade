function coerceCsvValue(value) {
  const trimmed = value.trim()
  if (trimmed === '') return null
  if (trimmed === 'null') return null
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed) && !/^0\d+/.test(trimmed)) return Number(trimmed)
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try { return JSON.parse(trimmed) } catch { return value }
  }
  return value
}

export function parseCsvRows(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"'
        index += 1
      } else {
        quoted = !quoted
      }
      continue
    }

    if (char === ',' && !quoted) {
      row.push(cell)
      cell = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1
      row.push(cell)
      if (row.some((value) => value.trim() !== '')) rows.push(row)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  if (quoted) throw new Error('El CSV contiene una comilla sin cerrar.')
  row.push(cell)
  if (row.some((value) => value.trim() !== '')) rows.push(row)
  return rows
}

export function csvToImportRecords(text, options = {}) {
  const rows = parseCsvRows(text)
  if (rows.length < 2) throw new Error('El CSV necesita una cabecera y al menos una fila de datos.')

  const headers = rows[0].map((header) => header.trim())
  if (headers.some((header) => !header)) throw new Error('Todas las columnas del CSV necesitan nombre.')
  if (new Set(headers).size !== headers.length) throw new Error('El CSV contiene columnas duplicadas.')

  const table = String(options.table || '').trim()
  if (!table) throw new Error('Selecciona la tabla de destino del CSV.')
  const operation = String(options.operation || 'insert').trim()
  const onConflict = String(options.onConflict || '').replace(/\s+/g, '') || null

  return rows.slice(1).map((values) => {
    const data = {}
    for (let index = 0; index < headers.length; index += 1) data[headers[index]] = coerceCsvValue(values[index] ?? '')
    return { table, operation, on_conflict: onConflict, data, refs: {} }
  })
}

function jsonRecords(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && Array.isArray(payload.records)) return payload.records
  throw new Error('El JSON debe ser un array o un objeto con una propiedad records.')
}

export function parseBulkImportText(text, options = {}) {
  const source = String(text || '').trim()
  if (!source) throw new Error('No hay contenido para importar.')

  const requested = String(options.format || 'auto').toLowerCase()
  const format = requested === 'auto'
    ? (source.startsWith('{') || source.startsWith('[') ? 'json' : 'csv')
    : requested

  if (format === 'json') return { format, records: jsonRecords(JSON.parse(source)) }
  if (format === 'csv') return { format, records: csvToImportRecords(source, options) }
  if (format === 'jsonl' || format === 'ndjson') {
    const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    return { format: 'jsonl', records: lines.map((line, index) => {
      try { return JSON.parse(line) } catch { throw new Error(`JSONL no válido en la línea ${index + 1}.`) }
    }) }
  }

  throw new Error(`Formato «${format}» no compatible.`)
}

export function splitImportPayload(records, options = {}) {
  const maxItems = options.maxItems || 75
  const maxBytes = options.maxBytes || 1_500_000
  const batches = []
  let current = []
  let currentBytes = 0

  for (const record of records) {
    const recordBytes = new TextEncoder().encode(JSON.stringify(record)).length
    if (recordBytes > maxBytes) throw new Error('Hay un registro demasiado grande para enviarlo al servidor.')
    if (current.length && (current.length >= maxItems || currentBytes + recordBytes > maxBytes)) {
      batches.push(current)
      current = []
      currentBytes = 0
    }
    current.push(record)
    currentBytes += recordBytes
  }

  if (current.length) batches.push(current)
  return batches
}
