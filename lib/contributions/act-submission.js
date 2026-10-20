// «Envía tu acto» (#agenda-envia): un acto de la Agenda enviado por una
// Hermandad o un particular. Se convierte en una aportación normal
// (new_record) con título y explicación estructurados, para que pase por la
// misma seguridad, cuarentena y revisión editorial que el resto de Colabora.
// Módulo puro para probarlo con node --test.

export const ACT_KINDS = [
  'Rosario', 'Procesión de Gloria', 'Procesión extraordinaria', 'Traslado', 'Romería',
  'Triduo', 'Quinario', 'Septenario', 'Novena', 'Besamanos', 'Besapiés', 'Función principal',
  'Vía Crucis', 'Concierto o certamen', 'Otro acto',
]

const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const text = (value, max) => String(value ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)

function longDate(value) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' })
    .format(new Date(`${value}T12:00:00Z`))
}

// get(name) → valor. Devuelve { title, description, source } o { error }.
export function composeActContribution(get, { today = '' } = {}) {
  const kind = text(get('act_kind'), 60)
  const brotherhood = text(get('act_brotherhood'), 160)
  const date = text(get('act_date'), 10)
  const endDate = text(get('act_end_date'), 10)
  const time = text(get('act_time'), 5)
  const place = text(get('act_place'), 160)
  const municipality = text(get('act_municipality'), 80)
  const details = String(get('act_details') ?? '').normalize('NFC').trim().slice(0, 3000)
  const source = text(get('act_source'), 2048)

  if (!ACT_KINDS.includes(kind)) return { error: 'Elige qué tipo de acto es.' }
  if (brotherhood.length < 3) return { error: 'Indica la Hermandad o entidad que lo organiza.' }
  if (!DATE.test(date)) return { error: 'Indica la fecha del acto.' }
  if (today && date < today) return { error: 'La fecha ya ha pasado: aquí solo recogemos actos próximos.' }
  if (endDate && (!DATE.test(endDate) || endDate < date)) return { error: 'La fecha final no puede ser anterior a la inicial.' }
  if (time && !TIME.test(time)) return { error: 'La hora debe tener el formato 20:30.' }
  if (municipality.length < 2) return { error: 'Indica la localidad.' }

  const when = `${longDate(date)}${endDate && endDate !== date ? ` al ${longDate(endDate)}` : ''}${time ? ` · ${time} h` : ''}`
  const title = `Acto para la Agenda: ${kind} · ${brotherhood}`.slice(0, 140)
  const description = [
    'Propuesta de acto para la Agenda Cofrade.',
    `Tipo: ${kind}`,
    `Organiza: ${brotherhood}`,
    `Fecha: ${when}`,
    `Lugar: ${[place, municipality].filter(Boolean).join(', ')}`,
    details ? `Detalles: ${details}` : '',
  ].filter(Boolean).join('\n')
  return { title, description, source }
}
