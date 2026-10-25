// Prioridad de la Agenda (#agenda-prioridad): dentro de cada día van primero
// los actos de calle y de mayor convocatoria (besamanos y besapiés, certámenes
// y conciertos, procesiones, traslados, rosarios y romerías) y después el resto
// de cultos (triduos, quinarios, novenas, funciones…). La hora ordena dentro de
// cada bloque: nunca se mezcla un día con otro. Módulo puro.

const STREET = new Set(['processions', 'transfers', 'rosaries', 'romeries', 'concerts'])
const fold = (value) => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function isVenerationAct(item = {}) {
  const label = fold(item.categoryLabel || item.title)
  return /besaman|besapi|veneracion/.test(label)
}

// 0 = principal, 1 = culto.
export function agendaPriorityTier(item = {}) {
  if (STREET.has(item.category)) return 0
  if (item.category === 'devotions') return isVenerationAct(item) ? 0 : 1
  return 0
}

export function isSecondaryCult(item = {}) {
  return agendaPriorityTier(item) === 1
}
