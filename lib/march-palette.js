import { resolveBrotherhoodPalette } from './brotherhood-palette.js'

// Paleta de Hilo para una marcha sin entidad propia de la que heredar color.
export const DEFAULT_MARCH_PALETTE = Object.freeze({
  primario: '#102943',
  secundario: '#C99F49',
  oscuro: '#08131F',
  sobreSecundario: '#102943',
  source: null,
})

const HEX = /^#[0-9a-f]{6}$/i
const LIGHT_LUMA = 140

function luma(hex) {
  const [red, green, blue] = [1, 3, 5].map((position) => Number.parseInt(hex.slice(position, position + 2), 16))
  return ((red * 299) + (green * 587) + (blue * 114)) / 1000
}

function darken(hex, factor = 0.52) {
  return `#${[1, 3, 5].map((position) => (
    Math.round(Number.parseInt(hex.slice(position, position + 2), 16) * factor).toString(16).padStart(2, '0')
  )).join('')}`.toUpperCase()
}

// La ficha pinta texto blanco sobre el color principal y usa ese color en los
// enlaces sobre blanco. Con un principal claro (celeste, blanco, merino…) se
// usa su versión oscurecida para conservar el tono sin perder contraste.
export function legibleMarchPalette(palette) {
  const primary = HEX.test(palette?.primario || '') ? palette.primario : DEFAULT_MARCH_PALETTE.primario
  if (luma(primary) <= LIGHT_LUMA) return { ...palette, primario: primary, oscuro: HEX.test(palette?.oscuro || '') ? palette.oscuro : darken(primary) }
  const deeper = darken(primary, luma(primary) > 200 ? 0.4 : 0.52)
  return { ...palette, primario: deeper, oscuro: darken(deeper, 0.6) }
}

/**
 * Color de la ficha de Marcha (decisión 19/10/2026: «color de la marcha
 * heredado de su hermandad o de su banda»).
 *
 * Orden de herencia, siempre con entidades publicadas:
 *   1. la primera dedicatoria a una Hermandad con paleta publicada;
 *   2. la primera dedicatoria a una Imagen cuya Hermandad tiene paleta;
 *   3. la banda que la estrenó, si tiene color propio;
 *   4. la paleta de Hilo.
 *
 * Es una función pura: la consulta vive en lib/supabase/public-marches.js.
 */
export function selectMarchPalette({
  dedications = [],
  entityById = new Map(),
  imageOwnersById = new Map(),
  colorsByBrotherhood = new Map(),
  premiereBand = null,
} = {}) {
  const published = (id) => entityById.get(id)?.status === 'published'
  const typeOf = (id) => entityById.get(id)?.entity_type
  const hasColors = (id) => (colorsByBrotherhood.get(id) || []).length > 0
  const fromBrotherhood = (id) => legibleMarchPalette({
    ...resolveBrotherhoodPalette(colorsByBrotherhood.get(id)),
    source: { kind: 'brotherhood', id },
  })

  const ids = dedications.map((item) => item?.dedicatee_entity_id).filter(Boolean)

  const direct = ids.find((id) => typeOf(id) === 'brotherhood' && published(id) && hasColors(id))
  if (direct) return fromBrotherhood(direct)

  for (const imageId of ids.filter((id) => typeOf(id) === 'image' && published(id))) {
    const owner = (imageOwnersById.get(imageId) || []).find((id) => published(id) && hasColors(id))
    if (owner) return fromBrotherhood(owner)
  }

  const primary = String(premiereBand?.primary_color || '').trim()
  if (HEX.test(primary)) {
    const secondary = String(premiereBand?.secondary_color || '').trim()
    const rows = [
      { id: '1', color_role: 'primary', hex_value: primary, sort_order: 0 },
      ...(HEX.test(secondary) && secondary.toUpperCase() !== primary.toUpperCase()
        ? [{ id: '2', color_role: 'secondary', hex_value: secondary, sort_order: 1 }]
        : []),
    ]
    return legibleMarchPalette({ ...resolveBrotherhoodPalette(rows), source: { kind: 'band', id: premiereBand.entity_id } })
  }

  return { ...DEFAULT_MARCH_PALETTE }
}
