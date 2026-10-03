import { createHash } from 'node:crypto'

function comparableText(value) {
  return String(value || '').normalize('NFKC').replace(/\s+/gu, ' ').trim().toLocaleLowerCase('es-ES')
}

export function contributionSubmissionHash(payload, attachments) {
  const normalized = JSON.stringify({
    type: payload.contributionType,
    title: comparableText(payload.title),
    description: comparableText(payload.description),
    pageUrl: payload.pageUrl,
    sources: [...new Set(payload.sources)].sort(),
    attachments: [...new Set(attachments.map((attachment) => attachment.sha256))].sort(),
  })
  return createHash('sha256').update(normalized).digest('hex')
}
