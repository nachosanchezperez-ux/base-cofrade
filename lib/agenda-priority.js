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

// Acto extraordinario (provisional, 8/11/2026): una coronación canónica o
// pontificia va por delante de todo lo demás en su día, sea culto o salida.
// Se detecta por el título hasta que exista la marca del Panel (fase 2).
export function isExtraordinaryAct(item = {}) {
  return /coronacion (canonica|pontificia)/.test(fold(item.title))
}

// -1 = extraordinario, 0 = principal, 1 = culto. El -1 ordena antes que el 0
// también dentro de las claves de texto «fecha|nivel|hora».
export function agendaPriorityTier(item = {}) {
  if (isExtraordinaryAct(item)) return -1
  if (STREET.has(item.category)) return 0
  if (item.category === 'devotions') return isVenerationAct(item) ? 0 : 1
  return 0
}

export function isSecondaryCult(item = {}) {
  return agendaPriorityTier(item) === 1
}
