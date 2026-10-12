// Clasificación única de la música de una salida concreta (outing_music_details).
//
// position_code es texto libre: en producción conviven códigos genéricos
// (processional_music) y posicionales (after_step, palio, mystery, behind_glory,
// cross_guide…). Todos los posicionales describen bandas que acompañan el cortejo,
// así que pertenecen al acompañamiento procesional. Solo se separan los momentos
// que no son acompañamiento: música litúrgica, bando anunciador y el código
// `other`, que se usa para notas como «Sin acompañamiento musical».
//
// Antes de este módulo, cada vista aplicaba su propia regla: la ficha de Gloria
// descartaba los códigos fuera de una lista cerrada y la de extraordinarias los
// relegaba a «Otros momentos musicales».

const NON_PROCESSIONAL_SECTIONS = new Map([
  ['liturgical_music', 'liturgical'],
  ['announcement_music', 'announcement'],
  ['other', 'other'],
])

export function outingMusicSection(positionCode = '') {
  const code = String(positionCode || '').trim().toLowerCase()
  return NON_PROCESSIONAL_SECTIONS.get(code) || 'processional'
}

export function isProcessionalOutingMusic(positionCode = '') {
  return outingMusicSection(positionCode) === 'processional'
}
