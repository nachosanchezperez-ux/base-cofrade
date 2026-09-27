// One public palette contract for a brotherhood and its related images/steps.
// Keep the existing brotherhood accent and contrast rules: this is inheritance,
// not a redesign of the palettes already chosen by the editor.
export const DEFAULT_BROTHERHOOD_PALETTE = Object.freeze({
  primario: '#153B69',
  secundario: '#A71930',
  claro: '#FFFFFF',
  oscuro: '#0D2949',
  sobreSecundario: '#FFFFFF',
})

const COLOR_NAME_FALLBACKS = { blanco: '#FFFFFF', celeste: '#66B8D4' }
const HEX = /^#[0-9a-f]{6}$/i

function normalized(value = '') {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function colorValue(color) {
  const hex = String(color?.hex_value || '').trim()
  return HEX.test(hex) ? hex : COLOR_NAME_FALLBACKS[normalized(color?.color_name)] || null
}

function darkenHex(hex) {
  return `#${[1, 3, 5].map((position) => (
    Math.round(Number.parseInt(hex.slice(position, position + 2), 16) * 0.52)
      .toString(16).padStart(2, '0')
  )).join('')}`
}

function contrastText(hex) {
  const [red, green, blue] = [1, 3, 5].map((position) => Number.parseInt(hex.slice(position, position + 2), 16))
  return ((red * 299) + (green * 587) + (blue * 114)) / 1000 > 155 ? '#153B50' : '#FFFFFF'
}

export function resolveBrotherhoodPalette(colors = [], fallback = {}) {
  const base = { ...DEFAULT_BROTHERHOOD_PALETTE }
  for (const key of Object.keys(base)) {
    if (HEX.test(fallback?.[key] || '')) base[key] = fallback[key]
  }

  const rows = (Array.isArray(colors) ? colors : [])
    .filter((color) => color && (!color.status || color.status === 'published'))
    .slice()
    .sort((a, b) => (Number(a.sort_order || 0) - Number(b.sort_order || 0))
      || String(a.id || '').localeCompare(String(b.id || '')))

  if (!rows.length) return { ...base, nombres: [...(fallback?.nombres || [])] }

  const primaryRow = rows.find((color) => color.color_role === 'primary') || rows[0]
  const whiteRow = rows.find((color) => (
    normalized(color.color_name) === 'blanco' || color.hex_value?.toUpperCase() === '#FFFFFF'
  ))
  const accentRow = rows.find((color) => (
    color.color_role !== 'primary' && normalized(color.color_name) !== 'blanco'
  ))
  const identityRow = rows.find((color) => color.color_role === 'identity' && HEX.test(color.hex_value || ''))
  const primary = colorValue(primaryRow) || base.primario
  const accent = colorValue(accentRow) || primary

  return {
    primario: primary,
    secundario: accent,
    claro: identityRow?.hex_value || colorValue(whiteRow) || base.claro,
    oscuro: darkenHex(primary),
    sobreSecundario: contrastText(accent),
    nombres: rows.map((color) => color.color_name).filter(Boolean),
  }
}
