function normalizedHex(value = '') {
  const hex = String(value || '').trim()
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex.slice(1).split('').map((char) => char + char).join('')}`
  }
  return ''
}

function relativeLuminance(value) {
  const hex = normalizedHex(value)
  if (!hex) return null

  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map((channel) => (
    channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ))

  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2])
}

function darkestColor(colors = [], fallback = '#29272c') {
  const candidates = colors
    .map((color) => ({ color: normalizedHex(color), luminance: relativeLuminance(color) }))
    .filter((item) => item.color && item.luminance !== null)
    .sort((first, second) => first.luminance - second.luminance)

  return candidates[0]?.color || fallback
}

export function resolveBandPageTheme({ primaryColor, secondaryColor, accentColor } = {}) {
  const primary = normalizedHex(primaryColor) || '#63358B'
  const secondary = normalizedHex(secondaryColor) || '#29272C'
  const accent = normalizedHex(accentColor) || primary
  const secondaryLuminance = relativeLuminance(secondary)
  const secondaryIsLight = secondaryLuminance !== null && secondaryLuminance > 0.48

  return {
    primary,
    accent,
    deep: darkestColor([primary, secondary], '#29272C'),
    soft: secondaryIsLight ? secondary : '#F6F4F7',
    secondaryIsLight,
  }
}
