// «Hoy en Hilo Cofrade» · textos de la ficha de descubrimiento del día.
//
// Antes la tarjeta decía «Hilo para descubrir» (nombre interno del módulo) y el
// titular era solo el nombre de la entidad («San Bernardo»), con el dato
// interesante en letra pequeña. Ahora el rótulo dice el tema y el titular cuenta
// el dato: «Patrimonio musical · Las 19 marchas dedicadas a San Bernardo».
// Sin dependencias: se usa en servidor y en pruebas.

import { plural } from './plural.js'

// Los pasos y andas se nombran en minúscula dentro de una frase:
// «la historia del paso de palio de…», «de las andas de plata de…».
function phraseName(name, rootType) {
  const value = String(name || '').trim()
  if (rootType !== 'step') return value
  return value.replace(/^(Paso|Andas|Palio|Canastilla)\b/, (word) => word.toLowerCase())
}

// Preposición + nombre, con contracción y artículo cuando hacen falta:
// «a El Museo» → «al Museo»; «de El Museo» → «del Museo»;
// «de paso de palio…» → «del paso de palio…»; «de andas…» → «de las andas…».
export function withPreposition(preposition, name, rootType) {
  const value = phraseName(name, rootType)
  if (!value) return ''
  const contracted = { a: 'al', de: 'del' }[preposition]
  if (contracted && /^El\s/.test(value)) return `${contracted} ${value.slice(3)}`
  // Imágenes que se nombran con artículo: «del Santísimo Cristo de la Sed»,
  // «del Señor de la Sagrada Cena» (pero «de Nuestra Señora…», «de María…»).
  if (rootType === 'image' && /^(Santísimo|Señor|Cristo|Santo|Niño|Dulce Nombre|Sagrado|Divino)\b/.test(value)) {
    return `${contracted || `${preposition} el`} ${value}`
  }
  if (rootType === 'step') {
    if (/^(paso|palio)\b/i.test(value)) return `${contracted || `${preposition} el`} ${value}`
    if (/^andas\b/i.test(value)) return `${preposition} las ${value}`
    if (/^canastilla\b/i.test(value)) return `${preposition} la ${value}`
  }
  return `${preposition} ${value}`
}

const count = (value) => Number(value) || 0

// Título con artículo y número: «Las 19 marchas…», «La marcha…».
function counted(n, [one, many], rest) {
  return n === 1 ? `${one} ${rest}` : `${many.replace('{n}', n)} ${rest}`
}

export function discoveryCopy(row) {
  if (!row) return null
  const n = count(row.relation_count)
  const s = count(row.secondary_count)
  const name = row.root_name
  const type = row.root_type
  const a = withPreposition('a', name, type)
  const de = withPreposition('de', name, type)

  switch (row.activity_kind) {
    case 'musical_heritage': {
      const title = n
        ? counted(n, ['La marcha dedicada', 'Las {n} marchas dedicadas'], a)
        : counted(s, ['La pieza dedicada', 'Las {n} piezas dedicadas'], a)
      const summary = n && s
        ? `Y ${plural(s, 'pieza más', 'piezas más')}, con sus autores y grabaciones.`
        : 'Con sus autores, en su ficha.'
      return { label: 'Patrimonio musical', title, summary }
    }
    case 'posters':
      return { label: 'Cartelería', title: counted(n, ['El cartel', 'Los {n} carteles'], de), summary: 'Con sus autores.' }
    case 'band_brotherhoods':
      // Los nombres de banda no admiten bien artículo o preposición delante
      // («la Banda del Sol», «Las Cigarreras»): van al principio.
      return {
        label: 'Música',
        title: `${name}: ${n === 1 ? 'la hermandad que acompaña' : `las ${n} hermandades que acompaña`}`,
        summary: 'Con su relación musical documentada.',
      }
    case 'step_personnel':
      return {
        label: 'Capataces',
        title: s ? `Quién manda los pasos ${de}` : counted(n, ['El paso', 'Los {n} pasos'], de),
        summary: s
          ? `${plural(n, 'paso', 'pasos')} y ${plural(s, 'capataz actual', 'capataces actuales')}.`
          : 'Con sus capataces.',
      }
    case 'titularity':
      return { label: 'Titulares', title: counted(n, ['El titular', 'Los {n} titulares'], de), summary: 'Con sus imágenes y advocaciones.' }
    case 'brotherhood_steps':
      return { label: 'Pasos', title: counted(n, ['El paso', 'Los {n} pasos'], de), summary: 'Con su patrimonio y acompañamiento musical.' }
    case 'discography':
      return {
        label: 'Discografía',
        title: `${name}: ${plural(n, 'disco', 'discos')}${s ? ` y ${plural(s, 'grabación', 'grabaciones')}` : ''}`,
        summary: 'Su discografía completa, marcha a marcha.',
      }
    case 'image_authorship':
      return { label: 'Imaginería', title: `La autoría ${de}`, summary: n === 1 ? 'Su autor, con sus otras obras.' : `Sus ${n} autores, con sus otras obras.` }
    case 'step_phases':
      return { label: 'Pasos', title: `La historia ${de}`, summary: `${plural(n, 'fase documentada', 'fases documentadas')}, con talleres y autores.` }
    case 'heritage_interventions':
      return {
        label: 'Patrimonio',
        title: type === 'brotherhood'
          ? counted(n, ['La intervención en el patrimonio', 'Las {n} intervenciones en el patrimonio'], de)
          : counted(n, ['La intervención sobre', 'Las {n} intervenciones sobre'], withPreposition('sobre', name, type).replace(/^sobre /, '')),
        summary: s ? `Con ${plural(s, 'autor documentado', 'autores documentados')}.` : 'Con su cronología.',
      }
    case 'heritage_updates':
      return { label: 'Patrimonio', title: `Novedades en el patrimonio ${de}`, summary: `${plural(n, 'actuación nueva', 'actuaciones nuevas')} en su cronología.` }
    default:
      return null
  }
}

// Tarjeta de reserva (hilos de «Últimos hilos incorporados»): el rótulo es el
// último tramo de su relación («Banda → hermandades» → «Hermandades»).
export function threadTopicLabel(relation) {
  const last = String(relation || '').split('→').map((part) => part.trim()).filter(Boolean).pop() || ''
  return last ? last.charAt(0).toUpperCase() + last.slice(1) : 'Para descubrir'
}
