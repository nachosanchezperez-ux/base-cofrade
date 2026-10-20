// Qué es cada insignia (Tarea 15 · prototipo): definiciones generales, válidas
// para cualquier cofradía, para que quien ve pasar el cortejo sepa qué está
// viendo. No son datos de ninguna Hermandad. Borrador editorial: Hilo Cofrade
// aún no tiene glosario; la propuesta es llevarlo al Panel como vocabulario.

const ENTRIES = [
  { key: 'cruz-guia', test: /cruz de gu[ií]a/i, name: 'Cruz de Guía', text: 'Abre la cofradía: detrás de ella empieza el cortejo.' },
  { key: 'cruz-parroquial', test: /cruz parroquial/i, name: 'Cruz parroquial', text: 'Cruz de la parroquia. En muchas cofradías encabeza el cortejo del paso de palio.' },
  { key: 'senatus', test: /senatus/i, name: 'Senatus', text: 'Insignia de origen romano; suele llevar las siglas S.P.Q.R. del Senado de Roma y recuerda el poder romano en la Pasión.' },
  { key: 'simpecado', test: /simpecado/i, name: 'Simpecado', text: 'Insignia mariana con una imagen o pintura de la Virgen. Su nombre recuerda la defensa de la Inmaculada Concepción, «sin pecado».' },
  { key: 'estandarte', test: /estandarte/i, name: 'Estandarte', text: 'Insignia principal de la Hermandad, con su escudo: la representa como corporación.' },
  { key: 'libro-reglas', test: /libro de reglas/i, name: 'Libro de Reglas', text: 'Guarda las Reglas, las normas por las que se rige la Hermandad.' },
  { key: 'guion', test: /gui[oó]n/i, name: 'Guion', text: 'Insignia sobre asta y remate que representa una devoción, un título o una corporación vinculada a la Hermandad.' },
  { key: 'banderin', test: /bander[ií]n/i, name: 'Banderín', text: 'Insignia de paño colgante que identifica una advocación, un grupo o una obra de la Hermandad.' },
  { key: 'bandera', test: /bandera/i, name: 'Bandera', text: 'Paño grande sobre asta con la cruz o un emblema de la Hermandad; la escoltan hermanos con varas.' },
  { key: 'bocinas', test: /bocinas?/i, name: 'Bocinas', text: 'Antiguos instrumentos de aviso, hoy simbólicos, de metal y con paños bordados.' },
]

export function insigniaType(label = '') {
  return ENTRIES.find((entry) => entry.test.test(String(label || ''))) || null
}

// Primera frase de los materiales como pista para reconocer la pieza en la calle.
export function recognitionHint(materials = '') {
  const text = String(materials || '').trim()
  if (!text) return ''
  return text.split(/;\s*/)[0]
}
