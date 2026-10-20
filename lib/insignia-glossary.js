// «Qué es» (Tarea 15.1 · prototipo): definición general de un TIPO de insignia,
// reutilizable en cualquier Hermandad. No describe ninguna pieza concreta: cómo
// reconocer cada pieza («look») es un dato propio, verificado en su fuente.
// Borrador editorial pendiente de revisión: Hilo Cofrade aún no tiene
// vocabulario; la propuesta es llevarlo al Panel (docs/cortejo-completo-propuesta.md).

const ENTRIES = [
  { key: 'cruz-guia', test: /cruz de gu[ií]a/i, name: 'Cruz de Guía', text: 'Abre la cofradía: detrás de ella empieza el cortejo.' },
  { key: 'cruz-parroquial', test: /cruz parroquial/i, name: 'Cruz parroquial', text: 'Representa a la parroquia dentro del cortejo.' },
  { key: 'senatus', test: /senatus/i, name: 'Senatus', text: 'Evoca la autoridad romana que juzgó a Cristo. Suele llevar las siglas S.P.Q.R., «el Senado y el pueblo romano».' },
  { key: 'simpecado', test: /simpecado/i, name: 'Simpecado', text: 'Insignia mariana con la imagen de la Virgen. Su nombre recuerda la defensa de la Inmaculada Concepción: «sin pecado».' },
  { key: 'estandarte', test: /estandarte/i, name: 'Estandarte', text: 'Insignia principal de la Hermandad, con su escudo: la representa como corporación.' },
  { key: 'libro-reglas', test: /libro de reglas/i, name: 'Libro de Reglas', text: 'Contiene las Reglas, las normas por las que se rige la Hermandad.' },
  { key: 'guion', test: /gui[oó]n/i, name: 'Guion', text: 'Insignia sobre asta que representa una devoción, un título o una corporación vinculada a la Hermandad.' },
  { key: 'banderin', test: /bander[ií]n/i, name: 'Banderín', text: 'Insignia de paño que identifica una advocación, una obra o un grupo de la Hermandad.' },
  { key: 'bandera', test: /bandera/i, name: 'Bandera', text: 'Paño grande sobre asta con una cruz o un emblema de la Hermandad. La escoltan hermanos con varas.' },
  { key: 'bocinas', test: /bocinas?/i, name: 'Bocinas', text: 'Antiguos instrumentos de aviso, hoy simbólicos, con paños bordados.' },
]

export function insigniaType(label = '') {
  return ENTRIES.find((entry) => entry.test.test(String(label || ''))) || null
}
