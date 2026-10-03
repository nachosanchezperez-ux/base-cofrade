import { CONTRIBUTION_KINDS } from './config.js'

export function contributionContext(params = {}) {
  const kind = typeof params.kind === 'string' && Object.hasOwn(CONTRIBUTION_KINDS, params.kind) ? params.kind : 'correction'
  let pageUrl = ''
  if (typeof params.page === 'string' && params.page.length <= 2048) {
    try {
      const url = new URL(params.page, 'https://hilocofrade.es')
      if (url.protocol === 'https:' && ['hilocofrade.es', 'www.hilocofrade.es'].includes(url.hostname) && !url.username && !url.password && !url.port) {
        pageUrl = `https://hilocofrade.es${url.pathname}`
      }
    } catch { /* Invalid context is ignored; it grants no authority. */ }
  }
  return { kind, pageUrl }
}
