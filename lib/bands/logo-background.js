export const LOGO_BACKGROUND_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/

export function isValidLogoBackgroundColor(value) {
  return LOGO_BACKGROUND_COLOR_PATTERN.test(String(value || '').trim())
}

export function normalizeLogoBackgroundColor(value) {
  const candidate = String(value || '').trim()
  return isValidLogoBackgroundColor(candidate) ? candidate.toUpperCase() : ''
}

export function isLightLogoBackgroundColor(value) {
  const color = normalizeLogoBackgroundColor(value)
  if (!color) return false

  const [red, green, blue] = [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16))
  const luminance = ((red * 299) + (green * 587) + (blue * 114)) / 255000
  return luminance >= 0.72
}
