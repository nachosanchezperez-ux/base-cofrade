// Presentación de la ficha de una Procesión de Gloria: funciones puras que
// convierten los textos y puntos ya publicados en piezas fáciles de leer en
// el móvil (frases sueltas en vez de un bloque, momentos del recorrido y la
// lista de calles en una línea). No añaden datos.

// Abreviaturas que terminan en punto y no cierran frase.
const ABBREVIATIONS = /(?:\b(?:N\.H\.D|N\.H|D|Dª|Dña|Sr|Sra|Sto|Sta|Stma|Ntra|Ntro|Mons|Excmo|Rvdo|P|Fr|S|nº|núm|aprox|etc|pág|tel|C\/)\.)$/i

// «Frase uno. Frase dos.» → ['Frase uno.', 'Frase dos.']
export function noteSentences(text = '') {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const parts = clean.split(/(?<=[.!?…])\s+(?=[«"¿¡(A-ZÁÉÍÓÚÑÜ0-9])/u)
  const sentences = []
  for (const part of parts) {
    const previous = sentences[sentences.length - 1]
    if (previous && ABBREVIATIONS.test(previous)) sentences[sentences.length - 1] = `${previous} ${part}`
    else sentences.push(part)
  }
  return sentences.map((sentence) => sentence.trim()).filter(Boolean)
}

// Momentos señalados del recorrido (recepciones, estaciones, misas…): los
// puntos intermedios con nota o marcados como estación. La salida y la entrada
// ya están en la cabecera.
export function routeMoments(points = []) {
  const ordered = (Array.isArray(points) ? points : []).filter((point) => point?.label)
  return ordered
    .slice(1, -1)
    .filter((point) => point.notes || point.type === 'station')
    .map((point) => ({
      id: point.id || `${point.order}-${point.label}`,
      label: point.label,
      time: point.time || '',
      notes: point.notes || '',
    }))
}

// «A → B → C» o «A, B y C» → ['A', 'B', 'C'].
export function routeStreets(summary = '') {
  const clean = String(summary || '').replace(/\s+/g, ' ').trim().replace(/\.$/, '')
  if (!clean) return []
  const parts = clean.includes('→')
    ? clean.split('→')
    : clean.split(/,\s*|\s+y\s+(?=[A-ZÁÉÍÓÚÑ])/u)
  return parts.map((part) => part.trim()).filter(Boolean)
}

// «2026-11-07» → «7 de noviembre de 2026» (fechas de las fuentes).
export function sourceDateLabel(value = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''))
  if (!match) return String(value || '')
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))))
}
