// Concordancia de número para contadores visibles («1 paso», «2 pasos»).
// Sin dependencias: se puede importar desde servidor, cliente y pruebas.

function isOne(count) {
  return Number(count) === 1
}

// Solo la palabra: pluralWord(1, 'marcha', 'marchas') → 'marcha'.
export function pluralWord(count, singular, pluralForm) {
  return isOne(count) ? singular : pluralForm
}

// Cifra y palabra: plural(2, 'paso', 'pasos') → '2 pasos'.
export function plural(count, singular, pluralForm) {
  return `${count} ${pluralWord(count, singular, pluralForm)}`
}
