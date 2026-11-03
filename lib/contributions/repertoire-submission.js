// «Envía la cruceta»: el repertorio que una banda interpretó en una salida,
// enviado por la propia banda, la Hermandad o un aficionado. Igual que «Envía tu
// acto», se convierte en una aportación normal (new_record) para que pase por la
// misma seguridad, cuarentena y revisión editorial de Colabora. La carga en
// Hilo Cofrade es siempre manual: no se lee la lámina automáticamente.
// Módulo puro para probarlo con node --test.

export const REPERTOIRE_OUTING_KINDS = [
  'Estación de Penitencia', 'Procesión de Gloria', 'Procesión extraordinaria', 'Traslado',
  'Rosario', 'Corpus o Sacramental', 'Otra salida',
]

const DATE = /^\d{4}-\d{2}-\d{2}$/
const text = (value, max) => String(value ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)

function longDate(value) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' })
    .format(new Date(`${value}T12:00:00Z`))
}

// get(name) → valor. Devuelve { title, description, source } o { error }.
export function composeRepertoireContribution(get, { today = '' } = {}) {
  const brotherhood = text(get('rep_brotherhood'), 160)
  const band = text(get('rep_band'), 160)
  const date = text(get('rep_date'), 10)
  const kind = text(get('rep_kind'), 60)
  const municipality = text(get('rep_municipality'), 80)
  const details = String(get('rep_details') ?? '').normalize('NFC').trim().slice(0, 3000)
  const source = text(get('rep_source'), 2048)

  if (brotherhood.length < 3) return { error: 'Indica la Hermandad de la salida.' }
  if (band.length < 3) return { error: 'Indica la banda que interpretó el repertorio.' }
  if (!DATE.test(date)) return { error: 'Indica la fecha de la salida.' }
  if (today && date > today) return { error: 'La salida todavía no se ha celebrado: la cruceta se envía después.' }
  if (kind && !REPERTOIRE_OUTING_KINDS.includes(kind)) return { error: 'Elige un tipo de salida de la lista.' }

  const title = `Cruceta musical: ${brotherhood} · ${band}`.slice(0, 140)
  const description = [
    'Propuesta de cruceta musical (repertorio interpretado).',
    `Hermandad: ${brotherhood}`,
    `Banda: ${band}`,
    `Fecha: ${longDate(date)}`,
    kind ? `Salida: ${kind}` : '',
    municipality ? `Localidad: ${municipality}` : '',
    details ? `Detalles: ${details}` : '',
  ].filter(Boolean).join('\n')
  return { title, description, source }
}
