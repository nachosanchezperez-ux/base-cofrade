'use server'

import { submitContributionAction } from '../actions'
import { composeRepertoireContribution } from '@/lib/contributions/repertoire-submission'

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

// Compone la aportación de la cruceta y la entrega al flujo seguro de Colabora:
// apertura, campo trampa, origen, ticket, límites, Turnstile, cuarentena y
// auditoría son los mismos. Nada se publica sin revisión editorial.
export async function submitRepertoireContributionAction(previousState, formData) {
  const composed = composeRepertoireContribution((name) => formData.get(name), { today: madridToday() })
  if (composed.error) return { status: 'error', message: composed.error }
  formData.set('contribution_type', 'new_record')
  formData.set('title', composed.title)
  formData.set('description', composed.description)
  formData.set('sources', composed.source || '')
  formData.set('page_url', '')
  return submitContributionAction(previousState, formData)
}
