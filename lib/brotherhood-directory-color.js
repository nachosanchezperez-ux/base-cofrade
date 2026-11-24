// Color de cada Hermandad para las tarjetas del directorio (24/11/2026).
// Primero el color «primary»; si no hay, el primero de su paleta. Los colores
// claros pasan a azul marino para que el texto blanco y la franja contrasten.
import { accentColor } from './holy-week-programme.js'

const ROLE_ORDER = { primary: 0, identity: 1, secondary: 2, accent: 3 }

export function directoryColorMap(rows = []) {
  const best = new Map()
  for (const row of rows) {
    if (!row?.brotherhood_entity_id || !/^#?[0-9a-f]{6}$/i.test(String(row.hex_value || '').trim())) continue
    const rank = [ROLE_ORDER[row.color_role] ?? 9, Number(row.sort_order) || 999]
    const current = best.get(row.brotherhood_entity_id)
    if (!current || rank[0] < current.rank[0] || (rank[0] === current.rank[0] && rank[1] < current.rank[1])) {
      best.set(row.brotherhood_entity_id, { rank, hex: row.hex_value })
    }
  }
  return new Map([...best].map(([id, { hex }]) => [id, accentColor(hex)]))
}

