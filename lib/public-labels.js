// Etiquetas públicas para valores internos de la base de datos. Lo que ve el
// visitante nunca es un código («composer», «documented»): o se traduce o no se
// muestra.

const MARCH_AUTHOR_ROLES = {
  composer: 'Composición',
  adapter: 'Adaptación',
  arranger: 'Arreglo',
  lyricist: 'Letra',
}

// «documented» es lo normal: no hace falta decirlo en cada obra.
const AUTHORSHIP_CERTAINTY = {
  documented: '',
  attributed: 'Atribuida',
  traditional: 'Por tradición',
  unknown: 'Autoría desconocida',
}

const AUTHORSHIP_TYPES = {
  author: 'Autoría',
  anonymous: 'Anónima',
  attributed_to: 'Atribuida',
  circle_of: 'Círculo del autor',
  workshop_of: 'Taller del autor',
  school_of: 'Escuela del autor',
}

export function sentenceCase(value = '') {
  const text = String(value || '').trim()
  return text ? `${text.charAt(0).toLocaleUpperCase('es')}${text.slice(1)}` : ''
}

// Un código interno lleva guion bajo («attributed_to»); una palabra suelta en
// minúscula («escultor») es texto editorial y solo se capitaliza.
function isCode(value) {
  return /^[a-z]+(?:_[a-z]+)+$/.test(String(value || ''))
}

export function marchAuthorRoleLabel(value = '') {
  const key = String(value || '').trim()
  if (key in MARCH_AUTHOR_ROLES) return MARCH_AUTHOR_ROLES[key]
  return isCode(key) ? '' : sentenceCase(key)
}

export function authorshipCertaintyLabel(value = '') {
  const key = String(value || '').trim()
  if (key in AUTHORSHIP_CERTAINTY) return AUTHORSHIP_CERTAINTY[key]
  return isCode(key) ? '' : sentenceCase(key)
}

export function authorshipRoleLabel(value = '') {
  const key = String(value || '').trim()
  if (key in AUTHORSHIP_TYPES) return AUTHORSHIP_TYPES[key]
  if (key in MARCH_AUTHOR_ROLES) return MARCH_AUTHOR_ROLES[key]
  return isCode(key) ? '' : sentenceCase(key)
}
