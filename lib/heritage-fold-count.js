import { plural } from './plural.js'

// Recuento del plegable «Patrimonio y estrenos» de la ficha por capítulos:
// «11 piezas · 6 estrenos · 1 restauración». Solo cuenta lo que existe.
export function heritageFoldCount(pieces = [], updates = []) {
  const list = Array.isArray(updates) ? updates : []
  const restorations = list.filter((item) => item?.tipo === 'Restauración').length
  const releases = list.length - restorations
  const pieceCount = Array.isArray(pieces) ? pieces.length : 0
  return [
    pieceCount ? plural(pieceCount, 'pieza', 'piezas') : '',
    releases ? plural(releases, 'estreno', 'estrenos') : '',
    restorations ? plural(restorations, 'restauración', 'restauraciones') : '',
  ].filter(Boolean).join(' · ')
}
