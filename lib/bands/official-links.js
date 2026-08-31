const PLATFORM_ORDER = new Map([
  ['website', 0],
  ['spotify', 1],
  ['youtube', 2],
  ['apple_music', 3],
  ['facebook', 4],
  ['instagram', 5],
  ['x', 6],
  ['tiktok', 7],
  ['whatsapp', 8],
])

function comparableUrl(value = '') {
  try {
    const url = new URL(value)
    url.hash = ''
    url.pathname = url.pathname.replace(/\/$/, '') || '/'
    return url.toString().replace(/\/$/, '').toLocaleLowerCase('es')
  } catch {
    return String(value || '').trim().replace(/\/$/, '').toLocaleLowerCase('es')
  }
}

export function mergeBandInterestLinks(links = [], band = {}) {
  const merged = links.filter((link) => link?.url).map((link, index) => ({ ...link, _order: index }))
  const directLinks = [
    { id: 'official-website', platform: 'website', url: band.websiteUrl, label: 'Web oficial' },
    { id: 'official-youtube', platform: 'youtube', url: band.youtubeUrl, label: 'YouTube oficial' },
    { id: 'official-instagram', platform: 'instagram', url: band.instagramUrl, label: 'Instagram oficial' },
  ]

  directLinks.forEach((candidate) => {
    if (!candidate.url) return
    const hasPlatform = merged.some((link) => link.platform === candidate.platform)
    const hasUrl = merged.some((link) => comparableUrl(link.url) === comparableUrl(candidate.url))
    if (!hasPlatform && !hasUrl) merged.push({ ...candidate, _order: merged.length })
  })

  return merged
    .sort((first, second) => (
      (PLATFORM_ORDER.get(first.platform) ?? 99) - (PLATFORM_ORDER.get(second.platform) ?? 99)
      || first._order - second._order
    ))
    .map(({ _order, ...link }) => link)
}
